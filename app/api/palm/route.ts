// app/api/palm/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { sql, eq } from "drizzle-orm";
import { getUser } from "@/auth";
import { db } from "@/index";
import { users } from "@/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
/*                     🔥 CONFIGURATION (UNCHANGED)                           */
/* -------------------------------------------------------------------------- */

const modalApiKey = process.env.MODAL_API_KEY;
const modalUrl = process.env.MODAL_API_URL;
const modalModel = process.env.MODAL_VISION_MODEL || "Qwen/Qwen3.6-27B";

const modalClient =
  modalUrl && modalApiKey
    ? new OpenAI({
        baseURL: modalUrl,
        apiKey: modalApiKey,
        timeout: 20_000,
        maxRetries: 0,
      })
    : null;

const groqApiKey = process.env.GROQ_API_KEY;
const groqVisionModel = process.env.GROQ_VISION_MODEL || "qwen/qwen3.8-27b";

const groqClient = groqApiKey
  ? new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: groqApiKey,
      timeout: 20_000,
      maxRetries: 0,
    })
  : null;

// Billing
const FREE_PALM_SCAN_LIMIT = 5;
const COST_PER_PALM_SCAN_PAISE = 200;

/* -------------------------------------------------------------------------- */
/*                              HELPERS                                       */
/* -------------------------------------------------------------------------- */

function getLanguageInstruction(lang: string): string {
  const map: Record<string, string> = {
    hi: "Reply strictly in pure Hindi (Devanagari script).",
    hinglish: "Reply strictly in Hinglish (Roman Hindi mixed with English).",
    en: "Reply strictly in English.",
    te: "Reply strictly in Telugu (తెలుగు).",
    ta: "Reply strictly in Tamil (தமிழ்).",
    kn: "Reply strictly in Kannada (ಕನ್ನಡ).",
    bn: "Reply strictly in Bengali (বাংলা).",
    mr: "Reply strictly in Marathi (मराठी).",
    gu: "Reply strictly in Gujarati (ગુજરાતી).",
    ml: "Reply strictly in Malayalam (മലയാളം).",
  };
  return map[lang] || map["hinglish"];
}

function getPsychologicalUnauthorizedMessage(lang: string): string {
  const map: Record<string, string> = {
    hi: "आपकी हथेली के राज अभी अनकहे हैं। सटीक हस्तरेखा विश्लेषण और अपने भविष्य की सच्चाई जानने के लिए कृपया लॉगिन या रजिस्टर करें।",
    hinglish: "Aapki hatheli ke raaz abhi ankahe hain. Sahi palm analysis aur apne bhavishya ki sachai jaanne ke liye kripya login ya register karein.",
    en: "The secrets of your palm are still untold. Please login or register for accurate palm analysis and to uncover the truth about your future.",
  };
  return map[lang] || map["en"];
}

function getAIFailureMessage(lang: string): string {
  const map: Record<string, string> = {
    hi: "एआई सर्वर अभी व्यस्त है। कृपया 1 मिनट बाद पुनः प्रयास करें।",
    hinglish: "AI server thoda busy hai. Kripya 1 minute baad try karein.",
    en: "AI server is busy. Please try again in 1 minute.",
  };
  return map[lang] || map["en"];
}

function getRejectionMessage(lang: string): string {
  const map: Record<string, string> = {
    hi: "कृपया अपनी हथेली की साफ़ और पास से ली गई फोटो अपलोड करें। अच्छी रोशनी में हथेली पूरी खुली दिखनी चाहिए।",
    hinglish: "Kripya apni hatheli ki saaf aur paas se li gayi photo upload karein. Acchi roshni mein hatheli poori khuli dikhni chahiye.",
    en: "Please upload a clear, close-up photo of your palm. The palm should be fully open and well-lit.",
  };
  return map[lang] || map["en"];
}

function safeParseJSON(text: string): any {
  try {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.substring(start, end + 1));
    }
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function clampScore(v: any, fallback = 75): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

/* -------------------------------------------------------------------------- */
/*                         AI CALL (Modal → Groq) — UNCHANGED                */
/* -------------------------------------------------------------------------- */

async function callVisionModel(
  prompt: string,
  imageBase64: string,
  imageMime: string
): Promise<{ text: string; used: "modal" | "groq" }> {
  const messagesPayload: any[] = [
    {
      role: "user",
      content: [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: `data:${imageMime};base64,${imageBase64}` } },
      ],
    },
  ];

  if (modalClient) {
    try {
      const completion = await modalClient.chat.completions.create({
        model: modalModel,
        messages: messagesPayload,
        temperature: 0.5,
        response_format: { type: "json_object" },
      });
      const text = completion.choices[0]?.message?.content || "";
      if (text) return { text, used: "modal" };
    } catch (err: any) {
      console.error(`[palm] Modal failed:`, err?.message);
    }
  }

  if (groqClient) {
    try {
      const completion = await groqClient.chat.completions.create({
        model: groqVisionModel,
        messages: messagesPayload,
        temperature: 0.5,
        response_format: { type: "json_object" },
      });
      const text = completion.choices[0]?.message?.content || "";
      if (text) return { text, used: "groq" };
    } catch (err: any) {
      console.error(`[palm] Groq failed:`, err?.message);
      try {
        const completion = await groqClient.chat.completions.create({
          model: groqVisionModel,
          messages: messagesPayload,
          temperature: 0.5,
        });
        const text = completion.choices[0]?.message?.content || "";
        if (text) return { text, used: "groq" };
      } catch (retryErr: any) {
        console.error("[palm] Groq retry failed:", retryErr?.message);
      }
    }
  }

  throw new Error("ALL_AI_PROVIDERS_FAILED");
}

/* -------------------------------------------------------------------------- */
/*                              POST                                          */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  let language = "hinglish";

  try {
    const user = await getUser();
    const formData = await request.formData();
    language = (formData.get("language") as string) || "hinglish";
    const gender = ((formData.get("gender") as string) || "male").toLowerCase();
    const hand = ((formData.get("hand") as string) || "right").toLowerCase();

    if (!user || user.isGuest) {
      return NextResponse.json(
        {
          code: "LOGIN_REQUIRED",
          error: "Unauthorized",
          message: getPsychologicalUnauthorizedMessage(language),
        },
        { status: 401 }
      );
    }

    // 🔥 FRESH USER DATA FOR BILLING
    const [userRow] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    if (!userRow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPremium = Boolean(userRow.premiumUntil && new Date(userRow.premiumUntil) > new Date());
    const freeScansUsed = userRow.freePalmScansUsed || 0;
    const walletBalance = userRow.walletBalancePaise || 0;
    const freeScansLeft = Math.max(0, FREE_PALM_SCAN_LIMIT - freeScansUsed);

    if (!isPremium && freeScansLeft === 0 && walletBalance < COST_PER_PALM_SCAN_PAISE) {
      return NextResponse.json(
        {
          code: "WALLET_RECHARGE_REQUIRED",
          error: "Free scans exhausted. Please recharge your wallet to continue.",
        },
        { status: 402 }
      );
    }

    const imageFile = formData.get("image") as File | null;

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({ error: "INVALID_IMAGE", message: "Missing image." }, { status: 400 });
    }
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "INVALID_IMAGE", message: "Image must be under 10MB." },
        { status: 400 }
      );
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(imageFile.type)) {
      return NextResponse.json(
        { error: "INVALID_IMAGE", message: "Only JPG, PNG or WEBP are supported." },
        { status: 400 }
      );
    }

    const bytes = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    const prompt = `
IDENTITY: You are a highly respected, 20+ year experienced female Vedic Palmist (Hast Rekha Expert) from India. You speak with warmth, deep psychological insight, and gentle authority. You read palms strictly as per Samudrik Shastra.

USER CONTEXT:
- Gender: ${gender}
- Hand being read: ${hand} (Samudrik tradition: male → right hand primary, female → left hand primary. Respect the user's selection.)

PSYCHOLOGY & TONE RULES:
1. VALIDATE FIRST — Start with exactly 2 Barnum-effect lines. Make them feel "this is about me" (universal but deeply personal).
   Example: "Aap bahar se jitne shaant aur mazboot dikhte hain, andar se utne hi bhaavuk hain. Aap logon ki madad bina swarth ke karte hain, lekin kabhi kabhi woh samman nahi milta jiska aap haqdaar hain."
2. SOFT LANGUAGE ONLY — NEVER use fear words: "dosh", "challenge", "rukawat", "sankat", "bad luck", "problem".
   INSTEAD use: "energy imbalance", "dhyan dene yogya area", "savdhani ka samay", "sudhaar ki gunjaish".
3. CERTAINTY — Use words like "clearly visible", "strongly indicates", "definitely shows". Avoid "maybe", "might", "perhaps".
4. NO AI DISCLOSURE — Never mention you are AI. Never say astrology is a belief.
5. EVERY PROBLEM HAS A SOLUTION — Har observation ke saath ek positive perspective ya solution do.
6. ZERO-COST REMEDY — Suggest only free home remedies (e.g., Somvar ko Shiv ji ko jal arpit karein, peepal ke ped ko jal dein). NO expensive gems/puja.
7. MANTRA — Include one auspicious Sanskrit mantra (e.g., "ॐ नमो भगवते वासुदेवाय").
8. SOFT SUSPENSE — At the end, gently hint at a special time and direction when their yog will fully activate. Use words like "ek khaas samay aur disha hai jab ye yog poora phal dega". DO NOT use fear words like "rukwat".

LANGUAGE: ${getLanguageInstruction(language)}

IMAGE VALIDATION (CRITICAL):
If the image is NOT a clear, open palm (e.g., blurry, wall, pen, face, document, closed fist, or anything showing no visible palm lines), return EXACTLY:
{"isHand": false, "rejectionMessage": "Kripya apni hatheli ki saaf aur paas se li gayi photo upload karein. Acchi roshni mein hatheli poori khuli dikhni chahiye."}

If the image IS a clear palm with visible lines, return ONLY a valid JSON object matching this schema EXACTLY:
{
  "isHand": true,
  "barnumLines": ["<line 1 - universal but personal>", "<line 2 - emotional insight>"],
  "scores": {
    "career": <number 0-100>,
    "love": <number 0-100>,
    "health": <number 0-100>,
    "luck": <number 0-100>
  },
  "lines": {
    "life": "<Jeevan Rekha — 2 soft sentences>",
    "head": "<Mastishk Rekha — 2 soft sentences>",
    "heart": "<Hriday Rekha — 2 soft sentences>",
    "fate": "<Bhagya Rekha — 2 soft sentences>"
  },
  "mounts": {
    "guru": "<Guru Parvat / Jupiter Mount — 1 sentence>",
    "venus": "<Shukra Parvat / Venus Mount — 1 sentence>"
  },
  "physical": "<Hatheli ka rang + ungliyon ki bananaawat — 1 sentence>",
  "freeUpay": "<Zero-cost home remedy in 1-2 sentences>",
  "mantra": "<One short auspicious Sanskrit mantra>",
  "suspenseHook": "<Soft hint about special time and direction — NO fear word>"
}

CRITICAL RULES:
- Har user ke liye DIFFERENT result — same template repeat mat karo.
- Scores 55-95 ke beech realistic variation rakho.
- Kabhi bhi "cross/X on palm" ya "hidden challenge/Dosha" hardcoded mat likho.
- "Rukawat", "dosh", "sankat", "problem" — ye words bilkul nahi.
`;

    let aiText: string;
    let usedProvider: "modal" | "groq";

    try {
      const out = await callVisionModel(prompt, base64Image, imageFile.type);
      aiText = out.text;
      usedProvider = out.used;
    } catch (err: any) {
      console.error("[palm] All AI providers failed:", err?.message);
      return NextResponse.json(
        { error: "AI_ERROR", message: getAIFailureMessage(language) },
        { status: 500 }
      );
    }

    const result = safeParseJSON(aiText);

    if (!result) {
      console.error("[palm] JSON parse failed:", aiText.slice(0, 200));
      return NextResponse.json(
        { error: "AI_ERROR", message: getAIFailureMessage(language) },
        { status: 500 }
      );
    }

    // 🔥 INVALID IMAGE → NO count/deduct
    const isInvalidImage = result.isHand === false || result.error === "INVALID_IMAGE";
    if (isInvalidImage) {
      return NextResponse.json(
        {
          isHand: false,
          error: "INVALID_IMAGE",
          message:
            result.rejectionMessage ||
            result.message ||
            getRejectionMessage(language),
        },
        { status: 422 }
      );
    }

    // 🔥 SUCCESS → deduct count/wallet
    if (!isPremium) {
      if (freeScansLeft > 0) {
        await db
          .update(users)
          .set({ freePalmScansUsed: sql`${users.freePalmScansUsed} + 1` })
          .where(eq(users.id, user.id));
      } else if (walletBalance >= COST_PER_PALM_SCAN_PAISE) {
        await db
          .update(users)
          .set({
            walletBalancePaise: sql`${users.walletBalancePaise} - ${COST_PER_PALM_SCAN_PAISE}`,
          })
          .where(eq(users.id, user.id));
      }
    }

    return NextResponse.json({
      success: true,
      provider: usedProvider,
      result: {
        barnumLines: Array.isArray(result.barnumLines) ? result.barnumLines.slice(0, 2) : [],
        scores: {
          career: clampScore(result.scores?.career, 75),
          love: clampScore(result.scores?.love, 72),
          health: clampScore(result.scores?.health, 80),
          luck: clampScore(result.scores?.luck, 78),
        },
        lines: {
          life: result.lines?.life || "",
          head: result.lines?.head || "",
          heart: result.lines?.heart || "",
          fate: result.lines?.fate || "",
        },
        mounts: {
          guru: result.mounts?.guru || "",
          venus: result.mounts?.venus || "",
        },
        physical: result.physical || "",
        freeUpay: result.freeUpay || "",
        mantra: result.mantra || "ॐ नमो भगवते वासुदेवाय",
        suspenseHook: result.suspenseHook || "",
      },
      scansLeft: isPremium ? "Unlimited" : Math.max(0, freeScansLeft - 1),
    });
  } catch (error: any) {
    console.error("[palm] Unhandled error:", error?.message);
    return NextResponse.json(
      { error: "AI_ERROR", message: getAIFailureMessage(language) },
      { status: 500 }
    );
  }
}
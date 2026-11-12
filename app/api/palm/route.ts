// app/api/palm/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { and, sql, eq, gte } from "drizzle-orm"; 
import { getUser } from "@/auth";
import { db } from "@/index";
import { users } from "@/schema"; 

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
/*                     🔥 CONFIGURATION (FIXED)                               */
/* -------------------------------------------------------------------------- */

const modalApiKey = process.env.MODAL_API_KEY;
const modalUrl = process.env.MODAL_API_URL;
const modalModel = process.env.MODAL_VISION_MODEL || "Qwen/Qwen3.6-27B";

const modalClient =
  modalUrl && modalApiKey
    ? new OpenAI({
        baseURL: modalUrl,
        apiKey: modalApiKey,
        timeout: 15_000, // 🔥 FIX: 15s timeout
        maxRetries: 0,   // 🔥 FIX: No retry, direct fallback
      })
    : null;

const groqApiKey = process.env.GROQ_API_KEY;
const groqVisionModel = process.env.GROQ_VISION_MODEL || "qwen/qwen3.8-27b"; // 🔥 FIX: Updated Model

const groqClient = groqApiKey
  ? new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: groqApiKey,
      timeout: 15_000,
      maxRetries: 0,
    })
  : null;

// 🔥 Billing Logic Constants
const FREE_PALM_SCAN_LIMIT = 5;
const COST_PER_PALM_SCAN_PAISE = 200; // ₹2 per scan after 5 free scans

/* -------------------------------------------------------------------------- */
/*                              HELPERS & TRANSLATIONS                        */
/* -------------------------------------------------------------------------- */

function getLanguageInstruction(lang: string): string {
  const map: Record<string, string> = {
    hi: "Reply strictly in pure Hindi (Devanagari script).",
    hinglish: "Reply strictly in Hinglish (Roman Hindi mixed with English).",
    en: "Reply strictly in English.",
    te: "Reply strictly in Telugu (తెలుగు).", ta: "Reply strictly in Tamil (தமிழ்).",
    kn: "Reply strictly in Kannada (ಕನ್ನಡ).", bn: "Reply strictly in Bengali (বাংলা).",
    mr: "Reply strictly in Marathi (मराठी).", gu: "Reply strictly in Gujarati (ગુજરાતી).",
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

function safeParseJSON(text: string): any {
  try {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.substring(start, end + 1));
    }
    return JSON.parse(cleaned);
  } catch (err) {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*                         AI CALL (Modal → Groq)                             */
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
        temperature: 0.4,
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
        temperature: 0.4,
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
          temperature: 0.4,
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

    if (!user || user.isGuest) {
      return NextResponse.json(
        { code: "LOGIN_REQUIRED", error: "Unauthorized", message: getPsychologicalUnauthorizedMessage(language) },
        { status: 401 }
      );
    }

    // 🔥 FETCH FRESH USER DATA FOR BILLING CHECK
    const [userRow] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    if (!userRow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPremium = Boolean(userRow.premiumUntil && new Date(userRow.premiumUntil) > new Date());
    const freeScansUsed = userRow.freePalmScansUsed || 0;
    const walletBalance = userRow.walletBalancePaise || 0;
    const freeScansLeft = Math.max(0, FREE_PALM_SCAN_LIMIT - freeScansUsed);

    // 🔥 RATE LIMIT & WALLET CHECK (Before AI Call)
    // Agar limit khatam hai aur wallet me paise bhi nahi hain, toh turant reject karo
    if (!isPremium && freeScansLeft === 0 && walletBalance < COST_PER_PALM_SCAN_PAISE) {
      return NextResponse.json({ 
        code: "WALLET_RECHARGE_REQUIRED", 
        error: "Free scans exhausted. Please recharge your wallet to continue." 
      }, { status: 402 }); // 402 Payment Required
    }

    const imageFile = formData.get("image") as File | null;

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({ error: "INVALID_IMAGE", message: "Missing image." }, { status: 400 });
    }
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "INVALID_IMAGE", message: "Image must be under 10MB." }, { status: 400 });
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(imageFile.type)) {
      return NextResponse.json({ error: "INVALID_IMAGE", message: "Only JPG, PNG or WEBP are supported." }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    const prompt = `
      IDENTITY: You are a highly respected, 20+ year experienced female Vedic Palmist (Hast Rekha Expert). You are a real human. You speak with absolute authority, warmth, and deep psychological insight.
      PSYCHOLOGY & MARKETING RULES:
      1. VALIDATE: Start by validating their energy. Make them feel seen.
      2. ABSOLUTE CERTAINTY: Never say 'maybe' or 'might'. Use words like 'definitely', 'clearly visible', 'strongly indicates'.
      3. NO DISCLAIMERS: Never mention you are an AI. Never say astrology is a belief.
      4. THE HOOK: You must identify a 'hidden challenge' or 'Dosha' on their palm. This creates urgency.
      LANGUAGE RULES: ${getLanguageInstruction(language)}
      If the image is not a hand, return exactly: {"error": "INVALID_IMAGE", "message": "Please upload a clear palm photo."}
      Otherwise, you MUST return ONLY a valid JSON object with this exact schema:
      {
        "title": "A captivating title for their palm reading",
        "insight": "Two short paragraphs. First: Analyze the major lines. Second: Point out a specific challenge.",
        "hook": "A short, compelling sentence telling them exactly why they need to talk to an astrologer immediately.",
        "suggestedChatPrompt": "A ready-to-use message the user can send to the astrologer."
      }
    `;

    let aiText: string;
    let usedProvider: "modal" | "groq";

    try {
      const out = await callVisionModel(prompt, base64Image, imageFile.type);
      aiText = out.text;
      usedProvider = out.used;
    } catch (err: any) {
      console.error("[palm] All AI providers failed:", err?.message);
      return NextResponse.json({ error: "AI_ERROR", message: getAIFailureMessage(language) }, { status: 500 });
    }

    const result = safeParseJSON(aiText);

    if (!result) {
      console.error("[palm] JSON parse failed:", aiText.slice(0, 200));
      return NextResponse.json({ error: "AI_ERROR", message: getAIFailureMessage(language) }, { status: 500 });
    }

    // 🔥 CRITICAL: Agar image invalid hai, toh count/deduct MAT karo
    if (result.error === "INVALID_IMAGE") {
      return NextResponse.json(result, { status: 422 });
    }

    // 🔥 SUCCESS: Ab count badhao ya wallet deduct karo
    if (!isPremium) {
      if (freeScansLeft > 0) {
        // Free scan use hua
        await db.update(users)
          .set({ freePalmScansUsed: sql`${users.freePalmScansUsed} + 1` })
          .where(eq(users.id, user.id));
      } else if (walletBalance >= COST_PER_PALM_SCAN_PAISE) {
        // Wallet se deduct hua
        await db.update(users)
          .set({ walletBalancePaise: sql`${users.walletBalancePaise} - ${COST_PER_PALM_SCAN_PAISE}` })
          .where(eq(users.id, user.id));
      }
    }

    return NextResponse.json({
      success: true,
      provider: usedProvider,
      result: {
        title: result.title || "Palm Reading",
        insight: result.insight || "Your palm shows a unique path.",
        hook: result.hook || "A major shift is coming. Talk to an astrologer now.",
        suggestedChatPrompt: result.suggestedChatPrompt || "Hello, I just checked my palm. Can you guide me?",
      },
      scansLeft: isPremium ? "Unlimited" : Math.max(0, freeScansLeft - 1), // Frontend ko dikhane ke liye
    });
  } catch (error: any) {
    console.error("[palm] Unhandled error:", error?.message);
    return NextResponse.json({ error: "AI_ERROR", message: getAIFailureMessage(language) }, { status: 500 });
  }
}
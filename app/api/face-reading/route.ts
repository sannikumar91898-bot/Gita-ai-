// app/api/face-reading/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { eq, sql } from "drizzle-orm";
import { getUser } from "@/auth";
import { db } from "@/index";
import { users } from "@/schema"; // 🔥 Users table import kiya

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
/*                     🔥 CONFIGURATION (FIXED)                               */
/* -------------------------------------------------------------------------- */

const modalApiKey = process.env.MODAL_API_KEY;
const modalUrl = process.env.MODAL_API_URL;
const modalModel = process.env.MODAL_VISION_MODEL || "Qwen/Qwen2.5-VL-7B-Instruct";

const modalClient =
  modalUrl && modalApiKey
    ? new OpenAI({
        baseURL: modalUrl,
        apiKey: modalApiKey,
        timeout: 15_000, // 🔥 FIX: 15s timeout
        maxRetries: 0,   // 🔥 FIX: No retry, direct fallback
      })
    : null;

// 🔥 FIX: GROQ FALLBACK - Updated Model
const groqApiKey = process.env.GROQ_API_KEY;
const groqVisionModel = process.env.GROQ_VISION_MODEL || "qwen/qwen3.8-27b"; 

const groqClient = groqApiKey
  ? new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: groqApiKey,
      timeout: 15_000,
      maxRetries: 0,
    })
  : null;

// 🔥 Billing Logic Constants
const FREE_FACE_SCAN_LIMIT = 5;
const COST_PER_FACE_SCAN_PAISE = 200; // ₹2 per scan after 5 free scans

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
    hi: "आपके चेहरे के राज अभी अनकहे हैं। सटीक फेस रीडिंग और अपने भविष्य की सच्चाई जानने के लिए कृपया लॉगिन या रजिस्टर करें।",
    hinglish: "Aapke chehre ke raaz abhi ankahe hain. Sahi face reading aur apne bhavishya ki sachai jaanne ke liye kripya login ya register karein.",
    en: "The secrets of your face are still untold. Please login or register for accurate face reading and to uncover the truth about your future.",
    te: "మీ ముఖ రహస్యాలు ఇంకా చెప్పబడలేదు. ఖచ్చితమైన ఫేస్ రీడింగ్ మరియు మీ భవిష్యత్తు నిజం తెలుసుకోవడానికి దయచేసి లాగిన్ లేదా రిజిస్టర్ చేయండి.",
    ta: "உங்கள் முகத்தின் ரகசியங்கள் இன்னும் சொல்லப்படவில்லை. துல்லியமான முக படிப்பு மற்றும் உங்கள் எதிர்கால உண்மையை அறிய தயவுசெய்து உள்நுழையவும் அல்லது பதிவு செய்யவும்.",
    kn: "ನಿಮ್ಮ ಮುಖದ ರಹಸ್ಯಗಳು ಇನ್ನೂ ಹೇಳಲ್ಪಟ್ಟಿಲ್ಲ. ನಿಖರವಾದ ಮುಖ ಓದುವಿಕೆ ಮತ್ತು ನಿಮ್ಮ ಭವಿಷ್ಯದ ಸತ್ಯವನ್ನು ತಿಳಿಯಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಅಥವಾ ನೋಂದಾಯಿಸಿ.",
    bn: "আপনার মুখের রহস্য এখনও অকথিত। সঠিক মুখ পাঠ এবং আপনার ভবিষ্যতের সত্য জানতে অনুগ্রহ করে লগইন বা রেজিস্টার করুন।",
    mr: "तुमच्या चेहऱ्याची रहस्ये अजून सांगितलेली नाहीत. अचूक चेहरा वाचन आणि तुमच्या भविष्यातील सत्य जाणून घेण्यासाठी कृपया लॉगिन किंवा नोंदणी करा.",
    gu: "તમારા ચહેરાના રહસ્યો હજી કહેવાયા નથી. સચોટ ચહેરો વાંચન અને તમારા ભવિષ્યનું સત્ય જાણવા માટે કૃપા કરીને લોગિન અથવા નોંધણી કરો.",
    ml: "നിങ്ങളുടെ മുഖത്തിന്റെ രഹസ്യങ്ങൾ ഇപ്പോഴും പറഞ്ഞിട്ടില്ല. കൃത്യമായ മുഖ വായനയ്ക്കായി ദയവായി ലോഗിൻ ചെയ്യുകയോ രജിസ്റ്റർ ചെയ്യുകയോ ചെയ്യുക.",
  };
  return map[lang] || map["en"];
}

function getAIFailureMessage(lang: string): string {
  const map: Record<string, string> = {
    hi: "एआई सर्वर अभी व्यस्त है। कृपया 1 मिनट बाद पुनः प्रयास करें।",
    hinglish: "AI server thoda busy hai. Kripya 1 minute baad try karein.",
    en: "AI server is busy. Please try again in 1 minute.",
    te: "AI సర్వర్ బిజీగా ఉంది. దయచేసి 1 నిమిషం తర్వాత మళ్లీ ప్రయత్నించండి.",
    ta: "சர்வர் பிஸியாக உள்ளது. தயவுசெய்து 1 நிமிடம் கழித்து மீண்டும் முயற்சிக்கவும்.",
    kn: "ಸರ್ವರ್ ಬ್ಯುಸಿಯಾಗಿದೆ. ದಯವಿಟ್ಟು 1 ನಿಮಿಷದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    bn: "সার্ভার ব্যস্ত আছে। অনুগ্রহ করে 1 মিনিট পরে আবার চেষ্টা করুন।",
    mr: "सर्व्हर व्यस्त आहे. कृपया 1 मिनिटानंतर पुन्हा प्रयत्न करा.",
    gu: "સર્વર વ્યસ્ત છે. કૃપા કરીને 1 મિનિટ પછી ફરી પ્રયાસ કરો.",
    ml: "സർവർ തിരക്കിലാണ്. ദയവായി 1 മിനിറ്റ് കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുക.",
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

async function callVisionModel(prompt: string, imageBase64: string, imageMime: string): Promise<{ text: string; used: "modal" | "groq" }> {
  const messagesPayload: any[] = [
    {
      role: "user",
      content: [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: `data:${imageMime};base64,${imageBase64}` } },
      ],
    },
  ];

  // 1. Try Modal
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
      console.error(`[face] Modal failed:`, err?.message);
    }
  }

  // 2. Fallback Groq
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
      console.error(`[face] Groq failed:`, err?.message);
      try {
        const completion = await groqClient.chat.completions.create({
          model: groqVisionModel,
          messages: messagesPayload,
          temperature: 0.4,
        });
        const text = completion.choices[0]?.message?.content || "";
        if (text) return { text, used: "groq" };
      } catch (retryErr: any) {
        console.error("[face] Groq retry failed:", retryErr?.message);
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
      return NextResponse.json({
        code: "LOGIN_REQUIRED",
        error: "Unauthorized",
        message: getPsychologicalUnauthorizedMessage(language),
      }, { status: 401 });
    }

    // 🔥 FETCH FRESH USER DATA FOR BILLING CHECK
    const [userRow] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    if (!userRow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPremium = Boolean(userRow.premiumUntil && new Date(userRow.premiumUntil) > new Date());
    const freeScansUsed = userRow.freeFaceScansUsed || 0;
    const walletBalance = userRow.walletBalancePaise || 0;
    const freeScansLeft = Math.max(0, FREE_FACE_SCAN_LIMIT - freeScansUsed);

    // 🔥 RATE LIMIT & WALLET CHECK (Before AI Call)
    if (!isPremium && freeScansLeft === 0 && walletBalance < COST_PER_FACE_SCAN_PAISE) {
      return NextResponse.json({ 
        code: "WALLET_RECHARGE_REQUIRED", 
        error: "Free scans exhausted. Please recharge your wallet to continue." 
      }, { status: 402 }); 
    }

    const imageFile = formData.get("image") as File | null;

    // Backend Validation
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

    // 🔥 PREMIUM PSYCHOLOGY & BUSINESS PROMPT
    const prompt = `
      IDENTITY: You are a highly respected, 20+ year experienced female Vedic Face Reader (Physiognomist). You are a real human. You speak with absolute authority, warmth, and deep psychological insight.

      PSYCHOLOGY & MARKETING RULES:
      1. VALIDATE: Start by validating their energy. Make them feel seen.
      2. ABSOLUTE CERTAINTY: Never say 'maybe' or 'might'. Use words like 'definitely', 'clearly visible', 'strongly indicates'.
      3. NO DISCLAIMERS: Never mention you are an AI. Never say astrology is a belief.
      4. THE HOOK: You must identify a 'hidden challenge' or 'Dosh' on their face (e.g., lines on forehead, mole placement, eye shape). This creates urgency.

      LANGUAGE RULES: ${getLanguageInstruction(language)}

      If the image is not a clear human face, return exactly: {"error": "INVALID_IMAGE", "message": "Please upload a clear photo of a human face."}
      
      Otherwise, you MUST return ONLY a valid JSON object with this exact schema:
      {
        "title": "A captivating title for their face reading (e.g., 'The Royal Lioness')",
        "insight": "Two short paragraphs. First: Analyze their facial features (eyes, forehead) with absolute certainty and warmth. Second: Point out a specific challenge/dosha and explain how it affects them. Plain text only, no markdown.",
        "hook": "A short, compelling sentence telling them exactly why they need to talk to an astrologer immediately to fix this dosha.",
        "suggestedChatPrompt": "A ready-to-use message the user can send to the astrologer, summarizing their face reading and asking for a solution."
      }
    `;

    let aiText: string;
    let usedProvider: "modal" | "groq";

    try {
      const out = await callVisionModel(prompt, base64Image, imageFile.type);
      aiText = out.text;
      usedProvider = out.used;
    } catch (err: any) {
      console.error("[face] All AI providers failed:", err?.message);
      return NextResponse.json({ error: "AI_ERROR", message: getAIFailureMessage(language) }, { status: 500 });
    }

    const result = safeParseJSON(aiText);

    if (!result) {
      console.error("[face] JSON parse failed:", aiText.slice(0, 200));
      return NextResponse.json({ error: "AI_ERROR", message: getAIFailureMessage(language) }, { status: 500 });
    }

    // 🔥 CRITICAL: Agar image invalid hai, toh count/deduct MAT karo
    if (result.error === "INVALID_IMAGE") {
      return NextResponse.json(result, { status: 422 });
    }

    // 🔥 SUCCESS: Ab count badhao ya wallet deduct karo
    if (!isPremium) {
      if (freeScansLeft > 0) {
        await db.update(users)
          .set({ freeFaceScansUsed: sql`${users.freeFaceScansUsed} + 1` })
          .where(eq(users.id, user.id));
      } else if (walletBalance >= COST_PER_FACE_SCAN_PAISE) {
        await db.update(users)
          .set({ walletBalancePaise: sql`${users.walletBalancePaise} - ${COST_PER_FACE_SCAN_PAISE}` })
          .where(eq(users.id, user.id));
      }
    }

    return NextResponse.json({
      success: true,
      provider: usedProvider,
      result: {
        title: result.title || "Face Reading",
        insight: result.insight || "Your face shows a unique path.",
        hook: result.hook || "A major shift is coming. Talk to an astrologer now.",
        suggestedChatPrompt: result.suggestedChatPrompt || "Hello, I just checked my face reading. Can you guide me?",
      },
      scansLeft: isPremium ? "Unlimited" : Math.max(0, freeScansLeft - 1),
    });
  } catch (error: any) {
    console.error("[face] Unhandled error:", error?.message);
    return NextResponse.json({ error: "AI_ERROR", message: getAIFailureMessage(language) }, { status: 500 });
  }
}
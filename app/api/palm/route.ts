// app/api/palm/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getUser } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
/*                     🔥 MODAL (PRIMARY) + GROQ (FALLBACK)                   */
/* -------------------------------------------------------------------------- */

const modalApiKey = process.env.MODAL_API_KEY;
const modalUrl = process.env.MODAL_API_URL;
const modalModel = process.env.MODAL_VISION_MODEL || "Qwen/Qwen3.6-27B";

const modalClient =
  modalUrl && modalApiKey
    ? new OpenAI({
        baseURL: modalUrl,
        apiKey: modalApiKey,
        timeout: 60_000,
        maxRetries: 1,
      })
    : null;

// 🔥 GROQ FALLBACK
const groqApiKey = process.env.GROQ_API_KEY;
const groqVisionModel = process.env.GROQ_VISION_MODEL || "llama-3.2-11b-vision-preview"; // Groq's actual vision model

const groqClient = groqApiKey
  ? new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: groqApiKey,
      timeout: 60_000,
      maxRetries: 1,
    })
  : null;

if (!modalClient) {
  console.warn("[palm] Modal not configured — will use Groq only.");
}
if (!groqClient) {
  console.warn("[palm] Groq not configured — will use Modal only.");
}

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
    te: "మీ అరచేతి రహస్యాలు ఇంకా చెప్పబడలేదు. ఖచ్చితమైన పామ్ విశ్లేషణ మరియు మీ భవిష్యత్తు నిజం తెలుసుకోవడానికి దయచేసి లాగిన్ లేదా రిజిస్టర్ చేయండి.",
    ta: "உங்கள் உள்ளங்கையின் ரகசியங்கள் இன்னும் சொல்லப்படவில்லை. துல்லியமான கைரேகை பகுப்பாய்வு மற்றும் உங்கள் எதிர்கால உண்மையை அறிய தயவுசெய்து உள்நுழையவும் அல்லது பதிவு செய்யவும்.",
    kn: "ನಿಮ್ಮ ಅಂಗೈ ರಹಸ್ಯಗಳು ಇನ್ನೂ ಹೇಳಲ್ಪಟ್ಟಿಲ್ಲ. ನಿಖರವಾದ ಹಸ್ತರೇಖೆ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ನಿಮ್ಮ ಭವಿಷ್ಯದ ಸತ್ಯವನ್ನು ತಿಳಿಯಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಅಥವಾ ನೋಂದಾಯಿಸಿ.",
    bn: "আপনার হাতের তালুর রহস্য এখনও অকথিত। সঠিক হস্তরেখা বিশ্লেষণ এবং আপনার ভবিষ্যতের সত্য জানতে অনুগ্রহ করে লগইন বা রেজিস্টার করুন।",
    mr: "तुमच्या तळहाताची रहस्ये अजून सांगितलेली नाहीत. अचूक हस्तरेषा विश्लेषण आणि तुमच्या भविष्यातील सत्य जाणून घेण्यासाठी कृपया लॉगिन किंवा नोंदणी करा.",
    gu: "તમારી હથેળીના રહસ્યો હજી કહેવાયા નથી. સચોટ હસ્તરેખા વિશ્લેષણ અને તમારા ભવિષ્યનું સત્ય જાણવા માટે કૃપા કરીને લોગિન અથવા નોંધણી કરો.",
    ml: "നിങ്ങളുടെ കൈപ്പത്തിയുടെ രഹസ്യങ്ങൾ ഇപ്പോഴും പറഞ്ഞിട്ടില്ല. കൃത്യമായ കൈരേഖ വിശകലനത്തിനായി ദയവായി ലോഗിൻ ചെയ്യുകയോ രജിസ്റ്റർ ചെയ്യുകയോ ചെയ്യുക.",
  };
  return map[lang] || map["en"];
}

function getAIFailureMessage(lang: string): string {
  const map: Record<string, string> = {
    hi: "एआई सर्वर अभी व्यस्त है। कृपया 1 मिनट बाद पुनः प्रयास करें।",
    hinglish: "AI server thoda busy hai. Kripya 1 minute baad try karein.",
    en: "AI server is busy. Please try again in 1 minute.",
    te: "AI సర్వర్ బిజీగా ఉంది. దయచేసి 1 నిమిషం తర్వాత మళ్లీ ప్రయత్నించండి.",
    ta: "AI சர்வர் பிஸியாக உள்ளது. தயவுசெய்து 1 நிமிடம் கழித்து மீண்டும் முயற்சிக்கவும்.",
    kn: "AI ಸರ್ವರ್ ಬ್ಯುಸಿಯಾಗಿದೆ. ದಯವಿಟ್ಟು 1 ನಿಮಿಷದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    bn: "AI সার্ভার ব্যস্ত আছে। অনুগ্রহ করে 1 মিনিট পরে আবার চেষ্টা করুন।",
    mr: "AI सर्व्हर व्यस्त आहे. कृपया 1 मिनिटानंतर पुन्हा प्रयत्न करा.",
    gu: "AI સર્વર વ્યસ્ત છે. કૃપા કરીને 1 મિનિટ પછી ફરી પ્રયાસ કરો.",
    ml: "AI സർവർ തിരക്കിലാണ്. ദയവായി 1 മിനിറ്റ് കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുക.",
  };
  return map[lang] || map["en"];
}

function isModelNotFoundError(err: any): boolean {
  if (!err) return false;
  if (err.status === 404) return true;
  const msg = String(err?.message || "").toLowerCase();
  return (
    msg.includes("404") ||
    msg.includes("not found") ||
    msg.includes("does not exist") ||
    msg.includes("no such model") ||
    msg.includes("invalid function call")
  );
}

// 🔥 ROBUST JSON EXTRACTOR (Prevents crashes if AI adds markdown)
function safeParseJSON(text: string): any {
  try {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    // Find first { and last }
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
      console.error(`[palm] Modal failed:`, err?.message);
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
      console.error(`[palm] Groq failed:`, err?.message);
      // Retry Groq without response_format
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

    // 🔥 Guest Protection (Passed language dynamically)
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

    const imageFile = formData.get("image") as File | null;

    // Validation
    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { error: "INVALID_IMAGE", message: "Missing image." },
        { status: 400 }
      );
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

    // 🔥 PREMIUM PSYCHOLOGY & BUSINESS PROMPT
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
        "title": "A captivating title for their palm reading (e.g., 'The Rising Sun of Wealth')",
        "insight": "Two short paragraphs. First: Analyze the major lines (Life, Heart, Fate) with absolute certainty and warmth. Second: Point out a specific challenge/dosha and explain how it affects them. Plain text only, no markdown.",
        "hook": "A short, compelling sentence telling them exactly why they need to talk to an astrologer immediately to fix this dosha.",
        "suggestedChatPrompt": "A ready-to-use message the user can send to the astrologer, summarizing their palm reading and asking for a solution (e.g., 'Namaste, I just checked my palm and it shows a blockage in my Fate line. How can I remove this obstacle?')"
      }
    `;

    /* ----------------------------- AI Call ------------------------------- */
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

    /* ----------------------------- Parse JSON ---------------------------- */
    const result = safeParseJSON(aiText);

    if (!result) {
      console.error("[palm] JSON parse failed:", aiText.slice(0, 200));
      return NextResponse.json(
        { error: "AI_ERROR", message: getAIFailureMessage(language) },
        { status: 500 }
      );
    }

    if (result.error === "INVALID_IMAGE") {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      provider: usedProvider,
      result: {
        title: result.title || "Palm Reading",
        insight: result.insight || "Your palm shows a unique path.",
        hook: result.hook || "A major shift is coming. Talk to an astrologer now.",
        suggestedChatPrompt: result.suggestedChatPrompt || "Hello, I just checked my palm. Can you guide me?", // 🔥 Passing to frontend
      },
    });
  } catch (error: any) {
    console.error("[palm] Unhandled error:", error?.message);
    return NextResponse.json(
      { error: "AI_ERROR", message: getAIFailureMessage(language) },
      { status: 500 }
    );
  }
}
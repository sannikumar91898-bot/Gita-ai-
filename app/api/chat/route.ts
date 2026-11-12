// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { and, desc, eq, sql, gte, lt } from "drizzle-orm";
import OpenAI from "openai";

import { getUser } from "@/auth";
import { db } from "@/index";
import { birthDetails, charts, conversations, messages, remedies, users } from "@/schema";
import { checkAILimit } from "@/rate-limit"; 

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
/*                     🔥 GROQ CONFIGURATION (ENV-CONFIGURABLE)               */
/* -------------------------------------------------------------------------- */

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const GROQ_TEXT_MODEL = process.env.GROQ_TEXT_MODEL || "llama-3.3-70b-versatile";
const GROQ_VISION_MODEL = process.env.GROQ_VISION_MODEL || "llama-3.2-11b-vision-preview";

const TEXT_MODEL_FALLBACKS = ["openai/gpt-oss-120b", "llama-3.1-8b-instant", "llama3-70b-8192"];
const VISION_MODEL_FALLBACKS = ["llama-3.2-90b-vision-preview"];

const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: GROQ_API_KEY || "dummy-key",
  timeout: 60_000,
  maxRetries: 1,
});

const COST_PER_MESSAGE_PAISE = 200;
const FREE_MESSAGE_LIMIT = 3;

/* -------------------------------------------------------------------------- */
/*                              PERSONAS & TONE                               */
/* -------------------------------------------------------------------------- */

type PersonaConfig = { name: string; specializations: string; tone: string; rules: string; };

const PERSONAS: Record<string, PersonaConfig> = {
  gita: { 
    name: "Gita", 
    specializations: "Love, relationships, marriage", 
    tone: "Warm, empathetic, and caring elder sister (behen). Use words like 'Suno beta', 'Main hoon na'.", 
    rules: "Validate the user's emotional pain first. Focus on 7th house (Venus/Mars) and mental peace." 
  },
  kriti: { 
    name: "Acharya Kriti", 
    specializations: "Career, jobs, business wealth", 
    tone: "Sharp, authoritative, professional business woman. No emotional sugar-coating.", 
    rules: "Focus on 10th house, Saturn, and practical remedies. Speak like a premium consultant." 
  },
  devaki: { 
    name: "Dr. Devaki Shastri", 
    specializations: "KP Astrology, precise life timing", 
    tone: "Highly intellectual, authoritative guru with 22+ years of experience.", 
    rules: "Use exact degrees and KP system terms. Demand birth time and place for exact predictions." 
  },
  gargi: { 
    name: "Gargi Maa", 
    specializations: "Spirituality, Vastu, dosha remedies", 
    tone: "Maternal, deeply soothing, and protective. Calls user 'Beta'.", 
    rules: "Prescribe simple household remedies, Vastu tips, and mantras. Focus on peace and protection." 
  },
};

/* -------------------------------------------------------------------------- */
/*                              HELPERS                                       */
/* -------------------------------------------------------------------------- */

function cleanText(value: unknown, maxLength = 6000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function isPersona(value: unknown): value is keyof typeof PERSONAS {
  return typeof value === "string" && value in PERSONAS;
}

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

function getUnauthorizedChatMessage(lang: string): string {
  const map: Record<string, string> = {
    hi: "यह चैट आपकी नहीं है या डिलीट हो चुकी है। कृपया नई चैट शुरू करें।",
    hinglish: "Yeh chat aapki nahi hai ya delete ho chuki hai. Kripya nayi chat shuru karein.",
    en: "This chat does not belong to you or has been deleted. Please start a new chat.",
    te: "ఈ చాట్ మీది కాదు లేదా తొలగించబడింది. దయచేసి కొత్త చాట్ ప్రారంభించండి.",
    ta: "இந்த அரட்டை உங்களுடையது அல்ல அல்லது நீக்கப்பட்டுள்ளது. தயவுசெய்து புதிய அரட்டையைத் தொடங்கவும்.",
    kn: "ಈ ಚಾಟ್ ನಿಮ್ಮದಲ್ಲ ಅಥವಾ ಅಳಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಹೊಸ ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ.",
    bn: "এই চ্যাটটি আপনার নয় বা মুছে ফেলা হয়েছে। অনুগ্রহ করে একটি নতুন চ্যাট শুরু করুন।",
    mr: "ही चॅट तुमची नाही किंवा हटवली गेली आहे. कृपया नवीन चॅट सुरू करा.",
    gu: "આ ચેટ તમારી નથી અથવા ડિલીટ થઈ ગઈ છે. કૃપા કરીને નવી ચેટ શરૂ કરો.",
    ml: "ഈ ചാറ്റ് നിങ്ങളുടേതല്ല അല്ലെങ്കിൽ ഇല്ലാതാക്കപ്പെട്ടു. ദയവായി ഒരു പുതിയ ചാറ്റ് ആരംഭിക്കുക.",
  };
  return map[lang] || map["en"];
}

function getAIErrorMessage(lang: string): string {
  const map: Record<string, string> = {
    hi: "सर्वर अभी व्यस्त है। कृपया 1 मिनट बाद पुनः प्रयास करें।",
    hinglish: "Server thoda busy hai. Kripya 1 minute baad try karein.",
    en: "Server is currently busy. Please try again in 1 minute.",
    te: "సర్వర్ బిజీగా ఉంది. దయచేసి 1 నిమిషం తర్వాత మళ్లీ ప్రయత్నించండి.",
    ta: "சர்வர் பிஸியாக உள்ளது. தயவுசெய்து 1 நிமிடம் கழித்து மீண்டும் முயற்சிக்கவும்.",
    kn: "ಸರ್ವರ್ ಬ್ಯುಸಿಯಾಗಿದೆ. ದಯವಿಟ್ಟು 1 ನಿಮಿಷದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    bn: "সার্ভার ব্যস্ত আছে। অনুগ্রহ করে 1 মিনিট পরে আবার চেষ্টা করুন।",
    mr: "सर्व्हर व्यस्त आहे. कृपया 1 मिनिटानंतर पुन्हा प्रयत्न करा.",
    gu: "સર્વર વ્યસ્ત છે. કૃપા કરીને 1 મિનિટ પછી ફરી પ્રયાસ કરો.",
    ml: "സർവർ തിരക്കിലാണ്. ദയവായി 1 മിനിറ്റ് കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുക.",
  };
  return map[lang] || map["en"];
}

function extractRemedy(response: string) {
  const marker = "||REMEDY_EXTRACT||";
  const index = response.indexOf(marker);
  if (index === -1) return { message: response.trim(), remedy: null as null | { title: string; description: string } };
  const message = response.slice(0, index).trim();
  const payload = response.slice(index + marker.length).trim();
  if (!payload) return { message, remedy: null };
  const lines = payload.split("\n");
  const title = lines[0]?.trim() || "उपाय";
  const description = lines.slice(1).join("\n").trim();
  return { message, remedy: description ? { title, description } : null };
}

/* -------------------------------------------------------------------------- */
/*                 🔥 GROQ CALL WITH AUTO-FALLBACK                            */
/* -------------------------------------------------------------------------- */

function isModelNotFoundError(err: any): boolean {
  if (!err) return false;
  if (err.status === 404) return true;
  const msg = String(err?.message || "").toLowerCase();
  return (
    msg.includes("404") ||
    msg.includes("not found") ||
    msg.includes("does not exist") ||
    msg.includes("decommissioned") ||
    msg.includes("model_not_found") ||
    msg.includes("no such model")
  );
}

async function callGroq(
  payload: { messages: any[]; temperature: number; max_tokens: number },
  useVision: boolean
): Promise<any> {
  const primary = useVision ? GROQ_VISION_MODEL : GROQ_TEXT_MODEL;
  const fallbacks = useVision ? VISION_MODEL_FALLBACKS : TEXT_MODEL_FALLBACKS;

  try {
    return await openai.chat.completions.create({ model: primary, ...payload });
  } catch (err: any) {
    if (!isModelNotFoundError(err)) throw err;

    for (const fb of fallbacks) {
      try {
        return await openai.chat.completions.create({ model: fb, ...payload });
      } catch (fbErr: any) {
        console.error(`[chat] Fallback ${fb} failed:`, fbErr?.status, fbErr?.message);
      }
    }
    throw err;
  }
}

/* -------------------------------------------------------------------------- */
/*                              GET (History)                                 */
/* -------------------------------------------------------------------------- */

export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Session not found." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const rawPersona = searchParams.get("persona");
    const persona = isPersona(rawPersona) ? rawPersona : "gita";
    const reqConvId = searchParams.get("conversationId");

    let conv;
    if (reqConvId) {
      const [c] = await db.select().from(conversations)
        .where(and(eq(conversations.id, reqConvId), eq(conversations.userId, user.id)))
        .limit(1);
      conv = c;
    } else {
      const [c] = await db.select().from(conversations)
        .where(and(eq(conversations.userId, user.id), eq(conversations.persona, persona)))
        .orderBy(desc(conversations.updatedAt))
        .limit(1);
      conv = c;
    }

    if (!conv) return NextResponse.json({ success: true, conversationId: null, messages: [] });

    const history = await db.select().from(messages)
      .where(eq(messages.conversationId, conv.id))
      .orderBy(messages.createdAt);

    return NextResponse.json({ success: true, conversationId: conv.id, messages: history });
  } catch (error) {
    console.error("[chat.GET] failed:", error);
    return NextResponse.json({ error: "Chat history load failed" }, { status: 500 });
  }
}

/* -------------------------------------------------------------------------- */
/*                              POST (Send Message)                           */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  let isDeducted = false;
  let deductedType: "wallet" | "free" | "none" = "none";
  let userId = "";
  let savedUserMsgId: string | null = null;
  let userLang = "hinglish";

  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Session not found." }, { status: 401 });
    }

    // 🔥 FIX 1: Guest Check (Premium Business Logic)
    if (user.isGuest) {
      return NextResponse.json({ 
        code: "LOGIN_REQUIRED", 
        error: "Please login or register to start a premium consultation." 
      }, { status: 401 });
    }

    userId = user.id;

    // 🔥 FIX 2: Rate Limiting (Spam Protection)
    if (typeof checkAILimit === 'function') {
      const rateLimit = await checkAILimit(userId);
      // 🔥 FIX: 'success' ki jagah 'allowed' kar diya gaya hai (TypeScript Error Fix)
      if (!rateLimit.allowed) { 
        return NextResponse.json({ 
          error: "Too many requests. Please wait a minute." 
        }, { status: 429 });
      }
    }

    /* ----------------------------- Parse form ---------------------------- */
    const formData = await request.formData();
    const userMessage = cleanText(formData.get("message"));
    const rawPersona = formData.get("persona");
    const persona = isPersona(rawPersona) ? rawPersona : "gita";
    const language = cleanText(formData.get("language")) || "hinglish";
    const requestedConversationId = cleanText(formData.get("conversationId"));
    const imageFile = formData.get("image") as File | null;
    userLang = language;

    if (!userMessage && !imageFile) {
      return NextResponse.json({ error: "Message khali hai." }, { status: 400 });
    }

    /* ----------------------- Conversation Ownership ---------------------- */
    if (requestedConversationId) {
      const [existingConv] = await db
        .select({ id: conversations.id })
        .from(conversations)
        .where(and(eq(conversations.id, requestedConversationId), eq(conversations.userId, userId)))
        .limit(1);

      if (!existingConv) {
        return NextResponse.json({ error: getUnauthorizedChatMessage(language) }, { status: 404 });
      }
    }

    /* ----------------------------- Billing ------------------------------- */
    const isPremium = Boolean(user.premiumUntil && new Date(user.premiumUntil) > new Date());
    const hasFreeMessages = (user.freeMessagesUsed ?? 0) < FREE_MESSAGE_LIMIT;

    if (!isPremium) {
      if (hasFreeMessages) {
        const upd = await db.update(users)
          .set({ freeMessagesUsed: sql`${users.freeMessagesUsed} + 1` })
          .where(and(eq(users.id, userId), lt(users.freeMessagesUsed, FREE_MESSAGE_LIMIT)))
          .returning();
        if (upd.length === 0) throw new Error("Free messages exhausted");
        isDeducted = true;
        deductedType = "free";
      } else if ((user.walletBalancePaise ?? 0) >= COST_PER_MESSAGE_PAISE) {
        const upd = await db.update(users)
          .set({ walletBalancePaise: sql`${users.walletBalancePaise} - ${COST_PER_MESSAGE_PAISE}` })
          .where(and(eq(users.id, userId), gte(users.walletBalancePaise, COST_PER_MESSAGE_PAISE)))
          .returning();
        if (upd.length === 0) throw new Error("Wallet deduction failed");
        isDeducted = true;
        deductedType = "wallet";
      } else {
        return NextResponse.json({ code: "INSUFFICIENT_BALANCE", error: "Recharge karein. 🙏" }, { status: 402 });
      }
    }

    /* ----------------------------- Conversation -------------------------- */
    let convId = requestedConversationId;
    if (!convId) {
      const [newConv] = await db.insert(conversations)
        .values({ userId, title: "New Chat", persona })
        .returning();
      convId = newConv.id;
    }

    /* ----------------------------- Context ------------------------------- */
    const [birthRows, chartRows, previousMessages] = await Promise.all([
      db.select().from(birthDetails).where(eq(birthDetails.userId, userId)).limit(1),
      db.select().from(charts).where(eq(charts.userId, userId)).orderBy(desc(charts.createdAt)).limit(1),
      db.select({ role: messages.role, content: messages.content }).from(messages)
        .where(eq(messages.conversationId, convId))
        .orderBy(desc(messages.createdAt))
        .limit(10),
    ]);

    const [uMsg] = await db.insert(messages)
      .values({ conversationId: convId, userId, role: "user", content: userMessage || "Photo" })
      .returning();
    savedUserMsgId = uMsg.id;

    const personaConfig = PERSONAS[persona];
    const history = previousMessages.reverse().map(m => ({ role: m.role, content: m.content }));

    /* ----------------------------- Kundli Context ------------------------ */
    const birth = birthRows[0];
    const chartRow = chartRows[0]; // 🔥 FIX: Chart data fetch kiya
    let kundliContext = "User birth details not provided yet. Do NOT give specific planetary predictions.";

    if (birth) {
      const genderInfo = birth.gender ? `Gender: ${birth.gender}.` : "Gender: Not specified.";
      kundliContext = `User Name: ${birth.name}. ${genderInfo} DOB: ${birth.dob}, Birth Place: ${birth.birthPlace}.`;
      
      // 🔥 MAIN FIX: Calculated Chart ko context me add kiya
      if (chartRow && chartRow.data) {
        const chartData = chartRow.data as any;
        if (chartData.lagna && chartData.moonSign && chartData.currentDasha) {
          kundliContext += `\n\nUSER'S EXACT CALCULATED KUNDLI (Use this for accurate predictions, do not make up planets):`;
          kundliContext += `\nLagna (Ascendant): ${chartData.lagna.rashiName} (${chartData.lagna.rashiNameHi || ''})`;
          kundliContext += `\nMoon Sign: ${chartData.moonSign.rashiName} (${chartData.moonSign.rashiNameHi || ''})`;
          kundliContext += `\nNakshatra: ${chartData.nakshatra.name} (Pada ${chartData.nakshatra.pada})`;
          
          if (chartData.currentDasha) {
            kundliContext += `\nCurrent Mahadasha: ${chartData.currentDasha.maha.lord} (Ends: ${chartData.currentDasha.maha.end.slice(0,10)})`;
            kundliContext += `\nCurrent Antardasha: ${chartData.currentDasha.antar.lord} (Ends: ${chartData.currentDasha.antar.end.slice(0,10)})`;
          }
          
          if (Array.isArray(chartData.planets)) {
            const planetsStr = chartData.planets.map((p: any) => `${p.planet} in ${p.rashiName} (House ${p.house})${p.retrograde ? ' [Retrograde]' : ''}`).join(', ');
            kundliContext += `\nPlanetary Positions: ${planetsStr}`;
          }
        }
      }
    }

    // 🔥 FIX 3: PREMIUM PSYCHOLOGY + BUSINESS + ASTROLOGY SYSTEM PROMPT
    const systemPrompt = `
You are ${personaConfig.name}, a highly experienced, PREMIUM female Vedic Astrologer.
Your specialization: ${personaConfig.specializations}
Your tone: ${personaConfig.tone}
Your rules: ${personaConfig.rules}

Today's Date is ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}. Year is 2026. Do NOT use 2024/2025.

User Context:
${kundliContext}

🧠 PSYCHOLOGY & BUSINESS MINDSET (CRITICAL):
1. You are a premium consultant. Provide immense value so the user feels their time and money are worth it.
2. Be highly empathetic but authoritative. Validate their feelings, then give a firm astrological direction.
3. ALWAYS end your message with a thought-provoking question. (e.g., "Would you like to know the exact timing for this?" or "Shall we check your birth chart for the exact remedy?"). This keeps the user engaged and increases chat retention.
4. Use the EXACT planetary positions and dashas provided in the User Context above. If the chart is not provided, politely ask for birth details.

🔮 STRICT ASTROLOGY RULES:
1. NEVER hallucinate or make up fake astrological terms (e.g., do NOT invent names like "Shukra Vishnu Dasha").
2. Use ONLY standard Vedic Astrology concepts (Mahadasha, Antardasha, 7th House, Venus, etc.).
3. If the user has provided birth details but the chart is missing, tell them to generate their Kundli first.

🌍 LANGUAGE:
${getLanguageInstruction(language)}

📝 FORMATTING RULES:
1. NEVER use markdown, stars (**), hashtags (#), or bullet points.
2. Output plain text paragraphs with single line breaks.
3. Address the user respectfully according to their Gender (${kundliContext}).
`;

    /* ----------------------------- Build Payload ------------------------- */
    const messagesPayload: any[] = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: userMessage || "Is image ko analyze karo." },
    ];

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = buffer.toString("base64");
      messagesPayload[messagesPayload.length - 1].content = [
        { type: "text", text: userMessage || "Is image ko analyze karo." },
        { type: "image_url", image_url: { url: `data:${imageFile.type};base64,${base64Image}` } },
      ];
    }

    /* ----------------------------- AI Call ------------------------------- */
    const completion = await callGroq(
      { messages: messagesPayload, temperature: 0.4, max_tokens: 1000 },
      Boolean(imageFile)
    );

    let raw = completion.choices[0]?.message?.content?.trim() || "";
    if (!raw) throw new Error("EMPTY_AI_RESPONSE");

    // Strip markdown stars/hashes for safe rendering
    raw = raw.replace(/[\*\#]/g, "");

    /* ----------------------------- Persist Assistant --------------------- */
    const { message, remedy } = extractRemedy(raw);

    const [assistantRow] = await db.insert(messages)
      .values({ conversationId: convId, userId, role: "assistant", content: message })
      .returning();

    let remedyRow: { id: string; title: string; description: string } | null = null;
    if (remedy) {
      try {
        const [r] = await db.insert(remedies)
          .values({ userId, title: remedy.title, description: remedy.description })
          .returning();
        if (r) remedyRow = { id: r.id, title: r.title, description: r.description };
      } catch (remedyErr) {
        console.error("[chat.POST] remedy insert failed:", remedyErr);
      }
    }

    await db.update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, convId));

    /* ----------------------------- Response ------------------------------ */
    const nextWalletBalance =
      !isPremium && deductedType === "wallet"
        ? (user.walletBalancePaise ?? 0) - COST_PER_MESSAGE_PAISE
        : user.walletBalancePaise;

    const nextFreeUsed =
      !isPremium && deductedType === "free"
        ? (user.freeMessagesUsed ?? 0) + 1
        : user.freeMessagesUsed;

    return NextResponse.json({
      success: true,
      conversationId: convId,
      userMessageId: uMsg.id,
      message: { id: assistantRow.id, role: "assistant", content: message },
      remedy: remedyRow,
      balance: {
        walletBalancePaise: nextWalletBalance,
        freeMessagesUsed: nextFreeUsed,
      },
    });
  } catch (error: any) {
    /* ----------------------------- Refund -------------------------------- */
    if (isDeducted && userId) {
      try {
        if (deductedType === "wallet") {
          await db.update(users)
            .set({ walletBalancePaise: sql`${users.walletBalancePaise} + ${COST_PER_MESSAGE_PAISE}` })
            .where(eq(users.id, userId));
        } else if (deductedType === "free") {
          await db.update(users)
            .set({ freeMessagesUsed: sql`GREATEST(${users.freeMessagesUsed} - 1, 0)` })
            .where(eq(users.id, userId));
        }
        console.error(`[chat.POST] refunded ${deductedType} for user ${userId} due to failure`);
      } catch (refundError) {
        console.error("[chat.POST] REFUND FAILED — manual intervention needed:", {
          userId, deductedType, refundError,
        });
      }
    }

    /* ----------------------------- Cleanup orphaned user msg ------------- */
    if (savedUserMsgId) {
      try {
        await db.delete(messages).where(eq(messages.id, savedUserMsgId));
      } catch (delErr) {
        console.error("[chat.POST] orphaned user msg cleanup failed:", delErr);
      }
    }

    console.error("=== GROQ AI ERROR ===");
    console.error("Status:", error?.status);
    console.error("Message:", error?.message);
    console.error("User:", userId, "Lang:", userLang);

    return NextResponse.json(
      { code: "AI_ERROR", error: getAIErrorMessage(userLang) },
      { status: 500 }
    );
  }
}
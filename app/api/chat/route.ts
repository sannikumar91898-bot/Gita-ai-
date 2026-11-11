// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { and, desc, eq, sql, gte, lt } from "drizzle-orm";
import OpenAI from "openai";

import { getUser } from "@/auth";
import { db } from "@/index";
import { birthDetails, charts, conversations, messages, remedies, users } from "@/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ✅ GROQ API CONFIGURATION
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: GROQ_API_KEY || "dummy-key",
});

const COST_PER_MESSAGE_PAISE = 200;
const FREE_MESSAGE_LIMIT = 3;

type PersonaConfig = { name: string; specializations: string; tone: string; rules: string; };

const PERSONAS: Record<string, PersonaConfig> = {
  gita: { name: "Gita", specializations: "Love, relationships", tone: "Warm elder sister. Use 'Suno', 'Main hoon na'.", rules: "Validate pain first." },
  kriti: { name: "Acharya Kriti", specializations: "Career, jobs", tone: "Sharp professional mentor.", rules: "Focus on 10th house." },
  devaki: { name: "Dr. Devaki Shastri", specializations: "KP Astrology", tone: "Authoritative guru.", rules: "Use exact degrees." },
  gargi: { name: "Gargi Maa", specializations: "Spirituality, Vastu", tone: "Maternal, soothing. Calls user 'Beta'.", rules: "Prescribe remedies." },
};

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

// 🔥 10 Languages Helper for Unauthorized Chat Message
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

function extractRemedy(response: string) {
  const marker = "||REMEDY_EXTRACT||";
  const index = response.indexOf(marker);
  if (index === -1) return { message: response.trim(), remedy: null };
  const message = response.slice(0, index).trim();
  const payload = response.slice(index + marker.length).trim();
  if (!payload) return { message, remedy: null };
  const lines = payload.split("\n");
  return { message, remedy: { title: lines[0]?.trim() || "उपाय", description: lines.slice(1).join("\n").trim() } };
}

export async function GET(request: Request) {
  try {
    const user = await getUser();
    // 🔥 Guest ko chat history load karne se roka
    if (!user || user.isGuest) {
      return NextResponse.json({ error: "Registration required to load chat." }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const rawPersona = searchParams.get("persona");
    const persona = isPersona(rawPersona) ? rawPersona : "gita";
    const reqConvId = searchParams.get("conversationId"); 

    let conv;
    if (reqConvId) {
      const [c] = await db.select().from(conversations).where(and(eq(conversations.id, reqConvId), eq(conversations.userId, user.id))).limit(1);
      conv = c;
    } else {
      const [c] = await db.select().from(conversations).where(and(eq(conversations.userId, user.id), eq(conversations.persona, persona))).orderBy(desc(conversations.updatedAt)).limit(1);
      conv = c;
    }
    
    if (!conv) return NextResponse.json({ success: true, conversationId: null, messages: [] });
    const history = await db.select().from(messages).where(eq(messages.conversationId, conv.id)).orderBy(messages.createdAt);
    
    return NextResponse.json({ success: true, conversationId: conv.id, messages: history });
  } catch (error) {
    return NextResponse.json({ error: "Chat history load failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let isDeducted = false;
  let deductedType: "wallet" | "free" | "none" = "none";
  let userId = "";
  let savedUserMsgId = null; 

  try {
    const user = await getUser();
    // 🔥 Guest ko message bhejne se roka (API Protect)
    if (!user || user.isGuest) {
      return NextResponse.json({ error: "Registration required to send messages." }, { status: 401 });
    }
    
    userId = user.id;

    const formData = await request.formData();
    const userMessage = cleanText(formData.get("message"));
    const rawPersona = formData.get("persona");
    const persona = isPersona(rawPersona) ? rawPersona : "gita";
    const language = cleanText(formData.get("language")) || "hinglish"; 
    const requestedConversationId = cleanText(formData.get("conversationId"));
    const imageFile = formData.get("image") as File | null;

    if (!userMessage && !imageFile) return NextResponse.json({ error: "Message khali hai." }, { status: 400 });

    // 🔥 FIX: Conversation Ownership Check (Billing se pehle)
    if (requestedConversationId) {
      const [existingConv] = await db
        .select({ id: conversations.id })
        .from(conversations)
        .where(
          and(
            eq(conversations.id, requestedConversationId),
            eq(conversations.userId, userId)
          )
        )
        .limit(1);

      if (!existingConv) {
        // 🔥 "Error" शब्द हटाकर 10 भाषाओं में सीधा मैसेज दिया है
        return NextResponse.json(
          { error: getUnauthorizedChatMessage(language) },
          { status: 404 }
        );
      }
    }

    // Billing Logic
    const isPremium = Boolean(user.premiumUntil && new Date(user.premiumUntil) > new Date());
    const hasFreeMessages = (user.freeMessagesUsed ?? 0) < FREE_MESSAGE_LIMIT;
    
    if (!isPremium) {
      if (hasFreeMessages) {
        const upd = await db.update(users).set({ freeMessagesUsed: sql`${users.freeMessagesUsed} + 1` }).where(and(eq(users.id, userId), lt(users.freeMessagesUsed, FREE_MESSAGE_LIMIT))).returning();
        if (upd.length === 0) throw new Error("Free messages exhausted");
        isDeducted = true; deductedType = "free";
      } else if ((user.walletBalancePaise ?? 0) >= COST_PER_MESSAGE_PAISE) {
        const upd = await db.update(users).set({ walletBalancePaise: sql`${users.walletBalancePaise} - ${COST_PER_MESSAGE_PAISE}` }).where(and(eq(users.id, userId), gte(users.walletBalancePaise, COST_PER_MESSAGE_PAISE))).returning();
        if (upd.length === 0) throw new Error("Wallet deduction failed");
        isDeducted = true; deductedType = "wallet";
      } else {
        return NextResponse.json({ code: "INSUFFICIENT_BALANCE", error: "Recharge karein. 🙏" }, { status: 402 });
      }
    }

    let convId = requestedConversationId;
    if (!convId) {
      const [newConv] = await db.insert(conversations).values({ userId, title: "New Chat", persona }).returning();
      convId = newConv.id;
    }

    const [birthRows, chartRows, previousMessages] = await Promise.all([
      db.select().from(birthDetails).where(eq(birthDetails.userId, userId)).limit(1),
      db.select().from(charts).where(eq(charts.userId, userId)).orderBy(desc(charts.createdAt)).limit(1),
      db.select({ role: messages.role, content: messages.content }).from(messages).where(eq(messages.conversationId, convId)).orderBy(desc(messages.createdAt)).limit(10),
    ]);

    const [uMsg] = await db.insert(messages).values({ conversationId: convId, userId, role: "user", content: userMessage || "Photo" }).returning();
    savedUserMsgId = uMsg.id;

    const personaConfig = PERSONAS[persona];
    const history = previousMessages.reverse().map(m => ({ role: m.role, content: m.content }));

    // Kundli Context
    const birth = birthRows[0];
    let kundliContext = "Birth details not provided yet.";
    if (birth) {
      kundliContext = `User Name: ${birth.name}. Gender: ${birth.gender}. DOB: ${birth.dob}, Place: ${birth.birthPlace}.`;
    }

    const systemPrompt = `
You are ${personaConfig.name}, a female astrologer. ${personaConfig.tone}
Today's Date is ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}. Year is 2026. Do NOT use 2024/2025.
${getLanguageInstruction(language)}
${kundliContext}
CRITICAL RULES:
1. NEVER use markdown, stars (**), hashtags (#), or bullet points. 
2. Output plain text paragraphs with single line breaks.
3. Address the user according to their Gender.
`;

    // 🔥 CORRECT GROQ MODEL NAMES
    const modelName = imageFile ? "llama-3.2-11b-vision-preview" : "llama-3.3-70b-versatile"; 
    
    const messagesPayload: any[] = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: userMessage || "Is image ko analyze karo." }
    ];

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = buffer.toString("base64");
      messagesPayload[messagesPayload.length - 1].content = [
        { type: "text", text: userMessage || "Is image ko analyze karo." },
        { type: "image_url", image_url: { url: `data:${imageFile.type};base64,${base64Image}` } }
      ];
    }

    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: messagesPayload,
      temperature: 0.4,
      max_tokens: 1000,
    });

    let raw = completion.choices[0]?.message?.content?.trim() || "";
    if (!raw) throw new Error("Empty response from AI");

    raw = raw.replace(/[\*\#]/g, ""); 

    const { message, remedy } = extractRemedy(raw);
    
    await db.insert(messages).values({ conversationId: convId, userId, role: "assistant", content: message });
    await db.update(conversations).set({ updatedAt: new Date() }).where(eq(conversations.id, convId));

    return NextResponse.json({ success: true, conversationId: convId, message: { role: "assistant", content: message }, remedy });

  } catch (error: any) {
    // Refund & Cleanup
    if (isDeducted && userId) {
      if (deductedType === "wallet") await db.update(users).set({ walletBalancePaise: sql`${users.walletBalancePaise} + ${COST_PER_MESSAGE_PAISE}` }).where(eq(users.id, userId));
      if (deductedType === "free") await db.update(users).set({ freeMessagesUsed: sql`GREATEST(${users.freeMessagesUsed} - 1, 0)` }).where(eq(users.id, userId));
    }
    if (savedUserMsgId) await db.delete(messages).where(eq(messages.id, savedUserMsgId)); 

    console.error("=== GROQ AI ERROR ===", error.message || error);
    return NextResponse.json({ code: "AI_ERROR", error: "Server thoda busy hai. Kripya 1 minute baad try karein." }, { status: 500 });
  }
}
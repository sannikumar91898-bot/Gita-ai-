// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { and, desc, eq, sql, gte, lt } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";

import { getUser } from "@/auth";
import { db } from "@/index";
import {
  birthDetails,
  charts,
  conversations,
  messages,
  remedies,
  users 
} from "@/schema";

import { getExtendedKnowledgeEntries } from "@/lib/knowledge/knowledge-adapter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PersonaConfig = {
  name: string;
  specializations: string;
  tone: string;
  rules: string;
};

const PERSONAS: Record<string, PersonaConfig> = {
  gita: {
    name: "Gita",
    specializations: "Love, relationships, modern dating, breakups, and deep emotional bonding",
    tone: "Young, modern, highly energetic, cool, and relatable female astrologer. She speaks like a smart, confident elder sister/friend. NEVER USE THE WORD 'BETA'. Use terms like 'Suno', 'Dekho', 'Hey', 'Tension mat lo', 'Main hoon na'.",
    rules: "Speak with absolute authority and 100% certainty. Directly pinpoint the exact month and year of marriage or breakup recovery using the 7th house and Venus. GYAN PELNA 0%. Never give disclaimers. Sound 100% like a real young female astrologer.",
  },
  kriti: {
    name: "Acharya Kriti",
    specializations: "Career, government jobs, selection tracking, business growth and wealth generation",
    tone: "Sharp, formal, professional, bullet-pointed and commanding Hinglish",
    rules: "Focus straight on the 10th house, Sun and Jupiter transits. Deliver precise, jaw-dropping timelines for promotion, selection or financial gains in structured bullet points. No theoretical lectures.",
  },
  devaki: {
    name: "Dr. Devaki Shastri",
    specializations: "Advanced KP Astrology, complex dasha calculations and absolute chart mapping",
    tone: "Highly calculated, intellectual, serious and authoritative",
    rules: "Use exact planetary degrees and dasha cycles to make undeniable, hard-hitting predictions. Ensure the customer feels your supreme astrological mastery instantly.",
  },
  gargi: {
    name: "Gargi Maa",
    specializations: "Vedic spirituality, Vastu balancing, high-converting traditional remedies and total mental peace",
    tone: "Maternal, soothing, profoundly wise and spiritually grounded Hinglish",
    rules: "Instantly spot negative Vastu dashas or mental blocks. Prescribe powerful, mandatory traditional remedies inspired by Bhagavad Gita (Pooja, Daan, Ratna) to completely shift their luck.",
  },
};

const SUPPORTED_LANGUAGES = ["hi", "hinglish", "en"] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

function cleanText(value: unknown, maxLength = 6000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function isPersona(value: unknown): value is keyof typeof PERSONAS {
  return typeof value === "string" && value in PERSONAS;
}

function getLanguage(value: unknown): SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage) ? (value as SupportedLanguage) : "hinglish";
}

function extractRemedy(response: string) {
  const marker = "||REMEDY_EXTRACT||";
  const index = response.indexOf(marker);
  if (index === -1) return { message: response.trim(), remedy: null as null | { title: string; description: string } };
  const message = response.slice(0, index).trim();
  const payload = response.slice(index + marker.length).trim();
  if (!payload) return { message, remedy: null };
  const lines = payload.split("\n");
  const title = lines[0]?.trim() || "ग्रह शांति महा-उपाय";
  const description = lines.slice(1).join("\n").trim();
  return { message, remedy: description ? { title, description } : null };
}

function getRelevantKnowledge(query: string): string {
  const q = query.toLowerCase();
  const allEntries = getExtendedKnowledgeEntries();
  
  const scoredEntries = allEntries.map((entry) => {
    let score = 0;
    if (entry.keywords) entry.keywords.forEach((kw) => { if (q.includes(kw.toLowerCase())) score += 5; });
    if (entry.aliases) entry.aliases.forEach((alias) => { if (q.includes(alias.toLowerCase())) score += 3; });
    if (entry.question) {
      const words = q.split(" ").filter(w => w.length > 3);
      words.forEach(word => { if (entry.question.toLowerCase().includes(word)) score += 2; });
    }
    return { entry, score };
  });

  const topMatches = scoredEntries.filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
  if (topMatches.length === 0) return "";

  return topMatches.map(({ entry }) => {
    const answerText = entry.answers.hinglish || entry.answers.hi || entry.answers.en || "";
    return `[Context Topic: ${entry.topic.toUpperCase()}]\nAstrological Logic: ${answerText}`;
  }).join("\n\n");
}

async function getOrCreateConversation(userId: string, persona: keyof typeof PERSONAS, topic: string, conversationId?: string) {
  if (conversationId) {
    const [existing] = await db.select().from(conversations).where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId))).limit(1);
    if (!existing) throw new Error("CONVERSATION_NOT_FOUND");
    return existing;
  }
  const [existing] = await db.select().from(conversations).where(and(eq(conversations.userId, userId), eq(conversations.persona, persona))).orderBy(desc(conversations.updatedAt)).limit(1);
  if (existing) return existing;
  const [created] = await db.insert(conversations).values({ userId, title: "New Astro Consultation", topic: topic || "general", persona }).returning();
  if (!created) throw new Error("CONVERSATION_CREATE_FAILED");
  return created;
}

export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Session not found." }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const persona = isPersona(searchParams.get("persona")) ? searchParams.get("persona") as keyof typeof PERSONAS : "gita";

    const conversation = await getOrCreateConversation(user.id, persona, PERSONAS[persona].specializations);
    const history = await db.select({ id: messages.id, role: messages.role, content: messages.content, createdAt: messages.createdAt })
      .from(messages).where(and(eq(messages.conversationId, conversation.id), eq(messages.userId, user.id))).orderBy(desc(messages.createdAt)).limit(50);

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      messages: history.reverse().map((item) => ({ id: item.id, role: item.role === "assistant" ? "assistant" : "user", content: item.content })),
    });
  } catch (error) {
    return NextResponse.json({ error: "Chat history could not be loaded." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Session not found." }, { status: 401 });
    if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: "AI service not configured." }, { status: 503 });

    const COST_PER_MESSAGE_PAISE = 200; // ₹2
    const isPremium = user.premiumUntil && new Date(user.premiumUntil) > new Date();
    const canAffordWallet = user.walletBalancePaise >= COST_PER_MESSAGE_PAISE;
    const hasFreeMessages = user.freeMessagesUsed < 3;

    // 1. Initial Check
    if (!isPremium && !canAffordWallet && !hasFreeMessages) {
      return NextResponse.json({ code: "INSUFFICIENT_BALANCE", error: "Aapka balance khatam ho gaya hai. Kripya recharge karein." }, { status: 402 });
    }

    let body: Record<string, unknown>;
    try {
      const parsed: unknown = await request.json();
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
      body = parsed as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    }

    const userMessage = cleanText(body.message);
    const persona = isPersona(body.persona) ? body.persona : "gita";
    const language = getLanguage(body.language);
    const topic = cleanText(body.topic, 100) || "general";
    const requestedConversationId = cleanText(body.conversationId, 100);

    if (!userMessage) return NextResponse.json({ error: "Please enter a message." }, { status: 400 });

    // 2. 🔥 PRE-DEDUCTION (Paisa pehle katega, race condition se bacho) 🔥
    let deductedType = "none";
    if (!isPremium) {
      if (canAffordWallet) {
        const updated = await db.update(users)
          .set({ walletBalancePaise: sql`${users.walletBalancePaise} - ${COST_PER_MESSAGE_PAISE}` })
          .where(and(eq(users.id, user.id), gte(users.walletBalancePaise, COST_PER_MESSAGE_PAISE)))
          .returning();
        
        if (updated.length === 0) return NextResponse.json({ code: "INSUFFICIENT_BALANCE", error: "Balance insufficient due to concurrent request." }, { status: 402 });
        deductedType = "wallet";
      } else if (hasFreeMessages) {
        const updated = await db.update(users)
          .set({ freeMessagesUsed: sql`${users.freeMessagesUsed} + 1` })
          .where(and(eq(users.id, user.id), lt(users.freeMessagesUsed, 3)))
          .returning();
        
        if (updated.length === 0) return NextResponse.json({ code: "FREE_LIMIT_REACHED", error: "Free limit reached due to concurrent request." }, { status: 402 });
        deductedType = "free";
      }
    }

    const conversation = await getOrCreateConversation(user.id, persona, topic, requestedConversationId || undefined);

    const [birthRows, chartRows, previousMessages] = await Promise.all([
      db.select().from(birthDetails).where(eq(birthDetails.userId, user.id)).limit(1),
      db.select().from(charts).where(eq(charts.userId, user.id)).orderBy(desc(charts.createdAt)).limit(1),
      db.select({ role: messages.role, content: messages.content }).from(messages).where(eq(messages.conversationId, conversation.id)).orderBy(desc(messages.createdAt)).limit(12),
    ]);

    const birth = birthRows[0];
    const chart = chartRows[0];
    const personaConfig = PERSONAS[persona];
    const relevantKnowledge = getRelevantKnowledge(userMessage);

    const astrologyContext = [
      birth ? `Name: ${birth.name}\nDOB: ${birth.dob}\nTime: ${birth.birthTime}\nPlace: ${birth.birthPlace}` : "Birth details not available.",
      chart?.data ? `Chart data: ${JSON.stringify(chart.data).slice(0, 10000)}` : "No chart available.",
    ].join("\n\n");

    // 3. 🔥 ETHICAL & VALUE-BASED PROMPT 🔥
    let instructionPrompt = "";
    const freeMessagesLeft = 3 - (user.freeMessagesUsed || 0);

    if (!isPremium && !canAffordWallet) { 
      if (freeMessagesLeft === 1) {
        instructionPrompt = `🚨 THIS IS THE USER'S 3RD AND FINAL FREE MESSAGE. 
YOUR GOAL: Provide an incredibly valuable, highly accurate prediction about their situation. Give them a specific time frame. 
Then, tell them gently that for the detailed remedy and full roadmap to solve this, they need to recharge their wallet. Do NOT use fear. Use value. Make them feel that paying for the full solution is the obvious next step.`;
      } else {
        instructionPrompt = `🚨 USER IS A FREE USER. 
YOUR GOAL: Validate their pain with deep empathy. Give them an accurate astrological reason for their problem. Give them a small, free remedy that helps them immediately, but save the "Maha-Upay" (Master Remedy) for the paid version.`;
      }
    } else {
      instructionPrompt = `🚨 USER IS A PAID/PREMIUM CUSTOMER. 
YOUR GOAL: Give the user the ACTUAL, FULL SOLUTION. Analyze their chart deeply, find the exact dosha, and give exact remedies. Tell them exactly when their problem will be solved. Give them 10x the value of what they paid.`;
    }

    const systemPrompt = `
You are the absolute premium, elite human female Astrologer named "${personaConfig.name}" from AstroPandit.

YOUR TONE: ${personaConfig.tone}
YOUR RULES: ${personaConfig.rules}

🔴 USER'S BIRTH DETAILS:
${astrologyContext}

🔴 KNOWLEDGE BASE:
${relevantKnowledge ? relevantKnowledge : "Use general Vedic principles."}

${instructionPrompt}

CRITICAL LAWS:
1. 100% CONFIDENCE: Never use 'maybe'. Always state 'This WILL happen'.
2. HARD TIMELINES: Give exact date/month brackets.
3. REMEDIES: Prescribe 1-2 traditional Upay. At the very end, append exactly:
||REMEDY_EXTRACT||
Remedy Title
Description
4. NEVER say you are AI.
5. LANGUAGE: Reply only in the user's selected language (${language === "hi" ? "pure Hindi (Devanagari)" : language === "en" ? "English" : "natural Hinglish"}).
`.trim();

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const contents = previousMessages.reverse().map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    contents.push({ role: "user", parts: [{ text: userMessage }] });

    let rawReply = "";
    let isError = false;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", 
        contents: contents,
        config: { systemInstruction: systemPrompt, temperature: 0.75, maxOutputTokens: 1500 },
      });
      rawReply = response.text || "";
    } catch (apiError: any) {
      console.error("Gemini API Limit Error:", apiError);
      isError = true;
    }

    if (!rawReply) { isError = true; }

    // 4. 🔥 REFUND LOGIC (Agar AI fail hua, toh paise wapas karo) 🔥
    if (isError) {
      if (deductedType === "wallet") {
        await db.update(users).set({ walletBalancePaise: sql`${users.walletBalancePaise} + ${COST_PER_MESSAGE_PAISE}` }).where(eq(users.id, user.id));
      } else if (deductedType === "free") {
        await db.update(users).set({ freeMessagesUsed: sql`${users.freeMessagesUsed} - 1` }).where(eq(users.id, user.id));
      }
      
      const errorMsg = "Kuch takniki karanon se jawab nahi aa paya. Aapka paisa/msg wapas kar diya gaya hai. Kripya thodi der baad try karein.";
      return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
    }

    const extracted = extractRemedy(rawReply);
    const finalMessage = extracted.message;
    const remedy = extracted.remedy;

    // 5. Save Messages & Remedy
    try {
      await db.transaction(async (tx) => {
        await tx.insert(messages).values({ conversationId: conversation.id, userId: user.id, role: "user", content: userMessage });
        await tx.insert(messages).values({ conversationId: conversation.id, userId: user.id, role: "assistant", content: finalMessage });

        if (remedy) {
          await tx.insert(remedies).values({ userId: user.id, title: remedy.title, description: remedy.description });
        }
      });
    } catch (saveError) {
      console.error("Failed to save chat messages:", saveError);
      return NextResponse.json({ success: false, error: "Database save failed." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      reply: finalMessage,
      remedy: remedy ? { title: remedy.title, description: remedy.description } : null,
    });

  } catch (error) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
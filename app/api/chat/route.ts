// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { and, desc, eq, sql, gte } from "drizzle-orm";
import OpenAI from "openai";

import { getUser } from "@/auth";
import { db } from "@/index";
import {
  birthDetails,
  charts,
  conversations,
  messages,
  remedies,
  users,
} from "@/schema";

import { getExtendedKnowledgeEntries } from "@/lib/knowledge/knowledge-adapter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
/*                     🚨 MODAL ENDPOINT CONFIGURATION                        */
/* -------------------------------------------------------------------------- */

const MODAL_API_URL = process.env.MODAL_API_URL;
const MODAL_API_KEY_ID = process.env.MODAL_API_KEY; // wk-...
const MODAL_API_SECRET = process.env.MODAL_API_SECRET; // ws-...
const MODAL_MODEL = process.env.MODAL_MODEL_NAME || "Qwen/Qwen3.6-35B-A3B";

if (!MODAL_API_URL) {
  console.error("[FATAL] MODAL_API_URL is not set in Environment Variables!");
}

// 🔥 Dono keys ko combine karke Bearer Token banaya
let finalApiKey = "dummy-key";
if (MODAL_API_KEY_ID && MODAL_API_SECRET) {
  finalApiKey = `${MODAL_API_KEY_ID}.${MODAL_API_SECRET}`;
} else if (MODAL_API_KEY_ID) {
  finalApiKey = MODAL_API_KEY_ID; 
}

const openai = new OpenAI({
  baseURL: MODAL_API_URL || "http://localhost:8000/v1", 
  apiKey: finalApiKey,
  timeout: 40_000, 
  maxRetries: 1,
});

/* -------------------------------------------------------------------------- */
/*                              CONSTANTS                                     */
/* -------------------------------------------------------------------------- */

const COST_PER_MESSAGE_PAISE = 200;
const FREE_MESSAGE_LIMIT = 3;

/* -------------------------------------------------------------------------- */
/*                              PERSONAS                                      */
/* -------------------------------------------------------------------------- */

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
    tone: "A warm, loving, and deeply empathetic young female astrologer. She talks like a caring elder sister who genuinely wants to protect the user. Use words like 'Suno', 'Tum tension mat lo', 'Main hoon na'. Speak with ultimate confidence but wrap it in deep affection and psychology.",
    rules: "Validate the user's pain first (Psychology). Tell them it's not their fault. Then, use astrology to pinpoint exactly why it's happening (7th house, Venus). Give a timeline. Make the user feel heard and cared for.",
  },
  kriti: {
    name: "Acharya Kriti",
    specializations: "Career, government jobs, selection tracking, business growth and wealth generation",
    tone: "A sharp, highly intelligent, and professional female mentor. She is direct but deeply invested in the user's success. She uses powerful, motivating language.",
    rules: "Focus straight on the 10th house and Saturn/Jupiter transits. Deliver precise, jaw-dropping timelines. Use bullet points. Make the user feel that their success is her personal mission.",
  },
  devaki: {
    name: "Dr. Devaki Shastri",
    specializations: "Advanced KP Astrology, complex dasha calculations and absolute chart mapping",
    tone: "A highly intellectual, serious, and authoritative older female guru. She commands immense respect and speaks with absolute divine authority.",
    rules: "Use exact planetary degrees and dasha cycles to make undeniable predictions. Ensure the customer feels your supreme astrological mastery instantly.",
  },
  gargi: {
    name: "Gargi Maa",
    specializations: "Vedic spirituality, Vastu balancing, high-converting traditional remedies and total mental peace",
    tone: "A maternal, soothing, and profoundly wise spiritual figure. She speaks with extreme love and spiritual depth. Calls the user 'Beta' but with deep emotion.",
    rules: "Instantly spot negative Vastu dashas or mental blocks. Prescribe powerful remedies (Pooja, Daan) with motherly affection to completely shift their luck.",
  },
};

/* -------------------------------------------------------------------------- */
/*                              HELPERS                                       */
/* -------------------------------------------------------------------------- */

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
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)
    ? (value as SupportedLanguage)
    : "hinglish";
}

function extractRemedy(response: string) {
  const marker = "||REMEDY_EXTRACT||";
  const index = response.indexOf(marker);
  if (index === -1)
    return {
      message: response.trim(),
      remedy: null as null | { title: string; description: string },
    };
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
      const words = q.split(" ").filter((w) => w.length > 3);
      words.forEach((word) => { if (entry.question.toLowerCase().includes(word)) score += 2; });
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

/* -------------------------------------------------------------------------- */
/*                                   GET                                      */
/* -------------------------------------------------------------------------- */

export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Session not found." }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const persona = isPersona(searchParams.get("persona")) ? (searchParams.get("persona") as keyof typeof PERSONAS) : "gita";

    const conversation = await getOrCreateConversation(user.id, persona, PERSONAS[persona].specializations);

    const history = await db.select({ id: messages.id, role: messages.role, content: messages.content, createdAt: messages.createdAt })
      .from(messages).where(and(eq(messages.conversationId, conversation.id), eq(messages.userId, user.id))).orderBy(desc(messages.createdAt)).limit(50);

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      messages: history.reverse().map((item) => ({
        id: item.id,
        role: item.role === "assistant" ? "assistant" : "user",
        content: item.content,
      })),
    });
  } catch (error) {
    console.error("[chat.GET] failed:", error);
    return NextResponse.json({ error: "Chat history could not be loaded." }, { status: 500 });
  }
}

/* -------------------------------------------------------------------------- */
/*                                   POST                                     */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  let isDeducted = false;
  let deductedType: "wallet" | "free" | "none" = "none";
  let userId = "";
  let personaName = "Astrologer";

  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Session not found." }, { status: 401 });
    userId = user.id;

    const isPremium = Boolean(user.premiumUntil && new Date(user.premiumUntil) > new Date());
    const canAffordWallet = (user.walletBalancePaise ?? 0) >= COST_PER_MESSAGE_PAISE;
    const hasFreeMessages = (user.freeMessagesUsed ?? 0) < FREE_MESSAGE_LIMIT;

    if (!isPremium && !canAffordWallet && !hasFreeMessages) {
      return NextResponse.json({ code: "INSUFFICIENT_BALANCE", error: "Aapka balance khatam ho gaya hai. Kripya recharge karein. 🙏" }, { status: 402 });
    }

    let userMessage = "";
    let personaRaw = "gita";
    let languageRaw = "hinglish";
    let topicRaw = "general";
    let requestedConversationId = "";
    let hasImage = false;

    try {
      const formData = await request.formData();
      userMessage = cleanText(formData.get("message"));
      personaRaw = cleanText(formData.get("persona")) || "gita";
      languageRaw = cleanText(formData.get("language")) || "hinglish";
      topicRaw = cleanText(formData.get("topic")) || "general";
      requestedConversationId = cleanText(formData.get("conversationId"));
      hasImage = formData.get("image") instanceof File;
    } catch {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }

    const persona = isPersona(personaRaw) ? personaRaw : "gita";
    const language = getLanguage(languageRaw);
    const topic = topicRaw;
    personaName = PERSONAS[persona].name;

    if (hasImage) {
      return NextResponse.json({ code: "IMAGE_NOT_SUPPORTED", error: "Abhi image se sawaal puchhna available nahi hai. Kripya apna sawaal text mein likhein. 🙏" }, { status: 422 });
    }

    if (!userMessage) return NextResponse.json({ error: "Please apna sawaal likhein." }, { status: 400 });

    if (!isPremium) {
      if (canAffordWallet) {
        const updated = await db.update(users).set({ walletBalancePaise: sql`${users.walletBalancePaise} - ${COST_PER_MESSAGE_PAISE}` }).where(and(eq(users.id, userId), gte(users.walletBalancePaise, COST_PER_MESSAGE_PAISE))).returning({ walletBalancePaise: users.walletBalancePaise });
        if (updated.length === 0) return NextResponse.json({ code: "INSUFFICIENT_BALANCE", error: "Wallet balance is insufficient." }, { status: 402 });
        isDeducted = true;
        deductedType = "wallet";
      } else if (hasFreeMessages) {
        const updated = await db.update(users).set({ freeMessagesUsed: sql`${users.freeMessagesUsed} + 1` }).where(eq(users.id, userId)).returning({ freeMessagesUsed: users.freeMessagesUsed });
        if (updated.length === 0) return NextResponse.json({ error: "Could not start free trial." }, { status: 500 });
        isDeducted = true;
        deductedType = "free";
      } else {
        return NextResponse.json({ code: "INSUFFICIENT_BALANCE", error: "Aapka balance khatam ho gaya hai." }, { status: 402 });
      }
    }

    const conversation = await getOrCreateConversation(userId, persona, topic, requestedConversationId || undefined);

    const [birthRows, chartRows, previousMessages] = await Promise.all([
      db.select().from(birthDetails).where(eq(birthDetails.userId, userId)).limit(1),
      db.select().from(charts).where(eq(charts.userId, userId)).orderBy(desc(charts.createdAt)).limit(1),
      db.select({ role: messages.role, content: messages.content }).from(messages).where(eq(messages.conversationId, conversation.id)).orderBy(desc(messages.createdAt)).limit(12),
    ]);

    const [userMsgRow] = await db.insert(messages).values({ conversationId: conversation.id, userId, role: "user", content: userMessage }).returning();

    const personaConfig = PERSONAS[persona];
    
    const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const currentYear = new Date().getFullYear();
    
    const languageInstruction =
      language === "hi"
        ? "CRITICAL: Reply ONLY in pure Hindi (Devanagari script)."
        : language === "en"
        ? "CRITICAL: Reply ONLY in English."
        : "CRITICAL: Reply ONLY in Hinglish (Roman-script Hindi mixed naturally with English). DO NOT use pure English. Address the user affectionately.";

    const birth = birthRows[0];
    const chart = chartRows[0];
    const knowledge = getRelevantKnowledge(userMessage);

    const systemPrompt = [
      `You are ${personaConfig.name}, a real female astrologer. ${personaConfig.tone}`,
      `Your Specializations: ${personaConfig.specializations}.`,
      `Strict Rules: ${personaConfig.rules}`,
      `Today's Date is: ${today} (Year ${currentYear}). You MUST calculate all timelines and dashas based on ${currentYear}. DO NOT mention past years like 2024 or 2025.`,
      languageInstruction,
      `Never break character. You are strictly ${personaConfig.name}. If user asks who you are, say your name.`,
      birth ? `User Birth Details: ${JSON.stringify(birth).slice(0, 1500)}` : "",
      chart ? `User Kundli Data: ${JSON.stringify(chart).slice(0, 2500)}` : "",
      knowledge ? `Reference Astrological Knowledge:\n${knowledge}` : "",
      `If you want to attach a remedy, output it AFTER the marker ||REMEDY_EXTRACT|| on its own line.`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const history = previousMessages.slice().reverse().map((m) => ({
        role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: m.content,
    }));

    const completion = await openai.chat.completions.create({
      model: MODAL_MODEL,
      messages: [{ role: "system", content: systemPrompt }, ...history, { role: "user", content: userMessage }],
      temperature: 0.6,
      max_tokens: 1200,
    });

    const rawResponse = completion.choices[0]?.message?.content?.trim() || "";
    if (!rawResponse) throw new Error("EMPTY_AI_RESPONSE");

    const { message: cleanMessage, remedy } = extractRemedy(rawResponse);
    const [assistantRow] = await db.insert(messages).values({ conversationId: conversation.id, userId, role: "assistant", content: cleanMessage }).returning();

    let remedyRow: { id: string; title: string; description: string } | null = null;
    if (remedy) {
      try {
        const [r] = await db.insert(remedies).values({ userId, title: remedy.title, description: remedy.description }).returning();
        if (r) remedyRow = { id: r.id, title: r.title, description: r.description };
      } catch (remedyErr) { console.error("[chat.POST] remedy insert failed:", remedyErr); }
    }

    await db.update(conversations).set({ updatedAt: new Date() }).where(eq(conversations.id, conversation.id));

    const nextWalletBalance = !isPremium && deductedType === "wallet" ? user.walletBalancePaise - COST_PER_MESSAGE_PAISE : user.walletBalancePaise;
    const nextFreeUsed = !isPremium && deductedType === "free" ? (user.freeMessagesUsed ?? 0) + 1 : user.freeMessagesUsed;

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      userMessageId: userMsgRow?.id ?? null,
      message: { id: assistantRow?.id ?? null, role: "assistant", content: cleanMessage },
      remedy: remedyRow,
      balance: { walletBalancePaise: nextWalletBalance, freeMessagesUsed: nextFreeUsed },
    });

  } catch (error) {
    if (isDeducted && userId) {
      try {
        if (deductedType === "wallet") {
          await db.update(users).set({ walletBalancePaise: sql`${users.walletBalancePaise} + ${COST_PER_MESSAGE_PAISE}` }).where(eq(users.id, userId));
        } else if (deductedType === "free") {
          await db.update(users).set({ freeMessagesUsed: sql`GREATEST(${users.freeMessagesUsed} - 1, 0)` }).where(eq(users.id, userId));
        }
      } catch (refundError) { console.error("[chat.POST] REFUND FAILED:", refundError); }
    }

    const message = error instanceof Error ? error.message : String(error);
    console.error("[chat.POST] failed:", { userId, deductedType, message });

    return NextResponse.json(
      {
        code: "ASTROLOGER_UNAVAILABLE",
        error: `${personaName} abhi thodi der ke liye busy hain. Aapka paisa safe hai. Kripya 1 minute baad try karein. 🙏`,
      },
      { status: 500 }
    );
  }
}
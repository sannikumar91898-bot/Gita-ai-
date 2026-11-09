// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { and, desc, eq, sql, gte, lt } from "drizzle-orm";
import OpenAI from "openai"; 

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

// 🔥 MODAL ENDPOINT CONFIGURATION 🔥
const openai = new OpenAI({
  baseURL: process.env.MODAL_API_URL || "https://modal.com",
  apiKey: process.env.MODAL_API_KEY || "dummy-key",
});

const MODAL_MODEL = process.env.MODAL_MODEL_NAME || "Qwen/Qwen3.6-35B-A3B";

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
  let isDeducted = false;
  let deductedType: "wallet" | "free" | "none" = "none";
  let userId = "";

  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Session not found." }, { status: 401 });
    userId = user.id;

    const COST_PER_MESSAGE_PAISE = 200; 
    const isPremium = user.premiumUntil && new Date(user.premiumUntil) > new Date();
    const canAffordWallet = user.walletBalancePaise >= COST_PER_MESSAGE_PAISE;
    const hasFreeMessages = user.freeMessagesUsed < 3;

    if (!isPremium && !canAffordWallet && !hasFreeMessages) {
      return NextResponse.json({ code: "INSUFFICIENT_BALANCE", error: "Aapka balance khatam ho gaya hai. Kripya recharge karein." }, { status: 402 });
    }

    let userMessage = "";
    let personaRaw = "gita";
    let languageRaw = "hinglish";
    let topicRaw = "general";
    let requestedConversationId = "";
    let imageFile: File | null = null;

    try {
      const formData = await request.formData();
      userMessage = cleanText(formData.get("message"));
      personaRaw = cleanText(formData.get("persona")) || "gita";
      languageRaw = cleanText(formData.get("language")) || "hinglish";
      topicRaw = cleanText(formData.get("topic")) || "general";
      requestedConversationId = cleanText(formData.get("conversationId"));
      imageFile = formData.get("image") as File | null;
    } catch {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }

    const persona = isPersona(personaRaw) ? personaRaw : "gita";
    const language = getLanguage(languageRaw);
    const topic = topicRaw;

    if (!userMessage && !imageFile) return NextResponse.json({ error: "Please enter a message or upload an image." }, { status: 400 });

    const conversation = await getOrCreateConversation(userId, persona, topic, requestedConversationId || undefined);

    const [birthRows, chartRows, previousMessages] = await Promise.all([
      db.select().from(birthDetails).where(eq(birthDetails.userId, userId)).limit(1),
      db.select().from(charts).where(eq(charts.userId, userId)).orderBy(desc(charts.createdAt)).limit(1),
      db.select({ role: messages.role, content: messages.content }).from(messages).where(eq(messages.conversationId, conversation.id)).orderBy(desc(messages.createdAt)).limit(12),
    ]);

    if (!isPremium) {
      if (canAffordWallet) {
        const updated = await db.update(users)
          .set({ walletBalancePaise: sql`${users.walletBalancePaise} - ${COST_PER_MESSAGE_PAISE}` })

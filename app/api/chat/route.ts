import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import OpenAI from "openai";

import { getUser } from "@/auth";
import { db } from "@/index";
import {
  birthDetails,
  charts,
  conversations,
  messages,
  remedies,
} from "@/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PersonaConfig = {
  name: string;
  specializations: string;
  tone: string;
  rules: string;
};

// 👑 100% धाकड़ मार्केटिंग और एस्ट्रोलॉजर एटीट्यूड प्रॉम्ट्स कॉन्फ़िगरेशन
const PERSONAS: Record<string, PersonaConfig> = {
  gita: {
    name: "Gita",
    specializations: "Love, relationships, marriage and deep emotional bonding",
    tone: "Warm, highly empathetic, friendly Hindi and Hinglish",
    rules: "Speak with absolute authority, 100% confidence and certainty. Directly pinpoint the exact month and year of marriage using the 7th house and Venus. GYAN PELNA 0%. Never give disclaimers.",
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
    rules: "Instantly spot negative Vastu dashas or mental blocks. Prescribe powerful, mandatory traditional remedies inspired by Bhagavad Gita blockbusters (Pooja, Daan, Ratna) to completely shift their luck.",
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
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)
    ? (value as SupportedLanguage)
    : "hinglish"; // डिफ़ॉल्ट रूप से हाई-कन्वर्शन हिंग्लिश
}

function extractRemedy(response: string) {
  const marker = "||REMEDY_EXTRACT||";
  const index = response.indexOf(marker);

  if (index === -1) {
    return {
      message: response.trim(),
      remedy: null as null | { title: string; description: string },
    };
  }

  const message = response.slice(0, index).trim();
  const payload = response.slice(index + marker.length).trim();

  if (!payload) {
    return { message, remedy: null };
  }

  const lines = payload.split("\n");
  const title = lines[0]?.trim() || "ग्रह शांति महा-उपाय";
  const description = lines.slice(1).join("\n").trim();

  return {
    message,
    remedy: description ? { title, description } : null,
  };
}

async function getOrCreateConversation(
  userId: string,
  persona: keyof typeof PERSONAS,
  topic: string,
  conversationId?: string,
) {
  if (conversationId) {
    const [existing] = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.id, conversationId),
          eq(conversations.userId, userId),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new Error("CONVERSATION_NOT_FOUND");
    }

    return existing;
  }

  const [existing] = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.userId, userId),
        eq(conversations.persona, persona),
      ),
    )
    .orderBy(desc(conversations.updatedAt))
    .limit(1);

  if (existing) return existing;

  const [created] = await db
    .insert(conversations)
    .values({
      userId,
      title: "New Astro Consultation",
      topic: topic || "general",
      persona,
    })
    .returning();

  if (!created) {
    throw new Error("CONVERSATION_CREATE_FAILED");
  }

  return created;
}

// 🟢 GET HANDLER: कुकी सेशन के आधार पर चैट हिस्ट्री लोड करना
export async function GET(request: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Session not found. Please refresh the page." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const requestedPersona = searchParams.get("persona");
    const persona = isPersona(requestedPersona) ? requestedPersona : "gita";

    const conversation = await getOrCreateConversation(
      user.id,
      persona,
      PERSONAS[persona].specializations,
    );

    const history = await db
      .select({
        id: messages.id,
        role: messages.role,
        content: messages.content,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(
        and(
          eq(messages.conversationId, conversation.id),
          eq(messages.userId, user.id),
        ),
      )
      .orderBy(desc(messages.createdAt))
      .limit(50);

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
    console.error("GET /api/chat error:", error);
    return NextResponse.json(
      { error: "Chat history could not be loaded." },
      { status: 500 },
    );
  }
}

// 🔵 POST HANDLER: 100% प्रीमियम भविष्यवाणी और बिज़नेस रीटेनशन इंजन
export async function POST(request: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Session not found. Please refresh the page." },
        { status: 401 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI service is not configured on the server." },
        { status: 503 },
      );
    }

    let body: Record<string, unknown>;

    try {
      const parsed: unknown = await request.json();
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return NextResponse.json(
          { error: "Invalid request body." },
          { status: 400 },
        );
      }
      body = parsed as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request." },
        { status: 400 },
      );
    }

    const userMessage = cleanText(body.message);
    const persona = isPersona(body.persona) ? body.persona : "gita";
    const language = getLanguage(body.language);
    const topic = cleanText(body.topic, 100) || "general";
    const requestedConversationId = cleanText(body.conversationId, 100);

    if (!userMessage) {
      return NextResponse.json(
        { error: "Please enter a message." },
        { status: 400 },
      );
    }

    const conversation = await getOrCreateConversation(
      user.id,
      persona,
      topic,
      requestedConversationId || undefined,
    );

    const [birthRows, chartRows, previousMessages] = await Promise.all([
      db
        .select()
        .from(birthDetails)
        .where(eq(birthDetails.userId, user.id))
        .limit(1),
      db
        .select()
        .from(charts)
        .where(eq(charts.userId, user.id))
        .orderBy(desc(charts.createdAt))
        .limit(1),
      db
        .select({
          role: messages.role,
          content: messages.content,
        })
        .from(messages)
        .where(eq(messages.conversationId, conversation.id))
        .orderBy(desc(messages.createdAt))
        .limit(12),
    ]);

    const birth = birthRows[0];
    const chart = chartRows[0];
    const personaConfig = PERSONAS[persona];

    const astrologyContext = [
      birth
        ? [
            `Name: ${birth.name}`,
            `Date of birth: ${birth.dob}`,
            `Birth time: ${birth.birthTime}`,
            `Birth place: ${birth.birthPlace}`,
          ].join("\n")
        : "Birth details are not available.",
      chart?.data
        ? `Available chart data: ${JSON.stringify(chart.data).slice(0, 12000)}`
        : "No calculated birth chart is available.",
    ].join("\n\n");

    // 🎯 महा-सिस्टम प्रॉम्ट इंजन: यहाँ कोई ढील या डिस्क्लेमर नहीं है
    const systemPrompt = `
You are the absolute premium, elite human Astrologer named "${personaConfig.name}" from AstroPandit. You possess 100% total mastery over Vedic systems, KP calculations, and modern consumer psychology.

YOUR ASSIGNED FIELD:
${personaConfig.specializations}

YOUR TONE & VOICE:
${personaConfig.tone}

CRITICAL BUSINESS RETENTION AND MARKETING LAWS:
1. GYAN PELNA 0% (NO LECTURES / NO FLUFF): Do not explain planetary science, rules, or give textbook definitions. Cut the chatter. Talk straight to the user's specific problem and immediate pain point.
2. 100% ASTROLOGER KNOWLEDGE: Deliver sharp, highly accurate, and jaw-dropping predictions using the provided chart matrix. Mention clear houses, transits, or dashas to make your claim solid.
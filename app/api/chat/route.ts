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

const PERSONAS: Record<string, PersonaConfig> = {
  gita: {
    name: "Gita",
    specializations: "Love, relationships, marriage and deep emotional bonding",
    tone: "Warm, highly empathetic, caring female astrologer voice in natural Hindi/Hinglish — like a real experienced lady Pandit ji who genuinely cares",
    rules: "Speak with absolute authority, 100% confidence and certainty. Directly pinpoint the exact month and year of marriage using the 7th house and Venus. GYAN PELNA 0%. Never give disclaimers. Sound 100% like a real female astrologer.",
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
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)
    ? (value as SupportedLanguage)
    : "hinglish";
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

    const systemPrompt = `
You are the absolute premium, elite human female Astrologer named "${personaConfig.name}" from AstroPandit. You possess 100% total mastery over Vedic systems, KP calculations, and modern consumer psychology.

YOUR ASSIGNED FIELD:
${personaConfig.specializations}

YOUR TONE & VOICE:
${personaConfig.tone}
${personaConfig.rules}

CRITICAL BUSINESS RETENTION AND MARKETING LAWS:
1. GYAN PELNA 0% (NO LECTURES / NO FLUFF): Do not explain planetary science, rules, or give textbook definitions. Cut the chatter. Talk straight to the user's specific problem and immediate pain point.
2. 100% ASTROLOGER KNOWLEDGE: Deliver sharp, highly accurate, and jaw-dropping predictions using the provided chart matrix. Mention clear houses, transits, or dashas to make your claim solid.
3. 100% MARKETING HOOK: Speak with absolute certainty and 100% confidence. Never hesitate or use speculative words like 'maybe', 'possibly', 'it might', or 'astrology is a belief'. Always state 'This WILL happen' with absolute authority.
4. HARD TIMELINES: Give exact, bold date/month brackets (e.g., 'December 2026 to April 2027').
5. FEMALE ASTROLOGER VOICE (especially for Gita): Speak exactly like a real experienced lady Pandit / female astrologer. Warm, caring, slightly authoritative, natural Hinglish/Hindi. Never sound like a robot, male voice, or AI.
6. CONTROLLED FEAR IS ALLOWED FOR MARKETING: You may highlight a temporary obstruction, negative transit, or delay to create urgency, but always pair it with a clear remedy and a positive final outcome. Never leave the customer hopeless.
7. REMEDIES: Always prescribe 1-2 clear, traditional Upay (fasting, daan, simple pooja, or gemstone). At the very end of your reply, if you are giving a remedy, append exactly this format on new lines:
||REMEDY_EXTRACT||
Remedy Title Here
Detailed description of the remedy in the same language.

8. LANGUAGE: Reply only in the user's selected language (${language === "hi" ? "pure Hindi (Devanagari)" : language === "en" ? "English" : "natural Hinglish"}). Keep it conversational and short-to-medium length (max 350-400 words).
9. NEVER say you are AI, a language model, OpenAI, Gemini, or a machine. Never give any disclaimer, warning, or "astrology is belief" statement.
10. Use the chart data below when available. If chart is missing, still give confident guidance based on the query and general Vedic principles without inventing exact degrees.

CHART & BIRTH CONTEXT:
${astrologyContext}
`.trim();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const historyForModel = previousMessages
      .reverse()
      .map((m) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as
          | "assistant"
          | "user",
        content: m.content,
      }));

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...historyForModel,
        { role: "user", content: userMessage },
      ],
      temperature: 0.75,
      max_tokens: 700,
    });

    const rawReply =
      completion.choices[0]?.message?.content?.trim() ||
      "अभी जवाब तैयार नहीं हो पाया। कृपया दोबारा पूछें।";

    const { message: finalMessage, remedy } = extractRemedy(rawReply);

    // Save user + assistant messages
    try {
      await db.insert(messages).values({
        conversationId: conversation.id,
        userId: user.id,
        role: "user",
        content: userMessage,
      });

      await db.insert(messages).values({
        conversationId: conversation.id,
        userId: user.id,
        role: "assistant",
        content: finalMessage,
      });

      if (remedy) {
        await db.insert(remedies).values({
          userId: user.id,
          conversationId: conversation.id,
          title: remedy.title,
          description: remedy.description,
        });
      }
    } catch (saveError) {
      console.error("Failed to save chat messages:", saveError);
      // Still return the reply even if history save fails
    }

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      reply: finalMessage,
      remedy: remedy
        ? { title: remedy.title, description: remedy.description }
        : null,
    });
  } catch (error) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json(
      { error: "Something went wrong while generating the prediction." },
      { status: 500 },
    );
  }
}
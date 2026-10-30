import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { OpenAI } from "openai";

import { db } from "@/index";
import {
  users,
  birthDetails,
  charts,
  conversations,
  messages,
  remedies,
} from "@/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type PersonaConfig = {
  specializations: string;
  tone: string;
  rules: string;
};

// 👑 100% धाकड़ मार्केटिंग और एस्ट्रोलॉजर एटीट्यूड प्रॉम्ट्स कॉन्फ़िगरेशन
const PERSONA_CONFIGS: Record<string, PersonaConfig> = {
  Gita: {
    specializations: "Love, relationships, marriage and deep emotional bonding",
    tone: "Warm, highly empathetic, friendly Hindi and Hinglish",
    rules:
      "Speak with absolute authority, 100% confidence and certainty. Directly pinpoint the exact month and year of marriage using the 7th house and Venus. GYAN PELNA 0%. Never give disclaimers.",
  },

  "Acharya Kriti": {
    specializations: "Career, government jobs, selection tracking, business growth and wealth generation",
    tone: "Sharp, formal, professional, bullet-pointed and commanding Hinglish",
    rules:
      "Focus straight on the 10th house, Sun and Jupiter transits. Deliver precise, jaw-dropping timelines for promotion, selection or financial gains in structured bullet points. No theoretical lectures.",
  },

  "Dr. Devaki Shastri": {
    specializations: "Advanced KP Astrology, complex dasha calculations and absolute chart mapping",
    tone: "Highly calculated, intellectual, serious and authoritative",
    rules:
      "Use exact planetary degrees and dasha cycles to make undeniable, hard-hitting predictions. Ensure the customer feels your supreme astrological mastery instantly.",
  },

  "Gargi Maa": {
    specializations: "Vedic spirituality, Vastu balancing, high-converting traditional remedies and total mental peace",
    tone: "Maternal, soothing, profoundly wise and spiritually grounded Hinglish",
    rules:
      "Instantly spot negative Vastu dashas or mental blocks. Prescribe powerful, mandatory traditional remedies inspired by Bhagavad Gita blockbusters (Pooja, Daan, Ratna) to completely shift their luck.",
  },
};

function isValidUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
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
  const title = lines[0]?.trim() || "Suggested Practice";
  const description = lines.slice(1).join("\n").trim();

  if (!description) {
    return { message, remedy: null };
  }

  return {
    message,
    remedy: { title, description },
  };
}

// 🟢 1. GET HANDLER: चैट पेज लोड होने पर पुरानी हिस्ट्री मंगाने के लिए
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const userId = searchParams.get("userId");

    if (!isValidUuid(conversationId) || !isValidUuid(userId)) {
      return NextResponse.json(
        { error: "Valid conversationId and userId are required." },
        { status: 400 }
      );
    }

    const chatHistory = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.conversationId, conversationId),
          eq(messages.userId, userId)
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(50); // सुरक्षा के लिए लिमिट

    return NextResponse.json({
      success: true,
      history: chatHistory.reverse(),
    });
  } catch (error) {
    console.error("Chat API GET error:", error);
    return NextResponse.json(
      { error: "Internal server error while fetching history." },
      { status: 500 }
    );
  }
}

// 🔵 2. POST HANDLER: नया मैसेज भेजने, AI प्रेडिक्शन सेव करने और रेमेडी डालने के लिए
export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI service is not configured." },
        { status: 503 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const input = body as Record<string, unknown>;

    const userId = input.userId;
    const conversationId = input.conversationId;
    const userMessageContent = cleanText(input.message);

    if (
      !isValidUuid(userId) ||
      !isValidUuid(conversationId) ||
      !userMessageContent
    ) {
      return NextResponse.json(
        {
          error:
            "Valid userId, conversationId and message are required.",
        },
        { status: 400 }
      );
    }

    if (userMessageContent.length > 6000) {
      return NextResponse.json(
        { error: "Message is too long. Maximum 6000 characters." },
        { status: 400 }
      );
    }

    const [userRecord] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userRecord) {
      return NextResponse.json(
        { error: "User account not found." },
        { status: 404 }
      );
    }

    const [conversationRecord] = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.id, conversationId),
          eq(conversations.userId, userId)
        )
      )
      .limit(1);

    if (!conversationRecord) {
      return NextResponse.json(
        { error: "Conversation not found." },
        { status: 404 }
      );
    }

    const [
      birthRecords,
      chartRecords,
      previousMessages,
    ] = await Promise.all([
      db
        .select()
        .from(birthDetails)
        .where(eq(birthDetails.userId, userId))
        .limit(1),

      db
        .select()
        .from(charts)
        .where(eq(charts.userId, userId))
        .orderBy(desc(charts.createdAt))
        .limit(1),

      db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conversationId))
        .orderBy(desc(messages.createdAt))
        .limit(12),
    ]);

    const birthRecord = birthRecords[0];
    const chartRecord = chartRecords[0];

    const activePersona =
      conversationRecord.persona &&
      PERSONA_CONFIGS[conversationRecord.persona]
        ? conversationRecord.persona
        : "Gita";

    const persona = PERSONA_CONFIGS[activePersona];

    const history = previousMessages.reverse().map((item) => ({
      role:
        item.role === "assistant"
          ? ("assistant" as const)
          : ("user" as const),
      content: item.content,
    }));

    let astrologyContext = "Available birth-chart context:\n";

    if (birthRecord) {
      astrologyContext += [
        `Name: ${birthRecord.name}`,
        `Date of birth: ${birthRecord.dob}`,
        `Time of birth: ${birthRecord.birthTime}`,
        `Place of birth: ${birthRecord.birthPlace}`,
      ].join("\n");
    } else {
      astrologyContext += "No birth details have been provided.\n";
    }

    if (chartRecord?.data) {
      astrologyContext +=
        "\nChart data:\n" + JSON.stringify(chartRecord.data);
    } else {
      astrologyContext += "\nNo calculated chart data is available.";
    }

    // 🎯 100% मार्केटिंग माइंडसेट के साथ अपग्रेड किया गया सिस्टम प्रॉम्ट इंजन
    const systemPrompt = `
You are the absolute premium, elite human Astrologer named "${activePersona}" from AstroPandit. You possess 100% total mastery over Vedic systems and modern consumer psychology.

YOUR ASSIGNED FIELD:
${persona.specializations}

YOUR TONE & VOICE:
${persona.tone}

CRITICAL BUSINESS RETENTION AND MARKETING LAWS:
1. GYAN PELNA 0% (NO LECTURES / NO FLUFF): Do not explain planetary science or give textbook definitions. Cut the chatter. Talk straight to the user's specific problem and immediate pain point.
2. 100% ASTROLOGER KNOWLEDGE: Deliver sharp, highly accurate, and jaw-dropping predictions in scannable bullet points using the provided chart matrix. Mention clear houses, transits, or dashas to make your claim solid.
3. 100% MARKETING HOOK: Speak with absolute certainty and 100% confidence. Never hesitate or use speculative words like 'maybe', 'possibly', or 'it might'. Always state 'This WILL happen'.
4. HARD TIMELINES: Give exact, bold date brackets (e.g., 'December 2026 to April 2027').
5. NO DISCLAIMERS: Do not state you are an AI, chatbot, or machine. Never give disclaimers like 'astrology is unproven' or medical/legal safety warnings.
6. DRIVING ENGAGEMENT: Keep the user totally hooked so they continue chatting or instantly opt-in for your premium remedies.
7. Reply naturally in the mixed language style requested (Hindi, Hinglish, or English).

If you prescribe a remedy, you MUST append this exact hidden block at the absolute end of your response:

||REMEDY_EXTRACT||
Remedy Title
Step-by-step instructions for the user
`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },

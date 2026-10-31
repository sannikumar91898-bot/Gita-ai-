import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";

import { getUser } from "@/auth";
import { db } from "@/index";
import {
  birthDetails,
  charts,
  conversations,
  messages,
  remedies,
} from "@/schema";

// 🔥 KNOWLEDGE ADAPTER IMPORT KIYA HAI 🔥
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
    tone: "Young, modern, highly energetic, cool, and relatable female astrologer. She speaks like a smart, confident elder sister/friend. Uses modern Hinglish, words like 'Listen', 'Tension mat lo', 'Main hoon na'.",
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

// 🔥 SMART RAG (Knowledge Search) FUNCTION 🔥
function getRelevantKnowledge(query: string): string {
  const q = query.toLowerCase();
  const allEntries = getExtendedKnowledgeEntries();
  
  const scoredEntries = allEntries.map((entry) => {
    let score = 0;
    
    if (entry.keywords) {
      entry.keywords.forEach((kw) => {
        if (q.includes(kw.toLowerCase())) score += 5;
      });
    }

    if (entry.aliases) {
      entry.aliases.forEach((alias) => {
        if (q.includes(alias.toLowerCase())) score += 3;
      });
    }

    if (entry.question) {
      const words = q.split(" ").filter(w => w.length > 3);
      words.forEach(word => {
        if (entry.question.toLowerCase().includes(word)) score += 2;
      });
    }

    return { entry, score };
  });

  const topMatches = scoredEntries
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (topMatches.length === 0) return "";

  return topMatches.map(({ entry }) => {
    const answerText = entry.answers.hinglish || entry.answers.hi || entry.answers.en || "";
    return `[Context Topic: ${entry.topic.toUpperCase()}]\nAstrological Logic: ${answerText}`;
  }).join("\n\n");
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
      .where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId)))
      .limit(1);

    if (!existing) throw new Error("CONVERSATION_NOT_FOUND");
    return existing;
  }

  const [existing] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.userId, userId), eq(conversations.persona, persona)))
    .orderBy(desc(conversations.updatedAt))
    .limit(1);

  if (existing) return existing;

  const [created] = await db
    .insert(conversations)
    .values({ userId, title: "New Astro Consultation", topic: topic || "general", persona })
    .returning();

  if (!created) throw new Error("CONVERSATION_CREATE_FAILED");
  return created;
}

export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Session not found." }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const requestedPersona = searchParams.get("persona");
    const persona = isPersona(requestedPersona) ? requestedPersona : "gita";

    const conversation = await getOrCreateConversation(user.id, persona, PERSONAS[persona].specializations);

    const history = await db
      .select({ id: messages.id, role: messages.role, content: messages.content, createdAt: messages.createdAt })
      .from(messages)
      .where(and(eq(messages.conversationId, conversation.id), eq(messages.userId, user.id)))
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
    return NextResponse.json({ error: "Chat history could not be loaded." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Session not found." }, { status: 401 });
    if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: "AI service not configured." }, { status: 503 });

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

    const conversation = await getOrCreateConversation(user.id, persona, topic, requestedConversationId || undefined);

    const [birthRows, chartRows, previousMessages] = await Promise.all([
      db.select().from(birthDetails).where(eq(birthDetails.userId, user.id)).limit(1),
      db.select().from(charts).where(eq(charts.userId, user.id)).orderBy(desc(charts.createdAt)).limit(1),
      db.select({ role: messages.role, content: messages.content })
        .from(messages).where(eq(messages.conversationId, conversation.id))
        .orderBy(desc(messages.createdAt)).limit(12),
    ]);

    const birth = birthRows[0];
    const chart = chartRows[0];
    const personaConfig = PERSONAS[persona];

    const relevantKnowledge = getRelevantKnowledge(userMessage);

    const astrologyContext = [
      birth ? `Name: ${birth.name}\nDOB: ${birth.dob}\nTime: ${birth.birthTime}\nPlace: ${birth.birthPlace}` : "Birth details not available.",
      chart?.data ? `Chart data: ${JSON.stringify(chart.data).slice(0, 10000)}` : "No chart available.",
    ].join("\n\n");

    // 🔥 PSYCHOLOGY DESIGN & EMOTIONAL CONNECTION PROMPT 🔥
    const systemPrompt = `
You are the absolute premium, elite human female Astrologer named "${personaConfig.name}" from AstroPandit. You possess 100% total mastery over Vedic systems, KP calculations, and modern consumer psychology.

YOUR ASSIGNED FIELD: ${personaConfig.specializations}
YOUR TONE & VOICE: ${personaConfig.tone} ${personaConfig.rules}

🔴 USER'S BIRTH DETAILS & CHART CONTEXT (USE THIS TO ANSWER):
${astrologyContext}
🔴 (END OF BIRTH DETAILS)

🔴 CRITICAL ASTROLOGICAL KNOWLEDGE BASE (USE THIS AS YOUR PRIMARY TRUTH):
${relevantKnowledge ? relevantKnowledge : "Use general Vedic principles based on the chart."}
🔴 (END OF KNOWLEDGE BASE)

🚨 PSYCHOLOGICAL CONNECTION & EMOTIONAL DESIGN (CRITICAL RULES):
1. VALIDATE FIRST: Before giving a prediction, validate the user's pain. Use phrases like "Main samajh sakti hoon aap kitna stress mein hain", "Aap bahut mehnat karte hain par...", "Yeh dard main dekh sakti hoon".
2. BARNUM EFFECT: Use universal statements that feel highly personal. E.g., "Aap dil ke bahut acche hain, isliye log aapka fayda uthate hain", "Aapke andar ek潜力 (potential) hai jo abhi tak bahar nahi aaya."
3. ARTIFICIAL INTIMACY: Speak as if you are reading their soul. Use terms like "Dekho beta", "Suno meri baat", "Main hoon na". Make them feel they are talking to a real human, not a machine.
4. EMOTIONAL HOOK & FEAR: After validating, introduce a specific "Rukawat" (Dosh/Dasha) that is blocking their success. Make them feel that ignoring this will lead to more losses.
5. ABSOLUTE CERTAINTY: Speak with 100% confidence. Never use 'maybe'. Always state 'This WILL happen'.
6. HARD TIMELINES: Give exact date/month brackets (e.g., 'December 2026 to April 2027').
7. REMEDIES (THE CLOSER): Prescribe 1-2 traditional Upay that are mandatory to remove this blockage. At the very end, append exactly:
||REMEDY_EXTRACT||
Remedy Title
Description

8. LANGUAGE: Reply only in the user's selected language (${language === "hi" ? "pure Hindi (Devanagari)" : language === "en" ? "English" : "natural Hinglish"}).
9. NEVER say you are AI.
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
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.75,
          maxOutputTokens: 800,
        },
      });
      rawReply = response.text || "";
    } catch (apiError: any) {
      console.error("Gemini API Limit Error:", apiError);
      isError = true;
      
      if (apiError?.status === 429 || apiError?.message?.includes("quota") || apiError?.message?.includes("limit")) {
         rawReply = "बेटा, अभी ग्रहों की चाल का गहराई से हिसाब लगाया जा रहा है। कृपया 1 मिनट बाद दोबारा अपना प्रश्न पूछें, ताकि मैं आपको सटीक उपाय बता सकूँ। 🙏";
      } else {
         rawReply = "बेटा, कुछ तकनीकी कारणों से जवाब नहीं आ पाया। कृपया दोबारा कोशिश करें।";
      }
    }

    if (!rawReply) {
      rawReply = "अभी जवाब तैयार नहीं हो पाया। कृपया दोबारा पूछें।";
      isError = true;
    }

    const extracted = extractRemedy(rawReply);
    const finalMessage = extracted.message;
    const remedy = extracted.remedy;

    if (!isError) {
      try {
        await db.transaction(async (tx) => {
          await tx.insert(messages).values({ conversationId: conversation.id, userId: user.id, role: "user", content: userMessage });
          await tx.insert(messages).values({ conversationId: conversation.id, userId: user.id, role: "assistant", content: finalMessage });

          if (remedy) {
            await tx.insert(remedies).values({ userId: user.id, title: remedy.title, description: remedy.description });
          }
        });
      } catch (saveError) {
        console.error("Failed to save chat messages (Transaction failed):", saveError);
        return NextResponse.json({ success: false, error: "Database save failed." }, { status: 500 });
      }
    }

    if (isError) {
      return NextResponse.json(
        { success: false, error: finalMessage, conversationId: conversation.id },
        { status: 500 }
      );
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

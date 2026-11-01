import { NextResponse } from "next/server";
import { and, desc, eq, sql } from "drizzle-orm"; // 🔥 sql import kiya
import { GoogleGenAI } from "@google/genai";

import { getUser } from "@/auth";
import { db } from "@/index";
import {
  birthDetails,
  charts,
  conversations,
  messages,
  remedies,
  users, // 🔥 users table import kiya
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

    // 🔥 1. PAID USER CHECK 🔥
    const isPaidUser = user.walletBalancePaise > 0;
    const COST_PER_MESSAGE_PAISE = 200; // ₹2 per message

    // 🔥 2. BLOCK FREE USERS AFTER 3 MESSAGES 🔥
    if (!isPaidUser && user.isGuest && user.freeMessagesUsed >= 3) {
      return NextResponse.json(
        { 
          code: "FREE_LIMIT_REACHED", 
          error: "Aapke 3 free messages khatam ho gaye hain. Kripya wallet recharge karein." 
        }, 
        { status: 402 }
      );
    }

    // 🔥 3. BLOCK PAID USERS IF BALANCE IS LOW 🔥
    if (!user.isGuest && user.walletBalancePaise < COST_PER_MESSAGE_PAISE) {
      return NextResponse.json(
        { 
          code: "INSUFFICIENT_BALANCE", 
          error: "Aapka wallet balance khatam ho gaya hai. Kripya recharge karein." 
        }, 
        { status: 402 }
      );
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

    // 🔥 4. DYNAMIC PROMPT (PAID VS FREE) 🔥
    let instructionPrompt = "";
    
    if (isPaidUser) {
      instructionPrompt = `
🚨 USER IS A PAID CUSTOMER. DO NOT ASK FOR MONEY. DO NOT CREATE FEAR. 
YOUR GOAL: Give the user the ACTUAL SOLUTION. Analyze their birth details, find the exact dosha, and provide a clear, step-by-step remedy. Tell them exactly when their problem will be solved. Be highly comforting, professional, and give them their money's worth.
`;
    } else {
      instructionPrompt = `
🚨 USER IS A FREE USER. 
YOUR GOAL: Validate their pain, but highlight a specific "Rukawat" (Dosh/Dasha). Tell them that the situation is critical, but to know the exact solution and timeline, they MUST recharge their wallet. Give them only a 20% hint of the solution, keep 80% behind the paywall. Make them feel they need to pay to get rid of this fear.
`;
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
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.75,
          maxOutputTokens: 1500, // 🔥 Tokens badha diye taaki jawab na ruke
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

          // 🔥 5. WALLET DEDUCTION / FREE MESSAGE COUNT 🔥
          if (isPaidUser) {
            // Paid user: Cut ₹2
            await tx.update(users)
              .set({ walletBalancePaise: sql`${users.walletBalancePaise} - ${COST_PER_MESSAGE_PAISE}` })
              .where(eq(users.id, user.id));
          } else {
            // Free user: Increase free message count
            await tx.update(users)
              .set({ freeMessagesUsed: sql`${users.freeMessagesUsed} + 1` })
              .where(eq(users.id, user.id));
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
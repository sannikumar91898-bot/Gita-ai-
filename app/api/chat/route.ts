// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { and, desc, eq, sql, gte, lt } from "drizzle-orm";
import OpenAI from "openai"; // 🔥 OpenAI SDK use kar rahe hain (Modal compatible hai)

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
export const maxDuration = 60; // Timeout badha diya

// 🔥 MODAL CLIENT SETUP 🔥
const openai = new OpenAI({
  baseURL: process.env.MODAL_API_URL || "https://api.openai.com/v1", // Fallback
  apiKey: process.env.MODAL_API_KEY || "dummy-key",
});

const MODAL_MODEL = process.env.MODAL_MODEL_NAME || "Qwen/Qwen2.5-32B-Instruct";

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
    tone: "A warm, deeply empathetic young female astrologer. She talks like a caring elder sister who genuinely cares about the user's wellbeing. Use words like 'Suno', 'Tum tension mat lo', 'Main hoon na', 'Main samajhti hoon'. Build trust through kindness and understanding.",
    rules: "First validate the user's emotions with empathy. Then explain what the chart suggests as GUIDANCE, not guaranteed fate. Give clear astrological reasoning. Offer practical remedies. Keep the tone caring and supportive.",
  },
  kriti: {
    name: "Acharya Kriti",
    specializations: "Career, government jobs, selection tracking, business growth and wealth generation",
    tone: "A sharp, professional, and encouraging female mentor. She is direct but genuinely invested in the user's success.",
    rules: "Focus on the 10th house, Saturn, and Jupiter transits. Provide clear guidance and timelines as possibilities, not guarantees. Structure in bullet points. Motivate with practical steps.",
  },
  devaki: {
    name: "Dr. Devaki Shastri",
    specializations: "Advanced KP Astrology, complex dasha calculations and absolute chart mapping",
    tone: "A highly intellectual, respectful, and insightful female astrologer.",
    rules: "Explain the astrological positions clearly. Provide deep analysis with practical guidance. Respectful and wise in tone.",
  },
  gargi: {
    name: "Gargi Maa",
    specializations: "Vedic spirituality, Vastu balancing, traditional remedies and mental peace",
    tone: "A maternal, soothing, and spiritually grounded figure. Speaks with love and spiritual depth.",
    rules: "Suggest traditional remedies with warmth. Focus on mental peace, spiritual growth, and practical Vastu corrections.",
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

    const COST_PER_MESSAGE_PAISE = 200; // ₹2
    const isPremium = user.premiumUntil && new Date(user.premiumUntil) > new Date();
    const canAffordWallet = user.walletBalancePaise >= COST_PER_MESSAGE_PAISE;
    const hasFreeMessages = user.freeMessagesUsed < 3;

    if (!isPremium && !canAffordWallet && !hasFreeMessages) {
      return NextResponse.json({ code: "INSUFFICIENT_BALANCE", error: "Aapka balance khatam ho gaya hai. Kripya recharge karein." }, { status: 402 });
    }

    // 🔥 FormData parse (Text + Image dono handle karne ke liye)
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

    // Wallet Deduction Logic
    if (!isPremium) {
      if (canAffordWallet) {
        const updated = await db.update(users)
          .set({ walletBalancePaise: sql`${users.walletBalancePaise} - ${COST_PER_MESSAGE_PAISE}` })
          .where(and(eq(users.id, userId), gte(users.walletBalancePaise, COST_PER_MESSAGE_PAISE)))
          .returning();
        
        if (updated.length === 0) return NextResponse.json({ code: "INSUFFICIENT_BALANCE", error: "Balance insufficient." }, { status: 402 });
        deductedType = "wallet"; isDeducted = true;
      } else if (hasFreeMessages) {
        const updated = await db.update(users)
          .set({ freeMessagesUsed: sql`${users.freeMessagesUsed} + 1` })
          .where(and(eq(users.id, userId), lt(users.freeMessagesUsed, 3)))
          .returning();
        
        if (updated.length === 0) return NextResponse.json({ code: "FREE_LIMIT_REACHED", error: "Free limit reached." }, { status: 402 });
        deductedType = "free"; isDeducted = true;
      }
    }

    const birth = birthRows[0];
    const chart = chartRows[0];
    const personaConfig = PERSONAS[persona];
    const relevantKnowledge = getRelevantKnowledge(userMessage || "Image analysis");

    const astrologyContext = [
      birth ? `Name: ${birth.name}\nDOB: ${birth.dob}\nTime: ${birth.birthTime}\nPlace: ${birth.birthPlace}` : "Birth details not available.",
      chart?.data ? `Chart data: ${JSON.stringify(chart.data).slice(0, 3000)}` : "No chart available.",
    ].join("\n\n");

    let instructionPrompt = "";
    const freeMessagesLeft = 3 - (user.freeMessagesUsed || 0);

    if (!isPremium && !canAffordWallet) { 
      if (freeMessagesLeft === 1) {
        instructionPrompt = `🚨 THIS IS THE USER'S 3RD AND FINAL FREE MESSAGE. 
YOUR GOAL: 
1. Validate their feelings with deep empathy. Tell them they are strong.
2. Give a clear astrological reading based on their chart. Give specific time periods as GUIDANCE.
3. Gently mention that for deeper remedies and full analysis, they can recharge their wallet to continue the conversation. Be caring, not pushy.`;
      } else {
        instructionPrompt = `🚨 USER IS A FREE USER. 
YOUR GOAL: Validate their pain with empathy. Make them feel heard. Give an accurate astrological reason for their problem. Give a small, free remedy that helps them immediately.`;
      }
    } else {
      instructionPrompt = `🚨 USER IS A PAID/PREMIUM CUSTOMER. 
YOUR GOAL: Give the user the FULL, DETAILED SOLUTION. Analyze their chart deeply. Provide comprehensive remedies and guidance.`;
    }

    const systemPrompt = `
You are a premium Vedic Astrologer named "${personaConfig.name}" from AstroPandit.

YOUR TONE: ${personaConfig.tone}
YOUR RULES: ${personaConfig.rules}

🔴 USER'S BIRTH DETAILS:
${astrologyContext}

🔴 KNOWLEDGE BASE:
${relevantKnowledge ? relevantKnowledge : "Use general Vedic principles."}

${instructionPrompt}

CRITICAL GUIDELINES:
1. CONFIDENT GUIDANCE: Speak with confidence based on the chart, but present astrology as guidance.
2. SPECIFIC TIMELINES: Give approximate time periods as possibilities.
3. REMEDIES: Prescribe 1-2 traditional Upay. At the very end, append exactly:
||REMEDY_EXTRACT||
Remedy Title
Description
4. NEVER claim to be AI. You are a human astrologer.
5. LANGUAGE: Reply only in the user's selected language (${language === "hi" ? "pure Hindi" : language === "en" ? "English" : "natural Hinglish"}).
6. IMAGE: If the user has uploaded an image, acknowledge it first (e.g., "Suno, maine tumhari photo dekhi hai...").
`.trim();

    // 🔥 MESSAGES ARRAY BANAO (OpenAI Format) 🔥
    const chatMessages: any[] = [
      { role: "system", content: systemPrompt }
    ];

    // Purani history add karo
    previousMessages.reverse().forEach((m) => {
      chatMessages.push({ role: m.role === "assistant" ? "assistant" : "user", content: m.content });
    });

    // Naya user message add karo (Agar image hai toh Vision format)
    if (imageFile) {
      const buffer = await imageFile.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString("base64");
      chatMessages.push({
        role: "user",
        content: [
          { type: "text", text: userMessage || "Is photo ko dekh kar batayein." },
          { type: "image_url", image_url: { url: `data:${imageFile.type};base64,${base64Image}` } }
        ]
      });
    } else {
      chatMessages.push({ role: "user", content: userMessage });
    }

    // 🔥 MODAL API CALL 🔥
    const response = await openai.chat.completions.create({
      model: MODAL_MODEL,
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    const rawReply = response.choices[0]?.message?.content?.trim() || "";
    if (!rawReply) throw new Error("EMPTY_AI_RESPONSE");

    const extracted = extractRemedy(rawReply);
    const finalMessage = extracted.message;
    const remedy = extracted.remedy;

    await db.transaction(async (tx) => {
      await tx.insert(messages).values({ conversationId: conversation.id, userId: userId, role: "user", content: userMessage || "[Image Uploaded]" });
      await tx.insert(messages).values({ conversationId: conversation.id, userId: userId, role: "assistant", content: finalMessage });
      if (remedy) {
        await tx.insert(remedies).values({ userId: userId, title: remedy.title, description: remedy.description });
      }
    });

    return NextResponse.json({
      success: true,
      conversationId: conversation.id,
      reply: finalMessage,
      remedy: remedy ? { title: remedy.title, description: remedy.description } : null,
    });

  } catch (error: any) {
    console.error("POST /api/chat error:", error.message);

    // Refund Logic
    if (isDeducted && userId) {
      try {
        if (deductedType === "wallet") {
          await db.update(users).set({ walletBalancePaise: sql`${users.walletBalancePaise} + 200` }).where(eq(users.id, userId));
        } else if (deductedType === "free") {
          await db.update(users).set({ freeMessagesUsed: sql`GREATEST(${users.freeMessagesUsed} - 1, 0)` }).where(eq(users.id, userId)); 
        }
      } catch (refundError) {}
    }

    if (error.message === "CONVERSATION_NOT_FOUND") {
      return NextResponse.json({ error: "Chat history not found." }, { status: 404 });
    }

    return NextResponse.json({ 
      success: false, 
      error: "Kuch takniki karanon se jawab nahi aa paya. Aapka paisa refund kar diya gaya hai." 
    }, { status: 500 });
  }
}
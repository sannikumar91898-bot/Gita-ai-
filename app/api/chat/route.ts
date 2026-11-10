// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { and, desc, eq, sql, gte, lt } from "drizzle-orm";
import OpenAI from "openai";

import { getUser } from "@/auth";
import { db } from "@/index";
import { birthDetails, charts, conversations, messages, remedies, users } from "@/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  gargi: { name: "Gargi Maa", specializations: "Spirituality, Vastu", tone: "Maternal, soothing. Calls user 'Beta'.", rules: "Prescribe remedies with affection." },
};

const SUPPORTED_LANGUAGES = ["hi", "hinglish", "en"] as const;
function cleanText(value: unknown, maxLength = 6000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}
function isPersona(value: unknown): value is keyof typeof PERSONAS {
  return typeof value === "string" && value in PERSONAS;
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
    if (!user) return NextResponse.json({ error: "Session not found." }, { status: 401 });
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
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    userId = user.id;

    const formData = await request.formData();
    const userMessage = cleanText(formData.get("message"));
    const rawPersona = formData.get("persona");
    const persona = isPersona(rawPersona) ? rawPersona : "gita";
    const requestedConversationId = cleanText(formData.get("conversationId"));
    const imageFile = formData.get("image") as File | null;

    if (!userMessage && !imageFile) return NextResponse.json({ error: "Message khali hai." }, { status: 400 });

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

    // Conversation Setup
    let convId = requestedConversationId;
    if (!convId) {
      const [newConv] = await db.insert(conversations).values({ userId, title: "New Chat", persona }).returning();
      convId = newConv.id;
    }

    // 🔥 PREMIUM FEATURE 1: Fetch Context (Last 10 Messages + Kundli Data)
    const [birthRows, chartRows, previousMessages] = await Promise.all([
      db.select().from(birthDetails).where(eq(birthDetails.userId, userId)).limit(1),
      db.select().from(charts).where(eq(charts.userId, userId)).orderBy(desc(charts.createdAt)).limit(1),
      db.select({ role: messages.role, content: messages.content }).from(messages).where(eq(messages.conversationId, convId)).orderBy(desc(messages.createdAt)).limit(10),
    ]);

    const [uMsg] = await db.insert(messages).values({ conversationId: convId, userId, role: "user", content: userMessage || "Photo" }).returning();
    savedUserMsgId = uMsg.id;

    const birth = birthRows[0];
    const chart = chartRows[0];
    
    // Formatting Previous Context
    const history = previousMessages.reverse().map(m => ({ role: m.role, content: m.content }));

    const personaConfig = PERSONAS[persona];
    
    // Building Kundli Context
    let kundliContext = "No birth details provided yet. Ask the user for their birth details (Date, Time, Place) to give accurate predictions.";
    if (birth) {
      kundliContext = `User's Birth Details: DOB: ${birth.dob}, Time: ${birth.birthTime}, Place: ${birth.birthPlace}. `;
      if (chart) {
        kundliContext += `User's Chart Data: ${JSON.stringify(chart.data).slice(0, 1500)}`;
      }
    }

    // 🔥 PREMIUM FEATURE 2: Ultimate Strict Prompt (No Markdown, 2026 Only)
    const systemPrompt = `
You are an elite premium application assistant named ${personaConfig.name}.
You are a real female astrologer. ${personaConfig.tone}
Your Specializations: ${personaConfig.specializations}.
Strict Rules: ${personaConfig.rules}

Today's Date is: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}.
The current year is strictly 2026. You MUST use this year for all calculations. Do NOT mention 2024 or 2025.

KUNDLI & CONTEXT:
${kundliContext}
Use this context to personalize the response. Do not ask for details if they are already provided above.

STRICT FORMATTING & LANGUAGE RULES:
1. Do not output markdown. Do not output asterisks or hashtags under any circumstances.
2. Reply ONLY in clean plain-text paragraph format with single line breaks.
3. If the user speaks in Hindi or Hinglish, reply in Hinglish (Roman-script). If English, reply in English.
4. Address the user affectionately (e.g., 'Suno', 'Beta', 'Tum tension mat lo').
`;

    const modelName = imageFile ? "llama-3.2-11b-vision-preview" : "llama-3.3-70b-versatile"; 
    
    const messagesPayload: any[] = [
      { role: "system", content: systemPrompt },
      ...history, // Context injected here
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
      temperature: 0.5,
      max_tokens: 1200,
    });

    let raw = completion.choices[0]?.message?.content?.trim() || "";
    if (!raw) throw new Error("Empty response from AI");

    // 🔥 CODE-LEVEL FIX: Guaranteed removal of stars and hashtags
    raw = raw.replace(/\*\*/g, "").replace(/\*/g, "").replace(/#/g, "");

    const { message, remedy } = extractRemedy(raw);
    
    await db.insert(messages).values({ conversationId: convId, userId, role: "assistant", content: message });
    await db.update(conversations).set({ updatedAt: new Date() }).where(eq(conversations.id, convId));

    return NextResponse.json({ success: true, conversationId: convId, message: { role: "assistant", content: message }, remedy });

  } catch (error: any) {
    if (isDeducted && userId) {
      if (deductedType === "wallet") await db.update(users).set({ walletBalancePaise: sql`${users.walletBalancePaise} + ${COST_PER_MESSAGE_PAISE}` }).where(eq(users.id, userId));
      if (deductedType === "free") await db.update(users).set({ freeMessagesUsed: sql`GREATEST(${users.freeMessagesUsed} - 1, 0)` }).where(eq(users.id, userId));
    }
    if (savedUserMsgId) await db.delete(messages).where(eq(messages.id, savedUserMsgId)); 

    // 🔥 PREMIUM FEATURE 3: Smart Error Handling for Rate Limits
    if (error?.status === 429 || error?.message?.includes("rate limit")) {
       return NextResponse.json({ code: "RATE_LIMIT", error: "Aapne jaldi message bheja hai, kripya 30 second rukein." }, { status: 429 });
    }

    console.error("=== GROQ AI ERROR ===", error.message || error);
    return NextResponse.json({ code: "AI_ERROR", error: "Server thoda busy hai. Kripya 1 minute baad try karein." }, { status: 500 });
  }
}
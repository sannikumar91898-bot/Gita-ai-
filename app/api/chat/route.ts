// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { and, desc, eq, sql, gte, lt } from "drizzle-orm";
import OpenAI from "openai";

import { getUser } from "@/auth";
import { db } from "@/index";
import { birthDetails, charts, conversations, messages, remedies, users } from "@/schema";
import { getExtendedKnowledgeEntries } from "@/lib/knowledge/knowledge-adapter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 🔥 GROQ AI CONFIGURATION
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: GROQ_API_KEY || "dummy-key",
});

const COST_PER_MESSAGE_PAISE = 200;
const FREE_MESSAGE_LIMIT = 3;

type PersonaConfig = { name: string; specializations: string; tone: string; rules: string; };

const PERSONAS: Record<string, PersonaConfig> = {
  gita: {
    name: "Gita", specializations: "Love, relationships", tone: "Warm elder sister. Use 'Suno', 'Main hoon na'.", rules: "Validate pain first.",
  },
  kriti: {
    name: "Acharya Kriti", specializations: "Career, jobs", tone: "Sharp professional mentor.", rules: "Focus on 10th house.",
  },
  devaki: {
    name: "Dr. Devaki Shastri", specializations: "KP Astrology", tone: "Authoritative guru.", rules: "Use exact degrees.",
  },
  gargi: {
    name: "Gargi Maa", specializations: "Spirituality, Vastu", tone: "Maternal, soothing. Calls user 'Beta'.", rules: "Prescribe remedies with affection.",
  },
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

    let convId = requestedConversationId;
    if (!convId) {
      const [newConv] = await db.insert(conversations).values({ userId, title: "New Chat", persona }).returning();
      convId = newConv.id;
    }

    const [uMsg] = await db.insert(messages).values({ conversationId: convId, userId, role: "user", content: userMessage || "Photo" }).returning();
    savedUserMsgId = uMsg.id;

    const personaConfig = PERSONAS[persona];
    
    // 🔥 ULTRA STRICT PROMPT (Dates & English Fix)
    const systemPrompt = `
You are ${personaConfig.name}. ${personaConfig.tone}.
Today's Date is: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}. 
CRITICAL: The current year is 2026. You are FORBIDDEN from mentioning 2024 or 2025. All predictions must be for 2026 onwards.
STRICT LANGUAGE RULES: Reply ONLY in Hinglish (Roman Hindi + English). NEVER reply in pure English.
FORMATTING RULES: NEVER use markdown stars (**). Output plain text only. Use dashes (-) for lists.
`;

    // 🔥 Faster model to prevent timeout
    const modelName = imageFile ? "llama-3.2-11b-vision-preview" : "llama-3.1-8b-instant"; 
    
    const messagesPayload: any[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage || "Is image ko analyze karo." }
    ];

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = buffer.toString("base64");
      messagesPayload[1].content = [
        { type: "text", text: userMessage || "Is image ko analyze karo." },
        { type: "image_url", image_url: { url: `data:${imageFile.type};base64,${base64Image}` } }
      ];
    }

    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: messagesPayload,
      temperature: 0.6,
      max_tokens: 1000,
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "";
    if (!raw) throw new Error("Empty response from AI");

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

    console.error("=== GROQ AI ERROR ===", error.message || error);
    return NextResponse.json({ code: "AI_ERROR", error: "Server thoda busy hai. Kripya 1 minute baad try karein." }, { status: 500 });
  }
}
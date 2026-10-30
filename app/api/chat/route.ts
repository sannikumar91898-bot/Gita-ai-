import { NextRequest, NextResponse } from "next/server";
import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "@/index";
import {
  messages,
  birthDetails,
  conversations,
  charts,
} from "@/schema";
import { getUser } from "@/auth";
import { chartSummary, type KundliChart } from "@/vedic";
import {
  findKnowledgeMatch,
  type KnowledgeLanguage,
} from "@/lib/knowledge-base";
import {
  getAstrologerSystemPrompt,
  type AstrologerPersonaId,
} from "@/lib/astrologer-prompts";
import {
  understandFollowUp,
  buildFollowUpContext,
} from "@/lib/follow-up-understanding";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUEST_TIMEOUT_MS = 45_000;
const DEFAULT_MODEL = "gemini-2.5-flash";
const MAX_MESSAGE_LENGTH = 8000;
const MAX_HISTORY_MESSAGES = 12;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const TOPICS = new Set([
  "general",
  "palm",
  "love",
  "money",
  "remedies",
  "health",
  "career",
  "family",
]);

type ChatCode =
  | "not_configured"
  | "invalid_model"
  | "invalid_credentials"
  | "model_not_found"
  | "quota"
  | "rate_limited"
  | "unavailable"
  | "timeout"
  | "empty"
  | "provider"
  | "network";

type ChatLanguage = KnowledgeLanguage;

type HistoryRow = {
  role: string;
  content: string;
};

function jsonError(
  error: string,
  status: number,
  code?: ChatCode,
) {
  return NextResponse.json(
    code ? { error, code, success: false } : { error, success: false },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

function resolveModel(): { ok: true; model: string } | { ok: false } {
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  if (!/^[A-Za-z0-9._-]+$/.test(model) || model.startsWith("models/")) {
    return { ok: false };
  }
  return { ok: true, model };
}

function failureText(language: string, code: ChatCode): string {
  const translations: Record<string, Record<ChatCode, string>> = {
    hi: {
      not_configured: "AI सेवा अभी कॉन्फ़िगर नहीं है।",
      invalid_model: "AI मॉडल की सेटिंग में समस्या है।",
      invalid_credentials: "AI सेवा की credentials में समस्या है।",
      model_not_found: "चुना गया AI मॉडल उपलब्ध नहीं है।",
      quota: "उपयोग सीमा पूरी हो गई है। कृपया थोड़ी देर बाद प्रयास करें।",
      rate_limited: "बहुत जल्दी अनुरोध भेजे गए हैं। कुछ सेकंड बाद कोशिश करें।",
      unavailable: "AI सेवा अस्थायी रूप से उपलब्ध नहीं है।",
      timeout: "उत्तर आने में अधिक समय लग गया। कृपया फिर कोशिश करें।",
      empty: "अभी कोई उपयोगी उत्तर नहीं मिला।",
      provider: "अभी उत्तर तैयार नहीं हो पाया।",
      network: "नेटवर्क की समस्या हुई। कृपया फिर कोशिश करें।",
    },
    hinglish: {
      not_configured: "AI service abhi configured nahi hai.",
      invalid_model: "AI model ki settings mein problem hai.",
      invalid_credentials: "AI service credentials mein problem hai.",
      model_not_found: "Selected AI model available nahi hai.",
      quota: "Usage limit poori ho gayi hai. Kuch der baad try karein.",
      rate_limited: "Bahut jaldi requests bheji gayi hain. thodi der baad try karein.",
      unavailable: "AI service temporary available nahi hai.",
      timeout: "Jawab aane mein zyada time lag gaya. Phir try karein.",
      empty: "Abhi koi usable jawab nahi mila.",
      provider: "Abhi jawab prepare nahi ho paya. Phir try karein.",
      network: "Network problem hui. Phir try karein.",
    },
    en: {
      not_configured: "The AI service is not configured.",
      invalid_model: "There is a problem with the AI model configuration.",
      invalid_credentials: "The AI service credentials are invalid.",
      model_not_found: "The selected AI model was not found.",
      quota: "The AI service usage quota has been exhausted.",
      rate_limited: "Too many requests. Please try again shortly.",
      unavailable: "The AI service is temporarily unavailable.",
      timeout: "The reply took too long. Please try again.",
      empty: "No usable reply was received.",
      provider: "The AI provider could not generate a reply.",
      network: "A network error occurred.",
    },
  };
  return (translations[language] || translations.en)[code];
}

function isPersona(value: unknown): value is AstrologerPersonaId {
  return value === "gita" || value === "kriti" || value === "devaki" || value === "gargi";
}

function buildLanguage(requested: unknown, userLanguage: unknown): ChatLanguage {
  if (requested === "hi" || requested === "hinglish" || requested === "en") return requested;
  if (userLanguage === "hi" || userLanguage === "hinglish" || userLanguage === "en") return userLanguage;
  return "en";
}

function extractText(data: unknown): string {
  if (!data || typeof data !== "object" || !("candidates" in data)) return "";
  const candidates = (data as { candidates?: unknown }).candidates;
  if (!Array.isArray(candidates) || !candidates[0] || typeof candidates[0] !== "object") return "";
  const candidate = candidates[0] as { content?: { parts?: unknown } };
  if (!candidate.content || !Array.isArray(candidate.content.parts)) return "";
  return candidate.content.parts
    .filter((part): part is { text: string; thought?: boolean } => !!part && typeof part === "object" && typeof (part as { text?: unknown }).text === "string" && (part as { thought?: unknown }).thought !== true)
    .map((part) => part.text)
    .join("")
    .trim();
}

async function ensureConversation(userId: string, requested: unknown, topic: string, title: string, persona: string): Promise<string> {
  const requestedId = typeof requested === "string" && UUID_RE.test(requested) ? requested : "";
  if (requestedId) {
    const existing = await db.select({ id: conversations.id }).from(conversations).where(and(eq(conversations.id, requestedId), eq(conversations.userId, userId), eq(conversations.persona, persona))).limit(1);
    if (existing[0]) {
      await db.update(conversations).set({ updatedAt: new Date() }).where(and(eq(conversations.id, requestedId), eq(conversations.userId, userId), eq(conversations.persona, persona)));
      return requestedId;
    }
  }
  const freshId = crypto.randomUUID();
  await db.insert(conversations).values({ id: freshId, userId, title: title.slice(0, 80), topic, persona });
  return freshId;
}

async function saveChatMessages(userId: string, conversationId: string, question: string, answer: string) {
  const userMessageId = crypto.randomUUID();
  const assistantId = crypto.randomUUID();
  await db.insert(messages).values([
    { id: userMessageId, conversationId, userId, role: "user", content: question },
    { id: assistantId, conversationId, userId, role: "assistant", content: answer },
  ]);
  return { id: assistantId, conversationId, userId, role: "assistant", content: answer };
}

function buildGeminiContents(history: HistoryRow[], latestMessage: string) {
  type GeminiContent = { role: "user" | "model"; parts: Array<{ text: string }> };
  const normalized: GeminiContent[] = [];

  for (const item of history) {
    if (item.role !== "user" && item.role !== "assistant") continue;
    const messageText = typeof item.content === "string" ? item.content.trim() : "";
    if (!messageText) continue;
    const role: "user" | "model" = item.role === "assistant" ? "model" : "user";
    const previous = normalized[normalized.length - 1];
    if (previous?.role === role) {
      previous.parts.push({ text: messageText });
    } else {
      normalized.push({ role, parts: [{ text: messageText }] });
    }
  }

  while (normalized.length > 0 && normalized[0].role !== "user") {
    normalized.shift();
  }
  const recent = normalized.slice(-MAX_HISTORY_MESSAGES);
  while (recent.length > 0 && recent[0].role !== "user") {
    recent.shift();
  }
  const contents: GeminiContent[] = [...recent];
  const cleanLatestMessage = latestMessage.trim();
  if (!cleanLatestMessage) throw new Error("Latest user message is empty.");

  const previous = contents[contents.length - 1];
  if (previous?.role === "user") {
    previous.parts.push({ text: cleanLatestMessage });
  } else {
    contents.push({ role: "user", parts: [{ text: cleanLatestMessage }] });
  }
  return contents;
}

/* =========================================================
   GET: LOAD CHAT HISTORY
========================================================= */
export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return jsonError("Please sign in to continue.", 401);

    const requestedPersona = req.nextUrl.searchParams.get("persona");
    const persona = isPersona(requestedPersona) ? requestedPersona : "gita";
    const requestedId = req.nextUrl.searchParams.get("conversationId");
    let conversationId = "";

    if (requestedId && UUID_RE.test(requestedId)) {
      const owned = await db.select({ id: conversations.id }).from(conversations).where(and(eq(conversations.id, requestedId), eq(conversations.userId, user.id), eq(conversations.persona, persona))).limit(1);
      conversationId = owned[0]?.id ?? "";
    }

    if (!conversationId) {
      const latest = await db.select({ id: conversations.id }).from(conversations).where(and(eq(conversations.userId, user.id), eq(conversations.persona, persona))).orderBy(desc(conversations.updatedAt)).limit(1);
      conversationId = latest[0]?.id ?? "";
    }

    if (!conversationId) {
      return NextResponse.json({ conversationId: null, messages: [] }, { headers: { "Cache-Control": "no-store" } });
    }

    const rows = await db.select({ id: messages.id, role: messages.role, content: messages.content }).from(messages).where(and(eq(messages.conversationId, conversationId), eq(messages.userId, user.id))).orderBy(asc(messages.createdAt));
    return NextResponse.json({ conversationId, messages: rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {

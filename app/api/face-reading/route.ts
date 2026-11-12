// app/api/face-reading/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { eq, sql } from "drizzle-orm";
import { getUser } from "@/auth";
import { db } from "@/index";
import { users } from "@/schema"; 

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const modalApiKey = process.env.MODAL_API_KEY;
const modalUrl = process.env.MODAL_API_URL;
const modalModel = process.env.MODAL_VISION_MODEL || "Qwen/Qwen2.5-VL-7B-Instruct";

const modalClient = modalUrl && modalApiKey ? new OpenAI({ baseURL: modalUrl, apiKey: modalApiKey, timeout: 15_000, maxRetries: 0 }) : null;

const groqApiKey = process.env.GROQ_API_KEY;
const groqVisionModel = process.env.GROQ_VISION_MODEL || "qwen/qwen3.8-27b"; 
const groqClient = groqApiKey ? new OpenAI({ baseURL: "https://api.groq.com/openai/v1", apiKey: groqApiKey, timeout: 15_000, maxRetries: 0 }) : null;

const FREE_FACE_SCAN_LIMIT = 5;
const COST_PER_FACE_SCAN_PAISE = 200; 

function getLanguageInstruction(lang: string): string { /* आपका पुराना कोड */ return "Reply strictly in Hinglish."; }
function getPsychologicalUnauthorizedMessage(lang: string): string { return "Please login."; }
function getAIFailureMessage(lang: string): string { return "AI server busy."; }
function safeParseJSON(text: string): any {
  try {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const start = cleaned.indexOf('{'); const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) return JSON.parse(cleaned.substring(start, end + 1));
    return JSON.parse(cleaned);
  } catch (err) { return null; }
}

async function callVisionModel(prompt: string, imageBase64: string, imageMime: string): Promise<{ text: string; used: "modal" | "groq" }> {
  const messagesPayload: any[] = [{ role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: `data:${imageMime};base64,${imageBase64}` } }] }];
  if (modalClient) {
    try {
      const completion = await modalClient.chat.completions.create({ model: modalModel, messages: messagesPayload, temperature: 0.4, response_format: { type: "json_object" } });
      if (completion.choices[0]?.message?.content) return { text: completion.choices[0].message.content, used: "modal" };
    } catch (err: any) { console.error(`[face] Modal failed:`, err?.message); }
  }
  if (groqClient) {
    try {
      const completion = await groqClient.chat.completions.create({ model: groqVisionModel, messages: messagesPayload, temperature: 0.4, response_format: { type: "json_object" } });
      if (completion.choices[0]?.message?.content) return { text: completion.choices[0].message.content, used: "groq" };
    } catch (err: any) { console.error(`[face] Groq failed:`, err?.message); }
  }
  throw new Error("ALL_AI_PROVIDERS_FAILED");
}

export async function POST(request: Request) {
  let language = "hinglish";
  try {
    const user = await getUser();
    const formData = await request.formData();
    language = (formData.get("language") as string) || "hinglish";

    if (!user || user.isGuest) return NextResponse.json({ code: "LOGIN_REQUIRED", error: "Unauthorized" }, { status: 401 });

    const [userRow] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    if (!userRow) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isPremium = Boolean(userRow.premiumUntil && new Date(userRow.premiumUntil) > new Date());
    
    // 🔥 अब यह एरर नहीं देगा क्योंकि schema में कॉलम आ गया है
    const freeScansUsed = userRow.freeFaceScansUsed || 0; 
    const walletBalance = userRow.walletBalancePaise || 0;
    const freeScansLeft = Math.max(0, FREE_FACE_SCAN_LIMIT - freeScansUsed);

    if (!isPremium && freeScansLeft === 0 && walletBalance < COST_PER_FACE_SCAN_PAISE) {
      return NextResponse.json({ code: "WALLET_RECHARGE_REQUIRED", error: "Free scans exhausted." }, { status: 402 }); 
    }

    const imageFile = formData.get("image") as File | null;
    if (!imageFile || imageFile.size === 0) return NextResponse.json({ error: "INVALID_IMAGE" }, { status: 400 });
    if (imageFile.size > 10 * 1024 * 1024) return NextResponse.json({ error: "INVALID_IMAGE" }, { status: 400 });

    const bytes = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");
    const prompt = `You are an expert Vedic Face Reader. Reply in ${language}. Return JSON with title, insight, hook, suggestedChatPrompt.`;

    let aiText: string;
    try {
      const out = await callVisionModel(prompt, base64Image, imageFile.type);
      aiText = out.text;
    } catch (err: any) {
      return NextResponse.json({ error: "AI_ERROR", message: getAIFailureMessage(language) }, { status: 500 });
    }

    const result = safeParseJSON(aiText);
    if (!result) return NextResponse.json({ error: "AI_ERROR" }, { status: 500 });
    if (result.error === "INVALID_IMAGE") return NextResponse.json(result, { status: 422 });

    if (!isPremium) {
      if (freeScansLeft > 0) {
        // 🔥 अब सीधा sql कमांड चलेगा
        await db.update(users).set({ freeFaceScansUsed: sql`${users.freeFaceScansUsed} + 1` }).where(eq(users.id, user.id));
      } else if (walletBalance >= COST_PER_FACE_SCAN_PAISE) {
        await db.update(users).set({ walletBalancePaise: sql`${users.walletBalancePaise} - ${COST_PER_FACE_SCAN_PAISE}` }).where(eq(users.id, user.id));
      }
    }

    return NextResponse.json({
      success: true,
      result: { title: result.title || "Face Reading", insight: result.insight || "...", hook: result.hook || "...", suggestedChatPrompt: result.suggestedChatPrompt || "..." },
      scansLeft: isPremium ? "Unlimited" : Math.max(0, freeScansLeft - 1),
    });
  } catch (error: any) {
    return NextResponse.json({ error: "AI_ERROR" }, { status: 500 });
  }
}
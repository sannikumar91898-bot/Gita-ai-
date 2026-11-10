// app/api/palm/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getUser } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Modal Config
const modalApiKey = process.env.MODAL_API_KEY;
const modalUrl = process.env.MODAL_API_URL;
const modalClient = modalUrl ? new OpenAI({ baseURL: modalUrl, apiKey: modalApiKey || "dummy" }) : null;

// Groq Config
const groqClient = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY || "dummy",
});

function getLanguageInstruction(lang: string): string {
  const map: Record<string, string> = {
    hi: "Reply strictly in pure Hindi (Devanagari script).",
    hinglish: "Reply strictly in Hinglish (Roman Hindi mixed with English).",
    en: "Reply strictly in English.",
    te: "Reply strictly in Telugu (తెలుగు).", ta: "Reply strictly in Tamil (தமிழ்).",
    kn: "Reply strictly in Kannada (ಕನ್ನಡ).", bn: "Reply strictly in Bengali (বাংলা).",
    mr: "Reply strictly in Marathi (मराठी).", gu: "Reply strictly in Gujarati (ગુજરાતી).",
    ml: "Reply strictly in Malayalam (മലയാളം).",
  };
  return map[lang] || map["hinglish"];
}

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const language = (formData.get("language") as string) || "hinglish";

    // 🔥 BACKEND VALIDATION (Security)
    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({ error: "INVALID_IMAGE", message: "Missing image." }, { status: 400 });
    }
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "INVALID_IMAGE", message: "Image must be under 10MB." }, { status: 400 });
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(imageFile.type)) {
      return NextResponse.json({ error: "INVALID_IMAGE", message: "Only JPG, PNG or WEBP are supported." }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    const prompt = `You are an expert Vedic Palmist. Analyze this palm image.
    If the image is not a hand, return exactly: {"error": "INVALID_IMAGE", "message": "Please upload a clear palm photo."}
    Otherwise, return JSON with keys: title, insight (2 paragraphs), hook.
    
    LANGUAGE RULES: ${getLanguageInstruction(language)}`;

    let result: any = null;

    // 1. Try Modal Vision
    if (modalClient) {
      try {
        const completion = await modalClient.chat.completions.create({
          model: "Qwen/Qwen3.6-27B", 
          messages: [{ role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: `data:${imageFile.type};base64,${base64Image}` } }] }],
          temperature: 0.4,
          response_format: { type: "json_object" }, // 🔥 Force JSON
        });
        const text = completion.choices[0]?.message?.content || "{}";
        result = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
      } catch (err) {
        console.warn("Modal failed, trying Groq...", err);
      }
    }

    // 2. Fallback to Groq Vision (Using stable Llama 3.2 Vision)
    if (!result) {
      try {
        const completion = await groqClient.chat.completions.create({
          model: "llama-3.2-11b-vision-preview", // 🔥 Updated Model
          messages: [{ role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: `data:${imageFile.type};base64,${base64Image}` } }] }],
          temperature: 0.4,
          response_format: { type: "json_object" }, // 🔥 Force JSON
        });
        const text = completion.choices[0]?.message?.content || "{}";
        result = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
      } catch (err) {
        console.error("Groq also failed:", err);
        return NextResponse.json({ error: "AI_ERROR", message: "AI server is busy." }, { status: 500 });
      }
    }

    if (result.error === "INVALID_IMAGE") return NextResponse.json(result, { status: 422 });

    return NextResponse.json({
      success: true,
      result: {
        title: result.title || "Reading",
        insight: result.insight || "Analysis complete.",
        hook: result.hook || "A new change is coming."
      }
    });

  } catch (error: any) {
    console.error("Palm API Error:", error);
    return NextResponse.json({ error: "AI_ERROR", message: "Server error." }, { status: 500 });
  }
}
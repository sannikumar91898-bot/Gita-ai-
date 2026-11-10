// app/api/face-reading/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getUser } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Modal Config (PRIMARY)
const modalApiKey = process.env.MODAL_API_KEY;
const modalUrl = process.env.MODAL_API_URL;
const modalClient = modalUrl ? new OpenAI({ baseURL: modalUrl, apiKey: modalApiKey || "dummy" }) : null;

// Groq Config (FALLBACK)
const groqClient = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY || "dummy",
});

// 🔥 Model names environment variables se aayenge
const MODAL_VISION_MODEL = process.env.MODAL_VISION_MODEL || "Qwen/Qwen3.6-27B";
const GROQ_VISION_MODEL = process.env.GROQ_VISION_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct";

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

    // Backend Validation
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

    const prompt = `You are an expert Vedic Face Reader. Analyze this face.
    If no clear human face is visible, return exactly: {"error": "INVALID_IMAGE", "message": "Please upload a clear photo of a human face."}
    Otherwise, return JSON with keys: title, insight (2 paragraphs), hook.
    LANGUAGE RULES: ${getLanguageInstruction(language)}`;

    let result: any = null;
    let errors: string[] = [];

    // 1. Try Modal (PRIMARY)
    if (modalClient) {
      try {
        const completion = await modalClient.chat.completions.create({
          model: MODAL_VISION_MODEL,
          messages: [{ role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: `data:${imageFile.type};base64,${base64Image}` } }] }],
          temperature: 0.4,
          response_format: { type: "json_object" },
        });
        const text = completion.choices[0]?.message?.content || "{}";
        result = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
      } catch (err: any) {
        errors.push(`Modal: ${err.message}`);
        console.warn("Modal failed:", err.message);
      }
    }

    // 2. Fallback to Groq
    if (!result) {
      try {
        const completion = await groqClient.chat.completions.create({
          model: GROQ_VISION_MODEL,
          messages: [{ role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: `data:${imageFile.type};base64,${base64Image}` } }] }],
          temperature: 0.4,
          response_format: { type: "json_object" },
        });
        const text = completion.choices[0]?.message?.content || "{}";
        result = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
      } catch (err: any) {
        errors.push(`Groq: ${err.message}`);
        console.error("Groq failed:", err.message);
      }
    }

    // Agar dono fail ho gaye
    if (!result) {
      console.error("=== BOTH AI PROVIDERS FAILED (FACE READING) ===");
      console.error("Errors:", errors);
      return NextResponse.json({ 
        error: "AI_ERROR", 
        message: "AI server is busy. Please try again.",
        debug: process.env.NODE_ENV === "development" ? errors : undefined
      }, { status: 500 });
    }

    if (result.error === "INVALID_IMAGE") {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      result: {
        title: result.title || "Face Reading",
        insight: result.insight || "Analysis complete.",
        hook: result.hook || "A new change is coming."
      }
    });

  } catch (error: any) {
    console.error("Face Reading API Error:", error);
    return NextResponse.json({ error: "AI_ERROR", message: "Server error." }, { status: 500 });
  }
}
// app/api/face-reading/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getUser } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const modalApiKey = process.env.MODAL_API_KEY;
const modalUrl = process.env.MODAL_API_URL;
const modalClient = modalUrl ? new OpenAI({ baseURL: modalUrl, apiKey: modalApiKey || "dummy" }) : null;

const groqClient = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY || "dummy",
});

// 🔥 10 Language Prompt Helper
function getLanguageInstruction(lang: string): string {
  const map: Record<string, string> = {
    hi: "Reply strictly in pure Hindi (Devanagari script).",
    hinglish: "Reply strictly in Hinglish (Roman Hindi mixed with English).",
    en: "Reply strictly in English.",
    te: "Reply strictly in Telugu (తెలుగు).",
    ta: "Reply strictly in Tamil (தமிழ்).",
    kn: "Reply strictly in Kannada (ಕನ್ನಡ).",
    bn: "Reply strictly in Bengali (বাংলা).",
    mr: "Reply strictly in Marathi (मराठी).",
    gu: "Reply strictly in Gujarati (ગુજરાતી).",
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
    const language = (formData.get("language") as string) || "hinglish"; // 🔥 Get Language

    if (!imageFile) return NextResponse.json({ error: "Missing image" }, { status: 400 });

    const bytes = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    const prompt = `You are an expert Vedic Face Reader. Analyze this face.
    If no clear human face is visible, return exactly: {"error": "INVALID_IMAGE", "message": "Please upload a clear photo of a human face."}
    Otherwise, return a JSON object with exactly these keys:
    - "title": Short title of the reading.
    - "insight": 2-paragraph reading about nature, career, and relationships.
    - "hook": Short engaging 1-line summary.
    
    LANGUAGE RULES:
    ${getLanguageInstruction(language)} // 🔥 Dynamic Language
    Output ONLY raw JSON, no markdown formatting.`;

    let result: any = null;

    if (modalClient) {
      try {
        const completion = await modalClient.chat.completions.create({
          model: "Qwen/Qwen3.6-27B", 
          messages: [{ role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: `data:${imageFile.type};base64,${base64Image}` } }] }],
          temperature: 0.4,
        });
        const text = completion.choices[0]?.message?.content || "";
        result = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
      } catch (err) {
        console.warn("Modal failed, trying Groq...", err);
      }
    }

    if (!result) {
      try {
        const completion = await groqClient.chat.completions.create({
          model: "qwen/qwen3.6-27b",
          messages: [{ role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: `data:${imageFile.type};base64,${base64Image}` } }] }],
          temperature: 0.4,
        });
        const text = completion.choices[0]?.message?.content || "";
        result = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
      } catch (err) {
        return NextResponse.json({ error: "AI_ERROR", message: "AI server is busy. Please try again." }, { status: 500 });
      }
    }

    if (result.error === "INVALID_IMAGE") return NextResponse.json(result, { status: 422 });

    return NextResponse.json({
      success: true,
      result: {
        title: result.title || "Face Reading",
        insight: result.insight || "Analysis complete.",
        hook: result.hook || "A new change is coming."
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: "AI_ERROR", message: "Server error." }, { status: 500 });
  }
}
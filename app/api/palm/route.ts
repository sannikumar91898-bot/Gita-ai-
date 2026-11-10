// app/api/palm/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getUser } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 🔥 SIRF MODAL (Koi Gemini, koi Groq nahi)
const modalApiKey = process.env.MODAL_API_KEY;
const modalUrl = process.env.MODAL_API_URL;

// Check karo ki URL aur Key hain ya nahi
if (!modalUrl || !modalApiKey) {
  console.error("[FATAL] MODAL_API_URL or MODAL_API_KEY is missing in Render!");
}

const modalClient = new OpenAI({
  baseURL: modalUrl || "http://localhost:8000/v1",
  apiKey: modalApiKey || "dummy-key",
  timeout: 60000, // 60 seconds timeout for image analysis
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

    const prompt = `You are an expert Vedic Palmist. Analyze this palm image.
    If the image is not a hand, return exactly: {"error": "INVALID_IMAGE", "message": "Please upload a clear palm photo."}
    Otherwise, return JSON with keys: title, insight (2 paragraphs), hook.
    LANGUAGE RULES: ${getLanguageInstruction(language)}`;

    let result: any = null;

    // 🔥 CALL MODAL DIRECTLY
    try {
      const completion = await modalClient.chat.completions.create({
        model: "Qwen/Qwen3.6-27B", // Aapke Modal ka exact model name
        messages: [
          { 
            role: "user", 
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:${imageFile.type};base64,${base64Image}` } }
            ] 
          }
        ],
        temperature: 0.4,
        response_format: { type: "json_object" },
      });

      const text = completion.choices[0]?.message?.content || "{}";
      result = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
      
    } catch (err: any) {
      console.error("=== MODAL API FAILED ===");
      console.error("Error Name:", err.name);
      console.error("Error Message:", err.message);
      
      // Agar URL galat hai ya endpoint dead hai
      if (err.message?.includes("404")) {
        return NextResponse.json({ 
          error: "AI_ERROR", 
          message: "Modal Endpoint nahi mila. Kripya check karein ki endpoint 'Running' state me hai ya nahi." 
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        error: "AI_ERROR", 
        message: "AI server is busy. Please try again." 
      }, { status: 500 });
    }

    if (result.error === "INVALID_IMAGE") {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      result: {
        title: result.title || "Palm Reading",
        insight: result.insight || "Analysis complete.",
        hook: result.hook || "A new change is coming."
      }
    });

  } catch (error: any) {
    console.error("Palm API Error:", error);
    return NextResponse.json({ error: "AI_ERROR", message: "Server error." }, { status: 500 });
  }
}
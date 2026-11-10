// app/api/face-reading/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getUser } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 🔥 PRIMARY: MODAL API (Qwen Vision)
const modalApiKey = process.env.MODAL_API_KEY;
const modalUrl = process.env.MODAL_API_URL;
const modalClient = modalUrl ? new OpenAI({ baseURL: modalUrl, apiKey: modalApiKey || "dummy" }) : null;

// 🔥 FALLBACK: GROQ API
const groqClient = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY || "dummy",
});

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    if (!imageFile) return NextResponse.json({ error: "Missing image" }, { status: 400 });

    const bytes = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    const prompt = `You are an expert Vedic Face Reader. Analyze this face.
    If no clear human face is visible, return exactly: {"error": "INVALID_IMAGE", "message": "Please upload a clear photo of a human face."}
    Otherwise, return a JSON object with exactly these keys:
    - "title": Short title of the reading (e.g., "Milan aur Career").
    - "insight": 2-paragraph reading in Hinglish about nature, career, and relationships.
    - "hook": Short engaging 1-line summary.
    Output ONLY raw JSON, no markdown formatting.`;

    let result: any = null;

    // 1. Try Modal Vision
    if (modalClient) {
      try {
        const completion = await modalClient.chat.completions.create({
          model: "Qwen/Qwen3.6-27B", 
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: `data:${imageFile.type};base64,${base64Image}` } },
              ],
            },
          ],
          temperature: 0.4,
        });
        const text = completion.choices[0]?.message?.content || "";
        result = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
      } catch (err) {
        console.warn("Modal failed, trying Groq...", err);
      }
    }

    // 2. Fallback to Groq Vision
    if (!result) {
      try {
        const completion = await groqClient.chat.completions.create({
          model: "qwen/qwen3.6-27b",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: `data:${imageFile.type};base64,${base64Image}` } },
              ],
            },
          ],
          temperature: 0.4,
        });
        const text = completion.choices[0]?.message?.content || "";
        result = JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
      } catch (err) {
        console.error("Both AI providers failed.");
        return NextResponse.json({ error: "AI_ERROR", message: "AI server is busy. Please try again." }, { status: 500 });
      }
    }

    // Frontend Error Match
    if (result.error === "INVALID_IMAGE") {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      result: {
        title: result.title || "Aapka Face Reading",
        insight: result.insight || "Aapke chehre ke lakshan bahut shubh hain.",
        hook: result.hook || "Aapke bhagya mein ek naya badlav aane wala hai."
      }
    });

  } catch (error: any) {
    console.error("Face Reading Error:", error);
    return NextResponse.json({ error: "AI_ERROR", message: "Server error." }, { status: 500 });
  }
}
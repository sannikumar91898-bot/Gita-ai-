// app/api/palm/route.ts
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

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    if (!imageFile) return NextResponse.json({ error: "Missing image" }, { status: 400 });

    const bytes = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    const prompt = `You are an expert Vedic Palmist. Analyze this palm image.
    If the image is not a hand, return exactly: {"error": "INVALID_IMAGE", "message": "Please upload a clear palm photo."}
    Otherwise, return JSON with keys: title, insight (2 paragraphs), hook.`;

    let result: any = null;

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

    if (result.error === "INVALID_IMAGE") {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      result: {
        title: result.title || "Aapki Hatheli ka Vishleshan",
        insight: result.insight || "Aapki hatheli ki rekhaayein bahut shubh hain.",
        hook: result.hook || "Aapke bhagya mein ek naya badlav aane wala hai."
      }
    });

  } catch (error: any) {
    console.error("Palm Reading Error:", error);
    return NextResponse.json({ error: "AI_ERROR", message: "Server error." }, { status: 500 });
  }
}
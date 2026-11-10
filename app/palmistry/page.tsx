// app/api/palm/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUser } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) return NextResponse.json({ error: "Missing image" }, { status: 400 });

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // 🔥 PROMPT: Frontend ko structured JSON chahiye
    const prompt = `You are an expert Vedic Palmist. Analyze this palm image.
    If the image does NOT clearly contain a human hand/palm, return exactly this JSON:
    {"error": "INVALID_IMAGE", "message": "Please upload a clear photo of your palm."}

    If it is a valid palm, return a JSON object with exactly these keys:
    - "title": Short title of the reading (e.g., "Bhagya Rekha aur Career").
    - "insight": 2-paragraph reading in Hinglish about their Life Line, Heart Line, and Head Line.
    - "hook": Short engaging 1-line summary about their future.
    
    Output ONLY raw JSON, no markdown formatting like \`\`\`json.`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Image, mimeType: imageFile.type } },
    ]);

    let responseText = result.response.text();
    
    // Clean markdown if AI adds it
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const parsedData = JSON.parse(responseText);

    // 🔥 Frontend Error handling match
    if (parsedData.error === "INVALID_IMAGE") {
      return NextResponse.json(parsedData, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      result: {
        title: parsedData.title || "Aapki Hatheli ka Vishleshan",
        insight: parsedData.insight || "Aapki hatheli ki rekhaayein bahut shubh hain.",
        hook: parsedData.hook || "Aapke bhagya mein ek naya badlav aane wala hai."
      }
    });

  } catch (error: any) {
    console.error("Palm Reading Error:", error);
    return NextResponse.json({ error: "AI_ERROR", message: "Server error." }, { status: 500 });
  }
}
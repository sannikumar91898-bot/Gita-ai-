// app/api/face-reading/route.ts
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
    
    const prompt = `You are an expert Vedic Face Reader. Analyze this image.
    If the image does NOT clearly contain a human face, return exactly this JSON:
    {"error": "INVALID_IMAGE", "message": "Please upload a clear photo of a human face."}

    If it is a valid human face, return a JSON object with exactly these keys:
    - "title": Short title of the reading (e.g., "Milan aur Career").
    - "insight": 2-paragraph reading in Hinglish about nature, career, and relationships.
    - "hook": Short engaging summary.
    
    Output ONLY raw JSON, no markdown formatting like \`\`\`json.`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Image, mimeType: imageFile.type } },
    ]);

    let responseText = result.response.text();
    
    // Clean markdown if AI adds it
    responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const parsedData = JSON.parse(responseText);

    // 🔥 Match Frontend Expectation
    if (parsedData.error === "INVALID_IMAGE") {
      return NextResponse.json(parsedData, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      result: {
        title: parsedData.title || "Aapka Face Reading",
        insight: parsedData.insight || "Aapke chehre ke lakshan bahut shubh hain.",
        hook: parsedData.hook || "Aapke bhagya mein ek naya badlav aane wala hai."
      }
    });

  } catch (error: any) {
    console.error("Face Reading Error:", error);
    return NextResponse.json({ error: "AI_ERROR", message: "Server error." }, { status: 500 });
  }
}
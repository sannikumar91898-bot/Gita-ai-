import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";

import { db } from "@/index";
import { messages, conversations, aiResponseCache } from "@/schema";
import { getUser } from "@/auth";

const aiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const ai = aiKey ? new GoogleGenAI({ apiKey: aiKey }) : null;

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const { conversationId, content } = await req.json().catch(() => ({}));
    if (!conversationId || !content || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    // सुधार: यह लाइन हिंदी और इंग्लिश दोनों अक्षरों को बिना स्पेस के साफ करेगी ताकि डेटाबेस में सही मैच मिले
    const questionKey = content.trim().toLowerCase().replace(/[^a-zA-Z0-9\u0900-\u097F]/g, "");

    // 1. पहले डेटाबेस कैशे में चेक करें
    const cachedResult = await db
      .select()
      .from(aiResponseCache)
      .where(eq(aiResponseCache.questionKey, questionKey))
      .limit(1);

    let aiAnswer = "";

    if (cachedResult.length > 0) {
      // अगर पहले किसी ने इंग्लिश या हिंदी में यह पूछा था, तो सीधे डेटाबेस से जवाब मिलेगा
      aiAnswer = cachedResult[0].aiAnswer;
    } else {
      // 2. अगर डेटाबेस में नहीं है, तब असली जेमिनी API को कॉल करें
      if (!ai) {
        return NextResponse.json(
          { error: "AI service is temporarily offline." },
          { status: 503 }
        );
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: content, // जेमिनी यूजर की भाषा (English/Hindi) समझकर उसी भाषा में जवाब देगा
      });

      aiAnswer = response.text || "Sorry, I couldn't process that request right now.";

      // 3. भविष्य के लिए इसे डेटाबेस में सेव कर लें
      await db.insert(aiResponseCache).values({
        id: crypto.randomUUID(), // आपकी आईडी कन्वेंशन के अनुसार UUID जनरेशन
        questionKey: questionKey,
        originalQuestion: content,
        aiAnswer: aiAnswer,
      }).onConflictDoNothing();
    }

    // 4. यूजर का मैसेज सेव करें
    await db.insert(messages).values({
      id: crypto.randomUUID(),
      conversationId,
      userId: user.id,
      role: "user",
      content,
    });

    // 5. एआई का जवाब सेव करें
    const [assistantMsg] = await db.insert(messages).values({
      id: crypto.randomUUID(),
      conversationId,
      userId: user.id,
      role: "assistant",
      content: aiAnswer,
    }).returning();

    return NextResponse.json({ message: assistantMsg });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "AI service is temporarily busy. Please try again shortly" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
// पुराने पैकेज का इस्तेमाल ताकि इंस्टॉल न करना पड़े
import { GoogleGenerativeAI } from "@google/generative-ai";

import { db } from "@/index";
import { messages, aiResponseCache } from "@/schema";
import { getUser } from "@/auth";

const aiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash"; // पुराना पैकेज 1.5-flash को बेस्ट सपोर्ट करता है
const genAI = aiKey ? new GoogleGenerativeAI(aiKey) : null;

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

    // हिंदी और इंग्लिश दोनों को साफ करने का लॉजिक
    const questionKey = content.trim().toLowerCase().replace(/[^a-zA-Z0-9\u0900-\u097F]/g, "");

    // 1. पहले डेटाबेस कैशे में चेक करें
    const cachedResult = await db
      .select()
      .from(aiResponseCache)
      .where(eq(aiResponseCache.questionKey, questionKey))
      .limit(1);

    let aiAnswer = "";

    if (cachedResult.length > 0) {
      // फिक्स: एरे में से पहला ऑब्जेक्ट निकालने का सही तरीका
      aiAnswer = cachedResult[0].aiAnswer;
    } else {
      // 2. डेटाबेस में नहीं मिलने पर पुराना जेमिनी क्लाइंट कॉल
      if (!genAI) {
        return NextResponse.json(
          { error: "AI service is temporarily offline." },
          { status: 503 }
        );
      }

      const model = genAI.getGenerativeModel({ model: modelName });
      const response = await model.generateContent(content);
      const responseText = await response.response.text();

      aiAnswer = responseText || "Sorry, I couldn't process that request right now.";

      // 3. भविष्य के लिए कैशे में सेव करें
      await db.insert(aiResponseCache).values({
        id: crypto.randomUUID(),
        questionKey: questionKey,
        originalQuestion: content,
        aiAnswer: aiAnswer,
      }).onConflictDoNothing();
    }

    // 4. यूजर का मैसेज हिस्ट्री में सेव करें
    await db.insert(messages).values({
      id: crypto.randomUUID(),
      conversationId,
      userId: user.id,
      role: "user",
      content,
    });

    // 5. एआई का जवाब हिस्ट्री में सेव करें
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

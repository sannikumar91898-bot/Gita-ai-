import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { db } from "@/index";
import { messages, aiResponseCache } from "@/schema";
import { getUser } from "@/auth";

const aiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const genAI = aiKey ? new GoogleGenerativeAI(aiKey) : null;

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    // फ्रंटएंड से आने वाले 'message' या 'content' दोनों को संभालने के लिए फिक्स
    const content = body.message || body.content || "";
    const conversationId = body.conversationId || crypto.randomUUID();

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const questionKey = content.trim().toLowerCase().replace(/[^a-zA-Z0-9\u0900-\u097F]/g, "");

    // 1. पहले डेटाबेस कैशे में चेक करें
    const cachedResult = await db
      .select()
      .from(aiResponseCache)
      .where(eq(aiResponseCache.questionKey, questionKey))
      .limit(1);

    let aiAnswer = "";

    if (cachedResult.length > 0) {
      aiAnswer = cachedResult[0].aiAnswer;
    } else {
      // 2. जेमिनी API को कॉल करें
      if (!genAI) {
        return NextResponse.json({ error: "AI service offline" }, { status: 503 });
      }

      const model = genAI.getGenerativeModel({ model: modelName });
      const response = await model.generateContent(content);
      aiAnswer = response.response.text() || "Sorry, I couldn't process that.";

      // 3. कैशे में सेव करें
      await db.insert(aiResponseCache).values({
        id: crypto.randomUUID(),
        questionKey: questionKey,
        originalQuestion: content,
        aiAnswer: aiAnswer,
      }).onConflictDoNothing();
    }

    // 4. मैसेज हिस्ट्री सेव करें
    await db.insert(messages).values({
      id: crypto.randomUUID(),
      conversationId,
      userId: user.id,
      role: "user",
      content,
    });

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
    return NextResponse.json({ error: "AI service busy" }, { status: 500 });
  }
}

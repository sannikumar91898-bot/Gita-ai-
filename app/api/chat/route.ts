import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { db } from "@/index";
import { messages, aiResponseCache, birthDetails } from "@/schema";
import { getUser } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const aiKey = process.env.GEMINI_API_KEY?.trim();
const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash";
const genAI = aiKey ? new GoogleGenerativeAI(aiKey) : null;

export async function POST(req: NextRequest) {
  try {
    // ✦ यूजर ऑथेंटिकेशन चेक
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const content = (body.message || body.content || "").toString().trim();
    const conversationId = body.conversationId || crypto.randomUUID();

    if (!content) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    // ✦ स्टेप ए: डेटाबेस से लॉग-इन यूज़र की कुंडली डिटेल्स खोजें
    let userBirthData: any[] = [];
    try {
      userBirthData = await db
        .select()
        .from(birthDetails)
        .where(eq(birthDetails.userId, user.id))
        .limit(1);
    } catch (dbErr) {
      console.error("Failed to fetch birth details:", dbErr);
    }

    let contextPrompt = "";
    let questionKey = content.toLowerCase().replace(/[^a-zA-Z0-9\u0900-\u097F]/g, "");

    if (userBirthData && userBirthData.length > 0) {
      const u = userBirthData[0];
      contextPrompt = `User Birth Details -> Name: ${u.name}, Date of Birth: ${u.dob}, Time of Birth: ${u.birthTime}, Place of Birth: ${u.birthPlace}. `;
      questionKey = `u_${user.id}_${questionKey}`;
    }

    // ✦ स्टेप बी: डेटाबेस कैशे में चेक करें
    let aiAnswer = "";
    let isCached = false;

    try {
      const cachedResult = await db
        .select()
        .from(aiResponseCache)
        .where(eq(aiResponseCache.questionKey, questionKey))
        .limit(1);

      if (cachedResult && cachedResult.length > 0) {
        aiAnswer = cachedResult[0].aiAnswer;
        isCached = true;
      }
    } catch (cacheErr) {
      console.error("Cache query failed:", cacheErr);
    }

    // ✦ स्टेप सी: अगर कैशे में नहीं है, तब जेमिनी API को कॉल करें
    if (!isCached) {
      if (!genAI) {
        return NextResponse.json({ error: "AI service offline" }, { status: 503 });
      }

      const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: "You are Gita AI, a professional, warm, and highly respectful Vedic astrologer. Use the provided user birth details context (Name, DOB, Time, Place) to answer their query accurately in their language (Hindi/English). Address them by their name respectfully (e.g., Sanni ji) and behave like a real premium astrology app."
      });

      const finalPrompt = `${contextPrompt}User Question: ${content}`;
      
      const response = await model.generateContent(finalPrompt);
      aiAnswer = response.response.text() || "Sorry, I couldn't process that.";

      // ✦ स्टेप डी: डेटाबेस कैशे में सेव करें
      try {
        await db.insert(aiResponseCache).values({
          id: crypto.randomUUID(),
          questionKey: questionKey,
          originalQuestion: content,
          aiAnswer: aiAnswer,
        }).onConflictDoNothing();
      } catch (saveCacheErr) {
        console.error("Failed to save to cache table:", saveCacheErr);
      }
    }

    // ✦ स्टेप ई: यूजर और एआई दोनों के मैसेज को हिस्ट्री (Messages Table) में सेव करें
    try {
      await db.insert(messages).values({
        id: crypto.randomUUID(),
        conversationId,
        userId: user.id,
        role: "user",
        content,
      });
    } catch (msgErr) {
      console.error("Failed to log user message:", msgErr);
    }

    let assistantMsg: any = {
      id: crypto.randomUUID(),
      conversationId,
      userId: user.id,
      role: "assistant",
      content: aiAnswer,
    };

    try {
      const inserted = await db.insert(messages).values({
        id: assistantMsg.id,
        conversationId,
        userId: user.id,
        role: "assistant",
        content: aiAnswer,
      }).returning();
      
      if (inserted && inserted.length > 0) {
        assistantMsg = inserted[0];
      }
    } catch (insertErr) {
      console.error("Failed to insert assistant message history:", insertErr);
    }

    // ✅ फ़िक्स: Frontend object mapping payload alignment support (Balkal exact match format)
    return NextResponse.json({ 
      message: assistantMsg,
      reply: aiAnswer // Dono structure provide kar diya hai taaki component crash na kare
    }, { status: 200 });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "AI service busy" }, { status: 500 });
  }
}

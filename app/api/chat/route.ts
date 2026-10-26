import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { db } from "@/index";
import { messages, aiResponseCache, birthDetails } from "@/schema";
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
    const content = body.message || body.content || "";
    const conversationId = body.conversationId || crypto.randomUUID();

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    // ✦ स्टेप ए: डेटाबेस से इस लॉग-इन यूज़र की कुंडली डिटेल्स खोजें
    const userBirthData = await db
      .select()
      .from(birthDetails)
      .where(eq(birthDetails.userId, user.id))
      .limit(1);

    let contextPrompt = "";
    let questionKey = content.trim().toLowerCase().replace(/[^a-zA-Z0-9\u0900-\u097F]/g, "");

    if (userBirthData.length > 0) {
      const u = userBirthData[0];
      // जेमिनी को बैकएंड में बताने के लिए उसकी कुंडली का डेटा तैयार करें
      contextPrompt = `User Birth Details -> Name: ${u.name}, Date of Birth: ${u.dob}, Time of Birth: ${u.birthTime}, Place of Birth: ${u.birthPlace}. `;
      // कैशे की (Key) को यूज़र आईडी के साथ जोड़ें ताकि हर व्यक्ति को उसकी कुंडली के अनुसार ही कैशे जवाब मिले
      questionKey = `u_${user.id}_${questionKey}`;
    }

    // ✦ स्टेप बी: पहले डेटाबेस कैशे में चेक करें (जेमिनी का खर्च बचाने के लिए)
    const cachedResult = await db
      .select()
      .from(aiResponseCache)
      .where(eq(aiResponseCache.questionKey, questionKey))
      .limit(1);

    let aiAnswer = "";

    if (cachedResult.length > 0) {
      aiAnswer = cachedResult[0].aiAnswer;
    } else {
      // ✦ स्टेप सी: अगर डेटाबेस में नहीं है, तब असली जेमिनी API को कॉल करें
      if (!genAI) {
        return NextResponse.json({ error: "AI service offline" }, { status: 503 });
      }

      const model = genAI.getGenerativeModel({ 
        model: modelName,
        // एआई को असली ज्योतिषी बनाने के लिए कड़क सिस्टम इंस्ट्रक्शन
        systemInstruction: "You are Gita AI, a professional, warm, and highly respectful Vedic astrologer. Use the provided user birth details context (Name, DOB, Time, Place) to answer their query accurately in their language (Hindi/English). Address them by their name respectfully (e.g., Sanni ji) and behave like a real premium astrology app."
      });

      // जेमिनी को यूज़र का सवाल भेजने के साथ बैकएंड में उसकी जन्म डिटेल्स भी भेज रहे हैं
      const finalPrompt = `${contextPrompt}User Question: ${content}`;
      
      const response = await model.generateContent(finalPrompt);
      aiAnswer = response.response.text() || "Sorry, I couldn't process that.";

      // ✦ स्टेप डी: भविष्य के लिए इसे डेटाबेस कैशे में सेव कर लें
      await db.insert(aiResponseCache).values({
        id: crypto.randomUUID(),
        questionKey: questionKey,
        originalQuestion: content,
        aiAnswer: aiAnswer,
      }).onConflictDoNothing();
    }

    // ✦ स्टेप ई: यूजर और एआई दोनों के मैसेज को हिस्ट्री (Messages Table) में सेव करें
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

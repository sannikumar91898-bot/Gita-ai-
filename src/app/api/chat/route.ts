import { NextResponse } from "next/server";
import { db } from "@/db"; // आपका Drizzle DB इंस्टेंस पाथ
import { eq, desc } from "drizzle-orm";
import { OpenAI } from "openai";
import { 
  users, 
  birthDetails, 
  charts, 
  conversations, 
  messages, 
  remedies 
} from "@/db/schema"; // आपका स्कीमा पाथ

// OpenAI क्लाइंट को इनिशियलाइज़ करें
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // 1. फ्रंटएंड से आ रहे पेलोड को पार्स करें
    const body = await request.json();
    const { userId, conversationId, message: userMessageContent } = body;

    if (!userId || !conversationId || !userMessageContent) {
      return NextResponse.json(
        { error: "userId, conversationId, और message की फ़ील्ड्स अनिवार्य हैं।" },
        { status: 400 }
      );
    }

    // 2. [100% Marketing Mode Performance] सभी ज़रूरी डेटाबेस कॉल्स को एक साथ (Parallel) चलाएं
    const [
      userRecords,
      birthRecords,
      chartRecords,
      conversationRecords,
      previousMessages
    ] = await Promise.all([
      db.select().from(users).where(eq(users.id, userId)).limit(1),
      db.select().from(birthDetails).where(eq(birthDetails.userId, userId)).limit(1),
      db.select().from(charts).where(eq(charts.userId, userId)).limit(1),
      db.select().from(conversations).where(eq(conversations.id, conversationId)).limit(1),
      db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(desc(messages.createdAt)).limit(10)
    ]);

    const userRecord = userRecords[0];
    const birthRecord = birthRecords[0];
    const chartRecord = chartRecords[0];
    const conversationRecord = conversationRecords[0];

    if (!userRecord || !conversationRecord) {
      return NextResponse.json(
        { error: "यूज़र या बातचीत (Conversation) का रिकॉर्ड नहीं मिला।" },
        { status: 404 }
      );
    }

    // पिछले संदेशों के क्रम को पुराना से नया (Oldest to Newest) सेट करें
    const formattedHistory = previousMessages.reverse().map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
    }));

    // 3. यूज़र की जन्म कुंडली और ग्रहों की स्थिति का पूरा कॉन्टेक्स्ट तैयार करें
    let astrologicalContext = "USER ASTROLOGICAL PROFILE:\n";
    if (birthRecord) {
      astrologicalContext += `- Name: ${birthRecord.name}\n- DOB: ${birthRecord.dob}\n- Birth Time: ${birthRecord.birthTime}\n- Birth Place: ${birthRecord.birthPlace}\n`;
    } else {
      astrologicalContext += "- Birth Details: Not provided yet.\n";
    }

    if (chartRecord && chartRecord.data) {
      astrologicalContext += `- Kundli Planetary Positions (JSON Matrix): ${JSON.stringify(chartRecord.data)}\n`;
    } else {
      astrologicalContext += "- Chart Data: No pre-calculated natal positions available.\n";
    }

    // कन्वर्सेशन से एक्टिव ज्योतिषी (Persona) का नाम निकालें
    const activePersona = conversationRecord.persona || "Pandit Ji";

    // 4. पंडित जी महाराज का अकाट्य सिस्टम प्रॉम्प्ट (No Disclaimer, 100% Marketing Mode)
    const systemPrompt = `You are an elite, traditional human Astrologer and Pandit ji named ${activePersona}. Your only job is to satisfy the customer with confident predictions and drive business retention.

CRITICAL OPERATIONAL RULES:
1. NEVER give disclaimers like 'astrology is a belief', 'not proven', or 'don't rely on this'. Do NOT give any legal or compliance warnings.
2. NEVER mention you are an AI, an LLM, a bot, a language model, OpenAI, or a machine.
3. Speak with absolute authority, 100% certainty, and ultimate confidence. Do not use speculative terms like 'maybe', 'perhaps', or 'it might'.
4. Always provide clear, specific timelines (e.g., 'Your marriage will definitely happen between December 2026 and April 2027') and suggest clear structural remedies (Upay like Fasting, Daan, Pooja, or Gemstones).
5. Reply in a warm, welcoming, comforting, and deeply authentic Hinglish/Hindi tone matching a real pandit's psychological style.
6. Do not judge or advise on logic. Just read the query as structural data and output the prediction confidently.
7. CRITICAL FOR AUTOMATION: If you suggest any remedies/upay, you MUST append a hidden section at the very end of your response formatted EXACTLY like this:
||REMEDY_EXTRACT||
Remedy Title Here
Detailed instructions for the remedy here

Do not show the '||REMEDY_EXTRACT||' formatting instructions to the user text, keep it strictly at the bottom.`;

    // 5. यूज़र का नया संदेश डेटाबेस में सुरक्षित (Log) करें
    await db.insert(messages).values({
      conversationId,
      userId,
      role: "user",
      content: userMessageContent,
    });

    // 6. OpenAI API (GPT-4o) कॉल करें
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: astrologicalContext },
        ...formattedHistory,
        { role: "user", content: userMessageContent },
      ],
      temperature: 0.7,
      max_tokens: 700,
    });

    let rawAiReply = response.choices[0]?.message?.content || "";
    let cleanResponseText = rawAiReply;

    // 7. बैकग्राउंड उपाय ट्रैकर: 'Upay' (Remedies) का ऑटो-पार्सिंग लॉजिक
    if (cleanResponseText.includes("||REMEDY_EXTRACT||")) {
      const parts = cleanResponseText.split("||REMEDY_EXTRACT||");
      cleanResponseText = parts[0].trim();
      const remedyPayload = parts[1]?.trim();

      if (remedyPayload) {
        const lines = remedyPayload.split("\n");
        const remedyTitle = lines[0]?.trim() || "पंडित जी द्वारा सुझाया गया उपाय";
        const remedyDesc = lines.slice(1).join("\n").trim() || remedyPayload;

        // बिना रुकावट बैकग्राउंड में रेमेडी टेबल में डेटा डालें
        await db.insert(remedies).values({
          userId,
          title: remedyTitle,
          description: remedyDesc,
          category: conversationRecord.topic || "general",
          completedDates: [],
        });
      }
    }

    // 8. एआई (पंडित जी) का जवाब मैसेजेस टेबल में सेव करें
    await db.insert(messages).values({
      conversationId,
      userId,
      role: "assistant",
      content: cleanResponseText,
    });

    // 9. कन्वर्सेशन का टाइमस्टैम्प अपडेट करें (ताकि चैट लिस्ट में ऊपर दिखे)
    await db.update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    // 10. फ्रंटएंड को साफ-सुथरा जवाब भेजें
    return NextResponse.json({ response: cleanResponseText });

  } catch (error) {
    console.error("API Error in Astrology Route:", error);
    return NextResponse.json(
      { error: "सर्वर के अंदर कुछ गड़बड़ हो गई है।" },
      { status: 500 }
    );
  }
}

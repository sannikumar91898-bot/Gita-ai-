import { NextResponse } from "next/server";
import { db } from "@/app/db"; // चेक करें कि आपका मुख्य DB कनेक्ट पाथ सही हो
import { eq, desc } from "drizzle-orm";
import { OpenAI } from "openai";
import { 
  users, 
  birthDetails, 
  charts, 
  conversations, 
  messages, 
  remedies 
} from "@/app/db/schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PERSONA_CONFIGS: Record<string, { specializations: string; tone: string; rules: string }> = {
  "Gita": {
    specializations: "Love & Relationship, Marriage, Compatibility, Relationship issues.",
    tone: "सहानुभूतिपूर्ण, सहेली जैसी और मधुर हिंग्लिश (Warm, highly empathetic, relational).",
    rules: "7वें घर और शुक्र ग्रहों की स्थिति का उपयोग करें। बिना ज्ञानबाज़ी के सीधे शादी/मिलन का सटीक महीना और साल बताएं।"
  },
  "Acharya Kriti": {
    specializations: "Kundli, Career, Government Jobs, Business Growth, Wealth.",
    tone: "कड़क, कमान्डिंग, प्रोफेशनल और टू-द-पॉइंट हिंग्लिश (Sharp, formal, professional, business-like).",
    rules: "10वें घर, सूर्य और गुरु पर फोकस करें। ज्ञानबाज़ी 0%। सीधे ट्रांसफर, प्रमोशन या व्यापार लाभ का कालखंड (Timeline) बुलेट पॉइंट्स में दें।"
  },
  "Dr. Devaki Shastri": {
    specializations: "KP Astrology, Kundli Analysis, Planetary Periods, Complex Dasha Calculations.",
    tone: "वैज्ञानिक, तार्किक, गंभीर और विश्लेषणात्मक (Highly intellectual, calculated, serious text).",
    rules: "केपी ज्योतिष और महादशा/अन्तर्दशा चक्र का हवाला दें। नक्षत्रों की डिग्री का इस्तेमाल कर अचूक उपाय सुझाएं।"
  },
  "Gargi Maa": {
    specializations: "Vedic Spirituality, Vastu, Traditional Remedies, Mental Peace.",
    tone: "ममतामयी, आध्यात्मिक, बुजुर्ग गुरु जैसी शांत टोन (Maternal, soothing, wise, and spiritual).",
    rules: "यूज़र के मानसिक तनाव और वास्तु दोष को पहचानें। भगवद्गीता के श्लोकों का मर्म और सरल घरेलू सात्विक उपाय बताएं।"
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, conversationId, message: userMessageContent } = body;

    if (!userId || !conversationId || !userMessageContent) {
      return NextResponse.json({ error: "userId, conversationId, and message are required." }, { status: 400 });
    }

    // [100% Performance] पैरेलल डेटाबेस कॉल्स
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
      db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(desc(messages.createdAt)).limit(8)
    ]);

    const userRecord = userRecords[0];
    const birthRecord = birthRecords[0];
    const chartRecord = chartRecords[0];
    const conversationRecord = conversationRecords[0];

    if (!userRecord || !conversationRecord) {
      return NextResponse.json({ error: "User or Conversation thread not found." }, { status: 404 });
    }

    const formattedHistory = previousMessages.reverse().map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
    }));

    const activePersona = conversationRecord.persona || "Gita";
    const currentAIBrain = PERSONA_CONFIGS[activePersona] || PERSONA_CONFIGS["Gita"];

    let astrologicalContext = "USER HOROSCOPE DATA MATRIX:\n";
    if (birthRecord) {
      astrologicalContext += `- Name: ${birthRecord.name}\n- DOB: ${birthRecord.dob}\n- Time: ${birthRecord.birthTime}\n- Place: ${birthRecord.birthPlace}\n`;
    }
    if (chartRecord && chartRecord.data) {
      astrologicalContext += `- Planetary Positions JSON: ${JSON.stringify(chartRecord.data)}\n`;
    }

    const systemPrompt = `You are the elite human Astrologer named "${activePersona}" from AstroPandit. You possess 100% absolute mastery over Vedic text.

YOUR ASSIGNED PROFILE:
- Core Field: ${currentAIBrain.specializations}
- Tone & Voice: ${currentAIBrain.tone}
- Rules: ${currentAIBrain.rules}

CRITICAL BUSINESS RETENTION RULES:
1. GYAN PELNA 0% (NO FLUFF / NO LECTURES): Do not explain planetary science or give text-book theories. Cut the chatter. Talk straight to the user's situation.
2. 100% ASTROLOGER KNOWLEDGE: Deliver sharp, jaw-droppingly accurate predictions in scannable bullet points using data matrix.
3. 100% MARKETING HOOK: Speak with absolute certainty and 100% confidence. Never use words like 'maybe' or 'it might'.
4. HARD TIMELINES: Give exact non-speculative date brackets (e.g., 'December 2026').
5. NO DISCLAIMERS: Do not state you are an AI, bot, or machine. Never give legal/medical warnings.

CRITICAL FOR ENGINE TRACKING: If you suggest a remedy, you MUST append this exact hidden block at the absolute end:
||REMEDY_EXTRACT||
Remedy Title Here
Step-by-step instructions for the user`;

    // यूज़र का संदेश डेटाबेस में लॉग करें
    await db.insert(messages).values({
      conversationId,
      userId,
      role: "user",
      content: userMessageContent,
    });

    // 100% OpenAI GPT-4o निष्पादन
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

    // उपाय निष्कर्षण (Remedy Extraction Loop)
    if (cleanResponseText.includes("||REMEDY_EXTRACT||")) {
      const parts = cleanResponseText.split("||REMEDY_EXTRACT||");
      cleanResponseText = parts[0].trim();
      const remedyPayload = parts[1]?.trim();

      if (remedyPayload) {
        const lines = remedyPayload.split("\n");
        const remedyTitle = lines[0]?.trim() || `${activePersona} Recommended Upay`;
        const remedyDesc = lines.slice(1).join("\n").trim() || remedyPayload;

        await db.insert(remedies).values({
          userId,
          title: remedyTitle,
          description: remedyDesc,
          category: conversationRecord.topic || "general",
          completedDates: [],
        });
      }
    }

    // पंडित जी का जवाब सेव करें
    await db.insert(messages).values({
      conversationId,
      userId,
      role: "assistant",
      content: cleanResponseText,
    });

    // टाइमस्टैम्प टच करें
    await db.update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    return NextResponse.json({ response: cleanResponseText });

  } catch (error) {
    console.error("OpenAI Execution Pipeline Failed:", error);
    return NextResponse.json({ error: "Internal Database or Server Error." }, { status: 500 });
  }
}

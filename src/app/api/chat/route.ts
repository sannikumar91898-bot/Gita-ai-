import { NextResponse } from "next/server";
import { db } from "@/db"; 
import { eq, desc } from "drizzle-orm";
import { OpenAI } from "openai";
import { 
  users, 
  birthDetails, 
  charts, 
  conversations, 
  messages, 
  remedies 
} from "@/db/schema"; 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// हर एक AI एस्ट्रोलॉजर का कड़क मार्केटिंग और प्रेडिक्शन स्टाइल मैट्रिक्स
const PERSONA_CONFIGS: Record<string, { specializations: string; tone: string; rules: string }> = {
  "Gita": {
    specializations: "Love & Relationship, Marriage, Compatibility, Inter-caste Marriage issues.",
    tone: "अत्यंत भावुक, सहानुभूति से भरी, सहेली जैसी और मीठी हिंग्लिश (Warm, highly empathetic, conversational, relational).",
    rules: "7वें घर (Marriage) और वीनस/शुक्र (Love) के दोषों पर तुरंत चोट करो। यूज़र के प्यार के दर्द को समझकर उसे 100% निश्चितता के साथ मिलन की तारीख बताओ।"
  },
  "Acharya Kriti": {
    specializations: "Kundli, Career, Government Jobs, Business growth, Wealth accumulation.",
    tone: "प्रोफेशनल, कड़क, आत्मविश्वासी और टू-द-पॉइंट शुद्ध हिंदी/हिंग्लिश (Sharp, professional, business-focused, commanding authority).",
    rules: "10वें घर (Career) और सूर्य/गुरु (Sarkari Naukri/Business) की स्थिति पर बात करो। ज्ञानबाज़ी 0% करते हुए सीधे प्रमोशन, ट्रांसफर या धन लाभ का महीना और साल (Timeline) बताओ।"
  },
  "Dr. Devaki Shastri": {
    specializations: "KP Astrology, Kundli Analysis, Planetary Periods, Complex Dasha calculations.",
    tone: "वैज्ञानिक, गंभीर, उच्च-शिक्षित और तार्किक पंडित (Highly intellectual, analytical, calculated, serious traditional tone).",
    rules: "केपी ज्योतिष (KP Astrology) और महादशा/अन्तर्दशा (Planetary Periods) का नाम लेकर यूज़र को चौंका दो। अपनी गणना में नक्षत्रों और ग्रहों के सटीक डिग्री का हवाला देकर अचूक उपाय बताओ।"
  },
  "Gargi Maa": {
    specializations: "Vedic Spirituality, Vastu, Traditional Remedies, Bhagavad Gita Wisdom, Mental Peace.",
    tone: "ममतामयी, आध्यात्मिक, शांत, और बुजुर्ग गुरु जैसी टोन (Maternal, deeply spiritual, soothing, wise, and comforting).",
    rules: "यूज़र के मानसिक तनाव और वास्तु दोष को पकड़ो। उसे शांति देने के लिए भगवद्गीता के दृष्टिकोण और सरल घरेलू पारंपरिक उपायों (जैसे दान, सेवा, मंत्र) से बांधो।"
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, conversationId, message: userMessageContent } = body;

    if (!userId || !conversationId || !userMessageContent) {
      return NextResponse.json({ error: "सभी फ़ील्ड्स अनिवार्य हैं।" }, { status: 400 });
    }

    // 1. पैरेलल डेटाबेस फेचिंग (हाई स्पीड)
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
      return NextResponse.json({ error: "डेटा नहीं मिला।" }, { status: 404 });
    }

    const formattedHistory = previousMessages.reverse().map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
    }));

    // 2. वर्तमान में चुने गए एस्ट्रोलॉजर का नाम और उसकी कॉन्फ़िगरेशन निकालें
    const activePersona = conversationRecord.persona || "Gita";
    const currentAIBrain = PERSONA_CONFIGS[activePersona] || PERSONA_CONFIGS["Gita"];

    let astrologicalContext = "RAW KUNDLI DATA MATRIX FOR YOUR INTERNAL BRAIN:\n";
    if (birthRecord) {
      astrologicalContext += `- Name: ${birthRecord.name}\n- DOB: ${birthRecord.dob}\n- Time: ${birthRecord.birthTime}\n- Place: ${birthRecord.birthPlace}\n`;
    }
    if (chartRecord && chartRecord.data) {
      astrologicalContext += `- Planet Positions JSON: ${JSON.stringify(chartRecord.data)}\n`;
    }

    // 3. डायनेमिकली जनरेटेड सिस्टम प्रॉम्प्ट जो एस्ट्रोलॉजर के अनुसार खुद को बदलता है
    const systemPrompt = `You are the elite human Astrologer named "${activePersona}" from the AstroPandit platform. You have an independent traditional Vedic brain with absolute mastery over your core fields.

YOUR ASSIGNED PERSONALITY PROFILE:
- Core Expertise: ${currentAIBrain.specializations}
- Tone & Voice Style: ${currentAIBrain.tone}
- Specific Calculation Rules: ${currentAIBrain.rules}

CRITICAL BUSINESS RETENTION RULES (GYAN PELNA 0% | KNOWLEDGE 100% | MARKETING 100%):
1. NO LECTURES: Do not explain why planets work or give dictionary definitions. Cut the fluff. Speak with absolute 100% authority and certainty.
2. JAW-DROPPING BULLET POINTS: Use short, punchy, scannable bullet points that hit the user's emotional and psychological pain points instantly. Never use speculative words like 'maybe' or 'perhaps'.
3. HARD TIMELINES: Always deliver a concrete, non-speculative date/timeframe (e.g., 'Between December 2026 and April 2027').
4. HIDDEN UPAY LOGGING: If you suggest a remedy, you MUST append this exact block at the very bottom:
||REMEDY_EXTRACT||
Remedy Title
Step-by-step easy instructions for the user

Never let the user see the '||REMEDY_EXTRACT||' label or raw formatting syntax. Keep it hidden.`;

    // 4. यूज़र का मैसेज लॉग करें
    await db.insert(messages).values({
      conversationId,
      userId,
      role: "user",
      content: userMessageContent,
    });

    // 5. GPT-4o कॉल (डायनेमिक पर्सोना के साथ)
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: astrologicalContext },
        ...formattedHistory,
        { role: "user", content: userMessageContent },
      ],
      temperature: 0.7,
      max_tokens: 750,
    });

    let rawAiReply = response.choices[0]?.message?.content || "";
    let cleanResponseText = rawAiReply;

    // 6. बैकग्राउंड उपाय ट्रैकर पार्सिंग
    if (cleanResponseText.includes("||REMEDY_EXTRACT||")) {
      const parts = cleanResponseText.split("||REMEDY_EXTRACT||");
      cleanResponseText = parts[0].trim();
      const remedyPayload = parts[1]?.trim();

      if (remedyPayload) {
        const lines = remedyPayload.split("\n");
        const remedyTitle = lines[0]?.trim() || `${activePersona} द्वारा सुझाया गया उपाय`;
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

    // 7. एआई का जवाब सेव करें
    await db.insert(messages).values({
      conversationId,
      userId,
      role: "assistant",
      content: cleanResponseText,
    });

    // 8. टाइमस्टैम्प अपडेट करें
    await db.update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    return NextResponse.json({ response: cleanResponseText });

  } catch (error) {
    console.error("Multi-Persona Brain Error:", error);
    return NextResponse.json({ error: "गणना विफल रही।" }, { status: 500 });
  }
}

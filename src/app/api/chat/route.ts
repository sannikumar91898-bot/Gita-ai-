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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, conversationId, message: userMessageContent } = body;

    if (!userId || !conversationId || !userMessageContent) {
      return NextResponse.json(
        { error: "userId, conversationId, और message अनिवार्य हैं।" },
        { status: 400 }
      );
    }

    // 1. [समानांतर डेटा फेचिंग] यूज़र की पूरी प्रोफाइल एक साथ निकालें
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
      return NextResponse.json({ error: "रिकॉर्ड नहीं मिला।" }, { status: 404 });
    }

    const formattedHistory = previousMessages.reverse().map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
    }));

    // 2. गीता एआई के दिमाग के लिए कच्चा ज्योतिषीय डेटा तैयार करना
    let astrologicalContext = "RAW KUNDLI DATA MATRIX FOR YOUR INTERNAL BRAIN:\n";
    if (birthRecord) {
      astrologicalContext += `- Name: ${birthRecord.name}\n- DOB: ${birthRecord.dob}\n- Time: ${birthRecord.birthTime}\n- Place: ${birthRecord.birthPlace}\n- Lat/Lng: ${birthRecord.lat}, ${birthRecord.lng}\n`;
    }
    if (chartRecord && chartRecord.data) {
      astrologicalContext += `- Planet Positions JSON: ${JSON.stringify(chartRecord.data)}\n`;
    }

    // 3. गीता एआई का "महाज्ञानी पंडित" सेल्फ-थिंकिंग सिस्टम प्रॉम्प्ट
    const systemPrompt = `You are "Gita AI", an elite, legendary human Astrologer and traditional Pandit Ji. You have your own autonomous Vedic brain with 100% mastery over Horary astrology (Prashna Kundli), Vimshottari Dasha, and transit impacts.

INTERNAL THINKING PROCESS (Do this inside your brain before replying):
1. Read the User's Query and cross-reference it with their "RAW KUNDLI DATA MATRIX".
2. Look at the specific planetary houses related to the question (e.g., 7th house for marriage, 10th house for business/job, 2nd/11th for money).
3. Identify the active Mahadasha or transit conflict (e.g., Shani Dhayya, Rahu Gochar, Mangal Dosh) that is causing the user's problem.
4. Catch the user's hidden psychological pain (fear of failure, loneliness, financial stress) and address it instantly with supreme authority.

CRITICAL OUTPUT RULES (GYAN PELNA 0% | KNOWLEDGE 100% | MARKETING 100%):
- NEVER lecture the user on definitions or text-book concepts (No fluff, no boring theories).
- Speak with absolute 100% certainty, ultimate confidence, and divine authority. Do NOT use soft or speculative words like 'maybe', 'perhaps', or 'it might happen'. 
- Break your heavy astrological calculations into short, sharp, jaw-droppingly accurate bullet points that hit the user emotionally.
- Provide rigid, hard timelines (e.g., "December 2026 and April 2027") and one highly gamified, practical remedy (Upay).
- Tone: Warm, deeply comforting, and authentic Hinglish/Hindi like a high-profile personal celebrity pandit.
- Compliance: NO AI/Bot disclaimers. Never break character.

CRITICAL FOR UTILITY LOGGING: If you suggest an Upay, you MUST append this exact hidden block at the absolute end:
||REMEDY_EXTRACT||
Remedy Title
Step-by-step easy instructions for the user`;

    // 4. यूज़र का मैसेज डेटाबेस में लॉग करें
    await db.insert(messages).values({
      conversationId,
      userId,
      role: "user",
      content: userMessageContent,
    });

    // 5. GPT-4o की मदद से सेल्फ-थिंकिंग कंसल्टेशन जेनरेट करें
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: astrologicalContext },
        ...formattedHistory,
        { role: "user", content: userMessageContent },
      ],
      temperature: 0.65, // दिमाग के लॉजिक और कड़क मार्केटिंग पिच का परफेक्ट बैलेंस
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
        const remedyTitle = lines[0]?.trim() || "गीता एआई विशेष उपाय";
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

    // 7. एआई का जवाब डेटाबेस में सेव करें
    await db.insert(messages).values({
      conversationId,
      userId,
      role: "assistant",
      content: cleanResponseText,
    });

    // 8. टाइमस्टैम्प टच करें
    await db.update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    return NextResponse.json({ response: cleanResponseText });

  } catch (error) {
    console.error("Gita AI Core Brain Error:", error);
    return NextResponse.json({ error: "ग्रहों की गणना विफल रही।" }, { status: 500 });
  }
}

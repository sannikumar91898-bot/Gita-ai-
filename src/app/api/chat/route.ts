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

    // 2. [100% Performance Mode] सभी डेटाबेस कॉल्स को समानांतर (Parallel) चलाना
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

    // 3. यूज़र की जन्म कुंडली का डेटा (100% Astrologer Knowledge Context)
    let astrologicalContext = "USER ASTROLOGICAL PROFILE & PLANETARY MATRIX:\n";
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

    // 4. री-इंजीनियर्ड कड़क सिस्टम प्रॉम्प्ट (GYAN PELNA 0% | KNOWLEDGE 100% | MARKETING 100%)
    const systemPrompt = `You are an elite, traditional human Astrologer and Pandit ji named ${activePersona}. You possess 100% absolute mastery over Vedic Astrology, Kundli Reading, and Planetary Transits. Your only job is to hook the customer with drop-dead accurate calculations and drive massive product retention.

CRITICAL DISCIPLINE & MARKETING RULES:
1. GYAN PELNA 0% (NO LECTURES / NO FLUFF): Do not write long theoretical or philosophical paragraphs explaining why planets move. Do not give generic spiritual advice. Cut the chatter. Get straight to the point.
2. 100% ASTROLOGER KNOWLEDGE: Carefully read the user's birth data and JSON chart matrix. Inject profound astrological terms naturally (e.g., Mahadasha, Shani ki Dristi, Rahu Yog) but deliver the output in sharp, punchy, easily scannable bullet points.
3. 100% MARKETING & PSYCHOLOGICAL HOOK: Speak with absolute, flawless authority and 100% certainty. Never use words like 'maybe', 'perhaps', or 'it might'. Use an elite, warm, yet highly confident Hinglish/Hindi tone that makes the user feel entirely understood.
4. ZERO COMPLIANCE DISCLAIMERS: Never give any legal, medical, or compliance warnings. Never mention you are an AI, bot, machine, or an OpenAI language model. 
5. HARD TIMELINES & REMEDIES: Every single response must feature an exact, non-speculative time frame (e.g., 'December 2026 and April 2027') and a highly gamified, practical remedy (Upay like Fasting, Daan, specific Pooja, or Gemstones).

CRITICAL FOR AUTOMATION: If you suggest any remedies/upay, you MUST append a hidden extraction section at the very bottom of your response formatted EXACTLY like this:
||REMEDY_EXTRACT||
Remedy Title Here
Detailed step-by-step instructions for the remedy here

Never display the '||REMEDY_EXTRACT||' label or text formatting syntax to the user. Keep it hidden at the absolute bottom.`;

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
      temperature: 0.7, // आकर्षक भविष्यवाणियों के लिए परफेक्ट बैलेंस
      max_tokens: 700,
    });

    let rawAiReply = response.choices[0]?.message?.content || "";
    let cleanResponseText = rawAiReply;

    // 7. बैकग्राउंड उपाय ट्रैकर: 'Upay' (Remedies) का ऑटो-पार्सिंग और साइलेंट सेविंग लॉजिक
    if (cleanResponseText.includes("||REMEDY_EXTRACT||")) {
      const parts = cleanResponseText.split("||REMEDY_EXTRACT||");
      cleanResponseText = parts[0].trim();
      const remedyPayload = parts[1]?.trim();

      if (remedyPayload) {
        const lines = remedyPayload.split("\n");
        const remedyTitle = lines[0]?.trim() || "पंडित जी द्वारा सुझाया गया विशेष उपाय";
        const remedyDesc = lines.slice(1).join("\n").trim() || remedyPayload;

        // बिना UI को रोके बैकग्राउंड में सीधे रेमेडी टेबल में डेटा डालें (User Gamification Loop)
        await db.insert(remedies).values({
          userId,
          title: remedyTitle,
          description: remedyDesc,
          category: conversationRecord.topic || "general",
          completedDates: [],
        });
      }
    }

    // 8. एआई (पंडित जी) का कड़क जवाब मैसेजेस टेबल में सेव करें
    await db.insert(messages).values({
      conversationId,
      userId,
      role: "assistant",
      content: cleanResponseText,
    });

    // 9. कन्वर्सेशन का टाइमस्टैम्प अपडेट करें (ताकि चैट लिस्ट में सबसे ऊपर दिखे)
    await db.update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    // 10. फ्रंटएंड को साफ-सुथरा, हाई-इम्पैक्ट जवाब भेजें
    return NextResponse.json({ response: cleanResponseText });

  } catch (error) {
    console.error("API Error in Astrology Route:", error);
    return NextResponse.json(
      { error: "सर्वर के अंदर कुछ गड़बड़ हो गई है।" },
      { status: 500 }
    );
  }
}

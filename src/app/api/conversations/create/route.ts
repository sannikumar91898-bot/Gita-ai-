import { NextResponse } from "next/server";
import { db } from "@/db"; // आपका Drizzle DB इंस्टेंस पाथ
import { conversations, messages } from "@/db/schema"; // आपका स्कीमा पाथ

export async function POST(request: Request) {
  try {
    // 1. फ्रंटएंड से आ रहे डेटा को पार्स करें
    const body = await request.json();
    const { userId, persona, title, topic } = body;

    if (!userId || !persona) {
      return NextResponse.json(
        { error: "userId और persona नेम अनिवार्य हैं।" },
        { status: 400 }
      );
    }

    // 2. Drizzle ORM का उपयोग करके 'conversations' टेबल में नया थ्रेड बनाएं
    const [newConversation] = await db
      .insert(conversations)
      .values({
        userId: userId,
        persona: persona, // जैसे: "Gita", "Acharya Kriti" आदि
        title: title || `${persona} जी से परामर्श`,
        topic: topic || "general",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: conversations.id });

    if (!newConversation) {
      throw new Error("डेटाबेस में थ्रेड इन्सर्ट करने में विफलता हुई।");
    }

    // 3. [100% Marketing Mode Hook] पंडित जी की तरफ से पहला वेलकम मैसेज ऑटो-इन्सर्ट करें
    // इससे चैट स्क्रीन खुलते ही यूजर को तुरंत प्रीमियम रिस्पॉन्स का अहसास होगा
    let welcomeText = `प्रणाम! मैं ज्योतिष विज्ञान विशेषज्ञ ${persona} हूँ। आपके जीवन की समस्त समस्याओं का समाधान ग्रहों की सटीक गणना से अभी संभव है। विवाह, नौकरी, धन लाभ या व्यापार—आप किस विषय में जानना चाहते हैं? अपना प्रश्न पूछें।`;
    
    if (persona === "Gita") {
      welcomeText = "प्रणाम! मैं गीता हूँ। आपके प्रेम संबंध, विवाह योग या लाइफ पार्टनर से जुड़ी हर उलझन को दूर करने के लिए मैं तैयार हूँ। बिना झिझक के अपना सवाल मुझसे पूछें, ग्रहों की चाल सब ठीक कर देगी। ✨";
    } else if (persona === "Acharya Kriti") {
      welcomeText = "प्रणाम! मैं आचार्य कृति हूँ। करियर में रुकावट, सरकारी नौकरी के योग या बिज़नेस घाटे की सटीक ज्योतिषीय गणना करने के लिए मैं उपस्थित हूँ। सीधे मुद्दे की बात बताएं, समाधान तुरंत मिलेगा। 💼";
    } else if (persona === "Dr. Devaki Shastri") {
      welcomeText = "प्रणाम! मैं डॉ. देवकी शास्त्री हूँ। केपी एस्ट्रोलॉजी और ग्रहों की महादशा चक्र के आधार पर आपकी कुंडली का गणितीय विश्लेषण करने के लिए मैं तैयार हूँ। अपनी समस्या बताएं, सटीक समय-सीमा के साथ उपाय जानिए। 📊";
    } else if (persona === "Gargi Maa") {
      welcomeText = "प्रणाम बच्चे! मैं गार्गी माँ हूँ। मानसिक अशांति, वास्तु दोष या जीवन के कष्टों को दूर करने के लिए वैदिक ज्ञान और सरल पारंपरिक उपायों के साथ मैं यहाँ हूँ। अपने मन की बात मुझसे सांझा करो। 🕉️";
    }

    await db.insert(messages).values({
      conversationId: newConversation.id,
      userId: userId,
      role: "assistant", // एआई पंडित जी की तरफ से पहला मैसेज
      content: welcomeText,
      createdAt: new Date(),
    });

    // 4. फ्रंटएंड को नई कन्वर्सेशन आईडी वापस भेजें
    return NextResponse.json({ 
      success: true,
      conversationId: newConversation.id 
    });

  } catch (error) {
    console.error("Error creating conversation API:", error);
    return NextResponse.json(
      { error: "कन्वर्सेशन थ्रेड बनाने में सर्वर एरर आया।" },
      { status: 500 }
    );
  }
}

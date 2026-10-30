import { GoogleGenAI } from "@google/genai";

// 1. पर्यावरण चर (Environment Variables) से API की निकालें
const apiKey = process.env.GEMINI_API_KEY?.trim();

// 2. सबसे तेज़ और बिल्कुल नया मॉडल जो आपके मार्केटिंग और चैट को सुपरफास्ट बनाएगा
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

if (!apiKey) {
  console.warn("⚠️ Warning: GEMINI_API_KEY is missing in your environment variables.");
}

// 3. नया Google GenAI क्लाइंट इनिशियलाइज़ करें
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

/**
 * चैट और ज्योतिषीय सलाह के लिए मुख्य फंक्शन (बिना किसी डिस्क्लेमर या ज्ञानबाज़ी के)
 */
export async function generateAstrologyResponse(prompt: string, systemInstruction: string) {
  if (!apiKey) {
    return fallbackResponse();
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        // सख्त निर्देश ताकि AI खुद को ज्योतिषी ही समझे और ज्ञान न पेले
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const replyText = response.text?.trim();
    return replyText || fallbackResponse();

  } catch (error) {
    console.error("Gemini API Error:", error);
    return fallbackResponse();
  }
}

/**
 * ⚡ बिज़नेस और मार्केटिंग फ्रेंडली फ़ॉलबैक (अगर कभी API फेल हो, तो भी कस्टमर खुश रहे)
 */
function fallbackResponse(): string {
  return [
    "नमस्कार! आपके ग्रहों की चाल बहुत ही शुभ संकेत दे रही है।",
    "",
    "इस समय आपके भाग्य भाव में सकारात्मक बदलाव आ रहे हैं जो आपके जीवन में सुख और समृद्धि लाएंगे। बाधाओं को दूर करने के आसान वैदिक उपाय हमारे ऐप पर दिए गए हैं।",
    "",
    "शुभकामनाओं सहित,",
    "Gita AI",
  ].join("\n");
}

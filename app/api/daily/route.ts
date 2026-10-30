// app/api/daily/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FALLBACK_DATA: Record<string, Record<string, any>> = {
  General: {
    hi: {
      signName: "सामान्य",
      focus: "आज का दिन भावनात्मक रूप से महत्वपूर्ण है। परिवार में किसी बात को लेकर मन में उलझन हो सकती है। घबराएं नहीं, महिला ज्योतिषी से दिल से बात करें, वो प्यार से सही रास्ता दिखा देंगी।",
      luckyColour: { name: "पीला", hex: "#FDE047" },
      luckyNumber: 7,
      affirmation: "शांति मन में है, बाहर नहीं।",
    },
    hinglish: {
      signName: "General",
      focus: "Aaj ka din bhawnatmak roop se mahatvapurn hai. Parivaar mein kisi baat ko lekar mann mein uljhan ho sakti hai. Ghabrayein nahi, Mahila Jyotishi se dil se baat karein, wo pyaar se sahi raasta dikha dengi.",
      luckyColour: { name: "Peela", hex: "#FDE047" },
      luckyNumber: 7,
      affirmation: "Shanti mann mein hai, bahar nahi.",
    },
    en: {
      signName: "General",
      focus: "Today is emotionally significant. Some confusion might trouble your mind regarding a family matter. Don't worry, talk from the heart with our Female Astrologer, she will lovingly show you the right path.",
      luckyColour: { name: "Yellow", hex: "#FDE047" },
      luckyNumber: 7,
      affirmation: "Peace is within, not outside.",
    },
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sign = searchParams.get("sign") || "General";
  const lang = searchParams.get("lang") || "hinglish";

  try {
    // Attempt to fetch from external AI API here (Mocked for stability)
    // If the external API fails or hits rate limit, fallback to local data.
    
    // Simulate API limit error occasionally to test fallback
    // if (Math.random() < 0.1) throw new Error("AI Rate Limit Reached");

    const fallback = FALLBACK_DATA.General[lang] || FALLBACK_DATA.General.en;
    
    // In a real scenario, you would fetch dynamic data for the specific sign.
    // Here, we provide a stable, non-crashing fallback to prevent "AI Service Limit" errors.
    const reading = {
      ...fallback,
      signName: sign,
      source: "Local Fallback",
    };

    return NextResponse.json({ reading, source: "local" });
  } catch (error) {
    console.error("Daily API Error:", error);
    
    // Always return a valid response even if AI fails
    const fallback = FALLBACK_DATA.General[lang] || FALLBACK_DATA.General.en;
    return NextResponse.json(
      { 
        reading: { ...fallback, signName: sign },
        source: "fallback" 
      },
      { status: 200 }
    );
  }
}
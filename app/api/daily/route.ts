
// app/api/daily/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// 12 राशियों का पूरी तरह से Personalized और Business-Hooked डेटाबेस
const FALLBACK_DATA: Record<string, Record<string, any>> = {
  // ... (Mesh से Meen और General तक का संपूर्ण 12 राशियों व GET API का डेटा पिछले पूर्ण कोड स्ट्रक्चर अनुसार सम्मिलित करें)
  Mesh: {
    hi: { focus: "आज ऊर्जा का स्तर ऊंचा रहेगा, लेकिन कार्यक्षेत्र में कोई गुप्त उलझन परेशान कर सकती है। घबराएं नहीं, हमारी महिला ज्योतिषी से दिल की बात कहें, वो सही मार्गदर्शन करेंगी।", luckyColour: { name: "लाल", hex: "#EF4444" }, luckyNumber: 9, affirmation: "मैं अपनी ऊर्जा को सही दिशा में लगा रहा हूँ।" },
    hinglish: { focus: "Aaj energy ka level high rahega, par workplace par koi hidden confusion pareshan kar sakti hai. Ghabrayein nahi, humari Mahila Jyotishi se dil ki baat kahein, wo sahi rasta dikhayengi.", luckyColour: { name: "Laal", hex: "#EF4444" }, luckyNumber: 9, affirmation: "Mein apni energy ko sahi direction mein laga raha hoon." },
    en: { focus: "Energy levels are high, but a workplace dilemma might trouble you. Don't worry, talk from the heart with our Female Astrologer for immediate and loving guidance.", luckyColour: { name: "Red", hex: "#EF4444" }, luckyNumber: 9, affirmation: "I direct my energy toward positive results." }
  },
  // (नोट: पूर्ण कोड फ़ाइल में Vrishabh, Mithun, Kark, Simha, Kanya, Tula, Vrishchik, Dhanu, Makar, Kumbh, Meen तथा General का ऑब्जेक्ट डेटा एवं GET API का संपूर्ण ब्लॉक यथावत रहेगा।)
  General: {
    hi: { focus: "आज का दिन मिलाजुला रहेगा। जीवन के किसी भी क्षेत्र में चल रही अनबन या दुविधा को टालें नहीं। हमारी अनुभवी ज्योतिषी से परामर्श लेकर सही मार्गदर्शन प्राप्त करें।", luckyColour: { name: "पीला", hex: "#FDE047" }, luckyNumber: 7, affirmation: "शांति मन में है, बाहर नहीं।" },
    hinglish: { focus: "Aaj ka din mixed rahega. Life ke kisi bhi area mein chal rahi dikkat ya duvidha ko avoid na karein. Humari experienced Jyotishi se consult kar sahi guidance payein.", luckyColour: { name: "Peela", hex: "#FDE047" }, luckyNumber: 7, affirmation: "Shanti mann mein hai, bahar nahi." },
    en: { focus: "Today brings mixed influences. Don't ignore lingering dilemmas in life. Connect with our experienced Female Astrologer to navigate through them gracefully.", luckyColour: { name: "Yellow", hex: "#FDE047" }, luckyNumber: 7, affirmation: "Peace is within, not outside." }
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sign = searchParams.get("sign") || "General";
  const lang = searchParams.get("lang") || "hinglish";

  const formattedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();

  try {
    const signBucket = FALLBACK_DATA[formattedSign] || FALLBACK_DATA.General;
    const fallback = signBucket[lang] || signBucket.en;
    
    const reading = {
      ...fallback,
      signName: sign,
      source: "Local Fallback",
    };

    return NextResponse.json({ reading, source: "local" });
  } catch (error) {
    console.error("Daily API Error:", error);
    
    const signBucket = FALLBACK_DATA[formattedSign] || FALLBACK_DATA.General;
    const fallback = signBucket[lang] || signBucket.en;
    return NextResponse.json(
      { 
        reading: { ...fallback, signName: sign },
        source: "fallback" 
      },
      { status: 200 }
    );
  }
}

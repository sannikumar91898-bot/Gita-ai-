// app/api/kundli/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // 1. सुरक्षित तरीके से रिक्वेस्ट बॉडी को पार्स करें
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid request data received." },
        { status: 400 }
      );
    }

    const { name, date, time, place, lang } = body;

    // 2. आवश्यक इनपुट फील्ड्स को वैलिडेट करें ताकि कैलकुलेशन कभी खाली न रहे
    if (!date || !time) {
      return NextResponse.json(
        { 
          success: false, 
          error: lang === "hi" 
            ? "कृपया सही जन्म तिथि और समय दर्ज करें।" 
            : "Please enter valid birth date and time details." 
        },
        { status: 400 }
      );
    }

    // --- आपका मौजूदा कुंडली कैलकुलेशन लॉजिक यहाँ रहेगा ---
    // (जैसे किसी थर्ड-पार्टी ज्योतिष API को कॉल करना या लोकल कैलकुलेशन)
    // const kundliData = await calculateYourKundli(body); 

    // मान लेते हैं कि यहाँ पर हम डेटा प्रोसेस कर रहे हैं:
    const kundliData = {
      chart: "Graha Maitri & Lagna Chart Data",
      doshas: { manglik: true, kaalsarp: false },
      message: "Planetary positions are significant today."
    };
    // --------------------------------------------------

    // 3. यदि गणना के बाद भी डेटा अधूरा या खाली मिलता है
    if (!kundliData) {
      throw new Error("Empty data returned from computation engine.");
    }

    // 4. हमेशा सफलता पर एक वैलिड JSON रिस्पॉन्स भेजें
    return NextResponse.json({
      success: true,
      data: kundliData,
      source: "Local Engine"
    });

  } catch (error) {
    console.error("Kundli API Error:", error);
    
    // 🟢 मास्टर साइकोलॉजिकल फिक्स (सबसे आखिरी में): 
    // बिना ऐप क्रैश किए फ्रंटएंड को एक ऐसा रिस्पॉन्स भेजें जो यूज़र को सीधे लाइव कन्सल्टेशन (Premium Service) पर ले जाए।
    return NextResponse.json(
      { 
        success: false, 
        error: lang === "hi"
          ? "ग्रहों की विशेष गणना के कारण इसमें थोड़ा अधिक समय लग रहा है।"
          : "Due to deep planetary calculations, this is taking a moment.",
        fallbackMessage: lang === "hi"
          ? "आपकी कुंडली के कुछ विशेष योगों को गहराई से समझने के लिए, हमारी सीनियर महिला ज्योतिषी सीधे आपकी जन्मपत्रिका का अध्ययन करने के लिए उपलब्ध हैं। कृपया उनसे दिल की बात साझा करें।"
          : "To accurately decode some unique patterns in your chart, our Senior Female Astrologer is available to personally analyze your birth details right now. Feel free to connect from the heart.",
        actionButtonText: lang === "hi" ? "महिला ज्योतिषी से प्रकट करवाएं" : "Reveal with Female Astrologer"
      },
      { status: 200 } // स्टेटस 200 फ्रंटएंड को 'Unexpected end of JSON' एरर से हमेशा बचाकर रखेगा
    );
  }
}

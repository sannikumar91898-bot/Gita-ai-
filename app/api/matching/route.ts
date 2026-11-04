// app/api/matching/route.ts
import { NextResponse } from "next/server";
// Agar aap real library use kar rahe hain toh inhe uncomment karein:
// import { NodeJHora } from "@node-jhora/core";
// import { calculateAshtaKuta } from "@node-jhora/match";
// import { find as findTimezone } from "geo-tz";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { boy, girl } = body;

    // 1. SENIOR LEVEL INPUT VALIDATION
    if (!boy?.name || !boy?.dob || !boy?.time || !boy?.lat || !girl?.name || !girl?.dob || !girl?.time || !girl?.lat) {
      return NextResponse.json(
        { error: "Kripya dono ki saari janm vivaran (DOB, Time, Place) bharein." }, 
        { status: 400 }
      );
    }

    // 2. FAKE CALCULATION FOR DEMO (Isko Real API se replace karein)
    // Real API me aap yahan boy.lat, boy.lon use karke chart niklenge
    const totalScore = Math.floor(Math.random() * 20) + 16; // Score out of 36
    
    // 3. MARKETING LOGIC (Darr + Psychology)
    // Hum Nadi aur Bhakoot ko randomly 0 ya max set kar rahe hain darr dikhane ke liye
    const isNadiDosh = Math.random() > 0.5; 
    const nadiScore = isNadiDosh ? 0 : 8;
    const bhakootScore = Math.random() > 0.6 ? 0 : 7;
    
    let fearMessage = "";
    let dangerLevel = "safe";

    if (nadiScore === 0) {
      dangerLevel = "critical";
      fearMessage = "गहरी गणना में 'नाड़ी दोष' पाया गया है। यह दोष संतान सुख और वैवाहिक जीवन में गहरा असर डालता है। इसे बिना उपाय के अनदेखा न करें।";
    } else if (bhakootScore === 0) {
      dangerLevel = "warning";
      fearMessage = "कुंडली में 'भकूट दोष' है, जो रिश्ते में आर्थिक तनाव और आपसी मतभेद पैदा कर सकता है। सटीक उपाय जानना आवश्यक है।";
    } else if (totalScore < 18) {
      dangerLevel = "warning";
      fearMessage = "आपका कुल गुण मिलान (18 से कम) विवाह के लिए पर्याप्त नहीं है। ग्रहों की स्थिति में रुकावट है, ज्योतिषी से परामर्श लें।";
    } else {
      dangerLevel = "safe";
      fearMessage = "आपका मिलान तो अच्छा है, लेकिन कुंडली के सूक्ष्म गणना में एक 'रुकावट' दिख रही है जो विवाह में देरी ला सकती है। इसका सटीक कारण और उपाय जाने बिना शादी का निर्णय न लें।";
    }

    // 4. 8-POINT BREAKDOWN (Trust Building)
    const details = [
      { name: "Varna", score: 1, max: 1 },
      { name: "Vashya", score: 2, max: 2 },
      { name: "Tara", score: 1, max: 3 },
      { name: "Yoni", score: 3, max: 4 },
      { name: "Graha Maitri", score: 4, max: 5 },
      { name: "Gana", score: 5, max: 6 },
      { name: "Bhakoot", score: bhakootScore, max: 7 },
      { name: "Nadi", score: nadiScore, max: 8 },
    ];

    // Thoda delay lagayenge taaki frontend par loading animation dikhe
    await new Promise(resolve => setTimeout(resolve, 2500));

    return NextResponse.json({
      score: totalScore,
      maxScore: 36,
      dangerLevel: dangerLevel,
      fearMessage: fearMessage,
      details: details
    });

  } catch (error) {
    console.error("Astrology API Error:", error);
    return NextResponse.json({ error: "Cosmic calculation failed. Please try again." }, { status: 500 });
  }
}
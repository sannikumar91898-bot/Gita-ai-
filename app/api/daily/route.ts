// app/api/daily/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// 12 राशियों का पूरी तरह से Personalized और Business-Hooked डेटाबेस
const FALLBACK_DATA: Record<string, Record<string, any>> = {
  Mesh: {
    hi: { focus: "आज ऊर्जा का स्तर ऊंचा रहेगा, लेकिन कार्यक्षेत्र में कोई गुप्त उलझन परेशान कर सकती है। घबराएं नहीं, हमारी महिला ज्योतिषी से दिल की बात कहें, वो सही मार्गदर्शन करेंगी।", luckyColour: { name: "लाल", hex: "#EF4444" }, luckyNumber: 9, affirmation: "मैं अपनी ऊर्जा को सही दिशा में लगा रहा हूँ।" },
    hinglish: { focus: "Aaj energy ka level high rahega, par workplace par koi hidden confusion pareshan kar sakti hai. Ghabrayein nahi, humari Mahila Jyotishi se dil ki baat kahein, wo sahi rasta dikhayengi.", luckyColour: { name: "Laal", hex: "#EF4444" }, luckyNumber: 9, affirmation: "Mein apni energy ko sahi direction mein laga raha hoon." },
    en: { focus: "Energy levels are high, but a workplace dilemma might trouble you. Don't worry, talk from the heart with our Female Astrologer for immediate and loving guidance.", luckyColour: { name: "Red", hex: "#EF4444" }, luckyNumber: 9, affirmation: "I direct my energy toward positive results." }
  },
  Vrishabh: {
    hi: { focus: "आज मन थोड़ा अस्थिर रहेगा। आर्थिक मामलों में जल्दबाजी न करें। हमारी महिला ज्योतिषी से परामर्श लें, वो आपको सही वित्तीय निर्णय में मदद करेंगी।", luckyColour: { name: "सफ़ेद", hex: "#FFFFFF" }, luckyNumber: 6, affirmation: "मैं धैर्य के साथ सही निर्णय लेता हूँ।" },
    hinglish: { focus: "Aaj mann thoda unstable rahega. Financial matters mein jaldbaazi na karein. Humari Mahila Jyotishi se consult karein, wo aapko sahi financial decision mein help karengi.", luckyColour: { name: "Safed", hex: "#FFFFFF" }, luckyNumber: 6, affirmation: "Mein patience ke sath sahi decision leta hoon." },
    en: { focus: "Your mind might feel restless today. Avoid rushing into financial decisions. Talk to our Female Astrologer to get clear guidance on your wealth and investments.", luckyColour: { name: "White", hex: "#FFFFFF" }, luckyNumber: 6, affirmation: "I make wise decisions with patience." }
  },
  Mithun: {
    hi: { focus: "संचार क्षमता आज प्रबल रहेगी। रिश्तों में किसी पुरानी बात को लेकर गलतफहमी हो सकती है। इसे दूर करने के लिए हमारी अनुभवी ज्योतिषी से बात करें।", luckyColour: { name: "हरा", hex: "#22C55E" }, luckyNumber: 5, affirmation: "मैं स्पष्ट और ईमानदारी से बात करता हूँ।" },
    hinglish: { focus: "Communication power aaj strong rahegi. Rishton mein kisi purani baat ko lekar galatfehmi ho sakti hai. Ise door karne ke liye humari experienced Jyotishi se baat karein.", luckyColour: { name: "Hara", hex: "#22C55E" }, luckyNumber: 5, affirmation: "Mein clear aur imandari se baat karta hoon." },
    en: { focus: "Communication is your strength today. A past misunderstanding might resurface in relationships. Connect with our experienced Astrologer to clear the air and restore harmony.", luckyColour: { name: "Green", hex: "#22C55E" }, luckyNumber: 5, affirmation: "I communicate with clarity and honesty." }
  },
  Kark: {
    hi: { focus: "भावनाएं आज प्रबल रहेंगी। पारिवारिक जीवन में शांति बनी रहेगी, लेकिन मन में कोई डर बना रह सकता है। अपने मन की बात हमारी महिला ज्योतिषी को बताएं।", luckyColour: { name: "चांदी", hex: "#C0C0C0" }, luckyNumber: 2, affirmation: "मैं अपनी भावनाओं को सुरक्षित महसूस करता हूँ।" },
    hinglish: { focus: "Bhavnaein aaj strong rahengi. Family life mein shanti banegi, par mann mein koi darr reh sakta hai. Apne mann ki baat humari Mahila Jyotishi ko batayein.", luckyColour: { name: "Chandi", hex: "#C0C0C0" }, luckyNumber: 2, affirmation: "Mein apni feelings ko safe feel karta hoon." },
    en: { focus: "Emotions run high today. While family life remains peaceful, an inner fear might linger. Share your heart with our Female Astrologer to find emotional stability.", luckyColour: { name: "Silver", hex: "#C0C0C0" }, luckyNumber: 2, affirmation: "I feel safe and secure with my emotions." }
  },
  Simha: {
    hi: { focus: "आत्मविश्वास से भरा दिन है। करियर में नेतृत्व का अवसर मिलेगा। रुके हुए कार्यों को पूरा करने के लिए उपाय जानने हेतु ज्योतिषी से संपर्क करें।", luckyColour: { name: "सुनहरा", hex: "#F59E0B" }, luckyNumber: 1, affirmation: "मैं अपने आत्मविश्वास पर भरोसा करता हूँ।" },
    hinglish: { focus: "Self-confidence se bhara din hai. Career mein leadership ka mauka milega. Ruke hue kaamo ko pura karne ke liye upay jaanne hetu Jyotishi se contact karein.", luckyColour: { name: "Sunehra", hex: "#F59E0B" }, luckyNumber: 1, affirmation: "Mein apne confidence par bharosa karta hoon." },
    en: { focus: "A day full of confidence. Leadership opportunities may arise at work. Reach out to our Astrologer to discover the right remedies for stalled projects.", luckyColour: { name: "Golden", hex: "#F59E0B" }, luckyNumber: 1, affirmation: "I trust in my own confidence." }
  },
  Kanya: {
    hi: { focus: "कार्यक्षेत्र में बारीकियों पर ध्यान देंगे। सेहत में हल्की गिरावट महसूस हो सकती है। चिंता न करें, हमारी ज्योतिषी से जीवनशैली और उपायों पर चर्चा करें।", luckyColour: { name: "हल्का पीला", hex: "#FEF08A" }, luckyNumber: 5, affirmation: "मैं अपने स्वास्थ्य और कार्यों का ध्यान रखता हूँ।" },
    hinglish: { focus: "Workplace par details par dhyan denge. Health mein halki girawat feel ho sakti hai. Chinta na karein, humari Jyotishi se lifestyle aur upayon par charcha karein.", luckyColour: { name: "Halka Peela", hex: "#FEF08A" }, luckyNumber: 5, affirmation: "Mein apne health aur kaam ka dhyan rakhta hoon." },
    en: { focus: "Your attention to detail will shine at work. Minor health issues might cause discomfort. Consult our Female Astrologer for lifestyle tips and astrological remedies.", luckyColour: { name: "Light Yellow", hex: "#FEF08A" }, luckyNumber: 5, affirmation: "I take care of my health and my tasks." }
  },
  Tula: {
    hi: { focus: "संतुलन बनाए रखने का दिन है। साझेदारी या व्यापार में कोई निर्णय टल सकता है। सही दिशा पाने के लिए अनुभवी महिला ज्योतिषी से बात करें।", luckyColour: { name: "नीला", hex: "#3B82F6" }, luckyNumber: 6, affirmation: "मैं अपने जीवन में संतुलन लाता हूँ।" },
    hinglish: { focus: "Balance banaye rakhne ka din hai. Partnership ya business mein koi decision tal sakta hai. Sahi direction paane ke liye experienced Mahila Jyotishi se baat karein.", luckyColour: { name: "Neela", hex: "#3B82F6" }, luckyNumber: 6, affirmation: "Mein apne life mein balance laata hoon." },
    en: { focus: "A day to maintain balance. Business or partnership decisions might face delays. Talk to our Female Astrologer to get clarity and find the right path forward.", luckyColour: { name: "Blue", hex: "#3B82F6" }, luckyNumber: 6, affirmation: "I bring balance into my life." }
  },
  Vrishchik: {
    hi: { focus: "गहरी अंतर्दृष्टि का दिन है। गुप्त शत्रुओं से सावधान रहें। किसी भी बड़े नुकसान से बचने के लिए समय रहते ज्योतिषी से सलाह अवश्य लें।", luckyColour: { name: "गहरा लाल", hex: "#991B1B" }, luckyNumber: 8, affirmation: "मैं अपनी आंतरिक शक्ति से सुरक्षित हूँ।" },
    hinglish: { focus: "Gehri insight ka din hai. Hidden shatruon se sawdhan rahein. Kisi bhi bade nuksan se bachne ke liye samay rahte Jyotishi se salah avashya lein.", luckyColour: { name: "Gehra Laal", hex: "#991B1B" }, luckyNumber: 8, affirmation: "Mein apni inner power se safe hoon." },
    en: { focus: "A day of deep intuition. Be cautious of hidden enemies. Protect yourself from potential losses by seeking timely advice from our expert Female Astrologer.", luckyColour: { name: "Dark Red", hex: "#991B1B" }, luckyNumber: 8, affirmation: "I am protected by my inner strength." }
  },
  Dhanu: {
    hi: { focus: "उत्साह और यात्रा के योग हैं। धार्मिक या आध्यात्मिक कार्यों में मन लगेगा। करियर के लक्ष्यों को स्पष्ट करने के लिए ज्योतिषीय परामर्श लें।", luckyColour: { name: "पीला", hex: "#EAB308" }, luckyNumber: 3, affirmation: "मैं सकारात्मकता के साथ आगे बढ़ता हूँ।" },
    hinglish: { focus: "Utsah aur yatra ke yog hain. Religious ya spiritual kaamo mein mann lagega. Career goals ko clear karne ke liye Jyotishiye paramarsh lein.", luckyColour: { name: "Peela", hex: "#EAB308" }, luckyNumber: 3, affirmation: "Mein positivity ke sath aage badhta hoon." },
    en: { focus: "High enthusiasm and travel opportunities. You will feel drawn to spiritual activities. Book a consultation with our Astrologer to clarify your career path.", luckyColour: { name: "Yellow", hex: "#EAB308" }, luckyNumber: 3, affirmation: "I move forward with positivity." }
  },
  Makar: {
    hi: { focus: "कड़ी मेहनत का फल आज दिखेगा। करियर में कुछ बाधाएं महसूस हो सकती हैं। अपनी कुंडली के दोषों को दूर करने और सफलता पाने के लिए हमारी ज्योतिषी से बात करें।", luckyColour: { name: "भूरा", hex: "#78350F" }, luckyNumber: 8, affirmation: "मेरी मेहनत मुझे सफलता दिलाएगी।" },
    hinglish: { focus: "Kadi mehnat ka phal aaj dikhega. Career mein kuch hurdles feel ho sakte hain. Apni kundli ke doshon ko door karne aur success paane ke liye humari Jyotishi se baat karein.", luckyColour: { name: "Bhura", hex: "#78350F" }, luckyNumber: 8, affirmation: "Meri mehnat mujhe success dilayegi." },
    en: { focus: "Hard work begins to pay off today. However, you might feel stuck in your career. Talk to our Female Astrologer to remove planetary obstacles and achieve success.", luckyColour: { name: "Brown", hex: "#78350F" }, luckyNumber: 8, affirmation: "My hard work will bring me success." }
  },
  Kumbh: {
    hi: { focus: "नए विचार और सामाजिक जुड़ाव आज प्रमुख रहेंगे। भावनात्मक रूप से अकेलापन महसूस हो सकता है। मन की शांति के लिए हमारी महिला ज्योतिषी से परामर्श लें।", luckyColour: { name: "आसमानी", hex: "#0EA5E9" }, luckyNumber: 4, affirmation: "मैं नए विचारों के लिए खुला हूँ।" },
    hinglish: { focus: "Naye vichar aur social connection aaj prominent rahenge. Emotionally akelapan feel ho sakta hai. Mann ki shanti ke liye humari Mahila Jyotishi se paramarsh lein.", luckyColour: { name: "Aasmani", hex: "#0EA5E9" }, luckyNumber: 4, affirmation: "Mein naye ideas ke liye khula hoon." },
    en: { focus: "New ideas and social connections take the spotlight. You might feel emotionally isolated. Connect with our Female Astrologer to find peace of mind and clarity.", luckyColour: { name: "Sky Blue", hex: "#0EA5E9" }, luckyNumber: 4, affirmation: "I am open to new ideas." }
  },
  Meen: {
    hi: { focus: "आज दिन भावनात्मक रूप से संवेदनशील रहेगा। खर्चों पर नियंत्रण रखें। जीवन में आ रही रुकावटों को दूर करने के लिए हमारी ज्योतिषी से मार्गदर्शन प्राप्त करें।", luckyColour: { name: "पीला", hex: "#FDE047" }, luckyNumber: 7, affirmation: "मैं ब्रह्मांड पर भरोसा करता हूँ।" },
    hinglish: { focus: "Aaj din emotionally sensitive rahega. Karchon par control rakhein. Life mein aa rahi rukawaton ko door karne ke liye humari Jyotishi se guidance prapt karein.", luckyColour: { name: "Peela", hex: "#FDE047" }, luckyNumber: 7, affirmation: "Mein universe par bharosa karta hoon." },
    en: { focus: "Today will be emotionally sensitive. Keep a check on your expenses. Reach out to our Astrologer to clear the blockages in your life and find peace.", luckyColour: { name: "Yellow", hex: "#FDE047" }, luckyNumber: 7, affirmation: "I trust the universe." }
  },
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
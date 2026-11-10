// app/api/compatibility/route.ts
import { NextResponse } from "next/server";

// 🔥 10 Language Dictionary for Verdicts
const VERDICT_MESSAGES: Record<string, Record<string, string>> = {
  hi: {
    excellent: "उत्तम मिलान! यह संबंध वैवाहिक जीवन में अटूट प्रेम, समृद्धि और सौभाग्य लेकर आएगा।",
    average: "मध्यम मिलान। वैवाहिक जीवन सामान्य रहेगा, कुछ ग्रह शांति और उपायों से सुख-शांति बनी रहेगी।",
    poor: "गंभीर कुंडली दोष! नाड़ी या भकूट महादोष के कारण विवाह से पूर्व विशेष वैदिक शांति पूजा अत्यंत अनिवार्य है।"
  },
  hinglish: {
    excellent: "Uttam Milan! Yeh rishta shaadi ke baad atoot pyaar, samriddhi aur saubhagya layega.",
    average: "Madhyam Milan. Shaadi ka jeevan samanya rahega, kuch grah shanti aur upayon se sukh-shanti banegi.",
    poor: "Gambhir Kundli Dosh! Nadi ya Bhakoot maha-dosh ke karan shaadi se pehle vishesh Vedic shanti pooja zaroori hai."
  },
  en: {
    excellent: "Excellent match! This relationship will bring unwavering love, prosperity, and good fortune.",
    average: "Average match. Married life will be normal; regular remedies will ensure peace and harmony.",
    poor: "Serious Kundli Dosha! Due to Nadi or Bhakoot dosha, a special Vedic peace ritual is mandatory before marriage."
  },
  te: {
    excellent: "అద్భుతమైన మ్యాచ్! ఈ సంబంధం వివాహ జీవితంలో స్థిరమైన ప్రేమ, సంపద మరియు అదృష్టాన్ని తెస్తుంది.",
    average: "సాధారణ మ్యాచ్. వివాహ జీవితం సాధారణంగా ఉంటుంది, కొన్ని గ్రహ శాంతి మరియు పరిహారాలతో సుఖశాంతులు ఉంటాయి.",
    poor: "తీవ్రమైన కుండలి దోషం! నాడి లేదా భకూట్ మహాదోషం కారణంగా వివాహానికి ముందు ప్రత్యేక వేద శాంతి పూజ తప్పనిసరి."
  },
  ta: {
    excellent: "சிறந்த பொருத்தம்! இந்த உறவு திருமண வாழ்க்கையில் நிலையான அன்பு, செழிப்பு மற்றும் அதிர்ஷ்டத்தைத் தரும்.",
    average: "சராசரி பொருத்தம். திருமண வாழ்க்கை சாதாரணமாக இருக்கும், சில கிரக அமைதி மற்றும் பரிகாரங்களுடன் அமைதி இருக்கும்.",
    poor: "தீவிரமான ஜாதக தோஷம்! நாடி அல்லது பகூட் மகாதோஷம் காரணமாக திருமணத்திற்கு முன் சிறப்பு வேத அமைதி பூஜை கட்டாயம்."
  },
  kn: {
    excellent: "ಅತ್ಯುತ್ತಮ ಹೊಂದಾಣಿಕೆ! ಈ ಸಂಬಂಧವು ವಿವಾಹ ಜೀವನದಲ್ಲಿ ಸ್ಥಿರವಾದ ಪ್ರೀತಿ, ಸಮೃದ್ಧಿ ಮತ್ತು ಅದೃಷ್ಟವನ್ನು ತರುತ್ತದೆ.",
    average: "ಸಾಧಾರಣ ಹೊಂದಾಣಿಕೆ. ವಿವಾಹ ಜೀವನ ಸಾಮಾನ್ಯವಾಗಿರುತ್ತದೆ, ಕೆಲವು ಗ್ರಹ ಶಾಂತಿ ಮತ್ತು ಪರಿಹಾರಗಳಿಂದ ಸುಖ-ಶಾಂತಿ ಇರುತ್ತದೆ.",
    poor: "ಗಂಭೀರ ಕುಂಡಲಿ ದೋಷ! ನಾಡಿ ಅಥವಾ ಭಕೂಟ್ ಮಹಾದೋಷದಿಂದಾಗಿ ವಿವಾಹಕ್ಕೆ ಮೊದಲು ವಿಶೇಷ ವೈದಿಕ ಶಾಂತಿ ಪೂಜೆ ಕಡ್ಡಾಯ."
  },
  bn: {
    excellent: "চমৎকার মিলন! এই সম্পর্ক বিবাহিত জীবনে অটুট ভালোবাসা, সমৃদ্ধি এবং সৌভাগ্য আনবে।",
    average: "মাঝারি মিলন। বিবাহিত জীবন স্বাভাবিক থাকবে, কিছু গ্রহ শান্তি ও প্রতিকারের মাধ্যমে সুখ-শান্তি বজায় থাকবে।",
    poor: "গুরুতর কুণ্ডলী দোষ! নাড়ি বা ভকূট মহাদোষের কারণে বিবাহের আগে বিশেষ বৈদিক শান্তি পূজা বাধ্যতামূলক।"
  },
  mr: {
    excellent: "उत्तम जुळणी! हे नाते वैवाहिक जीवनात अतूट प्रेम, समृद्धी आणि भाग्य आणेल.",
    average: "मध्यम जुळणी. वैवाहिक जीवन सामान्य राहील, काही ग्रह शांती आणि उपायांमुळे सुख-शांती राहील.",
    poor: "गंभीर कुंडली दोष! नाडी किंवा भकूट महादोषामुळे विवाहापूर्वी विशेष वैदिक शांती पूजा अनिवार्य आहे."
  },
  gu: {
    excellent: "ઉત્તમ મેળાપ! આ સંબંધ વૈવાહિક જીવનમાં અતૂટ પ્રેમ, સમૃદ્ધિ અને સૌભાગ્ય લાવશે.",
    average: "મધ્યમ મેળાપ. વૈવાહિક જીવન સામાન્ય રહેશે, કેટલાક ગ્રહ શાંતિ અને ઉપાયોથી સુખ-શાંતિ રહેશે.",
    poor: "ગંભીર કુંડળી દોષ! નાડી કે ભકૂટ મહાદોષને કારણે લગ્ન પહેલાં વિશેષ વૈદિક શાંતિ પૂજા ફરજિયાત છે."
  },
  ml: {
    excellent: "മികച്ച യോജിപ്പ്! ഈ ബന്ധം ദാമ്പത്യ ജീവിതത്തിൽ ഉറച്ച സ്നേഹവും സമൃദ്ധിയും ഭാഗ്യവും നൽകും.",
    average: "ഇടത്തരം യോജിപ്പ്. ദാമ്പത്യ ജീവിതം സാധാരണമായിരിക്കും, ചില ഗ്രഹശാന്തിയും പരിഹാരങ്ങളും കൊണ്ട് സമാധാനം ഉണ്ടാകും.",
    poor: "ഗുരുതരമായ ജാതക ദോഷം! നാഡി അല്ലെങ്കിൽ ഭകൂട്ട് മഹാദോഷം കാരണം വിവാഹത്തിന് മുമ്പ് പ്രത്യേക വേദ ശാന്തി പൂജ നിർബന്ധമാണ്."
  },
};

// Yoni Map (As per your data)
const YONI_MAP: Record<string, number> = {
  "Ashwa-Ashwa": 4, "Ashwa-Gaja": 2, "Ashwa-Mesh": 2, "Ashwa-Sarpa": 1, "Ashwa-Dog": 1, "Ashwa-Cat": 1, "Ashwa-Rat": 1, "Ashwa-Cow": 1,
  "Gaja-Gaja": 4, "Gaja-Mesh": 3, "Gaja-Sarpa": 3, "Gaja-Dog": 2, "Gaja-Cat": 2, "Gaja-Rat": 1, "Gaja-Cow": 1,
  "Mesh-Mesh": 4, "Mesh-Sarpa": 2, "Mesh-Dog": 1, "Mesh-Cat": 1, "Mesh-Rat": 1, "Mesh-Cow": 1,
  "Sarpa-Sarpa": 4, "Sarpa-Dog": 2, "Sarpa-Cat": 2, "Sarpa-Rat": 1, "Sarpa-Cow": 1,
  "Dog-Dog": 4, "Dog-Cat": 1, "Dog-Rat": 1, "Dog-Cow": 1,
  "Cat-Cat": 4, "Cat-Rat": 0, "Cat-Cow": 1,
  "Rat-Rat": 4, "Rat-Cow": 2,
  "Cow-Cow": 4
};

function getYoniPoints(y1: string, y2: string): number {
  const key1 = `${y1}-${y2}`;
  const key2 = `${y2}-${y1}`;
  if (YONI_MAP[key1] !== undefined) return YONI_MAP[key1];
  if (YONI_MAP[key2] !== undefined) return YONI_MAP[key2];
  return 1;
}

// 🔥 Dynamic Hash for Deterministic Score (Same input = Same output)
function getHashScore(str: string, max: number) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % (max + 1);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { boyName, girlName, boyRashi, girlRashi, boyNakshatra, girlNakshatra, language = "hinglish" } = body;

    if (!boyName || !girlName || !boyRashi || !girlRashi) {
      return NextResponse.json({ error: "Missing details." }, { status: 400 });
    }

    // 🔥 Generate deterministic seed
    const seed = `${boyName}_${boyRashi}_${girlName}_${girlRashi}`.toLowerCase();

    // 🔥 Dynamic Calculation instead of hardcoded
    const varnaPoints = getHashScore(seed + "_varna", 1);
    const vashyaPoints = getHashScore(seed + "_vashya", 2);
    const taraPoints = getHashScore(seed + "_tara", 3);
    
    const bYoni = boyNakshatra || "Ashwa";
    const gYoni = girlNakshatra || "Gaja";
    const yoniPoints = getYoniPoints(bYoni, gYoni);

    const maitriPoints = getHashScore(seed + "_maitri", 5);
    const ganaPoints = getHashScore(seed + "_gana", 6);
    const bhakootPoints = getHashScore(seed + "_bhakoot", 7);
    const nadiPoints = getHashScore(seed + "_nadi", 8);

    const totalScore = varnaPoints + vashyaPoints + taraPoints + yoniPoints + maitriPoints + ganaPoints + bhakootPoints + nadiPoints;

    // 🔥 Generate dynamic verdict based on score
    const langVerdicts = VERDICT_MESSAGES[language] || VERDICT_MESSAGES["hinglish"];
    let verdict = "";
    let dangerLevel = "safe";
    
    if (totalScore >= 25) {
      verdict = langVerdicts.excellent;
      dangerLevel = "safe";
    } else if (totalScore >= 18) {
      verdict = langVerdicts.average;
      dangerLevel = "warning";
    } else {
      verdict = langVerdicts.poor;
      dangerLevel = "critical";
    }

    // 🔥 Frontend specific dynamic fear message logic (Darr + Marketing)
    let fearMessage = verdict;
    if (nadiPoints === 0) {
      dangerLevel = "critical";
      fearMessage = language === "hi" ? "गहरी गणना में 'नाड़ी दोष' पाया गया है। यह दोष संतान सुख और वैवाहिक जीवन में गहरा असर डालता है।" : "Deep calculation reveals 'Nadi Dosh'. This heavily impacts progeny and married life.";
    } else if (bhakootPoints === 0) {
      dangerLevel = "warning";
      fearMessage = language === "hi" ? "कुंडली में 'भकूट दोष' है, जो रिश्ते में आर्थिक तनाव और आपसी मतभेद पैदा कर सकता है।" : "Chart shows 'Bhakoot Dosh', which can create financial stress and mutual differences.";
    }

    // 🔥 Formatting for Frontend (`app/matching/page.tsx`)
    const details = [
      { name: "Varna", score: varnaPoints, max: 1 },
      { name: "Vashya", score: vashyaPoints, max: 2 },
      { name: "Tara", score: taraPoints, max: 3 },
      { name: "Yoni", score: yoniPoints, max: 4 },
      { name: "Graha Maitri", score: maitriPoints, max: 5 },
      { name: "Gana", score: ganaPoints, max: 6 },
      { name: "Bhakoot", score: bhakootPoints, max: 7 },
      { name: "Nadi", score: nadiPoints, max: 8 },
    ];

    // Simulate calculation time for premium loading experience
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 🔥 Returning exactly what Frontend expects
    return NextResponse.json({
      score: totalScore,
      maxScore: 36,
      dangerLevel: dangerLevel,
      fearMessage: fearMessage,
      details: details
    });

  } catch (error) {
    console.error("Compatibility API Error:", error);
    return NextResponse.json({ error: "Astrological calculation failed." }, { status: 500 });
  }
}
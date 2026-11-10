// app/api/matching/route.ts
import { NextResponse } from "next/server";

// 🔥 10 Language Dictionary for Fear Messages
const FEAR_MESSAGES: Record<string, Record<string, string>> = {
  hi: {
    nadi: "गहरी गणना में 'नाड़ी दोष' पाया गया है। यह दोष संतान सुख और वैवाहिक जीवन में गहरा असर डालता है। इसे बिना उपाय के अनदेखा न करें।",
    bhakoot: "कुंडली में 'भकूट दोष' है, जो रिश्ते में आर्थिक तनाव और आपसी मतभेद पैदा कर सकता है। सटीक उपाय जानना आवश्यक है।",
    lowScore: "आपका कुल गुण मिलान (18 से कम) विवाह के लिए पर्याप्त नहीं है। ग्रहों की स्थिति में रुकावट है, ज्योतिषी से परामर्श लें।",
    safe: "आपका मिलान तो अच्छा है, लेकिन कुंडली के सूक्ष्म गणना में एक 'रुकावट' दिख रही है जो विवाह में देरी ला सकती है। इसका सटीक कारण और उपाय जाने बिना शादी का निर्णय न लें।"
  },
  hinglish: {
    nadi: "Gehri ganna mein 'Nadi Dosh' paya gaya hai. Yeh dosh santan sukh aur vaivahik jeevan mein gehra asar daalta hai. Ise bina upay ke andekha na karein.",
    bhakoot: "Kundli mein 'Bhakoot Dosh' hai, jo rishte mein aarthik tanav aur aapas mein matbhed paida kar sakta hai. Sahi upay janna zaroori hai.",
    lowScore: "Aapka total gun milan (18 se kam) vivah ke liye kaafi nahi hai. Grahon ki sthiti mein rukawat hai, astrologer se salah lein.",
    safe: "Aapka milan toh acha hai, lekin kundli ke sookshma ganna mein ek 'rukawat' dikh rahi hai jo vivah mein deri la sakti hai. Iska exact karan aur upay jaane bina shaadi ka nirnay na lein."
  },
  en: {
    nadi: "A deep calculation reveals 'Nadi Dosh'. This dosha heavily impacts progeny and married life. Do not ignore it without a remedy.",
    bhakoot: "The chart shows 'Bhakoot Dosh', which can create financial stress and mutual differences. Knowing the exact remedy is essential.",
    lowScore: "Your total score (below 18) is not sufficient for marriage. There is a planetary blockage, consult an astrologer.",
    safe: "Your match is good, but subtle calculations reveal a 'blockage' that may delay marriage. Do not decide without knowing the exact cause and remedy."
  },
  te: {
    nadi: "లోతైన లెక్కలో 'నాడి దోషం' బయటపడింది. ఈ దోషం సంతానం మరియు దాంపత్య జీవితంపై తీవ్ర ప్రభావం చూపుతుంది. పరిహారం లేకుండా పట్టించుకోకండి.",
    bhakoot: "జాతకంలో 'భకూట్ దోషం' ఉంది, ఇది ఆర్థిక ఒత్తిడి మరియు పరస్పర భేదాలను కలిగిస్తుంది. ఖచ్చితమైన పరిహారం తెలుసుకోవడం అవసరం.",
    lowScore: "మీ మొత్తం స్కోరు (18 కంటే తక్కువ) వివాహానికి సరిపోదు. గ్రహాలలో అడ్డంకి ఉంది, జ్యోతిష్యుడిని సంప్రదించండి.",
    safe: "మీ మ్యాచ్ బాగుంది, కానీ సూక్ష్మ లెక్కలలో వివాహానికి ఆలస్యం కలిగించే 'అడ్డంకి' కనిపిస్తోంది. ఖచ్చితమైన కారణం మరియు పరిహారం తెలుసుకోకుండా నిర్ణయం తీసుకోవద్దు."
  },
  ta: {
    nadi: "ஆழ்ந்த கணக்கீட்டில் 'நாடி தோஷம்' கண்டறியப்பட்டுள்ளது. இது சந்ததி மற்றும் தாம்பத்ய வாழ்க்கையில் பெரும் தாக்கத்தை ஏற்படுத்தும். பரிகாரம் இல்லாமல் புறக்கணிக்க வேண்டாம்.",
    bhakoot: "ஜாதகத்தில் 'பகூட் தோஷம்' உள்ளது, இது நிதி அழுத்தம் மற்றும் பரஸ்பர வேறுபாடுகளை உருவாக்கும். சரியான பரிகாரம் தெரிந்துகொள்வது அவசியம்.",
    lowScore: "உங்கள் மொத்த மதிப்பெண் (18க்கு குறைவு) திருமணத்திற்கு போதுமானதல்ல. கிரகங்களில் தடை உள்ளது, ஜோதிடரை அணுகவும்.",
    safe: "உங்கள் பொருத்தம் நல்லது, ஆனால் நுட்பமான கணக்கீடுகளில் திருமணத்தை தாமதப்படுத்தும் 'தடை' தெரிகிறது. சரியான காரணம் மற்றும் பரிகாரம் தெரியாமல் முடிவெடுக்க வேண்டாம்."
  },
  kn: {
    nadi: "ಆಳವಾದ ಲೆಕ್ಕಾಚಾರದಲ್ಲಿ 'ನಾಡಿ ದೋಷ' ಕಂಡುಬಂದಿದೆ. ಈ ದೋಷವು ಸಂತಾನ ಮತ್ತು ದಾಂಪತ್ಯ ಜೀವನದ ಮೇಲೆ ತೀವ್ರ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ. ಪರಿಹಾರವಿಲ್ಲದೆ ನಿರ್ಲಕ್ಷಿಸಬೇಡಿ.",
    bhakoot: "ಜಾತಕದಲ್ಲಿ 'ಭಕೂಟ್ ದೋಷ' ಇದೆ, ಇದು ಆರ್ಥಿಕ ಒತ್ತಡ ಮತ್ತು ಪರಸ್ಪರ ಭಿನ್ನಾಭಿಪ್ರಾಯಗಳನ್ನು ಉಂಟುಮಾಡಬಹುದು. ನಿಖರವಾದ ಪರಿಹಾರ ತಿಳಿಯುವುದು ಅವಶ್ಯಕ.",
    lowScore: "ನಿಮ್ಮ ಒಟ್ಟು ಸ್ಕೋರ್ (18 ಕ್ಕಿಂತ ಕಡಿಮೆ) ವಿವಾಹಕ್ಕೆ ಸಾಕಾಗುವುದಿಲ್ಲ. ಗ್ರಹಗಳಲ್ಲಿ ತಡೆಯಿದೆ, ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    safe: "ನಿಮ್ಮ ಹೊಂದಾಣಿಕೆ ಚೆನ್ನಾಗಿದೆ, ಆದರೆ ಸೂಕ್ಷ್ಮ ಲೆಕ್ಕಾಚಾರಗಳಲ್ಲಿ ವಿವಾಹವನ್ನು ವಿಳಂಬಗೊಳಿಸುವ 'ತಡೆ' ಕಂಡುಬರುತ್ತದೆ. ನಿಖರವಾದ ಕಾರಣ ಮತ್ತು ಪರಿಹಾರ ತಿಳಿಯದೆ ನಿರ್ಧರಿಸಬೇಡಿ."
  },
  bn: {
    nadi: "গভীর গণনায় 'নাড়ি দোষ' পাওয়া গেছে। এই দোষ সন্তান ও দাম্পত্য জীবনে গভীর প্রভাব ফেলে। প্রতিকার ছাড়া এটি উপেক্ষা করবেন না।",
    bhakoot: "কুণ্ডলীতে 'ভকূট দোষ' রয়েছে, যা আর্থিক চাপ এবং পারস্পরিক মতবিরোধ তৈরি করতে পারে। সঠিক প্রতিকার জানা জরুরি।",
    lowScore: "আপনার মোট স্কোর (১৮-এর কম) বিবাহের জন্য যথেষ্ট নয়। গ্রহের অবস্থানে বাধা রয়েছে, জ্যোতিষীর পরামর্শ নিন।",
    safe: "আপনার মিলন ভালো, তবে সূক্ষ্ম গণনায় বিবাহ বিলম্বিত করার একটি 'বাধা' দেখা যাচ্ছে। সঠিক কারণ ও প্রতিকার না জেনে সিদ্ধান্ত নেবেন না।"
  },
  mr: {
    nadi: "सखोल गणनेत 'नाडी दोष' आढळला आहे. हा दोष संतती आणि वैवाहिक जीवनावर गंभीर परिणाम करतो. उपायांशिवाय दुर्लक्ष करू नका.",
    bhakoot: "कुंडलीत 'भकूट दोष' आहे, जो आर्थिक ताण आणि परस्पर मतभेद निर्माण करू शकतो. अचूक उपाय जाणून घेणे आवश्यक आहे.",
    lowScore: "तुमचा एकूण गुण (१८ पेक्षा कमी) विवाहासाठी पुरेसा नाही. ग्रहांच्या स्थितीत अडथळा आहे, ज्योतिषाचा सल्ला घ्या.",
    safe: "तुमचे मिलन चांगले आहे, परंतु सूक्ष्म गणनेत विवाह लांबणीवर टाकणारा 'अडथळा' दिसत आहे. अचूक कारण आणि उपाय जाणून घेतल्याशिवाय निर्णय घेऊ नका."
  },
  gu: {
    nadi: "ઊંડી ગણતરીમાં 'નાડી દોષ' જોવા મળ્યો છે. આ દોષ સંતાન અને વૈવાહિક જીવન પર ઊંડી અસર કરે છે. ઉપાય વિના અવગણો નહીં.",
    bhakoot: "કુંડળીમાં 'ભકૂટ દોષ' છે, જે આર્થિક તણાવ અને પરસ્પર મતભેદો ઊભા કરી શકે છે. સચોટ ઉપાય જાણવો જરૂરી છે.",
    lowScore: "તમારો કુલ સ્કોર (18 થી ઓછો) લગ્ન માટે પૂરતો નથી. ગ્રહોની સ્થિતિમાં અવરોધ છે, જ્યોતિષીની સલાહ લો.",
    safe: "તમારી મેચ સારી છે, પરંતુ સૂક્ષ્મ ગણતરીમાં લગ્નમાં વિલંબ લાવી શકે તેવો 'અવરોધ' દેખાય છે. સચોટ કારણ અને ઉપાય જાણ્યા વિના નિર્ણય ન લો."
  },
  ml: {
    nadi: "ആഴത്തിലുള്ള കണക്കുകൂട്ടലിൽ 'നാഡി ദോഷം' കണ്ടെത്തി. ഈ ദോഷം സന്താനത്തെയും ദാമ്പത്യ ജീവിതത്തെയും സാരമായി ബാധിക്കും. പരിഹാരമില്ലാതെ അവഗണിക്കരുത്.",
    bhakoot: "ജാതകത്തിൽ 'ഭകൂട്ട് ദോഷം' ഉണ്ട്, ഇത് സാമ്പത്തിക സമ്മർദ്ദത്തിനും പരസ്പര വിയോജിപ്പിനും കാരണമാകും. കൃത്യമായ പരിഹാരം അറിയേണ്ടതുണ്ട്.",
    lowScore: "നിങ്ങളുടെ മൊത്തം സ്കോർ (18-ൽ താഴെ) വിവാഹത്തിന് പര്യാപ്തമല്ല. ഗ്രഹങ്ങളിൽ തടസ്സമുണ്ട്, ജ്യോതിഷിയെ സമീപിക്കുക.",
    safe: "നിങ്ങളുടെ മാച്ചിംഗ് നല്ലതാണ്, പക്ഷേ സൂക്ഷ്മ കണക്കുകൂട്ടലിൽ വിവാഹം വൈകിപ്പിക്കുന്ന ഒരു 'തടസ്സം' കാണുന്നു. കൃത്യമായ കാരണവും പരിഹാരവും അറിയാതെ തീരുമാനമെടുക്കരുത്."
  }
};

// 🔥 Deterministic Hash Function (Isse score fixed rahega, random nahi hoga)
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
    const { boy, girl, language = "hinglish" } = body; // 🔥 Language add ki

    // 1. Input Validation
    if (!boy?.name || !boy?.dob || !boy?.time || !boy?.lat || !girl?.name || !girl?.dob || !girl?.time || !girl?.lat) {
      return NextResponse.json(
        { error: "Kripya dono ki saari janm vivaran (DOB, Time, Place) bharein." }, 
        { status: 400 }
      );
    }

    // 2. DETERMINISTIC CALCULATION (Fake but consistent)
    // Names aur DOB ke basis par ek fixed hash banayenge, taaki har baar same result aaye
    const seed = `${boy.name}_${boy.dob}_${girl.name}_${girl.dob}`.toLowerCase().replace(/\s+/g, "");
    
    const totalScore = 16 + getHashScore(seed, 20); // Score hamesha 16 se 36 ke beech rahega
    const nadiScore = getHashScore(seed + "_nadi", 8);
    const bhakootScore = getHashScore(seed + "_bhakoot", 7);

    // 3. Marketing Logic (Darr + Psychology)
    let fearMessage = "";
    let dangerLevel = "safe";
    const langMsgs = FEAR_MESSAGES[language] || FEAR_MESSAGES["hinglish"];

    if (nadiScore === 0) {
      dangerLevel = "critical";
      fearMessage = langMsgs.nadi;
    } else if (bhakootScore === 0) {
      dangerLevel = "warning";
      fearMessage = langMsgs.bhakoot;
    } else if (totalScore < 18) {
      dangerLevel = "warning";
      fearMessage = langMsgs.lowScore;
    } else {
      dangerLevel = "safe";
      fearMessage = langMsgs.safe;
    }

    // 4. 8-Point Breakdown (Dynamic but fixed values)
    const details = [
      { name: "Varna", score: 1, max: 1 },
      { name: "Vashya", score: 2, max: 2 },
      { name: "Tara", score: 1 + getHashScore(seed + "_tara", 2), max: 3 },
      { name: "Yoni", score: 2 + getHashScore(seed + "_yoni", 2), max: 4 },
      { name: "Graha Maitri", score: 3 + getHashScore(seed + "_graha", 2), max: 5 },
      { name: "Gana", score: 4 + getHashScore(seed + "_gana", 2), max: 6 },
      { name: "Bhakoot", score: bhakootScore, max: 7 },
      { name: "Nadi", score: nadiScore, max: 8 },
    ];

    // Thoda delay taaki loading animation smooth lage
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
      score: totalScore,
      maxScore: 36,
      dangerLevel: dangerLevel,
      fearMessage: fearMessage, // 🔥 Ab ye user ki selected language me aayega
      details: details
    });

  } catch (error) {
    console.error("Astrology API Error:", error);
    return NextResponse.json({ error: "Cosmic calculation failed. Please try again." }, { status: 500 });
  }
}
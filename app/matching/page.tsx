// app/matching/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, Heart, Sparkles, MessageCircle, Download,
  ShieldAlert, MapPin, Calendar, Clock, ChevronDown, ChevronUp,
  Home, User, Share2, FileText, Star, AlertCircle,
  CheckCircle2, ArrowRight, RefreshCw, Sun, Lock, Wallet
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../Providers";

// ============================================================
// Loading Text — 10 Languages
// ============================================================
const getLoadingSteps = (lang: string) => {
  const steps: Record<string, string[]> = {
    hi: ["ग्रहों की स्थिति मिलाई जा रही है...", "नाड़ी और भकूट स्कोर की गणना...", "मंगल दोष का विश्लेषण...", "कॉस्मिक रिपोर्ट तैयार हो रही है..."],
    hinglish: ["Planetary positions align ho rahi hain...", "Nadi aur Bhakoot score calculate ho raha hai...", "Manglik Dosha analyze ho raha hai...", "Cosmic report taiyaar ho rahi hai..."],
    en: ["Aligning planetary positions...", "Calculating Nadi and Bhakoot scores...", "Analyzing Manglik Dosha...", "Generating Cosmic Diagnostic Report..."],
    te: ["గ్రహ స్థానాలు సరిచేయబడుతున్నాయి...", "నాడి మరియు భకూట్ స్కోర్లు లెక్కిస్తోంది...", "మంగళ దోషాన్ని విశ్లేషిస్తోంది...", "కాస్మిక్ నివేదిక సిద్ధమవుతోంది..."],
    ta: ["கிரக நிலைகள் சீரமைக்கப்படுகின்றன...", "நாடி மற்றும் பகூட் மதிப்பெண்கள் கணக்கிடப்படுகிறது...", "மங்கள தோஷம் ஆராயப்படுகிறது...", "காஸ்மிக் அறிக்கை தயாராகிறது..."],
    kn: ["ಗ್ರಹಗಳ ಸ್ಥಾನಗಳನ್ನು ಜೋಡಿಸಲಾಗುತ್ತಿದೆ...", "ನಾಡಿ ಮತ್ತು ಭಕೂಟ್ ಸ್ಕೋರ್ಗಳನ್ನು ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ...", "ಮಂಗಳ ದೋಷವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...", "ಕಾಸ್ಮಿಕ್ ವರದಿ ಸಿದ್ಧವಾಗುತ್ತಿದೆ..."],
    bn: ["গ্রহের অবস্থান সারিবদ্ধ করা হচ্ছে...", "নাড়ি এবং ভকূট স্কোর গণনা করা হচ্ছে...", "মঙ্গল দোষ বিশ্লেষণ করা হচ্ছে...", "কসমিক রিপোর্ট তৈরি হচ্ছে..."],
    mr: ["ग्रहांची स्थिती जुळवली जात आहे...", "नाडी आणि भकूट स्कोअर मोजले जात आहे...", "मंगळ दोषाचे विश्लेषण केले जात आहे...", "कॉस्मिक अहवाल तयार होत आहे..."],
    gu: ["ગ્રહોની સ્થિતિ ગોઠવાઈ રહી છે...", "નાડી અને ભકૂટ સ્કોરની ગણતરી થઈ રહી છે...", "મંગળ દોષનું વિશ્લેષણ થઈ રહ્યું છે...", "કોસ્મિક રિપોર્ટ તૈયાર થઈ રહ્યો છે..."],
    ml: ["ഗ്രഹസ്ഥാനങ്ങൾ ക്രമീകരിക്കുന്നു...", "നാഡിയും ഭകൂട്ടും കണക്കാക്കുന്നു...", "ചൊവ്വാദോഷം വിശകലനം ചെയ്യുന്നു...", "കോസ്മിക് റിപ്പോർട്ട് തയ്യാറാക്കുന്നു..."],
  };
  return steps[lang] || steps["hinglish"];
};

// ============================================================
// UI Text — 10 Languages
// ============================================================
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: {
      title: "कुंडली मिलान", subtitle: "सटीक विवाह मिलान", boy: "वर (लड़के) का विवरण", girl: "वधू (लड़की) का विवरण",
      name: "पूरा नाम", city: "जन्म स्थान (City)", matchBtn: "मिलान करें", alertCity: "कृपया लिस्ट से शहर चुनें!",
      result: "मिलान परिणाम", total: "/ 36 कुल अष्टकूट मिलान", breakdown: "सभी 8 गुणों का गणित देखें",
      chat: "ज्योतिषी से बात करें — पहली चैट FREE", pdf: "PDF डाउनलोड", reset: "दोबारा बनाएं", share: "WhatsApp पर भेजें",
      bannerTitle: "ज्योतिषी • 24x7 उपलब्ध", bannerSub: "मिलान को गहराई से समझने के लिए चैट करें — FREE",
      warning: "सही मिलान समझने से रिश्ता और मजबूत बनता है। यह रिपोर्ट आपको सही दिशा देने के लिए है।",
      home: "होम", chatNav: "चैट", daily: "राशिफल", profile: "प्रोफाइल",
      doshaTitle: "दोष और उनका निवारण", strengths: "आपकी 3 सबसे बड़ी ताकत", attention: "ध्यान देने वाली बातें",
      advice: "व्यवहारिक सलाह", nextSteps: "अगला कदम", soulLabel: "रिश्ते का निचोड़",
      doshaPresent: "उपस्थित", doshaCancelled: "निवारित", doshaAbsent: "कोई दोष नहीं",
      manglik: "मंगल दोष", nadi: "नाड़ी दोष", bhakoot: "भकूट दोष",
      disclaimer: "यह रिपोर्ट पारंपरिक वैदिक ज्योतिष पर आधारित है। यह मार्गदर्शन है, चिकित्सीय/कानूनी सलाह नहीं।",
      askQ: "और जानना चाहते हैं?",
      q1: "क्या हमारी शादी में परिवार आसानी से मान जाएगा?",
      q2: "हमारी कुंडली के अनुसार शादी का सबसे शुभ समय कब है?",
      q3: "करियर और धन पर इस रिश्ते का क्या असर होगा?",
      labelUtkrisht: "उत्कृष्ट मिलान", labelBahutAcha: "बहुत अच्छा मिलान", labelAcha: "अच्छा मिलान", labelAusat: "औसत मिलान", labelSudhar: "सुधार की गुंजाइश",
      boyPrefix: "वर", girlPrefix: "वधू",
      limitTitle: "आपकी फ्री लिमिट खत्म हो गई है!",
      limitSub: "आगे कुंडली मिलान के लिए वॉलेट रिचार्ज करें या ज्योतिषी से बात करें।",
      recharge: "वॉलेट रिचार्ज करें"
    },
    hinglish: {
      title: "Kundli Milan", subtitle: "Accurate Marriage Matching", boy: "Boy's Details", girl: "Girl's Details",
      name: "Full Name", city: "Birth City", matchBtn: "Milan Karein", alertCity: "Kripya list me se city select karein!",
      result: "Matching Result", total: "/ 36 Total Ashtakoot", breakdown: "Saare 8 gunon ka ganit dekhein",
      chat: "Jyotishi se baat karein — Pehli chat FREE", pdf: "PDF Download", reset: "Reset", share: "WhatsApp par bhejein",
      bannerTitle: "Astrologer • 24x7 Available", bannerSub: "Milan ki gehrai samajhne ke liye chat karein — FREE",
      warning: "Sahi milan samajhne se rishta aur mazboot banta hai. Yeh report aapko sahi disha dene ke liye hai.",
      home: "Home", chatNav: "Chat", daily: "Daily", profile: "Profile",
      doshaTitle: "Dosh aur Unka Nivaran", strengths: "Aapki 3 Sabse Badi Taaqat", attention: "Dhyan Dene Wali Baatein",
      advice: "Vyavaharik Salah", nextSteps: "Agla Kadam", soulLabel: "Rishte ka Nichod",
      doshaPresent: "Upasthit", doshaCancelled: "Nivarit", doshaAbsent: "Koi Dosh Nahi",
      manglik: "Manglik Dosh", nadi: "Nadi Dosh", bhakoot: "Bhakoot Dosh",
      disclaimer: "Yeh report traditional Vedic astrology par aadharit hai. Yeh guidance hai, medical/legal advice nahi.",
      askQ: "Aur jaanna chahte hain?",
      q1: "Kya hamari shaadi mein family aasani se maan jayegi?",
      q2: "Hamari kundli ke anusaar shaadi ka sabse shubh samay kab hai?",
      q3: "Career aur dhan par is rishte ka kya asar hoga?",
      labelUtkrisht: "Utkrisht Milan", labelBahutAcha: "Bahut Acha Milan", labelAcha: "Acha Milan", labelAusat: "Ausat Milan", labelSudhar: "Sudhar ki Gunjayish",
      boyPrefix: "Var", girlPrefix: "Vadhu",
      limitTitle: "Aapki Free Limit Khatam Ho Gayi Hai!",
      limitSub: "Aage matching ke liye wallet recharge karein ya jyotishi se baat karein.",
      recharge: "Wallet Recharge"
    },
    en: {
      title: "Kundli Matching", subtitle: "Accurate Marriage Matching", boy: "Boy's Details", girl: "Girl's Details",
      name: "Full Name", city: "Birth City", matchBtn: "Match Now", alertCity: "Please select a valid city from the list!",
      result: "Matching Result", total: "/ 36 Total Ashtakoot", breakdown: "See all 8 koota calculations",
      chat: "Talk to Astrologer — First chat FREE", pdf: "PDF Download", reset: "Reset", share: "Share on WhatsApp",
      bannerTitle: "Astrologer • 24x7 Available", bannerSub: "Chat to deeply understand the match — FREE",
      warning: "Understanding the match better strengthens the relationship. This report gives you right direction.",
      home: "Home", chatNav: "Chat", daily: "Daily", profile: "Profile",
      doshaTitle: "Doshas & Their Cancellation", strengths: "Your 3 Greatest Strengths", attention: "Areas of Attention",
      advice: "Practical Advice", nextSteps: "Next Steps", soulLabel: "Soul Summary",
      doshaPresent: "Present", doshaCancelled: "Cancelled", doshaAbsent: "No Dosha",
      manglik: "Manglik Dosha", nadi: "Nadi Dosha", bhakoot: "Bhakoot Dosha",
      disclaimer: "This report is based on traditional Vedic astrology. It is guidance, not medical/legal advice.",
      askQ: "Want to know more?",
      q1: "Will our families easily agree to this marriage?",
      q2: "What is the most auspicious time for marriage as per our charts?",
      q3: "How will this relationship affect career and wealth?",
      labelUtkrisht: "Excellent Match", labelBahutAcha: "Very Good Match", labelAcha: "Good Match", labelAusat: "Average Match", labelSudhar: "Needs Improvement",
      boyPrefix: "Groom", girlPrefix: "Bride",
      limitTitle: "Your Free Limit is Exhausted!",
      limitSub: "Recharge your wallet or talk to an astrologer for further matchings.",
      recharge: "Recharge Wallet"
    },
    te: { title: "కుండలి మిలన్", subtitle: "ఖచ్చితమైన వివాహ మ్యాచింగ్", boy: "అబ్బాయి వివరాలు", girl: "అమ్మాయి వివరాలు", name: "పూర్తి పేరు", city: "పుట్టిన నగరం", matchBtn: "మ్యాచ్ చేయండి", alertCity: "దయచేసి జాబితా నుండి నగరాన్ని ఎంచుకోండి!", result: "మ్యాచింగ్ ఫలితం", total: "/ 36 మొత్తం అష్టకూట్", breakdown: "అన్ని 8 కూటాలు చూడండి", chat: "జ్యోతిష్యుడితో మాట్లాడండి — మొదటి చాట్ FREE", pdf: "PDF", reset: "రీసెట్", share: "WhatsApp లో పంపండి", bannerTitle: "జ్యోతిష్యుడు • 24x7 అందుబాటులో", bannerSub: "మ్యాచ్‌ను లోతుగా అర్థం చేసుకోవడానికి చాట్ చేయండి — FREE", warning: "సరైన మ్యాచ్ అర్థం చేసుకోవడం సంబంధాన్ని బలపరుస్తుంది.", home: "హోమ్", chatNav: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్", doshaTitle: "దోషాలు & నివారణ", strengths: "మీ 3 గొప్ప బలాలు", attention: "శ్రద్ధ వహించవలసిన అంశాలు", advice: "ఆచరణాత్మక సలహా", nextSteps: "తదుపరి అడుగు", soulLabel: "సంబంధ సారాంశం", doshaPresent: "ఉంది", doshaCancelled: "నివారించబడింది", doshaAbsent: "దోషం లేదు", manglik: "మంగళ దోషం", nadi: "నాడి దోషం", bhakoot: "భకూట్ దోషం", disclaimer: "ఈ నివేదిక సాంప్రదాయ వేద జ్యోతిష్యంపై ఆధారపడి ఉంది.", askQ: "ఇంకా తెలుసుకోవాలనుకుంటున్నారా?", q1: "మా పెళ్లికి కుటుంబం సులభంగా అంగీకరిస్తుందా?", q2: "మా జాతకాల ప్రకారం పెళ్లికి శుభ సమయం ఎప్పుడు?", q3: "ఈ సంబంధం కెరీర్ మరియు ధనంపై ఎలా ప్రభావితం చేస్తుంది?", labelUtkrisht: "అద్భుతమైన మ్యాచ్", labelBahutAcha: "చాలా మంచి మ్యాచ్", labelAcha: "మంచి మ్యాచ్", labelAusat: "సగటు మ్యాచ్", labelSudhar: "మెరుగుపరచాల్సిన అవసరం", boyPrefix: "వరుడు", girlPrefix: "వధువు", limitTitle: "మీ ఉచిత పరిమితి ముగిసింది!", limitSub: "మరిన్ని మ్యాచ్‌ల కోసం వాలెట్ రీఛార్జ్ చేయండి.", recharge: "వాలెట్ రీఛార్జ్" },
    ta: { title: "ஜாதக பொருத்தம்", subtitle: "துல்லியமான திருமண பொருத்தம்", boy: "ஆண் விவரங்கள்", girl: "பெண் விவரங்கள்", name: "முழு பெயர்", city: "பிறந்த நகரம்", matchBtn: "பொருத்தம் பார்க்க", alertCity: "பட்டியலில் இருந்து நகரத்தை தேர்ந்தெடுக்கவும்!", result: "பொருத்தம் முடிவு", total: "/ 36 மொத்த அஷ்டகூடம்", breakdown: "அனைத்து 8 கூடங்களையும் பார்க்க", chat: "ஜோதிடரிடம் பேசுங்கள் — முதல் அரட்டை FREE", pdf: "PDF", reset: "மீட்டமை", share: "WhatsApp இல் பகிரவும்", bannerTitle: "ஜோதிடர் • 24x7 கிடைக்கும்", bannerSub: "பொருத்தத்தை ஆழமாக புரிந்துகொள்ள அரட்டை செய்யுங்கள் — FREE", warning: "சரியான பொருத்தத்தை புரிந்துகொள்வது உறவை வலுப்படுத்தும்.", home: "முகப்பு", chatNav: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்", doshaTitle: "தோஷங்கள் & நிவாரணம்", strengths: "உங்கள் 3 சிறந்த பலங்கள்", attention: "கவனிக்க வேண்டிய பகுதிகள்", advice: "நடைமுறை ஆலோசனை", nextSteps: "அடுத்த படி", soulLabel: "உறவு சாராம்சம்", doshaPresent: "உள்ளது", doshaCancelled: "நிவாரணம்", doshaAbsent: "தோஷம் இல்லை", manglik: "மாங்கலிக் தோஷம்", nadi: "நாடி தோஷம்", bhakoot: "பகூட் தோஷம்", disclaimer: "இந்த அறிக்கை பாரம்பரிய வேத ஜோதிடத்தை அடிப்படையாகக் கொண்டது.", askQ: "மேலும் அறிய விரும்புகிறீர்களா?", q1: "எங்கள் திருமணத்திற்கு குடும்பம் எளிதில் ஒப்புக்கொள்ளுமா?", q2: "எங்கள் ஜாதகங்களின்படி திருமணத்திற்கு மிக நல்ல நேரம் எப்போது?", q3: "இந்த உறவு தொழில் மற்றும் செல்வத்தை எவ்வாறு பாதிக்கும்?", labelUtkrisht: "சிறந்த பொருத்தம்", labelBahutAcha: "மிக நல்ல பொருத்தம்", labelAcha: "நல்ல பொருத்தம்", labelAusat: "சராசரி பொருத்தம்", labelSudhar: "மேம்பாடு தேவை", boyPrefix: "மணமகன்", girlPrefix: "மணமகள்", limitTitle: "உங்கள் இலவச வரம்பு முடிந்தது!", limitSub: "மேலும் பொருத்தங்களுக்கு வாலெட் ரீசார்ஜ் செய்யுங்கள்.", recharge: "வாலெட் ரீசார்ஜ்" },
    kn: { title: "ಕುಂಡಲಿ ಹೊಂದಾಣಿಕೆ", subtitle: "ನಿಖರವಾದ ವಿವಾಹ ಹೊಂದಾಣಿಕೆ", boy: "ಹುಡುಗನ ವಿವರಗಳು", girl: "ಹುಡುಗಿಯ ವಿವರಗಳು", name: "ಪೂರ್ಣ ಹೆಸರು", city: "ಹುಟ್ಟಿದ ನಗರ", matchBtn: "ಹೊಂದಿಸಿ", alertCity: "ದಯವಿಟ್ಟು ಪಟ್ಟಿಯಿಂದ ನಗರವನ್ನು ಆಯ್ಕೆಮಾಡಿ!", result: "ಹೊಂದಾಣಿಕೆಯ ಫಲಿತಾಂಶ", total: "/ 36 ಒಟ್ಟು ಅಷ್ಟಕೂಟ", breakdown: "ಎಲ್ಲಾ 8 ಕೂಟಗಳನ್ನು ನೋಡಿ", chat: "ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ FREE", pdf: "PDF", reset: "ಮರುಹೊಂದಿಸಿ", share: "WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ", bannerTitle: "ಜ್ಯೋತಿಷಿ • 24x7 ಲಭ್ಯವಿದೆ", bannerSub: "ಹೊಂದಾಣಿಕೆಯನ್ನು ಆಳವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಚಾಟ್ ಮಾಡಿ — FREE", warning: "ಸರಿಯಾದ ಹೊಂದಾಣಿಕೆ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು ಸಂಬಂಧವನ್ನು ಬಲಪಡಿಸುತ್ತದೆ.", home: "ಮುಖಪುಟ", chatNav: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್", doshaTitle: "ದೋಷಗಳು & ನಿವಾರಣೆ", strengths: "ನಿಮ್ಮ 3 ಶ್ರೇಷ್ಠ ಶಕ್ತಿಗಳು", attention: "ಗಮನಿಸಬೇಕಾದ ಅಂಶಗಳು", advice: "ಪ್ರಾಯೋಗಿಕ ಸಲಹೆ", nextSteps: "ಮುಂದಿನ ಹೆಜ್ಜೆ", soulLabel: "ಸಂಬಂಧದ ಸಾರಾಂಶ", doshaPresent: "ಇದೆ", doshaCancelled: "ನಿವಾರಣೆ", doshaAbsent: "ದೋಷ ಇಲ್ಲ", manglik: "ಮಾಂಗ್ಲಿಕ್ ದೋಷ", nadi: "ನಾಡಿ ದೋಷ", bhakoot: "ಭಕೂಟ್ ದೋಷ", disclaimer: "ಈ ವರದಿ ಸಾಂಪ್ರದಾಯಿಕ ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯವನ್ನು ಆಧರಿಸಿದೆ.", askQ: "ಇನ್ನಷ್ಟು ತಿಳಿಯಲು ಬಯಸುವಿರಾ?", q1: "ನಮ್ಮ ಮದುವೆಗೆ ಕುಟುಂಬ ಸುಲಭವಾಗಿ ಒಪ್ಪುತ್ತದೆಯೇ?", q2: "ನಮ್ಮ ಜಾತಕದ ಪ್ರಕಾರ ಮದುವೆಗೆ ಶುಭ ಸಮಯ ಯಾವುದು?", q3: "ಈ ಸಂಬಂಧ ವೃತ್ತಿ ಮತ್ತು ಸಂಪತ್ತಿನ ಮೇಲೆ ಹೇಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ?", labelUtkrisht: "ಅತ್ಯುತ್ತಮ ಹೊಂದಾಣಿಕೆ", labelBahutAcha: "ಬಹಳ ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ", labelAcha: "ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ", labelAusat: "ಸರಾಸರಿ ಹೊಂದಾಣಿಕೆ", labelSudhar: "ಸುಧಾರಣೆ ಅಗತ್ಯ", boyPrefix: "ವರ", girlPrefix: "ವಧು", limitTitle: "ನಿಮ್ಮ ಉಚಿತ ಮಿತಿ ಮುಗಿದಿದೆ!", limitSub: "ಹೆಚ್ಚಿನ ಹೊಂದಾಣಿಕೆಗಾಗಿ ವಾಲೆಟ್ ರೀಚಾರ್ಜ್ ಮಾಡಿ.", recharge: "ವಾಲೆಟ್ ರೀಚಾರ್ಜ್" },
    bn: { title: "কুণ্ডলী মিলন", subtitle: "সঠিক বিবাহ ম্যাচিং", boy: "ছেলের বিবরণ", girl: "মেয়ের বিবরণ", name: "পুরো নাম", city: "জন্ম শহর", matchBtn: "মিলন করুন", alertCity: "অনুগ্রহ করে তালিকা থেকে শহর নির্বাচন করুন!", result: "মিলন ফলাফল", total: "/ 36 মোট অষ্টকূট", breakdown: "সব ৮টি কূট দেখুন", chat: "জ্যোতিষীর সাথে কথা বলুন — প্রথম চ্যাট FREE", pdf: "PDF", reset: "রিসেট", share: "WhatsApp এ শেয়ার করুন", bannerTitle: "জ্যোতিষী • 24x7 উপলব্ধ", bannerSub: "মিলন গভীরভাবে বুঝতে চ্যাট করুন — FREE", warning: "সঠিক মিলন বুঝলে সম্পর্ক আরও মজবুত হয়।", home: "হোম", chatNav: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল", doshaTitle: "দোষ ও তাদের নিবারণ", strengths: "আপনার ৩টি সেরা শক্তি", attention: "মনোযোগ দেওয়ার বিষয়", advice: "ব্যবহারিক পরামর্শ", nextSteps: "পরবর্তী পদক্ষেপ", soulLabel: "সম্পর্কের সারাংশ", doshaPresent: "উপস্থিত", doshaCancelled: "নিবারিত", doshaAbsent: "কোনো দোষ নেই", manglik: "মাঙ্গলিক দোষ", nadi: "নাড়ি দোষ", bhakoot: "ভকূট দোষ", disclaimer: "এই রিপোর্ট ঐতিহ্যবাহী বৈদিক জ্যোতিষের উপর ভিত্তি করে।", askQ: "আরও জানতে চান?", q1: "আমাদের বিয়েতে পরিবার সহজে রাজি হবে?", q2: "আমাদের কুণ্ডলী অনুযায়ী বিয়ের শুভ সময় কখন?", q3: "এই সম্পর্ক ক্যারিয়ার ও ধনে কী প্রভাব ফেলবে?", labelUtkrisht: "চমৎকার মিলন", labelBahutAcha: "খুব ভালো মিলন", labelAcha: "ভালো মিলন", labelAusat: "গড় মিলন", labelSudhar: "উন্নতি প্রয়োজন", boyPrefix: "বর", girlPrefix: "কনে", limitTitle: "আপনার ফ্রি সীমা শেষ!", limitSub: "আরও মিলনের জন্য ওয়ালেট রিচার্জ করুন।", recharge: "ওয়ালেট রিচার্জ" },
    mr: { title: "कुंडली मिलन", subtitle: "अचूक विवाह जुळणी", boy: "मुलाचे तपशील", girl: "मुलीचे तपशील", name: "पूर्ण नाव", city: "जन्म शहर", matchBtn: "जुळवा", alertCity: "कृपया यादीतून शहर निवडा!", result: "जुळणी निकाल", total: "/ 36 एकूण अष्टकूट", breakdown: "सर्व 8 कूट पहा", chat: "ज्योतिषाशी बोला — पहिली चॅट FREE", pdf: "PDF", reset: "रीसेट", share: "WhatsApp वर शेअर करा", bannerTitle: "ज्योतिषी • 24x7 उपलब्ध", bannerSub: "जुळणी सखोल समजून घेण्यासाठी चॅट करा — FREE", warning: "योग्य जुळणी समजल्यास नातं अधिक मजबूत होतं.", home: "होम", chatNav: "चॅट", daily: "दैनिक", profile: "प्रोफाइल", doshaTitle: "दोष आणि त्यांचे निवारण", strengths: "तुमच्या 3 सर्वात मोठ्या ताकदी", attention: "लक्ष देण्याच्या गोष्टी", advice: "व्यवहारिक सल्ला", nextSteps: "पुढील पाऊल", soulLabel: "नात्याचा निचरा", doshaPresent: "उपस्थित", doshaCancelled: "निवारित", doshaAbsent: "दोष नाही", manglik: "मांगलिक दोष", nadi: "नाडी दोष", bhakoot: "भकूट दोष", disclaimer: "हा अहवाल पारंपारिक वैदिक ज्योतिषावर आधारित आहे.", askQ: "अजून जाणून घ्यायचंय?", q1: "आमच्या लग्नाला कुटुंब सहज मान्य करेल का?", q2: "आमच्या कुंडलीनुसार लग्नाची सर्वात शुभ वेळ कधी?", q3: "या नात्याचा करिअर आणि पैशावर काय परिणाम होईल?", labelUtkrisht: "उत्कृष्ट जुळणी", labelBahutAcha: "खूप चांगली जुळणी", labelAcha: "चांगली जुळणी", labelAusat: "सरासरी जुळणी", labelSudhar: "सुधारणा आवश्यक", boyPrefix: "वर", girlPrefix: "वधू", limitTitle: "तुमची मोफत मर्यादा संपली आहे!", limitSub: "अधिक जुळणीसाठी वॉलेट रिचार्ज करा.", recharge: "वॉलेट रिचार्ज" },
    gu: { title: "કુંડળી મેળાપ", subtitle: "સચોટ લગ્ન મેચિંગ", boy: "છોકરાની વિગતો", girl: "છોકરીની વિગતો", name: "પૂરું નામ", city: "જન્મ શહેર", matchBtn: "મેળવો", alertCity: "કૃપા કરીને સૂચિમાંથી શહેર પસંદ કરો!", result: "મેચિંગ પરિણામ", total: "/ 36 કુલ અષ્ટકૂટ", breakdown: "બધા 8 કૂટ જુઓ", chat: "જ્યોતિષી સાથે વાત કરો — પ્રથમ ચેટ FREE", pdf: "PDF", reset: "રીસેટ", share: "WhatsApp પર શેર કરો", bannerTitle: "જ્યોતિષી • 24x7 ઉપલબ્ધ", bannerSub: "મેચિંગ ઊંડાણપૂર્વક સમજવા ચેટ કરો — FREE", warning: "યોગ્ય મેચિંગ સમજવાથી સંબંધ વધુ મજબૂત બને છે.", home: "હોમ", chatNav: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ", doshaTitle: "દોષ અને તેમનું નિવારણ", strengths: "તમારી 3 સૌથી મોટી તાકાત", attention: "ધ્યાન આપવાની બાબતો", advice: "વ્યવહારુ સલાહ", nextSteps: "આગળનું પગલું", soulLabel: "સંબંધનો નિચોડ", doshaPresent: "હાજર", doshaCancelled: "નિવારિત", doshaAbsent: "કોઈ દોષ નથી", manglik: "માંગલિક દોષ", nadi: "નાડી દોષ", bhakoot: "ભકૂટ દોષ", disclaimer: "આ રિપોર્ટ પરંપરાગત વૈદિક જ્યોતિષ પર આધારિત છે.", askQ: "વધુ જાણવા માંગો છો?", q1: "અમારા લગ્નમાં પરિવાર સહેલાઈથી માની જશે?", q2: "અમારી કુંડળી મુજબ લગ્નનો સૌથી શુભ સમય ક્યારે?", q3: "આ સંબંધ કરિયર અને ધન પર કેવી અસર કરશે?", labelUtkrisht: "ઉત્કૃષ્ટ મેચિંગ", labelBahutAcha: "ખૂબ સારું મેચિંગ", labelAcha: "સારું મેચિંગ", labelAusat: "સરેરાશ મેચિંગ", labelSudhar: "સુધારાની જરૂર", boyPrefix: "વર", girlPrefix: "વધૂ", limitTitle: "તમારી મફત મર્યાદા સમાપ્ત થઈ ગઈ છે!", limitSub: "વધુ મેચિંગ માટે વોલેટ રિચાર્જ કરો.", recharge: "વોલેટ રિચાર્જ" },
    ml: { title: "കുണ്ഡലി മാച്ചിംഗ്", subtitle: "കൃത്യമായ വിവാഹ മാച്ചിംഗ്", boy: "ആൺകുട്ടിയുടെ വിവരങ്ങൾ", girl: "പെൺകുട്ടിയുടെ വിവരങ്ങൾ", name: "പൂർണ്ണ നാമം", city: "ജനന നഗരം", matchBtn: "മാച്ച് ചെയ്യുക", alertCity: "ലിസ്റ്റിൽ നിന്ന് ഒരു നഗരം തിരഞ്ഞെടുക്കുക!", result: "മാച്ചിംഗ് ഫലം", total: "/ 36 മൊത്തം അഷ്ടകൂട്ടം", breakdown: "എല്ലാ 8 കൂട്ടങ്ങളും കാണുക", chat: "ജ്യോതിഷിയോട് സംസാരിക്കുക — ആദ്യ ചാറ്റ് FREE", pdf: "PDF", reset: "പുനഃസജ്ജമാക്കുക", share: "WhatsApp ൽ പങ്കിടുക", bannerTitle: "ജ്യോതിഷി • 24x7 ലഭ്യമാണ്", bannerSub: "മാച്ചിംഗ് ആഴത്തിൽ മനസ്സിലാക്കാൻ ചാറ്റ് ചെയ്യുക — FREE", warning: "ശരിയായ മാച്ചിംഗ് മനസ്സിലാക്കുന്നത് ബന്ധം ശക്തമാക്കുന്നു.", home: "ഹോം", chatNav: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ", doshaTitle: "ദോഷങ്ങളും പരിഹാരവും", strengths: "നിങ്ങളുടെ 3 മികച്ച ശക്തികൾ", attention: "ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ", advice: "പ്രായോഗിക ഉപദേശം", nextSteps: "അടുത്ത ഘട്ടം", soulLabel: "ബന്ധത്തിന്റെ സാരാംശം", doshaPresent: "ഉണ്ട്", doshaCancelled: "പരിഹരിച്ചു", doshaAbsent: "ദോഷമില്ല", manglik: "മാംഗ്ലിക് ദോഷം", nadi: "നാഡി ദോഷം", bhakoot: "ഭകൂട്ട് ദോഷം", disclaimer: "ഈ റിപ്പോർട്ട് പരമ്പരാഗത വൈദിക ജ്യോതിഷത്തെ അടിസ്ഥാനമാക്കിയുള്ളതാണ്.", askQ: "കൂടുതൽ അറിയാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?", q1: "ഞങ്ങളുടെ വിവാഹത്തിന് കുടുംബം എളുപ്പത്തിൽ സമ്മതിക്കുമോ?", q2: "ഞങ്ങളുടെ ജാതകം അനുസരിച്ച് വിവാഹത്തിന് ഏറ്റവും ശുഭമായ സമയം എപ്പോൾ?", q3: "ഈ ബന്ധം കരിയറിലും ധനത്തിലും എന്ത് സ്വാധീനം ചെലുത്തും?", labelUtkrisht: "മികച്ച മാച്ചിംഗ്", labelBahutAcha: "വളരെ നല്ല മാച്ചിംഗ്", labelAcha: "നല്ല മാച്ചിംഗ്", labelAusat: "ശരാശരി മാച്ചിംഗ്", labelSudhar: "മെച്ചപ്പെടുത്തൽ ആവശ്യം", boyPrefix: "വരൻ", girlPrefix: "വധു", limitTitle: "നിങ്ങളുടെ സൗജന്യ പരിധി തീർന്നു!", limitSub: "കൂടുതൽ മാച്ചിംഗിനായി വാലറ്റ് റീചാർജ് ചെയ്യുക.", recharge: "വാലറ്റ് റീചാർജ്" },
  };
  return ui[lang]?.[key] || ui["en"][key] || ui["hi"][key];
};

const getLabelText = (lang: string, label: string) => {
  const keyMap: Record<string, string> = {
    utkrisht: "labelUtkrisht",
    "bahut-acha": "labelBahutAcha",
    acha: "labelAcha",
    ausat: "labelAusat",
    sudhar: "labelSudhar",
  };
  return getUIText(lang, keyMap[label] || "labelAcha");
};

const getLabelColor = (label: string) => {
  if (label === "utkrisht" || label === "bahut-acha") {
    return { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", ring: "#10b981" };
  }
  if (label === "acha") {
    return { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", ring: "#f59e0b" };
  }
  if (label === "ausat") {
    return { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", ring: "#d97706" };
  }
  return { text: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200", ring: "#64748b" };
};
// ============================================================
// City Input Component (Fully Fixed)
// ============================================================
function CityInput({
  value, setValue, suggestions, setSuggestions, isDark, inputClass, placeholder,
}: any) {
  const searchCity = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => searchCity(value.city), 600);
    return () => clearTimeout(delay);
  }, [value.city]);

  const handleSelect = (city: any) => {
    setValue((prev: any) => ({
      ...prev,
      city: city.display_name,
      lat: Number(city.lat),
      lon: Number(city.lon),
    }));
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <MapPin size={16} className="absolute left-3 text-slate-500" />
        <input
          type="text"
          value={value.city}
          onChange={(e) => {
            setValue((prev: any) => ({
              ...prev,
              city: e.target.value,
              lat: null,
              lon: null,
            }));
          }}
          placeholder={placeholder}
          className={`${inputClass} pl-9`}
        />
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-lg border bg-white shadow-xl text-slate-900">
          {suggestions.map((city: any, i: number) => (
            <li
              key={i}
              onClick={() => handleSelect(city)}
              className="cursor-pointer border-b border-gray-100 last:border-0 px-3 py-2 text-sm hover:bg-orange-50"
            >
              {city.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================
// Main Page Component
// ============================================================
export default function MatchingPage() {
  const { lang, theme, me, loading: authLoading } = useApp();
  const router = useRouter();
  const isDark = theme === "dark";

  const [boy, setBoy] = useState<any>({ name: "", dob: "", birthTime: "", city: "", lat: null, lon: null });
  const [girl, setGirl] = useState<any>({ name: "", dob: "", birthTime: "", city: "", lat: null, lon: null });
  const [boySuggestions, setBoySuggestions] = useState<any[]>([]);
  const [girlSuggestions, setGirlSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Limit & Auth State
  const [matchCount, setMatchCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const t = (key: string) => getUIText(lang, key);

  // 1. Initial Limit Check
  useEffect(() => {
    const savedCount = parseInt(localStorage.getItem("matching_count") || "0");
    setMatchCount(savedCount);
  }, []);

  // 2. Auth Redirect
  useEffect(() => {
    if (!authLoading && (!me?.user || me.user.isGuest)) {
      router.push("/login?redirect=/matching");
    }
  }, [me, authLoading, router]);

  // 3. Loading Text Rotation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const steps = getLoadingSteps(lang);
    if (loading) {
      setLoadingText(steps[0]);
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % steps.length;
        setLoadingText(steps[i]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading, lang]);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auth Check
    if (!me?.user || me.user.isGuest) {
      router.push("/login?redirect=/matching");
      return;
    }

    // Free Limit Check (2 Free)
    if (matchCount >= 2) {
      setShowLimitModal(true);
      return;
    }

    if (!boy.city || !girl.city) {
      alert(t("alertCity"));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boy, girl }),
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/login?redirect=/matching");
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err?.message || "Something went wrong. Please try again.");
        return;
      }

      const data = await res.json();
      
      // Update Count
      const newCount = matchCount + 1;
      setMatchCount(newCount);
      localStorage.setItem("matching_count", String(newCount));
      
      setResult(data);
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBoy({ name: "", dob: "", birthTime: "", city: "", lat: null, lon: null });
    setGirl({ name: "", dob: "", birthTime: "", city: "", lat: null, lon: null });
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c]" : "border-orange-100 bg-white";
  const inputClass = isDark
    ? "w-full rounded-xl border border-slate-700 bg-[#0A0F19] px-3 py-2 text-sm text-slate-100 focus:border-orange-500 focus:outline-none"
    : "w-full rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none";
  const labelClass = "text-xs font-semibold mb-1 block opacity-80";
  const navBg = isDark ? "bg-[#151d2c] border-slate-800" : "bg-white border-orange-100";

  if (authLoading || (!me?.user || me.user.isGuest)) {
    return <div className={`min-h-screen flex items-center justify-center ${pageClass}`}>Loading...</div>;
  }

  return (
    <div className={`min-h-screen ${pageClass}`}>
      {/* Header */}
      <header className={`sticky top-0 z-20 border-b ${navBg}`}>
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button onClick={() => router.back()} className="rounded-full p-2 hover:bg-black/5" aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="flex items-center gap-2 text-base font-bold text-orange-500">
              {t("title")}
            </h1>
            <p className="text-xs opacity-70">{t("subtitle")}</p>
          </div>
          <Heart size={20} className="text-orange-500" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5 pb-28">
        {!result && !loading && (
          <form onSubmit={handleMatch}>
            {/* Warning Banner */}
            <div className={`mb-4 flex items-start gap-2 rounded-xl border p-3 text-xs ${isDark ? "border-orange-900/50 bg-orange-900/20 text-orange-200" : "border-orange-200 bg-orange-50 text-orange-800"}`}>
              <Sparkles size={16} className="mt-0.5 shrink-0 text-orange-500" />
              <span>{t("warning")}</span>
            </div>

            {/* Boy's Details */}
            <div className={`mb-4 rounded-2xl border p-4 ${cardClass}`}>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold">
                <User size={16} className="text-orange-500" /> {t("boy")}
              </h2>
              <div className="mb-3">
                <input
                  type="text"
                  value={boy.name}
                  onChange={(e) => setBoy((p: any) => ({ ...p, name: e.target.value }))}
                  placeholder={t("name")}
                  className={inputClass}
                  required
                />
              </div>
              <div className="mb-3 grid grid-cols-2 gap-2">
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="date"
                    value={boy.dob}
                    onChange={(e) => setBoy((p: any) => ({ ...p, dob: e.target.value }))}
                    className={`${inputClass} pl-9`}
                    required
                  />
                </div>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="time"
                    value={boy.birthTime}
                    onChange={(e) => setBoy((p: any) => ({ ...p, birthTime: e.target.value }))}
                    className={`${inputClass} pl-9`}
                    required
                  />
                </div>
              </div>
              <div>
                <CityInput
                  value={boy}
                  setValue={setBoy}
                  suggestions={boySuggestions}
                  setSuggestions={setBoySuggestions}
                  isDark={isDark}
                  inputClass={inputClass}
                  placeholder={t("city")}
                />
              </div>
            </div>

            {/* Heart Divider */}
            <div className="flex justify-center -my-2 relative z-10">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${isDark ? "border-[#0A0F19] bg-[#151d2c]" : "border-[#FEF8EF] bg-white"}`}>
                <Heart size={16} className="text-orange-500 fill-orange-500" />
              </div>
            </div>

            {/* Girl's Details */}
            <div className={`mb-6 rounded-2xl border p-4 ${cardClass}`}>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold">
                <Heart size={16} className="text-pink-500" /> {t("girl")}
              </h2>
              <div className="mb-3">
                <input
                  type="text"
                  value={girl.name}
                  onChange={(e) => setGirl((p: any) => ({ ...p, name: e.target.value }))}
                  placeholder={t("name")}
                  className={inputClass}
                  required
                />
              </div>
              <div className="mb-3 grid grid-cols-2 gap-2">
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="date"
                    value={girl.dob}
                    onChange={(e) => setGirl((p: any) => ({ ...p, dob: e.target.value }))}
                    className={`${inputClass} pl-9`}
                    required
                  />
                </div>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="time"
                    value={girl.birthTime}
                    onChange={(e) => setGirl((p: any) => ({ ...p, birthTime: e.target.value }))}
                    className={`${inputClass} pl-9`}
                    required
                  />
                </div>
              </div>
              <div>
                <CityInput
                  value={girl}
                  setValue={setGirl}
                  suggestions={girlSuggestions}
                  setSuggestions={setGirlSuggestions}
                  isDark={isDark}
                  inputClass={inputClass}
                  placeholder={t("city")}
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-500">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition"
            >
              <Sparkles size={16} />
              {t("matchBtn")}
            </button>
          </form>
        )}

        {/* Loading State */}
        {loading && (
          <div className={`mt-10 rounded-2xl border p-8 text-center ${cardClass}`}>
            <div className="mx-auto mb-4 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-orange-500/20">
              <Heart size={32} className="text-orange-500" />
            </div>
            <p className="text-sm font-medium">{loadingText}</p>
          </div>
        )}

        {/* ------------------------------------------------ */}
        {/* RESULT UI (PART 3 WILL CONTINUE FROM HERE)       */}
        {/* ------------------------------------------------ */}
        {/* ------------------------------------------------ */}
        {/* RESULT UI (PART 3)                               */}
        {/* ------------------------------------------------ */}
        {result && !loading && (
          <div className="space-y-4">
            
            {/* 1. Score Card */}
            <div className={`rounded-3xl border p-6 text-center shadow-sm ${cardClass}`}>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-right">
                  <p className="text-xs text-slate-400">{t("boyPrefix")}</p>
                  <p className="font-bold text-sm">{boy.name || "Boy"}</p>
                </div>
                <Heart size={24} className="text-orange-500 fill-orange-500" />
                <div className="text-left">
                  <p className="text-xs text-slate-400">{t("girlPrefix")}</p>
                  <p className="font-bold text-sm">{girl.name || "Girl"}</p>
                </div>
              </div>

              {/* Circular Score (Pure CSS / SVG) */}
              <div className="relative mx-auto flex h-32 w-32 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle
                    className={isDark ? "text-slate-700" : "text-orange-100"}
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-orange-500 transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={`${(result.score / 36) * 264} 264`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="42"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold">{result.score}</span>
                  <span className="text-xs text-slate-400">/36</span>
                </div>
              </div>

              {result.label && (
                <div className="mt-4">
                  <span className={`inline-block rounded-full px-4 py-1.5 text-sm font-bold ${getLabelColor(result.label).bg} ${getLabelColor(result.label).text}`}>
                    {getLabelText(lang, result.label)}
                  </span>
                </div>
              )}

              {result.summary && (
                <p className="mt-4 text-xs leading-relaxed opacity-80 px-2">
                  {result.summary}
                </p>
              )}
            </div>

            {/* 2. Doshas */}
            <div className={`rounded-3xl border p-5 shadow-sm ${cardClass}`}>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-orange-500">
                <ShieldAlert size={18} /> {t("doshaTitle")}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {["manglik", "nadi", "bhakoot"].map((dKey) => {
                  const dosha = result.doshas?.[dKey] || { present: false, cancelled: false, desc: "" };
                  return (
                    <div key={dKey} className={`rounded-2xl border p-3 ${isDark ? "border-slate-700 bg-[#0A0F19]" : "border-orange-100 bg-orange-50/50"}`}>
                      <p className="text-xs font-bold mb-2">{t(dKey)}</p>
                      <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${dosha.present ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-600"}`}>
                        {dosha.present ? t("doshaPresent") : dosha.cancelled ? t("doshaCancelled") : t("doshaAbsent")}
                      </span>
                      {dosha.present && dosha.desc && (
                        <p className="mt-2 text-[10px] leading-tight opacity-70">{dosha.desc}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Strengths */}
            {result.strengths && result.strengths.length > 0 && (
              <div className={`rounded-3xl border p-5 shadow-sm ${cardClass}`}>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-500">
                  <Star size={18} /> {t("strengths")}
                </h3>
                <ul className="space-y-3">
                  {result.strengths.map((s: string, i: number) => (
                    <li key={i} className="flex gap-3 text-xs leading-relaxed">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4. Attention Areas */}
            {result.attention && result.attention.length > 0 && (
              <div className={`rounded-3xl border p-5 shadow-sm ${cardClass}`}>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-amber-500">
                  <AlertCircle size={18} /> {t("attention")}
                </h3>
                <ul className="space-y-3">
                  {result.attention.map((s: string, i: number) => (
                    <li key={i} className="flex gap-3 text-xs leading-relaxed">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 5. Practical Advice */}
            {result.advice && result.advice.length > 0 && (
              <div className={`rounded-3xl border p-5 shadow-sm ${cardClass}`}>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-orange-500">
                  <Sun size={18} /> {t("advice")}
                </h3>
                <ul className="space-y-3">
                  {result.advice.map((s: string, i: number) => (
                    <li key={i} className="flex gap-3 text-xs leading-relaxed">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 6. 8 Gunas Breakdown (Accordion) */}
            <div className={`overflow-hidden rounded-3xl border shadow-sm ${cardClass}`}>
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="flex w-full items-center justify-between p-5 text-sm font-bold"
              >
                <span className="flex items-center gap-2 text-orange-500">
                  <FileText size={18} /> {t("breakdown")}
                </span>
                {showBreakdown ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              {showBreakdown && result.gunas && (
                <div className={`grid grid-cols-2 gap-2 p-5 pt-0`}>
                  {Object.entries(result.gunas).map(([key, guna]: [string, any]) => (
                    <div key={key} className={`rounded-2xl border p-3 ${isDark ? "border-slate-700 bg-[#0A0F19]" : "border-orange-100 bg-orange-50/50"}`}>
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs font-bold capitalize">{key}</p>
                        <p className="text-xs font-bold text-orange-500">{guna.score}/{guna.total}</p>
                      </div>
                      {guna.desc && <p className="text-[10px] opacity-70 leading-tight">{guna.desc}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 7. Ask Questions */}
            <div className={`rounded-3xl border p-5 shadow-sm ${cardClass}`}>
              <h3 className="mb-4 text-sm font-bold">{t("askQ")}</h3>
              <div className="space-y-2">
                {[t("q1"), t("q2"), t("q3")].map((q, i) => (
                  <Link
                    key={i}
                    href="/chat"
                    className={`flex items-center justify-between rounded-xl border p-3 text-xs transition hover:border-orange-500 ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-orange-100 hover:bg-orange-50"}`}
                  >
                    <span>{q}</span>
                    <ArrowRight size={14} className="text-orange-500" />
                  </Link>
                ))}
              </div>
            </div>

            {/* 8. Next Steps */}
            <div className={`rounded-3xl border p-5 shadow-sm ${cardClass}`}>
              <h3 className="mb-4 text-sm font-bold">{t("nextSteps")}</h3>
              <div className="space-y-2">
                <button className="flex w-full items-center justify-between rounded-xl bg-orange-500 p-3 text-xs font-bold text-white transition hover:bg-orange-600">
                  <span className="flex items-center gap-2"><Calendar size={16} /> शुभ विवाह तिथि देखें</span>
                  <ArrowRight size={16} />
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className={`flex items-center justify-between rounded-xl border p-3 text-[11px] font-bold ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-orange-100 hover:bg-orange-50"}`}>
                    दोनों की वर्तमान दशा जानें <ArrowRight size={14} className="text-orange-500" />
                  </button>
                  <button className={`flex items-center justify-between rounded-xl border p-3 text-[11px] font-bold ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-orange-100 hover:bg-orange-50"}`}>
                    PDF डाउनलोड करें <ArrowRight size={14} className="text-orange-500" />
                  </button>
                </div>
                <Link href="/chat" className={`flex items-center justify-between rounded-xl border p-3 text-[11px] font-bold ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-orange-100 hover:bg-orange-50"}`}>
                  ज्योतिषी से बात करें — पहली चैट FREE <ArrowRight size={14} className="text-orange-500" />
                </Link>
              </div>
            </div>

            {/* Banner */}
            <Link href="/chat" className={`flex items-center justify-between rounded-2xl border p-4 ${isDark ? "border-orange-900/50 bg-orange-900/20" : "border-orange-200 bg-orange-50"}`}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-orange-500">{t("bannerTitle")}</p>
                  <p className="text-[11px] opacity-70">{t("bannerSub")}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-orange-500" />
            </Link>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pb-6">
              <button className={`flex items-center justify-center gap-1.5 rounded-xl border py-3 text-xs font-semibold ${isDark ? "border-slate-700" : "border-orange-100"}`}>
                <Share2 size={14} className="text-green-500" /> {t("share")}
              </button>
              <button className={`flex items-center justify-center gap-1.5 rounded-xl border py-3 text-xs font-semibold ${isDark ? "border-slate-700" : "border-orange-100"}`}>
                <Download size={14} className="text-orange-500" /> PDF
              </button>
              <button onClick={handleReset} className={`flex items-center justify-center gap-1.5 rounded-xl border py-3 text-xs font-semibold ${isDark ? "border-slate-700" : "border-orange-100"}`}>
                <RefreshCw size={14} className="text-slate-400" /> {t("reset")}
              </button>
            </div>

            <p className="text-center text-[10px] opacity-50 pb-6 px-4">
              {t("disclaimer")}
            </p>
          </div>
        )}
      </main>

      {/* Limit Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl ${isDark ? "bg-[#151d2c]" : "bg-white"}`}>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20">
              <Lock size={32} className="text-orange-500" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t("limitTitle")}</h3>
            <p className="text-xs opacity-70 mb-6">{t("limitSub")}</p>
            
            <Link
              href="/wallet"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white mb-3 hover:bg-orange-600 transition"
            >
              <Wallet size={18} />
              {t("recharge")}
            </Link>
            <Link
              href="/chat"
              className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold mb-3 ${isDark ? "border-slate-700" : "border-orange-200"}`}
            >
              <MessageCircle size={18} className="text-orange-500" />
              {t("chat")}
            </Link>
            <button
              onClick={() => setShowLimitModal(false)}
              className="w-full py-2 text-xs opacity-60 hover:opacity-100 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className={`fixed bottom-0 left-0 right-0 z-30 border-t ${navBg}`}>
        <div className="mx-auto flex max-w-2xl items-center justify-around py-2">
          <Link href="/" className="flex flex-col items-center gap-0.5 text-[10px] opacity-60 hover:text-orange-500">
            <Home size={18} /> {t("home")}
          </Link>
          <Link href="/chat" className="flex flex-col items-center gap-0.5 text-[10px] opacity-60 hover:text-orange-500">
            <MessageCircle size={18} /> {t("chatNav")}
          </Link>
          <Link href="/matching" className="flex flex-col items-center gap-0.5 text-[10px] text-orange-500">
            <Heart size={18} className="fill-orange-500" /> {t("title")}
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-0.5 text-[10px] opacity-60 hover:text-orange-500">
            <User size={18} /> {t("profile")}
          </Link>
        </div>
      </nav>
    </div>
  );
}

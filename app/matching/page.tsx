// app/matching/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, Heart, Sparkles, MessageCircle, Download,
  ShieldAlert, MapPin, Calendar, Clock, ChevronDown,
  Home, User, Share2, FileText, Star, AlertCircle,
  CheckCircle2, ArrowRight, RefreshCw, Sun
} from "lucide-react";
import Link from "next/link";
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
    },
    te: { title: "కుండలి మిలన్", subtitle: "ఖచ్చితమైన వివాహ మ్యాచింగ్", boy: "అబ్బాయి వివరాలు", girl: "అమ్మాయి వివరాలు", name: "పూర్తి పేరు", city: "పుట్టిన నగరం", matchBtn: "మ్యాచ్ చేయండి", alertCity: "దయచేసి జాబితా నుండి నగరాన్ని ఎంచుకోండి!", result: "మ్యాచింగ్ ఫలితం", total: "/ 36 మొత్తం అష్టకూట్", breakdown: "అన్ని 8 కూటాలు చూడండి", chat: "జ్యోతిష్యుడితో మాట్లాడండి — మొదటి చాట్ FREE", pdf: "PDF", reset: "రీసెట్", share: "WhatsApp లో పంపండి", bannerTitle: "జ్యోతిష్యుడు • 24x7 అందుబాటులో", bannerSub: "మ్యాచ్‌ను లోతుగా అర్థం చేసుకోవడానికి చాట్ చేయండి — FREE", warning: "సరైన మ్యాచ్ అర్థం చేసుకోవడం సంబంధాన్ని బలపరుస్తుంది.", home: "హోమ్", chatNav: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్", doshaTitle: "దోషాలు & నివారణ", strengths: "మీ 3 గొప్ప బలాలు", attention: "శ్రద్ధ వహించవలసిన అంశాలు", advice: "ఆచరణాత్మక సలహా", nextSteps: "తదుపరి అడుగు", soulLabel: "సంబంధ సారాంశం", doshaPresent: "ఉంది", doshaCancelled: "నివారించబడింది", doshaAbsent: "దోషం లేదు", manglik: "మంగళ దోషం", nadi: "నాడి దోషం", bhakoot: "భకూట్ దోషం", disclaimer: "ఈ నివేదిక సాంప్రదాయ వేద జ్యోతిష్యంపై ఆధారపడి ఉంది.", askQ: "ఇంకా తెలుసుకోవాలనుకుంటున్నారా?", q1: "మా పెళ్లికి కుటుంబం సులభంగా అంగీకరిస్తుందా?", q2: "మా జాతకాల ప్రకారం పెళ్లికి శుభ సమయం ఎప్పుడు?", q3: "ఈ సంబంధం కెరీర్ మరియు ధనంపై ఎలా ప్రభావితం చేస్తుంది?", labelUtkrisht: "అద్భుతమైన మ్యాచ్", labelBahutAcha: "చాలా మంచి మ్యాచ్", labelAcha: "మంచి మ్యాచ్", labelAusat: "సగటు మ్యాచ్", labelSudhar: "మెరుగుపరచాల్సిన అవసరం", boyPrefix: "వరుడు", girlPrefix: "వధువు" },
    ta: { title: "ஜாதக பொருத்தம்", subtitle: "துல்லியமான திருமண பொருத்தம்", boy: "ஆண் விவரங்கள்", girl: "பெண் விவரங்கள்", name: "முழு பெயர்", city: "பிறந்த நகரம்", matchBtn: "பொருத்தம் பார்க்க", alertCity: "பட்டியலில் இருந்து நகரத்தை தேர்ந்தெடுக்கவும்!", result: "பொருத்தம் முடிவு", total: "/ 36 மொத்த அஷ்டகூடம்", breakdown: "அனைத்து 8 கூடங்களையும் பார்க்க", chat: "ஜோதிடரிடம் பேசுங்கள் — முதல் அரட்டை FREE", pdf: "PDF", reset: "மீட்டமை", share: "WhatsApp இல் பகிரவும்", bannerTitle: "ஜோதிடர் • 24x7 கிடைக்கும்", bannerSub: "பொருத்தத்தை ஆழமாக புரிந்துகொள்ள அரட்டை செய்யுங்கள் — FREE", warning: "சரியான பொருத்தத்தை புரிந்துகொள்வது உறவை வலுப்படுத்தும்.", home: "முகப்பு", chatNav: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்", doshaTitle: "தோஷங்கள் & நிவாரணம்", strengths: "உங்கள் 3 சிறந்த பலங்கள்", attention: "கவனிக்க வேண்டிய பகுதிகள்", advice: "நடைமுறை ஆலோசனை", nextSteps: "அடுத்த படி", soulLabel: "உறவு சாராம்சம்", doshaPresent: "உள்ளது", doshaCancelled: "நிவாரணம்", doshaAbsent: "தோஷம் இல்லை", manglik: "மாங்கலிக் தோஷம்", nadi: "நாடி தோஷம்", bhakoot: "பகூட் தோஷம்", disclaimer: "இந்த அறிக்கை பாரம்பரிய வேத ஜோதிடத்தை அடிப்படையாகக் கொண்டது.", askQ: "மேலும் அறிய விரும்புகிறீர்களா?", q1: "எங்கள் திருமணத்திற்கு குடும்பம் எளிதில் ஒப்புக்கொள்ளுமா?", q2: "எங்கள் ஜாதகங்களின்படி திருமணத்திற்கு மிக நல்ல நேரம் எப்போது?", q3: "இந்த உறவு தொழில் மற்றும் செல்வத்தை எவ்வாறு பாதிக்கும்?", labelUtkrisht: "சிறந்த பொருத்தம்", labelBahutAcha: "மிக நல்ல பொருத்தம்", labelAcha: "நல்ல பொருத்தம்", labelAusat: "சராசரி பொருத்தம்", labelSudhar: "மேம்பாடு தேவை", boyPrefix: "மணமகன்", girlPrefix: "மணமகள்" },
    kn: { title: "ಕುಂಡಲಿ ಹೊಂದಾಣಿಕೆ", subtitle: "ನಿಖರವಾದ ವಿವಾಹ ಹೊಂದಾಣಿಕೆ", boy: "ಹುಡುಗನ ವಿವರಗಳು", girl: "ಹುಡುಗಿಯ ವಿವರಗಳು", name: "ಪೂರ್ಣ ಹೆಸರು", city: "ಹುಟ್ಟಿದ ನಗರ", matchBtn: "ಹೊಂದಿಸಿ", alertCity: "ದಯವಿಟ್ಟು ಪಟ್ಟಿಯಿಂದ ನಗರವನ್ನು ಆಯ್ಕೆಮಾಡಿ!", result: "ಹೊಂದಾಣಿಕೆಯ ಫಲಿತಾಂಶ", total: "/ 36 ಒಟ್ಟು ಅಷ್ಟಕೂಟ", breakdown: "ಎಲ್ಲಾ 8 ಕೂಟಗಳನ್ನು ನೋಡಿ", chat: "ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ FREE", pdf: "PDF", reset: "ಮರುಹೊಂದಿಸಿ", share: "WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ", bannerTitle: "ಜ್ಯೋತಿಷಿ • 24x7 ಲಭ್ಯವಿದೆ", bannerSub: "ಹೊಂದಾಣಿಕೆಯನ್ನು ಆಳವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಚಾಟ್ ಮಾಡಿ — FREE", warning: "ಸರಿಯಾದ ಹೊಂದಾಣಿಕೆ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು ಸಂಬಂಧವನ್ನು ಬಲಪಡಿಸುತ್ತದೆ.", home: "ಮುಖಪುಟ", chatNav: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್", doshaTitle: "ದೋಷಗಳು & ನಿವಾರಣೆ", strengths: "ನಿಮ್ಮ 3 ಶ್ರೇಷ್ಠ ಶಕ್ತಿಗಳು", attention: "ಗಮನಿಸಬೇಕಾದ ಅಂಶಗಳು", advice: "ಪ್ರಾಯೋಗಿಕ ಸಲಹೆ", nextSteps: "ಮುಂದಿನ ಹೆಜ್ಜೆ", soulLabel: "ಸಂಬಂಧದ ಸಾರಾಂಶ", doshaPresent: "ಇದೆ", doshaCancelled: "ನಿವಾರಣೆ", doshaAbsent: "ದೋಷ ಇಲ್ಲ", manglik: "ಮಾಂಗ್ಲಿಕ್ ದೋಷ", nadi: "ನಾಡಿ ದೋಷ", bhakoot: "ಭಕೂಟ್ ದೋಷ", disclaimer: "ಈ ವರದಿ ಸಾಂಪ್ರದಾಯಿಕ ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯವನ್ನು ಆಧರಿಸಿದೆ.", askQ: "ಇನ್ನಷ್ಟು ತಿಳಿಯಲು ಬಯಸುವಿರಾ?", q1: "ನಮ್ಮ ಮದುವೆಗೆ ಕುಟುಂಬ ಸುಲಭವಾಗಿ ಒಪ್ಪುತ್ತದೆಯೇ?", q2: "ನಮ್ಮ ಜಾತಕದ ಪ್ರಕಾರ ಮದುವೆಗೆ ಶುಭ ಸಮಯ ಯಾವುದು?", q3: "ಈ ಸಂಬಂಧ ವೃತ್ತಿ ಮತ್ತು ಸಂಪತ್ತಿನ ಮೇಲೆ ಹೇಗೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ?", labelUtkrisht: "ಅತ್ಯುತ್ತಮ ಹೊಂದಾಣಿಕೆ", labelBahutAcha: "ಬಹಳ ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ", labelAcha: "ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ", labelAusat: "ಸರಾಸರಿ ಹೊಂದಾಣಿಕೆ", labelSudhar: "ಸುಧಾರಣೆ ಅಗತ್ಯ", boyPrefix: "ವರ", girlPrefix: "ವಧು" },
    bn: { title: "কুণ্ডলী মিলন", subtitle: "সঠিক বিবাহ ম্যাচিং", boy: "ছেলের বিবরণ", girl: "মেয়ের বিবরণ", name: "পুরো নাম", city: "জন্ম শহর", matchBtn: "মিলন করুন", alertCity: "অনুগ্রহ করে তালিকা থেকে শহর নির্বাচন করুন!", result: "মিলন ফলাফল", total: "/ 36 মোট অষ্টকূট", breakdown: "সব ৮টি কূট দেখুন", chat: "জ্যোতিষীর সাথে কথা বলুন — প্রথম চ্যাট FREE", pdf: "PDF", reset: "রিসেট", share: "WhatsApp এ শেয়ার করুন", bannerTitle: "জ্যোতিষী • 24x7 উপলব্ধ", bannerSub: "মিলন গভীরভাবে বুঝতে চ্যাট করুন — FREE", warning: "সঠিক মিলন বুঝলে সম্পর্ক আরও মজবুত হয়।", home: "হোম", chatNav: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল", doshaTitle: "দোষ ও তাদের নিবারণ", strengths: "আপনার ৩টি সেরা শক্তি", attention: "মনোযোগ দেওয়ার বিষয়", advice: "ব্যবহারিক পরামর্শ", nextSteps: "পরবর্তী পদক্ষেপ", soulLabel: "সম্পর্কের সারাংশ", doshaPresent: "উপস্থিত", doshaCancelled: "নিবারিত", doshaAbsent: "কোনো দোষ নেই", manglik: "মাঙ্গলিক দোষ", nadi: "নাড়ি দোষ", bhakoot: "ভকূট দোষ", disclaimer: "এই রিপোর্ট ঐতিহ্যবাহী বৈদিক জ্যোতিষের উপর ভিত্তি করে।", askQ: "আরও জানতে চান?", q1: "আমাদের বিয়েতে পরিবার সহজে রাজি হবে?", q2: "আমাদের কুণ্ডলী অনুযায়ী বিয়ের শুভ সময় কখন?", q3: "এই সম্পর্ক ক্যারিয়ার ও ধনে কী প্রভাব ফেলবে?", labelUtkrisht: "চমৎকার মিলন", labelBahutAcha: "খুব ভালো মিলন", labelAcha: "ভালো মিলন", labelAusat: "গড় মিলন", labelSudhar: "উন্নতি প্রয়োজন", boyPrefix: "বর", girlPrefix: "কনে" },
    mr: { title: "कुंडली मिलन", subtitle: "अचूक विवाह जुळणी", boy: "मुलाचे तपशील", girl: "मुलीचे तपशील", name: "पूर्ण नाव", city: "जन्म शहर", matchBtn: "जुळवा", alertCity: "कृपया यादीतून शहर निवडा!", result: "जुळणी निकाल", total: "/ 36 एकूण अष्टकूट", breakdown: "सर्व 8 कूट पहा", chat: "ज्योतिषाशी बोला — पहिली चॅट FREE", pdf: "PDF", reset: "रीसेट", share: "WhatsApp वर शेअर करा", bannerTitle: "ज्योतिषी • 24x7 उपलब्ध", bannerSub: "जुळणी सखोल समजून घेण्यासाठी चॅट करा — FREE", warning: "योग्य जुळणी समजल्यास नातं अधिक मजबूत होतं.", home: "होम", chatNav: "चॅट", daily: "दैनिक", profile: "प्रोफाइल", doshaTitle: "दोष आणि त्यांचे निवारण", strengths: "तुमच्या 3 सर्वात मोठ्या ताकदी", attention: "लक्ष देण्याच्या गोष्टी", advice: "व्यवहारिक सल्ला", nextSteps: "पुढील पाऊल", soulLabel: "नात्याचा निचरा", doshaPresent: "उपस्थित", doshaCancelled: "निवारित", doshaAbsent: "दोष नाही", manglik: "मांगलिक दोष", nadi: "नाडी दोष", bhakoot: "भकूट दोष", disclaimer: "हा अहवाल पारंपारिक वैदिक ज्योतिषावर आधारित आहे.", askQ: "अजून जाणून घ्यायचंय?", q1: "आमच्या लग्नाला कुटुंब सहज मान्य करेल का?", q2: "आमच्या कुंडलीनुसार लग्नाची सर्वात शुभ वेळ कधी?", q3: "या नात्याचा करिअर आणि पैशावर काय परिणाम होईल?", labelUtkrisht: "उत्कृष्ट जुळणी", labelBahutAcha: "खूप चांगली जुळणी", labelAcha: "चांगली जुळणी", labelAusat: "सरासरी जुळणी", labelSudhar: "सुधारणा आवश्यक", boyPrefix: "वर", girlPrefix: "वधू" },
    gu: { title: "કુંડળી મેળાપ", subtitle: "સચોટ લગ્ન મેચિંગ", boy: "છોકરાની વિગતો", girl: "છોકરીની વિગતો", name: "પૂરું નામ", city: "જન્મ શહેર", matchBtn: "મેળવો", alertCity: "કૃપા કરીને સૂચિમાંથી શહેર પસંદ કરો!", result: "મેચિંગ પરિણામ", total: "/ 36 કુલ અષ્ટકૂટ", breakdown: "બધા 8 કૂટ જુઓ", chat: "જ્યોતિષી સાથે વાત કરો — પ્રથમ ચેટ FREE", pdf: "PDF", reset: "રીસેટ", share: "WhatsApp પર શેર કરો", bannerTitle: "જ્યોતિષી • 24x7 ઉપલબ્ધ", bannerSub: "મેચિંગ ઊંડાણપૂર્વક સમજવા ચેટ કરો — FREE", warning: "યોગ્ય મેચિંગ સમજવાથી સંબંધ વધુ મજબૂત બને છે.", home: "હોમ", chatNav: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ", doshaTitle: "દોષ અને તેમનું નિવારણ", strengths: "તમારી 3 સૌથી મોટી તાકાત", attention: "ધ્યાન આપવાની બાબતો", advice: "વ્યવહારુ સલાહ", nextSteps: "આગળનું પગલું", soulLabel: "સંબંધનો નિચોડ", doshaPresent: "હાજર", doshaCancelled: "નિવારિત", doshaAbsent: "કોઈ દોષ નથી", manglik: "માંગલિક દોષ", nadi: "નાડી દોષ", bhakoot: "ભકૂટ દોષ", disclaimer: "આ રિપોર્ટ પરંપરાગત વૈદિક જ્યોતિષ પર આધારિત છે.", askQ: "વધુ જાણવા માંગો છો?", q1: "અમારા લગ્નમાં પરિવાર સહેલાઈથી માની જશે?", q2: "અમારી કુંડળી મુજબ લગ્નનો સૌથી શુભ સમય ક્યારે?", q3: "આ સંબંધ કરિયર અને ધન પર કેવી અસર કરશે?", labelUtkrisht: "ઉત્કૃષ્ટ મેચિંગ", labelBahutAcha: "ખૂબ સારું મેચિંગ", labelAcha: "સારું મેચિંગ", labelAusat: "સરેરાશ મેચિંગ", labelSudhar: "સુધારાની જરૂર", boyPrefix: "વર", girlPrefix: "વધૂ" },
    ml: { title: "കുണ്ഡലി മാച്ചിംഗ്", subtitle: "കൃത്യമായ വിവാഹ മാച്ചിംഗ്", boy: "ആൺകുട്ടിയുടെ വിവരങ്ങൾ", girl: "പെൺകുട്ടിയുടെ വിവരങ്ങൾ", name: "പൂർണ്ണ നാമം", city: "ജനന നഗരം", matchBtn: "മാച്ച് ചെയ്യുക", alertCity: "ലിസ്റ്റിൽ നിന്ന് ഒരു നഗരം തിരഞ്ഞെടുക്കുക!", result: "മാച്ചിംഗ് ഫലം", total: "/ 36 മൊത്തം അഷ്ടകൂട്ടം", breakdown: "എല്ലാ 8 കൂട്ടങ്ങളും കാണുക", chat: "ജ്യോതിഷിയോട് സംസാരിക്കുക — ആദ്യ ചാറ്റ് FREE", pdf: "PDF", reset: "പുനഃസജ്ജമാക്കുക", share: "WhatsApp ൽ പങ്കിടുക", bannerTitle: "ജ്യോതിഷി • 24x7 ലഭ്യമാണ്", bannerSub: "മാച്ചിംഗ് ആഴത്തിൽ മനസ്സിലാക്കാൻ ചാറ്റ് ചെയ്യുക — FREE", warning: "ശരിയായ മാച്ചിംഗ് മനസ്സിലാക്കുന്നത് ബന്ധം ശക്തമാക്കുന്നു.", home: "ഹോം", chatNav: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ", doshaTitle: "ദോഷങ്ങളും പരിഹാരവും", strengths: "നിങ്ങളുടെ 3 മികച്ച ശക്തികൾ", attention: "ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ", advice: "പ്രായോഗിക ഉപദേശം", nextSteps: "അടുത്ത ഘട്ടം", soulLabel: "ബന്ധത്തിന്റെ സാരാംശം", doshaPresent: "ഉണ്ട്", doshaCancelled: "പരിഹരിച്ചു", doshaAbsent: "ദോഷമില്ല", manglik: "മാംഗ്ലിക് ദോഷം", nadi: "നാഡി ദോഷം", bhakoot: "ഭകൂട്ട് ദോഷം", disclaimer: "ഈ റിപ്പോർട്ട് പരമ്പരാഗത വൈദിക ജ്യോതിഷത്തെ അടിസ്ഥാനമാക്കിയുള്ളതാണ്.", askQ: "കൂടുതൽ അറിയാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?", q1: "ഞങ്ങളുടെ വിവാഹത്തിന് കുടുംബം എളുപ്പത്തിൽ സമ്മതിക്കുമോ?", q2: "ഞങ്ങളുടെ ജാതകം അനുസരിച്ച് വിവാഹത്തിന് ഏറ്റവും ശുഭമായ സമയം എപ്പോൾ?", q3: "ഈ ബന്ധം കരിയറിലും ധനത്തിലും എന്ത് സ്വാധീനം ചെലുത്തും?", labelUtkrisht: "മികച്ച മാച്ചിംഗ്", labelBahutAcha: "വളരെ നല്ല മാച്ചിംഗ്", labelAcha: "നല്ല മാച്ചിംഗ്", labelAusat: "ശരാശരി മാച്ചിംഗ്", labelSudhar: "മെച്ചപ്പെടുത്തൽ ആവശ്യം", boyPrefix: "വരൻ", girlPrefix: "വധു" },
  };
  return ui[lang]?.[key] || ui["en"][key];
};

// ============================================================
// Label helpers (5-band)
// ============================================================
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
// City Input Component
// ============================================================
function CityInput({
  value, setValue, suggestions, setSuggestions, isDark, inputClass, placeholder,
}: any) {
  const searchCity = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`
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

  return (
    <div className="relative">
      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
      <input
        type="text"
        required
        placeholder={placeholder}
        value={value.city}
        onChange={(e) => setValue({ ...value, city: e.target.value, lat: "", lon: "" })}
        className={`${inputClass} pl-10`}
      />
      {suggestions.length > 0 && (
        <ul
          className={`absolute z-20 w-full mt-1 rounded-xl max-h-40 overflow-y-auto shadow-2xl border ${
            isDark ? "bg-[#151d2c] border-slate-700" : "bg-white border-gray-200"
          }`}
        >
          {suggestions.map((item: any) => (
            <li
              key={item.place_id}
              className={`px-4 py-2.5 text-[12px] font-medium cursor-pointer hover:bg-[#ff6b00]/10 ${
                isDark ? "text-slate-200" : "text-slate-800"
              }`}
              onClick={() => {
                setValue({
                  ...value,
                  city: item.display_name.split(",")[0],
                  lat: item.lat,
                  lon: item.lon,
                });
                setSuggestions([]);
              }}
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================
export default function MatchingPage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";

  const [boy, setBoy] = useState({ name: "", dob: "", time: "", city: "", lat: "", lon: "" });
  const [girl, setGirl] = useState({ name: "", dob: "", time: "", city: "", lat: "", lon: "" });

  const [boySuggestions, setBoySuggestions] = useState<any[]>([]);
  const [girlSuggestions, setGirlSuggestions] = useState<any[]>([]);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const t = (key: string) => getUIText(lang, key);

  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark
    ? "border-slate-800 bg-[#151d2c] shadow-lg"
    : "border-amber-100 bg-white shadow-xl";
  const inputClass = `w-full rounded-xl border px-4 py-3.5 text-[14px] font-medium outline-none transition-all focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 ${
    isDark ? "border-slate-700 bg-[#0A0F19] text-white" : "border-gray-200 bg-gray-50 text-slate-900"
  }`;

  // Loading text rotation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      const steps = getLoadingSteps(lang);
      let i = 0;
      setLoadingText(steps[0]);
      interval = setInterval(() => {
        i = (i + 1) % steps.length;
        setLoadingText(steps[i]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading, lang]);

  // Count-up animation for score
  useEffect(() => {
    if (!result) return;
    const target = result.score || 0;
    setDisplayScore(0);
    const duration = 1200;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setDisplayScore(Math.round(target * p));
      if (p >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [result]);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boy.lat || !girl.lat) {
      alert(t("alertCity"));
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boy, girl, language: lang }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResult(data);
      setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        100
      );
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    if (!resultRef.current) return;
    setIsDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: 0.4,
        filename: `${boy.name}_${girl.name}_Milan.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: isDark ? "#0f172a" : "#ffffff" },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };
      await html2pdf().set(opt).from(resultRef.current).save();
    } catch (error) {
      console.error("PDF Error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!result) return;
    const labelText = getLabelText(lang, result.label);
    const text = `${boy.name} ❤️ ${girl.name} — ${result.score}/36 ${labelText}\n\n${result.soulSummary}\n\nMilaap aur upay dekhein.`;
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({
          title: "Kundli Milan",
          text,
          url: window.location.href,
        });
      } else {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text + " " + window.location.href)}`,
          "_blank"
        );
      }
    } catch (e) {
      /* user cancelled */
    }
  };

  const resetForm = () => {
    setBoy({ name: "", dob: "", time: "", city: "", lat: "", lon: "" });
    setGirl({ name: "", dob: "", time: "", city: "", lat: "", lon: "" });
    setResult(null);
    setShowBreakdown(false);
  };

  const suggestedChatPrompt = encodeURIComponent(
    `Namaste, mera (${boy.name}) aur (${girl.name}) ka kundli milan ${result?.score || 0}/36 aaya hai. Kya aap iski gehrai aur upay bata sakti hain?`
  );

  const questionChips = [
    { q: t("q1"), icon: "👨‍👩‍👧" },
    { q: t("q2"), icon: "📅" },
    { q: t("q3"), icon: "💼" },
  ];

  return (
    <main className={`min-h-[100dvh] w-full pb-36 ${pageClass} font-sans`}>
      <div className="w-full px-3 pt-4 space-y-5 flex-1 max-w-2xl mx-auto">
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link
            href="/"
            className={`rounded-xl p-2.5 transition-colors ${
              isDark ? "bg-[#0A0F19] text-slate-300" : "bg-amber-50 text-orange-600"
            }`}
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[17px] font-black uppercase tracking-tight text-[#ff6b00]">
              {t("title")}
            </h1>
            <p className={`text-[11px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              {t("subtitle")}
            </p>
          </div>
        </header>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
            <div className="relative w-28 h-28 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-[#ff6b00]/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#ff6b00] border-t-transparent animate-spin"></div>
              <Heart
                className="absolute inset-0 m-auto text-[#ff6b00] animate-pulse"
                size={36}
                fill="currentColor"
              />
            </div>
            <h2 className="text-xl font-black text-[#ff6b00] mb-2">{t("title")}</h2>
            <p
              className={`text-[13px] font-medium text-center px-4 ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {loadingText}
            </p>
          </div>
        )}

        {/* FORM */}
        {!result && !loading && (
          <>
            <div
              className={`rounded-xl border p-4 ${
                isDark ? "border-amber-500/30 bg-amber-900/10" : "border-amber-200 bg-amber-50"
              }`}
            >
              <p
                className={`flex items-start gap-2 text-[12.5px] font-bold leading-relaxed ${
                  isDark ? "text-amber-200" : "text-amber-800"
                }`}
              >
                <Sparkles size={18} className="shrink-0 mt-0.5" />
                {t("warning")}
              </p>
            </div>

            <form
              onSubmit={handleMatch}
              className={`space-y-5 rounded-[1.5rem] border p-4 sm:p-5 ${cardClass}`}
            >
              {/* BOY */}
              <div
                className={`space-y-3.5 p-4 rounded-2xl border ${
                  isDark ? "border-slate-800 bg-[#0A0F19]/50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <h3 className="text-[14px] font-bold text-[#ff6b00] flex items-center gap-2">
                  <span className="bg-[#ff6b00]/10 p-1.5 rounded-lg text-[16px]">👦</span>
                  {t("boy")}
                </h3>
                <input
                  type="text"
                  required
                  placeholder={t("name")}
                  value={boy.name}
                  onChange={(e) => setBoy({ ...boy, name: e.target.value })}
                  className={inputClass}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Calendar
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 z-10"
                    />
                    <input
                      type="date"
                      required
                      value={boy.dob}
                      onChange={(e) => setBoy({ ...boy, dob: e.target.value })}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                  <div className="relative">
                    <Clock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 z-10"
                    />
                    <input
                      type="time"
                      required
                      value={boy.time}
                      onChange={(e) => setBoy({ ...boy, time: e.target.value })}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
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

              <div className="flex justify-center text-[#ff6b00] py-1">
                <Heart size={26} fill="currentColor" className="animate-pulse drop-shadow-md" />
              </div>

              {/* GIRL */}
              <div
                className={`space-y-3.5 p-4 rounded-2xl border ${
                  isDark ? "border-slate-800 bg-[#0A0F19]/50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <h3 className="text-[14px] font-bold text-pink-600 flex items-center gap-2">
                  <span className="bg-pink-500/10 p-1.5 rounded-lg text-[16px]">👧</span>
                  {t("girl")}
                </h3>
                <input
                  type="text"
                  required
                  placeholder={t("name")}
                  value={girl.name}
                  onChange={(e) => setGirl({ ...girl, name: e.target.value })}
                  className={inputClass}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Calendar
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 z-10"
                    />
                    <input
                      type="date"
                      required
                      value={girl.dob}
                      onChange={(e) => setGirl({ ...girl, dob: e.target.value })}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                  <div className="relative">
                    <Clock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 z-10"
                    />
                    <input
                      type="time"
                      required
                      value={girl.time}
                      onChange={(e) => setGirl({ ...girl, time: e.target.value })}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
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

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#ff6b00] to-amber-600 py-4 text-[15px] font-black text-white shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
              >
                {t("matchBtn")} ✨
              </button>
            </form>
          </>
        )}

        {/* RESULT */}
        {result && !loading && (
          <div ref={resultRef} className="space-y-4 animate-in fade-in">
            {/* CARD 1 — HERO SCORE */}
            <div className={`rounded-2xl border p-6 text-center ${cardClass}`}>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="text-center">
                  <div className="text-[10px] uppercase font-black text-slate-500 tracking-wider">
                    {t("boyPrefix")}
                  </div>
                  <div className="text-[15px] font-black">{boy.name}</div>
                </div>
                <Heart size={20} className="text-[#ff6b00]" fill="currentColor" />
                <div className="text-center">
                  <div className="text-[10px] uppercase font-black text-slate-500 tracking-wider">
                    {t("girlPrefix")}
                  </div>
                  <div className="text-[15px] font-black">{girl.name}</div>
                </div>
              </div>

              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    stroke={isDark ? "#1e293b" : "#f1f5f9"}
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    stroke={getLabelColor(result.label).ring}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(displayScore / 36) * 327} 327`}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-black">{displayScore}</div>
                  <div className="text-[11px] font-bold text-slate-500">/36</div>
                </div>
              </div>

              <div
                className={`inline-block rounded-full px-4 py-1.5 text-[13px] font-black ${
                  getLabelColor(result.label).text
                } ${getLabelColor(result.label).bg} border ${getLabelColor(result.label).border}`}
              >
                {getLabelText(lang, result.label)}
              </div>

              <p
                className={`mt-4 text-[13px] font-semibold leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {result.soulSummary}
              </p>
            </div>

            {/* CARD 2 — DOSHA */}
            <div className={`rounded-2xl border p-4 ${cardClass}`}>
              <h3 className="text-[14px] font-black mb-3 flex items-center gap-2">
                <ShieldAlert size={16} className="text-[#ff6b00]" />
                {t("doshaTitle")}
              </h3>
              <div className="space-y-2.5">
                {(["manglik", "nadi", "bhakoot"] as const).map((key) => {
                  const dosha = result.doshas?.[key];
                  if (!dosha) return null;
                  const statusLabel = !dosha.present
                    ? t("doshaAbsent")
                    : dosha.cancelled
                    ? t("doshaCancelled")
                    : t("doshaPresent");
                  const statusColor = !dosha.present
                    ? "bg-slate-100 text-slate-600 border-slate-200"
                    : dosha.cancelled
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200";
                  const doshaName = t(key as any);
                  return (
                    <div
                      key={key}
                      className={`rounded-xl border p-3 ${
                        isDark
                          ? "border-slate-800 bg-[#0A0F19]/50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] font-black">{doshaName}</span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${statusColor}`}
                        >
                          {statusLabel}
                        </span>
                      </div>
                      {dosha.reason && (
                        <p
                          className={`text-[11.5px] font-medium leading-relaxed ${
                            isDark ? "text-slate-300" : "text-slate-600"
                          }`}
                        >
                          {dosha.reason}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CARD 3a — STRENGTHS */}
            <div className={`rounded-2xl border p-4 ${cardClass}`}>
              <h3 className="text-[14px] font-black mb-3 flex items-center gap-2 text-emerald-600">
                <Star size={16} /> {t("strengths")}
              </h3>
              <ul className="space-y-2">
                {(result.strengths || []).map((s: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[12.5px] font-medium leading-relaxed"
                  >
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className={isDark ? "text-slate-300" : "text-slate-700"}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CARD 3b — ATTENTION */}
            <div className={`rounded-2xl border p-4 ${cardClass}`}>
              <h3 className="text-[14px] font-black mb-3 flex items-center gap-2 text-amber-600">
                <AlertCircle size={16} /> {t("attention")}
              </h3>
              <ul className="space-y-2">
                {(result.attentionAreas || []).map((s: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[12.5px] font-medium leading-relaxed"
                  >
                    <span className="text-amber-500 shrink-0 mt-0.5">◆</span>
                    <span className={isDark ? "text-slate-300" : "text-slate-700"}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CARD 3c — PRACTICAL ADVICE */}
            <div className={`rounded-2xl border p-4 ${cardClass}`}>
              <h3 className="text-[14px] font-black mb-3 flex items-center gap-2 text-[#ff6b00]">
                <Sparkles size={16} /> {t("advice")}
              </h3>
              <ul className="space-y-2">
                {(result.practicalAdvice || []).map((s: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[12.5px] font-medium leading-relaxed"
                  >
                    <span className="text-[#ff6b00] shrink-0 mt-0.5">🙏</span>
                    <span className={isDark ? "text-slate-300" : "text-slate-700"}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CARD 4 — ACCORDION */}
            <div className={`rounded-2xl border p-4 ${cardClass}`}>
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full flex items-center justify-between"
              >
                <h3 className="text-[14px] font-black flex items-center gap-2">
                  <FileText size={16} className="text-[#ff6b00]" />
                  {t("breakdown")}
                </h3>
                <ChevronDown
                  size={18}
                  className={`transition-transform ${showBreakdown ? "rotate-180" : ""}`}
                />
              </button>
              {showBreakdown && (
                <div className="mt-3 space-y-2 animate-in fade-in">
                  {(result.details || []).map((d: any, i: number) => (
                    <div
                      key={i}
                      className={`rounded-lg border p-2.5 flex items-center justify-between ${
                        isDark
                          ? "border-slate-800 bg-[#0A0F19]/50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="text-[12px] font-black">{d.name}</div>
                        {d.meaning && (
                          <div
                            className={`text-[10.5px] ${
                              isDark ? "text-slate-400" : "text-slate-600"
                            }`}
                          >
                            {d.meaning}
                          </div>
                        )}
                      </div>
                      <div className="text-[12px] font-black text-[#ff6b00] ml-3">
                        {d.score}/{d.max}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* QUESTION CHIPS */}
            <div className={`rounded-2xl border p-4 ${cardClass}`}>
              <h3 className="text-[14px] font-black mb-3">{t("askQ")}</h3>
              <div className="space-y-2">
                {questionChips.map((chip, i) => (
                  <Link
                    key={i}
                    href={`/chat?q=${encodeURIComponent(chip.q)}`}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-[12.5px] font-semibold transition-all hover:border-[#ff6b00] hover:bg-[#ff6b00]/5 ${
                      isDark ? "border-slate-700 text-slate-200" : "border-gray-200 text-slate-800"
                    }`}
                  >
                    <span>{chip.icon}</span>
                    <span className="flex-1 text-left">{chip.q}</span>
                    <ArrowRight size={14} className="text-[#ff6b00]" />
                  </Link>
                ))}
              </div>
            </div>

            {/* NEXT STEPS */}
            <div className={`rounded-2xl border p-4 ${cardClass}`}>
              <h3 className="text-[14px] font-black mb-3">{t("nextSteps")}</h3>
              <div className="space-y-2">
                {(result.nextSteps || []).map((step: any, i: number) => {
                  const href =
                    step.action === "chat"
                      ? `/chat?q=${suggestedChatPrompt}`
                      : step.action === "pdf"
                      ? "#"
                      : `/matching?focus=${step.action}`;
                  const isPrimary = step.primary;
                  return (
                    <Link
                      key={i}
                      href={href}
                      onClick={(e) => {
                        if (step.action === "pdf") {
                          e.preventDefault();
                          downloadPdf();
                        }
                      }}
                      className={`flex items-center justify-between rounded-xl p-3.5 text-[13px] font-black transition-all ${
                        isPrimary
                          ? "bg-gradient-to-r from-[#ff6b00] to-amber-600 text-white shadow-lg"
                          : isDark
                          ? "border border-slate-700 text-slate-200"
                          : "border border-gray-200 text-slate-800"
                      }`}
                    >
                      <span>{step.label}</span>
                      <ArrowRight size={16} />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* CHAT BANNER */}
            <Link
              href={`/chat?q=${suggestedChatPrompt}`}
              className="block rounded-2xl border border-[#ff6b00]/30 bg-gradient-to-r from-[#ff6b00]/10 to-amber-100/10 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#ff6b00] rounded-xl p-2.5">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-black text-[#ff6b00]">{t("bannerTitle")}</div>
                  <div
                    className={`text-[11px] font-semibold ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {t("bannerSub")}
                  </div>
                </div>
                <ArrowRight size={16} className="text-[#ff6b00]" />
              </div>
            </Link>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleShare}
                className={`rounded-xl border py-3 text-[11px] font-black flex flex-col items-center gap-1 ${
                  isDark ? "border-slate-700 text-slate-200" : "border-gray-200 text-slate-800"
                }`}
              >
                <Share2 size={18} className="text-emerald-600" />
                {t("share")}
              </button>
              <button
                onClick={downloadPdf}
                disabled={isDownloading}
                className={`rounded-xl border py-3 text-[11px] font-black flex flex-col items-center gap-1 disabled:opacity-50 ${
                  isDark ? "border-slate-700 text-slate-200" : "border-gray-200 text-slate-800"
                }`}
              >
                <Download size={18} className="text-[#ff6b00]" />
                {isDownloading ? "..." : t("pdf")}
              </button>
              <button
                onClick={resetForm}
                className={`rounded-xl border py-3 text-[11px] font-black flex flex-col items-center gap-1 ${
                  isDark ? "border-slate-700 text-slate-200" : "border-gray-200 text-slate-800"
                }`}
              >
                <RefreshCw size={18} className="text-slate-500" />
                {t("reset")}
              </button>
            </div>

            {/* DISCLAIMER */}
            <p
              className={`text-[10.5px] leading-relaxed text-center px-2 ${
                isDark ? "text-slate-500" : "text-slate-500"
              }`}
            >
              {result.disclaimer || t("disclaimer")}
            </p>
          </div>
        )}

        {/* BOTTOM NAV */}
        <nav
          className={`fixed bottom-0 left-0 right-0 z-30 flex justify-around border-t py-2.5 ${
            isDark ? "border-slate-800 bg-[#0A0F19]/95" : "border-amber-100 bg-white/95"
          } backdrop-blur`}
        >
          <Link
            href="/"
            className={`flex flex-col items-center gap-0.5 px-3 ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            <Home size={18} />
            <span className="text-[9.5px] font-bold">{t("home")}</span>
          </Link>
          <Link
            href="/chat"
            className={`flex flex-col items-center gap-0.5 px-3 ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            <MessageCircle size={18} />
            <span className="text-[9.5px] font-bold">{t("chatNav")}</span>
          </Link>
          <Link
            href="/daily"
            className={`flex flex-col items-center gap-0.5 px-3 ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            <Sun size={18} />
            <span className="text-[9.5px] font-bold">{t("daily")}</span>
          </Link>
          <Link
            href="/profile"
            className={`flex flex-col items-center gap-0.5 px-3 ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            <User size={18} />
            <span className="text-[9.5px] font-bold">{t("profile")}</span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
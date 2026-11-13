// app/palmistry/page.tsx
"use client";

import { useRef, useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Hand, MessageCircle, Upload, Star, AlertCircle,
  RefreshCw, Home, Sun, User, Crown, Share2, TrendingUp,
  Heart, Sparkles, CheckCircle2, Lock, Wallet, X, HelpCircle
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

type PalmResult = {
  barnumLines: string[];
  scores: { career: number; love: number; health: number; luck: number };
  lines: { life: string; head: string; heart: string; fate: string };
  mounts: { guru: string; venus: string };
  physical: string;
  freeUpay: string;
  mantra: string;
  suspenseHook: string;
};

// ============================================================
// Loading Steps — 10 Languages
// ============================================================
const getLoadingSteps = (lang: string) => {
  const steps: Record<string, string[]> = {
    hi: ["हथेली की रेखाएं स्कैन हो रही हैं...", "ग्रहों की स्थिति देखी जा रही है...", "भाग्य का विश्लेषण हो रहा है...", "रिपोर्ट तैयार हो रही है..."],
    hinglish: ["Hatheli scan ho rahi hai...", "Planets check kiye ja rahe hain...", "Bhagya decode ho raha hai...", "Report taiyaar ho rahi hai..."],
    en: ["Scanning palm lines...", "Analyzing mount positions...", "Decoding destiny markers...", "Generating Vedic report..."],
    te: ["అరచేతి రేఖలు స్కాన్ అవుతున్నాయి...", "గ్రహాల స్థితి విశ్లేషిస్తోంది...", "విధి విశ్లేషిస్తోంది...", "నివేదిక సిద్ధమవుతోంది..."],
    ta: ["கைரேகைகள் ஸ்கேன் செய்யப்படுகிறது...", "கிரக நிலைகள் ஆராயப்படுகிறது...", "விதி பகுப்பாய்வு செய்யப்படுகிறது...", "அறிக்கை தயாராகிறது..."],
    kn: ["ಹಸ್ತರೇಖೆ ಸ್ಕ್ಯಾನ್ ಆಗುತ್ತಿದೆ...", "ಗ್ರಹಗಳ ಸ್ಥಿತಿ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...", "ಭವಿಷ್ಯ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...", "ವರದಿ ಸಿದ್ಧವಾಗುತ್ತಿದೆ..."],
    bn: ["হাতের রেখা স্ক্যান হচ্ছে...", "গ্রহের অবস্থান বিশ্লেষণ হচ্ছে...", "ভাগ্য বিশ্লেষণ হচ্ছে...", "রিপোর্ট তৈরি হচ্ছে..."],
    mr: ["हस्तरेषा स्कॅन होत आहे...", "ग्रहांची स्थिती तपासत आहे...", "नशीब विश्लेषण करत आहे...", "अहवाल तयार होत आहे..."],
    gu: ["હસ્તરેખા સ્કેન થઈ રહી છે...", "ગ્રહોની સ્થિતિ તપાસાઈ રહી છે...", "ભાગ્ય વિશ્લેષણ થઈ રહ્યું છે...", "રિપોર્ટ તૈયાર થઈ રહ્યો છે..."],
    ml: ["കൈരേഖ സ്കാൻ ചെയ്യുന്നു...", "ഗ്രഹങ്ങളുടെ സ്ഥിതി പരിശോധിക്കുന്നു...", "വിധി വിശകലനം ചെയ്യുന്നു...", "റിപ്പോർട്ട് തയ്യാറാക്കുന്നു..."],
  };
  return steps[lang] || steps["hinglish"];
};

// ============================================================
// UI Text — 10 Languages (with Limit & Chat Keys)
// ============================================================
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: {
      title: "हस्तरेखा", subtitle: "हथेली का विश्लेषण", free: "FREE",
      errorTitle: "Error", errSize: "फोटो 10MB से छोटी होनी चाहिए।", errType: "सिर्फ JPG, PNG या WEBP फोटो अपलोड करें।", errNotPalm: "कृपया हथेली की साफ़ फोटो अपलोड करें।",
      uploadTitle: "हथेली की फोटो अपलोड करें", uploadDesc: "हथेली की रेखाएं आपके भविष्य का राज बताती हैं।", chooseBtn: "फोटो चुनें", complete: "विश्लेषण पूरा हुआ",
      talkAstro: "ज्योतिषी से बात करें — FREE", tryAnother: "दूसरी फोटो अपलोड करें", bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "अपनी समस्या का समाधान पाएं – पहली चैट FREE",
      home: "होम", chat: "चैट", daily: "राशिफल", profile: "प्रोफाइल",
      genderTitle: "आपका लिंग", male: "पुरुष", female: "महिला", other: "अन्य", handTitle: "कौन सा हाथ?", left: "बायां", right: "दायां", handHint: "सामुद्रिक शास्त्र में पुरुष का दायां, महिला का बायां हाथ मुख्य माना जाता है।", selectFirst: "पहले लिंग और हाथ चुनें",
      reportTitle: "आपकी हस्तरेखा रिपोर्ट", scoresTitle: "जीवन के 4 आयाम", career: "करियर व धन", love: "प्यार व शादी", health: "स्वास्थ्य", luck: "भाग्य",
      linesTitle: "मुख्य रेखाएं", lifeLine: "जीवन रेखा", headLine: "मस्तिष्क रेखा", heartLine: "हृदय रेखा", fateLine: "भाग्य रेखा",
      mountsTitle: "पर्वतों की स्थिति", guruMount: "गुरु पर्वत", venusMount: "शुक्र पर्वत", physicalTitle: "हथेली की बनावट",
      upayTitle: "आपके लिए एक सरल उपाय", upaySub: "बिना किसी खर्च के", suspenseTitle: "एक विशेष संकेत", share: "WhatsApp पर भेजें",
      trackerTitle: "30-दिन प्रगति ट्रैकर", trackerBody: "हस्तरेखा शास्त्र कहता है — कर्म से रेखाएं बदलती हैं। ऊपर दिए उपाय रोज़ करें और 30 दिन बाद अपनी हथेली दोबारा स्कैन करें।", setReminder: "रिमाइंडर सेट करें",
      disclaimer: "यह रिपोर्ट पारंपरिक सामुद्रिक शास्त्र पर आधारित है। यह मार्गदर्शन है, चिकित्सीय या कानूनी सलाह नहीं।",
      limitTitle: "आपकी फ्री लिमिट खत्म हो गई है!", limitSub: "अधिक स्कैन और गहरी जानकारी के लिए ज्योतिषी से बात करें या वॉलेट रिचार्ज करें।", chatFree: "ज्योतिषी से फ्री बात करें", recharge: "वॉलेट रिचार्ज करें", close: "बंद करें", chatNow: "इस रिपोर्ट पर ज्योतिषी से बात करें"
    },
    hinglish: {
      title: "Palmistry", subtitle: "Palm Analysis", free: "FREE",
      errorTitle: "Error", errSize: "Photo 10MB se chhoti honi chahiye.", errType: "Sirf JPG, PNG ya WEBP upload karein.", errNotPalm: "Kripya hatheli ki saaf photo upload karein.",
      uploadTitle: "Apni hatheli ki photo upload karein", uploadDesc: "Hatheli ki rekhaayein aapke bhavishya ka raaj batati hain.", chooseBtn: "Choose Photo", complete: "Analysis Complete",
      talkAstro: "Talk to Astrologer — FREE", tryAnother: "Try another photo", bannerTitle: "Astrologer - 24x7 Available", bannerSub: "Apni samasya ka samadhan paayein – Pehli Chat FREE",
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile",
      genderTitle: "Aapka Gender", male: "Male", female: "Female", other: "Other", handTitle: "Kaun sa haath?", left: "Left", right: "Right", handHint: "Samudrik shastra mein male ka right, female ka left haath primary hai.", selectFirst: "Pehle gender aur haath chunein",
      reportTitle: "Aapki Hastarekha Report", scoresTitle: "Jeevan ke 4 Aayam", career: "Career & Wealth", love: "Love & Marriage", health: "Health", luck: "Luck Factor",
      linesTitle: "Mukhya Rekhayein", lifeLine: "Jeevan Rekha", headLine: "Mastishk Rekha", heartLine: "Hriday Rekha", fateLine: "Bhagya Rekha",
      mountsTitle: "Parvaton ki Sthiti", guruMount: "Guru Parvat", venusMount: "Shukra Parvat", physicalTitle: "Hatheli ki Banaawat",
      upayTitle: "Aapke liye ek saral upay", upaySub: "Bina kisi kharch ke", suspenseTitle: "Ek vishesh sanket", share: "WhatsApp par bhejein",
      trackerTitle: "30-Din Progress Tracker", trackerBody: "Hastarekha shastra kehta hai — karm se rekhayein badalti hain. Upar diye upay roz karein aur 30 din baad apni hatheli dobara scan karein.", setReminder: "Reminder set karein",
      disclaimer: "Yeh report traditional Samudrik Shastra par aadharit hai. Yeh guidance hai, medical ya legal advice nahi.",
      limitTitle: "Aapki Free Limit Khatam Ho Gayi Hai!", limitSub: "Aage ki jankari ke liye jyotishi se baat karein ya wallet recharge karein.", chatFree: "Jyotishi se Free baat karein", recharge: "Wallet Recharge", close: "Band karein", chatNow: "Is report par jyotishi se baat karein"
    },
    en: {
      title: "Palmistry", subtitle: "Palm Analysis", free: "FREE",
      errorTitle: "Error", errSize: "Photo must be under 10MB.", errType: "Only JPG, PNG or WEBP are supported.", errNotPalm: "Please upload a clear palm photo.",
      uploadTitle: "Upload your palm photo", uploadDesc: "Your palm lines reveal the secrets of your future.", chooseBtn: "Choose Photo", complete: "Analysis Complete",
      talkAstro: "Talk to Astrologer — FREE", tryAnother: "Try another photo", bannerTitle: "Astrologer - 24x7 Available", bannerSub: "Get solutions to your problems – First Chat FREE",
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile",
      genderTitle: "Your Gender", male: "Male", female: "Female", other: "Other", handTitle: "Which hand?", left: "Left", right: "Right", handHint: "In Samudrik tradition, male → right hand, female → left hand is primary.", selectFirst: "Please select gender and hand first",
      reportTitle: "Your Palmistry Report", scoresTitle: "4 Dimensions of Life", career: "Career & Wealth", love: "Love & Marriage", health: "Health", luck: "Luck Factor",
      linesTitle: "Main Lines", lifeLine: "Life Line", headLine: "Head Line", heartLine: "Heart Line", fateLine: "Fate Line",
      mountsTitle: "Mounts", guruMount: "Jupiter Mount", venusMount: "Venus Mount", physicalTitle: "Palm Structure",
      upayTitle: "A simple remedy for you", upaySub: "No cost involved", suspenseTitle: "A special hint", share: "Share on WhatsApp",
      trackerTitle: "30-Day Progress Tracker", trackerBody: "Palmistry says — lines change with karma. Do the remedies daily and rescan your palm after 30 days.", setReminder: "Set reminder",
      disclaimer: "This report is based on traditional Samudrik Shastra. It is guidance, not medical or legal advice.",
      limitTitle: "Your Free Limit is Exhausted!", limitSub: "Talk to an astrologer for deeper insights or recharge your wallet.", chatFree: "Chat with Astrologer FREE", recharge: "Recharge Wallet", close: "Close", chatNow: "Talk to Astrologer about this"
    },
    te: { title: "హస్తరేఖ", subtitle: "అరచేతి విశ్లేషణ", free: "ఉచితం", errorTitle: "లోపం", errSize: "ఫోటో 10MB కంటే తక్కువ ఉండాలి.", errType: "JPG, PNG లేదా WEBP మాత్రమే.", errNotPalm: "దయచేసి స్పష్టమైన అరచేతి ఫోటో అప్‌లోడ్ చేయండి.", uploadTitle: "మీ అరచేతి ఫోటో అప్‌లోడ్ చేయండి", uploadDesc: "అరచేతి రేఖలు మీ భవిష్యత్తు రహస్యాలను వెల్లడిస్తాయి.", chooseBtn: "ఫోటో ఎంచుకోండి", complete: "విశ్లేషణ పూర్తయింది", talkAstro: "జ్యోతిష్యుడితో మాట్లాడండి — ఉచితం", tryAnother: "మరో ఫోటో ప్రయత్నించండి", bannerTitle: "జ్యోతిష్యుడు - 24x7 అందుబాటులో", bannerSub: "ఇప్పుడే మాట్లాడండి — మొదటి చాట్ ఉచితం", home: "హోమ్", chat: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్", genderTitle: "మీ లింగం", male: "పురుషుడు", female: "స్త్రీ", other: "ఇతర", handTitle: "ఏ చేయి?", left: "ఎడమ", right: "కుడి", handHint: "పురుషులకు కుడి చేయి, స్త్రీలకు ఎడమ చేయి ప్రధానం.", selectFirst: "మొదట లింగం మరియు చేయి ఎంచుకోండి", reportTitle: "మీ హస్తరేఖ నివేదిక", scoresTitle: "జీవితంలోని 4 కోణాలు", career: "కెరీర్ & సంపద", love: "ప్రేమ & వివాహం", health: "ఆరోగ్యం", luck: "అదృష్టం", linesTitle: "ప్రధాన రేఖలు", lifeLine: "జీవన రేఖ", headLine: "తల రేఖ", heartLine: "హృదయ రేఖ", fateLine: "విధి రేఖ", mountsTitle: "పర్వతాల స్థితి", guruMount: "గురు పర్వతం", venusMount: "శుక్ర పర్వతం", physicalTitle: "అరచేతి నిర్మాణం", upayTitle: "మీ కోసం ఒక సులభ పరిహారం", upaySub: "ఎటువంటి ఖర్చు లేకుండా", suspenseTitle: "ఒక ప్రత్యేక సూచన", share: "WhatsApp లో పంచుకోండి", trackerTitle: "30-రోజుల పురోగతి ట్రాకర్", trackerBody: "కర్మతో రేఖలు మారుతాయి. పరిహారాలు చేసి 30 రోజుల తర్వాత మళ్లీ స్కాన్ చేయండి.", setReminder: "రిమైండర్ సెట్ చేయండి", disclaimer: "ఈ నివేదిక సాంప్రదాయ సాముద్రిక శాస్త్రంపై ఆధారపడి ఉంది.", limitTitle: "మీ ఉచిత పరిమితి ముగిసింది!", limitSub: "మరింత సమాచారం కోసం జ్యోతిష్యుడిని సంప్రదించండి.", chatFree: "ఉచితంగా మాట్లాడండి", recharge: "వాలెట్ రీఛార్జ్", close: "మూసివేయి", chatNow: "ఈ నివేదిక గురించి జ్యోతిష్యుడితో మాట్లాడండి" },
    ta: { title: "கைரேகை", subtitle: "உள்ளங்கை பகுப்பாய்வு", free: "இலவசம்", errorTitle: "பிழை", errSize: "புகைப்படம் 10MB க்குள் இருக்க வேண்டும்.", errType: "JPG, PNG அல்லது WEBP மட்டும்.", errNotPalm: "தெளிவான உள்ளங்கை புகைப்படத்தை பதிவேற்றவும்.", uploadTitle: "உங்கள் உள்ளங்கை புகைப்படத்தை பதிவேற்றவும்", uploadDesc: "கைரேகைகள் உங்கள் எதிர்கால ரகசியங்களை வெளிப்படுத்துகின்றன.", chooseBtn: "புகைப்படத்தை தேர்ந்தெடு", complete: "பகுப்பாய்வு முடிந்தது", talkAstro: "ஜோதிடரிடம் பேசுங்கள் — இலவசம்", tryAnother: "மற்றொரு புகைப்படத்தை முயற்சிக்கவும்", bannerTitle: "ஜோதிடர் - 24x7 கிடைக்கும்", bannerSub: "இப்போது பேசுங்கள் — முதல் அரட்டை இலவசம்", home: "முகப்பு", chat: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்", genderTitle: "உங்கள் பாலினம்", male: "ஆண்", female: "பெண்", other: "மற்றவை", handTitle: "எந்த கை?", left: "இடது", right: "வலது", handHint: "ஆண்களுக்கு வலது கை, பெண்களுக்கு இடது கை முதன்மையானது.", selectFirst: "முதலில் பாலினம் மற்றும் கையை தேர்ந்தெடுக்கவும்", reportTitle: "உங்கள் கைரேகை அறிக்கை", scoresTitle: "வாழ்க்கையின் 4 பரிமாணங்கள்", career: "தொழில் & செல்வம்", love: "காதல் & திருமணம்", health: "ஆரோக்கியம்", luck: "அதிர்ஷ்டம்", linesTitle: "முக்கிய கோடுகள்", lifeLine: "ஆயுள் கோடு", headLine: "தலை கோடு", heartLine: "இதய கோடு", fateLine: "விதி கோடு", mountsTitle: "மலைகளின் நிலை", guruMount: "குரு மலை", venusMount: "சுக்கிரன் மலை", physicalTitle: "உள்ளங்கை அமைப்பு", upayTitle: "உங்களுக்கான எளிய பரிகாரம்", upaySub: "எந்த செலவும் இல்லாமல்", suspenseTitle: "ஒரு சிறப்பு குறிப்பு", share: "WhatsApp இல் பகிரவும்", trackerTitle: "30-நாள் முன்னேற்ற டிராக்கர்", trackerBody: "கர்மாவால் கோடுகள் மாறும். பரிகாரங்களை செய்து 30 நாட்களுக்குப் பிறகு மீண்டும் ஸ்கேன் செய்யவும்.", setReminder: "நினைவூட்டல் அமைக்கவும்", disclaimer: "இந்த அறிக்கை பாரம்பரிய சாமுத்ரிகா சாஸ்திரத்தை அடிப்படையாகக் கொண்டது.", limitTitle: "உங்கள் இலவச வரம்பு முடிந்தது!", limitSub: "மேலும் அறிய ஜோதிடரை அணுகவும்.", chatFree: "இலவசமாக பேசுங்கள்", recharge: "வாலெட் ரீசார்ஜ்", close: "மூடு", chatNow: "இந்த அறிக்கை பற்றி ஜோதிடரிடம் பேசுங்கள்" },
    kn: { title: "ಹಸ್ತರೇಖೆ", subtitle: "ಅಂಗೈ ವಿಶ್ಲೇಷಣೆ", free: "ಉಚಿತ", errorTitle: "ದೋಷ", errSize: "ಫೋಟೋ 10MB ಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.", errType: "JPG, PNG ಅಥವಾ WEBP ಮಾತ್ರ.", errNotPalm: "ಸ್ಪಷ್ಟವಾದ ಅಂಗೈ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.", uploadTitle: "ನಿಮ್ಮ ಅಂಗೈ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", uploadDesc: "ಅಂಗೈ ರೇಖೆಗಳು ನಿಮ್ಮ ಭವಿಷ್ಯದ ರಹಸ್ಯಗಳನ್ನು ಬಹಿರಂಗಪಡಿಸುತ್ತವೆ.", chooseBtn: "ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ", complete: "ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ", talkAstro: "ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ — ಉಚಿತ", tryAnother: "ಇನ್ನೊಂದು ಫೋಟೋ ಪ್ರಯತ್ನಿಸಿ", bannerTitle: "ಜ್ಯೋತಿಷಿ - 24x7 ಲಭ್ಯವಿದೆ", bannerSub: "ಈಗ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ", home: "ಮುಖಪುಟ", chat: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್", genderTitle: "ನಿಮ್ಮ ಲಿಂಗ", male: "ಪುರುಷ", female: "ಮಹಿಳೆ", other: "ಇತರೆ", handTitle: "ಯಾವ ಕೈ?", left: "ಎಡ", right: "ಬಲ", handHint: "ಪುರುಷರಿಗೆ ಬಲ ಕೈ, ಮಹಿಳೆಯರಿಗೆ ಎಡ ಕೈ ಪ್ರಧಾನ.", selectFirst: "ಮೊದಲು ಲಿಂಗ ಮತ್ತು ಕೈ ಆಯ್ಕೆಮಾಡಿ", reportTitle: "ನಿಮ್ಮ ಹಸ್ತರೇಖೆ ವರದಿ", scoresTitle: "ಜೀವನದ 4 ಆಯಾಮಗಳು", career: "ವೃತ್ತಿ & ಸಂಪತ್ತು", love: "ಪ್ರೀತಿ & ವಿವಾಹ", health: "ಆರೋಗ್ಯ", luck: "ಅದೃಷ್ಟ", linesTitle: "ಮುಖ್ಯ ರೇಖೆಗಳು", lifeLine: "ಜೀವನ ರೇಖೆ", headLine: "ತಲೆ ರೇಖೆ", heartLine: "ಹೃದಯ ರೇಖೆ", fateLine: "ವಿಧಿ ರೇಖೆ", mountsTitle: "ಪರ್ವತಗಳ ಸ್ಥಿತಿ", guruMount: "ಗುರು ಪರ್ವತ", venusMount: "ಶುಕ್ರ ಪರ್ವತ", physicalTitle: "ಅಂಗೈ ರಚನೆ", upayTitle: "ನಿಮಗಾಗಿ ಸರಳ ಪರಿಹಾರ", upaySub: "ಯಾವುದೇ ಖರ್ಚಿಲ್ಲದೆ", suspenseTitle: "ವಿಶೇಷ ಸೂಚನೆ", share: "WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ", trackerTitle: "30-ದಿನಗಳ ಪ್ರಗತಿ ಟ್ರ್ಯಾಕರ್", trackerBody: "ಕರ್ಮದಿಂದ ರೇಖೆಗಳು ಬದಲಾಗುತ್ತವೆ. ಪರಿಹಾರಗಳನ್ನು ಮಾಡಿ 30 ದಿನಗಳ ನಂತರ ಮತ್ತೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ.", setReminder: "ಜ್ಞಾಪನೆ ಹೊಂದಿಸಿ", disclaimer: "ಈ ವರದಿಯು ಸಾಂಪ್ರದಾಯಿಕ ಸಾಮುದ್ರಿಕ ಶಾಸ್ತ್ರವನ್ನು ಆಧರಿಸಿದೆ.", limitTitle: "ನಿಮ್ಮ ಉಚಿತ ಮಿತಿ ಮುಗಿದಿದೆ!", limitSub: "ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.", chatFree: "ಉಚಿತವಾಗಿ ಮಾತನಾಡಿ", recharge: "ವಾಲೆಟ್ ರೀಚಾರ್ಜ್", close: "ಮುಚ್ಚಿ", chatNow: "ಈ ವರದಿ ಬಗ್ಗೆ ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ" },
    bn: { title: "হস্তরেখা", subtitle: "হাতের তালু বিশ্লেষণ", free: "ফ্রি", errorTitle: "ত্রুটি", errSize: "ছবি 10MB এর কম হতে হবে।", errType: "শুধুমাত্র JPG, PNG বা WEBP।", errNotPalm: "একটি পরিষ্কার হাতের তালুর ছবি আপলোড করুন।", uploadTitle: "আপনার হাতের তালুর ছবি আপলোড করুন", uploadDesc: "হাতের রেখা আপনার ভবিষ্যতের গোপনীয়তা প্রকাশ করে।", chooseBtn: "ছবি চয়ন করুন", complete: "বিশ্লেষণ সম্পন্ন", talkAstro: "জ্যোতিষীর সাথে কথা বলুন — ফ্রি", tryAnother: "অন্য ছবি চেষ্টা করুন", bannerTitle: "জ্যোতিষী - 24x7 উপলব্ধ", bannerSub: "এখনই কথা বলুন — প্রথম চ্যাট ফ্রি", home: "হোম", chat: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল", genderTitle: "আপনার লিঙ্গ", male: "পুরুষ", female: "মহিলা", other: "অন্যান্য", handTitle: "কোন হাত?", left: "বাম", right: "ডান", handHint: "পুরুষদের জন্য ডান হাত, মহিলাদের জন্য বাম হাত প্রধান।", selectFirst: "প্রথমে লিঙ্গ এবং হাত নির্বাচন করুন", reportTitle: "আপনার হস্তরেখা রিপোর্ট", scoresTitle: "জীবনের ৪টি মাত্রা", career: "ক্যারিয়ার ও সম্পদ", love: "ভালোবাসা ও বিবাহ", health: "স্বাস্থ্য", luck: "ভাগ্য", linesTitle: "প্রধান রেখা", lifeLine: "জীবন রেখা", headLine: "মস্তিষ্ক রেখা", heartLine: "হৃদয় রেখা", fateLine: "ভাগ্য রেখা", mountsTitle: "পর্বতের অবস্থা", guruMount: "গুরু পর্বত", venusMount: "শুক্র পর্বত", physicalTitle: "হাতের তালুর গঠন", upayTitle: "আপনার জন্য একটি সহজ প্রতিকার", upaySub: "কোন খরচ ছাড়াই", suspenseTitle: "একটি বিশেষ ইঙ্গিত", share: "WhatsApp এ শেয়ার করুন", trackerTitle: "30-দিনের অগ্রগতি ট্র্যাকার", trackerBody: "কর্মের দ্বারা রেখা পরিবর্তিত হয়। প্রতিকারগুলি করুন এবং 30 দিন পরে আবার স্ক্যান করুন।", setReminder: "রিমাইন্ডার সেট করুন", disclaimer: "এই রিপোর্টটি ঐতিহ্যবাহী সামুদ্রিক শাস্ত্রের উপর ভিত্তি করে।", limitTitle: "আপনার ফ্রি সীমা শেষ!", limitSub: "আরও জানতে জ্যোতিষীর সাথে কথা বলুন।", chatFree: "ফ্রি চ্যাট করুন", recharge: "ওয়ালেট রিচার্জ", close: "বন্ধ করুন", chatNow: "এই রিপোর্ট সম্পর্কে জ্যোতিষীর সাথে কথা বলুন" },
    mr: { title: "हस्तरेषा", subtitle: "तळहाताचे विश्लेषण", free: "मोफत", errorTitle: "त्रुटी", errSize: "फोटो 10MB पेक्षा लहान असावा.", errType: "फक्त JPG, PNG किंवा WEBP.", errNotPalm: "कृपया तळहाताचा स्पष्ट फोटो अपलोड करा.", uploadTitle: "तुमच्या तळहाताचा फोटो अपलोड करा", uploadDesc: "हस्तरेषा तुमच्या भविष्यातील रहस्ये सांगतात.", chooseBtn: "फोटो निवडा", complete: "विश्लेषण पूर्ण", talkAstro: "ज्योतिषाशी बोला — मोफत", tryAnother: "दुसरा फोटो वापरून पहा", bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "आता बोला — पहिली चॅट मोफत", home: "होम", chat: "चॅट", daily: "दैनिक", profile: "प्रोफाइल", genderTitle: "तुमचे लिंग", male: "पुरुष", female: "स्त्री", other: "इतर", handTitle: "कोणता हात?", left: "डावा", right: "उजवा", handHint: "पुरुषांसाठी उजवा हात, स्त्रियांसाठी डावा हात मुख्य आहे.", selectFirst: "प्रथम लिंग आणि हात निवडा", reportTitle: "तुमचा हस्तरेषा अहवाल", scoresTitle: "जीवनाचे 4 आयाम", career: "करिअर आणि संपत्ती", love: "प्रेम आणि विवाह", health: "आरोग्य", luck: "नशीब", linesTitle: "मुख्य रेषा", lifeLine: "जीवन रेषा", headLine: "मस्तिष्क रेषा", heartLine: "हृदय रेषा", fateLine: "नशीब रेषा", mountsTitle: "पर्वतांची स्थिती", guruMount: "गुरु पर्वत", venusMount: "शुक्र पर्वत", physicalTitle: "तळहाताची रचना", upayTitle: "तुमच्यासाठी एक सोपा उपाय", upaySub: "कोणत्याही खर्चाशिवाय", suspenseTitle: "एक विशेष संकेत", share: "WhatsApp वर शेअर करा", trackerTitle: "30-दिवस प्रगती ट्रॅकर", trackerBody: "कर्माने रेषा बदलतात. उपाय करा आणि 30 दिवसांनंतर पुन्हा स्कॅन करा.", setReminder: "स्मरणपत्र सेट करा", disclaimer: "हा अहवाल पारंपारिक सामुद्रिक शास्त्रावर आधारित आहे.", limitTitle: "तुमची मोफत मर्यादा संपली आहे!", limitSub: "अधिक माहितीसाठी ज्योतिषाशी बोला.", chatFree: "मोफत बोला", recharge: "वॉलेट रिचार्ज", close: "बंद करा", chatNow: "या अहवालाबद्दल ज्योतिषाशी बोला" },
    gu: { title: "હસ્તરેખા", subtitle: "હથેળી વિશ્લેષણ", free: "મફત", errorTitle: "ભૂલ", errSize: "ફોટો 10MB થી ઓછો હોવો જોઈએ.", errType: "ફક્ત JPG, PNG અથવા WEBP.", errNotPalm: "કૃપા કરીને સ્પષ્ટ હથેળીનો ફોટો અપલોડ કરો.", uploadTitle: "તમારી હથેળીનો ફોટો અપલોડ કરો", uploadDesc: "હસ્તરેખાઓ તમારા ભવિષ્યના રહસ્યો જણાવે છે.", chooseBtn: "ફોટો પસંદ કરો", complete: "વિશ્લેષણ પૂર્ણ", talkAstro: "જ્યોતિષી સાથે વાત કરો — મફત", tryAnother: "બીજો ફોટો પ્રયાસ કરો", bannerTitle: "જ્યોતિષી - 24x7 ઉપલબ્ધ", bannerSub: "હમણાં વાત કરો — પ્રથમ ચેટ મફત", home: "હોમ", chat: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ", genderTitle: "તમારું લિંગ", male: "પુરુષ", female: "સ્ત્રી", other: "અન્ય", handTitle: "કયો હાથ?", left: "ડાબો", right: "જમણો", handHint: "પુરુષો માટે જમણો હાથ, સ્ત્રીઓ માટે ડાબો હાથ મુખ્ય છે.", selectFirst: "પહેલા લિંગ અને હાથ પસંદ કરો", reportTitle: "તમારો હસ્તરેખા રિપોર્ટ", scoresTitle: "જીવનના 4 પરિમાણ", career: "કારકિર્દી અને સંપત્તિ", love: "પ્રેમ અને લગ્ન", health: "સ્વાસ્થ્ય", luck: "ભાગ્ય", linesTitle: "મુખ્ય રેખાઓ", lifeLine: "જીવન રેખા", headLine: "મગજ રેખા", heartLine: "હૃદય રેખા", fateLine: "ભાગ્ય રેખા", mountsTitle: "પર્વતોની સ્થિતિ", guruMount: "ગુરુ પર્વત", venusMount: "શુક્ર પર્વત", physicalTitle: "હથેળીની રચના", upayTitle: "તમારા માટે એક સરળ ઉપાય", upaySub: "કોઈ ખર્ચ વિના", suspenseTitle: "એક ખાસ સંકેત", share: "WhatsApp પર શેર કરો", trackerTitle: "30-દિવસ પ્રગતિ ટ્રેકર", trackerBody: "કર્મથી રેખાઓ બદલાય છે. ઉપાય કરો અને 30 દિવસ પછી ફરી સ્કેન કરો.", setReminder: "રિમાઇન્ડર સેટ કરો", disclaimer: "આ રિપોર્ટ પરંપરાગત સામુદ્રિક શાસ્ત્ર પર આધારિત છે.", limitTitle: "તમારી મફત મર્યાદા સમાપ્ત થઈ ગઈ છે!", limitSub: "વધુ માહિતી માટે જ્યોતિષી સાથે વાત કરો.", chatFree: "મફત વાત કરો", recharge: "વોલેટ રિચાર્જ", close: "બંધ કરો", chatNow: "આ રિપોર્ટ વિશે જ્યોતિષી સાથે વાત કરો" },
    ml: { title: "കൈരേഖ", subtitle: "കൈപ്പത്തി വിശകലനം", free: "സൗജന്യം", errorTitle: "പിശക്", errSize: "ഫോട്ടോ 10MB-യിൽ കുറവായിരിക്കണം.", errType: "JPG, PNG അല്ലെങ്കിൽ WEBP മാത്രം.", errNotPalm: "വ്യക്തമായ കൈപ്പത്തി ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.", uploadTitle: "നിങ്ങളുടെ കൈപ്പത്തിയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക", uploadDesc: "കൈരേഖകൾ നിങ്ങളുടെ ഭാവിയുടെ രഹസ്യങ്ങൾ വെളിപ്പെടുത്തുന്നു.", chooseBtn: "ഫോട്ടോ തിരഞ്ഞെടുക്കുക", complete: "വിശകലനം പൂർത്തിയായി", talkAstro: "ജ്യോതിഷിയോട് സംസാരിക്കുക — സൗജന്യം", tryAnother: "മറ്റൊരു ഫോട്ടോ പരീക്ഷിക്കുക", bannerTitle: "ജ്യോതിഷി - 24x7 ലഭ്യമാണ്", bannerSub: "ഇപ്പോൾ സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം", home: "ഹോം", chat: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ", genderTitle: "നിങ്ങളുടെ ലിംഗഭേദം", male: "പുരുഷൻ", female: "സ്ത്രീ", other: "മറ്റുള്ളവർ", handTitle: "ഏത് കൈ?", left: "ഇടത്", right: "വലത്", handHint: "പുരുഷന്മാർക്ക് വലത് കൈ, സ്ത്രീകൾക്ക് ഇടത് കൈ പ്രധാനമാണ്.", selectFirst: "ആദ്യം ലിംഗഭേദവും കൈയും തിരഞ്ഞെടുക്കുക", reportTitle: "നിങ്ങളുടെ കൈരേഖ റിപ്പോർട്ട്", scoresTitle: "ജീവിതത്തിന്റെ 4 അളവുകൾ", career: "കരിയർ & സമ്പത്ത്", love: "സ്നേഹം & വിവാഹം", health: "ആരോഗ്യം", luck: "ഭാഗ്യം", linesTitle: "പ്രധാന രേഖകൾ", lifeLine: "ജീവരേഖ", headLine: "തലരേഖ", heartLine: "ഹൃദയരേഖ", fateLine: "വിധിരേഖ", mountsTitle: "പർവ്വതങ്ങളുടെ അവസ്ഥ", guruMount: "ഗുരു പർവ്വതം", venusMount: "ശുക്ര പർവ്വതം", physicalTitle: "കൈപ്പത്തിയുടെ ഘടന", upayTitle: "നിങ്ങൾക്കായി ഒരു ലളിതമായ പരിഹാരം", upaySub: "ഒരു ചെലവുമില്ലാതെ", suspenseTitle: "ഒരു പ്രത്യേക സൂചന", share: "WhatsApp ൽ പങ്കിടുക", trackerTitle: "30-ദിവസ പ്രോഗ്രസ് ട്രാക്കർ", trackerBody: "കർമ്മം കൊണ്ട് രേഖകൾ മാറും. പരിഹാരങ്ങൾ ചെയ്ത് 30 ദിവസത്തിന് ശേഷം വീണ്ടും സ്കാൻ ചെയ്യുക.", setReminder: "റിമൈൻഡർ സെറ്റ് ചെയ്യുക", disclaimer: "ഈ റിപ്പോർട്ട് പരമ്പരാഗത സാമുദ്രിക ശാസ്ത്രത്തെ അടിസ്ഥാനമാക്കിയുള്ളതാണ്.", limitTitle: "നിങ്ങളുടെ സൗജന്യ പരിധി തീർന്നു!", limitSub: "കൂടുതൽ അറിയാൻ ജ്യോതിഷിയുമായി സംസാരിക്കുക.", chatFree: "സൗജന്യമായി സംസാരിക്കുക", recharge: "വാലറ്റ് റീചാർജ്", close: "അടയ്ക്കുക", chatNow: "ഈ റിപ്പോർട്ടിനെക്കുറിച്ച് ജ്യോതിഷിയോട് സംസാരിക്കുക" },
  };
  return ui[lang]?.[key] || ui["en"][key] || ui["hi"][key] || "";
};

// ============================================================
// Image Compression
// ============================================================
const compressImage = async (file: File, maxWidth = 800, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scaleSize = img.width > maxWidth ? maxWidth / img.width : 1;
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas error");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
            } else reject("Compression failed");
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// ============================================================
// Score Bar Component
// ============================================================
function ScoreBar({ label, value, color, isDark }: { label: string; value: number; color: string; isDark: boolean }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[13px] font-bold">{label}</span>
        <span className="text-[13px] font-black" style={{ color }}>{value}%</span>
      </div>
      <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ============================================================
// Main Component
// ============================================================
export default function PalmistryPage() {
  const { lang, theme, me } = useApp();
  const router = useRouter();
  const isDark = theme === "dark";
  const t = (key: string) => getUIText(lang, key);

  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [result, setResult] = useState<PalmResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [hand, setHand] = useState<"left" | "right" | "">("");
  const [scansLeft, setScansLeft] = useState<number | "Unlimited" | null>(null);

  // 🔥 Limit & Popup State
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [scanCount, setScanCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c] shadow-lg" : "border-orange-100 bg-white shadow-xl";
  const dividerClass = isDark ? "border-slate-800/50" : "border-gray-100";

  // Check Limit
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('palm_scan_date');
    let savedCount = parseInt(localStorage.getItem('palm_scan_count') || "0");

    if (savedDate !== today) {
      localStorage.setItem('palm_scan_date', today);
      savedCount = 0;
      localStorage.setItem('palm_scan_count', "0");
    }
    setScanCount(savedCount);
  }, [me?.user]);

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

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResult(null);
    setErrorMsg("");

    if (file.size === 0 || file.size > 10 * 1024 * 1024) {
      setPhoto(null);
      setErrorMsg(t("errSize"));
      e.target.value = "";
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhoto(null);
      setErrorMsg(t("errType"));
      e.target.value = "";
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const reader = new FileReader();

    reader.onload = async () => {
      if (typeof reader.result !== "string") return;
      setPhoto(reader.result);
      setLoading(true);

      try {
        const compressedFile = await compressImage(file);
        const formData = new FormData();
        formData.append("image", compressedFile);
        formData.append("language", lang);
        formData.append("gender", gender || "male");
        formData.append("hand", hand || "right");

        const res = await fetch("/api/palm", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          if (res.status === 422 || data?.error === "INVALID_IMAGE") {
            setPhoto(null);
            setErrorMsg(data?.message || t("errNotPalm"));
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
          throw new Error(data?.message || data?.error || "Analysis failed");
        }

        if (!data?.success || !data?.result) throw new Error("Invalid response format.");

        setResult(data.result);
        if (typeof data.scansLeft !== "undefined") setScansLeft(data.scansLeft);

        // Update Limit Count
        const newCount = scanCount + 1;
        setScanCount(newCount);
        localStorage.setItem('palm_scan_count', newCount.toString());

      } catch (error: any) {
        if (error.name === "AbortError") return;
        setErrorMsg(error.message || "Analysis failed.");
        setPhoto(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const openFilePicker = () => {
    if (!gender || !hand) {
      setErrorMsg(t("selectFirst"));
      return;
    }
    
    // 🔥 Limit Check
    const maxLimit = me?.user ? 2 : 1; 
    if (scanCount >= maxLimit) {
      setShowLimitModal(true);
      return;
    }

    setErrorMsg("");
    fileInputRef.current?.click();
  };

  const handleShare = async () => {
    if (!result) return;
    const avg = Math.round(
      (result.scores.career + result.scores.love + result.scores.health + result.scores.luck) / 4
    );
    const text = `Meri hatheli ki report — Overall ${avg}%\n\n${result.barnumLines?.[0] || ""}\n\nApni hatheli check karein!`;
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({ title: "Palmistry", text, url: window.location.href });
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + window.location.href)}`, "_blank");
      }
    } catch {}
  };

  // 🔥 NEW LOGIC: Chat Pre-fill
  const handleChatNow = () => {
    if (!result) return;

    const summaryText = `Namaste, maine apni hatheli ka scan kiya hai. Kripya iska vishleshan karein:
    
Scores: Career ${result.scores.career}%, Love ${result.scores.love}%, Health ${result.scores.health}%, Luck ${result.scores.luck}%
Life Line: ${result.lines.life}
Fate Line: ${result.lines.fate}
Suspense: ${result.suspenseHook}

Mujhe apne jeevan ke baare mein aur margdarshan chahiye.`;

    const encodedPrompt = encodeURIComponent(summaryText);
    router.push(`/chat/gita?prefill=${encodedPrompt}`);
  };

  const reset = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setPhoto(null);
    setResult(null);
    setErrorMsg("");
    setLoading(false);
    setGender("");
    setHand("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is this AI Palmistry reading accurate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI uses advanced vision models to analyze the major lines and mounts of your palm based on traditional Samudrik Shastra. While highly accurate, it should be used for guidance."
        }
      },
      {
        "@type": "Question",
        "name": "Can palm lines change over time?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, according to palmistry, minor lines can change every 3-6 months based on your karma, actions, and the remedies you perform."
        }
      }
    ]
  };

  return (
    <main className={`min-h-[100dvh] w-full pb-36 ${pageClass} font-sans`}>
      
      {/* Inject FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 sm:p-5 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2.5 transition-colors ${isDark ? "bg-[#0A0F19] text-slate-300 hover:bg-slate-800" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}>
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[17px] sm:text-[20px] font-black uppercase tracking-tight text-[#ff6b00]">
              {t("title")}
            </h1>
            <p className={`text-[11px] sm:text-[13px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("subtitle")}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black text-emerald-500 border border-emerald-500/20">{t("free")}</span>
            {scansLeft !== null && (
              <span className={`text-[9.5px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                {scansLeft === "Unlimited" ? "∞ scans" : `${scansLeft} left`}
              </span>
            )}
          </div>
        </header>

        {/* 🔥 POPUP MODAL (Limit Reached) */}
        {showLimitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl relative ${isDark ? "bg-[#151d2c] border border-slate-700" : "bg-white border border-gray-100"}`}>
              <button 
                onClick={() => setShowLimitModal(false)} 
                className={`absolute top-4 right-4 p-2 rounded-full ${isDark ? "bg-slate-800 text-slate-400" : "bg-gray-100 text-gray-500"}`}
              >
                <X size={18} />
              </button>
              
              <div className="flex flex-col items-center text-center mt-2">
                <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
                  <Lock size={30} className="text-rose-500" />
                </div>
                <h2 className={`text-[19px] font-black leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>{t("limitTitle")}</h2>
                <p className={`text-[13px] font-medium mt-2 mb-6 ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("limitSub")}</p>

                <div className="w-full space-y-3">
                  <button 
                    onClick={() => router.push("/chat/gita")}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3.5 text-[14px] font-black text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
                  >
                    <MessageCircle size={18} /> {t("chatFree")}
                  </button>
                  <button 
                    onClick={() => router.push("/wallet")}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 text-[14px] font-black text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
                  >
                    <Wallet size={18} /> {t("recharge")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ERROR */}
        {errorMsg && (
          <div className={`rounded-xl border p-4 flex items-start gap-3 animate-in fade-in ${isDark ? "border-amber-500/30 bg-amber-900/10" : "border-amber-200 bg-amber-50"}`}>
            <AlertCircle className={`shrink-0 mt-0.5 ${isDark ? "text-amber-400" : "text-amber-600"}`} size={20} />
            <div>
              <h3 className={`text-[14px] font-bold ${isDark ? "text-amber-300" : "text-amber-800"}`}>{t("errorTitle")}</h3>
              <p className={`text-[12.5px] font-medium mt-1 leading-relaxed ${isDark ? "text-amber-200/80" : "text-amber-700"}`}>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* UPLOAD SECTION */}
        {!photo && !loading && (
          <section className={`space-y-5 rounded-[1.5rem] border p-6 sm:p-8 ${cardClass}`}>

            <div className="space-y-3">
              <div>
                <label className={`text-[11px] font-black uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {t("genderTitle")}
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(["male", "female", "other"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-3 rounded-lg text-[13px] font-black transition-all ${
                        gender === g
                          ? "bg-[#ff6b00] text-white shadow"
                          : isDark ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-slate-700"
                      }`}
                    >
                      {t(g)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={`text-[11px] font-black uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  {t("handTitle")}
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(["left", "right"] as const).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHand(h)}
                      className={`py-3 rounded-lg text-[13px] font-black transition-all ${
                        hand === h
                          ? "bg-[#ff6b00] text-white shadow"
                          : isDark ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-slate-700"
                      }`}
                    >
                      {t(h)}
                    </button>
                  ))}
                </div>
              </div>
              <p className={`text-[10.5px] leading-relaxed ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                {t("handHint")}
              </p>
            </div>

            <div className="text-center space-y-3 pt-2">
              <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8A00] to-[#FF3D00] text-white shadow-lg shadow-orange-500/20`}>
                <Hand size={48} className="opacity-90" />
              </div>
              <div>
                <h2 className={`text-[20px] font-black ${isDark ? "text-white" : "text-slate-900"}`}>{t("uploadTitle")}</h2>
                <p className={`text-[13px] font-medium mt-2 leading-relaxed ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("uploadDesc")}</p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleFile}
              className="hidden"
              id="palm-upload"
            />

            <button
              type="button"
              onClick={openFilePicker}
              className={`w-full cursor-pointer flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] px-4 py-4 text-[15px] font-bold text-white shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] ${
                !gender || !hand ? "opacity-60" : "hover:scale-[1.01]"
              }`}
            >
              <Upload size={20} /> {t("chooseBtn")}
            </button>
          </section>
        )}

        {/* PREVIEW / LOADING */}
        {photo && (
          <section className={`space-y-4 rounded-[1.5rem] border p-6 ${cardClass}`}>
            <div className="flex flex-col items-center gap-5">
              <div className="relative">
                <img
                  src={photo}
                  alt="preview"
                  className={`w-full max-w-[280px] aspect-square rounded-2xl border-4 object-cover shadow-lg ${loading ? "border-[#ff6b00] animate-pulse" : "border-emerald-500"}`}
                />
                {loading && (
                  <div className="absolute inset-0 rounded-2xl border-4 border-t-transparent border-[#ff6b00] animate-spin"></div>
                )}
              </div>
              <div className="text-center">
                <p className={`text-[15px] font-bold ${loading ? "text-[#ff6b00] animate-pulse" : "text-emerald-500"}`}>
                  {loading ? loadingText : t("complete")}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* RESULT */}
        {result && !loading && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* 1. HERO — Barnum + Title */}
            <section className={`rounded-2xl border p-5 sm:p-6 ${cardClass}`}>
              <div className="flex items-center gap-2 mb-3">
                <Star className="text-amber-500" size={20} fill="currentColor" />
                <h2 className="text-[16px] font-black text-[#ff6b00] uppercase tracking-wide">{t("reportTitle")}</h2>
              </div>
              {result.barnumLines?.[0] && (
                <p className={`text-[14.5px] font-semibold leading-relaxed mb-2 ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                  {result.barnumLines[0]}
                </p>
              )}
              {result.barnumLines?.[1] && (
                <p className={`text-[13.5px] font-medium leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  {result.barnumLines[1]}
                </p>
              )}
            </section>

            {/* 2. SCORES */}
            <section className={`rounded-2xl border p-5 sm:p-6 ${cardClass}`}>
              <h3 className="text-[15px] font-black mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-[#ff6b00]" /> {t("scoresTitle")}
              </h3>
              <div className="space-y-4">
                <ScoreBar label={t("career")} value={result.scores.career} color="#ff6b00" isDark={isDark} />
                <ScoreBar label={t("love")} value={result.scores.love} color="#e11d48" isDark={isDark} />
                <ScoreBar label={t("health")} value={result.scores.health} color="#10b981" isDark={isDark} />
                <ScoreBar label={t("luck")} value={result.scores.luck} color="#8b5cf6" isDark={isDark} />
              </div>
            </section>

            {/* 3. LINES */}
            <section className={`rounded-2xl border p-5 sm:p-6 ${cardClass}`}>
              <h3 className="text-[15px] font-black mb-4 flex items-center gap-2">
                <Heart size={18} className="text-[#ff6b00]" /> {t("linesTitle")}
              </h3>
              <div className="space-y-4">
                {[
                  { label: t("lifeLine"), val: result.lines.life },
                  { label: t("headLine"), val: result.lines.head },
                  { label: t("heartLine"), val: result.lines.heart },
                  { label: t("fateLine"), val: result.lines.fate },
                ].map((l, i) =>
                  l.val ? (
                    <div key={i}>
                      <div className="text-[13px] font-black mb-1 text-[#ff6b00]">{l.label}</div>
                      <p className={`text-[13px] leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{l.val}</p>
                    </div>
                  ) : null
                )}
              </div>
            </section>

            {/* 4. MOUNTS */}
            <section className={`rounded-2xl border p-5 sm:p-6 ${cardClass}`}>
              <h3 className="text-[15px] font-black mb-4 flex items-center gap-2">
                <Star size={18} className="text-[#ff6b00]" /> {t("mountsTitle")}
              </h3>
              {result.mounts.guru && (
                <div className="mb-3">
                  <div className="text-[13px] font-black mb-1 text-[#ff6b00]">{t("guruMount")}</div>
                  <p className={`text-[13px] leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{result.mounts.guru}</p>
                </div>
              )}
              {result.mounts.venus && (
                <div>
                  <div className="text-[13px] font-black mb-1 text-[#ff6b00]">{t("venusMount")}</div>
                  <p className={`text-[13px] leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{result.mounts.venus}</p>
                </div>
              )}
            </section>

            {/* 5. PHYSICAL */}
            {result.physical && (
              <section className={`rounded-2xl border p-5 sm:p-6 ${cardClass}`}>
                <h3 className="text-[15px] font-black mb-2 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[#ff6b00]" /> {t("physicalTitle")}
                </h3>
                <p className={`text-[13px] leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{result.physical}</p>
              </section>
            )}

            {/* 6. FREE UPAY */}
            {result.freeUpay && (
              <section className={`rounded-2xl border p-5 sm:p-6 ${isDark ? "border-emerald-500/30 bg-emerald-900/10" : "border-emerald-200 bg-emerald-50"}`}>
                <h3 className={`text-[14px] font-black mb-1 flex items-center gap-2 ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>
                  <Sparkles size={18} /> {t("upayTitle")}
                </h3>
                <p className={`text-[11px] font-bold mb-3 ${isDark ? "text-emerald-400/80" : "text-emerald-600"}`}>{t("upaySub")}</p>
                <p className={`text-[13px] leading-relaxed ${isDark ? "text-emerald-100" : "text-emerald-900"}`}>{result.freeUpay}</p>
                {result.mantra && (
                  <p className={`mt-4 text-center text-[14px] font-black ${isDark ? "text-amber-300" : "text-amber-700"}`}>
                    {result.mantra}
                  </p>
                )}
              </section>
            )}

            {/* 7. SUSPENSE + CHAT CTA */}
            {result.suspenseHook && (
              <section className={`rounded-2xl border p-5 sm:p-6 ${isDark ? "border-amber-500/30 bg-amber-900/10" : "border-amber-200 bg-amber-50"}`}>
                <h3 className={`text-[14px] font-black mb-2 flex items-center gap-2 ${isDark ? "text-amber-300" : "text-amber-700"}`}>
                  <Sparkles size={18} /> {t("suspenseTitle")}
                </h3>
                <p className={`text-[13px] leading-relaxed mb-4 ${isDark ? "text-amber-100" : "text-amber-900"}`}>
                  {result.suspenseHook}
                </p>
                <button
                  onClick={handleChatNow}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d81b60] to-[#e91e63] px-4 py-3.5 text-[14px] font-bold text-white shadow-lg shadow-pink-500/20 active:scale-[0.98]"
                >
                  <MessageCircle size={18} /> {t("chatNow")}
                </button>
              </section>
            )}

            {/* 8. TRACKER */}
            <section className={`rounded-2xl border p-5 sm:p-6 ${cardClass}`}>
              <h3 className="text-[15px] font-black mb-2 flex items-center gap-2">
                <RefreshCw size={18} className="text-[#ff6b00]" /> {t("trackerTitle")}
              </h3>
              <p className={`text-[12.5px] leading-relaxed mb-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                {t("trackerBody")}
              </p>
              <Link
                href="/profile?reminder=palmistry"
                className={`block w-full rounded-xl border py-3 text-center text-[13px] font-black ${isDark ? "border-slate-700 text-slate-200" : "border-gray-200 text-slate-800"}`}
              >
                {t("setReminder")}
              </Link>
            </section>

            {/* 9. ACTIONS */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleShare}
                className={`rounded-xl border py-3.5 text-[12px] font-black flex items-center justify-center gap-2 ${isDark ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-gray-200 text-slate-800 hover:bg-gray-50"}`}
              >
                <Share2 size={16} className="text-emerald-600" /> {t("share")}
              </button>
              <button
                onClick={reset}
                className={`rounded-xl border py-3.5 text-[12px] font-black flex items-center justify-center gap-2 ${isDark ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-gray-200 text-slate-800 hover:bg-gray-50"}`}
              >
                <RefreshCw size={16} className="text-slate-500" /> {t("tryAnother")}
              </button>
            </div>

            {/* 10. DISCLAIMER */}
            <p className={`text-[11px] leading-relaxed text-center px-2 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
              {t("disclaimer")}
            </p>
          </div>
        )}

        {/* 🔥 SEO CONTENT BLOCK */}
        <section className={`mt-8 px-5 sm:px-7 py-6 w-full rounded-[1.5rem] border ${isDark ? "border-slate-800/60 bg-[#0c111b]" : "border-orange-100 bg-white"} space-y-4`}>
          <h2 className={`text-[18px] sm:text-[20px] font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Free AI Palmistry Reading Online
          </h2>
          <p className={`text-[13px] sm:text-[14px] leading-relaxed ${isDark ? "text-slate-300" : "text-gray-600"}`}>
            हस्तरेखा शास्त्र (Palmistry) के अनुसार, हमारी हथेली की रेखाएं हमारे भूतकाल, वर्तमान और भविष्य के बारे में बहुत कुछ बताती हैं। GitaTalk का AI पामिस्ट्री टूल आपकी हथेली की फोटो को स्कैन करके जीवन रेखा (Life Line), मस्तिष्क रेखा (Head Line), हृदय रेखा (Heart Line) और भाग्य रेखा (Fate Line) का सटीक विश्लेषण करता है। साथ ही आपके करियर, प्यार, स्वास्थ्य और भाग्य के बारे में 100% मुफ्त रिपोर्ट देता है।
          </p>
          
          <h3 className={`text-[15px] font-bold mt-4 ${isDark ? "text-white" : "text-gray-900"}`}>Frequently Asked Questions (FAQs)</h3>
          <div className="space-y-3 mt-2">
            <div>
              <p className={`text-[13.5px] font-bold ${isDark ? "text-slate-200" : "text-gray-800"}`}>Q: क्या AI हस्तरेखा विश्लेषण सटीक है?</p>
              <p className={`text-[13px] leading-relaxed mt-1 ${isDark ? "text-slate-400" : "text-gray-600"}`}>A: हाँ, हमारा AI पारंपरिक सामुद्रिक शास्त्र के नियमों और आधुनिक विज़न मॉडल का उपयोग करके आपकी हथेली का विश्लेषण करता है। यह मार्गदर्शन के लिए एक बहुत ही सटीक टूल है।</p>
            </div>
            <div>
              <p className={`text-[13.5px] font-bold ${isDark ? "text-slate-200" : "text-gray-800"}`}>Q: क्या हथेली की रेखाएं बदल सकती हैं?</p>
              <p className={`text-[13px] leading-relaxed mt-1 ${isDark ? "text-slate-400" : "text-gray-600"}`}>A: जी हाँ, हस्तरेखा शास्त्र कहता है कि कर्म और उपायों के प्रभाव से हर 3-6 महीने में हथेली की छोटी रेखाएं बदल सकती हैं।</p>
            </div>
          </div>
        </section>

        {/* 🔥 LEGAL FOOTER */}
        <footer className="mt-4 pt-6 pb-2 border-t border-slate-800/80 w-full text-center">
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-[12px] font-semibold text-slate-400">
            <Link href="/privacy-policy" className="hover:text-[#ff6b00] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#ff6b00] transition-colors">Terms & Refund Policy</Link>
            <a href="mailto:gitaaisupport@gmail.com" className="hover:text-[#ff6b00] transition-colors">Contact Us</a>
          </div>
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} GitaTalk (gitatalk.in). All rights reserved.<br/>
            Astrology is for guidance purposes only. Not a substitute for professional advice.
          </p>
        </footer>

      </div>

      {/* STICKY BOTTOM BANNER & NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col w-full">
        <div className="bg-gradient-to-r from-[#d81b60] via-[#e91e63] to-[#c2185b] px-4 py-2.5 flex items-center justify-between shadow-[0_-4px_20px_rgba(233,30,99,0.3)]">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full border border-white/50 flex items-center justify-center shrink-0 bg-white/10">
               <Crown size={16} className="text-white" />
             </div>
             <div>
               <p className="text-[11px] font-bold text-white leading-tight">{t("bannerTitle")}</p>
               <p className="text-[13px] font-extrabold text-white leading-tight">{t("bannerSub")}</p>
             </div>
          </div>
          <button onClick={() => router.push("/chat/gita")} className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-md">
               <Crown size={16} className="text-[#d81b60]" fill="currentColor" />
          </button>
        </div>

        <nav className={`flex justify-around border-t py-2.5 ${isDark ? "border-slate-800 bg-[#0A0F19]/95" : "border-amber-100 bg-white/95"} backdrop-blur`}>
          <Link href="/" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <Home size={18} /><span className="text-[9.5px] font-bold">{t("home")}</span>
          </Link>
          <Link href="/chat" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <MessageCircle size={18} /><span className="text-[9.5px] font-bold">{t("chat")}</span>
          </Link>
          <Link href="/daily" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <Sun size={18} /><span className="text-[9.5px] font-bold">{t("daily")}</span>
          </Link>
          <Link href="/profile" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <User size={18} /><span className="text-[9.5px] font-bold">{t("profile")}</span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
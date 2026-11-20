// app/palmistry/page.tsx
"use client";

import { useRef, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Hand, MessageCircle, Upload, Star, AlertCircle,
  RefreshCw, Home, Sun, User, Crown, Share2, TrendingUp,
  Heart, Sparkles, CheckCircle2, Lock, Wallet, X
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
// UI Text — 10 Languages
// ============================================================
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: {
      title: "हस्तरेखा", subtitle: "हथेली का विश्लेषण", free: "FREE", errorTitle: "Error", errSize: "फोटो 10MB से छोटी होनी चाहिए।", errType: "सिर्फ JPG, PNG या WEBP फोटो अपलोड करें।",
      uploadTitle: "हथेली की फोटो अपलोड करें", uploadDesc: "हथेली की रेखाएं आपके भविष्य का राज बताती हैं।", chooseBtn: "फोटो चुनें", talkAstro: "ज्योतिषी से बात करें — FREE", tryAnother: "दूसरी फोटो अपलोड करें",
      genderTitle: "आपका लिंग", male: "पुरुष", female: "महिला", other: "अन्य", handTitle: "कौन सा हाथ?", left: "बायां", right: "दायां",
      reportTitle: "आपकी हस्तरेखा रिपोर्ट", scoresTitle: "जीवन के 4 आयाम", career: "करियर व धन", love: "प्यार व शादी", health: "स्वास्थ्य", luck: "भाग्य",
      limitTitle: "आपकी फ्री लिमिट खत्म हो गई है!", limitSub: "अधिक स्कैन के लिए ज्योतिषी से बात करें या वॉलेट रिचार्ज करें।", chatFree: "ज्योतिषी से फ्री बात करें", recharge: "वॉलेट रिचार्ज करें", close: "बंद करें"
    },
    hinglish: {
      title: "Palmistry", subtitle: "Palm Analysis", free: "FREE", errorTitle: "Error", errSize: "Photo 10MB se chhoti honi chahiye.", errType: "Sirf JPG, PNG ya WEBP upload karein.",
      uploadTitle: "Apni hatheli ki photo upload karein", uploadDesc: "Hatheli ki rekhaayein aapke bhavishya ka raaj batati hain.", chooseBtn: "Choose Photo", talkAstro: "Talk to Astrologer — FREE", tryAnother: "Try another photo",
      genderTitle: "Aapka Gender", male: "Male", female: "Female", other: "Other", handTitle: "Kaun sa haath?", left: "Left", right: "Right",
      reportTitle: "Aapki Hastarekha Report", scoresTitle: "Jeevan ke 4 Aayam", career: "Career & Wealth", love: "Love & Marriage", health: "Health", luck: "Luck Factor",
      limitTitle: "Aapki Free Limit Khatam Ho Gayi Hai!", limitSub: "Aage ki jankari ke liye jyotishi se baat karein ya wallet recharge karein.", chatFree: "Jyotishi se Free baat karein", recharge: "Wallet Recharge", close: "Band karein"
    },
    en: {
      title: "Palmistry", subtitle: "Palm Analysis", free: "FREE", errorTitle: "Error", errSize: "Photo must be under 10MB.", errType: "Only JPG, PNG or WEBP are supported.",
      uploadTitle: "Upload your palm photo", uploadDesc: "Your palm lines reveal the secrets of your future.", chooseBtn: "Choose Photo", talkAstro: "Talk to Astrologer — FREE", tryAnother: "Try another photo",
      genderTitle: "Your Gender", male: "Male", female: "Female", other: "Other", handTitle: "Which hand?", left: "Left", right: "Right",
      reportTitle: "Your Palmistry Report", scoresTitle: "4 Dimensions of Life", career: "Career & Wealth", love: "Love & Marriage", health: "Health", luck: "Luck Factor",
      limitTitle: "Your Free Limit is Exhausted!", limitSub: "Talk to an astrologer for deeper insights or recharge your wallet.", chatFree: "Chat with Astrologer FREE", recharge: "Recharge Wallet", close: "Close"
    },
    te: {
      title: "హస్తరేఖ", subtitle: "అరచేతి విశ్లేషణ", free: "ఉచితం", errorTitle: "లోపం", errSize: "ఫోటో 10MB కంటే తక్కువ ఉండాలి.", errType: "JPG, PNG లేదా WEBP మాత్రమే.",
      uploadTitle: "మీ అరచేతి ఫోటో అప్‌లోడ్ చేయండి", uploadDesc: "అరచేతి రేఖలు మీ భవిష్యత్తు రహస్యాలను వెల్లడిస్తాయి.", chooseBtn: "ఫోటో ఎంచుకోండి", talkAstro: "జ్యోతిష్యుడితో మాట్లాడండి — ఉచితం", tryAnother: "మరో ఫోటో ప్రయత్నించండి",
      genderTitle: "మీ లింగం", male: "పురుషుడు", female: "స్త్రీ", other: "ఇతర", handTitle: "ఏ చేయి?", left: "ఎడమ", right: "కుడి",
      reportTitle: "మీ హస్తరేఖ నివేదిక", scoresTitle: "జీవితంలోని 4 కోణాలు", career: "కెరీర్ & సంపద", love: "ప్రేమ & వివాహం", health: "ఆరోగ్యం", luck: "అదృష్టం",
      limitTitle: "మీ ఉచిత పరిమితి ముగిసింది!", limitSub: "మరింత సమాచారం కోసం జ్యోతిష్యుడిని సంప్రదించండి.", chatFree: "ఉచితంగా మాట్లాడండి", recharge: "వాలెట్ రీఛార్జ్", close: "మూసివేయి"
    },
    ta: {
      title: "கைரேகை", subtitle: "உள்ளங்கை பகுப்பாய்வு", free: "இலவசம்", errorTitle: "பிழை", errSize: "புகைப்படம் 10MB க்குள் இருக்க வேண்டும்.", errType: "JPG, PNG அல்லது WEBP மட்டும்.",
      uploadTitle: "உங்கள் உள்ளங்கை புகைப்படத்தை பதிவேற்றவும்", uploadDesc: "கைரேகைகள் உங்கள் எதிர்கால ரகசியங்களை வெளிப்படுத்துகின்றன.", chooseBtn: "புகைப்படத்தை தேர்ந்தெடு", talkAstro: "ஜோதிடரிடம் பேசுங்கள் — இலவசம்", tryAnother: "மற்றொரு புகைப்படத்தை முயற்சிக்கவும்",
      genderTitle: "உங்கள் பாலினம்", male: "ஆண்", female: "பெண்", other: "மற்றவை", handTitle: "எந்த கை?", left: "இடது", right: "வலது",
      reportTitle: "உங்கள் கைரேகை அறிக்கை", scoresTitle: "வாழ்க்கையின் 4 பரிமாணங்கள்", career: "தொழில் & செல்வம்", love: "காதல் & திருமணம்", health: "ஆரோக்கியம்", luck: "அதிர்ஷ்டம்",
      limitTitle: "உங்கள் இலவச வரம்பு முடிந்தது!", limitSub: "மேலும் அறிய ஜோதிடரை அணுகவும்.", chatFree: "இலவசமாக பேசுங்கள்", recharge: "வாலெட் ரீசார்ஜ்", close: "மூடு"
    },
    kn: {
      title: "ಹಸ್ತರೇಖೆ", subtitle: "ಅಂಗೈ ವಿಶ್ಲೇಷಣೆ", free: "ಉಚಿತ", errorTitle: "ದೋಷ", errSize: "ಫೋಟೋ 10MB ಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.", errType: "JPG, PNG ಅಥವಾ WEBP ಮಾತ್ರ.",
      uploadTitle: "ನಿಮ್ಮ ಅಂಗೈ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", uploadDesc: "ಅಂಗೈ ರೇಖೆಗಳು ನಿಮ್ಮ ಭವಿಷ್ಯದ ರಹಸ್ಯಗಳನ್ನು ಬಹಿರಂಗಪಡಿಸುತ್ತವೆ.", chooseBtn: "ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ", talkAstro: "ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ — ಉಚಿತ", tryAnother: "ಇನ್ನೊಂದು ಫೋಟೋ ಪ್ರಯತ್ನಿಸಿ",
      genderTitle: "ನಿಮ್ಮ ಲಿಂಗ", male: "ಪುರುಷ", female: "ಮಹಿಳೆ", other: "ಇತರೆ", handTitle: "ಯಾವ ಕೈ?", left: "ಎಡ", right: "ಬಲ",
      reportTitle: "ನಿಮ್ಮ ಹಸ್ತರೇಖೆ ವರದಿ", scoresTitle: "ಜೀವನದ 4 ಆಯಾಮಗಳು", career: "ವೃತ್ತಿ & ಸಂಪತ್ತು", love: "ಪ್ರೀತಿ & ವಿವಾಹ", health: "ಆರೋಗ್ಯ", luck: "ಅದೃಷ್ಟ",
      limitTitle: "ನಿಮ್ಮ ಉಚಿತ ಮಿತಿ ಮುಗಿದಿದೆ!", limitSub: "ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.", chatFree: "ಉಚಿತವಾಗಿ ಮಾತನಾಡಿ", recharge: "ವಾಲೆಟ್ ರೀಚಾರ್ಜ್", close: "ಮುಚ್ಚಿ"
    },
    bn: {
      title: "হস্তরেখা", subtitle: "হাতের তালু বিশ্লেষণ", free: "ফ্রি", errorTitle: "ত্রুটি", errSize: "ছবি 10MB এর কম হতে হবে।", errType: "শুধুমাত্র JPG, PNG বা WEBP।",
      uploadTitle: "আপনার হাতের তালুর ছবি আপলোড করুন", uploadDesc: "হাতের রেখা আপনার ভবিষ্যতের গোপনীয়তা প্রকাশ করে।", chooseBtn: "ছবি চয়ন করুন", talkAstro: "জ্যোতিষীর সাথে কথা বলুন — ফ্রি", tryAnother: "অন্য ছবি চেষ্টা করুন",
      genderTitle: "আপনার লিঙ্গ", male: "পুরুষ", female: "মহিলা", other: "অন্যান্য", handTitle: "কোন হাত?", left: "বাম", right: "ডান",
      reportTitle: "আপনার হস্তরেখা রিপোর্ট", scoresTitle: "জীবনের ৪টি মাত্রা", career: "ক্যারিয়ার ও সম্পদ", love: "ভালোবাসা ও বিবাহ", health: "স্বাস্থ্য", luck: "ভাগ্য",
      limitTitle: "আপনার ফ্রি সীমা শেষ!", limitSub: "আরও জানতে জ্যোতিষীর সাথে কথা বলুন।", chatFree: "ফ্রি চ্যাট করুন", recharge: "ওয়ালেট রিচার্জ", close: "বন্ধ করুন"
    },
    mr: {
      title: "हस्तरेषा", subtitle: "तळहाताचे विश्लेषण", free: "मोफत", errorTitle: "त्रुटी", errSize: "फोटो 10MB पेक्षा लहान असावा.", errType: "फक्त JPG, PNG किंवा WEBP.",
      uploadTitle: "तुमच्या तळहाताचा फोटो अपलोड करा", uploadDesc: "हस्तरेषा तुमच्या भविष्यातील रहस्ये सांगतात.", chooseBtn: "फोटो निवडा", talkAstro: "ज्योतिषाशी बोला — मोफत", tryAnother: "दुसरा फोटो वापरून पहा",
      genderTitle: "तुमचे लिंग", male: "पुरुष", female: "स्त्री", other: "इतर", handTitle: "कोणता हात?", left: "डावा", right: "उजवा",
      reportTitle: "तुमचा हस्तरेषा अहवाल", scoresTitle: "जीवनाचे 4 आयाम", career: "करिअर आणि संपत्ती", love: "प्रेम आणि विवाह", health: "आरोग्य", luck: "नशीब",
      limitTitle: "तुमची मोफत मर्यादा संपली आहे!", limitSub: "अधिक माहितीसाठी ज्योतिषाशी बोला.", chatFree: "मोफत बोला", recharge: "वॉलेट रिचार्ज", close: "बंद करा"
    },
    gu: {
      title: "હસ્તરેખા", subtitle: "હથેળી વિશ્લેષણ", free: "મફત", errorTitle: "ભૂલ", errSize: "ફોટો 10MB થી ઓછો હોવો જોઈએ.", errType: "ફક્ત JPG, PNG અથવા WEBP.",
      uploadTitle: "તમારી હથેળીનો ફોટો અપલોડ કરો", uploadDesc: "હસ્તરેખાઓ તમારા ભવિષ્યના રહસ્યો જણાવે છે.", chooseBtn: "ફોટો પસંદ કરો", talkAstro: "જ્યોતિષી સાથે વાત કરો — મફત", tryAnother: "બીજો ફોટો પ્રયાસ કરો",
      genderTitle: "તમારું લિંગ", male: "પુરુષ", female: "સ્ત્રી", other: "અન્ય", handTitle: "કયો હાથ?", left: "ડાબો", right: "જમણો",
      reportTitle: "તમારો હસ્તરેખા રિપોર્ટ", scoresTitle: "જીવનના 4 પરિમાણ", career: "કારકિર્દી અને સંપત્તિ", love: "પ્રેમ અને લગ્ન", health: "સ્વાસ્થ્ય", luck: "ભાગ્ય",
      limitTitle: "તમારી મફત મર્યાદા સમાપ્ત થઈ ગઈ છે!", limitSub: "વધુ માહિતી માટે જ્યોતિષી સાથે વાત કરો.", chatFree: "મફતમાં વાત કરો", recharge: "વોલેટ રિચાર્જ", close: "બંધ કરો"
    },
    ml: {
      title: "കൈരേഖ", subtitle: "കൈരേഖ വിശകലനം", free: "സൗജന്യം", errorTitle: "പിശക്", errSize: "ഫോട്ടോ 10MB-യിൽ കുറവായിരിക്കണം.", errType: "JPG, PNG അല്ലെങ്കിൽ WEBP മാത്രം.",
      uploadTitle: "നിങ്ങളുടെ കൈരേഖ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക", uploadDesc: "കൈരേഖകൾ നിങ്ങളുടെ ഭാവിയുടെ രഹസ്യങ്ങൾ വെളിപ്പെടുത്തുന്നു.", chooseBtn: "ഫോട്ടോ തിരഞ്ഞെടുക്കുക", talkAstro: "ജ്യോതിഷിയോട് സംസാരിക്കുക — സൗജന്യം", tryAnother: "മറ്റൊരു ഫോട്ടോ പരീക്ഷിക്കുക",
      genderTitle: "നിങ്ങളുടെ ലിംഗഭേദം", male: "പുരുഷൻ", female: "സ്ത്രീ", other: "മറ്റുള്ളവ", handTitle: "ഏത് കൈ?", left: "ഇടത്", right: "വലത്",
      reportTitle: "നിങ്ങളുടെ കൈരേഖ റിപ്പോർട്ട്", scoresTitle: "ജീവിതത്തിന്റെ 4 അളവുകൾ", career: "കരിയർ & സമ്പത്ത്", love: "സ്നേഹം & വിവാഹം", health: "ആരോഗ്യം", luck: "ഭാഗ്യം",
      limitTitle: "നിങ്ങളുടെ സൗജന്യ പരിധി അവസാനിച്ചു!", limitSub: "കൂടുതൽ വിവരങ്ങൾക്ക് ജ്യോതിഷിയെ സമീപിക്കുക.", chatFree: "സൗജന്യമായി സംസാരിക്കുക", recharge: "വാലറ്റ് റീചാർജ്", close: "അടയ്ക്കുക"
    }
  };
  return ui[lang]?.[key] || ui["en"][key] || ui["hi"][key] || "";
};

export default function PalmistryPage() {
  const { me, lang, theme } = useApp();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === "dark";

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<PalmResult | null>(null);
  const [error, setError] = useState("");
  const [showLimitModal, setShowLimitModal] = useState(false);
  
  // States for Gender and Hand selection
  const [gender, setGender] = useState<string>("male");
  const [hand, setHand] = useState<string>("right");

  const t = (key: string) => getUIText(lang, key);
  const loadingSteps = getLoadingSteps(lang);

  // 🔥 LOGIN GUARD: Photo upload button click handler
  const handleUploadClick = () => {
    if (!me || me.isGuest) {
      // Agar login nahi hai, toh login page par bhejo
      router.push("/login?redirect=/palmistry");
      return;
    }
    // Agar login hai, toh file picker kholo
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (file.size > 10 * 1024 * 1024) {
      setError(t("errSize"));
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError(t("errType"));
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setError("");
    setLoading(true);
    setResult(null);
    setStepIndex(0);

    // Fake loading steps animation
    const interval = setInterval(() => {
      setStepIndex(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("language", lang);
      formData.append("gender", gender);
      formData.append("hand", hand);

      const res = await fetch("/api/palmistry", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      // 🔥 BACKEND SECURITY: Agar API bole login karo
      if (res.status === 401) {
        router.push("/login?redirect=/palmistry");
        return;
      }

      // 🔥 LIMIT EXCEEDED: Agar API bole limit khatam
      if (res.status === 402 || data?.code === "LIMIT_EXCEEDED") {
        setShowLimitModal(true);
        return;
      }

      // 🔥 INVALID PALM IMAGE: Agar AI bole photo galat hai
      if (res.status === 400 && data?.error?.includes("Invalid Image")) {
        throw new Error("Aapne jo photo bheji hai wo hatheli ki nahi lag rahi. Kripya saaf hatheli ki photo bhejein.");
      }

      if (!res.ok || !data) {
        throw new Error(data?.error || "Analysis failed. Try a clearer photo.");
      }

      setResult(data.analysis);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setImage(null);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImage(null);
    setResult(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Page styling classes
  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c] shadow-lg" : "border-orange-100 bg-white shadow-md";

  return (
    <main className={`min-h-[100dvh] w-full pb-36 ${pageClass} font-sans`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href={`/${lang}`} className={`rounded-xl p-2.5 transition-colors ${isDark ? "bg-[#0A0F19] text-slate-300" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-[17px] sm:text-[20px] font-black uppercase tracking-tight text-[#ff6b00]">{t("title")}</h1>
            <p className={`text-[11px] sm:text-[13px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("subtitle")}</p>
          </div>
        </header>

        {/* INPUT FORM */}
        {!image && !result && (
          <div className={`p-6 sm:p-8 rounded-[1.5rem] border space-y-6 ${cardClass}`}>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-orange-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Hand className="text-[#ff6b00]" size={40} />
              </div>
              <h2 className="text-lg font-bold mb-2">{t("uploadTitle")}</h2>
              <p className="text-sm text-gray-500 mb-6">{t("uploadDesc")}</p>
            </div>

            {/* Gender & Hand Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-bold uppercase mb-2 block">{t("genderTitle")}</label>
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                  <button onClick={() => setGender("male")} className={`flex-1 py-2 text-sm font-bold rounded-lg ${gender === "male" ? "bg-white dark:bg-slate-700 shadow text-[#ff6b00]" : "text-gray-500"}`}>{t("male")}</button>
                  <button onClick={() => setGender("female")} className={`flex-1 py-2 text-sm font-bold rounded-lg ${gender === "female" ? "bg-white dark:bg-slate-700 shadow text-[#ff6b00]" : "text-gray-500"}`}>{t("female")}</button>
                </div>
              </div>
              <div>
                <label className="text-[12px] font-bold uppercase mb-2 block">{t("handTitle")}</label>
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                  <button onClick={() => setHand("left")} className={`flex-1 py-2 text-sm font-bold rounded-lg ${hand === "left" ? "bg-white dark:bg-slate-700 shadow text-[#ff6b00]" : "text-gray-500"}`}>{t("left")}</button>
                  <button onClick={() => setHand("right")} className={`flex-1 py-2 text-sm font-bold rounded-lg ${hand === "right" ? "bg-white dark:bg-slate-700 shadow text-[#ff6b00]" : "text-gray-500"}`}>{t("right")}</button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 text-red-500 rounded-xl flex items-center gap-2 text-sm font-bold">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {/* 🔥 UPLOAD BUTTON WITH LOGIN GUARD */}
            <button 
              onClick={handleUploadClick}
              className="w-full bg-[#ff6b00] hover:bg-[#e65c00] text-white font-black py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 uppercase tracking-wider"
            >
              <Upload size={20} /> {t("chooseBtn")}
            </button>
            
            {/* Hidden Input */}
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/webp" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
            />
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className={`p-10 rounded-[1.5rem] border text-center space-y-6 ${cardClass}`}>
            {image && <img src={image} alt="Palm" className="w-40 h-40 object-cover mx-auto rounded-2xl shadow-md border-4 border-white dark:border-slate-700" />}
            <div className="flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="animate-spin text-[#ff6b00]" size={36} />
              <p className="text-[15px] font-bold text-[#ff6b00] animate-pulse">{loadingSteps[stepIndex]}</p>
            </div>
          </div>
        )}

        {/* RESULT STATE */}
        {result && !loading && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`p-6 rounded-[1.5rem] border ${cardClass}`}>
              <h2 className="text-xl font-black text-center text-[#ff6b00] mb-6">{t("reportTitle")}</h2>
              
              {/* Scores */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className={`p-3 rounded-xl text-center border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-orange-50 border-orange-100"}`}>
                  <TrendingUp size={20} className="mx-auto text-[#ff6b00] mb-2" />
                  <p className="text-[10px] font-bold uppercase mb-1">{t("career")}</p>
                  <p className="text-lg font-black">{result.scores.career}%</p>
                </div>
                <div className={`p-3 rounded-xl text-center border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-orange-50 border-orange-100"}`}>
                  <Heart size={20} className="mx-auto text-pink-500 mb-2" />
                  <p className="text-[10px] font-bold uppercase mb-1">{t("love")}</p>
                  <p className="text-lg font-black">{result.scores.love}%</p>
                </div>
                <div className={`p-3 rounded-xl text-center border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-orange-50 border-orange-100"}`}>
                  <Sun size={20} className="mx-auto text-green-500 mb-2" />
                  <p className="text-[10px] font-bold uppercase mb-1">{t("health")}</p>
                  <p className="text-lg font-black">{result.scores.health}%</p>
                </div>
                <div className={`p-3 rounded-xl text-center border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-orange-50 border-orange-100"}`}>
                  <Star size={20} className="mx-auto text-yellow-500 mb-2" />
                  <p className="text-[10px] font-bold uppercase mb-1">{t("luck")}</p>
                  <p className="text-lg font-black">{result.scores.luck}%</p>
                </div>
              </div>

              {/* Barnum Lines */}
              <div className="space-y-3 mb-6">
                {result.barnumLines.map((line, i) => (
                  <p key={i} className="text-sm font-medium leading-relaxed p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50">{line}</p>
                ))}
              </div>

              <button onClick={resetForm} className="w-full bg-[#0B0F19] hover:bg-black text-white font-bold py-3 rounded-xl">
                {t("tryAnother")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* LIMIT EXCEEDED MODAL */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-6 text-center border ${cardClass}`}>
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <Lock className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{t("limitTitle")}</h3>
            <p className="text-sm text-gray-500 mb-6">{t("limitSub")}</p>
            
            <div className="space-y-3">
              <button onClick={() => router.push("/chat")} className="w-full bg-[#ff6b00] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                <MessageCircle size={18} /> {t("chatFree")}
              </button>
              <button onClick={() => router.push("/wallet")} className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                <Wallet size={18} /> {t("recharge")}
              </button>
              <button onClick={() => setShowLimitModal(false)} className="w-full py-2 text-sm font-bold text-gray-500">
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
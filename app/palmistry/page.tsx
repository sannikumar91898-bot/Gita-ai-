// app/palmistry/page.tsx
"use client";

import { useRef, useState, useEffect, ChangeEvent } from "react";
import {
  ArrowLeft, Hand, MessageCircle, Upload, Star, AlertCircle,
  RefreshCw, Home, Sun, User, Crown, Share2, TrendingUp,
  Heart, Sparkles, CheckCircle2
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
// UI Text — 10 Languages (new keys in hi/hinglish/en; others fallback to en)
// ============================================================
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: {
      title: "हस्तरेखा", subtitle: "हथेली का विश्लेषण", free: "FREE",
      errorTitle: "Error",
      errSize: "फोटो 10MB से छोटी होनी चाहिए।",
      errType: "सिर्फ JPG, PNG या WEBP फोटो अपलोड करें।",
      errNotPalm: "कृपया हथेली की साफ़ फोटो अपलोड करें।",
      uploadTitle: "हथेली की फोटो अपलोड करें",
      uploadDesc: "हथेली की रेखाएं आपके भविष्य का राज बताती हैं।",
      chooseBtn: "फोटो चुनें", complete: "विश्लेषण पूरा हुआ",
      talkAstro: "ज्योतिषी से बात करें — FREE",
      tryAnother: "दूसरी फोटो अपलोड करें",
      bannerTitle: "ज्योतिषी - 24x7 उपलब्ध",
      bannerSub: "अपनी समस्या का समाधान पाएं – पहली चैट FREE",
      home: "होम", chat: "चैट", daily: "राशिफल", profile: "प्रोफाइल",
      genderTitle: "आपका लिंग", male: "पुरुष", female: "महिला", other: "अन्य",
      handTitle: "कौन सा हाथ?", left: "बायां", right: "दायां",
      handHint: "सामुद्रिक शास्त्र में पुरुष का दायां, महिला का बायां हाथ मुख्य माना जाता है।",
      selectFirst: "पहले लिंग और हाथ चुनें",
      reportTitle: "आपकी हस्तरेखा रिपोर्ट",
      scoresTitle: "जीवन के 4 आयाम",
      career: "करियर व धन", love: "प्यार व शादी", health: "स्वास्थ्य", luck: "भाग्य",
      linesTitle: "मुख्य रेखाएं",
      lifeLine: "जीवन रेखा", headLine: "मस्तिष्क रेखा", heartLine: "हृदय रेखा", fateLine: "भाग्य रेखा",
      mountsTitle: "पर्वतों की स्थिति", guruMount: "गुरु पर्वत", venusMount: "शुक्र पर्वत",
      physicalTitle: "हथेली की बनावट",
      upayTitle: "आपके लिए एक सरल उपाय", upaySub: "बिना किसी खर्च के",
      suspenseTitle: "एक विशेष संकेत",
      share: "WhatsApp पर भेजें",
      trackerTitle: "30-दिन प्रगति ट्रैकर",
      trackerBody: "हस्तरेखा शास्त्र कहता है — कर्म से रेखाएं बदलती हैं। ऊपर दिए उपाय रोज़ करें और 30 दिन बाद अपनी हथेली दोबारा स्कैन करें।",
      setReminder: "रिमाइंडर सेट करें",
      disclaimer: "यह रिपोर्ट पारंपरिक सामुद्रिक शास्त्र पर आधारित है। यह मार्गदर्शन है, चिकित्सीय या कानूनी सलाह नहीं।",
    },
    hinglish: {
      title: "Palmistry", subtitle: "Palm Analysis", free: "FREE",
      errorTitle: "Error",
      errSize: "Photo 10MB se chhoti honi chahiye.",
      errType: "Sirf JPG, PNG ya WEBP upload karein.",
      errNotPalm: "Kripya hatheli ki saaf photo upload karein.",
      uploadTitle: "Apni hatheli ki photo upload karein",
      uploadDesc: "Hatheli ki rekhaayein aapke bhavishya ka raaj batati hain.",
      chooseBtn: "Choose Photo", complete: "Analysis Complete",
      talkAstro: "Talk to Astrologer — FREE",
      tryAnother: "Try another photo",
      bannerTitle: "Astrologer - 24x7 Available",
      bannerSub: "Apni samasya ka samadhan paayein – Pehli Chat FREE",
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile",
      genderTitle: "Aapka Gender", male: "Male", female: "Female", other: "Other",
      handTitle: "Kaun sa haath?", left: "Left", right: "Right",
      handHint: "Samudrik shastra mein male ka right, female ka left haath primary hai.",
      selectFirst: "Pehle gender aur haath chunein",
      reportTitle: "Aapki Hastarekha Report",
      scoresTitle: "Jeevan ke 4 Aayam",
      career: "Career & Wealth", love: "Love & Marriage", health: "Health", luck: "Luck Factor",
      linesTitle: "Mukhya Rekhayein",
      lifeLine: "Jeevan Rekha", headLine: "Mastishk Rekha", heartLine: "Hriday Rekha", fateLine: "Bhagya Rekha",
      mountsTitle: "Parvaton ki Sthiti", guruMount: "Guru Parvat", venusMount: "Shukra Parvat",
      physicalTitle: "Hatheli ki Banaawat",
      upayTitle: "Aapke liye ek saral upay", upaySub: "Bina kisi kharch ke",
      suspenseTitle: "Ek vishesh sanket",
      share: "WhatsApp par bhejein",
      trackerTitle: "30-Din Progress Tracker",
      trackerBody: "Hastarekha shastra kehta hai — karm se rekhayein badalti hain. Upar diye upay roz karein aur 30 din baad apni hatheli dobara scan karein.",
      setReminder: "Reminder set karein",
      disclaimer: "Yeh report traditional Samudrik Shastra par aadharit hai. Yeh guidance hai, medical ya legal advice nahi.",
    },
    en: {
      title: "Palmistry", subtitle: "Palm Analysis", free: "FREE",
      errorTitle: "Error",
      errSize: "Photo must be under 10MB.",
      errType: "Only JPG, PNG or WEBP are supported.",
      errNotPalm: "Please upload a clear palm photo.",
      uploadTitle: "Upload your palm photo",
      uploadDesc: "Your palm lines reveal the secrets of your future.",
      chooseBtn: "Choose Photo", complete: "Analysis Complete",
      talkAstro: "Talk to Astrologer — FREE",
      tryAnother: "Try another photo",
      bannerTitle: "Astrologer - 24x7 Available",
      bannerSub: "Get solutions to your problems – First Chat FREE",
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile",
      genderTitle: "Your Gender", male: "Male", female: "Female", other: "Other",
      handTitle: "Which hand?", left: "Left", right: "Right",
      handHint: "In Samudrik tradition, male → right hand, female → left hand is primary.",
      selectFirst: "Please select gender and hand first",
      reportTitle: "Your Palmistry Report",
      scoresTitle: "4 Dimensions of Life",
      career: "Career & Wealth", love: "Love & Marriage", health: "Health", luck: "Luck Factor",
      linesTitle: "Main Lines",
      lifeLine: "Life Line", headLine: "Head Line", heartLine: "Heart Line", fateLine: "Fate Line",
      mountsTitle: "Mounts", guruMount: "Jupiter Mount", venusMount: "Venus Mount",
      physicalTitle: "Palm Structure",
      upayTitle: "A simple remedy for you", upaySub: "No cost involved",
      suspenseTitle: "A special hint",
      share: "Share on WhatsApp",
      trackerTitle: "30-Day Progress Tracker",
      trackerBody: "Palmistry says — lines change with karma. Do the remedies daily and rescan your palm after 30 days.",
      setReminder: "Set reminder",
      disclaimer: "This report is based on traditional Samudrik Shastra. It is guidance, not medical or legal advice.",
    },
    te: { title: "హస్తరేఖ", subtitle: "అరచేతి విశ్లేషణ", free: "ఉచితం", errorTitle: "లోపం", errSize: "ఫోటో 10MB కంటే తక్కువ ఉండాలి.", errType: "JPG, PNG లేదా WEBP మాత్రమే.", uploadTitle: "మీ అరచేతి ఫోటో అప్‌లోడ్ చేయండి", uploadDesc: "అరచేతి రేఖలు మీ భవిష్యత్తు రహస్యాలను వెల్లడిస్తాయి.", chooseBtn: "ఫోటో ఎంచుకోండి", complete: "విశ్లేషణ పూర్తయింది", talkAstro: "జ్యోతిష్యుడితో మాట్లాడండి — ఉచితం", tryAnother: "మరో ఫోటో ప్రయత్నించండి", bannerTitle: "జ్యోతిష్యుడు - 24x7 అందుబాటులో", bannerSub: "ఇప్పుడే మాట్లాడండి — మొదటి చాట్ ఉచితం", home: "హోమ్", chat: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్" },
    ta: { title: "கைரேகை", subtitle: "உள்ளங்கை பகுப்பாய்வு", free: "இலவசம்", errorTitle: "பிழை", errSize: "புகைப்படம் 10MB க்குள் இருக்க வேண்டும்.", errType: "JPG, PNG அல்லது WEBP மட்டும்.", uploadTitle: "உங்கள் உள்ளங்கை புகைப்படத்தை பதிவேற்றவும்", uploadDesc: "கைரேகைகள் உங்கள் எதிர்கால ரகசியங்களை வெளிப்படுத்துகின்றன.", chooseBtn: "புகைப்படத்தை தேர்ந்தெடு", complete: "பகுப்பாய்வு முடிந்தது", talkAstro: "ஜோதிடரிடம் பேசுங்கள் — இலவசம்", tryAnother: "மற்றொரு புகைப்படத்தை முயற்சிக்கவும்", bannerTitle: "ஜோதிடர் - 24x7 கிடைக்கும்", bannerSub: "இப்போது பேசுங்கள் — முதல் அரட்டை இலவசம்", home: "முகப்பு", chat: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்" },
    kn: { title: "ಹಸ್ತರೇಖೆ", subtitle: "ಅಂಗೈ ವಿಶ್ಲೇಷಣೆ", free: "ಉಚಿತ", errorTitle: "ದೋಷ", errSize: "ಫೋಟೋ 10MB ಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.", errType: "JPG, PNG ಅಥವಾ WEBP ಮಾತ್ರ.", uploadTitle: "ನಿಮ್ಮ ಅಂಗೈ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", uploadDesc: "ಅಂಗೈ ರೇಖೆಗಳು ನಿಮ್ಮ ಭವಿಷ್ಯದ ರಹಸ್ಯಗಳನ್ನು ಬಹಿರಂಗಪಡಿಸುತ್ತವೆ.", chooseBtn: "ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ", complete: "ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ", talkAstro: "ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ — ಉಚಿತ", tryAnother: "ಇನ್ನೊಂದು ಫೋಟೋ ಪ್ರಯತ್ನಿಸಿ", bannerTitle: "ಜ್ಯೋತಿಷಿ - 24x7 ಲಭ್ಯವಿದೆ", bannerSub: "ಈಗ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ", home: "ಮುಖಪುಟ", chat: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್" },
    bn: { title: "হস্তরেখা", subtitle: "হাতের তালু বিশ্লেষণ", free: "ফ্রি", errorTitle: "ত্রুটি", errSize: "ছবি 10MB এর কম হতে হবে।", errType: "শুধুমাত্র JPG, PNG বা WEBP।", uploadTitle: "আপনার হাতের তালুর ছবি আপলোড করুন", uploadDesc: "হাতের রেখা আপনার ভবিষ্যতের গোপনীয়তা প্রকাশ করে।", chooseBtn: "ছবি চয়ন করুন", complete: "বিশ্লেষণ সম্পন্ন", talkAstro: "জ্যোতিষীর সাথে কথা বলুন — ফ্রি", tryAnother: "অন্য ছবি চেষ্টা করুন", bannerTitle: "জ্যোতিষী - 24x7 উপলব্ধ", bannerSub: "এখনই কথা বলুন — প্রথম চ্যাট ফ্রি", home: "হোম", chat: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল" },
    mr: { title: "हस्तरेषा", subtitle: "तळहाताचे विश्लेषण", free: "मोफत", errorTitle: "त्रुटी", errSize: "फोटो 10MB पेक्षा लहान असावा.", errType: "फक्त JPG, PNG किंवा WEBP.", uploadTitle: "तुमच्या तळहाताचा फोटो अपलोड करा", uploadDesc: "हस्तरेषा तुमच्या भविष्यातील रहस्ये सांगतात.", chooseBtn: "फोटो निवडा", complete: "विश्लेषण पूर्ण", talkAstro: "ज्योतिषाशी बोला — मोफत", tryAnother: "दुसरा फोटो वापरून पहा", bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "आता बोला — पहिली चॅट मोफत", home: "होम", chat: "चॅट", daily: "दैनिक", profile: "प्रोफाइल" },
    gu: { title: "હસ્તરેખા", subtitle: "હથેળી વિશ્લેષણ", free: "મફત", errorTitle: "ભૂલ", errSize: "ફોટો 10MB થી ઓછો હોવો જોઈએ.", errType: "ફક્ત JPG, PNG અથવા WEBP.", uploadTitle: "તમારી હથેળીનો ફોટો અપલોડ કરો", uploadDesc: "હસ્તરેખાઓ તમારા ભવિષ્યના રહસ્યો જણાવે છે.", chooseBtn: "ફોટો પસંદ કરો", complete: "વિશ્લેષણ પૂર્ણ", talkAstro: "જ્યોતિષી સાથે વાત કરો — મફત", tryAnother: "બીજો ફોટો પ્રયાસ કરો", bannerTitle: "જ્યોતિષી - 24x7 ઉપલબ્ધ", bannerSub: "હમણાં વાત કરો — પ્રથમ ચેટ મફત", home: "હોમ", chat: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ" },
    ml: { title: "കൈരേഖ", subtitle: "കൈപ്പത്തി വിശകലനം", free: "സൗജന്യം", errorTitle: "പിശക്", errSize: "ഫോട്ടോ 10MB-യിൽ കുറവായിരിക്കണം.", errType: "JPG, PNG അല്ലെങ്കിൽ WEBP മാത്രം.", uploadTitle: "നിങ്ങളുടെ കൈപ്പത്തിയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക", uploadDesc: "കൈരേഖകൾ നിങ്ങളുടെ ഭാവിയുടെ രഹസ്യങ്ങൾ വെളിപ്പെടുത്തുന്നു.", chooseBtn: "ഫോട്ടോ തിരഞ്ഞെടുക്കുക", complete: "വിശകലനം പൂർത്തിയായി", talkAstro: "ജ്യോതിഷിയോട് സംസാരിക്കുക — സൗജന്യം", tryAnother: "മറ്റൊരു ഫോട്ടോ പരീക്ഷിക്കുക", bannerTitle: "ജ്യോതിഷി - 24x7 ലഭ്യമാണ്", bannerSub: "ഇപ്പോൾ സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം", home: "ഹോം", chat: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ" },
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
        <span className="text-[12px] font-bold">{label}</span>
        <span className="text-[12px] font-black" style={{ color }}>{value}%</span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>
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
  const { lang, theme } = useApp();
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c] shadow-lg" : "border-orange-100 bg-white shadow-xl";

  // Loading steps rotation
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
          // 422 → AI ne image reject ki
          if (res.status === 422 || data?.error === "INVALID_IMAGE") {
            setPhoto(null);
            setErrorMsg(data?.message || t("errNotPalm"));
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
          // 401 (LOGIN_REQUIRED) / 402 (WALLET_RECHARGE) / 500 (AI_ERROR)
          throw new Error(data?.message || data?.error || "Analysis failed");
        }

        if (!data?.success || !data?.result) throw new Error("Invalid response format.");

        setResult(data.result);
        if (typeof data.scansLeft !== "undefined") setScansLeft(data.scansLeft);
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
    } catch {
      /* user cancelled */
    }
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

  const chatPrompt = encodeURIComponent(
    result?.suspenseHook
      ? `Namaste, meri hatheli ki report mein ek vishesh sanket aaya hai. Kya aap iske baare mein aur bata sakte hain?`
      : `Namaste, meri hatheli ki report dekh kar mujhe aur margdarshan chahiye.`
  );

  return (
    <main className={`min-h-[100dvh] w-full pb-36 ${pageClass} font-sans`}>
      <div className="w-full px-3 pt-4 space-y-5 max-w-2xl mx-auto">

        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2.5 transition-colors ${isDark ? "bg-[#0A0F19] text-slate-300" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[17px] font-black uppercase tracking-tight text-[#ff6b00]">{t("title")}</h1>
            <p className={`text-[11px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("subtitle")}</p>
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
          <section className={`space-y-5 rounded-[1.5rem] border p-6 ${cardClass}`}>

            {/* Gender + Hand selection */}
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
                      className={`py-2.5 rounded-lg text-[12px] font-black transition-all ${
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
                      className={`py-2.5 rounded-lg text-[12px] font-black transition-all ${
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

            {/* Hand icon */}
            <div className="text-center space-y-3">
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
                  className={`h-44 w-44 rounded-2xl border-4 object-cover shadow-lg ${loading ? "border-[#ff6b00] animate-pulse" : "border-emerald-500"}`}
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
            <section className={`rounded-2xl border p-5 ${cardClass}`}>
              <div className="flex items-center gap-2 mb-3">
                <Star className="text-amber-500" size={20} fill="currentColor" />
                <h2 className="text-[15px] font-black text-[#ff6b00] uppercase tracking-wide">{t("reportTitle")}</h2>
              </div>
              {result.barnumLines?.[0] && (
                <p className={`text-[14px] font-semibold leading-relaxed mb-2 ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                  {result.barnumLines[0]}
                </p>
              )}
              {result.barnumLines?.[1] && (
                <p className={`text-[13px] font-medium leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  {result.barnumLines[1]}
                </p>
              )}
            </section>

            {/* 2. SCORES */}
            <section className={`rounded-2xl border p-4 ${cardClass}`}>
              <h3 className="text-[14px] font-black mb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-[#ff6b00]" /> {t("scoresTitle")}
              </h3>
              <div className="space-y-3">
                <ScoreBar label={t("career")} value={result.scores.career} color="#ff6b00" isDark={isDark} />
                <ScoreBar label={t("love")} value={result.scores.love} color="#e11d48" isDark={isDark} />
                <ScoreBar label={t("health")} value={result.scores.health} color="#10b981" isDark={isDark} />
                <ScoreBar label={t("luck")} value={result.scores.luck} color="#8b5cf6" isDark={isDark} />
              </div>
            </section>

            {/* 3. LINES */}
            <section className={`rounded-2xl border p-4 ${cardClass}`}>
              <h3 className="text-[14px] font-black mb-3 flex items-center gap-2">
                <Heart size={16} className="text-[#ff6b00]" /> {t("linesTitle")}
              </h3>
              <div className="space-y-3">
                {[
                  { label: t("lifeLine"), val: result.lines.life },
                  { label: t("headLine"), val: result.lines.head },
                  { label: t("heartLine"), val: result.lines.heart },
                  { label: t("fateLine"), val: result.lines.fate },
                ].map((l, i) =>
                  l.val ? (
                    <div key={i}>
                      <div className="text-[12px] font-black mb-1 text-[#ff6b00]">{l.label}</div>
                      <p className={`text-[12.5px] leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{l.val}</p>
                    </div>
                  ) : null
                )}
              </div>
            </section>

            {/* 4. MOUNTS */}
            <section className={`rounded-2xl border p-4 ${cardClass}`}>
              <h3 className="text-[14px] font-black mb-3 flex items-center gap-2">
                <Star size={16} className="text-[#ff6b00]" /> {t("mountsTitle")}
              </h3>
              {result.mounts.guru && (
                <div className="mb-2">
                  <div className="text-[12px] font-black mb-1 text-[#ff6b00]">{t("guruMount")}</div>
                  <p className={`text-[12.5px] leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{result.mounts.guru}</p>
                </div>
              )}
              {result.mounts.venus && (
                <div>
                  <div className="text-[12px] font-black mb-1 text-[#ff6b00]">{t("venusMount")}</div>
                  <p className={`text-[12.5px] leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{result.mounts.venus}</p>
                </div>
              )}
            </section>

            {/* 5. PHYSICAL */}
            {result.physical && (
              <section className={`rounded-2xl border p-4 ${cardClass}`}>
                <h3 className="text-[14px] font-black mb-2 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#ff6b00]" /> {t("physicalTitle")}
                </h3>
                <p className={`text-[12.5px] leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{result.physical}</p>
              </section>
            )}

            {/* 6. FREE UPAY + MANTRA */}
            {result.freeUpay && (
              <section className={`rounded-2xl border p-4 ${isDark ? "border-emerald-500/30 bg-emerald-900/10" : "border-emerald-200 bg-emerald-50"}`}>
                <h3 className={`text-[13px] font-black mb-1 flex items-center gap-2 ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>
                  <Sparkles size={16} /> {t("upayTitle")}
                </h3>
                <p className={`text-[10.5px] font-bold mb-2 ${isDark ? "text-emerald-400/80" : "text-emerald-600"}`}>{t("upaySub")}</p>
                <p className={`text-[12.5px] leading-relaxed ${isDark ? "text-emerald-100" : "text-emerald-900"}`}>{result.freeUpay}</p>
                {result.mantra && (
                  <p className={`mt-3 text-center text-[13px] font-black ${isDark ? "text-amber-300" : "text-amber-700"}`}>
                    {result.mantra}
                  </p>
                )}
              </section>
            )}

            {/* 7. SUSPENSE + CHAT CTA */}
            {result.suspenseHook && (
              <section className={`rounded-2xl border p-4 ${isDark ? "border-amber-500/30 bg-amber-900/10" : "border-amber-200 bg-amber-50"}`}>
                <h3 className={`text-[13px] font-black mb-2 flex items-center gap-2 ${isDark ? "text-amber-300" : "text-amber-700"}`}>
                  <Sparkles size={16} /> {t("suspenseTitle")}
                </h3>
                <p className={`text-[12.5px] leading-relaxed mb-3 ${isDark ? "text-amber-100" : "text-amber-900"}`}>
                  {result.suspenseHook}
                </p>
                <Link
                  href={`/chat?q=${chatPrompt}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d81b60] to-[#e91e63] px-4 py-3.5 text-[14px] font-bold text-white shadow-lg shadow-pink-500/20 active:scale-[0.98]"
                >
                  <MessageCircle size={18} /> {t("talkAstro")}
                </Link>
              </section>
            )}

            {/* 8. TRACKER */}
            <section className={`rounded-2xl border p-4 ${cardClass}`}>
              <h3 className="text-[14px] font-black mb-2 flex items-center gap-2">
                <RefreshCw size={16} className="text-[#ff6b00]" /> {t("trackerTitle")}
              </h3>
              <p className={`text-[12px] leading-relaxed mb-3 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                {t("trackerBody")}
              </p>
              <Link
                href="/profile?reminder=palmistry"
                className={`block w-full rounded-xl border py-2.5 text-center text-[12px] font-black ${isDark ? "border-slate-700 text-slate-200" : "border-gray-200 text-slate-800"}`}
              >
                {t("setReminder")}
              </Link>
            </section>

            {/* 9. ACTIONS */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleShare}
                className={`rounded-xl border py-3 text-[11.5px] font-black flex items-center justify-center gap-2 ${isDark ? "border-slate-700 text-slate-200" : "border-gray-200 text-slate-800"}`}
              >
                <Share2 size={16} className="text-emerald-600" /> {t("share")}
              </button>
              <button
                onClick={reset}
                className={`rounded-xl border py-3 text-[11.5px] font-black flex items-center justify-center gap-2 ${isDark ? "border-slate-700 text-slate-200" : "border-gray-200 text-slate-800"}`}
              >
                <RefreshCw size={16} className="text-slate-500" /> {t("tryAnother")}
              </button>
            </div>

            {/* 10. DISCLAIMER */}
            <p className={`text-[10.5px] leading-relaxed text-center px-2 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
              {t("disclaimer")}
            </p>
          </div>
        )}
      </div>

      {/* STICKY BOTTOM BANNER + NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col w-full">

        {/* Pink Banner */}
        <div className="bg-gradient-to-r from-[#d81b60] via-[#e91e63] to-[#c2185b] px-4 py-2.5 flex items-center justify-between shadow-[0_-4px_20px_rgba(233,30,99,0.3)]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full border border-white/50 flex items-center justify-center shrink-0 bg-white/10">
              <Crown size={16} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white leading-tight">{t("bannerTitle")}</p>
              <p className="text-[12.5px] font-extrabold text-white leading-tight">{t("bannerSub")}</p>
            </div>
          </div>
          <Link href={`/chat?q=${chatPrompt}`} className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-md">
            <Crown size={16} className="text-[#d81b60]" fill="currentColor" />
          </Link>
        </div>

        {/* Bottom Nav */}
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
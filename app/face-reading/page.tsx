// app/face-reading/page.tsx
"use client";

import { useRef, useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, ScanFace, MessageCircle, Upload, Star, 
  AlertCircle, RefreshCw, ShieldAlert, Home, Sun, User, Crown,
  Lock, Wallet, X, HelpCircle
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

type FaceResult = { title: string; insight: string; hook: string; };

// 🔥 Loading Text in 10 Languages
const getLoadingSteps = (lang: string) => {
  const steps: Record<string, string[]> = {
    hi: ["चेहरे की बनावट स्कैन हो रही है...", "ग्रहों की स्थिति देखी जा रही है...", "भाग्य का विश्लेषण हो रहा है...", "रिपोर्ट तैयार हो रही है..."],
    hinglish: ["Chehre ko scan kiya ja raha hai...", "Planets check kiye ja rahe hain...", "Bhagya decode ho raha hai...", "Report taiyaar ho rahi hai..."],
    en: ["Scanning facial symmetry...", "Analyzing planetary alignments...", "Decoding destiny markers...", "Generating Vedic report..."],
    te: ["ముఖం స్కాన్ అవుతోంది...", "గ్రహాల స్థితి విశ్లేషిస్తోంది...", "విధి విశ్లేషిస్తోంది...", "నివేదిక సిద్ధమవుతోంది..."],
    ta: ["முகம் ஸ்கேன் செய்யப்படுகிறது...", "கிரக நிலைகள் ஆராயப்படுகிறது...", "விதி பகுப்பாய்வு செய்யப்படுகிறது...", "அறிக்கை தயாராகிறது..."],
    kn: ["ಮುಖ ಸ್ಕ್ಯಾನ್ ಆಗುತ್ತಿದೆ...", "ಗ್ರಹಗಳ ಸ್ಥಿತಿ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...", "ಭವಿಷ್ಯ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...", "ವರದಿ ಸಿದ್ಧವಾಗುತ್ತಿದೆ..."],
    bn: ["মুখ স্ক্যান হচ্ছে...", "গ্রহের অবস্থান বিশ্লেষণ হচ্ছে...", "ভাগ্য বিশ্লেষণ হচ্ছে...", "রিপোর্ট তৈরি হচ্ছে..."],
    mr: ["चेहरा स्कॅन होत आहे...", "ग्रहांची स्थिती तपासत आहे...", "नशीब विश्लेषण करत आहे...", "अहवाल तयार होत आहे..."],
    gu: ["ચહેરો સ્કેન થઈ રહ્યો છે...", "ગ્રહોની સ્થિતિ તપાસાઈ રહી છે...", "ભાગ્ય વિશ્લેષણ થઈ રહ્યું છે...", "રિપોર્ટ તૈયાર થઈ રહ્યો છે..."],
    ml: ["മുഖം സ്കാൻ ചെയ്യുന്നു...", "ഗ്രഹങ്ങളുടെ സ്ഥിതി പരിശോധിക്കുന്നു...", "വിധി വിശകലനം ചെയ്യുന്നു...", "റിപ്പോർട്ട് തയ്യാറാക്കുന്നു..."],
  };
  return steps[lang] || steps["hinglish"];
};

// 🔥 10 Languages Translation Helper
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: { 
      title: "फेस रीडिंग", subtitle: "वैदिक विश्लेषण", free: "FREE", errorTitle: "Error", errSize: "फोटो 10MB से छोटी होनी चाहिए।", errType: "सिर्फ JPG, PNG या WEBP फोटो अपलोड करें।", uploadTitle: "अपना फोटो अपलोड करें", uploadDesc: "आपके चेहरे के लक्षण आपके भाग्य की दिशा बताते हैं (सिर्फ साफ चेहरे की फोटो डालें, Max 10MB)", chooseBtn: "फोटो चुनें", complete: "विश्लेषण पूरा हुआ", talkAstro: "ज्योतिषी से बात करें — FREE", tryAnother: "दूसरी फोटो अपलोड करें", bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "अपनी समस्या का समाधान पाएं – पहली चैट FREE", home: "होम", chat: "चैट", daily: "राशिफल", profile: "प्रोफाइल",
      limitTitle: "आपकी फ्री लिमिट खत्म हो गई है!", limitSub: "अधिक स्कैन और गहरी जानकारी के लिए ज्योतिषी से बात करें या वॉलेट रिचार्ज करें।", chatFree: "ज्योतिषी से फ्री बात करें", recharge: "वॉलेट रिचार्ज करें", close: "बंद करें", chatNow: "इस रिपोर्ट पर ज्योतिषी से बात करें"
    },
    hinglish: { 
      title: "Face Reading", subtitle: "Vedic Analysis", free: "FREE", errorTitle: "Error", errSize: "Photo 10MB se chhoti honi chahiye.", errType: "Sirf JPG, PNG ya WEBP upload karein.", uploadTitle: "Apna photo upload karein", uploadDesc: "Aapke chehre ke lakshan aapke bhagya ki disha batate hain (Sirf face ki clear photo daalein, Max 10MB)", chooseBtn: "Choose Photo", complete: "Analysis Complete", talkAstro: "Talk to Astrologer — FREE", tryAnother: "Try another photo", bannerTitle: "Astrologer - 24x7 Available", bannerSub: "Apni samasya ka samadhan paayein – Pehli Chat FREE", home: "Home", chat: "Chat", daily: "Daily", profile: "Profile",
      limitTitle: "Aapki Free Limit Khatam Ho Gayi Hai!", limitSub: "Aage ki jankari ke liye jyotishi se baat karein ya wallet recharge karein.", chatFree: "Jyotishi se Free baat karein", recharge: "Wallet Recharge", close: "Band karein", chatNow: "Is report par jyotishi se baat karein"
    },
    en: { 
      title: "Face Reading", subtitle: "Vedic Analysis", free: "FREE", errorTitle: "Error", errSize: "Photo must be under 10MB.", errType: "Only JPG, PNG or WEBP are supported.", uploadTitle: "Upload your photo", uploadDesc: "Your facial features reveal your destiny (Upload clear face only, Max 10MB)", chooseBtn: "Choose Photo", complete: "Analysis Complete", talkAstro: "Talk to Astrologer — FREE", tryAnother: "Try another photo", bannerTitle: "Astrologer - 24x7 Available", bannerSub: "Get solutions to your problems – First Chat FREE", home: "Home", chat: "Chat", daily: "Daily", profile: "Profile",
      limitTitle: "Your Free Limit is Exhausted!", limitSub: "Talk to an astrologer for deeper insights or recharge your wallet.", chatFree: "Chat with Astrologer FREE", recharge: "Recharge Wallet", close: "Close", chatNow: "Talk to Astrologer about this"
    },
    te: { title: "ఫేస్ రీడింగ్", subtitle: "వేద విశ్లేషణ", free: "ఉచితం", errorTitle: "లోపం", errSize: "ఫోటో 10MB కంటే తక్కువ ఉండాలి.", errType: "JPG, PNG లేదా WEBP మాత్రమే.", uploadTitle: "మీ ఫోటో అప్‌లోడ్ చేయండి", uploadDesc: "మీ ముఖ లక్షణాలు మీ విధిని వెల్లడిస్తాయి (స్పష్టమైన ఫోటో మాత్రమే, Max 10MB)", chooseBtn: "ఫోటో ఎంచుకోండి", complete: "విశ్లేషణ పూర్తయింది", talkAstro: "జ్యోతిష్యుడితో మాట్లాడండి — ఉచితం", tryAnother: "మరో ఫోటో ప్రయత్నించండి", bannerTitle: "జ్యోతిష్యుడు - 24x7 అందుబాటులో", bannerSub: "ఇప్పుడే మాట్లాడండి — మొదటి చాట్ ఉచితం", home: "హోమ్", chat: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్", limitTitle: "మీ ఉచిత పరిమితి ముగిసింది!", limitSub: "మరింత సమాచారం కోసం జ్యోతిష్యుడిని సంప్రదించండి.", chatFree: "ఉచితంగా మాట్లాడండి", recharge: "వాలెట్ రీఛార్జ్", close: "మూసివేయి", chatNow: "ఈ నివేదిక గురించి జ్యోతిష్యుడితో మాట్లాడండి" },
    ta: { title: "முக படிப்பு", subtitle: "வேத பகுப்பாய்வு", free: "இலவசம்", errorTitle: "பிழை", errSize: "புகைப்படம் 10MB க்குள் இருக்க வேண்டும்.", errType: "JPG, PNG அல்லது WEBP மட்டும்.", uploadTitle: "உங்கள் புகைப்படத்தை பதிவேற்றவும்", uploadDesc: "உங்கள் முக அம்சங்கள் உங்கள் விதியை வெளிப்படுத்துகின்றன (தெளிவான முகம் மட்டும், Max 10MB)", chooseBtn: "புகைப்படத்தை தேர்ந்தெடு", complete: "பகுப்பாய்வு முடிந்தது", talkAstro: "ஜோதிடரிடம் பேசுங்கள் — இலவசம்", tryAnother: "மற்றொரு புகைப்படத்தை முயற்சிக்கவும்", bannerTitle: "ஜோதிடர் - 24x7 கிடைக்கும்", bannerSub: "இப்போது பேசுங்கள் — முதல் அரட்டை இலவசம்", home: "முகப்பு", chat: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்", limitTitle: "உங்கள் இலவச வரம்பு முடிந்தது!", limitSub: "மேலும் அறிய ஜோதிடரை அணுகவும்.", chatFree: "இலவசமாக பேசுங்கள்", recharge: "வாலெட் ரீசார்ஜ்", close: "மூடு", chatNow: "இந்த அறிக்கை பற்றி ஜோதிடரிடம் பேசுங்கள்" },
    kn: { title: "ಮುಖ ಓದುವಿಕೆ", subtitle: "ವೈದಿಕ ವಿಶ್ಲೇಷಣೆ", free: "ಉಚಿತ", errorTitle: "ದೋಷ", errSize: "ಫೋಟೋ 10MB ಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.", errType: "JPG, PNG ಅಥವಾ WEBP ಮಾತ್ರ.", uploadTitle: "ನಿಮ್ಮ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", uploadDesc: "ನಿಮ್ಮ ಮುಖದ ಲಕ್ಷಣಗಳು ನಿಮ್ಮ ಭವಿಷ್ಯವನ್ನು ಬಹಿರಂಗಪಡಿಸುತ್ತವೆ (ಸ್ಪಷ್ಟ ಮುಖ ಮಾತ್ರ, Max 10MB)", chooseBtn: "ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ", complete: "ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ", talkAstro: "ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ — ಉಚಿತ", tryAnother: "ಇನ್ನೊಂದು ಫೋಟೋ ಪ್ರಯತ್ನಿಸಿ", bannerTitle: "ಜ್ಯೋತಿಷಿ - 24x7 ಲಭ್ಯವಿದೆ", bannerSub: "ಈಗ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ", home: "ಮುಖಪುಟ", chat: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್", limitTitle: "ನಿಮ್ಮ ಉಚಿತ ಮಿತಿ ಮುಗಿದಿದೆ!", limitSub: "ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.", chatFree: "ಉಚಿತವಾಗಿ ಮಾತನಾಡಿ", recharge: "ವಾಲೆಟ್ ರೀಚಾರ್ಜ್", close: "ಮುಚ್ಚಿ", chatNow: "ಈ ವರದಿ ಬಗ್ಗೆ ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ" },
    bn: { title: "মুখ পাঠ", subtitle: "বৈদিক বিশ্লেষণ", free: "ফ্রি", errorTitle: "ত্রুটি", errSize: "ছবি 10MB এর কম হতে হবে।", errType: "শুধুমাত্র JPG, PNG বা WEBP।", uploadTitle: "আপনার ছবি আপলোড করুন", uploadDesc: "আপনার মুখের বৈশিষ্ট্য আপনার ভাগ্য প্রকাশ করে (শুধুমাত্র স্পষ্ট মুখ, Max 10MB)", chooseBtn: "ছবি চয়ন করুন", complete: "বিশ্লেষণ সম্পন্ন", talkAstro: "জ্যোতিষীর সাথে কথা বলুন — ফ্রি", tryAnother: "অন্য ছবি চেষ্টা করুন", bannerTitle: "জ্যোতিষী - 24x7 উপলব্ধ", bannerSub: "এখনই কথা বলুন — প্রথম চ্যাট ফ্রি", home: "হোম", chat: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল", limitTitle: "আপনার ফ্রি সীমা শেষ!", limitSub: "আরও জানতে জ্যোতিষীর সাথে কথা বলুন।", chatFree: "ফ্রি চ্যাট করুন", recharge: "ওয়ালেট রিচার্জ", close: "বন্ধ করুন", chatNow: "এই রিপোর্ট সম্পর্কে জ্যোতিষীর সাথে কথা বলুন" },
    mr: { title: "चेहरा वाचन", subtitle: "वैदिक विश्लेषण", free: "मोफत", errorTitle: "त्रुटी", errSize: "फोटो 10MB पेक्षा लहान असावा.", errType: "फक्त JPG, PNG किंवा WEBP.", uploadTitle: "तुमचा फोटो अपलोड करा", uploadDesc: "तुमची चेहऱ्याची वैशिष्ट्ये तुमचे भविष्य सांगतात (फक्त स्पष्ट चेहरा, Max 10MB)", chooseBtn: "फोटो निवडा", complete: "विश्लेषण पूर्ण", talkAstro: "ज्योतिषाशी बोला — मोफत", tryAnother: "दुसरा फोटो वापरून पहा", bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "आता बोला — पहिली चॅट मोफत", home: "होम", chat: "चॅट", daily: "दैनिक", profile: "प्रोफाइल", limitTitle: "तुमची मोफत मर्यादा संपली आहे!", limitSub: "अधिक माहितीसाठी ज्योतिषाशी बोला.", chatFree: "मोफत बोला", recharge: "वॉलेट रिचार्ज", close: "बंद करा", chatNow: "या अहवालाबद्दल ज्योतिषाशी बोला" },
    gu: { title: "ચહેરો વાંચન", subtitle: "વૈદિક વિશ્લેષણ", free: "મફત", errorTitle: "ભૂલ", errSize: "ફોટો 10MB થી ઓછો હોવો જોઈએ.", errType: "ફક્ત JPG, PNG અથવા WEBP.", uploadTitle: "તમારો ફોટો અપલોડ કરો", uploadDesc: "તમારા ચહેરાના લક્ષણો તમારું ભાગ્ય જણાવે છે (ફક્ત સ્પષ્ટ ચહેરો, Max 10MB)", chooseBtn: "ફોટો પસંદ કરો", complete: "વિશ્લેષણ પૂર્ણ", talkAstro: "જ્યોતિષી સાથે વાત કરો — મફત", tryAnother: "બીજો ફોટો પ્રયાસ કરો", bannerTitle: "જ્યોતિષી - 24x7 ઉપલબ્ધ", bannerSub: "હમણાં વાત કરો — પ્રથમ ચેટ મફત", home: "હોમ", chat: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ", limitTitle: "તમારી મફત મર્યાદા સમાપ્ત થઈ ગઈ છે!", limitSub: "વધુ માહિતી માટે જ્યોતિષી સાથે વાત કરો.", chatFree: "મફત વાત કરો", recharge: "વોલેટ રિચાર્જ", close: "બંધ કરો", chatNow: "આ રિપોર્ટ વિશે જ્યોતિષી સાથે વાત કરો" },
    ml: { title: "മുഖ വായന", subtitle: "വൈദിക വിശകലനം", free: "സൗജന്യം", errorTitle: "പിശക്", errSize: "ഫോട്ടോ 10MB-യിൽ കുറവായിരിക്കണം.", errType: "JPG, PNG അല്ലെങ്കിൽ WEBP മാത്രം.", uploadTitle: "നിങ്ങളുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക", uploadDesc: "നിങ്ങളുടെ മുഖ സവിശേഷതകൾ നിങ്ങളുടെ വിധി വെളിപ്പെടുത്തുന്നു (വ്യക്തമായ മുഖം മാത്രം, Max 10MB)", chooseBtn: "ഫോട്ടോ തിരഞ്ഞെടുക്കുക", complete: "വിശകലനം പൂർത്തിയായി", talkAstro: "ജ്യോതിഷിയോട് സംസാരിക്കുക — സൗജന്യം", tryAnother: "മറ്റൊരു ഫോട്ടോ പരീക്ഷിക്കുക", bannerTitle: "ജ്യോതിഷി - 24x7 ലഭ്യമാണ്", bannerSub: "ഇപ്പോൾ സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം", home: "ഹോം", chat: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ", limitTitle: "നിങ്ങളുടെ സൗജന്യ പരിധി തീർന്നു!", limitSub: "കൂടുതൽ അറിയാൻ ജ്യോതിഷിയുമായി സംസാരിക്കുക.", chatFree: "സൗജന്യമായി സംസാരിക്കുക", recharge: "വാലറ്റ് റീചാർജ്", close: "അടയ്ക്കുക", chatNow: "ഈ റിപ്പോർട്ടിനെക്കുറിച്ച് ജ്യോതിഷിയോട് സംസാരിക്കുക" },
  };
  return ui[lang]?.[key] || ui["en"][key] || ui["hi"][key];
};

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
            if (blob) resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
            else reject("Compression failed");
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function FaceReadingPage() {
  const { lang, theme, me } = useApp();
  const router = useRouter();
  const isDark = theme === "dark";

  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<FaceResult | null>(null);

  // 🔥 Limit & Popup State
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [scanCount, setScanCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Helper to get localized text
  const t = (key: string) => getUIText(lang, key);

  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c] shadow-lg" : "border-orange-100 bg-white shadow-xl";

  // Check Limit
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('face_scan_date');
    let savedCount = parseInt(localStorage.getItem('face_scan_count') || "0");

    if (savedDate !== today) {
      localStorage.setItem('face_scan_date', today);
      savedCount = 0;
      localStorage.setItem('face_scan_count', "0");
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

    setErrorMsg(null);
    setResult(null);

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

        const res = await fetch("/api/face-reading", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        const data = await res.json().catch(() => null);

        // 🔥 BACKEND SECURITY: 401 Unauthorized
        if (res.status === 401) {
          router.push("/login?redirect=/face-reading");
          return;
        }

        // 🔥 LIMIT EXCEEDED / WALLET RECHARGE
        if (res.status === 402 || data?.code === "INSUFFICIENT_BALANCE" || data?.code === "LIMIT_EXCEEDED") {
          setShowLimitModal(true);
          setPhoto(null);
          return;
        }

        if (!res.ok) {
          if (data?.error === "INVALID_IMAGE" || data?.error?.includes("Invalid Image")) {
            setPhoto(null);
            setErrorMsg("Aapne jo photo bheji hai wo chehre ki nahi lag rahi. Kripya saaf chehre ki photo bhejein.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
          throw new Error(data?.message || data?.error || "Analysis failed");
        }

        const r = data?.result;
        if (!data?.success || typeof r?.title !== "string" || typeof r?.insight !== "string" || typeof r?.hook !== "string") {
          throw new Error("Invalid response from AI service");
        }

        setResult({ title: r.title, insight: r.insight, hook: r.hook });

        // Update Limit Count
        const newCount = scanCount + 1;
        setScanCount(newCount);
        localStorage.setItem('face_scan_count', newCount.toString());

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
    // 🔥 1. LOGIN GUARD: Check if user is guest
    if (!me || me.isGuest) {
      router.push("/login?redirect=/face-reading");
      return;
    }

    // 🔥 2. LIMIT CHECK
    const maxLimit = 2; 
    if (scanCount >= maxLimit) {
      setShowLimitModal(true);
      return;
    }
    
    setErrorMsg(null);
    fileInputRef.current?.click();
  };

  const handleChatNow = () => {
    if (!result) return;

    const summaryText = `Namaste, maine apna Face Reading (Chehra vachan) karwaya hai. Kripya iska vishleshan karein:
    
Title: ${result.title}
Insight: ${result.insight}
Hook: ${result.hook}

Mujhe apne jeevan ke baare mein aur margdarshan chahiye.`;

    const encodedPrompt = encodeURIComponent(summaryText);
    router.push(`/chat/gita?prefill=${encodedPrompt}`);
  };

  const reset = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setPhoto(null); setResult(null); setErrorMsg(null); setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does AI Face Reading work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI analyzes your facial features, symmetry, and structure based on the ancient principles of Samudrik Shastra (Physiognomy). It then correlates these features with planetary influences to generate your reading."
        }
      },
      {
        "@type": "Question",
        "name": "Is my photo safe and secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Your privacy is our top priority. We process your image in real-time and do not save or store it on our servers permanently."
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
          <Link href="/" className={`rounded-xl p-2.5 transition-colors ${isDark ? "bg-[#0A0F19] text-slate-300" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[17px] sm:text-[20px] font-black uppercase tracking-tight text-[#ff6b00]">{t("title")}</h1>
            <p className={`text-[11px] sm:text-[13px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("subtitle")}</p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black text-emerald-500 border border-emerald-500/20">{t("free")}</span>
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
              
              <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <Lock className="text-red-500" size={32} />
              </div>
              <h3 className="text-xl font-black text-center mb-2">{t("limitTitle")}</h3>
              <p className="text-sm text-center text-gray-500 mb-6">{t("limitSub")}</p>
              
              <div className="space-y-3">
                <button onClick={() => router.push("/chat")} className="w-full bg-[#ff6b00] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                  <MessageCircle size={18} /> {t("chatFree")}
                </button>
                <button onClick={() => router.push("/wallet")} className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2">
                  <Wallet size={18} /> {t("recharge")}
                </button>
                <button onClick={() => setShowLimitModal(false)} className="w-full py-2 text-sm font-bold text-gray-500">
                  {t("close")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        {!photo && !result && !loading && (
          <div className={`rounded-[1.5rem] border p-6 sm:p-8 space-y-6 text-center ${cardClass}`}>
            <div className="w-24 h-24 mx-auto bg-orange-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2">
              <ScanFace className="text-[#ff6b00]" size={48} />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-2">{t("uploadTitle")}</h2>
              <p className="text-[13px] text-gray-500 max-w-sm mx-auto">{t("uploadDesc")}</p>
            </div>
            
            {errorMsg && (
              <div className="p-3 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center gap-2 text-sm font-bold max-w-md mx-auto">
                <AlertCircle size={18} /> {errorMsg}
              </div>
            )}

            {/* 🔥 UPLOAD BUTTON WITH LOGIN GUARD */}
            <button 
              onClick={openFilePicker}
              className="w-full max-w-xs mx-auto bg-[#ff6b00] hover:bg-[#e65c00] text-white font-black py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 uppercase tracking-wider"
            >
              <Upload size={20} /> {t("chooseBtn")}
            </button>
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/webp" 
              ref={fileInputRef} 
              onChange={handleFile} 
              className="hidden" 
            />
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className={`p-10 rounded-[1.5rem] border text-center space-y-6 ${cardClass}`}>
            {photo && <img src={photo} alt="Face" className="w-40 h-40 object-cover mx-auto rounded-2xl shadow-md border-4 border-white dark:border-slate-700" />}
            <div className="flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="animate-spin text-[#ff6b00]" size={36} />
              <p className="text-[15px] font-bold text-[#ff6b00] animate-pulse">{loadingText}</p>
            </div>
          </div>
        )}

        {/* RESULT STATE */}
        {result && !loading && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`p-6 rounded-[1.5rem] border text-center ${cardClass}`}>
              <h2 className="text-2xl font-black text-[#ff6b00] mb-2">{result.title}</h2>
              <div className="w-16 h-1 bg-[#ff6b00] mx-auto mb-6 rounded-full"></div>
              
              <p className="text-[14.5px] leading-relaxed text-gray-700 dark:text-slate-300 mb-6">
                {result.insight}
              </p>

              <div className={`p-4 rounded-xl mb-6 border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-orange-50 border-orange-100"}`}>
                <p className="text-[13px] font-bold text-[#ff6b00]">
                  <Sparkles className="inline-block mr-2" size={16} /> {result.hook}
                </p>
              </div>

              <div className="space-y-3">
                <button onClick={handleChatNow} className="w-full bg-[#ff6b00] hover:bg-[#e65c00] text-white font-black py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 uppercase tracking-wider">
                  <MessageCircle size={20} /> {t("chatNow")}
                </button>
                <button onClick={reset} className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl transition-all">
                  {t("tryAnother")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
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

        if (!res.ok) {
          if (data?.error === "INVALID_IMAGE") {
            setPhoto(null);
            setErrorMsg(data.message || "Please upload a clear human face.");
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
    // 🔥 Limit Check
    const maxLimit = me?.user ? 2 : 1; 
    if (scanCount >= maxLimit) {
      setShowLimitModal(true);
      return;
    }
    setErrorMsg(null);
    fileInputRef.current?.click();
  };

  // 🔥 NEW LOGIC: Chat Pre-fill
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

  // FAQ Schema for SEO
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

        {/* ERROR MESSAGE */}
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
          <section className={`space-y-6 rounded-[1.5rem] border p-6 sm:p-8 text-center ${cardClass}`}>
            <div className={`mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8A00] to-[#FF3D00] text-white shadow-lg shadow-orange-500/20`}>
              <ScanFace size={64} className="opacity-90" />
            </div>
            <div>
              <h2 className={`text-[22px] font-black ${isDark ? "text-white" : "text-gray-900"}`}>{t("uploadTitle")}</h2>
              <p className={`text-[13.5px] font-medium mt-2 leading-relaxed ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("uploadDesc")}</p>
            </div>
            
            <input ref={fileInputRef} type="file" accept="image/jpeg, image/png, image/webp" onChange={handleFile} className="hidden" id="face-upload" />
            
            <button 
              onClick={openFilePicker} 
              className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] px-4 py-4 text-[15px] font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Upload size={20} /> {t("chooseBtn")}
            </button>
          </section>
        )}

        {/* PREVIEW / LOADING SECTION */}
        {photo && (
          <section className={`space-y-4 rounded-[1.5rem] border p-6 ${cardClass}`}>
            <div className="flex flex-col items-center gap-5">
              <div className="relative">
                <img src={photo} alt="preview" className={`w-full max-w-[250px] aspect-square rounded-full border-4 object-cover shadow-lg ${loading ? "border-[#ff6b00] animate-pulse" : "border-emerald-500"}`} />
                {loading && <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-[#ff6b00] animate-spin"></div>}
              </div>
              <div className="text-center">
                <p className={`text-[16px] font-bold ${loading ? "text-[#ff6b00] animate-pulse" : "text-emerald-500"}`}>{loading ? loadingText : t("complete")}</p>
              </div>
            </div>
          </section>
        )}

        {/* RESULT SECTION */}
        {result && !loading && (
          <section className={`space-y-5 rounded-[1.5rem] border-2 p-5 sm:p-7 animate-in fade-in slide-in-from-bottom-4 duration-500 ${isDark ? "border-orange-900/30 bg-[#151d2c]" : "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50"}`}>
            
            <div className="flex items-center gap-2 border-b border-slate-800/50 pb-3">
              <Star className="text-amber-500" size={24} fill="currentColor" />
              <h2 className="text-[20px] font-black text-[#ff6b00] uppercase tracking-wide">{result.title}</h2>
            </div>
            
            <p className={`text-[14.5px] font-medium leading-relaxed ${isDark ? "text-slate-300" : "text-gray-800"}`}>{result.insight}</p>
            
            {/* PSYCHOLOGICAL HOOK */}
            <div className={`rounded-xl border p-4 relative overflow-hidden ${isDark ? "border-rose-500/30 bg-[#2a151a]" : "border-red-200 bg-red-50 shadow-inner"}`}>
              <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
              <div className="flex items-start gap-3">
                <ShieldAlert size={20} className={`shrink-0 mt-0.5 ${isDark ? "text-rose-400" : "text-red-600"}`} />
                <p className={`text-[13px] font-bold leading-relaxed ${isDark ? "text-rose-200" : "text-red-800"}`}>{result.hook}</p>
              </div>
            </div>
            
            {/* MARKETING / CONVERSION CTA */}
            <div className="space-y-3 pt-2">
              <button 
                onClick={handleChatNow}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d81b60] to-[#e91e63] px-4 py-4 text-[15px] font-bold text-white shadow-lg shadow-pink-500/20 transition-transform active:scale-[0.98]"
              >
                <MessageCircle size={20} /> {t("chatNow")}
              </button>
              <button 
                onClick={reset} 
                className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3.5 text-[14px] font-bold transition-colors ${isDark ? "border-slate-700 bg-[#0A0F19] text-slate-300 hover:bg-slate-800" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <RefreshCw size={18} /> {t("tryAnother")}
              </button>
            </div>
          </section>
        )}

        {/* 🔥 SEO CONTENT BLOCK */}
        <section className={`mt-8 px-5 sm:px-7 py-6 w-full rounded-[1.5rem] border ${isDark ? "border-slate-800/60 bg-[#0c111b]" : "border-orange-100 bg-white"} space-y-4`}>
          <h2 className={`text-[18px] sm:text-[20px] font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Free AI Face Reading (Chehra Vachan)
          </h2>
          <p className={`text-[13px] sm:text-[14px] leading-relaxed ${isDark ? "text-slate-300" : "text-gray-600"}`}>
            सामुद्रिक शास्त्र (Physiognomy) के अनुसार, किसी व्यक्ति के चेहरे की बनावट, माथे, आंखों और नाक की बनावट उसके स्वभाव और भविष्य के बारे में बहुत कुछ बताती है। GitaTalk का AI फेस रीडिंग टूल आपकी फोटो को स्कैन करके आपके चेहरे के लक्षणों का विश्लेषण करता है और आपके करियर, रिश्तों और समृद्धि के बारे में सटीक जानकारी देता है।
          </p>
          
          <h3 className={`text-[15px] font-bold mt-4 ${isDark ? "text-white" : "text-gray-900"}`}>Frequently Asked Questions (FAQs)</h3>
          <div className="space-y-3 mt-2">
            <div>
              <p className={`text-[13.5px] font-bold ${isDark ? "text-slate-200" : "text-gray-800"}`}>Q: AI फेस रीडिंग कैसे काम करती है?</p>
              <p className={`text-[13px] leading-relaxed mt-1 ${isDark ? "text-slate-400" : "text-gray-600"}`}>A: हमारा AI आपके चेहरे की बनावट और समरूपता का विश्लेषण सामुद्रिक शास्त्र के नियमों के आधार पर करता है और फिर ग्रहों के प्रभाव से इसका मिलान करके रिपोर्ट बनाता है।</p>
            </div>
            <div>
              <p className={`text-[13.5px] font-bold ${isDark ? "text-slate-200" : "text-gray-800"}`}>Q: क्या मेरी फोटो सुरक्षित है?</p>
              <p className={`text-[13px] leading-relaxed mt-1 ${isDark ? "text-slate-400" : "text-gray-600"}`}>A: बिल्कुल। आपकी प्राइवेसी हमारी प्राथमिकता है। हम आपकी इमेज को रियल-टाइम में प्रोसेस करते हैं और उसे सर्वर पर सेव नहीं करते हैं।</p>
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

      {/* STICKY BOTTOM BANNER & NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col w-full">
        
        {/* Pink Banner (Marketing Hook) */}
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
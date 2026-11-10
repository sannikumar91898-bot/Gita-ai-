// app/palmistry/page.tsx
"use client";

import { useRef, useState, useEffect, ChangeEvent } from "react";
import { ArrowLeft, Hand, MessageCircle, Upload, Star, AlertCircle, RefreshCw, ShieldAlert, Home, Sun, User, Crown } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

type PalmResult = { title: string; insight: string; hook: string; };

// 🔥 Loading Text in 10 Languages
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

// 🔥 10 Languages Translation Helper
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: { title: "हस्तरेखा", subtitle: "हथेली का विश्लेषण", free: "FREE", errorTitle: "Error", errSize: "फोटो 10MB से छोटी होनी चाहिए।", errType: "सिर्फ JPG, PNG या WEBP फोटो अपलोड करें।", uploadTitle: "हथेली की फोटो अपलोड करें", uploadDesc: "हथेली की रेखाएं आपके भविष्य का राज बताती हैं।", chooseBtn: "फोटो चुनें", complete: "विश्लेषण पूरा हुआ", talkAstro: "ज्योतिषी से बात करें — FREE", tryAnother: "दूसरी फोटो अपलोड करें", bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "अपने नाम करें – पहली चैट FREE", home: "होम", chat: "चैट", daily: "राशिफल", profile: "प्रोफाइल" },
    hinglish: { title: "Palmistry", subtitle: "Palm Analysis", free: "FREE", errorTitle: "Error", errSize: "Photo 10MB se chhoti honi chahiye.", errType: "Sirf JPG, PNG ya WEBP upload karein.", uploadTitle: "Apni hatheli ki photo upload karein", uploadDesc: "Hatheli ki rekhaayein aapke bhavishya ka raaj batati hain.", chooseBtn: "Choose Photo", complete: "Analysis Complete", talkAstro: "Talk to Astrologer — FREE", tryAnother: "Try another photo", bannerTitle: "Astrologer - 24x7 Available", bannerSub: "Make them yours – First Chat FREE", home: "Home", chat: "Chat", daily: "Daily", profile: "Profile" },
    en: { title: "Palmistry", subtitle: "Palm Analysis", free: "FREE", errorTitle: "Error", errSize: "Photo must be under 10MB.", errType: "Only JPG, PNG or WEBP are supported.", uploadTitle: "Upload your palm photo", uploadDesc: "Your palm lines reveal the secrets of your future.", chooseBtn: "Choose Photo", complete: "Analysis Complete", talkAstro: "Talk to Astrologer — FREE", tryAnother: "Try another photo", bannerTitle: "Astrologer - 24x7 Available", bannerSub: "Make them yours – First Chat FREE", home: "Home", chat: "Chat", daily: "Daily", profile: "Profile" },
    te: { title: "హస్తరేఖ", subtitle: "అరచేతి విశ్లేషణ", free: "ఉచితం", errorTitle: "లోపం", errSize: "ఫోటో 10MB కంటే తక్కువ ఉండాలి.", errType: "JPG, PNG లేదా WEBP మాత్రమే.", uploadTitle: "మీ అరచేతి ఫోటో అప్‌లోడ్ చేయండి", uploadDesc: "అరచేతి రేఖలు మీ భవిష్యత్తు రహస్యాలను వెల్లడిస్తాయి.", chooseBtn: "ఫోటో ఎంచుకోండి", complete: "విశ్లేషణ పూర్తయింది", talkAstro: "జ్యోతిష్యుడితో మాట్లాడండి — ఉచితం", tryAnother: "మరో ఫోటో ప్రయత్నించండి", bannerTitle: "జ్యోతిష్యుడు - 24x7 అందుబాటులో", bannerSub: "ఇప్పుడే మాట్లాడండి — మొదటి చాట్ ఉచితం", home: "హోమ్", chat: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్" },
    ta: { title: "கைரேகை", subtitle: "உள்ளங்கை பகுப்பாய்வு", free: "இலவசம்", errorTitle: "பிழை", errSize: "புகைப்படம் 10MB க்குள் இருக்க வேண்டும்.", errType: "JPG, PNG அல்லது WEBP மட்டும்.", uploadTitle: "உங்கள் உள்ளங்கை புகைப்படத்தை பதிவேற்றவும்", uploadDesc: "கைரேகைகள் உங்கள் எதிர்கால ரகசியங்களை வெளிப்படுத்துகின்றன.", chooseBtn: "புகைப்படத்தை தேர்ந்தெடு", complete: "பகுப்பாய்வு முடிந்தது", talkAstro: "ஜோதிடரிடம் பேசுங்கள் — இலவசம்", tryAnother: "மற்றொரு புகைப்படத்தை முயற்சிக்கவும்", bannerTitle: "ஜோதிடர் - 24x7 கிடைக்கும்", bannerSub: "இப்போது பேசுங்கள் — முதல் அரட்டை இலவசம்", home: "முகப்பு", chat: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்" },
    kn: { title: "ಹಸ್ತರೇಖೆ", subtitle: "ಅಂಗೈ ವಿಶ್ಲೇಷಣೆ", free: "ಉಚಿತ", errorTitle: "ದೋಷ", errSize: "ಫೋಟೋ 10MB ಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.", errType: "JPG, PNG ಅಥವಾ WEBP ಮಾತ್ರ.", uploadTitle: "ನಿಮ್ಮ ಅಂಗೈ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", uploadDesc: "ಅಂಗೈ ರೇಖೆಗಳು ನಿಮ್ಮ ಭವಿಷ್ಯದ ರಹಸ್ಯಗಳನ್ನು ಬಹಿರಂಗಪಡಿಸುತ್ತವೆ.", chooseBtn: "ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ", complete: "ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ", talkAstro: "ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ — ಉಚಿತ", tryAnother: "ಇನ್ನೊಂದು ಫೋಟೋ ಪ್ರಯತ್ನಿಸಿ", bannerTitle: "ಜ್ಯೋತಿಷಿ - 24x7 ಲಭ್ಯವಿದೆ", bannerSub: "ಈಗ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ", home: "ಮುಖಪುಟ", chat: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್" },
    bn: { title: "হস্তরেখা", subtitle: "হাতের তালু বিশ্লেষণ", free: "ফ্রি", errorTitle: "ত্রুটি", errSize: "ছবি 10MB এর কম হতে হবে।", errType: "শুধুমাত্র JPG, PNG বা WEBP।", uploadTitle: "আপনার হাতের তালুর ছবি আপলোড করুন", uploadDesc: "হাতের রেখা আপনার ভবিষ্যতের গোপনীয়তা প্রকাশ করে।", chooseBtn: "ছবি চয়ন করুন", complete: "বিশ্লেষণ সম্পন্ন", talkAstro: "জ্যোতিষীর সাথে কথা বলুন — ফ্রি", tryAnother: "অন্য ছবি চেষ্টা করুন", bannerTitle: "জ্যোতিষী - 24x7 উপলব্ধ", bannerSub: "এখনই কথা বলুন — প্রথম চ্যাট ফ্রি", home: "হোম", chat: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল" },
    mr: { title: "हस्तरेषा", subtitle: "तळहाताचे विश्लेषण", free: "मोफत", errorTitle: "त्रुटी", errSize: "फोटो 10MB पेक्षा लहान असावा.", errType: "फक्त JPG, PNG किंवा WEBP.", uploadTitle: "तुमच्या तळहाताचा फोटो अपलोड करा", uploadDesc: "हस्तरेषा तुमच्या भविष्यातील रहस्ये सांगतात.", chooseBtn: "फोटो निवडा", complete: "विश्लेषण पूर्ण", talkAstro: "ज्योतिषाशी बोला — मोफत", tryAnother: "दुसरा फोटो वापरून पहा", bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "आता बोला — पहिली चॅट मोफत", home: "होम", chat: "चॅट", daily: "दैनिक", profile: "प्रोफाइल" },
    gu: { title: "હસ્તરેખા", subtitle: "હથેળી વિશ્લેષણ", free: "મફત", errorTitle: "ભૂલ", errSize: "ફોટો 10MB થી ઓછો હોવો જોઈએ.", errType: "ફક્ત JPG, PNG અથવા WEBP.", uploadTitle: "તમારી હથેળીનો ફોટો અપલોડ કરો", uploadDesc: "હસ્તરેખાઓ તમારા ભવિષ્યના રહસ્યો જણાવે છે.", chooseBtn: "ફોટો પસંદ કરો", complete: "વિશ્લેષણ પૂર્ણ", talkAstro: "જ્યોતિષી સાથે વાત કરો — મફત", tryAnother: "બીજો ફોટો પ્રયાસ કરો", bannerTitle: "જ્યોતિષી - 24x7 ઉપલબ્ધ", bannerSub: "હમણાં વાત કરો — પ્રથમ ચેટ મફત", home: "હોમ", chat: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ" },
    ml: { title: "കൈരേഖ", subtitle: "കൈപ്പത്തി വിശകലനം", free: "സൗജന്യം", errorTitle: "പിശക്", errSize: "ഫോട്ടോ 10MB-യിൽ കുറവായിരിക്കണം.", errType: "JPG, PNG അല്ലെങ്കിൽ WEBP മാത്രം.", uploadTitle: "നിങ്ങളുടെ കൈപ്പത്തിയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക", uploadDesc: "കൈരേഖകൾ നിങ്ങളുടെ ഭാവിയുടെ രഹസ്യങ്ങൾ വെളിപ്പെടുത്തുന്നു.", chooseBtn: "ഫോട്ടോ തിരഞ്ഞെടുക്കുക", complete: "വിശകലനം പൂർത്തിയായി", talkAstro: "ജ്യോതിഷിയോട് സംസാരിക്കുക — സൗജന്യം", tryAnother: "മറ്റൊരു ഫോട്ടോ പരീക്ഷിക്കുക", bannerTitle: "ജ്യോതിഷി - 24x7 ലഭ്യമാണ്", bannerSub: "ഇപ്പോൾ സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം", home: "ഹോം", chat: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ" },
  };
  return ui[lang]?.[key] || ui["en"][key] || ui["hi"][key];
};

// 🔥 FIXED: Image Compression
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
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function PalmistryPage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [result, setResult] = useState<PalmResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Helper to get localized text
  const t = (key: string) => getUIText(lang, key);

  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c] shadow-lg" : "border-orange-100 bg-white shadow-xl";

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

        const res = await fetch("/api/palm", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          if (data?.error === "INVALID_IMAGE") {
            setPhoto(null);
            setErrorMsg(data.message || "Please upload a clear palm photo.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
          throw new Error(data?.message || data?.error || "Analysis failed");
        }

        if (!data?.success || !data?.result) throw new Error("Invalid response format.");
        setResult(data.result);

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

  const reset = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setPhoto(null); setResult(null); setErrorMsg(""); setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    // 🔥 Full Screen Layout (w-full aur min-h-[100dvh])
    <main className={`min-h-[100dvh] w-full pb-36 ${pageClass} font-sans`}>
      
      {/* Container - w-full aur px-3 kiya gaya hai */}
      <div className="w-full px-3 pt-4 space-y-5">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2.5 transition-colors ${isDark ? "bg-[#0A0F19] text-slate-300" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[17px] font-black uppercase tracking-tight text-[#ff6b00]">{t("title")}</h1>
            <p className={`text-[11px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("subtitle")}</p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black text-emerald-500 border border-emerald-500/20">{t("free")}</span>
        </header>

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div className={`rounded-xl border p-4 flex items-start gap-3 animate-in fade-in ${isDark ? "border-rose-500/30 bg-[#2a151a]" : "border-red-200 bg-red-50"}`}>
            <AlertCircle className={`shrink-0 mt-0.5 ${isDark ? "text-rose-400" : "text-red-600"}`} size={20} />
            <div>
              <h3 className={`text-[14px] font-bold ${isDark ? "text-rose-300" : "text-red-800"}`}>{t("errorTitle")}</h3>
              <p className={`text-[12.5px] font-medium mt-1 leading-relaxed ${isDark ? "text-rose-200/80" : "text-red-700"}`}>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* UPLOAD SECTION */}
        {!photo && !loading && (
          <section className={`space-y-6 rounded-[1.5rem] border p-6 text-center ${cardClass}`}>
            <div className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8A00] to-[#FF3D00] text-white shadow-lg shadow-orange-500/20`}>
              <Hand size={56} className="opacity-90" />
            </div>
            <div>
              <h2 className="text-[22px] font-black text-white">{t("uploadTitle")}</h2>
              <p className={`text-[13.5px] font-medium mt-2 leading-relaxed ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("uploadDesc")}</p>
            </div>
            
            <input ref={fileInputRef} type="file" accept="image/jpeg, image/png, image/webp" onChange={handleFile} className="hidden" id="palm-upload" />
            
            <label htmlFor="palm-upload" className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] px-4 py-4 text-[15px] font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Upload size={20} /> {t("chooseBtn")}
            </label>
          </section>
        )}

        {/* PREVIEW / LOADING SECTION */}
        {photo && (
          <section className={`space-y-4 rounded-[1.5rem] border p-6 ${cardClass}`}>
            <div className="flex flex-col items-center gap-5">
              <div className="relative">
                <img src={photo} alt="preview" className={`h-44 w-44 rounded-2xl border-4 object-cover shadow-lg ${loading ? "border-[#ff6b00] animate-pulse" : "border-emerald-500"}`} />
                {loading && <div className="absolute inset-0 rounded-2xl border-4 border-t-transparent border-[#ff6b00] animate-spin"></div>}
              </div>
              <div className="text-center">
                <p className={`text-[16px] font-bold ${loading ? "text-[#ff6b00] animate-pulse" : "text-emerald-500"}`}>{loading ? loadingText : t("complete")}</p>
              </div>
            </div>
          </section>
        )}

        {/* RESULT SECTION */}
        {result && !loading && (
          <section className={`space-y-5 rounded-[1.5rem] border-2 p-5 sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${isDark ? "border-orange-900/30 bg-[#151d2c]" : "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50"}`}>
            
            <div className="flex items-center gap-2 border-b border-slate-800/50 pb-3">
              <Star className="text-amber-500" size={24} fill="currentColor" />
              <h2 className="text-[20px] font-black text-[#ff6b00] uppercase tracking-wide">{result.title}</h2>
            </div>
            
            <p className={`text-[14.5px] font-medium leading-relaxed ${isDark ? "text-slate-300" : "text-gray-800"}`}>{result.insight}</p>
            
            <div className={`rounded-xl border p-4 relative overflow-hidden ${isDark ? "border-rose-500/30 bg-[#2a151a]" : "border-red-200 bg-red-50 shadow-inner"}`}>
              <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
              <div className="flex items-start gap-3">
                <ShieldAlert size={20} className={`shrink-0 mt-0.5 ${isDark ? "text-rose-400" : "text-red-600"}`} />
                <p className={`text-[13px] font-bold leading-relaxed ${isDark ? "text-rose-200" : "text-red-800"}`}>{result.hook}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-2">
              <Link href="/chat" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d81b60] to-[#e91e63] px-4 py-4 text-[15px] font-bold text-white shadow-lg shadow-pink-500/20 transition-transform active:scale-[0.98] animate-pulse">
                <MessageCircle size={20} /> {t("talkAstro")}
              </Link>
              <button onClick={reset} className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3.5 text-[14px] font-bold transition-colors ${isDark ? "border-slate-700 bg-[#0A0F19] text-slate-300 hover:bg-slate-800" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
                <RefreshCw size={18} /> {t("tryAnother")}
              </button>
            </div>
          </section>
        )}
      </div>

      {/* 🔥 STICKY BOTTOM BANNER & NAVIGATION (Wapas Joda Gaya Hai) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col w-full">
        
        {/* Pink Banner */}
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
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-md">
               <Crown size={16} className="text-[#d81b60]" fill="#d81b60" />
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <nav className="bg-[#0a0f19] border-t border-slate-800 flex justify-around items-center pt-2.5 pb-5 px-2 w-full">
          <Link href="/" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
            <Home size={22} />
            <span className="text-[11px] font-medium">{t("home")}</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
            <MessageCircle size={22} />
            <span className="text-[11px] font-medium">{t("chat")}</span>
          </Link>
          <Link href="/daily" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
            <Sun size={22} />
            <span className="text-[11px] font-medium">{t("daily")}</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
            <User size={22} />
            <span className="text-[11px] font-medium">{t("profile")}</span>
          </Link>
        </nav>
      </div>

    </main>
  );
}
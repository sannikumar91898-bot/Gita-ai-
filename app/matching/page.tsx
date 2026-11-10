// app/matching/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, Heart, Sparkles, MessageCircle, Download, 
  RefreshCw, ShieldAlert, MapPin, Calendar, Clock, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

// 🔥 Loading Text for 10 Languages
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

// 🔥 Global Translation Helper for UI
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: { 
      title: "कुंडली मिलान", subtitle: "सटीक विवाह मिलान", boy: "वर (लड़के) का विवरण", girl: "वधू (लड़की) का विवरण", 
      name: "पूरा नाम", city: "जन्म स्थान (City)", matchBtn: "मिलान करें", alertCity: "कृपया लिस्ट से शहर चुनें!", 
      result: "मिलान परिणाम", total: "/ 36 कुल अष्टकूट मिलान", breakdown: "विस्तृत विवरण", 
      chat: "ज्योतिषी से बात करें — पहली चैट FREE", pdf: "PDF डाउनलोड", reset: "दोबारा बनाएं",
      bannerTitle: "ज्योतिषी • 24x7 उपलब्ध", bannerSub: "रुकावट का कारण जानने के लिए चैट करें — FREE",
      warning: "विवाह जीवन का सबसे बड़ा निर्णय है। कुंडली में छिपे दोष (जैसे मंगल दोष) रिश्तों में रुकावट ला सकते हैं।"
    },
    hinglish: { 
      title: "Kundli Milan", subtitle: "Accurate Marriage Matching", boy: "Boy's Details", girl: "Girl's Details", 
      name: "Full Name", city: "Birth City", matchBtn: "Milan Karein", alertCity: "Kripya list me se city select karein!", 
      result: "Matching Result", total: "/ 36 Total Ashtakoot", breakdown: "Detailed Breakdown", 
      chat: "Jyotishi se baat karein — Pehli chat FREE", pdf: "PDF Download", reset: "Reset",
      bannerTitle: "Astrologer • 24x7 Available", bannerSub: "Rukawat ka karan jaanne ke liye chat karein — FREE",
      warning: "Vivah jeevan ka sabse bada nirnay hai. Kundli mein chhipe dosh rishton mein rukawat la sakte hain."
    },
    en: { 
      title: "Kundli Matching", subtitle: "Accurate Marriage Matching", boy: "Boy's Details", girl: "Girl's Details", 
      name: "Full Name", city: "Birth City", matchBtn: "Match Now", alertCity: "Please select a valid city from the list!", 
      result: "Matching Result", total: "/ 36 Total Ashtakoot", breakdown: "Detailed Breakdown", 
      chat: "Talk to Astrologer — First chat FREE", pdf: "PDF", reset: "Reset",
      bannerTitle: "Astrologer • 24x7 Available", bannerSub: "Chat to know the cause of blockage — FREE",
      warning: "Marriage is life's biggest decision. Hidden doshas can bring obstructions."
    },
    te: { title: "కుండలి మిలన్", subtitle: "ఖచ్చితమైన వివాహ మ్యాచింగ్", boy: "అబ్బాయి వివరాలు", girl: "అమ్మాయి వివరాలు", name: "పూర్తి పేరు", city: "పుట్టిన నగరం", matchBtn: "మ్యాచ్ చేయండి", alertCity: "దయచేసి జాబితా నుండి నగరాన్ని ఎంచుకోండి!", result: "మ్యాచింగ్ ఫలితం", total: "/ 36 మొత్తం అష్టకూట్", breakdown: "వివరమైన విభజన", chat: "జ్యోతిష్యుడితో మాట్లాడండి — మొదటి చాట్ FREE", pdf: "PDF", reset: "రీసెట్", bannerTitle: "జ్యోతిష్యుడు • 24x7 అందుబాటులో", bannerSub: "అడ్డంకి కారణం తెలుసుకోవడానికి చాట్ చేయండి", warning: "వివాహం జీవితంలో అతిపెద్ద నిర్ణయం. దాచిన దోషాలు అడ్డంకులు కలిగిస్తాయి." },
    ta: { title: "ஜாதக பொருத்தம்", subtitle: "துல்லியமான திருமண பொருத்தம்", boy: "ஆண் விவரங்கள்", girl: "பெண் விவரங்கள்", name: "முழு பெயர்", city: "பிறந்த நகரம்", matchBtn: "பொருத்தம் பார்க்க", alertCity: "பட்டியலில் இருந்து நகரத்தை தேர்ந்தெடுக்கவும்!", result: "பொருத்தம் முடிவு", total: "/ 36 மொத்த அஷ்டகூடம்", breakdown: "விரிவான பிரிவு", chat: "ஜோதிடரிடம் பேசுங்கள் — முதல் அரட்டை FREE", pdf: "PDF", reset: "மீட்டமை", bannerTitle: "ஜோதிடர் • 24x7 கிடைக்கும்", bannerSub: "தடைக்கான காரணத்தை அறிய அரட்டை செய்யுங்கள்", warning: "திருமணம் வாழ்க்கையின் மிகப்பெரிய முடிவு. மறைந்துள்ள தோஷங்கள் தடைகளை ஏற்படுத்தும்." },
    kn: { title: "ಕುಂಡಲಿ ಹೊಂದಾಣಿಕೆ", subtitle: "ನಿಖರವಾದ ವಿವಾಹ ಹೊಂದಾಣಿಕೆ", boy: "ಹುಡುಗನ ವಿವರಗಳು", girl: "ಹುಡುಗಿಯ ವಿವರಗಳು", name: "ಪೂರ್ಣ ಹೆಸರು", city: "ಹುಟ್ಟಿದ ನಗರ", matchBtn: "ಹೊಂದಿಸಿ", alertCity: "ದಯವಿಟ್ಟು ಪಟ್ಟಿಯಿಂದ ನಗರವನ್ನು ಆಯ್ಕೆಮಾಡಿ!", result: "ಹೊಂದಾಣಿಕೆಯ ಫಲಿತಾಂಶ", total: "/ 36 ಒಟ್ಟು ಅಷ್ಟಕೂಟ", breakdown: "ವಿವರವಾದ ವಿಭಜನೆ", chat: "ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ FREE", pdf: "PDF", reset: "ಮರುಹೊಂದಿಸಿ", bannerTitle: "ಜ್ಯೋತಿಷಿ • 24x7 ಲಭ್ಯವಿದೆ", bannerSub: "ತಡೆಯ ಕಾರಣವನ್ನು ತಿಳಿಯಲು ಚಾಟ್ ಮಾಡಿ", warning: "ವಿವಾಹವು ಜೀವನದ ದೊಡ್ಡ ನಿರ್ಧಾರವಾಗಿದೆ. ಗುಪ್ತ ದೋಷಗಳು ತಡೆಗಳನ್ನು ತರಬಹುದು." },
    bn: { title: "কুণ্ডলী মিলন", subtitle: "সঠিক বিবাহ ম্যাচিং", boy: "ছেলের বিবরণ", girl: "মেয়ের বিবরণ", name: "পুরো নাম", city: "জন্ম শহর", matchBtn: "মিলন করুন", alertCity: "অনুগ্রহ করে তালিকা থেকে শহর নির্বাচন করুন!", result: "মিলন ফলাফল", total: "/ 36 মোট অষ্টকূট", breakdown: "বিস্তারিত ব্রেকডাউন", chat: "জ্যোতিষীর সাথে কথা বলুন — প্রথম চ্যাট FREE", pdf: "PDF", reset: "রিসেট", bannerTitle: "জ্যোতিষী • 24x7 উপলব্ধ", bannerSub: "বাধার কারণ জানতে চ্যাট করুন", warning: "বিবাহ জীবনের সবচেয়ে বড় সিদ্ধান্ত। লুকানো দোষ বাধা সৃষ্টি করতে পারে।" },
    mr: { title: "कुंडली मिलन", subtitle: "अचूक विवाह जुळणी", boy: "मुलाचे तपशील", girl: "मुलीचे तपशील", name: "पूर्ण नाव", city: "जन्म शहर", matchBtn: "जुळवा", alertCity: "कृपया यादीतून शहर निवडा!", result: "जुळणी निकाल", total: "/ 36 एकूण अष्टकूट", breakdown: "तपशीलवार विभागणी", chat: "ज्योतिषाशी बोला — पहिली चॅट FREE", pdf: "PDF", reset: "रीसेट", bannerTitle: "ज्योतिषी • 24x7 उपलब्ध", bannerSub: "अडथळ्याचे कारण जाणून घेण्यासाठी चॅट करा", warning: "विवाह हा जीवनातील सर्वात मोठा निर्णय आहे. लपलेले दोष अडथळे आणू शकतात." },
    gu: { title: "કુંડળી મેળાપ", subtitle: "સચોટ લગ્ન મેચિંગ", boy: "છોકરાની વિગતો", girl: "છોકરીની વિગતો", name: "પૂરું નામ", city: "જન્મ શહેર", matchBtn: "મેળવો", alertCity: "કૃપા કરીને સૂચિમાંથી શહેર પસંદ કરો!", result: "મેચિંગ પરિણામ", total: "/ 36 કુલ અષ્ટકૂટ", breakdown: "વિગતવાર વિભાજન", chat: "જ્યોતિષી સાથે વાત કરો — પ્રથમ ચેટ FREE", pdf: "PDF", reset: "રીસેટ", bannerTitle: "જ્યોતિષી • 24x7 ઉપલબ્ધ", bannerSub: "અવરોધનું કારણ જાણવા ચેટ કરો", warning: "લગ્ન એ જીવનનો સૌથી મોટો નિર્ણય છે. છુપાયેલા દોષ અવરોધ લાવી શકે છે." },
    ml: { title: "കുണ്ഡലി മാച്ചിംഗ്", subtitle: "കൃത്യമായ വിവാഹ മാച്ചിംഗ്", boy: "ആൺകുട്ടിയുടെ വിവരങ്ങൾ", girl: "പെൺകുട്ടിയുടെ വിവരങ്ങൾ", name: "പൂർണ്ണ നാമം", city: "ജനന നഗരം", matchBtn: "മാച്ച് ചെയ്യുക", alertCity: "ലിസ്റ്റിൽ നിന്ന് ഒരു നഗരം തിരഞ്ഞെടുക്കുക!", result: "മാച്ചിംഗ് ഫലം", total: "/ 36 മൊത്തം അഷ്ടകൂട്ടം", breakdown: "വിശദമായ വിഭജനം", chat: "ജ്യോതിഷിയോട് സംസാരിക്കുക — ആദ്യ ചാറ്റ് FREE", pdf: "PDF", reset: "പുനഃസജ്ജമാക്കുക", bannerTitle: "ജ്യോതിഷി • 24x7 ലഭ്യമാണ്", bannerSub: "തടസ്സത്തിന്റെ കാരണം അറിയാൻ ചാറ്റ് ചെയ്യുക", warning: "വിവാഹം ജീവിതത്തിലെ ഏറ്റവും വലിയ തീരുമാനമാണ്. മറഞ്ഞിരിക്കുന്ന ദോഷങ്ങൾ തടസ്സങ്ങൾ ഉണ്ടാക്കാം." },
  };
  return ui[lang]?.[key] || ui["en"][key];
};

export default function MatchingPage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  
  const [boy, setBoy] = useState({ name: "", dob: "", time: "", city: "", lat: "", lon: "" });
  const [girl, setGirl] = useState({ name: "", dob: "", time: "", city: "", lat: "", lon: "" });
  
  const [boySuggestions, setBoySuggestions] = useState([]);
  const [girlSuggestions, setGirlSuggestions] = useState([]);
  
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  // Helper to get localized text
  const t = (key: string) => getUIText(lang, key);

  // Premium Colors
  const pageClass = isDark ? "bg-[#0B0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151E2E] shadow-2xl" : "border-orange-100 bg-white shadow-xl";
  const inputClass = `mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-orange-500/30 ${isDark ? "border-slate-700 bg-slate-800/50 text-white focus:border-orange-500" : "border-gray-200 bg-gray-50 text-slate-900 focus:border-orange-400"}`;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const steps = getLoadingSteps(lang);
    if (loading) {
      setLoadingText(steps[0]);
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % steps.length;
        setLoadingText(steps[i]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading, lang]);

  const searchCity = async (query: string, setSuggestions: any) => {
    if (query.length < 3) { setSuggestions([]); return; }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`);
      const data = await res.json();
      setSuggestions(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    const delay = setTimeout(() => searchCity(boy.city, setBoySuggestions), 600);
    return () => clearTimeout(delay);
  }, [boy.city]);

  useEffect(() => {
    const delay = setTimeout(() => searchCity(girl.city, setGirlSuggestions), 600);
    return () => clearTimeout(delay);
  }, [girl.city]);

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
        // 🔥 IMPORTANT: Backend ko language bhej rahe hain
        body: JSON.stringify({ boy, girl, language: lang }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResult(data);
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

  const resetForm = () => {
    setBoy({ name: "", dob: "", time: "", city: "", lat: "", lon: "" });
    setGirl({ name: "", dob: "", time: "", city: "", lat: "", lon: "" });
    setResult(null);
  };

  return (
    <main className={`min-h-screen w-full px-4 pb-32 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2 transition-colors ${isDark ? "bg-slate-800 text-orange-400 hover:bg-slate-700" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}>
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-black uppercase tracking-tight text-orange-500">
              {t("title")}
            </h1>
            <p className={`text-[11px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              {t("subtitle")}
            </p>
          </div>
        </header>

        {/* FORM SCREEN */}
        {!result && !loading && (
          <>
            <div className={`rounded-xl border p-4 ${isDark ? "border-rose-900/50 bg-rose-950/20" : "border-red-200 bg-red-50"}`}>
              <p className={`flex items-start gap-2 text-xs font-bold leading-5 ${isDark ? "text-rose-300" : "text-red-700"}`}>
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                {t("warning")}
              </p>
            </div>

            <form onSubmit={handleMatch} className={`space-y-6 rounded-3xl border p-5 sm:p-6 ${cardClass}`}>
              
              {/* BOY DETAILS */}
              <div className={`space-y-3 p-4 rounded-2xl border ${isDark ? "border-slate-700/50 bg-slate-800/20" : "border-gray-200 bg-gray-50"}`}>
                <h3 className="text-sm font-bold text-orange-500 flex items-center gap-2">
                  <span className="bg-orange-500/10 p-1.5 rounded-lg">👦</span> {t("boy")}
                </h3>
                <input type="text" required placeholder={t("name")} value={boy.name} onChange={e => setBoy({...boy, name: e.target.value})} className={inputClass} />
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-4 text-gray-400" />
                    <input type="date" required value={boy.dob} onChange={e => setBoy({...boy, dob: e.target.value})} className={`${inputClass} pl-9`} />
                  </div>
                  <div className="relative">
                    <Clock size={14} className="absolute left-3 top-4 text-gray-400" />
                    <input type="time" required value={boy.time} onChange={e => setBoy({...boy, time: e.target.value})} className={`${inputClass} pl-9`} />
                  </div>
                </div>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-4 text-gray-400" />
                  <input type="text" required placeholder={t("city")} value={boy.city} onChange={e => setBoy({...boy, city: e.target.value, lat: "", lon: ""})} className={`${inputClass} pl-9`} />
                  {boySuggestions.length > 0 && (
                    <ul className={`absolute z-10 w-full mt-1 rounded-xl max-h-40 overflow-y-auto shadow-2xl border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
                      {boySuggestions.map((item: any) => (
                        <li key={item.place_id} className={`px-4 py-2.5 text-xs cursor-pointer hover:bg-orange-50 dark:hover:bg-slate-700 ${isDark ? "text-slate-200" : "text-slate-800"}`} onClick={() => { setBoy({ ...boy, city: item.display_name.split(',')[0], lat: item.lat, lon: item.lon }); setBoySuggestions([]); }}>
                          {item.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex justify-center text-orange-500 py-1">
                <Heart size={24} fill="currentColor" className="animate-pulse" />
              </div>

              {/* GIRL DETAILS */}
              <div className={`space-y-3 p-4 rounded-2xl border ${isDark ? "border-slate-700/50 bg-slate-800/20" : "border-gray-200 bg-gray-50"}`}>
                <h3 className="text-sm font-bold text-orange-500 flex items-center gap-2">
                  <span className="bg-orange-500/10 p-1.5 rounded-lg">👧</span> {t("girl")}
                </h3>
                <input type="text" required placeholder={t("name")} value={girl.name} onChange={e => setGirl({...girl, name: e.target.value})} className={inputClass} />
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-4 text-gray-400" />
                    <input type="date" required value={girl.dob} onChange={e => setGirl({...girl, dob: e.target.value})} className={`${inputClass} pl-9`} />
                  </div>
                  <div className="relative">
                    <Clock size={14} className="absolute left-3 top-4 text-gray-400" />
                    <input type="time" required value={girl.time} onChange={e => setGirl({...girl, time: e.target.value})} className={`${inputClass} pl-9`} />
                  </div>
                </div>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-4 text-gray-400" />
                  <input type="text" required placeholder={t("city")} value={girl.city} onChange={e => setGirl({...girl, city: e.target.value, lat: "", lon: ""})} className={`${inputClass} pl-9`} />
                  {girlSuggestions.length > 0 && (
                    <ul className={`absolute z-10 w-full mt-1 rounded-xl max-h-40 overflow-y-auto shadow-2xl border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
                      {girlSuggestions.map((item: any) => (
                        <li key={item.place_id} className={`px-4 py-2.5 text-xs cursor-pointer hover:bg-orange-50 dark:hover:bg-slate-700 ${isDark ? "text-slate-200" : "text-slate-800"}`} onClick={() => { setGirl({ ...girl, city: item.display_name.split(',')[0], lat: item.lat, lon: item.lon }); setGirlSuggestions([]); }}>
                          {item.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                {loading ? loadingText : t("matchBtn")}
              </button>
            </form>
          </>
        )}

        {/* LOADING SCREEN */}
        {loading && (
          <div className={`flex flex-col items-center justify-center h-[50vh] rounded-3xl border ${cardClass}`}>
            <Sparkles size={40} className="text-orange-500 animate-spin mb-4" />
            <p className="text-sm font-bold text-orange-500 animate-pulse">{loadingText}</p>
          </div>
        )}

        {/* RESULT SCREEN */}
        {result && !loading && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* PDF TARGET AREA */}
            <div ref={resultRef} className={`space-y-4 rounded-3xl border-2 p-5 sm:p-6 relative overflow-hidden ${isDark ? "border-orange-900/30 bg-[#151E2E]" : "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50"}`}>
              
              <div className="flex items-center gap-2 relative z-10">
                <Sparkles className="text-amber-500" size={20} />
                <p className="text-sm font-black text-orange-500 uppercase tracking-widest">{t("result")}</p>
              </div>

              <div className="text-center py-6 relative z-10 border-b border-gray-200 dark:border-slate-700/50">
                <p className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-400 to-orange-600 drop-shadow-sm">{result.score}</p>
                <p className={`text-sm font-bold mt-2 ${isDark ? "text-slate-300" : "text-gray-800"}`}>{t("total")}</p>
                <p className={`text-xs font-semibold mt-1 tracking-wide ${isDark ? "text-slate-400" : "text-gray-500"}`}>{boy.name} ❤️ {girl.name}</p>
              </div>

              {/* 8-POINT BREAKDOWN */}
              <div className="py-2 relative z-10">
                <h4 className={`text-xs font-bold mb-3 uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("breakdown")}</h4>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  {result.details.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs border-b border-dashed border-gray-200 dark:border-slate-700/50 pb-1">
                      <span className={`font-medium ${isDark ? "text-slate-300" : "text-gray-700"}`}>{item.name}</span>
                      <span className={`font-black ${item.score === 0 ? 'text-red-500' : 'text-emerald-500'}`}>{item.score}/{item.max}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DYNAMIC FEAR / SAFE MESSAGE FROM BACKEND */}
              <div className={`rounded-xl border p-4 relative z-10 ${isDark ? "border-slate-700 bg-slate-800/50" : "border-orange-200 bg-white shadow-sm"}`}>
                {result.dangerLevel === 'safe' ? (
                   <p className={`text-xs font-bold leading-5 flex gap-2 ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>
                     <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> 
                     {result.fearMessage || "Aapka milan bahut acha hai. Koi bada dosh nahi hai."}
                   </p>
                ) : (
                  <p className={`text-xs font-bold leading-5 flex gap-2 ${isDark ? "text-rose-300" : "text-red-800"}`}>
                    <ShieldAlert size={16} className="shrink-0 mt-0.5 text-red-500" />
                    {result.fearMessage}
                  </p>
                )}
              </div>

              <div className={`text-center text-[9px] mt-2 relative z-10 font-medium ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                Generated by Gita AI • www.gita-ai.com
              </div>
            </div>

            {/* CTA BUTTONS */}
            <div className="space-y-3 pt-2">
              <Link 
                href="/chat" 
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 px-4 py-4 text-sm font-black text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all active:scale-[0.98] hover:shadow-[0_0_25px_rgba(225,29,72,0.6)] animate-pulse"
              >
                <MessageCircle size={20} />
                {t("chat")}
              </Link>

              <div className="flex gap-3">
                <button 
                  onClick={downloadPdf} 
                  disabled={isDownloading} 
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md active:scale-[0.98] transition-transform hover:bg-emerald-500 disabled:opacity-50"
                >
                  {isDownloading ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />}
                  {t("pdf")}
                </button>
                
                <button 
                  onClick={resetForm} 
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-3.5 text-sm font-bold shadow-sm active:scale-[0.98] transition-transform ${isDark ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  <RefreshCw size={18} />
                  {t("reset")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FIXED BOTTOM BAR */}
      {result && !loading && (
        <Link href="/chat" className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 px-4 py-3.5 text-white shadow-[0_-10px_30px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-full">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
              <MessageCircle size={18} />
            </span>
            <div className="leading-tight">
              <p className="text-[10px] font-black uppercase tracking-wider text-rose-100">
                {t("bannerTitle")}
              </p>
              <p className="text-sm font-black">
                {t("bannerSub")}
              </p>
            </div>
          </div>
        </Link>
      )}
    </main>
  );
}
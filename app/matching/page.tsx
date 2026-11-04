// app/matching/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, Heart, Sparkles, MessageCircle, Download, 
  RefreshCw, ShieldAlert, MapPin, Calendar, Clock
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

const LOADING_STEPS = [
  "Aligning planetary positions...",
  "Calculating Nadi and Bhakoot scores...",
  "Analyzing Manglik Dosha...",
  "Generating Cosmic Diagnostic Report..."
];

export default function MatchingPage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  // State for Form Data
  const [boy, setBoy] = useState({ name: "", dob: "", time: "", city: "", lat: "", lon: "" });
  const [girl, setGirl] = useState({ name: "", dob: "", time: "", city: "", lat: "", lon: "" });
  
  const [boySuggestions, setBoySuggestions] = useState([]);
  const [girlSuggestions, setGirlSuggestions] = useState([]);
  
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(LOADING_STEPS[0]);
  const [isDownloading, setIsDownloading] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  const t = (hi: string, hing: string, en: string) => isHindi ? hi : isHinglish ? hing : en;

  const pageClass = isDark ? "bg-slate-950 text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-slate-900 shadow-xl" : "border-orange-100 bg-white shadow-xl";
  const inputClass = `mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors ${isDark ? "border-slate-700 bg-slate-800 text-white" : "border-orange-200 bg-orange-50 text-slate-900"}`;

  // Rotating Loading Text Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % LOADING_STEPS.length;
        setLoadingText(LOADING_STEPS[i]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // City Search (OpenStreetMap Nominatim)
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
      alert(t("Kripya list me se city select karein!", "Please select city from list!", "Please select a valid city from the list!"));
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boy, girl }),
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
    <main className={`min-h-screen w-full px-4 pb-40 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-violet-200" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-black uppercase tracking-tight text-orange-600">
              {t("कुंडली मिलान", "Kundli Milan", "Kundli Matching")}
            </h1>
            <p className="text-[11px] font-bold text-gray-400">
              {t("सटीक विवाह मिलान", "Accurate Marriage Matching", "Accurate Marriage Matching")}
            </p>
          </div>
        </header>

        {/* WARNING / HOOK */}
        <div className={`rounded-xl border p-4 ${isDark ? "border-rose-900 bg-rose-950/30" : "border-rose-200 bg-rose-50"}`}>
          <p className={`flex items-start gap-2 text-xs font-bold leading-5 ${isDark ? "text-rose-200" : "text-rose-800"}`}>
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            {t(
              "विवाह जीवन का सबसे बड़ा निर्णय है। कुंडली में छिपे दोष (जैसे मंगल दोष) रिश्तों में रुकावट ला सकते हैं। सही समय पर सही उपाय जानें, वरना देरी या अलगाव हो सकता है।",
              "Vivah jeevan ka sabse bada nirnay hai. Kundli mein chhipe dosh (jaise Mangal Dosh) rishton mein rukawat la sakte hain. Sahi samay par sahi upay jaanें, warna deri ya alagav ho sakta hai.",
              "Marriage is life's biggest decision. Hidden doshas (like Mangal Dosh) can bring obstructions in relationships. Know the right remedies at the right time to avoid delays or separation."
            )}
          </p>
        </div>

        {/* FORM */}
        {!result && (
          <form onSubmit={handleMatch} className={`space-y-6 rounded-2xl border p-5 ${cardClass}`}>
            
            {/* BOY DETAILS */}
            <div className="space-y-3 p-4 rounded-xl border border-indigo-100 dark:border-slate-800 bg-indigo-50/30 dark:bg-slate-900/50">
              <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">👦 {t("वर (लड़के) का विवरण", "Boy's Details", "Boy's Details")}</h3>
              <input type="text" required placeholder={t("नाम", "Name", "Name")} value={boy.name} onChange={e => setBoy({...boy, name: e.target.value})} className={inputClass} />
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
                <input type="text" required placeholder={t("जन्म स्थान (City)", "Birth City", "Birth City")} value={boy.city} onChange={e => setBoy({...boy, city: e.target.value, lat: "", lon: ""})} className={`${inputClass} pl-9`} />
                {boySuggestions.length > 0 && (
                  <ul className={`absolute z-10 w-full mt-1 rounded-lg max-h-40 overflow-y-auto shadow-xl border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
                    {boySuggestions.map((item: any) => (
                      <li key={item.place_id} className={`px-4 py-2 text-xs cursor-pointer hover:bg-orange-50 dark:hover:bg-slate-700 ${isDark ? "text-slate-200" : "text-slate-800"}`} onClick={() => { setBoy({ ...boy, city: item.display_name.split(',')[0], lat: item.lat, lon: item.lon }); setBoySuggestions([]); }}>
                        {item.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex justify-center text-orange-400 py-1">
              <Heart size={24} fill="currentColor" className="animate-pulse" />
            </div>

            {/* GIRL DETAILS */}
            <div className="space-y-3 p-4 rounded-xl border border-rose-100 dark:border-slate-800 bg-rose-50/30 dark:bg-slate-900/50">
              <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">👧 {t("वधू (लड़की) का विवरण", "Girl's Details", "Girl's Details")}</h3>
              <input type="text" required placeholder={t("नाम", "Name", "Name")} value={girl.name} onChange={e => setGirl({...girl, name: e.target.value})} className={inputClass} />
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
                <input type="text" required placeholder={t("जन्म स्थान (City)", "Birth City", "Birth City")} value={girl.city} onChange={e => setGirl({...girl, city: e.target.value, lat: "", lon: ""})} className={`${inputClass} pl-9`} />
                {girlSuggestions.length > 0 && (
                  <ul className={`absolute z-10 w-full mt-1 rounded-lg max-h-40 overflow-y-auto shadow-xl border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
                    {girlSuggestions.map((item: any) => (
                      <li key={item.place_id} className={`px-4 py-2 text-xs cursor-pointer hover:bg-orange-50 dark:hover:bg-slate-700 ${isDark ? "text-slate-200" : "text-slate-800"}`} onClick={() => { setGirl({ ...girl, city: item.display_name.split(',')[0], lat: item.lat, lon: item.lon }); setGirlSuggestions([]); }}>
                        {item.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3.5 text-sm font-bold text-white shadow-md transition-all active:scale-[0.98] disabled:opacity-50">
              {loading ? loadingText : t("मिलान करें", "Milan Karein", "Match Now")}
            </button>
          </form>
        )}

        {/* RESULT */}
        {result && !loading && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* PDF TARGET AREA START */}
            <div ref={resultRef} className={`space-y-4 rounded-2xl border-2 p-5 relative overflow-hidden ${isDark ? "border-orange-900/50 bg-slate-900" : "border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50"}`}>
              
              <div className="absolute -right-10 -top-10 text-orange-500/5 rotate-12 pointer-events-none">
                <Sparkles size={150} />
              </div>

              <div className="flex items-center gap-2 relative z-10">
                <Sparkles className="text-amber-500" size={18} />
                <p className="text-sm font-black text-orange-600">{t("मिलान परिणाम", "Matching Result", "Matching Result")}</p>
              </div>

              <div className="text-center py-4 relative z-10">
                <p className={`text-6xl font-black ${isDark ? "text-orange-400" : "text-orange-600"} drop-shadow-sm`}>{result.score}</p>
                <p className={`text-sm font-bold mt-1 ${isDark ? "text-slate-200" : "text-gray-800"}`}>{t("/ 36 कुल अष्टकूट मिलान", "/ 36 Total Ashtakoot", "/ 36 Total Ashtakoot")}</p>
                <p className={`text-xs font-medium mt-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>{boy.name} ❤️ {girl.name}</p>
              </div>

              {/* 8-POINT BREAKDOWN */}
              <div className={`p-4 rounded-xl border relative z-10 ${isDark ? "border-slate-700 bg-slate-800/50" : "border-orange-200 bg-white/60"}`}>
                <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase">Detailed Breakdown</h4>
                <div className="grid grid-cols-2 gap-3">
                  {result.details.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className={isDark ? "text-slate-300" : "text-gray-700"}>{item.name}</span>
                      <span className={`font-bold ${item.score === 0 ? 'text-red-500' : 'text-green-500'}`}>{item.score}/{item.max}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PSYCHOLOGICAL HOOK */}
              <div className={`rounded-xl border p-4 relative z-10 ${isDark ? "border-rose-900/50 bg-rose-950/40" : "border-rose-200 bg-rose-50 shadow-inner"}`}>
                <p className={`text-xs font-bold leading-5 ${isDark ? "text-rose-200" : "text-rose-900"}`}>
                  ⚠️ {result.fearMessage}
                </p>
              </div>

              <div className={`text-center text-[9px] mt-2 relative z-10 ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                {t("जनरेट किया गया", "Generated by", "Generated by")} Gita AI • www.gita-ai.com
              </div>
            </div>
            {/* PDF TARGET AREA END */}

            {/* CTA BUTTONS */}
            <div className="space-y-3 pt-2">
              <Link href="/chat" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-3.5 text-sm font-black text-white shadow-lg active:scale-[0.98] transition-transform animate-pulse">
                <MessageCircle size={18} />
                {t("ज्योतिषी से बात करें — पहली चैट FREE", "Jyotishi se baat karein — Pehli chat FREE", "Talk to Astrologer — First chat FREE")}
              </Link>

              <div className="flex gap-3">
                <button onClick={downloadPdf} disabled={isDownloading} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-md active:scale-[0.98] transition-transform hover:bg-green-700 disabled:opacity-50">
                  {isDownloading ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />}
                  {t("PDF डाउनलोड", "PDF Download", "Download PDF")}
                </button>
                <button onClick={resetForm} className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-3.5 text-sm font-bold shadow-sm active:scale-[0.98] transition-transform ${isDark ? "border-slate-700 bg-slate-800 text-orange-400" : "border-orange-200 bg-white text-orange-600"}`}>
                  <RefreshCw size={18} />
                  {t("दोबारा बनाएं", "Dobara Banayein", "Reset")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FIXED BOTTOM BAR */}
      <Link href="/chat" className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 px-4 py-3.5 text-white shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
            <MessageCircle size={18} />
          </span>
          <div className="leading-tight">
            <p className="text-[10px] font-black uppercase tracking-wider text-rose-100">
              {t("ज्योतिषी • 24x7 उपलब्ध", "Astrologer • 24x7 Available", "Astrologer • 24x7 Available")}
            </p>
            <p className="text-sm font-black">
              {t("रुकावट का कारण जानने के लिए चैट करें — FREE", "Rukawat ka karan jaanne ke liye chat karein — FREE", "Chat to know the cause of blockage — FREE")}
            </p>
          </div>
        </div>
      </Link>
    </main>
  );
}
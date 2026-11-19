// app/[lang]/kundli/KundliClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Sparkles, Download, RefreshCcw, Star, 
  ShieldCheck, Home, MessageCircle, Sun, User, Loader2, FileText
} from "lucide-react";
import { useApp } from "../../Providers"; // Path check kar lein (agar [lang] folder ke bahar hai toh)

// ============================================================
// 10 Language Translation Helper
// ============================================================
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: { 
      title: "जन्म कुंडली", subtitle: "गीता ज्योतिषी द्वारा तैयार", name: "पूरा नाम", dob: "जन्म तिथि", time: "जन्म का समय", place: "जन्म स्थान", calc: "गणना हो रही है...", generate: "कुंडली बनाएं", chart: "जन्म कुंडली", by: "गीता ज्योतिषी द्वारा", lagna: "लग्न", rashi: "चंद्र राशि", nakshatra: "नक्षत्र", dasha: "वर्तमान दशा", planetsTitle: "ग्रह स्पष्ट", planet: "ग्रह", sign: "राशि", house: "भाव", noPlanets: "ग्रहों की जानकारी उपलब्ध नहीं है", generated: "तैयार किया गया", notice: "विशेष सुझाव:", scareText: "अपनी कुंडली के ग्रहों और सही करियर/विवाह टाइमिंग को समझने के लिए हमारी ज्योतिषी से बात करें।", chatCTA: "ज्योतिषी से बात करें — पहली चैट मुफ्त", wait: "रुकें...", download: "PDF डाउनलोड", again: "दोबारा बनाएं", consentText: "मैं अपनी जन्म तिथि, समय और स्थान को सुरक्षित रूप से सहेजने की सहमति देता/देती हूँ।", unknownTime: "मुझे अपना सही जन्म समय नहीं पता (12:00 PM मान लिया जाएगा)", aiReport: "ज्योतिषीय विश्लेषण", loadingHistory: "आपकी पुरानी कुंडली लोड हो रही है...", moonDegree: "चंद्र डिग्री"
    },
    hinglish: { 
      title: "Janam Kundli", subtitle: "Gita Jyotishi dwara taiyar", name: "Full Name", dob: "Date of Birth", time: "Time of Birth", place: "Place of Birth", calc: "Calculating...", generate: "Generate Kundli", chart: "Birth Chart", by: "By Gita Jyotishi", lagna: "Lagna", rashi: "Moon Sign", nakshatra: "Nakshatra", dasha: "Current Dasha", planetsTitle: "Graha Spashta", planet: "Planet", sign: "Sign", house: "House", noPlanets: "Planetary details unavailable", generated: "Generated on", notice: "Special Advice:", scareText: "Apni kundli ke grahon aur sahi career/vivah timing ko samajhne ke liye humari jyotishi se baat karein.", chatCTA: "Jyotishi se baat karein — First chat FREE", wait: "Wait...", download: "Download PDF", again: "Calculate Again", consentText: "Main apni janm tithi, samay aur sthan ko securely save karne ki consent deta/deti hoon.", unknownTime: "Mujhe apna exact birth time nahi pata (12:00 PM assume kiya jayega)", aiReport: "Jyotishiy Vishleshan", loadingHistory: "Aapki purani kundli load ho rahi hai...", moonDegree: "Moon Degree"
    },
    en: { 
      title: "Janam Kundli", subtitle: "Prepared by Gita Jyotishi", name: "Full Name", dob: "Date of Birth", time: "Time of Birth", place: "Place of Birth", calc: "Calculating...", generate: "Generate Kundli", chart: "Birth Chart", by: "By Gita Jyotishi", lagna: "Lagna", rashi: "Moon Sign", nakshatra: "Nakshatra", dasha: "Current Dasha", planetsTitle: "Planetary Positions", planet: "Planet", sign: "Sign", house: "House", noPlanets: "Planetary details unavailable", generated: "Generated on", notice: "Special Advice:", scareText: "Talk to our Jyotishi to understand the planets in your chart and accurate career/marriage timing.", chatCTA: "Talk to Jyotishi — First chat FREE", wait: "Wait...", download: "Download PDF", again: "Calculate Again", consentText: "I consent to storing my birth details securely to generate my personal kundli and readings.", unknownTime: "I don't know my exact birth time (12:00 PM will be assumed)", aiReport: "Astrological Analysis", loadingHistory: "Loading your previous kundli...", moonDegree: "Moon Degree"
    },
    // ... (aap baaki 7 languages yahan add kar sakte hain)
  };
  return ui[lang]?.[key] || ui["en"][key] || ui["hi"][key] || "";
};

export default function KundliClient() {
  const { theme, lang, me } = useApp();
  const router = useRouter();
  const isDark = theme === "dark";
  
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [chart, setChart] = useState<any>(null);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [suggestedChatPrompt, setSuggestedChatPrompt] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [notSureTime, setNotSureTime] = useState(false);

  const pdfRef = useRef<HTMLDivElement>(null);
  const t = (key: string) => getUIText(lang, key);

  useEffect(() => {
    let cancelled = false;
    async function fetchExisting() {
      try {
        const res = await fetch("/api/kundli", { cache: "no-store" });
        const data = await res.json().catch(() => null);
        if (cancelled || !data) return;
        
        if (data.chart) setChart(data.chart);
        if (data.interpretation && typeof data.interpretation === "string") setInterpretation(data.interpretation);
        if (data.suggestedChatPrompt && typeof data.suggestedChatPrompt === "string") setSuggestedChatPrompt(data.suggestedChatPrompt);
        
        if (data.birth) {
          setName(String(data.birth.name || ""));
          setDob(String(data.birth.dob || ""));
          setTime(String(data.birth.birthTime || ""));
          setPlace(String(data.birth.birthPlace || ""));
          if (data.birth.isBirthTimeUnknown) setNotSureTime(true);
        }
      } catch (e) {
        console.error("Fetch existing kundli failed", e);
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    }
    void fetchExisting();
    return () => { cancelled = true; };
  }, [me?.user]);

  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c] shadow-lg" : "border-orange-100 bg-white shadow-md";
  const inputClass = isDark ? "w-full rounded-xl border border-slate-700 bg-[#0A0F19] p-4 text-[15px] font-medium focus:border-[#ff6b00] focus:outline-none text-white transition-colors" : "w-full rounded-xl border border-gray-300 bg-white p-4 text-[15px] font-medium focus:border-[#ff6b00] focus:outline-none text-gray-900 shadow-sm transition-colors";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consent) {
      setError(t("consentText")); 
      return;
    }
    
    setLoading(true);
    setError("");
    setChart(null);
    setInterpretation(null);
    setSuggestedChatPrompt(null);

    try {
      const res = await fetch("/api/kundli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, dateOfBirth: dob, timeOfBirth: notSureTime ? "12:00" : time, 
          isTimeUnknown: notSureTime, placeOfBirth: place, language: lang, consent: true
        }),
      });
      
      const data = await res.json().catch(() => null);
      
      if (res.status === 402 || data?.code === "WALLET_RECHARGE_REQUIRED") {
        router.push("/wallet?reason=kundli_limit");
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || t("generate") + " Failed");
      }
      
      if (data?.chart) setChart(data.chart);
      if (data?.interpretation && typeof data.interpretation === "string") setInterpretation(data.interpretation);
      if (data?.suggestedChatPrompt && typeof data.suggestedChatPrompt === "string") setSuggestedChatPrompt(data.suggestedChatPrompt);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!pdfRef.current) return;
    setIsDownloading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const html2pdf = (await import("html2pdf.js")).default;
      
      const opt = {
        margin:       [10, 10, 10, 10],
        filename:     `Kundli_${name || "User"}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false }, 
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(pdfRef.current).save();
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("PDF download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleChatNow = () => {
    let planetsText = "";
    if (chart?.planets && Array.isArray(chart.planets)) {
      planetsText = chart.planets.map((p: any) => {
        const pName = p.planet || p.name || "N/A";
        const pSign = p.rashiName || p.sign || "N/A";
        return `${String(pName)} (${String(pSign)})`;
      }).join(", ");
    }

    const summaryText = `Namaste, maine apni kundli banayi hai. Kripya iska vishleshan karein:
      
Name: ${String(name)}
DOB: ${String(dob)} ${time ? `| Time: ${String(time)}` : ""} ${place ? `| Place: ${String(place)}` : ""}
Lagna: ${typeof chart?.lagna === 'object' ? (chart.lagna.rashiName || chart.lagna.name || "N/A") : String(chart?.lagna || "N/A")}
Rashi: ${typeof chart?.moonSign === 'object' ? (chart.moonSign.rashiName || chart.moonSign.name || "N/A") : String(chart?.rashi || "N/A")}
Nakshatra: ${typeof chart?.nakshatra === 'object' ? (chart.nakshatra.name || "N/A") : String(chart?.nakshatra || "N/A")}
${planetsText ? `Planets: ${planetsText}` : ""}

Mujhe apne career, marriage aur health ke baare mein margdarshan chahiye.`;

    const encodedPrompt = encodeURIComponent(summaryText);
    router.push(`/chat/gita?prefill=${encodedPrompt}`);
  };

  const resetForm = () => {
    setChart(null);
    setInterpretation(null);
    setSuggestedChatPrompt(null);
  };

  if (historyLoading) {
    return (
      <div className={`min-h-[100dvh] flex flex-col items-center justify-center ${pageClass}`}>
        <Sparkles className="animate-spin text-[#ff6b00] mb-4" size={40} />
        <p className="text-[15px] font-bold text-[#ff6b00]">{t("loadingHistory")}</p>
      </div>
    );
  }

  return (
    <main className={`min-h-[100dvh] w-full pb-36 ${pageClass} font-sans`}>
      
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2.5 transition-colors ${isDark ? "bg-[#0A0F19] text-slate-300" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-[17px] sm:text-[20px] font-black uppercase tracking-tight text-[#ff6b00]">{t("title")}</h1>
            <p className={`text-[11px] sm:text-[13px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("subtitle")}</p>
          </div>
        </header>

        {/* FORM */}
        {!chart && (
          <form onSubmit={handleSubmit} className={`space-y-5 rounded-[1.5rem] border p-6 sm:p-8 ${cardClass}`}>
            <div className="space-y-2">
              <label className={`text-[12px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("name")}</label>
              <input required value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="e.g. Rahul Sharma" />
            </div>
            
            <div className="space-y-2">
              <label className={`text-[12px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("dob")}</label>
              <input required type="date" value={dob} onChange={e => setDob(e.target.value)} className={inputClass} />
            </div>
            
            <div className="space-y-2">
              <label className={`text-[12px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("time")}</label>
              <input required type="time" value={time} onChange={e => setTime(e.target.value)} disabled={notSureTime} className={`${inputClass} ${notSureTime ? "opacity-50" : ""}`} />
              
              <div className={`flex items-center gap-3 mt-3 p-3 rounded-xl border ${isDark ? "border-slate-700 bg-slate-800/30" : "border-gray-200 bg-gray-50"}`}>
                <input type="checkbox" id="unknownTime" checked={notSureTime} onChange={e => setNotSureTime(e.target.checked)} className="w-5 h-5 accent-[#ff6b00] cursor-pointer rounded" />
                <label htmlFor="unknownTime" className={`text-[12.5px] font-medium cursor-pointer ${isDark ? "text-slate-300" : "text-gray-700"}`}>{t("unknownTime")}</label>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-[12px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("place")}</label>
              <input required value={place} onChange={e => setPlace(e.target.value)} className={inputClass} placeholder="e.g. New Delhi, India" />
            </div>

            <div className={`flex items-start gap-3 p-3 rounded-xl border ${isDark ? "border-slate-700 bg-slate-800/30" : "border-orange-100 bg-orange-50/50"}`}>
              <input type="checkbox" id="consent" checked={consent} onChange={e => setConsent(e.target.checked)} className="w-5 h-5 mt-0.5 accent-[#ff6b00] cursor-pointer rounded" />
              <label htmlFor="consent" className={`text-[12px] font-medium cursor-pointer leading-tight ${isDark ? "text-slate-300" : "text-gray-600"}`}>{t("consentText")}</label>
            </div>

            {error && <p className="text-red-500 text-[13px] font-bold text-center">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-[#ff6b00] hover:bg-[#e65c00] text-white font-black text-[16px] uppercase tracking-wider py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2">
              {loading ? <><Loader2 className="animate-spin" size={20} /> {t("calc")}</> : <><Sparkles size={20} /> {t("generate")}</>}
            </button>
          </form>
        )}

        {/* CHART RESULT */}
        {chart && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* PDF Content Area */}
            <div ref={pdfRef} className={`rounded-[1.5rem] border overflow-hidden ${cardClass}`}>
              
              <div className="bg-gradient-to-r from-[#ff6b00] to-[#ff9a44] p-6 text-center text-white relative">
                <h2 className="text-2xl font-black mb-1">{name}</h2>
                <p className="text-[13px] opacity-90">{dob} • {notSureTime ? "12:00 PM" : time} • {place}</p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20"></div>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className={`p-3 rounded-xl text-center border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-orange-50 border-orange-100"}`}>
                    <p className="text-[10px] font-bold text-[#ff6b00] uppercase tracking-wider mb-1">{t("lagna")}</p>
                    <p className="text-[14px] font-black">{chart.lagna?.rashiNameHi || chart.lagna?.rashiName}</p>
                  </div>
                  <div className={`p-3 rounded-xl text-center border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-orange-50 border-orange-100"}`}>
                    <p className="text-[10px] font-bold text-[#ff6b00] uppercase tracking-wider mb-1">{t("rashi")}</p>
                    <p className="text-[14px] font-black">{chart.moonSign?.rashiNameHi || chart.moonSign?.rashiName}</p>
                  </div>
                  <div className={`p-3 rounded-xl text-center border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-orange-50 border-orange-100"}`}>
                    <p className="text-[10px] font-bold text-[#ff6b00] uppercase tracking-wider mb-1">{t("nakshatra")}</p>
                    <p className="text-[14px] font-black">{chart.nakshatra?.name}</p>
                  </div>
                  {chart.currentDasha && (
                    <div className={`p-3 rounded-xl text-center border ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-orange-50 border-orange-100"}`}>
                      <p className="text-[10px] font-bold text-[#ff6b00] uppercase tracking-wider mb-1">{t("dasha")}</p>
                      <p className="text-[14px] font-black">{chart.currentDasha.maha}</p>
                    </div>
                  )}
                </div>

                {/* Planets Table */}
                <div>
                  <h3 className="text-[14px] font-black text-[#ff6b00] mb-3 uppercase tracking-wider">{t("planetsTitle")}</h3>
                  <div className={`rounded-xl border overflow-hidden ${isDark ? "border-slate-700" : "border-gray-200"}`}>
                    <table className="w-full text-left text-[12.5px]">
                      <thead className={`${isDark ? "bg-slate-800 text-slate-300" : "bg-gray-50 text-gray-600"} font-bold`}>
                        <tr>
                          <th className="px-4 py-3">{t("planet")}</th>
                          <th className="px-4 py-3">{t("sign")}</th>
                          <th className="px-4 py-3">{t("house")}</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? "divide-slate-700/50" : "divide-gray-100"}`}>
                        {chart.planets?.map((p: any, i: number) => (
                          <tr key={i} className={isDark ? "hover:bg-slate-800/30" : "hover:bg-orange-50/30"}>
                            <td className="px-4 py-3 font-bold flex items-center gap-2">
                              {p.planet} {p.retrograde && <span className="text-[9px] text-red-500 border border-red-500 rounded px-1">R</span>}
                            </td>
                            <td className="px-4 py-3">{p.rashiName}</td>
                            <td className="px-4 py-3">{p.house}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Interpretation (Outside PDF) */}
            {interpretation && (
              <div className={`rounded-[1.5rem] border p-6 ${cardClass}`}>
                <h3 className="text-[15px] font-black text-[#ff6b00] mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Star size={18} /> {t("aiReport")}
                </h3>
                <div className={`prose prose-sm max-w-none text-[14px] leading-relaxed ${isDark ? "prose-invert text-slate-300" : "text-gray-700"}`}>
                  {interpretation.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleDownload} disabled={isDownloading} className="flex-1 bg-[#ff6b00] hover:bg-[#e65c00] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2">
                {isDownloading ? <><Loader2 className="animate-spin" size={18} /> {t("wait")}</> : <><Download size={18} /> {t("download")}</>}
              </button>
              <button onClick={resetForm} className={`flex-1 font-bold py-4 rounded-xl shadow-sm transition-all flex justify-center items-center gap-2 border ${isDark ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200" : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"}`}>
                <RefreshCcw size={18} /> {t("again")}
              </button>
            </div>

            {/* Chat CTA */}
            <div className={`rounded-[1.5rem] p-5 border shadow-md ${isDark ? "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700" : "bg-gradient-to-br from-orange-50 to-white border-orange-100"}`}>
              <p className={`text-[13.5px] font-medium mb-4 leading-snug ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                <span className="font-black text-[#ff6b00] block mb-1 uppercase tracking-wider text-[11px]">{t("notice")}</span>
                {t("scareText")}
              </p>
              <button onClick={handleChatNow} className="w-full bg-[#0B0F19] hover:bg-black text-[#ff6b00] font-black text-[14px] uppercase tracking-wide py-4 rounded-xl shadow-md transition-all flex justify-center items-center gap-2">
                <MessageCircle size={20} /> {t("chatCTA")}
              </button>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
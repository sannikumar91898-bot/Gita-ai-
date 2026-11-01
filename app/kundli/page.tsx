// app/kundli/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Scroll, Download, RefreshCcw } from "lucide-react";
import { useApp } from "../Providers";

export default function KundliPage() {
  const { theme, lang, me } = useApp();
  const isDark = theme === "dark";

  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  const t = (hi: string, hing: string, en: string) =>
    isHindi ? hi : isHinglish ? hing : en;

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState<any>(null);
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  // 🔥 PDF ke liye Ref 🔥
  const pdfRef = useRef<HTMLDivElement>(null);

  // Auto-fill logic
  useEffect(() => {
    if (me?.birth) {
      setName(me.birth.name || "");
      setDob(me.birth.dob || "");
      setTime(me.birth.birthTime || "");
      setPlace(me.birth.birthPlace || "");
    }
  }, [me]);

  const pageClass = isDark ? "bg-slate-950 text-violet-50" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#1e293b]" : "border-orange-100 bg-white shadow-sm";
  const inputClass = isDark
    ? "w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm focus:border-orange-500 focus:outline-none text-white"
    : "w-full rounded-xl border border-gray-300 bg-white p-3 text-sm focus:border-orange-500 focus:outline-none text-gray-900";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setChart(null);

    try {
      const res = await fetch("/api/kundli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          dateOfBirth: dob, 
          timeOfBirth: time, 
          placeOfBirth: place 
        }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || t("कुंडली नहीं बन पाई।", "Kundli nahi ban payi.", "Failed to calculate Kundli."));
      
      setChart(data.chart);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ACTUAL PDF DOWNLOAD FUNCTION 🔥
  const handleDownload = async () => {
    if (!pdfRef.current) return;
    
    setIsDownloading(true);
    try {
      // Dynamic import taaki Next.js SSR par error na de
      const html2pdf = (await import("html2pdf.js")).default;
      
      const element = pdfRef.current;
      
      const opt = {
        margin:       10,
        filename:     `Kundli_${name || "User"}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: "#ffffff" }, // White background for PDF
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // PDF Generate aur Save karein
      await html2pdf().set(opt).from(element).save();
      
    } catch (error) {
      console.error("PDF Generation Failed:", error);
      alert("PDF download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className={`min-h-screen w-full px-4 pb-20 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-6">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/settings" className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-violet-200" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-base font-black uppercase tracking-tight text-orange-600">
            {t("मेरी कुंडली", "My Kundli", "My Kundli")}
          </h1>
        </header>

        {/* FORM */}
        {!chart && (
          <form onSubmit={handleSubmit} className={`space-y-4 rounded-2xl border p-5 ${cardClass}`}>
            <div>
              <label className="text-sm font-bold opacity-80">{t("पूरा नाम", "Full Name", "Full Name")}</label>
              <input required value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="e.g. Rahul Sharma" />
            </div>
            <div>
              <label className="text-sm font-bold opacity-80">{t("जन्म तिथि", "Date of Birth", "Date of Birth")}</label>
              <input required type="date" value={dob} onChange={e => setDob(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-bold opacity-80">{t("जन्म का समय", "Time of Birth", "Time of Birth")}</label>
              <input required type="time" value={time} onChange={e => setTime(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-bold opacity-80">{t("जन्म स्थान", "Place of Birth", "Place of Birth")}</label>
              <input required value={place} onChange={e => setPlace(e.target.value)} className={inputClass} placeholder="e.g. Patna, Bihar" />
            </div>

            {error && <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg font-medium">{error}</p>}

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-orange-600 py-3 font-bold text-white transition-all hover:bg-orange-700 disabled:opacity-50 flex justify-center items-center gap-2">
              {loading ? (
                <><Sparkles className="animate-spin" size={18} /> {t("गणना हो रही है...", "Calculating...", "Calculating...")}</>
              ) : (
                t("कुंडली बनाएं", "Generate Kundli", "Generate Kundli")
              )}
            </button>
          </form>
        )}

        {/* RESULT (Yeh hissa PDF mein jayega) */}
        {chart && (
          <div className="space-y-4">
            
            {/* 🔥 PDF Capture Area Start 🔥 */}
            <div 
              ref={pdfRef} 
              // PDF ke liye humesha white background aur dark text rakhein taaki print accha lage
              className="rounded-2xl border border-orange-200 bg-white p-6 text-slate-900 shadow-sm"
            >
              {/* PDF Header */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <Scroll className="text-orange-600" size={32} />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{t("जन्म कुंडली", "Birth Chart", "Birth Chart")}</h2>
                    <p className="text-sm text-gray-500">Generated by Gita AI</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{name}</p>
                  <p className="text-xs text-gray-500">{dob} | {time}</p>
                  <p className="text-xs text-gray-500">{place}</p>
                </div>
              </div>
              
              {/* PDF Body (Data) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <p className="text-xs text-gray-500 mb-1 font-semibold uppercase">{t("लग्न", "Lagna", "Lagna (Ascendant)")}</p>
                  <p className="font-bold text-orange-700 text-lg">{chart.lagna?.rashiNameHi || "N/A"}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <p className="text-xs text-gray-500 mb-1 font-semibold uppercase">{t("राशि", "Rashi", "Moon Sign")}</p>
                  <p className="font-bold text-orange-700 text-lg">{chart.moonSign?.rashiNameHi || "N/A"}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <p className="text-xs text-gray-500 mb-1 font-semibold uppercase">{t("नक्षत्र", "Nakshatra", "Nakshatra")}</p>
                  <p className="font-bold text-orange-700 text-lg">{chart.nakshatra?.name || "N/A"} <span className="text-sm font-normal">({t("पद", "Pada", "Pada")} {chart.nakshatra?.pada || "-"})</span></p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <p className="text-xs text-gray-500 mb-1 font-semibold uppercase">{t("वर्तमान दशा", "Current Dasha", "Current Dasha")}</p>
                  <p className="font-bold text-orange-700 text-lg">{chart.currentDasha?.maha || "N/A"}</p>
                </div>
              </div>

              {/* PDF Footer */}
              <div className="mt-8 pt-4 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-400">Generated on {new Date().toLocaleDateString()} | www.gita-ai.com</p>
              </div>
            </div>
            {/* 🔥 PDF Capture Area End 🔥 */}

            {/* Buttons (Yeh PDF mein nahi aayenge) */}
            <div className="flex gap-3">
              <button 
                onClick={handleDownload} 
                disabled={isDownloading}
                className="flex-1 rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {isDownloading ? (
                  <><Sparkles className="animate-spin" size={16} /> {t("डाउनलोड हो रहा है...", "Downloading...", "Downloading...")}</>
                ) : (
                  <><Download size={16} /> {t("PDF डाउनलोड", "Download PDF", "Download PDF")}</>
                )}
              </button>
              
              <button 
                onClick={() => setChart(null)} 
                className="flex-1 rounded-xl border border-orange-500 py-3 text-sm font-bold text-orange-500 hover:bg-orange-500/10 flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCcw size={16} /> {t("दोबारा बनाएं", "Calculate Again", "Calculate Again")}
              </button>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
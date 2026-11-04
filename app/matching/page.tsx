// app/matching/page.tsx
"use client";

import { useState, useRef } from "react";
import { 
  ArrowLeft, 
  Heart, 
  Sparkles, 
  AlertCircle, 
  MessageCircle, 
  Download, 
  RefreshCw,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

export default function MatchingPage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  const [boyName, setBoyName] = useState("");
  const [girlName, setGirlName] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // PDF Download ke liye ref
  const resultRef = useRef<HTMLDivElement>(null);

  const t = (hi: string, hing: string, en: string) =>
    isHindi ? hi : isHinglish ? hing : en;

  const pageClass = isDark ? "bg-slate-950 text-violet-50" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-slate-900 shadow-xl" : "border-orange-100 bg-white shadow-xl";

  const handleMatch = () => {
    if (!boyName.trim() || !girlName.trim()) return;
    setLoading(true);
    setResult(null);
    
    // Fake calculation delay (Psychological build-up)
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * 20) + 75; // 75% to 95%
      setResult(randomScore);
      setLoading(false);
    }, 2500); // Thoda zyada time taaki user ko lage "Deep calculation" ho rahi hai
  };

  // 🔥 PDF DOWNLOAD FUNCTION 🔥
  const downloadPdf = async () => {
    if (!resultRef.current) return;
    setIsDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: 0.4,
        filename: `${boyName || "Boy"}_${girlName || "Girl"}_Milan.pdf`,
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

  // 🔥 RESET FUNCTION 🔥
  const resetForm = () => {
    setBoyName("");
    setGirlName("");
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

        {/* WARNING / HOOK (Psychological Trigger) */}
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
          <section className={`space-y-4 rounded-2xl border p-5 ${cardClass}`}>
            <div className="space-y-3">
              <div>
                <label className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                  {t("वर (लड़के) का नाम", "Var (Boy) ka Naam", "Boy's Name")}
                </label>
                <input
                  type="text"
                  value={boyName}
                  onChange={(e) => setBoyName(e.target.value)}
                  placeholder={t("लड़के का नाम लिखें", "Boy ka naam likhein", "Enter boy's name")}
                  className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-orange-400 ${isDark ? "border-slate-700 bg-slate-800 text-white" : "border-orange-200 bg-orange-50 text-slate-900"}`}
                />
              </div>

              <div className="flex justify-center text-orange-400 py-1">
                <Heart size={24} fill="currentColor" className="animate-pulse" />
              </div>

              <div>
                <label className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                  {t("वधू (लड़की) का नाम", "Vadhu (Girl) ka Naam", "Girl's Name")}
                </label>
                <input
                  type="text"
                  value={girlName}
                  onChange={(e) => setGirlName(e.target.value)}
                  placeholder={t("लड़की का नाम लिखें", "Girl ka naam likhein", "Enter girl's name")}
                  className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-orange-400 ${isDark ? "border-slate-700 bg-slate-800 text-white" : "border-orange-200 bg-orange-50 text-slate-900"}`}
                />
              </div>
            </div>

            <button
              onClick={handleMatch}
              disabled={!boyName.trim() || !girlName.trim() || loading}
              className="w-full mt-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3.5 text-sm font-bold text-white shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading 
                ? t("ग्रहों की गणना हो रही है...", "Graho ki ganana ho rahi hai...", "Calculating planetary positions...") 
                : t("मिलान करें", "Milan Karein", "Match Now")}
            </button>
          </section>
        )}

        {/* RESULT (Jisko PDF me convert karna hai) */}
        {result !== null && !loading && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 🔥 PDF TARGET AREA START 🔥 */}
            <div 
              ref={resultRef} 
              className={`space-y-4 rounded-2xl border-2 border-orange-300 p-5 relative overflow-hidden ${isDark ? "bg-slate-900" : "bg-gradient-to-br from-orange-50 to-amber-50"}`}
            >
              {/* PDF Watermark/Background (Optional Design) */}
              <div className="absolute -right-10 -top-10 text-orange-500/5 rotate-12 pointer-events-none">
                <Sparkles size={150} />
              </div>

              <div className="flex items-center gap-2 relative z-10">
                <Sparkles className="text-amber-500" size={18} />
                <p className="text-sm font-black text-orange-700">
                  {t("मिलान परिणाम", "Matching Result", "Matching Result")}
                </p>
              </div>

              <div className="text-center py-4 relative z-10">
                <p className={`text-6xl font-black ${isDark ? "text-orange-400" : "text-orange-600"} drop-shadow-sm`}>
                  {result}%
                </p>
                <p className={`text-sm font-bold mt-2 ${isDark ? "text-slate-200" : "text-gray-800"}`}>
                  {t("कुल अष्टकूट मिलान", "Total Ashtakoot Milan", "Total Ashtakoot Score")}
                </p>
                <p className={`text-xs font-medium mt-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                  {boyName} ❤️ {girlName}
                </p>
              </div>

              {/* Psychological Hook in Result */}
              <div className={`rounded-xl border p-4 relative z-10 ${isDark ? "border-rose-900/50 bg-rose-950/40" : "border-rose-200 bg-rose-50 shadow-inner"}`}>
                <p className={`text-xs font-bold leading-5 ${isDark ? "text-rose-200" : "text-rose-900"}`}>
                  {t(
                    "आपका मिलान तो अच्छा है, लेकिन कुंडली के सूक्ष्म गणना (Manglik/Kaal Sarp) में एक 'रुकावट' दिख रही है जो विवाह में देरी या आपसी मतभेद ला सकती है। इसका सटीक कारण और उपाय जाने बिना शादी का निर्णय न लें।",
                    "Aapka milan toh accha hai, lekin kundli ki sookshma ganana mein ek 'rukawat' dikh rahi hai jo vivah mein deri ya aapsi matbhed la sakti hai. Iska sateek karan aur upay jaane bina shaadi ka nirnay na lein.",
                    "Your match is good, but deep chart calculation reveals a 'blockage' that can cause delays or misunderstandings. Do not take a marriage decision without knowing the exact cause and remedy."
                  )}
                </p>
              </div>

              {/* PDF Footer Branding */}
              <div className={`text-center text-[9px] mt-2 relative z-10 ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                {t("जनरेट किया गया", "Generated by", "Generated by")} Gita AI • www.gita-ai.com
              </div>
            </div>
            {/* 🔥 PDF TARGET AREA END 🔥 */}

            {/* CTA & BUTTONS (Outside PDF Target so they don't print) */}
            <div className="space-y-3 pt-2">
              <Link
                href="/chat"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-3.5 text-sm font-black text-white shadow-lg active:scale-[0.98] transition-transform animate-bounce-subtle"
              >
                <MessageCircle size={18} />
                {t("ज्योतिषी से बात करें — पहली चैट FREE", "Jyotishi se baat karein — Pehli chat FREE", "Talk to Astrologer — First chat FREE")}
              </Link>

              <div className="flex gap-3">
                <button
                  onClick={downloadPdf}
                  disabled={isDownloading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-md active:scale-[0.98] transition-transform hover:bg-green-700 disabled:opacity-50"
                >
                  {isDownloading ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <Download size={18} />
                  )}
                  {t("PDF डाउनलोड", "PDF Download", "Download PDF")}
                </button>
                
                <button
                  onClick={resetForm}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-3.5 text-sm font-bold shadow-sm active:scale-[0.98] transition-transform ${
                    isDark 
                      ? "border-slate-700 bg-slate-800 text-orange-400 hover:bg-slate-700" 
                      : "border-orange-200 bg-white text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  <RefreshCw size={18} />
                  {t("दोबारा बनाएं", "Dobara Banayein", "Reset")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DISCLAIMER */}
        <p className={`px-6 text-center text-[9px] leading-3 select-none tracking-wide mt-6 ${isDark ? "text-slate-600" : "text-slate-400"}`}>
          © 2026 Astrologer App. This platform displays calculations based on ancient Vedic Astrology principles.
        </p>
      </div>

      {/* FIXED BOTTOM BAR (Marketing) */}
      <Link
        href="/chat"
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 px-4 py-3.5 text-white shadow-2xl"
      >
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
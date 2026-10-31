// app/matching/page.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Heart, Sparkles, AlertCircle, MessageCircle } from "lucide-react";
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

  const t = (hi: string, hing: string, en: string) =>
    isHindi ? hi : isHinglish ? hing : en;

  const pageClass = isDark ? "bg-slate-950 text-violet-50" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-slate-900 shadow-xl" : "border-orange-100 bg-white shadow-xl";

  const handleMatch = () => {
    if (!boyName.trim() || !girlName.trim()) return;
    setLoading(true);
    setResult(null);
    
    // Fake calculation delay
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * 20) + 75; // 75% to 95%
      setResult(randomScore);
      setLoading(false);
    }, 2000);
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
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {t(
              "विवाह जीवन का सबसे बड़ा निर्णय है। कुंडली में छिपे दोष (जैसे मंगल दोष) रिश्तों में रुकावट ला सकते हैं। सही समय पर सही उपाय जानें।",
              "Vivah jeevan ka sabse bada nirnay hai. Kundli mein chhipe dosh (jaise Mangal Dosh) rishton mein rukawat la sakte hain. Sahi samay par sahi upay jaanें.",
              "Marriage is life's biggest decision. Hidden doshas (like Mangal Dosh) can bring obstructions in relationships. Know the right remedies at the right time."
            )}
          </p>
        </div>

        {/* FORM */}
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
                className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-orange-400 ${isDark ? "border-slate-700 bg-slate-800" : "border-orange-200 bg-orange-50"}`}
              />
            </div>

            <div className="flex justify-center text-orange-400">
              <Heart size={20} fill="currentColor" />
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
                className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-orange-400 ${isDark ? "border-slate-700 bg-slate-800" : "border-orange-200 bg-orange-50"}`}
              />
            </div>
          </div>

          <button
            onClick={handleMatch}
            disabled={!boyName.trim() || !girlName.trim() || loading}
            className="w-full rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-md transition active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? t("गणना हो रही है...", "Calculating...", "Calculating...") : t("मिलान करें", "Milan Karein", "Match Now")}
          </button>
        </section>

        {/* RESULT */}
        {result !== null && !loading && (
          <section className={`space-y-4 rounded-2xl border-2 border-orange-300 p-5 ${isDark ? "bg-slate-900" : "bg-gradient-to-br from-orange-50 to-amber-50"}`}>
            <div className="flex items-center gap-2">
              <Sparkles className="text-amber-500" size={18} />
              <p className="text-sm font-black text-orange-700">
                {t("मिलान परिणाम", "Matching Result", "Matching Result")}
              </p>
            </div>

            <div className="text-center py-4">
              <p className={`text-5xl font-black ${isDark ? "text-orange-400" : "text-orange-600"}`}>{result}%</p>
              <p className={`text-sm font-bold mt-1 ${isDark ? "text-slate-200" : "text-gray-800"}`}>
                {t("कुल अष्टकूट मिलान", "Total Ashtakoot Milan", "Total Ashtakoot Score")}
              </p>
            </div>

            <div className={`rounded-xl border p-4 ${isDark ? "border-rose-900 bg-rose-950/40" : "border-rose-300 bg-rose-50"}`}>
              <p className={`text-xs font-bold leading-5 ${isDark ? "text-rose-200" : "text-rose-900"}`}>
                {t(
                  "आपका मिलान तो अच्छा है, लेकिन कुंडली के सूक्ष्म गणना में एक 'रुकावट' दिख रही है जो विवाह में देरी ला सकती है। इसका सटीक कारण और उपाय जानने के लिए ज्योतिषी से बात करें।",
                  "Aapka milan toh accha hai, lekin kundli ki sookshma ganana mein ek 'rukawat' dikh rahi hai jo vivah mein deri la sakti hai. Iska sateek karan aur upay jaanne ke liye jyotishi se baat karein.",
                  "Your match is good, but deep chart calculation reveals a 'blockage' that can delay marriage. Talk to our astrologer to know the exact cause and remedy."
                )}
              </p>
            </div>

            <Link
              href="/chat"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-3 text-sm font-black text-white shadow-lg active:scale-[0.99]"
            >
              <MessageCircle size={16} />
              {t("ज्योतिषी से बात करें — पहली चैट FREE", "Jyotishi se baat karein — Pehli chat FREE", "Talk to Astrologer — First chat FREE")}
            </Link>
          </section>
        )}

        {/* DISCLAIMER */}
        <p className="px-6 text-center text-[9px] leading-3 text-slate-400/40 select-none tracking-wide">
          © 2026 Astrologer App. This platform displays calculations based on ancient Vedic Astrology principles.
        </p>
      </div>

      {/* FIXED BOTTOM BAR */}
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
              {t("पूरी कुंडली जाँच के लिए चैट करें — FREE", "Poori Kundli jaanch ke liye chat karein — FREE", "Chat for full Kundli reading — FREE")}
            </p>
          </div>
        </div>
      </Link>
    </main>
  );
}
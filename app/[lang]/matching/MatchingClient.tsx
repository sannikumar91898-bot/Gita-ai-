// app/[lang]/matching/MatchingClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Heart, Loader2 } from "lucide-react";
import { useApp } from "../../Providers";

const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: { title: "कुंडली मिलान", subtitle: "अपनी और साथी की कुंडली मिलाएं", boy: "वर का नाम", girl: "वधू का नाम", dob: "जन्म तिथि", time: "जन्म समय", place: "जन्म स्थान", matchBtn: "कुंडली मिलाएं", loading: "मिलान हो रहा है...", resultTitle: "मिलान परिणाम", score: "मिलान अंक" },
    en: { title: "Kundli Matching", subtitle: "Match your Kundli with your partner", boy: "Boy's Name", girl: "Girl's Name", dob: "Date of Birth", time: "Time of Birth", place: "Place of Birth", matchBtn: "Match Kundli", loading: "Matching...", resultTitle: "Match Result", score: "Match Score" },
    // Baaki 8 languages aap baad mein add kar sakte hain
  };
  return ui[lang]?.[key] || ui["en"][key] || ui["hi"][key] || "";
};

export default function MatchingClient() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const t = (key: string) => getUIText(lang, key);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Yahan aap apna API call /api/matching laga sakte hain
    setTimeout(() => {
      setResult({ score: 28, max: 36, status: "Uttam (Excellent)" });
      setLoading(false);
    }, 1500);
  };

  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c] shadow-lg" : "border-orange-100 bg-white shadow-md";

  return (
    <main className={`min-h-[100dvh] w-full pb-36 ${pageClass} font-sans`}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2.5 ${isDark ? "bg-[#0A0F19]" : "bg-orange-50 text-orange-600"}`}><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-[17px] sm:text-[20px] font-black uppercase tracking-tight text-[#ff6b00]">{t("title")}</h1>
            <p className={`text-[11px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("subtitle")}</p>
          </div>
        </header>

        {!result ? (
          <form onSubmit={handleSubmit} className={`space-y-5 rounded-[1.5rem] border p-6 ${cardClass}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[12px] font-bold uppercase">{t("boy")}</label>
                <input required className="w-full p-3 border rounded-xl bg-transparent" placeholder="Rahul" />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold uppercase">{t("girl")}</label>
                <input required className="w-full p-3 border rounded-xl bg-transparent" placeholder="Priya" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#ff6b00] text-white font-black py-4 rounded-xl flex justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <Heart />} {t("matchBtn")}
            </button>
          </form>
        ) : (
          <div className={`p-6 rounded-[1.5rem] border text-center ${cardClass}`}>
            <h2 className="text-xl font-black text-[#ff6b00] mb-4">{t("resultTitle")}</h2>
            <div className="text-4xl font-black mb-2">{result.score} / {result.max}</div>
            <p className="text-lg font-bold text-green-500">{result.status}</p>
            <button onClick={() => setResult(null)} className="mt-6 text-sm font-bold underline">Try Again</button>
          </div>
        )}
      </div>
    </main>
  );
}
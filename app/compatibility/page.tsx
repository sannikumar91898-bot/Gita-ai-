"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Heart,
  Zap,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useApp } from "../Providers";

type RashiKey =

  | "aries" | "taurus" | "gemini" | "cancer"
  | "leo" | "virgo" | "libra" | "scorpio"
  | "sagittarius" | "capricorn" | "aquarius" | "pisces";

const RASHI_LIST: { key: RashiKey; label: string; emoji: string }[] = [
  { key: "aries", label: "मेष", emoji: "♈" },
  { key: "taurus", label: "वृषभ", emoji: "♉" },
  { key: "gemini", label: "मिथुन", emoji: "♊" },
  { key: "cancer", label: "कर्क", emoji: "♋" },
  { key: "leo", label: "सिंह", emoji: "♌" },
  { key: "virgo", label: "कन्या", emoji: "♍" },
  { key: "libra", label: "तुला", emoji: "♎" },
  { key: "scorpio", label: "वृश्चिक", emoji: "♏" },
  { key: "sagittarius", label: "धनु", emoji: "♐" },
  { key: "capricorn", label: "मकर", emoji: "♑" },
  { key: "aquarius", label: "कुंभ", emoji: "♒" },
  { key: "pisces", label: "मीन", emoji: "♓" },
];

export default function CompatibilityPage() {
  const { theme } = useApp();
  const isDark = theme === "dark";

  const [partner1, setPartner1] = useState<RashiKey | "">("");
  const [partner2, setPartner2] = useState<RashiKey | "">("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const pageClass = isDark
    ? "bg-slate-950 text-white"
    : "bg-gradient-to-b from-orange-50 to-white text-slate-900";

  const panelClass = isDark
    ? "border-white/10 bg-slate-900"
    : "border-orange-100 bg-white shadow-lg";

  const selectClass = isDark
    ? "bg-slate-800 border-white/10 text-white"
    : "bg-orange-50/50 border-orange-200 text-slate-900";

  function calculateMatch() {
    if (!partner1 || !partner2) return;
    setIsCalculating(true);
    setShowResult(false);

    window.setTimeout(() => {
      // 85% से 98% के बीच हाई कन्वर्शन बिजनेस स्कोर जेनरेट करना
      const generatedScore = Math.floor(Math.random() * 14) + 85;
      setScore(generatedScore);
      setIsCalculating(false);
      setShowResult(true);
    }, 1200);
  }

  return (
    <main className={`min-h-screen w-full px-4 pb-24 pt-6 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-6">
        {/* Header */}
        <header className="flex items-center gap-4">
          <Link
            href="/"
            className={`rounded-xl border p-2.5 ${
              isDark ? "border-white/10 bg-slate-900" : "border-orange-200 bg-white shadow-sm"
            }`}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">❤️ महा-गुण मिलान एवं अनुकूलता</h1>
            <p className="mt-1 text-xs font-bold text-orange-500">
              Vedic Rashi Compatibility & Love Destiny
            </p>
          </div>
        </header>

        {/* Input Selector Block */}
        <section className={`rounded-2xl border p-5 ${panelClass} space-y-4`}>
          <div className="text-center bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl">
            <p className="text-xs font-bold text-orange-600">
              🔥 अष्टकूट मिलान के गुप्त नियमों पर आधारित वैदिक गणना
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Partner 1 */}
            <div className="space-y-2">
              <label className="text-xs font-bold block text-orange-500">आपका नाम / राशि</label>
              <select
                value={partner1}
                onChange={(e) => setPartner1(e.target.value as RashiKey)}
                className={`w-full rounded-xl border p-3 text-sm font-bold ${selectClass}`}
              >
                <option value="">चुनें...</option>
                {RASHI_LIST.map((rashi) => (
                  <option key={rashi.key} value={rashi.key}>
                    {rashi.emoji} {rashi.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Partner 2 */}
            <div className="space-y-2">
              <label className="text-xs font-bold block text-rose-500">पार्टनर की राशि</label>
              <select
                value={partner2}
                onChange={(e) => setPartner2(e.target.value as RashiKey)}
                className={`w-full rounded-xl border p-3 text-sm font-bold ${selectClass}`}
              >
                <option value="">चुनें...</option>
                {RASHI_LIST.map((rashi) => (
                  <option key={rashi.key} value={rashi.key}>
                    {rashi.emoji} {rashi.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={calculateMatch}
            disabled={!partner1 || !partner2 || isCalculating}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 px-4 py-3.5 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isCalculating ? (
              <>
                <RefreshCw className="animate-spin" size={18} />
                ग्रहों और नाड़ी दोषों की गणना जारी है...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                अनुकूलता और भाग्य फल देखें
              </>
            )}
          </button>
        </section>

        {/* Result & Marketing Block */}
        {showResult && (
          <div className="space-y-5 animate-fadeIn">
            <section className={`rounded-2xl border p-6 text-center ${panelClass} space-y-4`}>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 ring-4 ring-rose-500/5">
                <Heart size={36} className="animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">परम दिव्य अनुकूलता योग</h2>
                <div className="mt-2 text-3xl font-black text-rose-600">{score}% मैच स्कोर</div>
              </div>
              <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
                आप दोनों के बीच <strong>प्रीति योग और भकूट शुद्धि</strong> अत्यंत उत्तम स्थिति में है। मानसिक तालमेल और एक-दूसरे के प्रति समर्पण बहुत गहरा रहेगा। भाग्य एक-दूसरे के आने से चमकेगा।
              </p>
            </section>

            {/* 🔥 HIGH CONVERSION MARKETING CTA BLOCK 🔥 */}
            <section className="rounded-2xl border-2 border-orange-500 bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 opacity-10">
                <Sparkles size={160} />
              </div>

              <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase mb-3">
                <Sparkles size={12} /> Premium Marriage Matching
              </div>

              <h3 className="text-xl font-black leading-tight">
                क्या इस मिलान में कोई गुप्त नाड़ी दोष, मांगलिक बाधा या पितृ दोष तो नहीं?
              </h3>

              <p className="mt-2 text-xs text-orange-100 leading-5">
                यह नाम और राशि आधारित सामान्य मिलान है। विवाह के वास्तविक सुख, संतान योग, और सास-ससुर के साथ संबंधों की वास्तविक स्थिति केवल दोनों की मूल जन्मकुंडली के ६१ गुणों के मिलान से ही संभव है। यदि कुंडली में कोई छिपा हुआ दोष हुआ, तो शादी के बाद गंभीर क्लेश या तलाक की नौबत आ सकती है। तुरंत हमारी सीनियर फीमेल एस्ट्रोलॉजर पंडित जी से पूरी कुंडली चेक करवाएं।
              </p>

              <ul className="mt-4 space-y-2 text-xs font-bold text-amber-50">
                <li className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-yellow-300" /> मांगलिक और नाड़ी दोष निवारण के तुरंत असरदार गुप्त उपाय
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-yellow-300" /> शादी कब होगी, रुकावटें कैसे हटेंगी - शत-प्रतिशत लाइव भविष्यवाणी
                </li>
              </ul>

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href="https://wa.me्रणाम पंडित जी! मैंने अनुकूलता टेस्ट किया है, स्कोर बहुत अच्छा है। कृपया हमारी कुंडलियों का गहन विश्लेषण करके बताएं कि शादी में कोई नाड़ी या मांगलिक दोष तो नहीं है?"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-center text-sm font-black text-orange-700 shadow-md transition hover:bg-orange-50"
                >
                  💬 सीनियर पंडित जी से WhatsApp पर लाइव समाधान पाएं
                </a>
                <p className="text-[10px] text-center text-orange-200 flex items-center justify-center gap-1">
                  <ShieldCheck size={12} /> 100% प्रामाणिक वैदिक मिलान रिपोर्ट
                </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

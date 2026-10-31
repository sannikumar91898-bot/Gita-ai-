// app/kundli/page.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Scroll, Sparkles, Phone, TriangleAlert, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

export default function KundliPage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", dob: "", tob: "", pob: "" });

  const t = (hi: string, hing: string, en: string) =>
    isHindi ? hi : isHinglish ? hing : en;

  const pageClass = isDark ? "bg-slate-950 text-violet-50" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-slate-900" : "border-orange-100 bg-white shadow-xl";

  return (
    <main className={`min-h-screen w-full px-4 pb-40 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-violet-200" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-base font-black uppercase tracking-tight text-orange-600">
              {t("वैदिक कुंडली", "Vedic Kundli", "Vedic Kundli")}
            </h1>
            <p className="text-[11px] font-bold text-gray-400">
              {t("सटीक ज्योतिषीय गणना", "Sateek Jyotishiy Ganana", "Accurate Astrological Calculation")}
            </p>
          </div>
        </header>

        {step === 1 && (
          <section className={`space-y-4 rounded-2xl border p-5 ${cardClass}`}>
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-800 mb-4">
              <p className="flex items-start gap-2 text-xs font-semibold leading-5">
                <TriangleAlert size={16} className="shrink-0 text-rose-600 mt-0.5" />
                {t(
                  "🌸 कुंडली में छिपे दोष आपके जीवन को प्रभावित कर सकते हैं। जन्म विवरण भरें और सही समय पर उपाय जानें।",
                  "🌸 Kundli mein chhipe dosh aapke jeevan ko prabhavit kar sakte hain. Janm vivaran bharein aur sahi samay par upay jaanें.",
                  "🌸 Hidden doshas in your chart can affect your life. Fill your birth details and know the right remedies at the right time."
                )}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold">{t("पूरा नाम", "Poora Naam", "Full Name")}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`mt-1 w-full rounded-xl border px-4 py-2 text-sm ${isDark ? "border-slate-700 bg-slate-800" : "border-orange-200 bg-orange-50"}`}
                  placeholder={t("अपना नाम लिखें", "Apna naam likhein", "Enter your name")}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold">{t("जन्म तिथि", "Janm Tithi", "Date of Birth")}</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className={`mt-1 w-full rounded-xl border px-4 py-2 text-sm ${isDark ? "border-slate-700 bg-slate-800" : "border-orange-200 bg-orange-50"}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold">{t("जन्म समय", "Janm Samay", "Time of Birth")}</label>
                  <input
                    type="time"
                    value={formData.tob}
                    onChange={(e) => setFormData({ ...formData, tob: e.target.value })}
                    className={`mt-1 w-full rounded-xl border px-4 py-2 text-sm ${isDark ? "border-slate-700 bg-slate-800" : "border-orange-200 bg-orange-50"}`}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold">{t("जन्म स्थान", "Janm Sthan", "Place of Birth")}</label>
                <input
                  type="text"
                  value={formData.pob}
                  onChange={(e) => setFormData({ ...formData, pob: e.target.value })}
                  className={`mt-1 w-full rounded-xl border px-4 py-2 text-sm ${isDark ? "border-slate-700 bg-slate-800" : "border-orange-200 bg-orange-50"}`}
                  placeholder={t("शहर का नाम", "Sheher ka naam", "City name")}
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-md transition active:scale-[0.99]"
            >
              {t("कुंडली बनाएं", "Kundli Banayein", "Generate Kundli")}
            </button>
          </section>
        )}

        {step === 2 && (
          <section className={`space-y-5 rounded-2xl border p-5 text-center ${cardClass}`}>
            <Scroll size={50} className="mx-auto text-orange-500 animate-pulse" />
            <h2 className="text-lg font-bold">{t("कुंडली तैयार हो रही है...", "Kundli taiyar ho rahi hai...", "Generating Kundli...")}</h2>
            <p className="text-sm text-gray-500">
              {t("कृपया प्रतीक्षा करें, ग्रहों की गणना की जा रही है।", "Kripya pratiksha karein, grahon ki ganana ki ja rahi hai.", "Please wait, planetary calculations are in progress.")}
            </p>
            
            <div className="mt-6 rounded-xl border border-rose-300 bg-rose-50 p-4">
              <p className="text-sm font-bold text-rose-800 mb-3">
                {t("जब तक कुंडली बन रही है, ज्योतिषी से बात करें", "Jab tak kundli ban rahi hai, jyotishi se baat karein", "While it generates, talk to our Astrologer")}
              </p>
              <Link 
                href="/chat"
                className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-2 text-sm font-bold text-white shadow transition active:scale-95"
              >
                <MessageCircle size={16} />
                {t("अभी चैट करें", "Chat Now", "Chat Now")}
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* BOTTOM RED BAR (Linked to Chat) */}
      <Link
        href="/chat"
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 px-4 py-3.5 text-white shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
            <Phone size={18} />
          </span>
          <div className="leading-tight">
            <p className="text-[10px] font-black uppercase tracking-wider text-rose-100">
              {t("ज्योतिषी • 24x7 उपलब्ध", "Astrologer • 24x7 Available", "Astrologer • 24x7 Available")}
            </p>
            <p className="text-sm font-black">
              {t(
                "अभी बात करें — पहली चैट FREE",
                "Talk Now — First Chat FREE",
                "Talk Now — First Chat FREE"
              )}
            </p>
          </div>
        </div>
      </Link>
    </main>
  );
}
// app/kundli/page.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Scroll, Phone, TriangleAlert, MessageCircle, Download, CheckCircle2 } from "lucide-react";
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

  // 1. Form Submit function
  const handleGenerate = () => {
    if (!formData.name || !formData.dob) {
      alert(t("कृपया नाम और जन्म तिथि भरें।", "Kripya naam aur janm tithi bharein.", "Please enter name and DOB."));
      return;
    }
    setStep(2); // Go to loading screen

    // 2.5 second baad result (Step 3) par bhej do
    setTimeout(() => {
      setStep(3);
    }, 2500);
  };

  return (
    <main className={`min-h-screen w-full px-4 pb-40 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        
        {/* HEADER */}
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

        {/* STEP 1: FORM */}
        {step === 1 && (
          <section className={`space-y-4 rounded-2xl border p-5 ${cardClass}`}>
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-800 mb-4">
              <p className="flex items-start gap-2 text-xs font-semibold leading-5">
                <TriangleAlert size={16} className="shrink-0 text-rose-600 mt-0.5" />
                {t(
                  "🌸 कुंडली में छिपे दोष आपके जीवन को प्रभावित कर सकते हैं। जन्म विवरण भरें और सही समय पर उपाय जानें।",
                  "🌸 Kundli mein chhipe dosh aapke jeevan ko prabhavit kar sakte hain. Janm vivaran bharein aur sahi samay par upay jaanें.",
                  "🌸 Hidden doshas in your chart can affect your life. Fill your birth details and know the right remedies."
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
              onClick={handleGenerate}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-md transition active:scale-[0.99]"
            >
              {t("कुंडली बनाएं", "Kundli Banayein", "Generate Kundli")}
            </button>
          </section>
        )}

        {/* STEP 2: LOADING */}
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

        {/* STEP 3: RESULT & MARKETING HOOK */}
        {step === 3 && (
          <section className={`space-y-4 rounded-2xl border-2 border-orange-300 p-5 ${isDark ? "bg-slate-900" : "bg-gradient-to-br from-orange-50 to-amber-50"}`}>
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <CheckCircle2 size={50} className="text-green-500" />
              <h2 className="text-xl font-black text-orange-700 dark:text-orange-400">
                {t("आपकी कुंडली तैयार है!", "Aapki Kundli taiyar hai!", "Your Kundli is ready!")}
              </h2>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                {formData.name} ({formData.dob})
              </p>
            </div>

            <div className={`rounded-xl border p-4 mt-4 ${isDark ? "border-rose-900 bg-rose-950/40" : "border-rose-300 bg-rose-50"}`}>
              <p className={`text-xs font-bold leading-5 ${isDark ? "text-rose-200" : "text-rose-950"}`}>
                {t(
                  "⚠️ आपकी कुंडली में एक बड़ा 'दोष' (Mangal Dosh/Dasha) सक्रिय है, जो पिछले कुछ समय से आपके कामों में रुकावट डाल रहा है। इसका सही कारण और उपाय जानना बहुत जरूरी है।",
                  "⚠️ Aapki kundli mein ek bada 'Dosh' (Mangal Dosh/Dasha) sakriya hai, jo pichhle kuch samay se aapke kaamon mein rukawat daal raha hai. Iska sahi karan aur upay jaanna bahut zaroori hai.",
                  "⚠️ A big 'Dosha' is active in your chart, causing blockages in your efforts. It is very important to know the cause and remedy."
                )}
              </p>
            </div>

            <button 
              onClick={() => alert(t("PDF डाउनलोड हो रही है...", "PDF is downloading...", "PDF is downloading..."))}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm font-bold text-white shadow-md active:scale-95"
            >
              <Download size={16} />
              {t("PDF रिपोर्ट डाउनलोड करें", "Download PDF Report", "Download PDF Report")}
            </button>

            <Link
              href="/chat"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-3.5 text-sm font-black text-white shadow-lg active:scale-[0.99]"
            >
              <MessageCircle size={18} />
              {t("दोष और उपाय जानने के लिए ज्योतिषी से बात करें", "Dosh aur upay jaanne ke liye jyotishi se baat karein", "Talk to Astrologer to know remedy")}
            </Link>
            
            <button
              onClick={() => { setStep(1); setFormData({ name: "", dob: "", tob: "", pob: "" }); }}
              className={`w-full text-center text-xs font-bold mt-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}
            >
              {t("नई कुंडली बनाएं", "Nayi Kundli banayein", "Generate new Kundli")}
            </button>
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
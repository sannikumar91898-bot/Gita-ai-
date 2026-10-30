// app/app/horoscope/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sun, Phone, TriangleAlert } from "lucide-react";
import { useApp } from "../../Providers";

export default function HoroscopePage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  const t = (hi: string, hing: string, en: string) =>
    isHindi ? hi : isHinglish ? hing : en;

  const pageClass = isDark ? "bg-slate-950 text-violet-50" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-slate-900 shadow-xl" : "border-orange-100 bg-white shadow-xl";
  const mutedClass = isDark ? "text-slate-300" : "text-violet-600";

  return (
    <main className={`min-h-dvh px-4 pb-40 pt-6 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link
            href="/"
            className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-violet-200" : "bg-orange-50 text-orange-600"}`}
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="flex items-center gap-1.5 text-base font-black uppercase tracking-tight text-orange-600">
              <Sun size={18} className="text-amber-500" />
              {t("राशिफल", "Horoscope", "Horoscope")}
            </h1>
            <p className="mt-0.5 text-[11px] font-bold text-gray-400">
              {t("दैनिक ज्योतिषीय मार्गदर्शन", "Daily Astrological Guidance", "Daily Astrological Guidance")}
            </p>
          </div>
        </header>

        <section className={`space-y-4 rounded-2xl border p-5 ${cardClass}`}>
          <div className="rounded-xl border border-rose-300 bg-rose-50 p-4">
            <p className="flex items-start gap-2 text-sm font-semibold leading-6 text-rose-800">
              <TriangleAlert size={18} className="shrink-0 text-rose-600 mt-0.5" />
              {t(
                "🌸 राशिफल सामान्य मार्गदर्शन है। आपकी व्यक्तिगत कुंडली में छिपे दोष शारीरिक व आर्थिक संकट ला सकते हैं। तुरंत हमारी महिला ज्योतिषियों में से किसी एक से बात करें।",
                "🌸 Rashifal samanya margdarshan hai. Aapki vyaktigat kundli mein chhipe dosh sharirik va aarthik sankat la sakte hain. Turant hamari Mahila Jyotishiyon mein se kisi ek se baat karein.",
                "🌸 Horoscope is general guidance. Hidden doshas in your personal chart can bring physical and financial crisis. Talk to one of our Female Astrologers immediately."
              )}
            </p>
          </div>

          <div className={`rounded-xl border p-4 ${isDark ? "border-slate-700" : "border-orange-200"}`}>
            <h3 className="mb-2 text-sm font-bold text-orange-500">
              {t("आज का विशेष संदेश", "Aaj Ka Vishesh Sandesh", "Today's Special Message")}
            </h3>
            <p className={`text-sm leading-7 ${mutedClass}`}>
              {t(
                "आज का दिन आपके लिए भावनात्मक रूप से महत्वपूर्ण है। परिवार या रिश्तों में किसी बात को लेकर मन में उलझन हो सकती है। इसे अनदेखा न करें। हमारी महिला ज्योतिषियों में से किसी एक से दिल से बात करें, वो प्यार से सही रास्ता दिखा देंगी।",
                "Aaj ka din aapke liye bhawnatmak roop se mahatvapurn hai. Parivaar ya rishton mein kisi baat ko lekar mann mein uljhan ho sakti hai. Ise andekha na karein. Hamari Mahila Jyotishiyon mein se kisi ek se dil se baat karein, wo pyaar se sahi raasta dikha dengi.",
                "Today is emotionally significant for you. Some confusion might trouble your mind regarding family or relationships. Do not ignore this. Talk from the heart with one of our Female Astrologers, she will lovingly show you the right path."
              )}
            </p>
          </div>
        </section>
      </div>

      <a
        href="tel:+919999999999"
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 px-4 py-3.5 text-white shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
            <Phone size={18} />
          </span>
          <div className="leading-tight">
            <p className="text-[10px] font-black uppercase tracking-wider text-rose-100">
              {isHindi ? "हमारी महिला ज्योतिषी • 24x7 उपलब्ध" : isHinglish ? "Hamari Mahila Jyotishi • 24x7 Available" : "Our Female Astrologers • 24x7 Available"}
            </p>
            <p className="text-sm font-black">
              {isHindi ? "किसी एक से दिल से बात करें — वो प्यार से सब समझा देंगी" : isHinglish ? "Kisi ek se dil se baat karein — wo pyaar se sab samjha dengi" : "Talk from the heart with one — she will lovingly explain everything"}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-rose-700">
          {isHindi ? "कॉल" : isHinglish ? "Call" : "Call"}
        </span>
      </a>
    </main>
  );
}
// app/horoscope/page.tsx
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Sun,
  Phone,
  TriangleAlert,
  Sparkles,
  MessageCircle,
  Star,
} from "lucide-react";
import { useApp } from "../Providers";

export default function HoroscopePage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  const t = (hi: string, hing: string, en: string) =>
    isHindi ? hi : isHinglish ? hing : en;

  const pageClass = isDark
    ? "bg-slate-950 text-violet-50"
    : "bg-[#FEF8EF] text-slate-900";

  const cardClass = isDark
    ? "border-slate-800 bg-slate-900 shadow-xl"
    : "border-orange-100 bg-white shadow-xl";

  const mutedClass = isDark ? "text-slate-300" : "text-violet-600";

  return (
    <main className={`min-h-screen w-full px-4 pb-44 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        {/* ================= HEADER ================= */}
        <header
          className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}
        >
          <Link
            href="/"
            className={`rounded-xl p-2 ${
              isDark
                ? "bg-slate-800 text-violet-200"
                : "bg-orange-50 text-orange-600"
            }`}
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="flex items-center gap-1.5 text-base font-black uppercase tracking-tight text-orange-600">
              <Sun size={18} className="text-amber-500" />
              {t("राशिफल", "Horoscope", "Horoscope")}
            </h1>
            <p className="mt-0.5 text-[11px] font-bold text-gray-400">
              {t(
                "दैनिक ज्योतिषीय मार्गदर्शन",
                "Daily Astrological Guidance",
                "Daily Astrological Guidance"
              )}
            </p>
          </div>
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
            FREE
          </span>
        </header>

        {/* ================= WARNING BOX ================= */}
        <section className={`space-y-4 rounded-2xl border p-5 ${cardClass}`}>
          <div className="rounded-xl border border-rose-300 bg-rose-50 p-4">
            <p className="flex items-start gap-2 text-sm font-semibold leading-6 text-rose-800">
              <TriangleAlert
                size={18}
                className="mt-0.5 shrink-0 text-rose-600"
              />
              {t(
                "🌸 राशिफल सामान्य मार्गदर्शन है। आपकी व्यक्तिगत कुंडली में छिपे दोष शारीरिक व आर्थिक संकट ला सकते हैं। सही समय पर उपाय जानने के लिए हमारे ज्योतिषी से बात करें।",
                "🌸 Rashifal samanya margdarshan hai. Aapki vyaktigat kundli mein chhipe dosh sharirik va aarthik sankat la sakte hain. Sahi samay par upay jaanne ke liye hamare jyotishi se baat karein.",
                "🌸 Horoscope is general guidance. Hidden doshas in your personal chart can bring physical and financial crisis. Talk to our astrologer to know the right remedy at the right time."
              )}
            </p>
          </div>

          {/* Today's message */}
          <div
            className={`rounded-xl border p-4 ${
              isDark ? "border-slate-700" : "border-orange-200"
            }`}
          >
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-orange-500">
              <Sparkles size={14} />
              {t(
                "आज का विशेष संदेश",
                "Aaj Ka Vishesh Sandesh",
                "Today's Special Message"
              )}
            </h3>
            <p className={`text-sm leading-7 ${mutedClass}`}>
              {t(
                "आज का दिन आपके लिए भावनात्मक रूप से महत्वपूर्ण है। परिवार या रिश्तों में किसी बात को लेकर मन में उलझन हो सकती है। इसे अनदेखा न करें। अपनी कुंडली की सही जाँच के लिए ज्योतिषी से बात करें।",
                "Aaj ka din aapke liye bhawnatmak roop se mahatvapurn hai. Parivaar ya rishton mein kisi baat ko lekar mann mein uljhan ho sakti hai. Ise andekha na karein. Apni kundli ki sahi jaanch ke liye jyotishi se baat karein.",
                "Today is emotionally significant for you. Some confusion might trouble your mind regarding family or relationships. Do not ignore this. Talk to our astrologer for an accurate Kundli reading."
              )}
            </p>
          </div>

          {/* CTA inside card */}
          <Link
            href="/chat"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-3 text-sm font-black text-white shadow-lg active:scale-[0.99]"
          >
            <MessageCircle size={16} />
            {t(
              "ज्योतिषी से बात करें — पहली बात FREE",
              "Jyotishi se baat karein — Pehli baat FREE",
              "Talk to Astrologer — First chat FREE"
            )}
          </Link>
        </section>

        {/* ================= TRUST STRIP ================= */}
        <div
          className={`grid grid-cols-3 gap-2 rounded-2xl border p-3 text-center ${cardClass}`}
        >
          <div>
            <p className="text-base font-black text-orange-600">50K+</p>
            <p className="text-[10px] font-bold text-slate-500">
              {t("संतुष्ट यूज़र", "Happy Users", "Happy Users")}
            </p>
          </div>
          <div>
            <p className="text-base font-black text-orange-600">4.8★</p>
            <p className="text-[10px] font-bold text-slate-500">
              {t("रेटिंग", "Rating", "Rating")}
            </p>
          </div>
          <div>
            <p className="text-base font-black text-orange-600">24x7</p>
            <p className="text-[10px] font-bold text-slate-500">
              {t("ज्योतिषी", "Astrologers", "Astrologers")}
            </p>
          </div>
        </div>

        {/* ================= DISCLAIMER ================= */}
        <p className="px-6 text-center text-[9px] leading-3 text-slate-400/40 dark:text-slate-500/30 select-none tracking-wide">
          {t(
            "© 2026 Astrologer App. यह प्लेटफ़ॉर्म प्राचीन वैदिक ज्योतिष के सिद्धांतों पर आधारित गणनाएँ प्रदर्शित करता है।",
            "© 2026 Astrologer App. Yeh platform pracheen Vedic Jyotish ke siddhanton par aadharit gananayein pradarshit karta hai.",
            "© 2026 Astrologer App. This platform displays calculations based on ancient Vedic Astrology principles."
          )}
        </p>
      </div>

      {/* ================= STICKY CTA → /chat ================= */}
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
              {t(
                "ज्योतिषी • 24x7 उपलब्ध",
                "Jyotishi • 24x7 Available",
                "Astrologers • 24x7 Available"
              )}
            </p>
            <p className="text-sm font-black">
              {t(
                "अभी बात करें — पहली बातचीत FREE",
                "Abhi baat karein — Pehli baatcheet FREE",
                "Talk now — First chat FREE"
              )}
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-black text-rose-700">
          <Star size={11} fill="currentColor" />
          {t("चैट", "Chat", "Chat")}
        </span>
      </Link>
    </main>
  );
}
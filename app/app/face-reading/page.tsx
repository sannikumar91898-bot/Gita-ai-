// app/face-reading/page.tsx
"use client";

import { ArrowLeft, ScanFace, Phone, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

export default function FaceReadingPage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

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
              {t("फेस रीडिंग", "Face Reading", "Face Reading")}
            </h1>
          </div>
        </header>

        <section className={`space-y-4 rounded-2xl border p-5 text-center ${cardClass}`}>
          <ScanFace size={50} className="mx-auto text-orange-500" />
          <h2 className="text-lg font-bold">{t("अपना फोटो अपलोड करें", "Apna photo upload karein", "Upload your photo")}</h2>
          
          <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-left">
            <p className="flex items-start gap-2 text-sm font-semibold leading-6 text-rose-800">
              <TriangleAlert size={18} className="shrink-0 text-rose-600 mt-0.5" />
              {t(
                "🌸 आपके चेहरे के लक्षण आपके स्वभाव और भाग्य के बारे में गहरी बातें बताते हैं। सही समझ के लिए तुरंत महिला ज्योतिषी से प्यार से बात करें।",
                "🌸 Aapke chehre ke lakshan aapke swabhav aur bhagya ke baare mein gehri baatein batate hain. Sahi samajh ke liye turant Mahila Jyotishi se pyaar se baat karein.",
                "🌸 Your facial features reveal deep insights about your nature and destiny. For the right understanding, talk lovingly with our Female Astrologer immediately."
              )}
            </p>
          </div>

          <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-md transition active:scale-[0.99]">
            {t("फोटो अपलोड करें", "Upload Photo", "Upload Photo")}
          </button>
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
              {isHindi ? "महिला ज्योतिषी • 24x7 उपलब्ध" : isHinglish ? "Mahila Jyotishi • 24x7 Available" : "Female Astrologer • 24x7 Available"}
            </p>
            <p className="text-sm font-black">
              {isHindi ? "दिल से बात करें — वो प्यार से सब समझा देंगी" : isHinglish ? "Dil Se Baat Karein — Wo Pyaar Se Sab Samjha Dengi" : "Talk from the Heart — She Explains with Love"}
            </p>
          </div>
        </div>
      </a>
    </main>
  );
}
// app/settings/page.tsx
"use client";

import { ArrowLeft, User, Moon, Sun, Globe, Phone } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

export default function SettingsPage() {
  const { lang, setLang, theme, setTheme } = useApp();

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
              {t("सेटिंग्स", "Settings", "Settings")}
            </h1>
          </div>
        </header>

        <section className={`space-y-6 rounded-2xl border p-5 ${cardClass}`}>
          {/* Profile Placeholder */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t("अतिथि उपयोगकर्ता", "Guest User", "Guest User")}</h2>
              <p className="text-xs text-gray-500">{t("लॉगिन करने के लिए टैप करें", "Login karne ke liye tap karein", "Tap to login")}</p>
            </div>
          </div>

          <hr className={isDark ? "border-slate-700" : "border-gray-200"} />

          {/* Theme Settings */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-orange-500">
              {isDark ? <Moon size={16} /> : <Sun size={16} />}
              {t("थीम", "Theme", "Theme")}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 rounded-xl border py-2 text-xs font-bold ${!isDark ? "border-orange-500 bg-orange-50 text-orange-600" : "border-slate-700 text-slate-400"}`}
              >
                {t("लाइट", "Light", "Light")}
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 rounded-xl border py-2 text-xs font-bold ${isDark ? "border-orange-500 bg-slate-800 text-orange-400" : "border-gray-200 text-gray-500"}`}
              >
                {t("डार्क", "Dark", "Dark")}
              </button>
            </div>
          </div>

          <hr className={isDark ? "border-slate-700" : "border-gray-200"} />

          {/* Language Settings */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-orange-500">
              <Globe size={16} />
              {t("भाषा", "Language", "Language")}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setLang("hi")}
                className={`flex-1 rounded-xl border py-2 text-xs font-bold ${isHindi ? "border-orange-500 bg-orange-50 text-orange-600" : isDark ? "border-slate-700 text-slate-400" : "border-gray-200 text-gray-500"}`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLang("hinglish")}
                className={`flex-1 rounded-xl border py-2 text-xs font-bold ${isHinglish ? "border-orange-500 bg-orange-50 text-orange-600" : isDark ? "border-slate-700 text-slate-400" : "border-gray-200 text-gray-500"}`}
              >
                Hinglish
              </button>
              <button
                onClick={() => setLang("en")}
                className={`flex-1 rounded-xl border py-2 text-xs font-bold ${!isHindi && !isHinglish ? "border-orange-500 bg-orange-50 text-orange-600" : isDark ? "border-slate-700 text-slate-400" : "border-gray-200 text-gray-500"}`}
              >
                English
              </button>
            </div>
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
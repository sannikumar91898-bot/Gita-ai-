// app/[lang]/panchang/PanchangClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Sun } from "lucide-react";
import { useApp } from "../../Providers"; // Path check kar lein

const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: { title: "आज का पंचांग", subtitle: "दैनिक हिंदू कैलेंडर", date: "तिथि", day: "वार", nakshatra: "नक्षत्र", sunrise: "सूर्योदय", sunset: "सूर्यास्त" },
    en: { title: "Today's Panchang", subtitle: "Daily Hindu Calendar", date: "Tithi", day: "Day", nakshatra: "Nakshatra", sunrise: "Sunrise", sunset: "Sunset" },
  };
  return ui[lang]?.[key] || ui["en"][key] || ui["hi"][key] || "";
};

export default function PanchangClient() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  const t = (key: string) => getUIText(lang, key);
  
  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c] shadow-lg" : "border-orange-100 bg-white shadow-md";

  return (
    <main className={`min-h-[100dvh] w-full pb-36 ${pageClass} font-sans`}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href={`/${lang}`} className={`rounded-xl p-2.5 ${isDark ? "bg-[#0A0F19]" : "bg-orange-50 text-orange-600"}`}><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-[17px] sm:text-[20px] font-black uppercase tracking-tight text-[#ff6b00]">{t("title")}</h1>
            <p className={`text-[11px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("subtitle")}</p>
          </div>
        </header>

        <div className={`p-6 rounded-[1.5rem] border ${cardClass} space-y-4`}>
          <div className="flex items-center gap-4 border-b pb-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><Sun size={24} /></div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">{t("sunrise")}</p>
              <p className="text-lg font-black">06:12 AM</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-gray-500 uppercase font-bold">{t("sunset")}</p>
              <p className="text-lg font-black">06:45 PM</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border ${isDark ? "border-slate-700" : "border-gray-200"}`}>
              <p className="text-xs text-[#ff6b00] font-bold uppercase mb-1">{t("date")}</p>
              <p className="font-black text-lg">Purnima</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? "border-slate-700" : "border-gray-200"}`}>
              <p className="text-xs text-[#ff6b00] font-bold uppercase mb-1">{t("nakshatra")}</p>
              <p className="font-black text-lg">Rohini</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
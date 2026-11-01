// app/panchang/page.tsx
"use client";

import { ArrowLeft, CalendarDays, Sun, Moon, Flame, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

export default function PanchangPage() {
  const { theme } = useApp();
  const isDark = theme === "dark";

  const pageClass = isDark ? "bg-slate-950 text-violet-50" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-slate-900" : "border-orange-100 bg-white shadow-xl";

  return (
    <main className={`min-h-screen w-full px-4 pb-40 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2 ${isDark ? "bg-slate-800" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-base font-black uppercase text-orange-600">Daily Panchang</h1>
        </header>

        <section className={`rounded-2xl border p-5 ${cardClass}`}>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CalendarDays className="text-orange-500" /> Aaj Ka Panchang
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl border p-3 ${isDark ? "border-slate-700 bg-slate-800" : "border-orange-100 bg-orange-50"}`}>
              <p className="text-xs text-gray-500 font-bold">Tithi</p>
              <p className="text-sm font-black">Shukla Paksha</p>
            </div>
            <div className={`rounded-xl border p-3 ${isDark ? "border-slate-700 bg-slate-800" : "border-orange-100 bg-orange-50"}`}>
              <p className="text-xs text-gray-500 font-bold">Rahu Kaal</p>
              <p className="text-sm font-black text-rose-600">12:00 PM - 1:30 PM</p>
            </div>
            <div className={`rounded-xl border p-3 ${isDark ? "border-slate-700 bg-slate-800" : "border-orange-100 bg-orange-50"}`}>
              <p className="text-xs text-gray-500 font-bold">Shubh Muhurat</p>
              <p className="text-sm font-black text-green-600">10:15 AM - 11:45 AM</p>
            </div>
            <div className={`rounded-xl border p-3 ${isDark ? "border-slate-700 bg-slate-800" : "border-orange-100 bg-orange-50"}`}>
              <p className="text-xs text-gray-500 font-bold">Sunset</p>
              <p className="text-sm font-black">06:15 PM</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-rose-300 bg-rose-50 p-4">
            <p className="text-sm font-bold text-rose-800 mb-2">
              ⚠️ Aaj Rahu Kaal mein koi shubh kaam na karein. 
            </p>
            <p className="text-xs text-rose-700">
              Agar aapko aaj koi bada kaam karna hai, toh pehle jyotishi se shubh muhurat confirm kar lein.
            </p>
          </div>

          <Link href="/chat" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow-md">
            <MessageCircle size={16} /> Shubh Muhurat Puchhein
          </Link>
        </section>
      </div>
    </main>
  );
}
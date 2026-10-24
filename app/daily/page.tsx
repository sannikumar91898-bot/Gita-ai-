"use client";

import { ArrowLeft, Sun, Sparkles } from "lucide-react";
import Link from "next/link";

export default function DailyPage() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-4 text-violet-50">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-violet-300 hover:text-gold-300">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-xl font-bold flex items-center gap-2">
          <Sun className="text-gold-300" size={20} />
          <span>दैनिक राशिफल (Daily Horoscope)</span>
        </h1>
      </div>
      <div className="card p-5 border border-gold-400/10 space-y-4">
        <p className="text-sm text-violet-200 leading-relaxed">
          सितारे आज आपके बारे में क्या कहते हैं? आपका भाग्यशाली अंक और शुभ रंग यहाँ दिखाई देगा।
        </p>
        <div className="p-4 bg-violet-950/30 border border-gold-400/20 rounded-xl text-center space-y-2">
          <Sparkles className="mx-auto text-gold-300" size={24} />
          <h3 className="font-display text-sm font-bold text-gold-300">राशिफल लोड हो रही है...</h3>
        </div>
      </div>
    </div>
  );
}

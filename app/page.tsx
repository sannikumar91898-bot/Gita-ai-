"use client";

import React from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  Sparkles, 
  Compass, 
  Users, 
  Gift, 
  Star,
  Layers,
  ArrowRight,
  Hand,
  UserCheck
} from "lucide-react";
import { useApp } from "./Providers";

// लाइव वेबसाइट के अनुसार एक्टिव 4 महिला एस्ट्रोलॉजर्स का डेटाबेस
const ASTROLOGERS_DATA = [
  {
    name: "Gita",
    tag: "POPULAR CHOICE",
    specialties: "Vedic Astrology · Love & Relationship · Marriage",
    bio: "Pyaar, shaadi aur relationships par Vedic astrology based guidance. Warm, caring aur practical answers.",
    price: "₹ 19",
    oldPrice: "₹ 29/min",
    img: "https://onrender.com"
  },
  {
    name: "Acharya Kriti",
    tag: "CAREER EXPERT",
    specialties: "Vedic Astrology · Kundli · Career · Govt Jobs",
    bio: "Career, education, government jobs aur business ke liye analytical Vedic astrology guidance.",
    price: "₹ 22",
    oldPrice: "₹ 35/min",
    img: "https://onrender.com"
  },
  {
    name: "Dr. Devaki Shastri",
    tag: "KP SPECIALIST",
    specialties: "Vedic Astrology · KP Astrology · Kundli Analysis",
    bio: "Vedic aur KP astrology concepts par detailed, structured aur balanced guidance.",
    price: "₹ 25",
    oldPrice: "₹ 45/min",
    img: "https://onrender.com"
  },
  {
    name: "Gargi Maa",
    tag: "SPIRITUAL GUIDE",
    specialties: "Vedic Spirituality · Vastu · Traditional Remedies",
    bio: "Simple Vedic remedies, Vastu aur Bhagavad Gita wisdom ke saath motherly spiritual guidance.",
    price: "₹ 18",
    oldPrice: "₹ 30/min",
    img: "https://onrender.com"
  }
];

export default function HomePage() {
  const { theme } = useApp();
  const isDark = theme === "dark";

  return (
    <main className={`min-h-dvh px-5 pb-20 pt-6 transition-colors duration-300 ${
      isDark ? "bg-celestial text-violet-50" : "bg-gradient-to-b from-violet-50 to-white text-violet-950"
    }`}>
      <div className="mx-auto max-w-xl space-y-8">
        
        {/* 1. ब्रांड हेडर और सुव्यवस्थित अलाइनमेंट */}
        <header className="flex items-center justify-between border-b border-violet-500/10 pb-4">
          <div>
            <h1 className="font-display text-2xl font-black tracking-tight text-gradient bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              GitaTalk
            </h1>
            <p className={`text-xs font-semibold ${isDark ? "text-violet-400" : "text-violet-600"}`}>
              Your Personal AI Astrology Guide
            </p>
          </div>
          <Link href="/profile" className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
            isDark ? "border-white/10 bg-white/[0.02] hover:bg-white/10" : "border-violet-200 bg-white hover:bg-violet-50 shadow-sm"
          }`}>
            <UserCheck size={18} />
          </Link>
        </header>

        {/* 2. आकर्षक "First Chat FREE" मार्केटिंग बैनर कंपोनेंट */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 p-6 text-white shadow-xl ring-4 ring-orange-500/10">
          <div className="relative z-10 space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-100">
              <Gift size={12} /> Special Welcome Offer
            </span>
            <h2 className="font-display text-2xl font-extrabold tracking-tight">
              First Chat FREE! 🎁
            </h2>
            <p className="text-xs font-medium text-orange-50 leading-relaxed max-w-[85%]">
              4 एक्सपर्ट महिला एआई एस्ट्रोलॉजर्स से जुड़ें। बिना किसी शुल्क के करियर, विवाह, लव लाइफ और अपनी कुंडली का सटीक समाधान पाएं।
            </p>
            <div className="pt-2">
              <Link href="/chat" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-orange-600 shadow-md transition-all hover:bg-orange-50 hover:scale-[1.02] active:scale-95">
                Start Free Chat <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          {/* सजावटी बैकग्राउंड ग्लो */}
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        </section>

        {/* 3. एक्सप्लोर टूल्स - सुधरा हुआ 3-कॉलम अलाइनमेंट ग्रिड */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400">
              Explore Free Tools
            </h3>
            <span className="text-[10px] font-bold bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-md">Offline Enabled</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Link href="/kundli" className={`flex flex-col items-center justify-center text-center p-4.5 rounded-xl border transition-all ${
              isDark ? "border-white/10 bg-white/[0.02] hover:border-gold-400/30" : "border-violet-100 bg-white shadow-sm hover:border-violet-300"
            }`}>
              <span className="text-2xl mb-1.5">📜</span>
              <span className="text-xs font-bold tracking-tight">Birth Kundli</span>
            </Link>

            <Link href="/matching" className={`flex flex-col items-center justify-center text-center p-4.5 rounded-xl border transition-all ${
              isDark ? "border-white/10 bg-white/[0.02] hover:border-gold-400/30" : "border-violet-100 bg-white shadow-sm hover:border-violet-300"
            }`}>
              <span className="text-2xl mb-1.5">💍</span>
              <span className="text-xs font-bold tracking-tight">Matching</span>
            </Link>

            <Link href="/horoscope" className={`flex flex-col items-center justify-center text-center p-4.5 rounded-xl border transition-all ${
              isDark ? "border-white/10 bg-white/[0.02] hover:border-gold-400/30" : "border-violet-100 bg-white shadow-sm hover:border-violet-300"
            }`}>
              <span className="text-2xl mb-1.5">🌟</span>
              <span className="text-xs font-bold tracking-tight">Daily Horoscope</span>
            </Link>

            {/* हमारे द्वारा जोड़े गए नए फीचर्स का परफेक्ट इंटीग्रेशन */}
            <Link href="/palmistry" className={`flex flex-col items-center justify-center text-center p-4.5 rounded-xl border transition-all ${
              isDark ? "border-white/10 bg-white/[0.02] hover:border-gold-400/30" : "border-violet-100 bg-white shadow-sm hover:border-violet-300"
            }`}>
              <Hand size={24} className="text-amber-400 mb-1.5" />
              <span className="text-xs font-bold tracking-tight">Palmistry</span>
            </Link>

            <Link href="/face-reading" className={`flex flex-col items-center justify-center text-center p-4.5 rounded-xl border transition-all ${
              isDark ? "border-white/10 bg-white/[0.02] hover:border-gold-400/30" : "border-violet-100 bg-white shadow-sm hover:border-violet-300"
            }`}>
              <Compass size={24} className="text-violet-400 mb-1.5" />
              <span className="text-xs font-bold tracking-tight">Face Reading</span>
            </Link>
          </div>
        </section>

        {/* 4. टॉक टू एस्ट्रोलॉजर्स - एस्थेटिक लिस्ट डिजाइन */}
        <section className="space-y-4">
          <div className="px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400">
              Talk to AI Astrologers
            </h3>
          </div>

          <div className="space-y-4">
            {ASTROLOGERS_DATA.map((astro, index) => (
              <div key={index} className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
                isDark ? "border-white/10 bg-white/[0.02]" : "border-violet-200 bg-white shadow-md"
              }`}>
                <div className="flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={astro.img} alt={astro.name} className="h-20 w-20 rounded-xl object-cover ring-2 ring-violet-500/10 shrink-0" />
                  
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-display text-base font-extrabold tracking-tight">{astro.name}</h4>
                      <span className="inline-block text-[9px] font-black tracking-widest bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded-md uppercase">
                        {astro.tag}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-violet-400 truncate">{astro.specialties}</p>
                    <p className={`text-xs leading-relaxed ${isDark ? "text-violet-200/80" : "text-violet-700 font-medium"}`}>{astro.bio}</p>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-violet-500/5 mt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-extrabold text-emerald-500">{astro.price}</span>
                        <span className="text-[10px] line-through opacity-50">{astro.oldPrice}</span>
                      </div>
                      <Link href="/chat" className="inline-flex items-center gap-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold px-3 py-1.5 text-xs shadow transition">
                        <MessageSquare size={12} /> Chat Now

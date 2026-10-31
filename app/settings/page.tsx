// app/settings/page.tsx
"use client";

import { ArrowLeft, User, Moon, Sun, Globe, ChevronRight, Home, Flame, Star, Gem, Clock, Wallet, Headphones, Gift, List, UserPlus, Video, ShoppingBag, BookOpen, MessageCircle, Scroll, Settings, Phone } from "lucide-react";
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
  const cardClass = isDark ? "border-slate-800 bg-[#1e293b]" : "border-orange-100 bg-white shadow-sm";
  const mutedClass = isDark ? "text-slate-400" : "text-gray-500";

  const exploreItems = [
    { name: t("होम", "Home", "Home"), icon: Home, href: "/" },
    { name: t("पूजा बुक करें", "Book a Pooja", "Book a Pooja"), icon: Flame, href: "#" },
    { name: t("फ्री सर्विसेज", "Free Services", "Free Services"), icon: Star, href: "#" },
    { name: t("रत्न", "Gemstones", "Gemstones"), icon: Gem, href: "#" },
    { name: t("फ्री सेशन", "Free Session", "Free Session"), icon: Clock, href: "#" },
  ];

  const accountItems = [
    { name: t("कस्टमर सपोर्ट चैट", "Customer Support Chat", "Customer Support Chat"), icon: Headphones, href: "#" },
    { name: t("वॉलेट ट्रांजैक्शन", "Wallet Transactions", "Wallet Transactions"), icon: Wallet, href: "#" },
    { name: t("गिफ्ट कार्ड रिडीम करें", "Redeem Gift Card", "Redeem Gift Card"), icon: Gift, href: "#" },
    { name: t("ऑर्डर हिस्ट्री", "Order History", "Order History"), icon: List, href: "#" },
    { name: t("मेरी फॉलोइंग", "My Following", "My Following"), icon: UserPlus, href: "#" },
    { name: t("वीडियो टेस्टीमोनियल", "Video Testimonials", "Video Testimonials"), icon: Video, href: "#" },
  ];

  const serviceItems = [
    { name: t("एस्ट्रो रेमेडी", "AstroRemedy", "AstroRemedy"), icon: ShoppingBag, href: "#" },
    { name: t("ज्योतिष ब्लॉग", "Astrology Blog", "Astrology Blog"), icon: BookOpen, href: "#" },
    { name: t("ज्योतिषियों से चैट करें", "Chat with Astrologers", "Chat with Astrologers"), icon: MessageCircle, href: "/chat" },
    { name: t("मेरी कुंडली", "My Kundli", "My Kundli"), icon: Scroll, href: "/kundli" },
  ];

  return (
    <main className={`min-h-screen w-full px-4 pb-40 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-6">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-violet-200" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-base font-black uppercase tracking-tight text-orange-600">
              {t("प्रोफाइल", "Profile", "Profile")}
            </h1>
          </div>
        </header>

        {/* PROFILE CARD */}
        <section className={`flex items-center gap-4 rounded-2xl border p-4 ${cardClass}`}>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500 border-2 border-orange-300">
            <User size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">{t("अतिथि उपयोगकर्ता", "Guest User", "Guest User")}</h2>
            <p className={`text-xs ${mutedClass}`}>{t("लॉगिन करने के लिए टैप करें", "Login karne ke liye tap karein", "Tap to login")}</p>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="grid grid-cols-3 gap-3">
          <div className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center ${cardClass}`}>
            <Clock size={22} className="text-orange-500" />
            <span className="text-xs font-bold">{t("मेरे ऑर्डर्स", "My Orders", "My Orders")}</span>
          </div>
          <div className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center ${cardClass}`}>
            <Wallet size={22} className="text-orange-500" />
            <span className="text-xs font-bold">{t("वॉलेट", "Wallet", "Wallet")}</span>
          </div>
          <Link href="/chat" className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center ${cardClass}`}>
            <Headphones size={22} className="text-orange-500" />
            <span className="text-xs font-bold">{t("सपोर्ट चैट", "Support Chat", "Support Chat")}</span>
          </Link>
        </section>

        {/* EXPLORE SECTION */}
        <section className="space-y-2">
          <h3 className={`px-1 text-xs font-bold uppercase tracking-wider ${mutedClass}`}>
            {t("एक्सप्लोर करें", "Explore", "Explore")}
          </h3>
          <div className={`overflow-hidden rounded-2xl border ${cardClass}`}>
            {exploreItems.map((item, idx) => (
              <Link key={idx} href={item.href} className={`flex items-center justify-between p-4 ${idx !== exploreItems.length - 1 ? (isDark ? "border-b border-slate-700" : "border-b border-gray-100") : ""}`}>
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="text-orange-500" />
                  <span className="text-sm font-semibold">{item.name}</span>
                </div>
                <ChevronRight size={16} className={mutedClass} />
              </Link>
            ))}
          </div>
        </section>

        {/* ACCOUNT SECTION */}
        <section className="space-y-2">
          <h3 className={`px-1 text-xs font-bold uppercase tracking-wider ${mutedClass}`}>
            {t("अकाउंट", "Account", "Account")}
          </h3>
          <div className={`overflow-hidden rounded-2xl border ${cardClass}`}>
            {accountItems.map((item, idx) => (
              <Link key={idx} href={item.href} className={`flex items-center justify-between p-4 ${idx !== accountItems.length - 1 ? (isDark ? "border-b border-slate-700" : "border-b border-gray-100") : ""}`}>
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="text-orange-500" />
                  <span className="text-sm font-semibold">{item.name}</span>
                </div>
                <ChevronRight size={16} className={mutedClass} />
              </Link>
            ))}
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="space-y-2">
          <h3 className={`px-1 text-xs font-bold uppercase tracking-wider ${mutedClass}`}>
            {t("सर्विसेज", "Services", "Services")}
          </h3>
          <div className={`overflow-hidden rounded-2xl border ${cardClass}`}>
            {serviceItems.map((item, idx) => (
              <Link key={idx} href={item.href} className={`flex items-center justify-between p-4 ${idx !== serviceItems.length - 1 ? (isDark ? "border-b border-slate-700" : "border-b border-gray-100") : ""}`}>
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="text-orange-500" />
                  <span className="text-sm font-semibold">{item.name}</span>
                </div>
                <ChevronRight size={16} className={mutedClass} />
              </Link>
            ))}
          </div>
        </section>

        {/* APP SETTINGS (Theme & Language) */}
        <section className="space-y-2">
          <h3 className={`px-1 text-xs font-bold uppercase tracking-wider ${mutedClass}`}>
            {t("ऐप सेटिंग्स", "App Settings", "App Settings")}
          </h3>
          <div className={`overflow-hidden rounded-2xl border p-4 space-y-5 ${cardClass}`}>
            
            {/* Theme */}
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 text-sm font-bold text-orange-500">
                {isDark ? <Moon size={16} /> : <Sun size={16} />}
                {t("थीम", "Theme", "Theme")}
              </h4>
              <div className="flex gap-2">
                <button onClick={() => setTheme("light")} className={`flex-1 rounded-xl border py-2 text-xs font-bold ${!isDark ? "border-orange-500 bg-orange-50 text-orange-600" : "border-slate-700 text-slate-400"}`}>
                  {t("लाइट", "Light", "Light")}
                </button>
                <button onClick={() => setTheme("dark")} className={`flex-1 rounded-xl border py-2 text-xs font-bold ${isDark ? "border-orange-500 bg-slate-800 text-orange-400" : "border-gray-200 text-gray-500"}`}>
                  {t("डार्क", "Dark", "Dark")}
                </button>
              </div>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 text-sm font-bold text-orange-500">
                <Globe size={16} />
                {t("भाषा", "Language", "Language")}
              </h4>
              <div className="flex gap-2">
                <button onClick={() => setLang("hi")} className={`flex-1 rounded-xl border py-2 text-xs font-bold ${isHindi ? "border-orange-500 bg-orange-50 text-orange-600" : isDark ? "border-slate-700 text-slate-400" : "border-gray-200 text-gray-500"}`}>हिंदी</button>
                <button onClick={() => setLang("hinglish")} className={`flex-1 rounded-xl border py-2 text-xs font-bold ${isHinglish ? "border-orange-500 bg-orange-50 text-orange-600" : isDark ? "border-slate-700 text-slate-400" : "border-gray-200 text-gray-500"}`}>Hinglish</button>
                <button onClick={() => setLang("en")} className={`flex-1 rounded-xl border py-2 text-xs font-bold ${!isHindi && !isHinglish ? "border-orange-500 bg-orange-50 text-orange-600" : isDark ? "border-slate-700 text-slate-400" : "border-gray-200 text-gray-500"}`}>English</button>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* FIXED RED BAR (Linked to Chat) */}
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
              {isHindi ? "ज्योतिषी • 24x7 उपलब्ध" : "Astrologer • 24x7 Available"}
            </p>
            <p className="text-sm font-black">
              {isHindi ? "अभी बात करें — पहली चैट FREE" : "Talk Now — First Chat FREE"}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-rose-700">
          {isHindi ? "चैट" : "Chat"}
        </span>
      </Link>
    </main>
  );
}
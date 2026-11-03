// app/settings/page.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, User, Moon, Sun, Globe, ChevronRight, Home, Clock, Wallet, Headphones, List, Scroll, Phone, HelpCircle, MessageCircle, Star, X } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

// 12 Zodiac Signs Avatars
const ZODIAC_AVATARS = [
  { id: "aries", name: "Aries", url: "https://cdn-icons-png.flaticon.com/512/1565/1565470.png" },
  { id: "taurus", name: "Taurus", url: "https://cdn-icons-png.flaticon.com/512/1565/1565477.png" },
  { id: "gemini", name: "Gemini", url: "https://cdn-icons-png.flaticon.com/512/1565/1565484.png" },
  { id: "cancer", name: "Cancer", url: "https://cdn-icons-png.flaticon.com/512/1565/1565488.png" },
  { id: "leo", name: "Leo", url: "https://cdn-icons-png.flaticon.com/512/1565/1565493.png" },
  { id: "virgo", name: "Virgo", url: "https://cdn-icons-png.flaticon.com/512/1565/1565499.png" },
  { id: "libra", name: "Libra", url: "https://cdn-icons-png.flaticon.com/512/1565/1565505.png" },
  { id: "scorpio", name: "Scorpio", url: "https://cdn-icons-png.flaticon.com/512/1565/1565510.png" },
  { id: "sagittarius", name: "Sagittarius", url: "https://cdn-icons-png.flaticon.com/512/1565/1565513.png" },
  { id: "capricorn", name: "Capricorn", url: "https://cdn-icons-png.flaticon.com/512/1565/1565519.png" },
  { id: "aquarius", name: "Aquarius", url: "https://cdn-icons-png.flaticon.com/512/1565/1565524.png" },
  { id: "pisces", name: "Pisces", url: "https://cdn-icons-png.flaticon.com/512/1565/1565530.png" },
];

export default function SettingsPage() {
  const { lang, setLanguage, theme, setTheme, me } = useApp(); // 🔥 me add kiya gaya hai

  const isDark = theme === "dark";
  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  // 🔥 Avatar Modal ke liye State
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const t = (hi: string, hing: string, en: string) =>
    isHindi ? hi : isHinglish ? hing : en;

  // 🔥 Check karo ki user asli hai ya guest
  const isLoggedIn = me && !me.isGuest && me.email;
  const userName = isLoggedIn ? me.name : t("अतिथि उपयोगकर्ता", "Guest User", "Guest User");
  const userEmail = isLoggedIn ? me.email : t("लॉगिन करने के लिए टैप करें", "Login karne ke liye tap karein", "Tap to login");

  const pageClass = isDark ? "bg-slate-950 text-violet-50" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#1e293b]" : "border-orange-100 bg-white shadow-sm";
  const mutedClass = isDark ? "text-slate-400" : "text-gray-500";

  // ✅ Sirf kaam ke features
  const exploreItems = [
    { name: t("होम", "Home", "Home"), icon: Home, href: "/" },
    { name: t("गीता AI से चैट करें", "Chat with Gita AI", "Chat with Gita AI"), icon: MessageCircle, href: "/chat" },
    { name: t("मेरी कुंडली", "My Kundli", "My Kundli"), icon: Scroll, href: "/kundli" },
  ];

  const accountItems = [
    { name: t("हेल्प सेंटर (FAQ)", "Help Center (FAQ)", "Help Center (FAQ)"), icon: HelpCircle, href: "/help" },
    { name: t("सपोर्ट टिकट", "Support Ticket", "Support Ticket"), icon: Headphones, href: "/support" },
    { name: t("वॉलेट ट्रांजैक्शन", "Wallet Transactions", "Wallet Transactions"), icon: Wallet, href: "/wallet" },
    { name: t("ऑर्डर हिस्ट्री", "Order History", "Order History"), icon: List, href: "/orders" },
  ];

  // Avatar Select Handler
  const handleAvatarSelect = (url: string) => {
    setSelectedAvatar(url);
    setShowAvatarModal(false);
    // 🔥 TODO: Yahan API call karke database mein avatar save karein 🔥
  };

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

        {/* PROFILE CARD (Dynamic Logic) */}
        <div 
          onClick={() => isLoggedIn ? setShowAvatarModal(true) : window.location.href = "/login"}
          className={`flex items-center gap-4 rounded-2xl border p-4 ${cardClass} active:scale-95 transition-transform cursor-pointer`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500 border-2 border-orange-300 overflow-hidden">
            {selectedAvatar ? (
              <img src={selectedAvatar} alt="Avatar" className="w-full h-full object-cover bg-yellow-400 p-1" />
            ) : (
              <User size={32} />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">{userName}</h2>
            <p className={`text-xs ${mutedClass}`}>{userEmail}</p>
          </div>
          {isLoggedIn && (
            <div className="text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Edit
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <section className="grid grid-cols-3 gap-3">
          <Link href="/orders" className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center ${cardClass} active:scale-95 transition-transform`}>
            <Clock size={22} className="text-orange-500" />
            <span className="text-xs font-bold">{t("मेरे ऑर्डर्स", "My Orders", "My Orders")}</span>
          </Link>
          <Link href="/wallet" className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center ${cardClass} active:scale-95 transition-transform`}>
            <Wallet size={22} className="text-orange-500" />
            <span className="text-xs font-bold">{t("वॉलेट", "Wallet", "Wallet")}</span>
          </Link>
          <Link href="/help" className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center ${cardClass} active:scale-95 transition-transform`}>
            <Headphones size={22} className="text-orange-500" />
            <span className="text-xs font-bold">{t("सपोर्ट", "Support", "Support")}</span>
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
                <button onClick={() => setLanguage("hi")} className={`flex-1 rounded-xl border py-2 text-xs font-bold ${isHindi ? "border-orange-500 bg-orange-50 text-orange-600" : isDark ? "border-slate-700 text-slate-400" : "border-gray-200 text-gray-500"}`}>हिंदी</button>
                <button onClick={() => setLanguage("hinglish")} className={`flex-1 rounded-xl border py-2 text-xs font-bold ${isHinglish ? "border-orange-500 bg-orange-50 text-orange-600" : isDark ? "border-slate-700 text-slate-400" : "border-gray-200 text-gray-500"}`}>Hinglish</button>
                <button onClick={() => setLanguage("en")} className={`flex-1 rounded-xl border py-2 text-xs font-bold ${!isHindi && !isHinglish ? "border-orange-500 bg-orange-50 text-orange-600" : isDark ? "border-slate-700 text-slate-400" : "border-gray-200 text-gray-500"}`}>English</button>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* 🔥 ZODIAC AVATAR MODAL 🔥 */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh] shadow-2xl animate-in slide-in-from-bottom duration-300">
            
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Change Profile Pic</h2>
                <p className="text-xs text-gray-500 mt-1">Select from library</p>
              </div>
              <button onClick={() => setShowAvatarModal(false)} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                {ZODIAC_AVATARS.map((avatar) => (
                  <button 
                    key={avatar.id}
                    onClick={() => handleAvatarSelect(avatar.url)}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all p-1 bg-yellow-400 ${selectedAvatar === avatar.url ? 'border-orange-500 scale-110' : 'border-transparent group-hover:border-orange-300'}`}>
                      <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-700">{avatar.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

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
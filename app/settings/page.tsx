// app/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, User, Moon, Sun, Globe, ChevronRight, Home, Clock, 
  Wallet, Headphones, List, Scroll, Phone, HelpCircle, MessageCircle, 
  X, LogOut, Shield, FileText, Mail, Check
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";
// 🔥 FIX: Path ko ../../i18n kiya gaya hai
import { LANGUAGES } from "../../i18n"; 

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
  const { lang, setLanguage, theme, setTheme, me } = useApp();

  const isDark = theme === "dark";
  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  // Profile Photo ko LocalStorage se load karo
  useEffect(() => {
    const savedAvatar = localStorage.getItem("gita_avatar");
    if (savedAvatar) setSelectedAvatar(savedAvatar);
  }, []);

  const t = (hi: string, hing: string, en: string) => isHindi ? hi : isHinglish ? hing : en;

  const isLoggedIn = Boolean(me?.user && !me.user.isGuest && me.user.email);
  const userName = isLoggedIn ? me?.user?.name || "User" : t("अतिथि उपयोगकर्ता", "Guest User", "Guest User");
  const userEmail = isLoggedIn ? me?.user?.email || "" : t("लॉगिन करने के लिए टैप करें", "Login karne ke liye tap karein", "Tap to login");

  const pageClass = isDark ? "bg-slate-950 text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151E2E] shadow-sm" : "border-orange-100 bg-white shadow-sm";
  const mutedClass = isDark ? "text-slate-400" : "text-gray-500";

  const exploreItems = [
    { name: t("होम", "Home", "Home"), icon: Home, href: "/" },
    { name: t("गीता AI से चैट करें", "Chat with Gita AI", "Chat with Gita AI"), icon: MessageCircle, href: "/chat?persona=gita" },
    { name: t("मेरी कुंडली", "My Kundli", "My Kundli"), icon: Scroll, href: "/kundli" },
  ];

  const accountItems = [
    { name: t("हेल्प सेंटर (FAQ)", "Help Center (FAQ)", "Help Center (FAQ)"), icon: HelpCircle, href: "/help" },
    { name: t("सपोर्ट टिकट", "Support Ticket", "Support Ticket"), icon: Headphones, href: "/support" },
    { name: t("वॉलेट ट्रांजैक्शन", "Wallet Transactions", "Wallet Transactions"), icon: Wallet, href: "/wallet" },
    { name: t("ऑर्डर हिस्ट्री", "Order History", "Order History"), icon: List, href: "/orders" },
  ];

  const legalItems = [
    { name: t("प्राइवेसी पॉलिसी", "Privacy Policy", "Privacy Policy"), icon: Shield, href: "/privacy" },
    { name: t("नियम और शर्तें", "Terms of Service", "Terms of Service"), icon: FileText, href: "/terms" },
    { name: t("संपर्क करें", "Contact Us", "Contact Us"), icon: Mail, href: "/contact" },
  ];

  const handleAvatarSelect = (url: string) => {
    setSelectedAvatar(url);
    localStorage.setItem("gita_avatar", url);
    setShowAvatarModal(false);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm(t("क्या आप सच में लॉगआउट करना चाहते हैं?", "Kya aap sach me logout karna chahte hain?", "Are you sure you want to logout?"));
    if (confirmLogout) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <main className={`min-h-screen w-full px-4 pb-32 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-6">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2 transition-colors ${isDark ? "bg-slate-800 text-orange-400 hover:bg-slate-700" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-base font-black uppercase tracking-tight text-orange-600">{t("प्रोफाइल", "Profile", "Profile")}</h1>
        </header>

        {/* PROFILE CARD */}
        <div 
          onClick={() => isLoggedIn ? setShowAvatarModal(true) : window.location.href = "/login"}
          className={`flex items-center gap-4 rounded-2xl border p-4 ${cardClass} active:scale-95 transition-transform cursor-pointer`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500 border-2 border-orange-300 overflow-hidden shadow-sm">
            {selectedAvatar ? <img src={selectedAvatar} alt="Avatar" className="w-full h-full object-cover bg-yellow-400 p-1" /> : <User size={32} />}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">{userName}</h2>
            <p className={`text-xs ${mutedClass}`}>{userEmail}</p>
          </div>
          {isLoggedIn && <div className="text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Edit</div>}
        </div>

        {/* QUICK LINKS */}
        <section className="grid grid-cols-3 gap-3">
          <Link href="/orders" className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all hover:scale-105 ${cardClass}`}><Clock size={22} className="text-orange-500" /><span className="text-[11px] font-bold">{t("मेरे ऑर्डर्स", "My Orders", "My Orders")}</span></Link>
          <Link href="/wallet" className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all hover:scale-105 ${cardClass}`}><Wallet size={22} className="text-orange-500" /><span className="text-[11px] font-bold">{t("वॉलेट", "Wallet", "Wallet")}</span></Link>
          <Link href="/help" className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all hover:scale-105 ${cardClass}`}><Headphones size={22} className="text-orange-500" /><span className="text-[11px] font-bold">{t("सपोर्ट", "Support", "Support")}</span></Link>
        </section>

        {/* EXPLORE */}
        <section className="space-y-2">
          <h3 className={`px-1 text-xs font-bold uppercase tracking-wider ${mutedClass}`}>{t("एक्सप्लोर करें", "Explore", "Explore")}</h3>
          <div className={`overflow-hidden rounded-2xl border ${cardClass}`}>
            {exploreItems.map((item, idx) => (
              <Link key={idx} href={item.href} className={`flex items-center justify-between p-4 transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${idx !== exploreItems.length - 1 ? (isDark ? "border-b border-slate-700/50" : "border-b border-gray-100") : ""}`}>
                <div className="flex items-center gap-3"><item.icon size={18} className="text-orange-500" /><span className="text-sm font-semibold">{item.name}</span></div>
                <ChevronRight size={16} className={mutedClass} />
              </Link>
            ))}
          </div>
        </section>

        {/* ACCOUNT */}
        <section className="space-y-2">
          <h3 className={`px-1 text-xs font-bold uppercase tracking-wider ${mutedClass}`}>{t("अकाउंट", "Account", "Account")}</h3>
          <div className={`overflow-hidden rounded-2xl border ${cardClass}`}>
            {accountItems.map((item, idx) => (
              <Link key={idx} href={item.href} className={`flex items-center justify-between p-4 transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${idx !== accountItems.length - 1 ? (isDark ? "border-b border-slate-700/50" : "border-b border-gray-100") : ""}`}>
                <div className="flex items-center gap-3"><item.icon size={18} className="text-orange-500" /><span className="text-sm font-semibold">{item.name}</span></div>
                <ChevronRight size={16} className={mutedClass} />
              </Link>
            ))}
          </div>
        </section>

        {/* LEGAL */}
        <section className="space-y-2">
          <h3 className={`px-1 text-xs font-bold uppercase tracking-wider ${mutedClass}`}>{t("कानूनी जानकारी", "Legal & Support", "Legal & Support")}</h3>
          <div className={`overflow-hidden rounded-2xl border ${cardClass}`}>
            {legalItems.map((item, idx) => (
              <Link key={idx} href={item.href} className={`flex items-center justify-between p-4 transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${idx !== legalItems.length - 1 ? (isDark ? "border-b border-slate-700/50" : "border-b border-gray-100") : ""}`}>
                <div className="flex items-center gap-3"><item.icon size={18} className="text-orange-500" /><span className="text-sm font-semibold">{item.name}</span></div>
                <ChevronRight size={16} className={mutedClass} />
              </Link>
            ))}
          </div>
        </section>

        {/* APP SETTINGS (Premium Look) */}
        <section className="space-y-2">
          <h3 className={`px-1 text-xs font-bold uppercase tracking-wider ${mutedClass}`}>{t("ऐप सेटिंग्स", "App Settings", "App Settings")}</h3>
          <div className={`overflow-hidden rounded-2xl border p-5 space-y-6 ${cardClass}`}>
            
            {/* THEME TOGGLE */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-bold text-orange-500">
                {isDark ? <Moon size={18} /> : <Sun size={18} />}{t("थीम", "Theme", "Theme")}
              </h4>
              <div className={`flex p-1 rounded-xl ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
                <button 
                  onClick={() => setTheme("light")} 
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${!isDark ? "bg-white text-orange-600 shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
                >
                  <Sun size={14} /> {t("लाइट", "Light", "Light")}
                </button>
                <button 
                  onClick={() => setTheme("dark")} 
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${isDark ? "bg-slate-700 text-orange-400 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <Moon size={14} /> {t("डार्क", "Dark", "Dark")}
                </button>
              </div>
            </div>

            {/* LANGUAGES GRID (10 Languages) */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-bold text-orange-500">
                <Globe size={18} />{t("भाषा", "Language", "Language")}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                      lang === l.code
                        ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20"
                        : isDark
                        ? "border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {l.native}
                    {lang === l.code && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LOGOUT */}
        <section className="pt-2">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 rounded-2xl border py-3.5 text-sm font-bold transition-all active:scale-95 ${
              isDark
                ? "border-red-900/50 bg-red-950/30 text-red-400 hover:bg-red-950/50"
                : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 shadow-sm"
            }`}
          >
            <LogOut size={18} />
            {t("लॉगआउट करें", "Logout Karein", "Logout")}
          </button>
        </section>

      </div>

      {/* AVATAR MODAL */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-10 sm:zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Change Profile Pic</h2>
                <p className="text-xs text-gray-500 mt-1">Select from library</p>
              </div>
              <button onClick={() => setShowAvatarModal(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={18} /></button>
            </div>
            <div className="p-5 overflow-y-auto">
              <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                {ZODIAC_AVATARS.map((avatar) => (
                  <button key={avatar.id} onClick={() => handleAvatarSelect(avatar.url)} className="flex flex-col items-center gap-2 group">
                    <div className={`w-16 h-16 rounded-full overflow-hidden border-2 p-1 bg-yellow-400 transition-all ${selectedAvatar === avatar.url ? 'border-orange-500 scale-110 shadow-lg' : 'border-transparent group-hover:scale-105'}`}>
                      <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                    </div>
                    <span className={`text-[10px] font-semibold ${selectedAvatar === avatar.url ? 'text-orange-600' : 'text-gray-700'}`}>{avatar.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM BANNER */}
      <Link href="/chat" className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 px-4 py-3.5 text-white shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20"><Phone size={18} /></span>
          <div className="leading-tight">
            <p className="text-[10px] font-black uppercase text-rose-100">{isHindi ? "ज्योतिषी • 24x7 उपलब्ध" : "Astrologer • 24x7 Available"}</p>
            <p className="text-sm font-black">{isHindi ? "अभी बात करें — पहली चैट FREE" : "Talk Now — First Chat FREE"}</p>
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-rose-700">{isHindi ? "चैट" : "Chat"}</span>
      </Link>
    </main>
  );
}
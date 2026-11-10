// app/profile/page.tsx
"use client";

import { useState } from "react";
import { 
  ArrowLeft, User, Globe, ChevronRight, Clock, 
  Wallet, Headphones, Home, MessageCircle, Scroll, 
  HelpCircle, FileText, List, Shield, Mail, LogOut, Moon, Sun, PhoneCall, Check
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";
import { LANGUAGES } from "../../i18n"; // Path check kar lein

export default function ProfileDashboardPage() {
  const { lang, setLanguage, theme, setTheme, me } = useApp();
  
  // 🔥 10 Language Translation Helper
  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      hi: {
        header: "प्रोफाइल", edit: "एडिट", myOrders: "मेरे ऑर्डर्स", wallet: "वॉलेट", support: "सपोर्ट",
        explore: "एक्सप्लोर", home: "होम", chatGita: "गीता AI से चैट करें", myKundli: "मेरी कुंडली",
        account: "अकाउंट", helpCenter: "हेल्प सेंटर (FAQ)", supportTicket: "सपोर्ट टिकट", walletTx: "वॉलेट ट्रांजैक्शन", orderHistory: "ऑर्डर हिस्ट्री",
        legalSupport: "कानूनी और सपोर्ट", privacy: "प्राइवेसी पॉलिसी", terms: "नियम और शर्तें", contactUs: "संपर्क करें",
        appSettings: "ऐप सेटिंग्स", theme: "थीम", light: "लाइट", dark: "डार्क", language: "भाषा", logout: "लॉगआउट",
        bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "अभी बात करें - पहली चैट FREE", chatBtn: "चैट", guest: "गेस्ट यूजर", noEmail: "ईमेल उपलब्ध नहीं है"
      },
      hinglish: {
        header: "PROFILE", edit: "EDIT", myOrders: "My Orders", wallet: "Wallet", support: "Support",
        explore: "EXPLORE", home: "Home", chatGita: "Chat with Gita AI", myKundli: "My Kundli",
        account: "ACCOUNT", helpCenter: "Help Center (FAQ)", supportTicket: "Support Ticket", walletTx: "Wallet Transactions", orderHistory: "Order History",
        legalSupport: "LEGAL & SUPPORT", privacy: "Privacy Policy", terms: "Terms of Service", contactUs: "Contact Us",
        appSettings: "APP SETTINGS", theme: "Theme", light: "Light", dark: "Dark", language: "Language", logout: "Logout",
        bannerTitle: "ASTROLOGER - 24X7 AVAILABLE", bannerSub: "Talk Now -- First Chat FREE", chatBtn: "Chat", guest: "Guest User", noEmail: "No email available"
      },
      en: {
        header: "PROFILE", edit: "EDIT", myOrders: "My Orders", wallet: "Wallet", support: "Support",
        explore: "EXPLORE", home: "Home", chatGita: "Chat with Gita AI", myKundli: "My Kundli",
        account: "ACCOUNT", helpCenter: "Help Center (FAQ)", supportTicket: "Support Ticket", walletTx: "Wallet Transactions", orderHistory: "Order History",
        legalSupport: "LEGAL & SUPPORT", privacy: "Privacy Policy", terms: "Terms of Service", contactUs: "Contact Us",
        appSettings: "APP SETTINGS", theme: "Theme", light: "Light", dark: "Dark", language: "Language", logout: "Logout",
        bannerTitle: "ASTROLOGER - 24X7 AVAILABLE", bannerSub: "Talk Now -- First Chat FREE", chatBtn: "Chat", guest: "Guest User", noEmail: "No email available"
      },
      // ... (Baki bhashao ke liye aap purana dictionary use kar sakte hain, maine short rakha hai)
    };
    return dict[lang || "hi"]?.[key] || dict["en"][key] || dict["hi"][key];
  };

  const userName = me?.user?.name || t("guest");
  const userEmail = me?.user?.email || t("noEmail");
  const userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanni&backgroundColor=FBBF24";

  return (
    <main className="min-h-[100dvh] w-full bg-[#0A0F19] text-slate-100 font-sans pb-32">
      
      {/* 🔥 Container: max-w hataya hai taaki Full Screen dikhe */}
      <div className="w-full px-4 pt-4 space-y-5">
        
        {/* HEADER */}
        <header className="bg-[#151d2c] rounded-2xl flex items-center p-3 border border-slate-800">
          <Link href="/" className="p-2 rounded-full text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-[15px] font-black text-[#ff6b00] ml-4 tracking-wider uppercase">{t("header")}</h1>
        </header>

        {/* USER CARD */}
        <div className="bg-[#151d2c] rounded-2xl p-4 flex items-center justify-between border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-[#FBBF24] flex items-center justify-center overflow-hidden border-2 border-[#151d2c]">
               <img src={userAvatar} alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-white">{userName}</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">{userEmail}</p>
            </div>
          </div>
          
          {/* 🔥 EDIT BUTTON: Isko naye edit page se link kiya gaya hai */}
          <Link href="/profile/edit" className="bg-[#3b2517] text-[#ff6b00] text-[10px] font-bold px-3.5 py-2 rounded-lg hover:bg-[#4a2e1c] transition-colors">
            {t("edit")}
          </Link>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-3 gap-3">
          <Link href="/orders" className="bg-[#151d2c] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-slate-800 hover:bg-[#1f2937] transition-colors">
            <Clock size={22} className="text-[#ff6b00]" />
            <span className="text-[11px] font-semibold text-slate-300 text-center">{t("myOrders")}</span>
          </Link>
          <Link href="/wallet" className="bg-[#151d2c] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-slate-800 hover:bg-[#1f2937] transition-colors">
            <Wallet size={22} className="text-[#ff6b00]" />
            <span className="text-[11px] font-semibold text-slate-300 text-center">{t("wallet")}</span>
          </Link>
          <Link href="/support" className="bg-[#151d2c] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-slate-800 hover:bg-[#1f2937] transition-colors">
            <Headphones size={22} className="text-[#ff6b00]" />
            <span className="text-[11px] font-semibold text-slate-300 text-center">{t("support")}</span>
          </Link>
        </div>

        {/* EXPLORE */}
        <section>
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">{t("explore")}</h3>
          <div className="bg-[#151d2c] rounded-2xl border border-slate-800 overflow-hidden">
            <Link href="/" className="flex items-center justify-between p-4 border-b border-slate-800/50 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3"><Home size={18} className="text-slate-300" /><span className="text-[13px] font-medium text-slate-200">{t("home")}</span></div>
              <ChevronRight size={16} className="text-slate-500" />
            </Link>
            <Link href="/chat" className="flex items-center justify-between p-4 border-b border-slate-800/50 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3"><MessageCircle size={18} className="text-slate-300" /><span className="text-[13px] font-medium text-slate-200">{t("chatGita")}</span></div>
              <ChevronRight size={16} className="text-slate-500" />
            </Link>
            <Link href="/kundli" className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3"><Scroll size={18} className="text-slate-300" /><span className="text-[13px] font-medium text-slate-200">{t("myKundli")}</span></div>
              <ChevronRight size={16} className="text-slate-500" />
            </Link>
          </div>
        </section>

        {/* ACCOUNT */}
        <section>
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">{t("account")}</h3>
          <div className="bg-[#151d2c] rounded-2xl border border-slate-800 overflow-hidden">
            <Link href="/help" className="flex items-center justify-between p-4 border-b border-slate-800/50 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3"><HelpCircle size={18} className="text-slate-300" /><span className="text-[13px] font-medium text-slate-200">{t("helpCenter")}</span></div>
              <ChevronRight size={16} className="text-slate-500" />
            </Link>
            <Link href="/support" className="flex items-center justify-between p-4 border-b border-slate-800/50 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3"><Headphones size={18} className="text-slate-300" /><span className="text-[13px] font-medium text-slate-200">{t("supportTicket")}</span></div>
              <ChevronRight size={16} className="text-slate-500" />
            </Link>
            <Link href="/wallet" className="flex items-center justify-between p-4 border-b border-slate-800/50 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3"><FileText size={18} className="text-slate-300" /><span className="text-[13px] font-medium text-slate-200">{t("walletTx")}</span></div>
              <ChevronRight size={16} className="text-slate-500" />
            </Link>
            <Link href="/orders" className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3"><List size={18} className="text-slate-300" /><span className="text-[13px] font-medium text-slate-200">{t("orderHistory")}</span></div>
              <ChevronRight size={16} className="text-slate-500" />
            </Link>
          </div>
        </section>

        {/* LEGAL & SUPPORT */}
        <section>
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">{t("legalSupport")}</h3>
          <div className="bg-[#151d2c] rounded-2xl border border-slate-800 overflow-hidden">
            <Link href="/privacy" className="flex items-center justify-between p-4 border-b border-slate-800/50 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3"><Shield size={18} className="text-slate-300" /><span className="text-[13px] font-medium text-slate-200">{t("privacy")}</span></div>
              <ChevronRight size={16} className="text-slate-500" />
            </Link>
            <Link href="/terms" className="flex items-center justify-between p-4 border-b border-slate-800/50 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3"><FileText size={18} className="text-slate-300" /><span className="text-[13px] font-medium text-slate-200">{t("terms")}</span></div>
              <ChevronRight size={16} className="text-slate-500" />
            </Link>
            <Link href="/contact" className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3"><Mail size={18} className="text-slate-300" /><span className="text-[13px] font-medium text-slate-200">{t("contactUs")}</span></div>
              <ChevronRight size={16} className="text-slate-500" />
            </Link>
          </div>
        </section>

        {/* APP SETTINGS */}
        <section>
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">{t("appSettings")}</h3>
          <div className="bg-[#151d2c] rounded-2xl border border-slate-800 p-4 space-y-6">
            
            {/* Theme Toggle */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Moon size={16} className="text-[#ff6b00]" />
                <span className="text-[13px] font-semibold text-slate-200">{t("theme")}</span>
              </div>
              <div className="flex bg-[#0A0F19] p-1 rounded-xl border border-slate-800">
                <button onClick={() => setTheme("light")} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] font-medium rounded-lg transition-colors ${theme === "light" ? "bg-[#2e3a4e] text-white shadow-sm" : "text-slate-400 hover:text-white"}`}>
                  <Sun size={14} /> {t("light")}
                </button>
                <button onClick={() => setTheme("dark")} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] font-medium rounded-lg transition-colors ${theme === "dark" ? "bg-[#2e3a4e] text-white shadow-sm" : "text-slate-400 hover:text-white"}`}>
                  <Moon size={14} /> {t("dark")}
                </button>
              </div>
            </div>

            {/* Language Grid */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe size={16} className="text-[#ff6b00]" />
                <span className="text-[13px] font-semibold text-slate-200">{t("language")}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`py-2.5 px-3 rounded-xl border text-[12px] font-medium transition-all text-left truncate flex items-center justify-between ${
                      lang === l.code 
                        ? "bg-[#ff6b00] text-white border-[#ff6b00] shadow-[0_0_10px_rgba(255,107,0,0.3)]" 
                        : "bg-[#0A0F19] text-slate-300 border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    {l.native}
                    {lang === l.code && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LOGOUT BUTTON */}
        <button 
          onClick={() => {
            if(window.confirm("Logout?")) {
              localStorage.clear(); window.location.href="/login";
            }
          }}
          className="w-full bg-[#1f1517] text-[#ef4444] border border-[#ef4444]/20 rounded-2xl py-4 flex justify-center items-center gap-2 font-semibold text-[14px] hover:bg-[#2a1c1e] transition-colors"
        >
          <LogOut size={18} /> {t("logout")}
        </button>

      </div>

      {/* 🔥 STICKY BOTTOM BANNER */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#ef4444] to-[#dc2626] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
            <PhoneCall size={18} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white uppercase tracking-wider">{t("bannerTitle")}</p>
            <p className="text-[13px] font-extrabold text-white leading-tight">{t("bannerSub")}</p>
          </div>
        </div>
        <Link href="/chat" className="bg-white text-red-600 font-bold text-[13px] px-5 py-2 rounded-full shadow-sm active:scale-95">
          {t("chatBtn")}
        </Link>
      </div>

    </main>
  );
}
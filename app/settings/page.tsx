// app/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, User, Moon, Sun, Globe, ChevronRight, Home, Clock, 
  Wallet, Headphones, List, Scroll, Phone, HelpCircle, MessageCircle, 
  X, LogOut, Shield, FileText, Mail, Check, CreditCard, Trash2
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";
import { LANGUAGES } from "../../i18n"; 

export default function SettingsPage() {
  const { lang, setLanguage, theme, setTheme, me } = useApp();

  const isDark = theme === "dark";
  
  // Modal state for Language
  const [showLangModal, setShowLangModal] = useState(false);

  // Ekdum simple translation helper
  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      hi: { title: "सेटिंग्स", edit: "प्रोफाइल एडिट करें", sub: "सब्सक्राइब करें", policy: "पॉलिसीज", help: "हेल्प और सपोर्ट", lang: "भाषा", logout: "लॉगआउट करें", delete: "अकाउंट डिलीट करें", theme: "थीम", light: "लाइट", dark: "डार्क", selectLang: "भाषा चुनें" },
      hinglish: { title: "Settings", edit: "Edit Profile", sub: "Subscribe Now", policy: "Policies", help: "Help and Support", lang: "Language", logout: "Log out", delete: "Delete Account", theme: "Theme", light: "Light", dark: "Dark", selectLang: "Select Language" },
      en: { title: "Settings", edit: "Edit Profile", sub: "Subscribe Now", policy: "Policies", help: "Help and Support", lang: "Language", logout: "Log out", delete: "Delete Account", theme: "Theme", light: "Light", dark: "Dark", selectLang: "Select Language" },
      te: { title: "సెట్టింగ్స్", edit: "ప్రొఫైల్ సవరించండి", sub: "సబ్స్క్రైబ్ చేయండి", policy: "విధానాలు", help: "సహాయం మరియు మద్దతు", lang: "భాష", logout: "లాగ్ అవుట్", delete: "ఖాతా తొలగించండి", theme: "థీమ్", light: "లైట్", dark: "డార్క్", selectLang: "భాషను ఎంచుకోండి" },
      ta: { title: "அமைப்புகள்", edit: "சுயவிவரத்தைத் திருத்து", sub: "இப்போது குழுசேர்", policy: "கொள்கைகள்", help: "உதவி மற்றும் ஆதரவு", lang: "மொழி", logout: "வெளியேறு", delete: "கணக்கை நீக்கு", theme: "தீம்", light: "லைட்", dark: "டார்க்", selectLang: "மொழியைத் தேர்ந்தெடுக்கவும்" },
      kn: { title: "ಸೆಟ್ಟಿಂಗ್ಸ್", edit: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ", sub: "ಚಂದಾದಾರರಾಗಿ", policy: "ನೀತಿಗಳು", help: "ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ", lang: "ಭಾಷೆ", logout: "ಲಾಗ್ ಔಟ್", delete: "ಖಾತೆ ಅಳಿಸಿ", theme: "ಥೀಮ್", light: "ಲೈಟ್", dark: "ಡಾರ್ಕ್", selectLang: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ" },
      bn: { title: "সেটিংস", edit: "প্রোফাইল সম্পাদনা করুন", sub: "এখন সাবস্ক্রাইব করুন", policy: "নীতিমালা", help: "সহায়তা এবং সমর্থন", lang: "ভাষা", logout: "লগ আউট", delete: "অ্যাকাউন্ট মুছুন", theme: "থিম", light: "লাইট", dark: "ডার্ক", selectLang: "ভাষা নির্বাচন করুন" },
      mr: { title: "सेटिंग्ज", edit: "प्रोफाइल संपादित करा", sub: "सदस्यता घ्या", policy: "धोरणे", help: "मदत आणि समर्थन", lang: "भाषा", logout: "लॉग आउट", delete: "खाते हटवा", theme: "थीम", light: "लाइट", dark: "डार्क", selectLang: "भाषा निवडा" },
      gu: { title: "સેટિંગ્સ", edit: "પ્રોફાઇલ સંપાદિત કરો", sub: "સબ્સ્ક્રાઇબ કરો", policy: "નીતિઓ", help: "મદદ અને સપોર્ટ", lang: "ભાષા", logout: "લોગ આઉટ", delete: "એકાઉન્ટ કાઢી નાખો", theme: "થીમ", light: "લાઇટ", dark: "ડાર્ક", selectLang: "ભાષા પસંદ કરો" },
      ml: { title: "ക്രമീകരണങ്ങൾ", edit: "പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക", sub: "സബ്സ്ക്രൈബ് ചെയ്യുക", policy: "നയങ്ങൾ", help: "സഹായവും പിന്തുണയും", lang: "ഭാഷ", logout: "ലോഗ് ഔട്ട്", delete: "അക്കൗണ്ട് ഇല്ലാതാക്കുക", theme: "തീം", light: "ലൈറ്റ്", dark: "ഡാർക്ക്", selectLang: "ഭാഷ തിരഞ്ഞെടുക്കുക" },
    };
    return dict[lang]?.[key] || dict["en"][key];
  };

  const pageClass = isDark ? "bg-[#0B0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const listItemClass = isDark ? "border-slate-800/50 hover:bg-white/5" : "border-gray-100 hover:bg-black/5";

  // Current language label (e.g., Telugu, Hindi)
  const currentLangLabel = LANGUAGES.find((l) => l.code === lang)?.label || "English";

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <main className={`min-h-screen w-full px-4 pb-24 pt-6 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-6">
        
        {/* HEADER */}
        <header className="flex items-center gap-4 px-2">
          <Link href="/" className={`rounded-full p-2 transition-colors ${isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-orange-100 text-orange-600 hover:bg-orange-200"}`}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        </header>

        {/* MAIN MENU LIST */}
        <div className={`overflow-hidden rounded-2xl border ${isDark ? "border-slate-800 bg-[#151E2E]" : "border-orange-100 bg-white shadow-sm"}`}>
          
          {/* Edit Profile */}
          <Link href="/profile" className={`flex items-center justify-between p-4 border-b ${listItemClass}`}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${isDark ? "bg-slate-800 text-orange-400" : "bg-orange-50 text-orange-600"}`}>
                <User size={18} />
              </div>
              <span className="font-semibold text-[15px]">{t("edit")}</span>
            </div>
            <ChevronRight size={18} className={isDark ? "text-slate-500" : "text-gray-400"} />
          </Link>

          {/* Subscribe Now */}
          <Link href="/wallet" className={`flex items-center justify-between p-4 border-b ${listItemClass}`}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${isDark ? "bg-slate-800 text-orange-400" : "bg-orange-50 text-orange-600"}`}>
                <CreditCard size={18} />
              </div>
              <span className="font-semibold text-[15px]">{t("sub")}</span>
            </div>
            <ChevronRight size={18} className={isDark ? "text-slate-500" : "text-gray-400"} />
          </Link>

          {/* Policies */}
          <Link href="/privacy" className={`flex items-center justify-between p-4 border-b ${listItemClass}`}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${isDark ? "bg-slate-800 text-orange-400" : "bg-orange-50 text-orange-600"}`}>
                <Shield size={18} />
              </div>
              <span className="font-semibold text-[15px]">{t("policy")}</span>
            </div>
            <ChevronRight size={18} className={isDark ? "text-slate-500" : "text-gray-400"} />
          </Link>

          {/* Help & Support */}
          <Link href="/support" className={`flex items-center justify-between p-4 ${listItemClass}`}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${isDark ? "bg-slate-800 text-orange-400" : "bg-orange-50 text-orange-600"}`}>
                <HelpCircle size={18} />
              </div>
              <span className="font-semibold text-[15px]">{t("help")}</span>
            </div>
            <ChevronRight size={18} className={isDark ? "text-slate-500" : "text-gray-400"} />
          </Link>
        </div>

        {/* LANGUAGE SECTION (Single Row) */}
        <div className={`overflow-hidden rounded-2xl border ${isDark ? "border-slate-800 bg-[#151E2E]" : "border-orange-100 bg-white shadow-sm"}`}>
          <button 
            onClick={() => setShowLangModal(true)}
            className={`w-full flex items-center justify-between p-4 ${listItemClass}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${isDark ? "bg-slate-800 text-orange-400" : "bg-orange-50 text-orange-600"}`}>
                <MessageCircle size={18} />
              </div>
              <span className="font-semibold text-[15px]">{t("lang")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-gray-500"}`}>{currentLangLabel}</span>
              <ChevronRight size={18} className={isDark ? "text-slate-500" : "text-gray-400"} />
            </div>
          </button>
        </div>

        {/* LOGOUT & DELETE */}
        <div className={`overflow-hidden rounded-2xl border ${isDark ? "border-slate-800 bg-[#151E2E]" : "border-orange-100 bg-white shadow-sm"}`}>
          <button onClick={handleLogout} className={`w-full flex items-center justify-between p-4 border-b ${listItemClass}`}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${isDark ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-600"}`}>
                <LogOut size={18} />
              </div>
              <span className="font-semibold text-[15px]">{t("logout")}</span>
            </div>
          </button>

          <button className={`w-full flex items-center justify-between p-4 ${listItemClass}`}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${isDark ? "bg-rose-950/50 text-rose-500" : "bg-rose-50 text-rose-600"}`}>
                <Trash2 size={18} />
              </div>
              <span className="font-semibold text-[15px] text-rose-500">{t("delete")}</span>
            </div>
          </button>
        </div>

        {/* FOOTER INFO */}
        <div className="text-center pt-8 space-y-1">
          <p className={`text-xs ${isDark ? "text-slate-600" : "text-gray-400"}`}>User ID: {me?.user?.id?.slice(0, 10) || "Guest"}</p>
          <p className={`text-xs ${isDark ? "text-slate-600" : "text-gray-400"}`}>Version 2026.22.2</p>
        </div>

      </div>

      {/* LANGUAGE MODAL (Popup) */}
      {showLangModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-10 sm:zoom-in-95 ${isDark ? "bg-[#151E2E] border border-slate-800" : "bg-white"}`}>
            
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-5 border-b ${isDark ? "border-slate-800" : "border-gray-200"}`}>
              <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{t("selectLang")}</h2>
              <button onClick={() => setShowLangModal(false)} className={`p-2 rounded-full ${isDark ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                <X size={18} />
              </button>
            </div>
            
            {/* Modal Body (Scrollable) */}
            <div className="p-3 overflow-y-auto">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLanguage(l.code); setShowLangModal(false); }}
                  className={`w-full flex items-center justify-between p-4 mb-1 rounded-xl transition-all ${
                    lang === l.code 
                      ? (isDark ? "bg-orange-500/10 border border-orange-500/30" : "bg-orange-50 border border-orange-200") 
                      : "border border-transparent hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <span className={`text-[15px] font-bold ${lang === l.code ? "text-orange-500" : isDark ? "text-slate-200" : "text-gray-800"}`}>
                      {l.native}
                    </span>
                    <span className="text-xs text-gray-500">{l.label}</span>
                  </div>
                  
                  {/* Radio Button Indicator */}
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    lang === l.code ? "border-orange-500 bg-orange-500" : (isDark ? "border-slate-600" : "border-gray-300")
                  }`}>
                    {lang === l.code && <Check size={12} className="text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
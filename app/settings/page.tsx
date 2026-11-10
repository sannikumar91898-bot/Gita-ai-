// app/settings/page.tsx
"use client";

import { useState } from "react";
import { 
  ArrowLeft, User, Globe, ChevronRight, Clock, 
  Wallet, Headphones, List, Scroll, HelpCircle, 
  X, LogOut, Shield, FileText, Mail, Check, CreditCard, Trash2, Sparkles, Star, Pencil
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";
import { LANGUAGES } from "../../i18n"; 

export default function SettingsPage() {
  const { lang, setLanguage, theme, me } = useApp();
  const isDark = theme === "dark";
  
  const [showLangModal, setShowLangModal] = useState(false);

  // 🔥 10 Language Translation Helper
  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      hi: { 
        title: "सेटिंग्स", subtitle: "अपने अनुभव को कस्टमाइज़ करें", welcome: "नमस्ते,", guest: "गेस्ट यूज़र", editBtn: "एडिट करें", 
        orders: "ऑर्डर्स", wallet: "वॉलेट", support: "सपोर्ट", help: "हेल्प सेंटर", privacy: "प्राइवेसी पॉलिसी", 
        terms: "नियम और शर्तें", contact: "संपर्क करें", lang: "भाषा", logout: "लॉगआउट करें", delete: "अकाउंट डिलीट करें", 
        selectLang: "भाषा चुनें", account: "अकाउंट सेटिंग्स", legal: "कानूनी जानकारी", quick: "क्विक एक्शन", 
        subscribe: "सब्सक्राइब करें", policy: "पॉलिसीज" 
      },
      hinglish: { 
        title: "Settings", subtitle: "Customize your experience", welcome: "Welcome,", guest: "Guest User", editBtn: "Edit", 
        orders: "Orders", wallet: "Wallet", support: "Support", help: "Help Center", privacy: "Privacy Policy", 
        terms: "Terms of Service", contact: "Contact Us", lang: "Language", logout: "Log out", delete: "Delete Account", 
        selectLang: "Select Language", account: "Account Settings", legal: "Legal & Support", quick: "Quick Actions", 
        subscribe: "Subscribe Now", policy: "Policies" 
      },
      en: { 
        title: "Settings", subtitle: "Customize your experience", welcome: "Welcome,", guest: "Guest User", editBtn: "Edit", 
        orders: "Orders", wallet: "Wallet", support: "Support", help: "Help Center", privacy: "Privacy Policy", 
        terms: "Terms of Service", contact: "Contact Us", lang: "Language", logout: "Log out", delete: "Delete Account", 
        selectLang: "Select Language", account: "Account Settings", legal: "Legal & Support", quick: "Quick Actions", 
        subscribe: "Subscribe Now", policy: "Policies" 
      },
      te: { 
        title: "సెట్టింగ్స్", subtitle: "మీ అనుభవాన్ని అనుకూలీకరించండి", welcome: "స్వాగతం,", guest: "గెస్ట్ యూజర్", editBtn: "సవరించండి", 
        orders: "ఆర్డర్లు", wallet: "వాలెట్", support: "మద్దతు", help: "సహాయ కేంద్రం", privacy: "గోప్యతా విధానం", 
        terms: "సేవా నిబంధనలు", contact: "మమ్మల్ని సంప్రదించండి", lang: "భాష", logout: "లాగ్ అవుట్", delete: "ఖాతా తొలగించండి", 
        selectLang: "భాషను ఎంచుకోండి", account: "ఖాతా సెట్టింగ్లు", legal: "చట్టపరమైన", quick: "త్వరిత చర్యలు", 
        subscribe: "సబ్స్క్రైబ్ చేయండి", policy: "విధానాలు" 
      },
      ta: { 
        title: "அமைப்புகள்", subtitle: "உங்கள் அனுபவத்தைத் தனிப்பயனாக்குங்கள்", welcome: "வரவேற்கிறோம்,", guest: "விருந்தினர்", editBtn: "திருத்து", 
        orders: "ஆர்டர்கள்", wallet: "பணப்பை", support: "ஆதரவு", help: "உதவி மையம்", privacy: "தனியுரிமைக் கொள்கை", 
        terms: "சேவை விதிமுறைகள்", contact: "எங்களைத் தொடர்பு கொள்ள", lang: "மொழி", logout: "வெளியேறு", delete: "கணக்கை நீக்கு", 
        selectLang: "மொழியைத் தேர்ந்தெடுக்கவும்", account: "கணக்கு அமைப்புகள்", legal: "சட்டப்பூர்வ", quick: "விரைவு செயல்கள்", 
        subscribe: "குழுசேர்", policy: "கொள்கைகள்" 
      },
      kn: { 
        title: "ಸೆಟ್ಟಿಂಗ್ಸ್", subtitle: "ನಿಮ್ಮ ಅನುಭವವನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ", welcome: "ಸ್ವಾಗತ,", guest: "ಅತಿಥಿ", editBtn: "ಸಂಪಾದಿಸಿ", 
        orders: "ಆರ್ಡರ್ಗಳು", wallet: "ವಾಲೆಟ್", support: "ಬೆಂಬಲ", help: "ಸಹಾಯ ಕೇಂದ್ರ", privacy: "ಗೋಪ್ಯತಾ ನೀತಿ", 
        terms: "ಸೇವಾ ನಿಯಮಗಳು", contact: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ", lang: "ಭಾಷೆ", logout: "ಲಾಗ್ ಔಟ್", delete: "ಖಾತೆ ಅಳಿಸಿ", 
        selectLang: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ", account: "ಖಾತೆ ಸೆಟ್ಟಿಂಗ್ಗಳು", legal: "ಕಾನೂನು", quick: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು", 
        subscribe: "ಚಂದಾದಾರರಾಗಿ", policy: "ನೀತಿಗಳು" 
      },
      bn: { 
        title: "সেটিংস", subtitle: "আপনার অভিজ্ঞতা কাস্টমাইজ করুন", welcome: "স্বাগতম,", guest: "গেস্ট ইউজার", editBtn: "সম্পাদনা", 
        orders: "অর্ডার", wallet: "ওয়ালেট", support: "সমর্থন", help: "সহায়তা কেন্দ্র", privacy: "গোপনীয়তা নীতি", 
        terms: "পরিষেবার শর্তাবলী", contact: "যোগাযোগ করুন", lang: "ভাষা", logout: "লগ আউট", delete: "অ্যাকাউন্ট মুছুন", 
        selectLang: "ভাষা নির্বাচন করুন", account: "অ্যাকাউন্ট সেটিংস", legal: "আইনি", quick: "দ্রুত পদক্ষেপ", 
        subscribe: "সাবস্ক্রাইব করুন", policy: "নীতিমালা" 
      },
      mr: { 
        title: "सेटिंग्ज", subtitle: "तुमचा अनुभव सानुकूलित करा", welcome: "स्वागत आहे,", guest: "गेस्ट यूजर", editBtn: "संपादित करा", 
        orders: "ऑर्डर्स", wallet: "वॉलेट", support: "समर्थन", help: "मदत केंद्र", privacy: "गोपनीयता धोरण", 
        terms: "सेवा अटी", contact: "संपर्क साधा", lang: "भाषा", logout: "लॉग आउट", delete: "खाते हटवा", 
        selectLang: "भाषा निवडा", account: "खाते सेटिंग्ज", legal: "कायदेशीर", quick: "द्रुत क्रिया", 
        subscribe: "सदस्यता घ्या", policy: "धोरणे" 
      },
      gu: { 
        title: "સેટિંગ્સ", subtitle: "તમારા અનુભવને કસ્ટમાઇઝ કરો", welcome: "સ્વાગત છે,", guest: "ગેસ્ટ યુઝર", editBtn: "સંપાદિત કરો", 
        orders: "ઓર્ડર્સ", wallet: "વોલેટ", support: "સપોર્ટ", help: "મદદ કેન્દ્ર", privacy: "ગોપનીયતા નીતિ", 
        terms: "સેવાની શરતો", contact: "સંપર્ક કરો", lang: "ભાષા", logout: "લોગ આઉટ", delete: "એકાઉન્ટ કાઢી નાખો", 
        selectLang: "ભાષા પસંદ કરો", account: "એકાઉન્ટ સેટિંગ્સ", legal: "કાનૂની", quick: "ઝડપી ક્રિયાઓ", 
        subscribe: "સબ્સ્ક્રાઇબ કરો", policy: "નીતિઓ" 
      },
      ml: { 
        title: "ക്രമീകരണങ്ങൾ", subtitle: "നിങ്ങളുടെ അനുഭവം ഇഷ്ടാനുസൃതമാക്കുക", welcome: "സ്വാഗതം,", guest: "ഗസ്റ്റ് യൂസർ", editBtn: "എഡിറ്റ് ചെയ്യുക", 
        orders: "ഓർഡറുകൾ", wallet: "വാലറ്റ്", support: "പിന്തുണ", help: "സഹായ കേന്ദ്രം", privacy: "സ്വകാര്യതാ നയം", 
        terms: "സേവന നിബന്ധനകൾ", contact: "ബന്ധപ്പെടുക", lang: "ഭാഷ", logout: "ലോഗ് ഔട്ട്", delete: "അക്കൗണ്ട് ഇല്ലാതാക്കുക", 
        selectLang: "ഭാഷ തിരഞ്ഞെടുക്കുക", account: "അക്കൗണ്ട് ക്രമീകരണങ്ങൾ", legal: "നിയമപരമായ", quick: "ദ്രുത പ്രവർത്തനങ്ങൾ", 
        subscribe: "സബ്സ്ക്രൈബ് ചെയ്യുക", policy: "നയങ്ങൾ" 
      },
    };
    return dict[lang]?.[key] || dict["en"][key] || dict["hi"][key];
  };

  const pageClass = isDark ? "bg-[#0B0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-white/5 bg-white/[0.03] backdrop-blur-xl shadow-2xl" : "border-orange-100 bg-white shadow-lg";
  const listItemClass = isDark ? "border-white/5 hover:bg-white/5" : "border-gray-100 hover:bg-gray-50";
  
  // Premium Icon Wrapper
  const iconClass = isDark 
    ? "bg-gradient-to-br from-amber-500/20 to-orange-600/20 text-amber-500 border border-amber-500/20" 
    : "bg-orange-50 text-orange-600 border border-orange-100";

  const currentLangLabel = LANGUAGES.find((l) => l.code === lang)?.native || "English";

  const handleLogout = () => {
    if (window.confirm(t("logout") + "?")) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    // 🔥 Full Screen Layout (Removed max-w-xl and mx-auto)
    <main className={`min-h-screen w-full px-4 pb-24 pt-6 ${pageClass}`}>
      
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none"></div>

      <div className="w-full space-y-6 relative z-10">
        
        {/* HEADER */}
        <header className="flex items-center gap-4 px-2 pt-2">
          <Link href="/" className={`rounded-full p-2.5 transition-colors border ${isDark ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10" : "bg-white border-gray-200 text-slate-600 shadow-sm"}`}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              {t("title")} <Sparkles size={18} className="text-amber-500" />
            </h1>
            <p className={`text-xs font-medium mt-0.5 ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("subtitle")}</p>
          </div>
        </header>

        {/* 🔥 TOP EDIT PROFILE CARD 🔥 */}
        <section>
          <div className={`flex items-center justify-between p-4 rounded-[2rem] border ${cardClass}`}>
            <div className="flex items-center gap-4">
              <div className={`h-14 w-14 rounded-full flex items-center justify-center border-2 border-amber-500/30 ${isDark ? "bg-slate-800" : "bg-orange-100"}`}>
                {me?.user?.avatar ? (
                  <img src={me.user.avatar} alt="Profile" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <User size={26} className={isDark ? "text-slate-400" : "text-orange-500"} />
                )}
              </div>
              <div>
                <p className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("welcome")}</p>
                <h2 className="text-lg font-black">{me?.user?.name || t("guest")}</h2>
              </div>
            </div>
            
            <Link 
              href="/profile" 
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[12.5px] font-bold transition-all active:scale-95 ${
                isDark 
                  ? "bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]" 
                  : "bg-orange-500 text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)]"
              }`}
            >
              <Pencil size={14} /> {t("editBtn")}
            </Link>
          </div>
        </section>

        {/* QUICK ACTIONS GRID (Orders, Wallet, Support) */}
        <section>
          <h3 className={`px-3 mb-3 text-[11px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("quick")}</h3>
          <div className="grid grid-cols-3 gap-3">
            <Link href="/orders" className={`flex flex-col items-center justify-center gap-3 rounded-3xl border p-4 sm:p-5 text-center transition-all active:scale-95 ${cardClass}`}>
              <div className={`p-3 rounded-2xl ${iconClass}`}><Clock size={22} /></div>
              <span className="text-[11px] font-bold">{t("orders")}</span>
            </Link>
            <Link href="/wallet" className={`flex flex-col items-center justify-center gap-3 rounded-3xl border p-4 sm:p-5 text-center transition-all active:scale-95 ${cardClass}`}>
              <div className={`p-3 rounded-2xl ${iconClass}`}><Wallet size={22} /></div>
              <span className="text-[11px] font-bold">{t("wallet")}</span>
            </Link>
            <Link href="/support" className={`flex flex-col items-center justify-center gap-3 rounded-3xl border p-4 sm:p-5 text-center transition-all active:scale-95 ${cardClass}`}>
              <div className={`p-3 rounded-2xl ${iconClass}`}><Headphones size={22} /></div>
              <span className="text-[11px] font-bold">{t("support")}</span>
            </Link>
          </div>
        </section>

        {/* MAIN SETTINGS LIST */}
        <section>
          <h3 className={`px-3 mb-3 text-[11px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("account")}</h3>
          <div className={`overflow-hidden rounded-[2rem] border ${cardClass}`}>
            
            <Link href="/wallet" className={`flex items-center justify-between p-5 border-b ${listItemClass}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${iconClass}`}><CreditCard size={18} /></div>
                <span className="font-semibold text-[15px]">{t("subscribe")}</span>
              </div>
              <ChevronRight size={18} className={isDark ? "text-slate-500" : "text-gray-400"} />
            </Link>

            <Link href="/privacy" className={`flex items-center justify-between p-5 border-b ${listItemClass}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${iconClass}`}><Shield size={18} /></div>
                <span className="font-semibold text-[15px]">{t("policy")}</span>
              </div>
              <ChevronRight size={18} className={isDark ? "text-slate-500" : "text-gray-400"} />
            </Link>

            <Link href="/help" className={`flex items-center justify-between p-5 ${listItemClass}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${iconClass}`}><HelpCircle size={18} /></div>
                <span className="font-semibold text-[15px]">{t("help")}</span>
              </div>
              <ChevronRight size={18} className={isDark ? "text-slate-500" : "text-gray-400"} />
            </Link>
          </div>
        </section>

        {/* 🔥 LANGUAGE SECTION 🔥 */}
        <section>
          <div className={`overflow-hidden rounded-[2rem] border ${cardClass}`}>
            <button onClick={() => setShowLangModal(true)} className={`w-full flex items-center justify-between p-5 ${listItemClass}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${iconClass}`}><Globe size={18} /></div>
                <span className="font-semibold text-[15px]">{t("lang")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${isDark ? "text-amber-500" : "text-orange-600"}`}>{currentLangLabel}</span>
                <ChevronRight size={18} className={isDark ? "text-slate-500" : "text-gray-400"} />
              </div>
            </button>
          </div>
        </section>

        {/* LOGOUT & DELETE */}
        <section>
          <div className={`overflow-hidden rounded-[2rem] border ${cardClass}`}>
            <button onClick={handleLogout} className={`w-full flex items-center justify-between p-5 border-b ${listItemClass}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${isDark ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-600"}`}><LogOut size={18} /></div>
                <span className="font-semibold text-[15px]">{t("logout")}</span>
              </div>
            </button>
            <button className={`w-full flex items-center justify-between p-5 ${listItemClass}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${isDark ? "bg-rose-950/50 text-rose-500 border border-rose-900/50" : "bg-rose-50 text-rose-600"}`}><Trash2 size={18} /></div>
                <span className="font-semibold text-[15px] text-rose-500">{t("delete")}</span>
              </div>
            </button>
          </div>
        </section>

        {/* FOOTER INFO */}
        <div className="text-center pt-4 space-y-1">
          <p className={`text-[11px] font-medium tracking-wider uppercase ${isDark ? "text-slate-600" : "text-gray-400"}`}>User ID: {me?.user?.id?.slice(0, 8) || "Guest"}</p>
          <p className={`text-[11px] font-medium tracking-wider uppercase ${isDark ? "text-slate-600" : "text-gray-400"}`}>Version 2026.22.2</p>
        </div>

      </div>

      {/* PREMIUM LANGUAGE BOTTOM SHEET */}
      {showLangModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4">
          <div className={`w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-10 sm:zoom-in-95 ${isDark ? "bg-[#151E2E] border border-white/10 shadow-2xl" : "bg-white"}`}>
            
            {/* Modal Handle */}
            <div className="w-full flex justify-center pt-3 pb-1">
              <div className={`w-12 h-1.5 rounded-full ${isDark ? "bg-slate-700" : "bg-gray-200"}`}></div>
            </div>

            <div className={`flex items-center justify-between p-5 border-b ${isDark ? "border-slate-800" : "border-gray-200"}`}>
              <div>
                <h2 className={`text-xl font-black tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>{t("selectLang")}</h2>
                <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-gray-500"}`}>Choose your preferred app language</p>
              </div>
              <button onClick={() => setShowLangModal(false)} className={`p-2.5 rounded-full transition-colors ${isDark ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                <X size={18} />
              </button>
            </div>
            
            <div className="p-3 overflow-y-auto">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLanguage(l.code); setShowLangModal(false); }}
                  className={`w-full flex items-center justify-between p-4 mb-1.5 rounded-2xl transition-all ${
                    lang === l.code 
                      ? (isDark ? "bg-amber-500/10 border border-amber-500/30" : "bg-orange-50 border border-orange-200") 
                      : "border border-transparent hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <span className={`text-[15px] font-bold ${lang === l.code ? "text-amber-500" : isDark ? "text-slate-200" : "text-gray-800"}`}>
                      {l.native}
                    </span>
                    <span className={`text-xs ${isDark ? "text-slate-500" : "text-gray-500"}`}>{l.label}</span>
                  </div>
                  
                  {/* Premium Radio Button */}
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    lang === l.code ? "border-amber-500 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]" : (isDark ? "border-slate-600" : "border-gray-300")
                  }`}>
                    {lang === l.code && <Check size={14} className="text-black font-bold" strokeWidth={3} />}
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
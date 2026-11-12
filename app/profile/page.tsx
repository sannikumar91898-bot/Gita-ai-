// app/profile/page.tsx
"use client";

import { useState } from "react";
import { 
  ArrowLeft, User, Globe, ChevronRight, Clock, 
  Wallet, Headphones, Home, MessageCircle, Scroll, 
  HelpCircle, FileText, List, Shield, Mail, LogOut, Moon, Sun, PhoneCall, Check, Loader2, Crown
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers"; 
import { LANGUAGES } from "../../i18n"; 

export default function ProfileDashboardPage() {
  const { lang, setLanguage, theme, setTheme, me } = useApp();
  const isDark = theme === "dark";
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // 🔥 10 Languages Translation Helper
  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      hi: {
        header: "प्रोफाइल", edit: "एडिट", myOrders: "मेरे ऑर्डर्स", wallet: "वॉलेट", support: "सपोर्ट",
        explore: "एक्सप्लोर", home: "होम", chatGita: "ज्योतिषी से चैट करें", myKundli: "मेरी कुंडली",
        account: "अकाउंट", helpCenter: "हेल्प सेंटर (FAQ)", supportTicket: "सपोर्ट टिकट", walletTx: "वॉलेट ट्रांजैक्शन", orderHistory: "ऑर्डर हिस्ट्री",
        legalSupport: "कानूनी और सपोर्ट", privacy: "प्राइवेसी पॉलिसी", terms: "नियम और शर्तें", contactUs: "संपर्क करें",
        appSettings: "ऐप सेटिंग्स", theme: "थीम", light: "लाइट", dark: "डार्क", language: "भाषा", logout: "लॉगआउट", loggingOut: "लॉगआउट हो रहा है...",
        bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "अभी बात करें - पहली चैट FREE", chatBtn: "चैट", guest: "गेस्ट यूजर", noEmail: "ईमेल उपलब्ध नहीं है",
        logoutConfirm: "क्या आप वाकई लॉगआउट करना चाहते हैं?", premiumUser: "प्रीमियम यूजर"
      },
      hinglish: {
        header: "PROFILE", edit: "EDIT", myOrders: "My Orders", wallet: "Wallet", support: "Support",
        explore: "EXPLORE", home: "Home", chatGita: "Chat with Astrologer", myKundli: "My Kundli",
        account: "ACCOUNT", helpCenter: "Help Center (FAQ)", supportTicket: "Support Ticket", walletTx: "Wallet Transactions", orderHistory: "Order History",
        legalSupport: "LEGAL & SUPPORT", privacy: "Privacy Policy", terms: "Terms of Service", contactUs: "Contact Us",
        appSettings: "APP SETTINGS", theme: "Theme", light: "Light", dark: "Dark", language: "Language", logout: "Logout", loggingOut: "Logging out...",
        bannerTitle: "ASTROLOGER - 24X7 AVAILABLE", bannerSub: "Talk Now -- First Chat FREE", chatBtn: "Chat", guest: "Guest User", noEmail: "No email available",
        logoutConfirm: "Are you sure you want to logout?", premiumUser: "Premium User"
      },
      en: {
        header: "PROFILE", edit: "EDIT", myOrders: "My Orders", wallet: "Wallet", support: "Support",
        explore: "EXPLORE", home: "Home", chatGita: "Chat with Astrologer", myKundli: "My Kundli",
        account: "ACCOUNT", helpCenter: "Help Center (FAQ)", supportTicket: "Support Ticket", walletTx: "Wallet Transactions", orderHistory: "Order History",
        legalSupport: "LEGAL & SUPPORT", privacy: "Privacy Policy", terms: "Terms of Service", contactUs: "Contact Us",
        appSettings: "APP SETTINGS", theme: "Theme", light: "Light", dark: "Dark", language: "Language", logout: "Logout", loggingOut: "Logging out...",
        bannerTitle: "ASTROLOGER - 24X7 AVAILABLE", bannerSub: "Talk Now -- First Chat FREE", chatBtn: "Chat", guest: "Guest User", noEmail: "No email available",
        logoutConfirm: "Are you sure you want to logout?", premiumUser: "Premium User"
      },
      te: {
        header: "ప్రొఫైల్", edit: "సవరించు", myOrders: "నా ఆర్డర్లు", wallet: "వాలెట్", support: "సపోర్ట్",
        explore: "అన్వేషించండి", home: "హోమ్", chatGita: "జ్యోతిష్యుడితో చాట్ చేయండి", myKundli: "నా కుండలి",
        account: "ఖాతా", helpCenter: "సహాయ కేంద్రం (FAQ)", supportTicket: "సపోర్ట్ టికెట్", walletTx: "వాలెట్ లావాదేవీలు", orderHistory: "ఆర్డర్ చరిత్ర",
        legalSupport: "చట్టపరమైన & మద్దతు", privacy: "గోప్యతా విధానం", terms: "సేవా నిబంధనలు", contactUs: "మమ్మల్ని సంప్రదించండి",
        appSettings: "యాప్ సెట్టింగ్‌లు", theme: "థీమ్", light: "లైట్", dark: "డార్క్", language: "భాష", logout: "లాగౌట్", loggingOut: "లాగౌట్ అవుతోంది...",
        bannerTitle: "జ్యోతిష్యుడు - 24x7 అందుబాటులో", bannerSub: "ఇప్పుడే మాట్లాడండి - మొదటి చాట్ ఉచితం", chatBtn: "చాట్", guest: "అతిథి వినియోగదారు", noEmail: "ఇమెయిల్ అందుబాటులో లేదు",
        logoutConfirm: "మీరు ఖచ్చితంగా లాగౌట్ చేయాలనుకుంటున్నారా?", premiumUser: "ప్రీమియం వినియోగదారు"
      },
      ta: {
        header: "சுயவிவரம்", edit: "திருத்து", myOrders: "எனது ஆர்டர்கள்", wallet: "பணப்பை", support: "ஆதரவு",
        explore: "ஆராயுங்கள்", home: "முகப்பு", chatGita: "ஜோதிடருடன் அரட்டையடிக்கவும்", myKundli: "எனது ஜாதகம்",
        account: "கணக்கு", helpCenter: "உதவி மையம் (FAQ)", supportTicket: "ஆதரவு டிக்கெட்", walletTx: "பணப்பை பரிவர்த்தனைகள்", orderHistory: "ஆர்டர் வரலாறு",
        legalSupport: "சட்டம் & ஆதரவு", privacy: "தனியுரிமைக் கொள்கை", terms: "சேவை விதிமுறைகள்", contactUs: "எங்களைத் தொடர்பு கொள்ளவும்",
        appSettings: "செயலி அமைப்புகள்", theme: "தீம்", light: "ஒளி", dark: "இருள்", language: "மொழி", logout: "வெளியேறு", loggingOut: "வெளியேறுகிறது...",
        bannerTitle: "ஜோதிடர் - 24x7 கிடைக்கும்", bannerSub: "இப்போது பேசுங்கள் - முதல் அரட்டை இலவசம்", chatBtn: "அரட்டை", guest: "விருந்தினர் பயனர்", noEmail: "மின்னஞ்சல் இல்லை",
        logoutConfirm: "நீங்கள் நிச்சயமாக வெளியேற விரும்புகிறீர்களா?", premiumUser: "பிரீமியம் பயனர்"
      },
      kn: {
        header: "ಪ್ರೊಫೈಲ್", edit: "ಸಂಪಾದಿಸು", myOrders: "ನನ್ನ ಆದೇಶಗಳು", wallet: "ವಾಲೆಟ್", support: "ಬೆಂಬಲ",
        explore: "ಅನ್ವೇಷಿಸಿ", home: "ಮುಖಪುಟ", chatGita: "ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ", myKundli: "ನನ್ನ ಕುಂಡಲಿ",
        account: "ಖಾತೆ", helpCenter: "ಸಹಾಯ ಕೇಂದ್ರ (FAQ)", supportTicket: "ಬೆಂಬಲ ಟಿಕೆಟ್", walletTx: "ವಾಲೆಟ್ ವಹಿವಾಟುಗಳು", orderHistory: "ಆದೇಶ ಇತಿಹಾಸ",
        legalSupport: "ಕಾನೂನು ಮತ್ತು ಬೆಂಬಲ", privacy: "ಗೋಪ್ಯತಾ ನೀತಿ", terms: "ಸೇವಾ ನಿಯಮಗಳು", contactUs: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ",
        appSettings: "ಅಪ್ಲಿಕೇಶನ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು", theme: "ಥೀಮ್", light: "ಬೆಳಕು", dark: "ಕತ್ತಲೆ", language: "ಭಾಷೆ", logout: "ಲಾಗ್ ಔಟ್", loggingOut: "ಲಾಗ್ ಔಟ್ ಆಗುತ್ತಿದೆ...",
        bannerTitle: "ಜ್ಯೋತಿಷಿ - 24x7 ಲಭ್ಯವಿದೆ", bannerSub: "ಈಗ ಮಾತನಾಡಿ - ಮೊದಲ ಚಾಟ್ ಉಚಿತ", chatBtn: "ಚಾಟ್", guest: "ಅತಿಥಿ ಬಳಕೆದಾರ", noEmail: "ಇಮೇಲ್ ಲಭ್ಯವಿಲ್ಲ",
        logoutConfirm: "ನೀವು ಖಚಿತವಾಗಿ ಲಾಗ್ ಔಟ್ ಮಾಡಲು ಬಯಸುವಿರಾ?", premiumUser: "ಪ್ರೀಮಿಯಂ ಬಳಕೆದಾರ"
      },
      bn: {
        header: "প্রোফাইল", edit: "সম্পাদনা", myOrders: "আমার অর্ডার", wallet: "ওয়ালেট", support: "সহায়তা",
        explore: "অন্বেষণ", home: "হোম", chatGita: "জ্যোতিষীর সাথে চ্যাট করুন", myKundli: "আমার কুণ্ডলী",
        account: "অ্যাকাউন্ট", helpCenter: "সহায়তা কেন্দ্র (FAQ)", supportTicket: "সহায়তা টিকিট", walletTx: "ওয়ালেট লেনদেন", orderHistory: "অর্ডার ইতিহাস",
        legalSupport: "আইনি ও সহায়তা", privacy: "গোপনীয়তা নীতি", terms: "পরিষেবার শর্তাবলী", contactUs: "আমাদের সাথে যোগাযোগ করুন",
        appSettings: "অ্যাপ সেটিংস", theme: "থিম", light: "হালকা", dark: "অন্ধকার", language: "ভাষা", logout: "লগ আউট", loggingOut: "লগ আউট হচ্ছে...",
        bannerTitle: "জ্যোতিষী - 24x7 উপলব্ধ", bannerSub: "এখনই কথা বলুন - প্রথম চ্যাট ফ্রি", chatBtn: "চ্যাট", guest: "অতিথি ব্যবহারকারী", noEmail: "ইমেল নেই",
        logoutConfirm: "আপনি কি নিশ্চিতভাবে লগ আউট করতে চান?", premiumUser: "প্রিমিয়াম ব্যবহারকারী"
      },
      mr: {
        header: "प्रोफाइल", edit: "संपादित करा", myOrders: "माझ्या ऑर्डर्स", wallet: "वॉलेट", support: "सपोर्ट",
        explore: "एक्सप्लोर करा", home: "होम", chatGita: "ज्योतिषांशी चॅट करा", myKundli: "माझी कुंडली",
        account: "खाते", helpCenter: "मदत केंद्र (FAQ)", supportTicket: "सपोर्ट तिकीट", walletTx: "वॉलेट व्यवहार", orderHistory: "ऑर्डर इतिहास",
        legalSupport: "कायदेशीर आणि सपोर्ट", privacy: "गोपनीयता धोरण", terms: "सेवा अटी", contactUs: "आमच्याशी संपर्क साधा",
        appSettings: "अ‍ॅप सेटिंग्ज", theme: "थीम", light: "लाइट", dark: "डार्क", language: "भाषा", logout: "लॉगआउट", loggingOut: "लॉगआउट होत आहे...",
        bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "आता बोला - पहिली चॅट मोफत", chatBtn: "चॅट", guest: "गेस्ट युजर", noEmail: "ईमेल उपलब्ध नाही",
        logoutConfirm: "तुम्हाला नक्की लॉगआउट करायचे आहे का?", premiumUser: "प्रीमियम युजर"
      },
      gu: {
        header: "પ્રોફાઇલ", edit: "સંપાદિત કરો", myOrders: "મારા ઓર્ડર્સ", wallet: "વોલેટ", support: "સપોર્ટ",
        explore: "એક્સપ્લોર કરો", home: "હોમ", chatGita: "જ્યોતિષી સાથે ચેટ કરો", myKundli: "મારી કુંડળી",
        account: "ખાતું", helpCenter: "મદદ કેન્દ્ર (FAQ)", supportTicket: "સપોર્ટ ટિકિટ", walletTx: "વોલેટ વ્યવહારો", orderHistory: "ઓર્ડર ઇતિહાસ",
        legalSupport: "કાયદાકીય અને સપોર્ટ", privacy: "ગોપનીયતા નીતિ", terms: "સેવાની શરતો", contactUs: "અમારો સંપર્ક કરો",
        appSettings: "એપ સેટિંગ્સ", theme: "થીમ", light: "લાઇટ", dark: "ડાર્ક", language: "ભાષા", logout: "લોગઆउट", loggingOut: "લોગઆउट થઈ રહ્યું છે...",
        bannerTitle: "જ્યોતિષી - 24x7 ઉપલબ્ધ", bannerSub: "હમણાં વાત કરો - પ્રથમ ચેટ મફત", chatBtn: "ચેટ", guest: "ગેસ્ટ યુઝર", noEmail: "ઈમેલ ઉપલબ્ધ નથી",
        logoutConfirm: "શું તમે ખરેખર લોગઆउट કરવા માંગો છો?", premiumUser: "પ્રીમિયમ યુઝર"
      },
      ml: {
        header: "പ്രൊഫൈൽ", edit: "തിരുത്തുക", myOrders: "എന്റെ ഓർഡറുകൾ", wallet: "വാലറ്റ്", support: "പിന്തുണ",
        explore: "പര്യവേക്ഷണം ചെയ്യുക", home: "ഹോം", chatGita: "ജ്യോതിഷിയുമായി ചാറ്റ് ചെയ്യുക", myKundli: "എന്റെ കുണ്ഡലി",
        account: "അക്കൗണ്ട്", helpCenter: "സഹായ കേന്ദ്രം (FAQ)", supportTicket: "പിന്തുണ ടിക്കറ്റ്", walletTx: "വാലറ്റ് ഇടപാടുകൾ", orderHistory: "ഓർഡർ ചരിത്രം",
        legalSupport: "നിയമപരവും പിന്തുണയും", privacy: "സ്വകാര്യതാ നയം", terms: "സേവന നിബന്ധനകൾ", contactUs: "ഞങ്ങളെ ബന്ധപ്പെടുക",
        appSettings: "ആപ്പ് ക്രമീകരണങ്ങൾ", theme: "തീം", light: "ലൈറ്റ്", dark: "ഡാർക്ക്", language: "ഭാഷ", logout: "ലോഗ് ഔട്ട്", loggingOut: "ലോഗ് ഔട്ട് ചെയ്യുന്നു...",
        bannerTitle: "ജ്യോതിഷി - 24x7 ലഭ്യമാണ്", bannerSub: "ഇപ്പോൾ സംസാരിക്കുക - ആദ്യ ചാറ്റ് സൗജന്യം", chatBtn: "ചാറ്റ്", guest: "അതിഥി ഉപയോക്താവ്", noEmail: "ഇമെയിൽ ലഭ്യമല്ല",
        logoutConfirm: "നിങ്ങൾക്ക് ഉറപ്പാണോ ലോഗ് ഔട്ട് ചെയ്യണമെന്ന്?", premiumUser: "പ്രീമിയം ഉപയോക്താവ്"
      }
    };
    return dict[lang || "hi"]?.[key] || dict["en"][key] || dict["hi"][key];
  };

  // 🔥 FIX 1: Premium Logout Logic (Calls API)
  const handleLogout = async () => {
    if (window.confirm(t("logoutConfirm"))) {
      setIsLoggingOut(true);
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (error) {
        console.error("Logout API failed", error);
      } finally {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
  };

  const userName = me?.user?.name || t("guest");
  const userEmail = me?.user?.email || t("noEmail");
  const userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanni&backgroundColor=FBBF24";
  
  // Check if user is premium (Assuming backend sends premiumUntil)
  const isPremium = Boolean(me?.user?.premiumUntil && new Date(me.user.premiumUntil) > new Date());

  // 🔥 FIX 2: Theme Classes
  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "bg-[#151d2c] border-slate-800" : "bg-white border-orange-100 shadow-sm";
  const textMutedClass = isDark ? "text-slate-400" : "text-gray-500";
  const textHighlightClass = isDark ? "text-slate-200" : "text-gray-800";
  const hoverClass = isDark ? "hover:bg-white/5" : "hover:bg-orange-50";
  const dividerClass = isDark ? "border-slate-800/50" : "border-orange-100/50";

  return (
    <main className={`min-h-[100dvh] w-full font-sans pb-32 transition-colors duration-300 ${pageClass}`}>
      
      <div className="w-full px-4 pt-4 space-y-5 max-w-2xl mx-auto">
        
        {/* HEADER */}
        <header className={`rounded-2xl flex items-center p-3 border ${cardClass}`}>
          <Link href="/" className={`p-2 rounded-full transition-colors ${isDark ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-black"}`}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-[15px] font-black text-[#ff6b00] ml-4 tracking-wider uppercase">{t("header")}</h1>
        </header>

        {/* USER CARD */}
        <div className={`rounded-2xl p-4 flex items-center justify-between border relative overflow-hidden ${cardClass}`}>
          {isPremium && (
            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 shadow-sm">
              <Crown size={10} /> {t("premiumUser")}
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <div className={`h-14 w-14 rounded-full flex items-center justify-center overflow-hidden border-2 ${isDark ? "border-[#151d2c]" : "border-white"} bg-[#FBBF24]`}>
               <img src={userAvatar} alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <div>
              <h2 className={`text-[16px] font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{userName}</h2>
              <p className={`text-[11px] mt-0.5 ${textMutedClass}`}>{userEmail}</p>
            </div>
          </div>
          
          <Link href="/profile/edit" className={`text-[10px] font-bold px-3.5 py-2 rounded-lg transition-colors ${isDark ? "bg-[#3b2517] text-[#ff6b00] hover:bg-[#4a2e1c]" : "bg-orange-100 text-orange-600 hover:bg-orange-200"}`}>
            {t("edit")}
          </Link>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-3 gap-3">
          <Link href="/orders" className={`rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border transition-colors ${cardClass} ${hoverClass}`}>
            <Clock size={22} className="text-[#ff6b00]" />
            <span className={`text-[11px] font-semibold text-center ${textHighlightClass}`}>{t("myOrders")}</span>
          </Link>
          <Link href="/wallet" className={`rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border transition-colors ${cardClass} ${hoverClass}`}>
            <Wallet size={22} className="text-[#ff6b00]" />
            <span className={`text-[11px] font-semibold text-center ${textHighlightClass}`}>{t("wallet")}</span>
          </Link>
          <Link href="/support" className={`rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border transition-colors ${cardClass} ${hoverClass}`}>
            <Headphones size={22} className="text-[#ff6b00]" />
            <span className={`text-[11px] font-semibold text-center ${textHighlightClass}`}>{t("support")}</span>
          </Link>
        </div>

        {/* EXPLORE SECTION */}
        <section>
          <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-2 px-1 ${textMutedClass}`}>{t("explore")}</h3>
          <div className={`rounded-2xl border overflow-hidden ${cardClass}`}>
            <Link href="/" className={`flex items-center justify-between p-4 border-b ${dividerClass} ${hoverClass} transition-colors`}>
              <div className="flex items-center gap-3"><Home size={18} className={textMutedClass} /><span className={`text-[13px] font-medium ${textHighlightClass}`}>{t("home")}</span></div>
              <ChevronRight size={16} className={textMutedClass} />
            </Link>
            <Link href="/chat" className={`flex items-center justify-between p-4 border-b ${dividerClass} ${hoverClass} transition-colors`}>
              <div className="flex items-center gap-3"><MessageCircle size={18} className={textMutedClass} /><span className={`text-[13px] font-medium ${textHighlightClass}`}>{t("chatGita")}</span></div>
              <ChevronRight size={16} className={textMutedClass} />
            </Link>
            <Link href="/kundli" className={`flex items-center justify-between p-4 ${hoverClass} transition-colors`}>
              <div className="flex items-center gap-3"><Scroll size={18} className={textMutedClass} /><span className={`text-[13px] font-medium ${textHighlightClass}`}>{t("myKundli")}</span></div>
              <ChevronRight size={16} className={textMutedClass} />
            </Link>
          </div>
        </section>

        {/* ACCOUNT SECTION */}
        <section>
          <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-2 px-1 ${textMutedClass}`}>{t("account")}</h3>
          <div className={`rounded-2xl border overflow-hidden ${cardClass}`}>
            <Link href="/help" className={`flex items-center justify-between p-4 border-b ${dividerClass} ${hoverClass} transition-colors`}>
              <div className="flex items-center gap-3"><HelpCircle size={18} className={textMutedClass} /><span className={`text-[13px] font-medium ${textHighlightClass}`}>{t("helpCenter")}</span></div>
              <ChevronRight size={16} className={textMutedClass} />
            </Link>
            <Link href="/support" className={`flex items-center justify-between p-4 border-b ${dividerClass} ${hoverClass} transition-colors`}>
              <div className="flex items-center gap-3"><Headphones size={18} className={textMutedClass} /><span className={`text-[13px] font-medium ${textHighlightClass}`}>{t("supportTicket")}</span></div>
              <ChevronRight size={16} className={textMutedClass} />
            </Link>
            <Link href="/wallet" className={`flex items-center justify-between p-4 border-b ${dividerClass} ${hoverClass} transition-colors`}>
              <div className="flex items-center gap-3"><FileText size={18} className={textMutedClass} /><span className={`text-[13px] font-medium ${textHighlightClass}`}>{t("walletTx")}</span></div>
              <ChevronRight size={16} className={textMutedClass} />
            </Link>
            <Link href="/orders" className={`flex items-center justify-between p-4 ${hoverClass} transition-colors`}>
              <div className="flex items-center gap-3"><List size={18} className={textMutedClass} /><span className={`text-[13px] font-medium ${textHighlightClass}`}>{t("orderHistory")}</span></div>
              <ChevronRight size={16} className={textMutedClass} />
            </Link>
          </div>
        </section>

        {/* LEGAL SECTION */}
        <section>
          <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-2 px-1 ${textMutedClass}`}>{t("legalSupport")}</h3>
          <div className={`rounded-2xl border overflow-hidden ${cardClass}`}>
            <Link href="/privacy" className={`flex items-center justify-between p-4 border-b ${dividerClass} ${hoverClass} transition-colors`}>
              <div className="flex items-center gap-3"><Shield size={18} className={textMutedClass} /><span className={`text-[13px] font-medium ${textHighlightClass}`}>{t("privacy")}</span></div>
              <ChevronRight size={16} className={textMutedClass} />
            </Link>
            <Link href="/terms" className={`flex items-center justify-between p-4 border-b ${dividerClass} ${hoverClass} transition-colors`}>
              <div className="flex items-center gap-3"><FileText size={18} className={textMutedClass} /><span className={`text-[13px] font-medium ${textHighlightClass}`}>{t("terms")}</span></div>
              <ChevronRight size={16} className={textMutedClass} />
            </Link>
            <Link href="/contact" className={`flex items-center justify-between p-4 ${hoverClass} transition-colors`}>
              <div className="flex items-center gap-3"><Mail size={18} className={textMutedClass} /><span className={`text-[13px] font-medium ${textHighlightClass}`}>{t("contactUs")}</span></div>
              <ChevronRight size={16} className={textMutedClass} />
            </Link>
          </div>
        </section>

        {/* SETTINGS SECTION (Theme & Language) */}
        <section>
          <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-2 px-1 ${textMutedClass}`}>{t("appSettings")}</h3>
          <div className={`rounded-2xl border p-4 space-y-6 ${cardClass}`}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Moon size={16} className="text-[#ff6b00]" />
                <span className={`text-[13px] font-semibold ${textHighlightClass}`}>{t("theme")}</span>
              </div>
              <div className={`flex p-1 rounded-xl border ${isDark ? "bg-[#0A0F19] border-slate-800" : "bg-gray-100 border-gray-200"}`}>
                <button onClick={() => setTheme("light")} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] font-medium rounded-lg transition-colors ${theme === "light" ? "bg-white text-orange-600 shadow-sm" : isDark ? "text-slate-400 hover:text-white" : "text-gray-500 hover:text-black"}`}>
                  <Sun size={14} /> {t("light")}
                </button>
                <button onClick={() => setTheme("dark")} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] font-medium rounded-lg transition-colors ${theme === "dark" ? "bg-[#2e3a4e] text-white shadow-sm" : "text-gray-500 hover:text-black"}`}>
                  <Moon size={14} /> {t("dark")}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe size={16} className="text-[#ff6b00]" />
                <span className={`text-[13px] font-semibold ${textHighlightClass}`}>{t("language")}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`py-2.5 px-3 rounded-xl border text-[12px] font-medium transition-all text-left truncate flex items-center justify-between ${
                      lang === l.code 
                        ? "bg-[#ff6b00] text-white border-[#ff6b00] shadow-[0_0_10px_rgba(255,107,0,0.3)]" 
                        : isDark ? "bg-[#0A0F19] text-slate-300 border-slate-700 hover:border-slate-500" : "bg-white text-gray-700 border-gray-200 hover:border-orange-300"
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

        {/* SECURE LOGOUT BUTTON */}
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`w-full rounded-2xl py-4 flex justify-center items-center gap-2 font-semibold text-[14px] transition-colors disabled:opacity-70 ${
            isDark ? "bg-[#1f1517] text-[#ef4444] border border-[#ef4444]/20 hover:bg-[#2a1c1e]" : "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
          }`}
        >
          {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />} 
          {isLoggingOut ? t("loggingOut") : t("logout")}
        </button>

      </div>

      {/* STICKY BOTTOM BANNER */}
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
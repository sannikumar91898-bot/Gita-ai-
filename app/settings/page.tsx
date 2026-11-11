// app/settings/page.tsx
"use client";

import { useState } from "react";
import { 
  ArrowLeft, Globe, ChevronRight, Clock, 
  Wallet, Headphones, Home, MessageCircle, Scroll, 
  HelpCircle, FileText, List, Shield, Mail, LogOut, Moon, Sun, PhoneCall, Check, Trash2, X
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";
import { LANGUAGES } from "../../i18n"; 

export default function SettingsPage() {
  const { lang, setLanguage, theme, setTheme, me } = useApp();
  const [showLangModal, setShowLangModal] = useState(false);
  
  // 🔥 Check if Dark Mode is active
  const isDark = theme === "dark";

  // 🔥 10 Languages Full Translation Helper
  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      hi: {
        header: "प्रोफाइल", edit: "एडिट", myOrders: "मेरे ऑर्डर्स", wallet: "वॉलेट", support: "सपोर्ट",
        explore: "एक्सप्लोर", home: "होम", chatGita: "गीता AI से चैट करें", myKundli: "मेरी कुंडली",
        account: "अकाउंट", helpCenter: "हेल्प सेंटर (FAQ)", supportTicket: "सपोर्ट टिकट", walletTx: "वॉलेट ट्रांजैक्शन", orderHistory: "ऑर्डर हिस्ट्री",
        legalSupport: "कानूनी और सपोर्ट", privacy: "प्राइवेसी पॉलिसी", terms: "नियम और शर्तें", contactUs: "संपर्क करें",
        appSettings: "ऐप सेटिंग्स", theme: "थीम", light: "लाइट", dark: "डार्क", language: "भाषा", 
        logout: "लॉगआउट", deleteAccount: "अकाउंट डिलीट करें",
        bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "अभी बात करें - पहली चैट FREE", chatBtn: "चैट", guest: "गेस्ट यूजर", noEmail: "ईमेल उपलब्ध नहीं है", cancel: "रद्द करें", deleteConfirm: "क्या आप वाकई अपना अकाउंट डिलीट करना चाहते हैं? यह वापस नहीं होगा।"
      },
      hinglish: {
        header: "PROFILE", edit: "EDIT", myOrders: "My Orders", wallet: "Wallet", support: "Support",
        explore: "EXPLORE", home: "Home", chatGita: "Chat with Gita AI", myKundli: "My Kundli",
        account: "ACCOUNT", helpCenter: "Help Center (FAQ)", supportTicket: "Support Ticket", walletTx: "Wallet Transactions", orderHistory: "Order History",
        legalSupport: "LEGAL & SUPPORT", privacy: "Privacy Policy", terms: "Terms of Service", contactUs: "Contact Us",
        appSettings: "APP SETTINGS", theme: "Theme", light: "Light", dark: "Dark", language: "Language", 
        logout: "Logout", deleteAccount: "Delete Account",
        bannerTitle: "ASTROLOGER - 24X7 AVAILABLE", bannerSub: "Talk Now -- First Chat FREE", chatBtn: "Chat", guest: "Guest User", noEmail: "No email available", cancel: "Cancel", deleteConfirm: "Are you sure you want to delete your account? This cannot be undone."
      },
      en: {
        header: "PROFILE", edit: "EDIT", myOrders: "My Orders", wallet: "Wallet", support: "Support",
        explore: "EXPLORE", home: "Home", chatGita: "Chat with Gita AI", myKundli: "My Kundli",
        account: "ACCOUNT", helpCenter: "Help Center (FAQ)", supportTicket: "Support Ticket", walletTx: "Wallet Transactions", orderHistory: "Order History",
        legalSupport: "LEGAL & SUPPORT", privacy: "Privacy Policy", terms: "Terms of Service", contactUs: "Contact Us",
        appSettings: "APP SETTINGS", theme: "Theme", light: "Light", dark: "Dark", language: "Language", 
        logout: "Logout", deleteAccount: "Delete Account",
        bannerTitle: "ASTROLOGER - 24X7 AVAILABLE", bannerSub: "Talk Now -- First Chat FREE", chatBtn: "Chat", guest: "Guest User", noEmail: "No email available", cancel: "Cancel", deleteConfirm: "Are you sure you want to delete your account? This cannot be undone."
      },
      te: {
        header: "ప్రొఫైల్", edit: "సవరించండి", myOrders: "నా ఆర్డర్లు", wallet: "వాలెట్", support: "మద్దతు",
        explore: "అన్వేషించండి", home: "హోమ్", chatGita: "గీతా AI తో చాట్ చేయండి", myKundli: "నా కుండలి",
        account: "ఖాతా", helpCenter: "సహాయ కేంద్రం (FAQ)", supportTicket: "మద్దతు టికెట్", walletTx: "వాలెట్ లావాదేవీలు", orderHistory: "ఆర్డర్ చరిత్ర",
        legalSupport: "చట్టపరమైన & మద్దతు", privacy: "గోప్యతా విధానం", terms: "సేవా నిబంధనలు", contactUs: "మమ్మల్ని సంప్రదించండి",
        appSettings: "యాప్ సెట్టింగ్స్", theme: "థీమ్", light: "లైట్", dark: "డార్క్", language: "భాష", 
        logout: "లాగ్ అవుట్", deleteAccount: "ఖాతా తొలగించండి",
        bannerTitle: "జ్యోతిష్యుడు - 24x7 అందుబాటులో", bannerSub: "ఇప్పుడే మాట్లాడండి - మొదటి చాట్ ఉచితం", chatBtn: "చాట్", guest: "గెస్ట్ యూజర్", noEmail: "ఇమెయిల్ అందుబాటులో లేదు", cancel: "రద్దు చేయండి", deleteConfirm: "మీరు ఖాతాను తొలగించాలనుకుంటున్నారా? ఇది వెనక్కి తీసుకోలేరు."
      },
      ta: {
        header: "சுயவிவரம்", edit: "திருத்து", myOrders: "எனது ஆர்டர்கள்", wallet: "பணப்பை", support: "ஆதரவு",
        explore: "ஆராயுங்கள்", home: "முகப்பு", chatGita: "கீதா AI உடன் அரட்டையடிக்கவும்", myKundli: "எனது ஜாதகம்",
        account: "கணக்கு", helpCenter: "உதவி மையம் (FAQ)", supportTicket: "ஆதரவு டிக்கெட்", walletTx: "பணப்பை பரிவர்த்தனைகள்", orderHistory: "ஆர்டர் வரலாறு",
        legalSupport: "சட்டப்பூர்வ & ஆதரவு", privacy: "தனியுரிமைக் கொள்கை", terms: "சேவை விதிமுறைகள்", contactUs: "எங்களைத் தொடர்பு கொள்ள",
        appSettings: "செயலி அமைப்புகள்", theme: "தீம்", light: "ஒளி", dark: "இருள்", language: "மொழி", 
        logout: "வெளியேறு", deleteAccount: "கணக்கை நீக்கு",
        bannerTitle: "ஜோதிடர் - 24x7 கிடைக்கும்", bannerSub: "இப்போது பேசுங்கள் - முதல் அரட்டை இலவசம்", chatBtn: "அரட்டை", guest: "விருந்தினர்", noEmail: "மின்னஞ்சல் இல்லை", cancel: "ரத்து செய்", deleteConfirm: "உங்கள் கணக்கை நீக்க விரும்புகிறீர்களா? இதை மீண்டும் பெற முடியாது."
      },
      kn: {
        header: "ಪ್ರೊಫೈಲ್", edit: "ಸಂಪಾದಿಸಿ", myOrders: "ನನ್ನ ಆರ್ಡರ್ಗಳು", wallet: "ವಾಲೆಟ್", support: "ಬೆಂಬಲ",
        explore: "ಅನ್ವೇಷಿಸಿ", home: "ಮುಖಪುಟ", chatGita: "ಗೀತಾ AI ಜೊತೆ ಚಾಟ್ ಮಾಡಿ", myKundli: "ನನ್ನ ಕುಂಡಲಿ",
        account: "ಖಾತೆ", helpCenter: "ಸಹಾಯ ಕೇಂದ್ರ (FAQ)", supportTicket: "ಬೆಂಬಲ ಟಿಕೆಟ್", walletTx: "ವಾಲೆಟ್ ವಹಿವಾಟುಗಳು", orderHistory: "ಆರ್ಡರ್ ಇತಿಹಾಸ",
        legalSupport: "ಕಾನೂನು ಮತ್ತು ಬೆಂಬಲ", privacy: "ಗೋಪ್ಯತಾ ನೀತಿ", terms: "ಸೇವಾ ನಿಯಮಗಳು", contactUs: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ",
        appSettings: "ಆ್ಯಪ್ ಸೆಟ್ಟಿಂಗ್ಗಳು", theme: "ಥೀಮ್", light: "ಬೆಳಕು", dark: "ಕತ್ತಲೆ", language: "ಭಾಷೆ", 
        logout: "ಲಾಗ್ ಔಟ್", deleteAccount: "ಖಾತೆ ಅಳಿಸಿ",
        bannerTitle: "ಜ್ಯೋತಿಷಿ - 24x7 ಲಭ್ಯವಿದೆ", bannerSub: "ಈಗ ಮಾತನಾಡಿ - ಮೊದಲ ಚಾಟ್ ಉಚಿತ", chatBtn: "ಚಾಟ್", guest: "ಅತಿಥಿ", noEmail: "ಇಮೇಲ್ ಲಭ್ಯವಿಲ್ಲ", cancel: "ರದ್ದುಮಾಡಿ", deleteConfirm: "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ? ಇದನ್ನು ರದ್ದುಗೊಳಿಸಲಾಗುವುದಿಲ್ಲ."
      },
      bn: {
        header: "প্রোফাইল", edit: "সম্পাদনা", myOrders: "আমার অর্ডার", wallet: "ওয়ালেট", support: "সমর্থন",
        explore: "অন্বেষণ করুন", home: "হোম", chatGita: "গীতা AI এর সাথে চ্যাট করুন", myKundli: "আমার কুণ্ডলী",
        account: "অ্যাকাউন্ট", helpCenter: "সহায়তা কেন্দ্র (FAQ)", supportTicket: "সমর্থন টিকিট", walletTx: "ওয়ালেট লেনদেন", orderHistory: "অর্ডার ইতিহাস",
        legalSupport: "আইনি ও সমর্থন", privacy: "গোপনীয়তা নীতি", terms: "পরিষেবার শর্তাবলী", contactUs: "যোগাযোগ করুন",
        appSettings: "অ্যাপ সেটিংস", theme: "থিম", light: "হালকা", dark: "অন্ধকার", language: "ভাষা", 
        logout: "লগ আউট", deleteAccount: "অ্যাকাউন্ট মুছুন",
        bannerTitle: "জ্যোতিষী - 24x7 উপলব্ধ", bannerSub: "এখনই কথা বলুন - প্রথম চ্যাট ফ্রি", chatBtn: "চ্যাট", guest: "গেস্ট ইউজার", noEmail: "কোনো ইমেল নেই", cancel: "বাতিল করুন", deleteConfirm: "আপনি কি সত্যিই আপনার অ্যাকাউন্ট মুছে ফেলতে চান? এটি ফিরিয়ে আনা যাবে না।"
      },
      mr: {
        header: "प्रोफाइल", edit: "संपादित करा", myOrders: "माझ्या ऑर्डर्स", wallet: "वॉलेट", support: "समर्थन",
        explore: "एक्सप्लोर करा", home: "होम", chatGita: "गीता AI शी चॅट करा", myKundli: "माझी कुंडली",
        account: "खाते", helpCenter: "मदत केंद्र (FAQ)", supportTicket: "समर्थन तिकीट", walletTx: "वॉलेट व्यवहार", orderHistory: "ऑर्डर इतिहास",
        legalSupport: "कायदेशीर आणि समर्थन", privacy: "गोपनीयता धोरण", terms: "सेवा अटी", contactUs: "आमच्याशी संपर्क साधा",
        appSettings: "अॅप सेटिंग्ज", theme: "थीम", light: "प्रकाश", dark: "गडद", language: "भाषा", 
        logout: "लॉग आउट", deleteAccount: "खाते हटवा",
        bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "आता बोला - पहिली चॅट मोफत", chatBtn: "चॅट", guest: "गेस्ट यूजर", noEmail: "ईमेल उपलब्ध नाही", cancel: "रद्द करा", deleteConfirm: "तुम्हाला तुमचे खाते हटवायचे आहे का? हे पूर्ववत केले जाऊ शकत नाही."
      },
      gu: {
        header: "પ્રોફાઇલ", edit: "સંપાદિત કરો", myOrders: "મારા ઓર્ડર્સ", wallet: "વોલેટ", support: "સપોર્ટ",
        explore: "એક્સપ્લોર કરો", home: "હોમ", chatGita: "ગીતા AI સાથે ચેટ કરો", myKundli: "મારી કુંડળી",
        account: "એકાઉન્ટ", helpCenter: "મદદ કેન્દ્ર (FAQ)", supportTicket: "સપોર્ટ ટિકિટ", walletTx: "વોલેટ વ્યવહારો", orderHistory: "ઓર્ડર ઇતિહાસ",
        legalSupport: "કાનૂની અને સપોર્ટ", privacy: "ગોપનીયતા નીતિ", terms: "સેવાની શરતો", contactUs: "અમારો સંપર્ક કરો",
        appSettings: "એપ સેટિંગ્સ", theme: "થીમ", light: "લાઇટ", dark: "ડાર્ક", language: "ભાષા", 
        logout: "લોગ આઉટ", deleteAccount: "એકાઉન્ટ કાઢી નાખો",
        bannerTitle: "જ્યોતિષી - 24x7 ઉપલબ્ધ", bannerSub: "હમણાં વાત કરો - પ્રથમ ચેટ મફત", chatBtn: "ચેટ", guest: "ગેસ્ટ યુઝર", noEmail: "કોઈ ઇમેઇલ નથી", cancel: "રદ કરો", deleteConfirm: "શું તમે ખરેખર તમારું એકાઉન્ટ કાઢી નાખવા માંગો છો? આ પૂર્વવત્ કરી શકાશે નહીં."
      },
      ml: {
        header: "പ്രൊഫൈൽ", edit: "എഡിറ്റ് ചെയ്യുക", myOrders: "എന്റെ ഓർഡറുകൾ", wallet: "വാലറ്റ്", support: "പിന്തുണ",
        explore: "പര്യവേക്ഷണം ചെയ്യുക", home: "ഹോം", chatGita: "ഗീത AI-യുമായി ചാറ്റ് ചെയ്യുക", myKundli: "എന്റെ കുണ്ഡലി",
        account: "അക്കൗണ്ട്", helpCenter: "സഹായ കേന്ദ്രം (FAQ)", supportTicket: "പിന്തുണ ടിക്കറ്റ്", walletTx: "വാലറ്റ് ഇടപാടുകൾ", orderHistory: "ഓർഡർ ചരിത്രം",
        legalSupport: "നിയമപരവും പിന്തുണയും", privacy: "സ്വകാര്യതാ നയം", terms: "സേവന നിബന്ധനകൾ", contactUs: "ബന്ധപ്പെടുക",
        appSettings: "ആപ്പ് ക്രമീകരണങ്ങൾ", theme: "തീം", light: "ലൈറ്റ്", dark: "ഡാർക്ക്", language: "ഭാഷ", 
        logout: "ലോഗ് ഔട്ട്", deleteAccount: "അക്കൗണ്ട് ഇല്ലാതാക്കുക",
        bannerTitle: "ജ്യോതിഷി - 24x7 ലഭ്യമാണ്", bannerSub: "ഇപ്പോൾ സംസാരിക്കുക - ആദ്യ ചാറ്റ് സൗജന്യം", chatBtn: "ചാറ്റ്", guest: "ഗസ്റ്റ് യൂസർ", noEmail: "ഇമെയിൽ ലഭ്യമല്ല", cancel: "റദ്ദാക്കുക", deleteConfirm: "നിങ്ങളുടെ അക്കൗണ്ട് ഇല്ലാതാക്കാൻ ആഗ്രഹിക്കുന്നുണ്ടോ? ഇത് പഴയപടിയാക്കാൻ കഴിയില്ല."
      }
    };
    return dict[lang || "hi"]?.[key] || dict["en"][key] || dict["hi"][key];
  };

  const userName = me?.user?.name || t("guest");
  const userEmail = me?.user?.email || t("noEmail");
  const userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanni&backgroundColor=FBBF24";
  
  const currentLangLabel = LANGUAGES.find((l) => l.code === lang)?.native || "English";

  // 🔥 DYNAMIC CLASSES FOR THEME
  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "bg-[#151d2c] border-slate-800 shadow-md" : "bg-white border-orange-100 shadow-md";
  const listItemClass = isDark ? "border-slate-800/50 hover:bg-white/5" : "border-gray-100 hover:bg-gray-50";
  const iconColorClass = isDark ? "text-slate-300" : "text-gray-600";
  const textColorClass = isDark ? "text-slate-200" : "text-gray-800";
  const subTextClass = isDark ? "text-slate-400" : "text-gray-500";

  return (
    <main className={`min-h-[100dvh] w-full font-sans pb-32 transition-colors duration-300 ${pageClass}`}>
      
      <div className="w-full max-w-2xl mx-auto px-4 pt-4 space-y-5">
        
        {/* HEADER */}
        <header className={`rounded-2xl flex items-center p-3 border ${cardClass}`}>
          <Link href="/" className={`p-2 rounded-full transition-colors ${isDark ? "bg-[#0A0F19] text-slate-400" : "bg-gray-100 text-gray-600"}`}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-[15px] font-black text-[#ff6b00] ml-4 tracking-wider uppercase">{t("header")}</h1>
        </header>

        {/* USER CARD */}
        <div className={`rounded-2xl p-4 flex items-center justify-between border ${cardClass}`}>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-[#FBBF24] flex items-center justify-center overflow-hidden border-2 border-[#151d2c]">
               <img src={userAvatar} alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <div>
              <h2 className={`text-[16px] font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{userName}</h2>
              <p className={`text-[11px] mt-0.5 ${subTextClass}`}>{userEmail}</p>
            </div>
          </div>
          
          <Link href="/profile/edit" className="bg-[#ff6b00]/10 text-[#ff6b00] text-[10px] font-bold px-3.5 py-2 rounded-lg hover:bg-[#ff6b00]/20 transition-colors">
            {t("edit")}
          </Link>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-3 gap-3">
          <Link href="/orders" className={`rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border transition-colors ${cardClass}`}>
            <Clock size={22} className="text-[#ff6b00]" />
            <span className={`text-[11px] font-semibold text-center ${textColorClass}`}>{t("myOrders")}</span>
          </Link>
          <Link href="/wallet" className={`rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border transition-colors ${cardClass}`}>
            <Wallet size={22} className="text-[#ff6b00]" />
            <span className={`text-[11px] font-semibold text-center ${textColorClass}`}>{t("wallet")}</span>
          </Link>
          <Link href="/support" className={`rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border transition-colors ${cardClass}`}>
            <Headphones size={22} className="text-[#ff6b00]" />
            <span className={`text-[11px] font-semibold text-center ${textColorClass}`}>{t("support")}</span>
          </Link>
        </div>

        {/* EXPLORE */}
        <section>
          <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-2 px-1 ${subTextClass}`}>{t("explore")}</h3>
          <div className={`rounded-2xl border overflow-hidden ${cardClass}`}>
            <Link href="/" className={`flex items-center justify-between p-4 border-b transition-colors ${listItemClass}`}>
              <div className="flex items-center gap-3"><Home size={18} className={iconColorClass} /><span className={`text-[13px] font-medium ${textColorClass}`}>{t("home")}</span></div>
              <ChevronRight size={16} className={subTextClass} />
            </Link>
            <Link href="/chat" className={`flex items-center justify-between p-4 border-b transition-colors ${listItemClass}`}>
              <div className="flex items-center gap-3"><MessageCircle size={18} className={iconColorClass} /><span className={`text-[13px] font-medium ${textColorClass}`}>{t("chatGita")}</span></div>
              <ChevronRight size={16} className={subTextClass} />
            </Link>
            <Link href="/kundli" className={`flex items-center justify-between p-4 transition-colors ${listItemClass}`}>
              <div className="flex items-center gap-3"><Scroll size={18} className={iconColorClass} /><span className={`text-[13px] font-medium ${textColorClass}`}>{t("myKundli")}</span></div>
              <ChevronRight size={16} className={subTextClass} />
            </Link>
          </div>
        </section>

        {/* ACCOUNT */}
        <section>
          <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-2 px-1 ${subTextClass}`}>{t("account")}</h3>
          <div className={`rounded-2xl border overflow-hidden ${cardClass}`}>
            <Link href="/help" className={`flex items-center justify-between p-4 border-b transition-colors ${listItemClass}`}>
              <div className="flex items-center gap-3"><HelpCircle size={18} className={iconColorClass} /><span className={`text-[13px] font-medium ${textColorClass}`}>{t("helpCenter")}</span></div>
              <ChevronRight size={16} className={subTextClass} />
            </Link>
            <Link href="/support" className={`flex items-center justify-between p-4 border-b transition-colors ${listItemClass}`}>
              <div className="flex items-center gap-3"><Headphones size={18} className={iconColorClass} /><span className={`text-[13px] font-medium ${textColorClass}`}>{t("supportTicket")}</span></div>
              <ChevronRight size={16} className={subTextClass} />
            </Link>
            <Link href="/wallet" className={`flex items-center justify-between p-4 border-b transition-colors ${listItemClass}`}>
              <div className="flex items-center gap-3"><FileText size={18} className={iconColorClass} /><span className={`text-[13px] font-medium ${textColorClass}`}>{t("walletTx")}</span></div>
              <ChevronRight size={16} className={subTextClass} />
            </Link>
            <Link href="/orders" className={`flex items-center justify-between p-4 transition-colors ${listItemClass}`}>
              <div className="flex items-center gap-3"><List size={18} className={iconColorClass} /><span className={`text-[13px] font-medium ${textColorClass}`}>{t("orderHistory")}</span></div>
              <ChevronRight size={16} className={subTextClass} />
            </Link>
          </div>
        </section>

        {/* LEGAL & SUPPORT */}
        <section>
          <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-2 px-1 ${subTextClass}`}>{t("legalSupport")}</h3>
          <div className={`rounded-2xl border overflow-hidden ${cardClass}`}>
            <Link href="/privacy" className={`flex items-center justify-between p-4 border-b transition-colors ${listItemClass}`}>
              <div className="flex items-center gap-3"><Shield size={18} className={iconColorClass} /><span className={`text-[13px] font-medium ${textColorClass}`}>{t("privacy")}</span></div>
              <ChevronRight size={16} className={subTextClass} />
            </Link>
            <Link href="/terms" className={`flex items-center justify-between p-4 border-b transition-colors ${listItemClass}`}>
              <div className="flex items-center gap-3"><FileText size={18} className={iconColorClass} /><span className={`text-[13px] font-medium ${textColorClass}`}>{t("terms")}</span></div>
              <ChevronRight size={16} className={subTextClass} />
            </Link>
            <Link href="/contact" className={`flex items-center justify-between p-4 transition-colors ${listItemClass}`}>
              <div className="flex items-center gap-3"><Mail size={18} className={iconColorClass} /><span className={`text-[13px] font-medium ${textColorClass}`}>{t("contactUs")}</span></div>
              <ChevronRight size={16} className={subTextClass} />
            </Link>
          </div>
        </section>

        {/* APP SETTINGS */}
        <section>
          <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-2 px-1 ${subTextClass}`}>{t("appSettings")}</h3>
          <div className={`rounded-2xl border p-4 space-y-6 ${cardClass}`}>
            
            {/* Theme Toggle */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Moon size={16} className="text-[#ff6b00]" />
                <span className={`text-[13px] font-semibold ${textColorClass}`}>{t("theme")}</span>
              </div>
              <div className={`flex p-1 rounded-xl border ${isDark ? "bg-[#0A0F19] border-slate-800" : "bg-gray-100 border-gray-200"}`}>
                <button onClick={() => setTheme("light")} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] font-medium rounded-lg transition-colors ${!isDark ? "bg-white text-orange-600 shadow-sm" : "text-slate-400 hover:text-white"}`}>
                  <Sun size={14} /> {t("light")}
                </button>
                <button onClick={() => setTheme("dark")} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] font-medium rounded-lg transition-colors ${isDark ? "bg-[#2e3a4e] text-white shadow-sm" : "text-gray-500 hover:text-gray-900"}`}>
                  <Moon size={14} /> {t("dark")}
                </button>
              </div>
            </div>

            {/* 🔥 LANGUAGE SECTION (Single Row like 2nd screenshot) */}
            <button 
              onClick={() => setShowLangModal(true)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group ${
                isDark 
                  ? "bg-[#0A0F19] border-slate-800 hover:border-[#ff6b00]/50 hover:bg-slate-800/50" 
                  : "bg-gray-50 border-gray-200 hover:border-[#ff6b00] hover:bg-orange-50/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe size={18} className="text-[#ff6b00] group-hover:scale-110 transition-transform" />
                <span className={`text-[14px] font-bold ${textColorClass}`}>{t("language")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-black text-[#ff6b00]">{currentLangLabel}</span>
                <ChevronRight size={18} className={`${subTextClass} group-hover:text-[#ff6b00] transition-colors`} />
              </div>
            </button>

          </div>
        </section>

        {/* LOGOUT & DELETE ACCOUNT */}
        <section>
          <div className={`rounded-2xl border overflow-hidden ${cardClass}`}>
            <button 
              onClick={() => {
                if(window.confirm("Logout?")) {
                  localStorage.clear(); window.location.href="/login";
                }
              }}
              className={`w-full flex items-center justify-between p-4 border-b transition-colors ${listItemClass}`}
            >
              <div className="flex items-center gap-3">
                <LogOut size={18} className={iconColorClass} />
                <span className={`text-[13px] font-medium ${textColorClass}`}>{t("logout")}</span>
              </div>
            </button>
            
            <button 
              onClick={() => {
                if(window.confirm(t("deleteConfirm"))) {
                  alert("Account deletion logic here.");
                }
              }}
              className={`w-full flex items-center justify-between p-4 transition-colors ${isDark ? "hover:bg-rose-500/10" : "hover:bg-rose-50"}`}
            >
              <div className="flex items-center gap-3">
                <Trash2 size={18} className="text-rose-500" />
                <span className="text-[13px] font-medium text-rose-500">{t("deleteAccount")}</span>
              </div>
            </button>
          </div>
        </section>

      </div>

      {/* 🔥 LANGUAGE SELECTION MODAL (Premium Bottom Sheet) */}
      {showLangModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
          <div className={`w-full max-w-md rounded-t-[2.5rem] sm:rounded-3xl overflow-hidden flex flex-col max-h-[85vh] border shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 ${isDark ? "bg-[#151d2c] border-slate-800" : "bg-white border-gray-200"}`}>
            
            <div className={`w-full flex justify-center pt-3 pb-1`}>
              <div className={`w-12 h-1.5 rounded-full ${isDark ? "bg-slate-700" : "bg-gray-300"}`}></div>
            </div>

            <div className={`flex items-center justify-between px-6 py-5 border-b ${isDark ? "border-slate-800" : "border-gray-200"}`}>
              <div>
                <h2 className={`text-[20px] font-black tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>{t("language")}</h2>
                <p className={`text-[12px] mt-0.5 ${subTextClass}`}>Select your preferred app language</p>
              </div>
              <button onClick={() => setShowLangModal(false)} className={`p-2.5 rounded-full transition-colors ${isDark ? "bg-[#0A0F19] text-slate-400 hover:text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                <X size={20} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLanguage(l.code); setShowLangModal(false); }}
                  className={`w-full flex items-center justify-between p-4 mb-2 rounded-2xl transition-all duration-200 ${
                    lang === l.code 
                      ? (isDark ? "bg-[#ff6b00]/10 border-2 border-[#ff6b00]/50 shadow-sm" : "bg-orange-50 border-2 border-[#ff6b00] shadow-sm") 
                      : `border-2 border-transparent ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <span className={`text-[16px] font-bold ${lang === l.code ? "text-[#ff6b00]" : (isDark ? "text-slate-200" : "text-gray-800")}`}>
                      {l.native}
                    </span>
                    <span className={`text-[12px] font-medium mt-0.5 ${subTextClass}`}>{l.label}</span>
                  </div>
                  
                  {/* Premium Radio Button / Check */}
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    lang === l.code 
                      ? "border-[#ff6b00] bg-[#ff6b00] shadow-[0_0_10px_rgba(255,107,0,0.4)]" 
                      : (isDark ? "border-slate-600" : "border-gray-300")
                  }`}>
                    {lang === l.code && <Check size={14} className="text-white font-bold" strokeWidth={3} />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
        <Link href="/chat" className="bg-white text-red-600 font-bold text-[13px] px-5 py-2 rounded-full shadow-sm active:scale-95 transition-transform">
          {t("chatBtn")}
        </Link>
      </div>

    </main>
  );
}
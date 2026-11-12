// app/settings/page.tsx
"use client";

import { useState } from "react";
import { 
  ArrowLeft, Globe, ChevronRight, Clock, 
  Wallet, Headphones, Home, MessageCircle, Scroll, 
  HelpCircle, FileText, List, Shield, Mail, LogOut, Moon, Sun, PhoneCall, Check, Trash2, X, Loader2
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";
import { LANGUAGES } from "../../i18n"; 

export default function SettingsPage() {
  const { lang, setLanguage, theme, setTheme, me } = useApp();
  const [showLangModal, setShowLangModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isDark = theme === "dark";

  // 🔥 10 Languages Full Translation Helper
  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      hi: {
        header: "सेटिंग्स", edit: "एडिट", myOrders: "मेरे ऑर्डर्स", wallet: "वॉलेट", support: "सपोर्ट",
        explore: "एक्सप्लोर", home: "होम", chatGita: "ज्योतिषी से चैट करें", myKundli: "मेरी कुंडली",
        account: "अकाउंट", helpCenter: "हेल्प सेंटर (FAQ)", supportTicket: "सपोर्ट टिकट", walletTx: "वॉलेट ट्रांजैक्शन", orderHistory: "ऑर्डर हिस्ट्री",
        legalSupport: "कानूनी और सपोर्ट", privacy: "प्राइवेसी पॉलिसी", terms: "नियम और शर्तें", contactUs: "संपर्क करें",
        appSettings: "ऐप सेटिंग्स", theme: "थीम", light: "लाइट", dark: "डार्क", language: "भाषा", 
        logout: "लॉगआउट", loggingOut: "लॉगआउट हो रहा है...", deleteAccount: "अकाउंट डिलीट करें", deleting: "डिलीट हो रहा है...",
        bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "अभी बात करें - पहली चैट FREE", chatBtn: "चैट", guest: "गेस्ट यूजर", noEmail: "ईमेल उपलब्ध नहीं है", cancel: "रद्द करें", 
        deleteConfirm: "क्या आप वाकई अपना अकाउंट डिलीट करना चाहते हैं? आपका सारा डेटा और वॉलेट बैलेंस हमेशा के लिए चला जाएगा। यह वापस नहीं होगा।",
        dangerZone: "डेंजर ज़ोन", selectLanguage: "भाषा चुनें"
      },
      hinglish: {
        header: "SETTINGS", edit: "EDIT", myOrders: "My Orders", wallet: "Wallet", support: "Support",
        explore: "EXPLORE", home: "Home", chatGita: "Chat with Astrologer", myKundli: "My Kundli",
        account: "ACCOUNT", helpCenter: "Help Center (FAQ)", supportTicket: "Support Ticket", walletTx: "Wallet Transactions", orderHistory: "Order History",
        legalSupport: "LEGAL & SUPPORT", privacy: "Privacy Policy", terms: "Terms of Service", contactUs: "Contact Us",
        appSettings: "APP SETTINGS", theme: "Theme", light: "Light", dark: "Dark", language: "Language", 
        logout: "Logout", loggingOut: "Logging out...", deleteAccount: "Delete Account", deleting: "Deleting...",
        bannerTitle: "ASTROLOGER - 24X7 AVAILABLE", bannerSub: "Talk Now -- First Chat FREE", chatBtn: "Chat", guest: "Guest User", noEmail: "No email available", cancel: "Cancel", 
        deleteConfirm: "Are you sure you want to delete your account? All your data and wallet balance will be permanently lost. This cannot be undone.",
        dangerZone: "DANGER ZONE", selectLanguage: "Select Language"
      },
      en: {
        header: "SETTINGS", edit: "EDIT", myOrders: "My Orders", wallet: "Wallet", support: "Support",
        explore: "EXPLORE", home: "Home", chatGita: "Chat with Astrologer", myKundli: "My Kundli",
        account: "ACCOUNT", helpCenter: "Help Center (FAQ)", supportTicket: "Support Ticket", walletTx: "Wallet Transactions", orderHistory: "Order History",
        legalSupport: "LEGAL & SUPPORT", privacy: "Privacy Policy", terms: "Terms of Service", contactUs: "Contact Us",
        appSettings: "APP SETTINGS", theme: "Theme", light: "Light", dark: "Dark", language: "Language", 
        logout: "Logout", loggingOut: "Logging out...", deleteAccount: "Delete Account", deleting: "Deleting...",
        bannerTitle: "ASTROLOGER - 24X7 AVAILABLE", bannerSub: "Talk Now -- First Chat FREE", chatBtn: "Chat", guest: "Guest User", noEmail: "No email available", cancel: "Cancel", 
        deleteConfirm: "Are you sure you want to delete your account? All your data and wallet balance will be permanently lost. This cannot be undone.",
        dangerZone: "DANGER ZONE", selectLanguage: "Select Language"
      },
      te: {
        header: "సెట్టింగ్‌లు", edit: "సవరించండి", myOrders: "నా ఆర్డర్లు", wallet: "వాలెట్", support: "మద్దతు",
        explore: "అన్వేషించండి", home: "హోమ్", chatGita: "జ్యోతిష్యుడితో చాట్ చేయండి", myKundli: "నా కుండలి",
        account: "ఖాతా", helpCenter: "సహాయ కేంద్రం (FAQ)", supportTicket: "మద్దతు టికెట్", walletTx: "వాలెట్ లావాదేవీలు", orderHistory: "ఆర్డర్ చరిత్ర",
        legalSupport: "చట్టపరమైన & మద్దతు", privacy: "గోప్యతా విధానం", terms: "సేవా నిబంధనలు", contactUs: "మమ్మల్ని సంప్రదించండి",
        appSettings: "యాప్ సెట్టింగ్స్", theme: "థీమ్", light: "లైట్", dark: "డార్క్", language: "భాష", 
        logout: "లాగ్ అవుట్", loggingOut: "లాగ్ అవుట్ అవుతోంది...", deleteAccount: "ఖాతా తొలగించండి", deleting: "తొలగిస్తోంది...",
        bannerTitle: "జ్యోతిష్యుడు - 24x7 అందుబాటులో", bannerSub: "ఇప్పుడే మాట్లాడండి - మొదటి చాట్ ఉచితం", chatBtn: "చాట్", guest: "గెస్ట్ యూజర్", noEmail: "ఇమెయిల్ అందుబాటులో లేదు", cancel: "రద్దు చేయండి", 
        deleteConfirm: "మీరు ఖాతాను తొలగించాలనుకుంటున్నారా? మీ డేటా మరియు వాలెట్ బ్యాలెన్స్ శాశ్వతంగా పోతాయి. ఇది వెనక్కి తీసుకోలేరు.",
        dangerZone: "డేంజర్ జోన్", selectLanguage: "భాషను ఎంచుకోండి"
      },
      ta: {
        header: "அமைப்புகள்", edit: "திருத்து", myOrders: "எனது ஆர்டர்கள்", wallet: "பணப்பை", support: "ஆதரவு",
        explore: "ஆராயுங்கள்", home: "முகப்பு", chatGita: "ஜோதிடருடன் அரட்டையடிக்கவும்", myKundli: "எனது ஜாதகம்",
        account: "கணக்கு", helpCenter: "உதவி மையம் (FAQ)", supportTicket: "ஆதரவு டிக்கெட்", walletTx: "பணப்பை பரிவர்த்தனைகள்", orderHistory: "ஆர்டர் வரலாறு",
        legalSupport: "சட்டப்பூர்வ & ஆதரவு", privacy: "தனியுரிமைக் கொள்கை", terms: "சேவை விதிமுறைகள்", contactUs: "எங்களைத் தொடர்பு கொள்ள",
        appSettings: "செயலி அமைப்புகள்", theme: "தீம்", light: "ஒளி", dark: "இருள்", language: "மொழி", 
        logout: "வெளியேறு", loggingOut: "வெளியேறுகிறது...", deleteAccount: "கணக்கை நீக்கு", deleting: "நீக்குகிறது...",
        bannerTitle: "ஜோதிடர் - 24x7 கிடைக்கும்", bannerSub: "இப்போது பேசுங்கள் - முதல் அரட்டை இலவசம்", chatBtn: "அரட்டை", guest: "விருந்தினர்", noEmail: "மின்னஞ்சல் இல்லை", cancel: "ரத்து செய்", 
        deleteConfirm: "உங்கள் கணக்கை நீக்க விரும்புகிறீர்களா? உங்கள் தரவு மற்றும் பணப்பை இருப்பு நிரந்தரமாகப் போகும். இதை மீண்டும் பெற முடியாது.",
        dangerZone: "ஆபத்து மண்டலம்", selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்"
      },
      kn: {
        header: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು", edit: "ಸಂಪಾದಿಸಿ", myOrders: "ನನ್ನ ಆರ್ಡರ್ಗಳು", wallet: "ವಾಲೆಟ್", support: "ಬೆಂಬಲ",
        explore: "ಅನ್ವೇಷಿಸಿ", home: "ಮುಖಪುಟ", chatGita: "ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ", myKundli: "ನನ್ನ ಕುಂಡಲಿ",
        account: "ಖಾತೆ", helpCenter: "ಸಹಾಯ ಕೇಂದ್ರ (FAQ)", supportTicket: "ಬೆಂಬಲ ಟಿಕೆಟ್", walletTx: "ವಾಲೆಟ್ ವಹಿವಾಟುಗಳು", orderHistory: "ಆರ್ಡರ್ ಇತಿಹಾಸ",
        legalSupport: "ಕಾನೂನು ಮತ್ತು ಬೆಂಬಲ", privacy: "ಗೋಪ್ಯತಾ ನೀತಿ", terms: "ಸೇವಾ ನಿಯಮಗಳು", contactUs: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ",
        appSettings: "ಆ್ಯಪ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು", theme: "ಥೀಮ್", light: "ಬೆಳಕು", dark: "ಕತ್ತಲೆ", language: "ಭಾಷೆ", 
        logout: "ಲಾಗ್ ಔಟ್", loggingOut: "ಲಾಗ್ ಔಟ್ ಆಗುತ್ತಿದೆ...", deleteAccount: "ಖಾತೆ ಅಳಿಸಿ", deleting: "ಅಳಿಸಲಾಗುತ್ತಿದೆ...",
        bannerTitle: "ಜ್ಯೋತಿಷಿ - 24x7 ಲಭ್ಯವಿದೆ", bannerSub: "ಈಗ ಮಾತನಾಡಿ - ಮೊದಲ ಚಾಟ್ ಉಚಿತ", chatBtn: "ಚಾಟ್", guest: "ಅತಿಥಿ", noEmail: "ಇಮೇಲ್ ಲಭ್ಯವಿಲ್ಲ", cancel: "ರದ್ದುಮಾಡಿ", 
        deleteConfirm: "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ? ನಿಮ್ಮ ಎಲ್ಲಾ ಡೇಟಾ ಮತ್ತು ವಾಲೆಟ್ ಬ್ಯಾಲೆನ್ಸ್ ಶಾಶ್ವತವಾಗಿ ಹೋಗುತ್ತದೆ. ಇದನ್ನು ರದ್ದುಗೊಳಿಸಲಾಗುವುದಿಲ್ಲ.",
        dangerZone: "ಅಪಾಯದ ವಲಯ", selectLanguage: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ"
      },
      bn: {
        header: "সেটিংস", edit: "সম্পাদনা", myOrders: "আমার অর্ডার", wallet: "ওয়ালেট", support: "সমর্থন",
        explore: "অন্বেষণ করুন", home: "হোম", chatGita: "জ্যোতিষীর সাথে চ্যাট করুন", myKundli: "আমার কুণ্ডলী",
        account: "অ্যাকাউন্ট", helpCenter: "সহায়তা কেন্দ্র (FAQ)", supportTicket: "সমর্থন টিকিট", walletTx: "ওয়ালেট লেনদেন", orderHistory: "অর্ডার ইতিহাস",
        legalSupport: "আইনি ও সমর্থন", privacy: "গোপনীয়তা নীতি", terms: "পরিষেবার শর্তাবলী", contactUs: "যোগাযোগ করুন",
        appSettings: "অ্যাপ সেটিংস", theme: "থিম", light: "হালকা", dark: "অন্ধকার", language: "ভাষা", 
        logout: "লগ আউট", loggingOut: "লগ আউট হচ্ছে...", deleteAccount: "অ্যাকাউন্ট মুছুন", deleting: "মুছে ফেলা হচ্ছে...",
        bannerTitle: "জ্যোতিষী - 24x7 উপলব্ধ", bannerSub: "এখনই কথা বলুন - প্রথম চ্যাট ফ্রি", chatBtn: "চ্যাট", guest: "গেস্ট ইউজার", noEmail: "কোনো ইমেল নেই", cancel: "বাতিল করুন", 
        deleteConfirm: "আপনি কি সত্যিই আপনার অ্যাকাউন্ট মুছে ফেলতে চান? আপনার সমস্ত ডেটা এবং ওয়ালেট ব্যালেন্স স্থায়ীভাবে হারিয়ে যাবে। এটি ফিরিয়ে আনা যাবে না।",
        dangerZone: "ডেঞ্জার জোন", selectLanguage: "ভাষা নির্বাচন করুন"
      },
      mr: {
        header: "सेटिंग्ज", edit: "संपादित करा", myOrders: "माझ्या ऑर्डर्स", wallet: "वॉलेट", support: "समर्थन",
        explore: "एक्सप्लोर करा", home: "होम", chatGita: "ज्योतिषांशी चॅट करा", myKundli: "माझी कुंडली",
        account: "खाते", helpCenter: "मदत केंद्र (FAQ)", supportTicket: "समर्थन तिकीट", walletTx: "वॉलेट व्यवहार", orderHistory: "ऑर्डर इतिहास",
        legalSupport: "कायदेशीर आणि समर्थन", privacy: "गोपनीयता धोरण", terms: "सेवा अटी", contactUs: "आमच्याशी संपर्क साधा",
        appSettings: "अ‍ॅप सेटिंग्ज", theme: "थीम", light: "प्रकाश", dark: "गडद", language: "भाषा", 
        logout: "लॉग आउट", loggingOut: "लॉग आउट होत आहे...", deleteAccount: "खाते हटवा", deleting: "हटवत आहे...",
        bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "आता बोला - पहिली चॅट मोफत", chatBtn: "चॅट", guest: "गेस्ट यूजर", noEmail: "ईमेल उपलब्ध नाही", cancel: "रद्द करा", 
        deleteConfirm: "तुम्हाला तुमचे खाते हटवायचे आहे का? तुमचा सर्व डेटा आणि वॉलेट बॅलन्स कायमचा जाईल. हे पूर्ववत केले जाऊ शकत नाही.",
        dangerZone: "धोक्याचा विभाग", selectLanguage: "भाषा निवडा"
      },
      gu: {
        header: "સેટિંગ્સ", edit: "સંપાદિત કરો", myOrders: "મારા ઓર્ડર્સ", wallet: "વોલેટ", support: "સપોર્ટ",
        explore: "એક્સપ્લોર કરો", home: "હોમ", chatGita: "જ્યોતિષી સાથે ચેટ કરો", myKundli: "મારી કુંડળી",
        account: "એકાઉન્ટ", helpCenter: "મદદ કેન્દ્ર (FAQ)", supportTicket: "સપોર્ટ ટિકિટ", walletTx: "વોલેટ વ્યવહારો", orderHistory: "ઓર્ડર ઇતિહાસ",
        legalSupport: "કાનૂની અને સપોર્ટ", privacy: "ગોપનીયતા નીતિ", terms: "સેવાની શરતો", contactUs: "અમારો સંપર્ક કરો",
        appSettings: "એપ સેટિંગ્સ", theme: "થીમ", light: "લાઇટ", dark: "ડાર્ક", language: "ભાષા", 
        logout: "લોગ આઉટ", loggingOut: "લોગ આઉટ થઈ રહ્યું છે...", deleteAccount: "એકાઉન્ટ કાઢી નાખો", deleting: "કાઢી નાખી રહ્યું છે...",
        bannerTitle: "જ્યોતિષી - 24x7 ઉપલબ્ધ", bannerSub: "હમણાં વાત કરો - પ્રથમ ચેટ મફત", chatBtn: "ચેટ", guest: "ગેસ્ટ યુઝર", noEmail: "કોઈ ઇમેઇલ નથી", cancel: "રદ કરો", 
        deleteConfirm: "શું તમે ખરેખર તમારું એકાઉન્ટ કાઢી નાખવા માંગો છો? તમારો બધો ડેટા અને વોલેટ બેલેન્સ કાયમ માટે જતા રહેશે. આ પૂર્વવત્ કરી શકાશે નહીં.",
        dangerZone: "ડેન્જર ઝોન", selectLanguage: "ભાષા પસંદ કરો"
      },
      ml: {
        header: "ക്രമീകരണങ്ങൾ", edit: "എഡിറ്റ് ചെയ്യുക", myOrders: "എന്റെ ഓർഡറുകൾ", wallet: "വാലറ്റ്", support: "പിന്തുണ",
        explore: "പര്യവേക്ഷണം ചെയ്യുക", home: "ഹോം", chatGita: "ജ്യോതിഷിയുമായി ചാറ്റ് ചെയ്യുക", myKundli: "എന്റെ കുണ്ഡലി",
        account: "അക്കൗണ്ട്", helpCenter: "സഹായ കേന്ദ്രം (FAQ)", supportTicket: "പിന്തുണ ടിക്കറ്റ്", walletTx: "വാലറ്റ് ഇടപാടുകൾ", orderHistory: "ഓർഡർ ചരിത്രം",
        legalSupport: "നിയമപരവും പിന്തുണയും", privacy: "സ്വകാര്യതാ നയം", terms: "സേവന നിബന്ധനകൾ", contactUs: "ബന്ധപ്പെടുക",
        appSettings: "ആപ്പ് ക്രമീകരണങ്ങൾ", theme: "തീം", light: "ലൈറ്റ്", dark: "ഡാർക്ക്", language: "ഭാഷ", 
        logout: "ലോഗ് ഔട്ട്", loggingOut: "ലോഗ് ഔട്ട് ചെയ്യുന്നു...", deleteAccount: "അക്കൗണ്ട് ഇല്ലാതാക്കുക", deleting: "ഇല്ലാതാക്കുന്നു...",
        bannerTitle: "ജ്യോതിഷി - 24x7 ലഭ്യമാണ്", bannerSub: "ഇപ്പോൾ സംസാരിക്കുക - ആദ്യ ചാറ്റ് സൗജന്യം", chatBtn: "ചാറ്റ്", guest: "ഗസ്റ്റ് യൂസർ", noEmail: "ഇമെയിൽ ലഭ്യമല്ല", cancel: "റദ്ദാക്കുക", 
        deleteConfirm: "നിങ്ങളുടെ അക്കൗണ്ട് ഇല്ലാതാക്കാൻ ആഗ്രഹിക്കുന്നുണ്ടോ? നിങ്ങളുടെ എല്ലാ ഡാറ്റയും വാലറ്റ് ബാലൻസും എന്നെന്നേക്കുമായി പോകും. ഇത് പഴയപടിയാക്കാൻ കഴിയില്ല.",
        dangerZone: "ഡേഞ്ചർ സോൺ", selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക"
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

  // 🔥 SECURE LOGOUT LOGIC
  const handleLogout = async () => {
    if (window.confirm(t("logout") + "?")) {
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

  // 🔥 DELETE ACCOUNT LOGIC (Premium UX)
  const handleDeleteAccount = async () => {
    if (window.confirm(t("deleteConfirm"))) {
      setIsDeleting(true);
      try {
        // Future API Integration Note:
        // await fetch("/api/user/delete", { method: "DELETE" });
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        localStorage.clear();
        window.location.href = "/login";
      } catch (error) {
        alert("Failed to delete account. Please contact support.");
        setIsDeleting(false);
      }
    }
  };

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
                <button onClick={() => setTheme("dark")} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] font-medium rounded-lg transition-colors ${isDark ? "bg-[#2e3a4e] text-white shadow-sm" : "text-gray-500 hover:text-black"}`}>
                  <Moon size={14} /> {t("dark")}
                </button>
              </div>
            </div>

            {/* Language Selector Trigger */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe size={16} className="text-[#ff6b00]" />
                <span className={`text-[13px] font-semibold ${textColorClass}`}>{t("language")}</span>
              </div>
              <button 
                onClick={() => setShowLangModal(true)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-colors ${isDark ? "bg-[#0A0F19] border-slate-700 hover:border-slate-500 text-white" : "bg-gray-50 border-gray-200 hover:border-orange-300 text-gray-800"}`}
              >
                <span className="text-[13px] font-medium">{currentLangLabel}</span>
                <ChevronRight size={16} className={subTextClass} />
              </button>
            </div>

          </div>
        </section>

        {/* 🔥 DANGER ZONE (Premium Apps Standard) */}
        <section>
          <h3 className={`text-[10px] font-bold uppercase tracking-widest mb-2 px-1 text-rose-500`}>{t("dangerZone")}</h3>
          <div className={`rounded-2xl border border-rose-500/20 overflow-hidden ${isDark ? "bg-[#151d2c]" : "bg-white"}`}>
            
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut || isDeleting}
              className={`w-full flex items-center justify-between p-4 border-b transition-colors ${isDark ? "border-slate-800/50 hover:bg-rose-500/5" : "border-gray-100 hover:bg-rose-50"}`}
            >
              <div className="flex items-center gap-3">
                {isLoggingOut ? <Loader2 size={18} className="animate-spin text-rose-500" /> : <LogOut size={18} className="text-rose-500" />}
                <span className="text-[13px] font-bold text-rose-500">{isLoggingOut ? t("loggingOut") : t("logout")}</span>
              </div>
            </button>

            <button 
              onClick={handleDeleteAccount}
              disabled={isLoggingOut || isDeleting}
              className={`w-full flex items-center justify-between p-4 transition-colors ${isDark ? "hover:bg-rose-500/5" : "hover:bg-rose-50"}`}
            >
              <div className="flex items-center gap-3">
                {isDeleting ? <Loader2 size={18} className="animate-spin text-rose-500" /> : <Trash2 size={18} className="text-rose-500" />}
                <span className="text-[13px] font-bold text-rose-500">{isDeleting ? t("deleting") : t("deleteAccount")}</span>
              </div>
            </button>
            
          </div>
        </section>

      </div>

      {/* LANGUAGE SELECTION MODAL */}
      {showLangModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-sm overflow-hidden rounded-3xl border shadow-2xl animate-in zoom-in-95 ${cardClass}`}>
            
            <div className={`border-b px-5 py-4 text-center flex items-center justify-between ${isDark ? "border-slate-800" : "border-gray-200"}`}>
              <h2 className={`text-[16px] font-bold flex-1 text-left ${textColorClass}`}>{t("selectLanguage")}</h2>
              <button type="button" onClick={() => setShowLangModal(false)} className={`p-2 rounded-full transition-colors ${isDark ? "bg-[#0A0F19] text-slate-400 hover:text-white" : "bg-gray-100 text-gray-500 hover:text-black"}`}>
                <X size={18} />
              </button>
            </div>

            <div className="p-3 max-h-[60vh] overflow-y-auto custom-scrollbar flex flex-col gap-1.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setShowLangModal(false);
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    lang === l.code 
                      ? "bg-[#ff6b00] text-white border-[#ff6b00] shadow-md" 
                      : isDark ? "bg-[#0A0F19] text-slate-300 border-transparent hover:bg-slate-800" : "bg-gray-50 text-gray-700 border-transparent hover:bg-gray-100"
                  }`}
                >
                  <span className="text-[14px] font-semibold">{l.native}</span>
                  {lang === l.code && <Check size={18} />}
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
        <Link href="/chat" className="bg-white text-red-600 font-bold text-[13px] px-5 py-2 rounded-full shadow-sm active:scale-95">
          {t("chatBtn")}
        </Link>
      </div>

    </main>
  );
}
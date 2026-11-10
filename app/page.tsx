// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useApp } from "./Providers";
import {
  Home, MessageCircle, Sun, CalendarDays, User, Star, Eye, Settings,
  Sparkles, Hand, ScanFace, Heart, Scroll, ShieldCheck, Lock, CheckCircle
} from "lucide-react";
import Link from "next/link";

// 🔥 10 Language Translation Helper
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: {
      appName: "गीता टॉक", specialOffer: "स्पेशल ऑफर", freeChat: "पहली चैट फ्री 🎉", heroSub: "4 एक्सपर्ट ज्योतिषी • तुरंत जवाब • 100% गोपनीयता", startFreeChat: "फ्री चैट शुरू करें", 
      secure: "100% सुरक्षित", private: "प्राइवेट चैट", experts: "वेरिफाइड एक्सपर्ट", freeTools: "फ्री टूल्स", 
      kundli: "कुंडली", matching: "मिलान", horoscope: "राशिफल", panchang: "पंचांग", palmistry: "हस्तरेखा", faceReading: "फेस रीडिंग", 
      talkTo: "ज्योतिषियों से बात करें", online: "ऑनलाइन", poweredBy: "AI + वैदिक ज्ञान द्वारा संचालित", chatNow: "चैट करें", 
      home: "होम", chat: "चैट", daily: "दैनिक", profile: "प्रोफाइल", 
      stickyTitle: "ज्योतिषी • 24x7 उपलब्ध", stickySub: "अभी बात करें — पहली चैट FREE", chatBtn: "चैट"
    },
    hinglish: {
      appName: "GitaTalk", specialOffer: "Special Offer", freeChat: "First Chat FREE 🎉", heroSub: "4 expert Astrologers • Instant replies • 100% Privacy", startFreeChat: "Start Free Chat", 
      secure: "100% Secure", private: "Private Chat", experts: "Verified Experts", freeTools: "Free Tools", 
      kundli: "Kundli", matching: "Matching", horoscope: "Horoscope", panchang: "Panchang", palmistry: "Palmistry", faceReading: "Face Reading", 
      talkTo: "Talk to Astrologers", online: "Online", poweredBy: "Powered by Advanced AI + Vedic Knowledge", chatNow: "Chat Now", 
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile", 
      stickyTitle: "Astrologer • 24x7 Available", stickySub: "Talk Now — First Chat FREE", chatBtn: "Chat"
    },
    en: {
      appName: "GitaTalk", specialOffer: "Special Offer", freeChat: "First Chat FREE 🎉", heroSub: "4 expert Astrologers • Instant replies • 100% Privacy", startFreeChat: "Start Free Chat", 
      secure: "100% Secure", private: "Private Chat", experts: "Verified Experts", freeTools: "Free Tools", 
      kundli: "Kundli", matching: "Matching", horoscope: "Horoscope", panchang: "Panchang", palmistry: "Palmistry", faceReading: "Face Reading", 
      talkTo: "Talk to Astrologers", online: "Online", poweredBy: "Powered by Advanced AI + Vedic Knowledge", chatNow: "Chat Now", 
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile", 
      stickyTitle: "Astrologer • 24x7 Available", stickySub: "Talk Now — First Chat FREE", chatBtn: "Chat"
    },
    te: {
      appName: "గీతా టాక్", specialOffer: "ప్రత్యేక ఆఫర్", freeChat: "మొదటి చాట్ ఉచితం 🎉", heroSub: "4 నిపుణుల జ్యోతిష్యులు • తక్షణ సమాధానాలు • 100% గోప్యత", startFreeChat: "ఉచిత చాట్ ప్రారంభించండి", 
      secure: "100% సురక్షితం", private: "ప్రైవేట్ చాట్", experts: "ధృవీకరించబడిన నిపుణులు", freeTools: "ఉచిత సాధనాలు", 
      kundli: "కుండలి", matching: "మ్యాచింగ్", horoscope: "జాతకం", panchang: "పంచాంగం", palmistry: "పామిస్ట్రీ", faceReading: "ఫేస్ రీడింగ్", 
      talkTo: "జ్యోతిష్యులతో మాట్లాడండి", online: "ఆన్‌లైన్", poweredBy: "అడ్వాన్స్‌డ్ AI + వేద జ్ఞానం ద్వారా", chatNow: "చాట్ చేయండి", 
      home: "హోమ్", chat: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్", 
      stickyTitle: "జ్యోతిష్యుడు • 24x7 అందుబాటులో", stickySub: "ఇప్పుడే మాట్లాడండి — మొదటి చాట్ ఉచితం", chatBtn: "చాట్"
    },
    ta: {
      appName: "கீதா டாக்", specialOffer: "சிறப்பு சலுகை", freeChat: "முதல் அரட்டை இலவசம் 🎉", heroSub: "4 நிபுணர் ஜோதிடர்கள் • உடனடி பதில்கள் • 100% தனியுரிமை", startFreeChat: "இலவச அரட்டையைத் தொடங்கு", 
      secure: "100% பாதுகாப்பானது", private: "தனிப்பட்ட அரட்டை", experts: "சரிபார்க்கப்பட்ட நிபுணர்கள்", freeTools: "இலவச கருவிகள்", 
      kundli: "ஜாதகம்", matching: "பொருத்தம்", horoscope: "ராசிபலன்", panchang: "பஞ்சாங்கம்", palmistry: "கைரேகை", faceReading: "முக வாசிப்பு", 
      talkTo: "ஜோதிடர்களிடம் பேசுங்கள்", online: "ஆன்லைன்", poweredBy: "மேம்பட்ட AI + வேத அறிவு", chatNow: "அரட்டை", 
      home: "முகப்பு", chat: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்", 
      stickyTitle: "ஜோதிடர் • 24x7 கிடைக்கும்", stickySub: "இப்போது பேசுங்கள் — முதல் அரட்டை இலவசம்", chatBtn: "அரட்டை"
    },
    kn: {
      appName: "ಗೀತಾ ಟಾಕ್", specialOffer: "ವಿಶೇಷ ಕೊಡುಗೆ", freeChat: "ಮೊದಲ ಚಾಟ್ ಉಚಿತ 🎉", heroSub: "4 ತಜ್ಞ ಜ್ಯೋತಿಷಿಗಳು • ತ್ವರಿತ ಉತ್ತರಗಳು • 100% ಗೋಪ್ಯತೆ", startFreeChat: "ಉಚಿತ ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ", 
      secure: "100% ಸುರಕ್ಷಿತ", private: "ಖಾಸಗಿ ಚಾಟ್", experts: "ಪರಿಶೀಲಿಸಿದ ತಜ್ಞರು", freeTools: "ಉಚಿತ ಪರಿಕರಗಳು", 
      kundli: "ಕುಂಡಲಿ", matching: "ಹೊಂದಾಣಿಕೆ", horoscope: "ರಾಶಿಫಲ", panchang: "ಪಂಚಾಂಗ", palmistry: "ಹಸ್ತರೇಖೆ", faceReading: "ಮುಖ ಸ್ಪಷ್ಟನೆ", 
      talkTo: "ಜ್ಯೋತಿಷಿಗಳೊಂದಿಗೆ ಮಾತನಾಡಿ", online: "ಆನ್‌ಲೈನ್", poweredBy: "ಸುಧಾರಿತ AI + ವೈದಿಕ ಜ್ಞಾನ", chatNow: "ಚಾಟ್ ಮಾಡಿ", 
      home: "ಮುಖಪುಟ", chat: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್", 
      stickyTitle: "ಜ್ಯೋತಿಷಿ • 24x7 ಲಭ್ಯವಿದೆ", stickySub: "ಈಗ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ", chatBtn: "ಚಾಟ್"
    },
    bn: {
      appName: "গীতা টক", specialOffer: "বিশেষ অফার", freeChat: "প্রথম চ্যাট ফ্রি 🎉", heroSub: "4 জন বিশেষজ্ঞ জ্যোতিষী • তাত্ক্ষণিক উত্তর • 100% গোপনীয়তা", startFreeChat: "ফ্রি চ্যাট শুরু করুন", 
      secure: "100% সুরক্ষিত", private: "প্রাইভেট চ্যাট", experts: "যাচাইকৃত বিশেষজ্ঞ", freeTools: "ফ্রি টুলস", 
      kundli: "কুণ্ডলী", matching: "ম্যাচিং", horoscope: "রাশিফল", panchang: "পঞ্জিকা", palmistry: "হস্তরেখা", faceReading: "মুখ পাঠ", 
      talkTo: "জ্যোতিষীদের সাথে কথা বলুন", online: "অনলাইন", poweredBy: "অ্যাডভান্সড AI + বৈদিক জ্ঞান", chatNow: "চ্যাট করুন", 
      home: "হোম", chat: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল", 
      stickyTitle: "জ্যোতিষী • 24x7 উপলব্ধ", stickySub: "এখনই কথা বলুন — প্রথম চ্যাট ফ্রি", chatBtn: "চ্যাট"
    },
    mr: {
      appName: "गीता टॉक", specialOffer: "विशेष ऑफर", freeChat: "पहिली चॅट मोफत 🎉", heroSub: "4 तज्ञ ज्योतिषी • त्वरित उत्तरे • 100% गोपनीयता", startFreeChat: "मोफत चॅट सुरू करा", 
      secure: "100% सुरक्षित", private: "खाजगी चॅट", experts: "सत्यापित तज्ञ", freeTools: "मोफत साधने", 
      kundli: "कुंडली", matching: "जुळणी", horoscope: "राशीभविष्य", panchang: "पंचांग", palmistry: "हस्तरेषा", faceReading: "चेहरा वाचन", 
      talkTo: "ज्योतिषांशी बोला", online: "ऑनलाइन", poweredBy: "प्रगत AI + वैदिक ज्ञान", chatNow: "चॅट करा", 
      home: "होम", chat: "चॅट", daily: "दैनिक", profile: "प्रोफाइल", 
      stickyTitle: "ज्योतिषी • 24x7 उपलब्ध", stickySub: "आता बोला — पहिली चॅट मोफत", chatBtn: "चॅट"
    },
    gu: {
      appName: "ગીતા ટોક", specialOffer: "ખાસ ઑફર", freeChat: "પ્રથમ ચેટ મફત 🎉", heroSub: "4 નિષ્ણાત જ્યોતિષીઓ • તાત્કાલિક જવાબો • 100% ગોપનીયતા", startFreeChat: "મફત ચેટ શરૂ કરો", 
      secure: "100% સુરક્ષિત", private: "ખાનગી ચેટ", experts: "ચકાસાયેલ નિષ્ણાતો", freeTools: "મફત સાધનો", 
      kundli: "કુંડળી", matching: "મેચિંગ", horoscope: "રાશિફળ", panchang: "પંચાંગ", palmistry: "હસ્તરેખા", faceReading: "ચહેરો વાંચન", 
      talkTo: "જ્યોતિષીઓ સાથે વાત કરો", online: "ઓનલાઇન", poweredBy: "અદ્યતન AI + વૈદિક જ્ઞાન", chatNow: "ચેટ કરો", 
      home: "હોમ", chat: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ", 
      stickyTitle: "જ્યોતિષી • 24x7 ઉપલબ્ધ", stickySub: "હમણાં વાત કરો — પ્રથમ ચેટ મફત", chatBtn: "ચેટ"
    },
    ml: {
      appName: "ഗീത ടോക്ക്", specialOffer: "പ്രത്യേക ഓഫർ", freeChat: "ആദ്യ ചാറ്റ് സൗജന്യം 🎉", heroSub: "4 വിദഗ്ദ്ധ ജ്യോതിഷികൾ • തൽക്ഷണ മറുപടികൾ • 100% സ്വകാര്യത", startFreeChat: "സൗജന്യ ചാറ്റ് ആരംഭിക്കുക", 
      secure: "100% സുരക്ഷിതം", private: "സ്വകാര്യ ചാറ്റ്", experts: "പരിശോധിച്ച വിദഗ്ദ്ധർ", freeTools: "സൗജന്യ ടൂളുകൾ", 
      kundli: "കുണ്ഡലി", matching: "മാച്ചിംഗ്", horoscope: "രാശിഫലം", panchang: "പഞ്ചാംഗം", palmistry: "കൈരേഖ", faceReading: "മുഖ വായന", 
      talkTo: "ജ്യോതിഷികളുമായി സംസാരിക്കുക", online: "ഓൺലൈൻ", poweredBy: "വിപുലമായ AI + വേദ ജ്ഞാനം", chatNow: "ചാറ്റ് ചെയ്യുക", 
      home: "ഹോം", chat: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ", 
      stickyTitle: "ജ്യോതിഷി • 24x7 ലഭ്യമാണ്", stickySub: "ഇപ്പോൾ സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം", chatBtn: "ചാറ്റ്"
    },
  };
  return ui[lang]?.[key] || ui["en"][key];
};

type Astrologer = { id: string; name: string; specialty: string; rating: number; chats: string; experience: string; price: number; oldPrice: number; image: string; isCelebrity?: boolean; review: string; reviewer: string; };

const ASTROLOGERS: Astrologer[] = [
  { id: "gita", name: "Gita", specialty: "Tarot • Love & Relationship", rating: 4.9, chats: "12.4k+", experience: "5 Years", price: 19, oldPrice: 29, image: "/astrologers/riya.jpg", review: "Bohot tension mein thi breakup ke baad. Gita ji ne bilkul calm karke sab samjhaya. Paisa vasool consultation. Thank you so much di ❤️", reviewer: "Priya S." },
  { id: "kriti", name: "Acharya Kriti", specialty: "Vedic • Kundli", rating: 4.8, chats: "18.7k+", experience: "7 Years", price: 22, oldPrice: 35, image: "/astrologers/kriti.jpg", review: "Sach mein bahut relief mila. Job switch karna tha par dar lag raha tha. Kriti ji ne kundli dekh kar exact date batayi. Ab confidence hai. 🌟", reviewer: "Rahul Verma" },
  { id: "devaki", name: "Dr. Devaki Shastri", specialty: "Vedic • KP System", rating: 4.9, chats: "31k+", experience: "15 Years", price: 25, oldPrice: 45, image: "/astrologers/devaki.jpg", isCelebrity: true, review: "Devaki ma'am is really an expert. Rishta tootne wala tha, unhone remedies bataye aur sab thik ho gaya. Highly recommended.", reviewer: "Neha M." },
  { id: "gargi", name: "Gargi Maa", specialty: "Spiritual Healing • Vastu", rating: 4.95, chats: "42k+", experience: "25+ Years", price: 18, oldPrice: 30, image: "/astrologers/gargi.jpg", review: "Ghar me pichle 2 saal se bahut kalesh tha. Gargi maa ne simple upay bataye the, believe nahi ho raha par shanti aa gayi hai. Really grateful maa 🙏", reviewer: "Vikram R." },
];

export default function HomePage() {
  const { lang, theme, me, refresh } = useApp();
  const [activeTab, setActiveTab] = useState("home");

  const isDark = theme === "dark";
  const t = (key: string) => getUIText(lang, key);

  // 🔥 FIX: Dynamic Wallet Balance
  const walletBalanceRupees = (me?.user?.walletBalancePaise ?? 0) / 100;

  // 🔥 FIX: Refresh balance on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <main className={`min-h-screen w-full pb-44 transition-colors duration-300 ${isDark ? "bg-[#0B0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900"}`}>
      
      {/* PREMIUM HEADER */}
      <header className={`sticky top-0 z-40 flex items-center justify-between px-4 py-3 shadow-sm backdrop-blur-xl ${isDark ? "bg-[#0B0F19]/80 border-b border-white/5" : "bg-white/80 border-b border-gray-100"}`}>
        <div className="flex items-center gap-2">
          <img src="/icon-192.png" alt="Gita AI Logo" className="h-8 w-8 rounded-full object-cover shadow-md border-2 border-orange-500/20" />
          <span className="text-lg font-black tracking-tight">{t("appName")}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/settings" aria-label="Settings" className={`rounded-full p-2 transition-transform hover:scale-105 active:scale-95 ${isDark ? "bg-white/5 text-slate-300" : "bg-gray-100 text-gray-600"}`}>
            <Settings size={18} />
          </Link>
          
          {/* 🔥 FIXED WALLET BALANCE (Loading state) */}
          <Link href="/wallet" aria-label="Wallet Balance" className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold cursor-pointer transition-transform hover:scale-105 active:scale-95 border ${isDark ? "bg-slate-800 border-slate-700 text-amber-400" : "bg-orange-50 border-orange-200 text-orange-600"}`}>
            ₹{me?.user ? walletBalanceRupees : "..."}
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
              +
            </span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-xl space-y-7 px-4 py-5">
        
        {/* SEO Hidden H1 */}
        <h1 className="sr-only">GitaTalk - Online AI Astrologer, Kundli Matching & Daily Horoscope</h1>

        {/* PREMIUM HERO BANNER */}
        <section aria-label="Special Offer" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-6 text-white shadow-2xl shadow-orange-500/20">
          <div className="relative z-10 space-y-3">
            <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-orange-100">
              <Sparkles size={14} className="text-amber-300" /> {t("specialOffer")}
            </p>
            <h2 className="text-3xl font-black leading-tight">{t("freeChat")}</h2>
            <p className="text-xs font-medium text-orange-100 max-w-[80%]">{t("heroSub")}</p>
            <Link href="/chat" className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-black text-orange-600 shadow-lg transition-transform hover:scale-105 active:scale-95">
              {t("startFreeChat")} <ArrowRightIcon />
            </Link>
          </div>
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-10 right-10 h-32 w-32 rounded-full bg-yellow-300/30 blur-2xl" />
        </section>

        {/* PREMIUM TRUST BADGES */}
        <div className={`flex items-center justify-between rounded-2xl border px-3 py-3 shadow-sm ${isDark ? "border-white/5 bg-[#151E2E]" : "border-orange-100 bg-white"}`}>
          {[
            { icon: ShieldCheck, label: t("secure"), color: "text-emerald-500" },
            { icon: Lock, label: t("private"), color: "text-blue-500" },
            { icon: Star, label: t("experts"), color: "text-orange-500" }
          ].map((item, idx) => (
            <div key={idx} className={`flex flex-col items-center gap-1.5 text-center w-full ${idx !== 2 ? (isDark ? "border-r border-slate-700/50" : "border-r border-gray-100") : ""}`}>
              <item.icon size={20} className={item.color} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* PREMIUM FREE TOOLS */}
        <section aria-labelledby="free-tools-heading" className="space-y-3">
          <h2 id="free-tools-heading" className={`text-sm font-black uppercase tracking-wider ${isDark ? "text-slate-300" : "text-gray-700"}`}>
            {t("freeTools")}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: t("kundli"), icon: Scroll, href: "/kundli" },
              { name: t("matching"), icon: Heart, href: "/matching" },
              { name: t("horoscope"), icon: Sun, href: "/daily" },
              { name: t("panchang"), icon: CalendarDays, href: "/panchang" },
              { name: t("palmistry"), icon: Hand, href: "/palmistry" },
              { name: t("faceReading"), icon: ScanFace, href: "/face-reading" },
            ].map((tool, idx) => (
              <Link key={idx} href={tool.href} className={`group flex flex-col items-center justify-center gap-2.5 rounded-2xl border p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isDark ? "border-white/5 bg-[#151E2E] hover:bg-[#1A2436]" : "border-orange-100 bg-white hover:shadow-orange-100"}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-110 ${isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-600"}`}>
                  <tool.icon size={24} aria-hidden="true" />
                </div>
                <span className="text-xs font-bold">{tool.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* PREMIUM ASTROLOGER LIST */}
        <section aria-labelledby="astrologers-heading" className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <h2 id="astrologers-heading" className={`text-sm font-black uppercase tracking-wider ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                {t("talkTo")}
              </h2>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> {t("online")}
              </span>
            </div>
            <p className={`text-[10px] flex items-center gap-1.5 font-medium ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              <span className="bg-orange-500 text-white px-1.5 py-0.5 rounded text-[9px] font-black tracking-wide">AI</span>
              {t("poweredBy")}
            </p>
          </div>

          <div className="space-y-4">
            {ASTROLOGERS.map((astro) => (
              <article key={astro.id} className={`flex flex-col gap-3 rounded-3xl border p-4 shadow-sm transition-all hover:shadow-md ${isDark ? "border-white/5 bg-[#151E2E]" : "border-orange-100 bg-white"}`}>
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-[3px] border-orange-100/50 dark:border-slate-700">
                    <img src={astro.image} alt={`${astro.name}`} width={80} height={80} loading="lazy" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${astro.name}&background=f97316&color=fff`; }} />
                    <span className="absolute bottom-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 dark:border-[#151E2E]"></span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-bold">{astro.name}</h3>
                        {astro.isCelebrity && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-black text-amber-700 border border-amber-200">Celebrity</span>}
                      </div>
                      <p className={`text-[11px] font-semibold ${isDark ? "text-slate-400" : "text-gray-500"}`}>{astro.specialty}</p>
                      
                      <div className={`mt-1.5 flex items-center gap-2 text-[10px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                        <span className="flex items-center gap-0.5 text-amber-500"><Star size={10} fill="currentColor" /> {astro.rating}</span>
                        <span>• {astro.chats} chats</span>
                        <span>• {astro.experience}</span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-2">
                      <div>
                        <p className="text-[15px] font-black text-orange-500">
                          ₹{astro.price} <span className={`text-[10px] font-medium line-through ${isDark ? "text-slate-500" : "text-gray-400"}`}>₹{astro.oldPrice}</span>
                          <span className={`text-[10px] font-medium ${isDark ? "text-slate-500" : "text-gray-400"}`}> /min</span>
                        </p>
                      </div>
                      <Link href={`/chat/${astro.id}`} aria-label={`Chat with ${astro.name}`} className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2 text-xs font-black text-white shadow-md shadow-orange-500/20 transition-transform hover:scale-105 active:scale-95">
                        {t("chatNow")}
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* PREMIUM REVIEW SECTION */}
                <div className={`mt-1 rounded-2xl p-3 text-[11px] leading-relaxed border ${isDark ? "bg-slate-800/50 border-slate-700/50 text-slate-300" : "bg-orange-50/50 border-orange-100/50 text-gray-600"}`}>
                  <div className="flex items-center gap-1 mb-1.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="#F59E0B" className="text-amber-500" />)}
                    <span className="font-bold ml-1 opacity-80">- {astro.reviewer}</span>
                  </div>
                  <p className="italic font-medium">"{astro.review}"</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 🔥 SEO: Rich Text content for Google Crawler (Hidden from UI) 🔥 */}
        <section className="sr-only">
          <h2>About GitaTalk AI Astrology</h2>
          <p>
            GitaTalk is India's premium AI astrology platform. We offer 100% accurate online Kundli matching, free daily horoscope predictions, palmistry, and face reading. Our AI astrologers, including experts in Vedic astrology, Tarot, and KP System, provide instant remedies for career, marriage, and health issues. Start your first chat for free today.
          </p>
        </section>

      </div>

      {/* PREMIUM BOTTOM NAVIGATION */}
      <nav aria-label="Main Navigation" className={`fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t px-2 pb-safe pt-2 ${isDark ? "border-white/5 bg-[#0B0F19]/90 backdrop-blur-xl" : "border-gray-200 bg-white/90 backdrop-blur-xl"}`}>
        {[
          { id: "home", label: t("home"), icon: Home, href: "/" },
          { id: "chat", label: t("chat"), icon: MessageCircle, href: "/chat" },
          { id: "daily", label: t("daily"), icon: Sun, href: "/daily" },
          { id: "kundli", label: t("kundli"), icon: Scroll, href: "/kundli" },
          { id: "profile", label: t("profile"), icon: User, href: "/settings" },
        ].map((item) => (
          <Link key={item.id} href={item.href} aria-label={item.label} className={`flex flex-col items-center gap-1 p-1 transition-transform hover:-translate-y-1 ${activeTab === item.id ? "text-orange-500" : isDark ? "text-slate-500" : "text-gray-400"}`}>
            <item.icon size={20} className={activeTab === item.id ? "stroke-[2.5px]" : ""} />
            <span className="text-[9px] font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* FIXED RED BAR (Sticky CTA) */}
      <div className="fixed bottom-[68px] left-0 right-0 z-40 mx-auto max-w-xl px-3">
        <Link href="/chat" aria-label="Talk to Astrologer for Free" className="flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 px-4 py-2.5 text-white shadow-[0_10px_30px_rgba(225,29,72,0.4)] transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20"><MessageCircle size={16} /></span>
            <div className="leading-tight">
              <p className="text-[9px] font-black uppercase tracking-wider text-rose-100">{t("stickyTitle")}</p>
              <p className="text-xs font-black">{t("stickySub")}</p>
            </div>
          </div>
          <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-black text-rose-700">{t("chatBtn")}</span>
        </Link>
      </div>
    </main>
  );
}

// Small helper icon for hero CTA
function ArrowRightIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
}
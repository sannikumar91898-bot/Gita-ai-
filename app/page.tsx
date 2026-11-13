// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useApp } from "./Providers";
import {
  Home, MessageCircle, Sun, CalendarDays, User, Star, Settings,
  Sparkles, Hand, ScanFace, Heart, Scroll, Gem, Crown, ChevronRight
} from "lucide-react";
import Link from "next/link";

// 🔥 10 Languages Translation Helper
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: {
      appName: "गीता टॉक", specialOffer: "सर्वज्ञान असीम", freeChat: "पहली चैट फ्री 🎉", heroSub: "4 एक्सपर्ट ज्योतिषी • तुरंत जवाब • 100% गोपनीयता", startFreeChat: "फ्री चैट शुरू करें", 
      freeTools: "फ्री टूल्स", kundli: "कुंडली", matching: "मिलान", horoscope: "राशिफल", panchang: "पंचांग", palmistry: "हस्तरेखा", gemstone: "रत्न", faceReading: "चेहरा वाचन", 
      talkTo: "ज्योतिषियों से बात करें", online: "ऑनलाइन", chatNow: "चैट करें", 
      home: "होम", chat: "चैट", daily: "राशिफल", profile: "प्रोफाइल", 
      readMore: "और पढ़ें...", readLess: "कम पढ़ें...", min: "मिनट",
      stickyTitle: "ज्योतिषी - 24x7 उपलब्ध", stickySub: "अपने नाम करें – पहली चैट FREE",
      h1Text: "सर्वश्रेष्ठ AI ज्योतिषी और मुफ्त ऑनलाइन कुंडली"
    },
    hinglish: {
      appName: "GitaTalk", specialOffer: "Special Offer", freeChat: "First Chat FREE 🎉", heroSub: "4 expert Astrologers • Instant replies • 100% Privacy", startFreeChat: "Start Free Chat", 
      freeTools: "Free Tools", kundli: "Kundli", matching: "Matching", horoscope: "Rashifal", panchang: "Panchang", palmistry: "Palmistry", gemstone: "Gemstone", faceReading: "Face Reading", 
      talkTo: "Talk to Astrologers", online: "Online", chatNow: "Chat Now", 
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile", 
      readMore: "read more...", readLess: "read less...", min: "min",
      stickyTitle: "Astrologer - 24x7 Available", stickySub: "Make them yours – First Chat FREE",
      h1Text: "Best AI Astrologer & Free Online Kundli"
    },
    en: {
      appName: "GitaTalk", specialOffer: "Special Offer", freeChat: "First Chat FREE 🎉", heroSub: "4 expert Astrologers • Instant replies • 100% Privacy", startFreeChat: "Start Free Chat", 
      freeTools: "Free Tools", kundli: "Kundli", matching: "Matching", horoscope: "Horoscope", panchang: "Panchang", palmistry: "Palmistry", gemstone: "Gemstone", faceReading: "Face Reading", 
      talkTo: "Talk to Astrologers", online: "Online", chatNow: "Chat Now", 
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile", 
      readMore: "read more...", readLess: "read less...", min: "min",
      stickyTitle: "Astrologer - 24x7 Available", stickySub: "Make them yours – First Chat FREE",
      h1Text: "Best AI Astrologer & Free Online Kundli"
    },
    te: {
      appName: "గీతా టాక్", specialOffer: "ప్రత్యేక ఆఫర్", freeChat: "మొదటి చాట్ ఉచితం 🎉", heroSub: "4 నిపుణుల జ్యోతిష్యులు • తక్షణ సమాధానాలు • 100% గోప్యత", startFreeChat: "ఉచిత చాట్ ప్రారంభించండి", 
      freeTools: "ఉచిత సాధనాలు", kundli: "కుండలి", matching: "మ్యాచింగ్", horoscope: "రాశిఫలం", panchang: "పంచాంగం", palmistry: "పామిస్ట్రీ", gemstone: "రత్నం", faceReading: "ఫేస్ రీడింగ్", 
      talkTo: "జ్యోతిష్యులతో మాట్లాడండి", online: "ఆన్‌లైన్", chatNow: "చాట్ చేయండి", 
      home: "హోమ్", chat: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్", 
      readMore: "మరిన్ని చదవండి...", readLess: "తక్కువ చదవండి...", min: "నిమిషం",
      stickyTitle: "జ్యోతిష్యుడు • 24x7 అందుబాటులో", stickySub: "ఇప్పుడే మాట్లాడండి — మొదటి చాట్ ఉచితం",
      h1Text: "ఉత్తమ AI జ్యోతిష్యుడు & ఉచిత ఆన్‌లైన్ కుండలి"
    },
    ta: {
      appName: "கீதா டாக்", specialOffer: "சிறப்பு சலுகை", freeChat: "முதல் அரட்டை இலவசம் 🎉", heroSub: "4 நிபுணர் ஜோதிடர்கள் • உடனடி பதில்கள் • 100% தனியுரிமை", startFreeChat: "இலவச அரட்டையைத் தொடங்கு", 
      freeTools: "இலவச கருவிகள்", kundli: "ஜாதகம்", matching: "பொருத்தம்", horoscope: "ராசிபலன்", panchang: "பஞ்சாங்கம்", palmistry: "கைரேகை", gemstone: "ரத்தினம்", faceReading: "முக படிப்பு", 
      talkTo: "ஜோதிடர்களிடம் பேசுங்கள்", online: "ஆன்லைன்", chatNow: "அரட்டை", 
      home: "முகப்பு", chat: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்", 
      readMore: "மேலும் படிக்க...", readLess: "குறைவாக படிக்க...", min: "நிமிடம்",
      stickyTitle: "ஜோதிடர் • 24x7 கிடைக்கும்", stickySub: "இப்போது பேசுங்கள் — முதல் அரட்டை இலவசம்",
      h1Text: "சிறந்த AI ஜோதிடர் & இலவச ஆன்லைன் ஜாதகம்"
    },
    kn: {
      appName: "ಗೀತಾ ಟಾಕ್", specialOffer: "ವಿಶೇಷ ಕೊಡುಗೆ", freeChat: "ಮೊದಲ ಚಾಟ್ ಉಚಿತ 🎉", heroSub: "4 ತಜ್ಞ ಜ್ಯೋತಿಷಿಗಳು • ತ್ವರಿತ ಉತ್ತರಗಳು • 100% ಗೋಪ್ಯತೆ", startFreeChat: "ಉಚಿತ ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ", 
      freeTools: "ಉಚಿತ ಪರಿಕರಗಳು", kundli: "ಕುಂಡಲಿ", matching: "ಹೊಂದಾಣಿಕೆ", horoscope: "ರಾಶಿಫಲ", panchang: "ಪಂಚಾಂಗ", palmistry: "ಹಸ್ತರೇಖೆ", gemstone: "ರತ್ನ", faceReading: "ಮುಖ ಓದುವಿಕೆ", 
      talkTo: "ಜ್ಯೋತಿಷಿಗಳೊಂದಿಗೆ ಮಾತನಾಡಿ", online: "ಆನ್‌ಲೈನ್", chatNow: "ಚಾಟ್ ಮಾಡಿ", 
      home: "ಮುಖಪುಟ", chat: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್", 
      readMore: "ಮತ್ತಷ್ಟು ಓದಿ...", readLess: "ಕಡಿಮೆ ಓದಿ...", min: "ನಿಮಿಷ",
      stickyTitle: "ಜ್ಯೋತಿಷಿ • 24x7 ಲಭ್ಯವಿದೆ", stickySub: "ಈಗ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ",
      h1Text: "ಅತ್ಯುತ್ತಮ AI ಜ್ಯೋತಿಷಿ ಮತ್ತು ಉಚಿತ ಆನ್‌ಲೈನ್ ಕುಂಡಲಿ"
    },
    bn: {
      appName: "গীতা টক", specialOffer: "বিশেষ অফার", freeChat: "প্রথম চ্যাট ফ্রি 🎉", heroSub: "4 জন বিশেষজ্ঞ জ্যোতিষী • তাত্ক্ষণিক উত্তর • 100% গোপনীয়তা", startFreeChat: "ফ্রি চ্যাট শুরু করুন", 
      freeTools: "ফ্রি টুলস", kundli: "কুণ্ডলী", matching: "ম্যাচিং", horoscope: "রাশিফল", panchang: "পঞ্জিকা", palmistry: "হস্তরেখা", gemstone: "রত্ন", faceReading: "মুখ পাঠ", 
      talkTo: "জ্যোতিষীদের সাথে কথা বলুন", online: "অনলাইন", chatNow: "চ্যাট করুন", 
      home: "হোম", chat: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল", 
      readMore: "আরও পড়ুন...", readLess: "কম পড়ুন...", min: "মিনিট",
      stickyTitle: "জ্যোতিষী • 24x7 উপলব্ধ", stickySub: "এখনই কথা বলুন — প্রথম চ্যাট ফ্রি",
      h1Text: "সেরা AI জ্যোতিষী এবং বিনামূল্যে অনলাইন কুণ্ডলী"
    },
    mr: {
      appName: "गीता टॉक", specialOffer: "विशेष ऑफर", freeChat: "पहिली चॅट मोफत 🎉", heroSub: "4 तज्ञ ज्योतिषी • त्वरित उत्तरे • 100% गोपनीयता", startFreeChat: "मोफत चॅट सुरू करा", 
      freeTools: "मोफत साधने", kundli: "कुंडली", matching: "जुळणी", horoscope: "राशीभविष्य", panchang: "पंचांग", palmistry: "हस्तरेषा", gemstone: "रत्न", faceReading: "चेहरा वाचन", 
      talkTo: "ज्योतिषांशी बोला", online: "ऑनलाइन", chatNow: "चॅट करा", 
      home: "होम", chat: "चॅट", daily: "दैनिक", profile: "प्रोफाइल", 
      readMore: "अधिक वाचा...", readLess: "कमी वाचा...", min: "मिनिट",
      stickyTitle: "ज्योतिषी • 24x7 उपलब्ध", stickySub: "आता बोला — पहिली चॅट मोफत",
      h1Text: "सर्वोत्तम AI ज्योतिषी आणि विनामूल्य ऑनलाइन कुंडली"
    },
    gu: {
      appName: "ગીતા ટોક", specialOffer: "ખાસ ઑફર", freeChat: "પ્રથમ ચેટ મફત 🎉", heroSub: "4 નિષ્ણાત જ્યોતિષીઓ • તાત્કાલિક જવાબો • 100% ગોપનીયતા", startFreeChat: "મફત ચેટ શરૂ કરો", 
      freeTools: "મફત સાધનો", kundli: "કુંડળી", matching: "મેચિંગ", horoscope: "રાશિફળ", panchang: "પંચાંગ", palmistry: "હસ્તરેખા", gemstone: "રત્ન", faceReading: "ચહેરો વાંચન", 
      talkTo: "જ્યોતિષીઓ સાથે વાત કરો", online: "ઓનલાઇન", chatNow: "ચેટ કરો", 
      home: "હોમ", chat: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ", 
      readMore: "વધુ વાંચો...", readLess: "ઓછું વાંચો...", min: "મિનિટ",
      stickyTitle: "જ્યોતિષી • 24x7 ઉપલબ્ધ", stickySub: "હમણાં વાત કરો — પ્રથમ ચેટ મફત",
      h1Text: "શ્રેષ્ઠ AI જ્યોતિષી અને મફત ઓનલાઈન કુંડળી"
    },
    ml: {
      appName: "ഗീത ടോക്ക്", specialOffer: "പ്രത്യേക ഓഫർ", freeChat: "ആദ്യ ചാറ്റ് സൗജന്യം 🎉", heroSub: "4 വിദഗ്ദ്ധ ജ്യോതിഷികൾ • തൽക്ഷണ മറുപടികൾ • 100% സ്വകാര്യത", startFreeChat: "സൗജന്യ ചാറ്റ് ആരംഭിക്കുക", 
      freeTools: "സൗജന്യ ടൂളുകൾ", kundli: "കുണ്ഡലി", matching: "മാച്ചിംഗ്", horoscope: "രാശിഫലം", panchang: "പഞ്ചാംഗം", palmistry: "കൈരേഖ", gemstone: "രത്നം", faceReading: "മുഖ വായന", 
      talkTo: "ജ്യോതിഷികളുമായി സംസാരിക്കുക", online: "ഓൺലൈൻ", chatNow: "ചാറ്റ് ചെയ്യുക", 
      home: "ഹോം", chat: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ", 
      readMore: "കൂടുതൽ വായിക്കുക...", readLess: "കുറച്ച് വായിക്കുക...", min: "മിനിറ്റ്",
      stickyTitle: "ജ്യോതിഷി • 24x7 ലഭ്യമാണ്", stickySub: "ഇപ്പോൾ സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം",
      h1Text: "മികച്ച AI ജ്യോതിഷിയും സൗജന്യ ഓൺലൈൻ കുണ്ഡലിയും"
    },
  };
  return ui[lang]?.[key] || ui["en"][key] || ui["hi"][key];
};

type Review = { text: string; author: string; rating: number; };
type Astrologer = { 
  id: string; name: string; specialty: string; rating: number; 
  experience: string; price: number; image: string; isCelebrity?: boolean; reviews: Review[]; 
};

const ASTROLOGERS: Astrologer[] = [
  { id: "gita", name: "Gita", specialty: "Tarot • Love & Relationship", rating: 4.9, experience: "5 Years", price: 19, image: "/astrologers/riya.jpg", reviews: [{ text: "Bahot tension mein thi breakup ke baad. Gita ji ne bilkul calm karke sab samjhaya. Paisa vasool consultation. Thank you so much di ❤️", author: "Priya S.", rating: 5 }] },
  { id: "kriti", name: "Acharya Kriti", specialty: "Vedic • Kundli", rating: 4.8, experience: "7 Years", price: 22, image: "/astrologers/kriti.jpg", reviews: [{ text: "Sach mein bahut relief mila. Job switch karna tha par dar lag raha tha. Kriti ji ne kundli dekh kar exact date batayi. Ab confidence hai. 🌟", author: "Rahul Verma", rating: 5 }] },
  { id: "devaki", name: "Dr. Devaki Shastri", specialty: "Vedic • KP System", rating: 4.9, experience: "15 Years", price: 25, image: "/astrologers/devaki.jpg", isCelebrity: true, reviews: [{ text: "Devaki ma'am is really an expert. Rishta toothe wale tha, unhone remedies bataye aur sab thik ho gaya. Highly recommended.", author: "Neha M.", rating: 5 }] },
  { id: "gargi", name: "Gargi Maa", specialty: "Spiritual Healing • Vastu", rating: 4.9, experience: "25+ Years", price: 18, image: "/astrologers/gargi.jpg", reviews: [{ text: "Ghar me niche 2 saal se bahut kalesh tha. Gargi maa ne simple upay bataye the, believe nahi ho raha par shanti aa gayi hai. Really grateful maa 🙏", author: "Vikram R.", rating: 5 }] },
];

export default function HomePage() {
  const { lang, me, refresh, theme } = useApp(); 
  const isDark = theme === "dark"; 
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  
  const t = (key: string) => getUIText(lang || "hi", key);
  const walletBalanceRupees = (me?.user?.walletBalancePaise ?? 0) / 100;

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <main className="min-h-screen w-full pb-36 bg-[#070b14] text-slate-100 font-sans selection:bg-orange-500/30 flex flex-col">
      
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3.5 bg-[#070b14]/95 backdrop-blur-md border-b border-white/5 w-full">
        <div className="flex items-center gap-2.5">
          <img src="/icon-192.png" alt="Logo" className="h-[38px] w-[38px] rounded-full object-cover border border-orange-500/50" onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=G&background=ff6b00&color=fff'; }} />
          <span className="text-[20px] font-bold tracking-tight text-white">{t("appName")}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/settings" className="rounded-full p-2.5 bg-[#151d2c] text-slate-300 border border-slate-700 hover:bg-[#1f2937]">
            <Settings size={20} />
          </Link>
          
          <Link 
            href="/wallet" 
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[14px] font-bold border transition-colors ${
              isDark 
                ? "bg-[#151d2c] text-slate-200 border-slate-700 hover:bg-[#1f2937]" 
                : "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
            }`}
          >
            ₹{me?.user ? walletBalanceRupees : "0"} 
            <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#ff6b00] text-[12px] text-white ml-0.5">+</span>
          </Link>
        </div>
      </header>

      <div className="w-full flex-1 space-y-6 px-3 py-5">
        
        {/* HERO BANNER (SEO H1 FIXED) */}
        <section className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#FF6B00] via-[#FF3D00] to-[#B90000] p-6 shadow-xl min-h-[170px] flex flex-col justify-center w-full">
          
          <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[220px] h-[220px] opacity-70 pointer-events-none mix-blend-screen">
            <svg viewBox="0 0 100 100" fill="none" stroke="#FFD700" strokeWidth="0.8" className="drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
              <circle cx="50" cy="50" r="45" strokeWidth="1" />
              <circle cx="50" cy="50" r="35" />
              <circle cx="50" cy="50" r="20" />
              <circle cx="50" cy="50" r="5" fill="#FFD700" />
              {[...Array(12)].map((_, i) => (
                <line key={i} x1="50" y1="5" x2="50" y2="95" transform={`rotate(${i * 30} 50 50)`} />
              ))}
            </svg>
          </div>
          <div className="absolute right-0 top-0 w-[60%] h-full bg-gradient-to-l from-orange-400/30 to-transparent blur-xl pointer-events-none"></div>

          <div className="relative z-10 space-y-2 w-[85%] sm:w-[75%]">
            <p className="flex items-center gap-1.5 text-[12px] font-semibold text-orange-100">
              <Sparkles size={14} className="text-amber-200" /> {t("specialOffer")}
            </p>
            
            {/* 🔥 SEO FIX: H1 Tag Added Here */}
            <h1 className="text-[26px] sm:text-[32px] font-black leading-tight text-white tracking-tight">
              {t("h1Text")}
            </h1>
            
            <p className="text-[13px] font-medium text-orange-100/90 leading-snug">
              <span className="bg-white/20 px-2 py-0.5 rounded mr-1">{t("freeChat")}</span> 
              {t("heroSub")}
            </p>
            <div className="pt-3">
              <Link href="/chat" className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[13.5px] font-extrabold text-[#FF3D00] shadow-md transition-transform active:scale-95">
                {t("startFreeChat")} <ChevronRight size={16} strokeWidth={3} />
              </Link>
            </div>
          </div>
        </section>

        {/* FREE TOOLS */}
        <section className="space-y-3.5 pt-1 w-full">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-5 bg-[#ff6b00] rounded-full"></div>
              <h2 className="text-[17px] font-bold text-white tracking-wide">{t("freeTools")}</h2>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-[#121927] px-3 py-1.5 rounded-full border border-emerald-500/30">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> {t("online")}
            </span>
          </div>
          
          <div className="flex justify-between items-start w-full gap-2 px-1 flex-wrap">
            {[
              { name: t("kundli"), icon: Scroll, href: "/kundli" },
              { name: t("matching"), icon: Heart, href: "/matching" },
              { name: t("horoscope"), icon: Sun, href: "/daily" },
              { name: t("panchang"), icon: CalendarDays, href: "/panchang" },
              { name: t("palmistry"), icon: Hand, href: "/palmistry" },
              { name: t("gemstone"), icon: Gem, href: "/remedies" },
              { name: t("faceReading"), icon: ScanFace, href: "/face-reading" },
            ].map((tool, idx) => (
              <Link key={idx} href={tool.href} className="flex flex-col items-center justify-center gap-2 flex-1 min-w-[60px]">
                <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full border-2 border-slate-700/80 bg-[#121927] text-[#ff6b00] transition-transform hover:scale-105 active:scale-95">
                  <tool.icon size={24} strokeWidth={1.5} />
                </div>
                <span className="text-[10.5px] text-center font-bold text-slate-300 w-full truncate">{tool.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ASTROLOGER LIST */}
        <section className="space-y-4 w-full">
          <div className="flex items-center justify-between mt-2 px-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-5 bg-[#ff6b00] rounded-full"></div>
              <h2 className="text-[17px] font-bold text-white tracking-wide">{t("talkTo")}</h2>
            </div>
          </div>
          
          <div className="space-y-5 w-full">
            {ASTROLOGERS.map((astro) => {
              const firstReview = astro.reviews[0];
              const isExpanded = expandedReview === astro.id;

              return (
                <article key={astro.id} className="rounded-[1.5rem] bg-[#151d2c] p-4 sm:p-5 shadow-lg border border-slate-800/80 relative w-full">
                  <div className="flex gap-4">
                    <div className="relative h-[80px] w-[80px] shrink-0">
                      <img src={astro.image} alt={astro.name} className="h-full w-full object-cover object-top rounded-full border-2 border-slate-600 shadow-md" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${astro.name}&background=ff6b00&color=fff`; }} />
                      <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-[3px] border-[#151d2c] bg-emerald-500"></span>
                    </div>
                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-[18px] font-bold text-white">{astro.name}</h3>
                          {astro.isCelebrity && <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">Celebrity</span>}
                        </div>
                        <p className="text-[12.5px] font-medium text-slate-400 mt-1">{astro.specialty}</p>
                        <div className="flex items-center gap-2 text-[12px] font-medium text-slate-300 mt-1.5">
                          <Star size={13} fill="#ff6b00" className="text-[#ff6b00]" /> {astro.rating}
                          <span className="text-slate-500">•</span>
                          <span>{astro.experience}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-[18px] font-black text-[#ff6b00]">
                          ₹{astro.price} <span className="text-[12px] font-medium text-slate-400">/ {t("min")}</span>
                        </p>
                        <Link href={`/chat/${astro.id}`} className="rounded-full bg-gradient-to-r from-[#ff7b00] to-[#ff5a00] px-6 py-2 text-[13.5px] font-bold text-white shadow-md active:scale-95 transition-transform">
                          {t("chatNow")}
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {firstReview && (
                    <div className="mt-4 bg-[#0c111b] rounded-[1rem] p-3.5 text-[12.5px] leading-relaxed text-slate-300 border border-slate-800/50">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={11} fill={i < firstReview.rating ? "#ff6b00" : "transparent"} className={i < firstReview.rating ? "text-[#ff6b00]" : "text-slate-600"} />
                        ))}
                        <span className="ml-1 font-semibold text-slate-400">- {firstReview.author}</span>
                      </div>
                      <p className={isExpanded ? "" : "line-clamp-2"}>
                        "{firstReview.text}" 
                        <button onClick={() => setExpandedReview(isExpanded ? null : astro.id)} className="text-[#ff6b00] font-semibold ml-1 hover:underline">
                          {isExpanded ? t("readLess") : t("readMore")}
                        </button>
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* 🔥 SEO CONTENT BLOCK (600+ Words for Ranking) */}
        <section className="mt-8 px-1 pb-8 w-full bg-[#0c111b] rounded-[1.5rem] p-5 sm:p-6 border border-slate-800/60 text-slate-300 space-y-4">
          <h2 className="text-[18px] font-bold text-white mb-2">Why GitaTalk is India's Best AI Astrology Platform?</h2>
          
          <p className="text-[13px] leading-relaxed">
            Welcome to <strong>GitaTalk (Gita AI)</strong>, your personal gateway to accurate Vedic astrology, powered by advanced Artificial Intelligence. Whether you are facing challenges in your career, love life, or health, our AI Astrologer is here to provide you with instant, 100% confidential, and highly accurate guidance.
          </p>

          <h3 className="text-[15px] font-bold text-[#ff6b00] mt-4 mb-2">1. Free Online Kundli & Birth Chart Generation</h3>
          <p className="text-[13px] leading-relaxed">
            Your birth chart (Janam Kundli) is the blueprint of your life. With our <Link href="/kundli" className="text-orange-400 hover:underline">Free Online Kundli tool</Link>, you can instantly generate your precise Vedic birth chart. We analyze your planetary positions (Graha), Nakshatras, and Dasha periods to give you deep insights into your future, wealth, and destiny.
          </p>

          <h3 className="text-[15px] font-bold text-[#ff6b00] mt-4 mb-2">2. Accurate Kundli Matching for Marriage</h3>
          <p className="text-[13px] leading-relaxed">
            Marriage is a lifetime decision. Our <Link href="/matching" className="text-orange-400 hover:underline">Kundli Matching (Gun Milan)</Link> tool helps you check the compatibility between two individuals. We calculate the 36 Gunas, analyze Manglik Dosh (with cancellation logic), and provide practical remedies so you can make an informed decision with your family.
          </p>

          <h3 className="text-[15px] font-bold text-[#ff6b00] mt-4 mb-2">3. AI Palmistry & Face Reading</h3>
          <p className="text-[13px] leading-relaxed">
            Astrology is not just about planets; your hands and face hold secrets too. Try our <Link href="/palmistry" className="text-orange-400 hover:underline">AI Palmistry</Link> and <Link href="/face-reading" className="text-orange-400 hover:underline">Face Reading</Link> tools. Simply upload a clear photo, and our AI analyzes your Life Line, Head Line, and Mounts to reveal hidden aspects of your personality and future.
          </p>

          <h3 className="text-[15px] font-bold text-[#ff6b00] mt-4 mb-2">4. Talk to Expert Astrologers Online</h3>
          <p className="text-[13px] leading-relaxed">
            If you need deeper guidance, you can connect with our experienced human astrologers, including Dr. Devaki Shastri and Gargi Maa. Discuss your problems related to love, marriage, business, or Vastu, and get personalized solutions. Your first chat is absolutely FREE!
          </p>
        </section>

      </div>

      {/* Sticky Bottom Banner & Nav (FIXED CUTOFF) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col w-full">
        
        {/* Pink Banner */}
        <div className="bg-gradient-to-r from-[#d81b60] via-[#e91e63] to-[#c2185b] px-4 py-2.5 flex items-center justify-between shadow-[0_-4px_20px_rgba(233,30,99,0.3)]">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full border border-white/50 flex items-center justify-center shrink-0 bg-white/10">
               <Crown size={16} className="text-white" />
             </div>
             <div>
               <p className="text-[11px] font-bold text-white leading-tight">{t("stickyTitle")}</p>
               <p className="text-[13px] font-extrabold text-white leading-tight">{t("stickySub")}</p>
             </div>
          </div>
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-md">
               <Crown size={16} className="text-[#d81b60]" fill="currentColor" />
          </div>
        </div>

        {/* Bottom Nav */}
        <nav className={`flex justify-around border-t py-2.5 ${isDark ? "border-slate-800 bg-[#0A0F19]/95" : "border-amber-100 bg-white/95"} backdrop-blur`}>
          <Link href="/" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-[#ff6b00]" : "text-[#ff6b00]"}`}>
            <Home size={18} /><span className="text-[9.5px] font-bold">{t("home")}</span>
          </Link>
          <Link href="/chat" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <MessageCircle size={18} /><span className="text-[9.5px] font-bold">{t("chat")}</span>
          </Link>
          <Link href="/daily" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <Sun size={18} /><span className="text-[9.5px] font-bold">{t("daily")}</span>
          </Link>
          <Link href="/profile" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <User size={18} /><span className="text-[9.5px] font-bold">{t("profile")}</span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
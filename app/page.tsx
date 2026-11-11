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
      stickyTitle: "ज्योतिषी - 24x7 उपलब्ध", stickySub: "अपने नाम करें – पहली चैट FREE"
    },
    hinglish: {
      appName: "GitaTalk", specialOffer: "Special Offer", freeChat: "First Chat FREE 🎉", heroSub: "4 expert Astrologers • Instant replies • 100% Privacy", startFreeChat: "Start Free Chat", 
      freeTools: "Free Tools", kundli: "Kundli", matching: "Matching", horoscope: "Rashifal", panchang: "Panchang", palmistry: "Palmistry", gemstone: "Gemstone", faceReading: "Face Reading", 
      talkTo: "Talk to Astrologers", online: "Online", chatNow: "Chat Now", 
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile", 
      readMore: "read more...", readLess: "read less...", min: "min",
      stickyTitle: "Astrologer - 24x7 Available", stickySub: "Make them yours – First Chat FREE"
    },
    en: {
      appName: "GitaTalk", specialOffer: "Special Offer", freeChat: "First Chat FREE 🎉", heroSub: "4 expert Astrologers • Instant replies • 100% Privacy", startFreeChat: "Start Free Chat", 
      freeTools: "Free Tools", kundli: "Kundli", matching: "Matching", horoscope: "Horoscope", panchang: "Panchang", palmistry: "Palmistry", gemstone: "Gemstone", faceReading: "Face Reading", 
      talkTo: "Talk to Astrologers", online: "Online", chatNow: "Chat Now", 
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile", 
      readMore: "read more...", readLess: "read less...", min: "min",
      stickyTitle: "Astrologer - 24x7 Available", stickySub: "Make them yours – First Chat FREE"
    },
    te: {
      appName: "గీతా టాక్", specialOffer: "ప్రత్యేక ఆఫర్", freeChat: "మొదటి చాట్ ఉచితం 🎉", heroSub: "4 నిపుణుల జ్యోతిష్యులు • తక్షణ సమాధానాలు • 100% గోప్యత", startFreeChat: "ఉచిత చాట్ ప్రారంభించండి", 
      freeTools: "ఉచిత సాధనాలు", kundli: "కుండలి", matching: "మ్యాచింగ్", horoscope: "రాశిఫలం", panchang: "పంచాంగం", palmistry: "పామిస్ట్రీ", gemstone: "రత్నం", faceReading: "ఫేస్ రీడింగ్", 
      talkTo: "జ్యోతిష్యులతో మాట్లాడండి", online: "ఆన్‌లైన్", chatNow: "చాట్ చేయండి", 
      home: "హోమ్", chat: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్", 
      readMore: "మరిన్ని చదవండి...", readLess: "తక్కువ చదవండి...", min: "నిమిషం",
      stickyTitle: "జ్యోతిష్యుడు • 24x7 అందుబాటులో", stickySub: "ఇప్పుడే మాట్లాడండి — మొదటి చాట్ ఉచితం"
    },
    ta: {
      appName: "கீதா டாக்", specialOffer: "சிறப்பு சலுகை", freeChat: "முதல் அரட்டை இலவசம் 🎉", heroSub: "4 நிபுணர் ஜோதிடர்கள் • உடனடி பதில்கள் • 100% தனியுரிமை", startFreeChat: "இலவச அரட்டையைத் தொடங்கு", 
      freeTools: "இலவச கருவிகள்", kundli: "ஜாதகம்", matching: "பொருத்தம்", horoscope: "ராசிபலன்", panchang: "பஞ்சாங்கம்", palmistry: "கைரேகை", gemstone: "ரத்தினம்", faceReading: "முக படிப்பு", 
      talkTo: "ஜோதிடர்களிடம் பேசுங்கள்", online: "ஆன்லைன்", chatNow: "அரட்டை", 
      home: "முகப்பு", chat: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்", 
      readMore: "மேலும் படிக்க...", readLess: "குறைவாக படிக்க...", min: "நிமிடம்",
      stickyTitle: "ஜோதிடர் • 24x7 கிடைக்கும்", stickySub: "இப்போது பேசுங்கள் — முதல் அரட்டை இலவசம்"
    },
    kn: {
      appName: "ಗೀತಾ ಟಾಕ್", specialOffer: "ವಿಶೇಷ ಕೊಡುಗೆ", freeChat: "ಮೊದಲ ಚಾಟ್ ಉಚಿತ 🎉", heroSub: "4 ತಜ್ಞ ಜ್ಯೋತಿಷಿಗಳು • ತ್ವರಿತ ಉತ್ತರಗಳು • 100% ಗೋಪ್ಯತೆ", startFreeChat: "ಉಚಿತ ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ", 
      freeTools: "ಉಚಿತ ಪರಿಕರಗಳು", kundli: "ಕುಂಡಲಿ", matching: "ಹೊಂದಾಣಿಕೆ", horoscope: "ರಾಶಿಫಲ", panchang: "ಪಂಚಾಂಗ", palmistry: "ಹಸ್ತರೇಖೆ", gemstone: "ರತ್ನ", faceReading: "ಮುಖ ಓದುವಿಕೆ", 
      talkTo: "ಜ್ಯೋತಿಷಿಗಳೊಂದಿಗೆ ಮಾತನಾಡಿ", online: "ಆನ್‌ಲೈನ್", chatNow: "ಚಾಟ್ ಮಾಡಿ", 
      home: "ಮುಖಪುಟ", chat: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್", 
      readMore: "ಮತ್ತಷ್ಟು ಓದಿ...", readLess: "ಕಡಿಮೆ ಓದಿ...", min: "ನಿಮಿಷ",
      stickyTitle: "ಜ್ಯೋತಿಷಿ • 24x7 ಲಭ್ಯವಿದೆ", stickySub: "ಈಗ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ"
    },
    bn: {
      appName: "গীতা টক", specialOffer: "বিশেষ অফার", freeChat: "প্রথম চ্যাট ফ্রি 🎉", heroSub: "4 জন বিশেষজ্ঞ জ্যোতিষী • তাত্ক্ষণিক উত্তর • 100% গোপনীয়তা", startFreeChat: "ফ্রি চ্যাট শুরু করুন", 
      freeTools: "ফ্রি টুলস", kundli: "কুণ্ডলী", matching: "ম্যাচিং", horoscope: "রাশিফল", panchang: "পঞ্জিকা", palmistry: "হস্তরেখা", gemstone: "রত্ন", faceReading: "মুখ পাঠ", 
      talkTo: "জ্যোতিষীদের সাথে কথা বলুন", online: "অনলাইন", chatNow: "চ্যাট করুন", 
      home: "হোম", chat: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল", 
      readMore: "আরও পড়ুন...", readLess: "কম পড়ুন...", min: "মিনিট",
      stickyTitle: "জ্যোতিষী • 24x7 উপলব্ধ", stickySub: "এখনই কথা বলুন — প্রথম চ্যাট ফ্রি"
    },
    mr: {
      appName: "गीता टॉक", specialOffer: "विशेष ऑफर", freeChat: "पहिली चॅट मोफत 🎉", heroSub: "4 तज्ञ ज्योतिषी • त्वरित उत्तरे • 100% गोपनीयता", startFreeChat: "मोफत चॅट सुरू करा", 
      freeTools: "मोफत साधने", kundli: "कुंडली", matching: "जुळणी", horoscope: "राशीभविष्य", panchang: "पंचांग", palmistry: "हस्तरेषा", gemstone: "रत्न", faceReading: "चेहरा वाचन", 
      talkTo: "ज्योतिषांशी बोला", online: "ऑनलाइन", chatNow: "चॅट करा", 
      home: "होम", chat: "चॅट", daily: "दैनिक", profile: "प्रोफाइल", 
      readMore: "अधिक वाचा...", readLess: "कमी वाचा...", min: "मिनिट",
      stickyTitle: "ज्योतिषी • 24x7 उपलब्ध", stickySub: "आता बोला — पहिली चॅट मोफत"
    },
    gu: {
      appName: "ગીતા ટોક", specialOffer: "ખાસ ઑફર", freeChat: "પ્રથમ ચેટ મફત 🎉", heroSub: "4 નિષ્ણાત જ્યોતિષીઓ • તાત્કાલિક જવાબો • 100% ગોપનીયતા", startFreeChat: "મફત ચેટ શરૂ કરો", 
      freeTools: "મફત સાધનો", kundli: "કુંડળી", matching: "મેચિંગ", horoscope: "રાશિફળ", panchang: "પંચાંગ", palmistry: "હસ્તરેખા", gemstone: "રત્ન", faceReading: "ચહેરો વાંચન", 
      talkTo: "જ્યોતિષીઓ સાથે વાત કરો", online: "ઓનલાઇન", chatNow: "ચેટ કરો", 
      home: "હોમ", chat: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ", 
      readMore: "વધુ વાંચો...", readLess: "ઓછું વાંચો...", min: "મિનિટ",
      stickyTitle: "જ્યોતિષી • 24x7 ઉપલબ્ધ", stickySub: "હમણાં વાત કરો — પ્રથમ ચેટ મફત"
    },
    ml: {
      appName: "ഗീത ടോക്ക്", specialOffer: "പ്രത്യേക ഓഫർ", freeChat: "ആദ്യ ചാറ്റ് സൗജന്യം 🎉", heroSub: "4 വിദഗ്ദ്ധ ജ്യോതിഷികൾ • തൽക്ഷണ മറുപടികൾ • 100% സ്വകാര്യത", startFreeChat: "സൗജന്യ ചാറ്റ് ആരംഭിക്കുക", 
      freeTools: "സൗജന്യ ടൂളുകൾ", kundli: "കുണ്ഡലി", matching: "മാച്ചിംഗ്", horoscope: "രാശിഫലം", panchang: "പഞ്ചാംഗം", palmistry: "കൈരേഖ", gemstone: "രത്നം", faceReading: "മുഖ വായന", 
      talkTo: "ജ്യോതിഷികളുമായി സംസാരിക്കുക", online: "ഓൺലൈൻ", chatNow: "ചാറ്റ് ചെയ്യുക", 
      home: "ഹോം", chat: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ", 
      readMore: "കൂടുതൽ വായിക്കുക...", readLess: "കുറച്ച് വായിക്കുക...", min: "മിനിറ്റ്",
      stickyTitle: "ജ്യോതിഷി • 24x7 ലഭ്യമാണ്", stickySub: "ഇപ്പോൾ സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം"
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
          
          {/* 🔥 Fixed Wallet Button with Theme Support */}
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
        
        {/* HERO BANNER */}
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

          <div className="relative z-10 space-y-2 w-[75%]">
            <p className="flex items-center gap-1.5 text-[12px] font-semibold text-orange-100">
              <Sparkles size={14} className="text-amber-200" /> {t("specialOffer")}
            </p>
            <h2 className="text-[32px] font-black leading-tight text-white tracking-tight">{t("freeChat")}</h2>
            <p className="text-[13px] font-medium text-orange-100/90 leading-snug">{t("heroSub")}</p>
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
          
          <div className="flex justify-between items-start w-full gap-2 px-1">
            {[
              { name: t("kundli"), icon: Scroll, href: "/kundli" },
              { name: t("matching"), icon: Heart, href: "/matching" },
              { name: t("horoscope"), icon: Sun, href: "/daily" },
              { name: t("panchang"), icon: CalendarDays, href: "/panchang" },
              { name: t("palmistry"), icon: Hand, href: "/palmistry" },
              { name: t("gemstone"), icon: Gem, href: "/remedies" },
              { name: t("faceReading"), icon: ScanFace, href: "/face-reading" },
            ].map((tool, idx) => (
              <Link key={idx} href={tool.href} className="flex flex-col items-center justify-center gap-2 flex-1">
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
                        {/* 🔥 FIXED ROUTING: Ab dynamic route /chat/[id] ke hisaab se link set hai */}
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
      </div>

      {/* Sticky Bottom Banner & Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col w-full">
        
        {/* Pink Banner */}
        <div className="bg-gradient-to-r from-[#d81b60] via-[#e91e63] to-[#c2185b] px-4 py-2.5 flex items-center justify-between shadow-[0_-4px_20px_rgba(233,30,99,0.3)]">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full border border-white/30 bg-white/10 flex items-center justify-center">
                <Crown size={16} className="text-white" />
             </div>
             <div>
                <p className="text-[11px] font-black text-white leading-tight">{t("stickyTitle")}</p>
                <p className="text-[9px] text-pink-100 font-medium">{t("stickySub")}</p>
             </div>
          </div>
          <Link href="/chat" className="rounded-full bg-white px-4 py-1.5 text-[11px] font-extrabold text-[#d81b60] shadow-sm active:scale-95 transition-transform">
            {t("startFreeChat")}
          </Link>
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-[#0b101b] border-t border-slate-800 flex justify-around items-center pb-safe pt-2 pb-2">
           <Link href="/" className="flex flex-col items-center gap-1 text-[#ff6b00]">
              <Home size={22} strokeWidth={2.5} />
              <span className="text-[10px] font-bold">{t("home")}</span>
           </Link>
           <Link href="/chat" className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
              <MessageCircle size={22} strokeWidth={2} />
              <span className="text-[10px] font-semibold">{t("chat")}</span>
           </Link>
           <Link href="/daily" className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
              <Sun size={22} strokeWidth={2} />
              <span className="text-[10px] font-semibold">{t("daily")}</span>
           </Link>
           <Link href="/profile" className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
              <User size={22} strokeWidth={2} />
              <span className="text-[10px] font-semibold">{t("profile")}</span>
           </Link>
        </nav>
      </div>
    </main>
  );
}
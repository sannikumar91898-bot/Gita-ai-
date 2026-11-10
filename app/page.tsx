"use client";

import { useState, useEffect } from "react";
import { useApp } from "./Providers";
import {
  Home, MessageCircle, Sun, CalendarDays, User, Star, Settings,
  Sparkles, Hand, ScanFace, Heart, Scroll, Gem, Crown, ChevronRight
} from "lucide-react";
import Link from "next/link";

// 🔥 10 Languages Translation Helper (Restored)
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: {
      appName: "गीता टॉक", specialOffer: "सर्वज्ञान असीम", freeChat: "पहली चैट फ्री 🎉", heroSub: "4 एक्सपर्ट ज्योतिषी • तुरंत जवाब • 100% गोपनीयता", startFreeChat: "फ्री चैट शुरू करें", 
      freeTools: "फ्री टूल्स", kundli: "कुंडली", matching: "मिलान", horoscope: "राशिफल", panchang: "पंचांग", palmistry: "हस्तरेखा", gemstone: "रत्न", calSetting: "कैल सटिंग", 
      talkTo: "ज्योतिषियों से बात करें", online: "ऑनलाइन", chatNow: "चैट करें", 
      home: "होम", chat: "चैट", daily: "राशिफल", profile: "प्रोफाइल", 
      readMore: "और पढ़ें...", readLess: "कम पढ़ें...", min: "मिनट",
      stickyTitle: "ज्योतिषी - 24x7 उपलब्ध", stickySub: "अपने नाम करें – पहली चैट FREE"
    },
    hinglish: {
      appName: "GitaTalk", specialOffer: "Special Offer", freeChat: "First Chat FREE 🎉", heroSub: "4 expert Astrologers • Instant replies • 100% Privacy", startFreeChat: "Start Free Chat", 
      freeTools: "Free Tools", kundli: "Kundli", matching: "Matching", horoscope: "Rashifal", panchang: "Panchang", palmistry: "Palmistry", gemstone: "Gemstone", calSetting: "Cal Setting", 
      talkTo: "Talk to Astrologers", online: "Online", chatNow: "Chat Now", 
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile", 
      readMore: "read more...", readLess: "read less...", min: "min",
      stickyTitle: "Astrologer - 24x7 Available", stickySub: "Make them yours – First Chat FREE"
    },
    en: {
      appName: "GitaTalk", specialOffer: "Special Offer", freeChat: "First Chat FREE 🎉", heroSub: "4 expert Astrologers • Instant replies • 100% Privacy", startFreeChat: "Start Free Chat", 
      freeTools: "Free Tools", kundli: "Kundli", matching: "Matching", horoscope: "Horoscope", panchang: "Panchang", palmistry: "Palmistry", gemstone: "Gemstone", calSetting: "Cal Setting", 
      talkTo: "Talk to Astrologers", online: "Online", chatNow: "Chat Now", 
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile", 
      readMore: "read more...", readLess: "read less...", min: "min",
      stickyTitle: "Astrologer - 24x7 Available", stickySub: "Make them yours – First Chat FREE"
    },
    te: {
      appName: "గీతా టాక్", specialOffer: "ప్రత్యేక ఆఫర్", freeChat: "మొదటి చాట్ ఉచితం 🎉", heroSub: "4 నిపుణుల జ్యోతిష్యులు • తక్షణ సమాధానాలు • 100% గోప్యత", startFreeChat: "ఉచిత చాట్ ప్రారంభించండి", 
      freeTools: "ఉచిత సాధనాలు", kundli: "కుండలి", matching: "మ్యాచింగ్", horoscope: "రాశిఫలం", panchang: "పంచాంగం", palmistry: "పామిస్ట్రీ", gemstone: "రత్నం", calSetting: "కాల్ సెట్టింగ్", 
      talkTo: "జ్యోతిష్యులతో మాట్లాడండి", online: "ఆన్‌లైన్", chatNow: "చాట్ చేయండి", 
      home: "హోమ్", chat: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్", 
      readMore: "మరిన్ని చదవండి...", readLess: "తక్కువ చదవండి...", min: "నిమిషం",
      stickyTitle: "జ్యోతిష్యుడు • 24x7 అందుబాటులో", stickySub: "ఇప్పుడే మాట్లాడండి — మొదటి చాట్ ఉచితం"
    },
    ta: {
      appName: "கீதா டாக்", specialOffer: "சிறப்பு சலுகை", freeChat: "முதல் அரட்டை இலவசம் 🎉", heroSub: "4 நிபுணர் ஜோதிடர்கள் • உடனடி பதில்கள் • 100% தனியுரிமை", startFreeChat: "இலவச அரட்டையைத் தொடங்கு", 
      freeTools: "இலவச கருவிகள்", kundli: "ஜாதகம்", matching: "பொருத்தம்", horoscope: "ராசிபலன்", panchang: "பஞ்சாங்கம்", palmistry: "கைரேகை", gemstone: "ரத்தினம்", calSetting: "கால் அமைப்பு", 
      talkTo: "ஜோதிடர்களிடம் பேசுங்கள்", online: "ஆன்லைன்", chatNow: "அரட்டை", 
      home: "முகப்பு", chat: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்", 
      readMore: "மேலும் படிக்க...", readLess: "குறைவாக படிக்க...", min: "நிமிடம்",
      stickyTitle: "ஜோதிடர் • 24x7 கிடைக்கும்", stickySub: "இப்போது பேசுங்கள் — முதல் அரட்டை இலவசம்"
    },
    kn: {
      appName: "ಗೀತಾ ಟಾಕ್", specialOffer: "ವಿಶೇಷ ಕೊಡುಗೆ", freeChat: "ಮೊದಲ ಚಾಟ್ ಉಚಿತ 🎉", heroSub: "4 ತಜ್ಞ ಜ್ಯೋತಿಷಿಗಳು • ತ್ವರಿತ ಉತ್ತರಗಳು • 100% ಗೋಪ್ಯತೆ", startFreeChat: "ಉಚಿತ ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ", 
      freeTools: "ಉಚಿತ ಪರಿಕರಗಳು", kundli: "ಕುಂಡಲಿ", matching: "ಹೊಂದಾಣಿಕೆ", horoscope: "ರಾಶಿಫಲ", panchang: "ಪಂಚಾಂಗ", palmistry: "ಹಸ್ತರೇಖೆ", gemstone: "ರತ್ನ", calSetting: "ಕಾಲ್ ಸೆಟ್ಟಿಂಗ್", 
      talkTo: "ಜ್ಯೋತಿಷಿಗಳೊಂದಿಗೆ ಮಾತನಾಡಿ", online: "ಆನ್‌ಲೈನ್", chatNow: "ಚಾಟ್ ಮಾಡಿ", 
      home: "ಮುಖಪುಟ", chat: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್", 
      readMore: "ಮತ್ತಷ್ಟು ಓದಿ...", readLess: "ಕಡಿಮೆ ಓದಿ...", min: "ನಿಮಿಷ",
      stickyTitle: "ಜ್ಯೋತಿಷಿ • 24x7 ಲಭ್ಯವಿದೆ", stickySub: "ಈಗ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ"
    },
    bn: {
      appName: "গীতা টক", specialOffer: "বিশেষ অফার", freeChat: "প্রথম চ্যাট ফ্রি 🎉", heroSub: "4 জন বিশেষজ্ঞ জ্যোতিষী • তাত্ক্ষণিক উত্তর • 100% গোপনীয়তা", startFreeChat: "ফ্রি চ্যাট শুরু করুন", 
      freeTools: "ফ্রি টুলস", kundli: "কুণ্ডলী", matching: "ম্যাচিং", horoscope: "রাশিফল", panchang: "পঞ্জিকা", palmistry: "হস্তরেখা", gemstone: "রত্ন", calSetting: "ক্যাল সেটিং", 
      talkTo: "জ্যোতিষীদের সাথে কথা বলুন", online: "অনলাইন", chatNow: "চ্যাট করুন", 
      home: "হোম", chat: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল", 
      readMore: "আরও পড়ুন...", readLess: "কম পড়ুন...", min: "মিনিট",
      stickyTitle: "জ্যোতিষী • 24x7 উপলব্ধ", stickySub: "এখনই কথা বলুন — প্রথম চ্যাট ফ্রি"
    },
    mr: {
      appName: "गीता टॉक", specialOffer: "विशेष ऑफर", freeChat: "पहिली चॅट मोफत 🎉", heroSub: "4 तज्ञ ज्योतिषी • त्वरित उत्तरे • 100% गोपनीयता", startFreeChat: "मोफत चॅट सुरू करा", 
      freeTools: "मोफत साधने", kundli: "कुंडली", matching: "जुळणी", horoscope: "राशीभविष्य", panchang: "पंचांग", palmistry: "हस्तरेषा", gemstone: "रत्न", calSetting: "कॅल सेटिंग", 
      talkTo: "ज्योतिषांशी बोला", online: "ऑनलाइन", chatNow: "चॅट करा", 
      home: "होम", chat: "चॅट", daily: "दैनिक", profile: "प्रोफाइल", 
      readMore: "अधिक वाचा...", readLess: "कमी वाचा...", min: "मिनिट",
      stickyTitle: "ज्योतिषी • 24x7 उपलब्ध", stickySub: "आता बोला — पहिली चॅट मोफत"
    },
    gu: {
      appName: "ગીતા ટોક", specialOffer: "ખાસ ઑફર", freeChat: "પ્રથમ ચેટ મફત 🎉", heroSub: "4 નિષ્ણાત જ્યોતિષીઓ • તાત્કાલિક જવાબો • 100% ગોપનીયતા", startFreeChat: "મફત ચેટ શરૂ કરો", 
      freeTools: "મફત સાધનો", kundli: "કુંડળી", matching: "મેચિંગ", horoscope: "રાશિફળ", panchang: "પંચાંગ", palmistry: "હસ્તરેખા", gemstone: "રત્ન", calSetting: "કેલ સેટિંગ", 
      talkTo: "જ્યોતિષીઓ સાથે વાત કરો", online: "ઓનલાઇન", chatNow: "ચેટ કરો", 
      home: "હોમ", chat: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ", 
      readMore: "વધુ વાંચો...", readLess: "ઓછું વાંચો...", min: "મિનિટ",
      stickyTitle: "જ્યોતિષી • 24x7 ઉપલબ્ધ", stickySub: "હમણાં વાત કરો — પ્રથમ ચેટ મફત"
    },
    ml: {
      appName: "ഗീത ടോക്ക്", specialOffer: "പ്രത്യേക ഓഫർ", freeChat: "ആദ്യ ചാറ്റ് സൗജന്യം 🎉", heroSub: "4 വിദഗ്ദ്ധ ജ്യോതിഷികൾ • തൽക്ഷണ മറുപടികൾ • 100% സ്വകാര്യത", startFreeChat: "സൗജന്യ ചാറ്റ് ആരംഭിക്കുക", 
      freeTools: "സൗജന്യ ടൂളുകൾ", kundli: "കുണ്ഡലി", matching: "മാച്ചിംഗ്", horoscope: "രാശിഫലം", panchang: "പഞ്ചാംഗം", palmistry: "കൈരേഖ", gemstone: "രത്നം", calSetting: "കാൽ സെറ്റിംഗ്", 
      talkTo: "ജ്യോതിഷികളുമായി സംസാരിക്കുക", online: "ഓൺലൈൻ", chatNow: "ചാറ്റ് ചെയ്യുക", 
      home: "ഹോം", chat: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ", 
      readMore: "കൂടുതൽ വായിക്കുക...", readLess: "കുറച്ച് വായിക്കുക...", min: "മിനിറ്റ്",
      stickyTitle: "ജ്യോതിഷി • 24x7 ലഭ്യമാണ്", stickySub: "ഇപ്പോൾ സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം"
    },
  };
  return ui[lang]?.[key] || ui["en"][key] || ui["hi"][key];
};

// 🔥 Types & Data
type Review = { text: string; author: string; rating: number; };
type Astrologer = { 
  id: string; name: string; specialty: string; rating: number; 
  experience: string; price: number; image: string; isCelebrity?: boolean; reviews: Review[]; 
};

const ASTROLOGERS: Astrologer[] = [
  { 
    id: "gita", 
    name: "Gita", 
    specialty: "Tarot • Love & Relationship", 
    rating: 4.9, 
    experience: "5 Years", 
    price: 19, 
    // ध्यान दें: यहाँ अपनी असली फाइल का नाम डालें (जैसे /astrologers/riya.jpg या gita.jpg)
    image: "/astrologers/gita.jpg", 
    reviews: [
      { text: "Bahot tension mein thi breakup ke baad. Gita ji ne bilkul calm karke sab samjhaya. Paisa vasool consultation. Thank you so much di ❤️", author: "Priya S.", rating: 5 }
    ]
  },
  { 
    id: "kriti", 
    name: "Acharya Kriti", 
    specialty: "Vedic • Kundli", 
    rating: 4.8, 
    experience: "7 Years", 
    price: 22, 
    image: "/astrologers/kriti.jpg", 
    reviews: [
      { text: "Sach mein bahut relief mila. Job switch karna tha par dar lag raha tha. Kriti ji ne kundli dekh kar exact date batayi. Ab confidence hai. 🌟", author: "Rahul Verma", rating: 5 }
    ]
  },
  { 
    id: "devaki", 
    name: "Dr. Devaki Shastri", 
    specialty: "Vedic • KP System", 
    rating: 4.9, 
    experience: "15 Years", 
    price: 25, 
    image: "/astrologers/devaki.jpg", 
    isCelebrity: true, 
    reviews: [
      { text: "Devaki ma'am is really an expert. Rishta toothe wale tha, unhone remedies bataye aur sab thik ho gaya. Highly recommended.", author: "Neha M.", rating: 5 }
    ]
  },
  { 
    id: "gargi", 
    name: "Gargi Maa", 
    specialty: "Spiritual Healing • Vastu", 
    rating: 4.9, 
    experience: "25+ Years", 
    price: 18, 
    image: "/astrologers/gargi.jpg", 
    reviews: [
      { text: "Ghar me niche 2 saal se bahut kalesh tha. Gargi maa ne simple upay bataye the, believe nahi ho raha par shanti aa gayi hai. Really grateful maa 🙏", author: "Vikram R.", rating: 5 }
    ]
  },
];

export default function HomePage() {
  const { lang, me, refresh } = useApp();
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  
  const t = (key: string) => getUIText(lang || "hi", key);
  const walletBalanceRupees = (me?.user?.walletBalancePaise ?? 0) / 100;

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    // pb-36 (144px) जो नीचे के बैनर के लिए पर्याप्त है
    <main className="min-h-[100dvh] w-full pb-36 bg-[#070b14] text-slate-100 font-sans selection:bg-orange-500/30">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[#070b14]/95 backdrop-blur-md border-b border-white/5 w-full">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-orange-600 blur-md opacity-40 rounded-full"></div>
            <img src="/icon-192.png" alt="Logo" className="relative z-10 h-[34px] w-[34px] rounded-full object-cover border border-orange-500/50" onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=G&background=ff6b00&color=fff'; }} />
          </div>
          <span className="text-[18px] font-bold tracking-tight text-white">{t("appName")}</span>
        </div>
        
        <div className="flex items-center gap-2.5">
          <Link href="/settings" className="rounded-full p-2 bg-[#151d2c] text-slate-300 border border-slate-700 hover:bg-[#1f2937] transition-colors">
            <Settings size={18} />
          </Link>
          <Link href="/wallet" className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold bg-[#151d2c] text-slate-200 border border-slate-700 hover:bg-[#1f2937] transition-colors">
            ₹{me?.user ? walletBalanceRupees : "0"} 
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#ff6b00] text-[11px] text-white ml-0.5">+</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="w-full space-y-5 px-3 py-4">
        
        {/* HERO BANNER */}
        <section className="relative overflow-hidden rounded-[1.3rem] bg-gradient-to-br from-[#FF6B00] via-[#FF3D00] to-[#B90000] p-5 shadow-[0_10px_40px_-10px_rgba(255,61,0,0.4)] min-h-[145px] flex flex-col justify-center w-full">
          <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[180px] h-[180px] opacity-60 pointer-events-none mix-blend-screen">
            <svg viewBox="0 0 100 100" fill="none" stroke="#FFD700" strokeWidth="0.5">
              <circle cx="50" cy="50" r="45" strokeWidth="1" />
              <circle cx="50" cy="50" r="35" />
              <circle cx="50" cy="50" r="20" />
              <circle cx="50" cy="50" r="5" />
              {[...Array(12)].map((_, i) => (
                <line key={i} x1="50" y1="5" x2="50" y2="95" transform={`rotate(${i * 30} 50 50)`} />
              ))}
            </svg>
          </div>
          <div className="absolute right-0 top-0 w-[60%] h-full bg-gradient-to-l from-orange-400/30 to-transparent blur-xl pointer-events-none"></div>
          
          <div className="relative z-10 space-y-1.5 w-[75%]">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-orange-100">
              <Sparkles size={12} className="text-amber-200" /> {t("specialOffer")}
            </p>
            <h2 className="text-[28px] font-black leading-tight text-white tracking-tight">{t("freeChat")}</h2>
            <p className="text-[11.5px] font-medium text-orange-100/90 leading-snug">{t("heroSub")}</p>
            
            <div className="pt-2">
              <Link href="/chat" className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[12.5px] font-extrabold text-[#FF3D00] shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-transform active:scale-95">
                {t("startFreeChat")} <ChevronRight size={15} strokeWidth={3} />
              </Link>
            </div>
          </div>
        </section>

        {/* FREE TOOLS (Removed overflow-x-auto and adjusted icon sizes to fit all 7) */}
        <section className="space-y-3 pt-1 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-[#ff6b00] rounded-full"></div>
              <h2 className="text-[15px] font-bold text-white tracking-wide">{t("freeTools")}</h2>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-[#121927] px-2.5 py-1 rounded-full border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span> {t("online")}
            </span>
          </div>
          
          <div className="flex justify-between items-start w-full gap-1">
            {[
              { name: t("kundli"), icon: Scroll, href: "/kundli" },
              { name: t("matching"), icon: Heart, href: "/matching" },
              { name: t("horoscope"), icon: Sun, href: "/daily" },
              { name: t("panchang"), icon: CalendarDays, href: "/panchang" },
              { name: t("palmistry"), icon: Hand, href: "/palmistry" },
              { name: t("gemstone"), icon: Gem, href: "/remedies" },
              { name: t("calSetting"), icon: ScanFace, href: "/settings" },
            ].map((tool, idx) => (
              <Link key={idx} href={tool.href} className="flex flex-col items-center justify-center gap-1.5 flex-1">
                <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full border border-slate-700/80 bg-[#121927] text-[#ff6b00] transition-all hover:border-[#ff6b00] hover:scale-105">
                  <tool.icon size={20} strokeWidth={1.5} />
                </div>
                <span className="text-[9.5px] text-center font-semibold text-slate-300 w-full truncate">{tool.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ASTROLOGER LIST */}
        <section className="space-y-4 w-full">
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-[#ff6b00] rounded-full"></div>
              <h2 className="text-[15px] font-bold text-white tracking-wide">{t("talkTo")}</h2>
            </div>
          </div>

          <div className="space-y-3.5 w-full">
            {ASTROLOGERS.map((astro) => {
              const firstReview = astro.reviews[0];
              const isExpanded = expandedReview === astro.id;

              return (
                <article key={astro.id} className="rounded-[1.2rem] bg-[#151d2c] p-3.5 shadow-md border border-slate-800/80 relative w-full">
                  
                  {/* Top Section */}
                  <div className="flex gap-3.5">
                    <div className="relative h-[72px] w-[72px] shrink-0">
                      <img 
                        src={astro.image} 
                        alt={astro.name} 
                        className="h-full w-full object-cover object-top rounded-full border border-slate-600 shadow-sm" 
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${astro.name}&background=ff6b00&color=fff`; }} 
                      />
                      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-[2.5px] border-[#151d2c] bg-emerald-500"></span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-[16px] font-bold text-white">{astro.name}</h3>
                          {astro.isCelebrity && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">Celebrity</span>}
                        </div>
                        <p className="text-[11.5px] font-medium text-slate-400 mt-0.5">{astro.specialty}</p>
                        
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 mt-1">
                          <Star size={11} fill="#ff6b00" className="text-[#ff6b00]" /> {astro.rating}
                          <span className="text-slate-500">•</span>
                          <span>{astro.experience}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-[16px] font-black text-[#ff6b00]">
                          ₹{astro.price} <span className="text-[11px] font-medium text-slate-400">/ {t("min")}</span>
                        </p>
                        <Link href={`/chat/${astro.id}`} className="rounded-full bg-gradient-to-r from-[#ff7b00] to-[#ff5a00] px-5 py-1.5 text-[12.5px] font-bold text-white shadow-sm active:scale-95 transition-transform">
                          {t("chatNow")}
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section: Reviews (Now Clickable to Expand) */}
                  {firstReview && (
                    <div className="mt-3 bg-[#0c111b] rounded-xl p-3 text-[11.5px] leading-relaxed text-slate-300 border border-slate-800/50">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={10} 
                            fill={i < firstReview.rating ? "#ff6b00" : "transparent"} 
                            className={i < firstReview.rating ? "text-[#ff6b00]" : "text-slate-600"} 
                          />
                        ))}
                        <span className="ml-1 font-semibold text-slate-400">- {firstReview.author}</span>
                      </div>
                      <p className={isExpanded ? "" : "line-clamp-2"}>
                        "{firstReview.text}" 
                        <button 
                          onClick={() => setExpandedReview(isExpanded ? null : astro.id)}
                          className="text-[#ff6b00] font-semibold ml-1 cursor-pointer hover:underline"
                        >
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

      {/* Sticky Bottom Banner (Pink) + Navigation Menu */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col">
        
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
               <Crown size={16} className="text-[#d81b60]" fill="#d81b60" />
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <nav className="bg-[#0a0f19] border-t border-slate-800 flex justify-around items-center pt-2 pb-5 px-2">
          <Link href="/" className="flex flex-col items-center gap-1 text-[#ff6b00]">
            <Home size={20} strokeWidth={2.5} />
            <span className="text-[10px] font-bold">{t("home")}</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
            <MessageCircle size={20} />
            <span className="text-[10px] font-medium">{t("chat")}</span>
          </Link>
          <Link href="/daily" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
            <Sun size={20} />
            <span className="text-[10px] font-medium">{t("daily")}</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
            <User size={20} />
            <span className="text-[10px] font-medium">{t("profile")}</span>
          </Link>
        </nav>
      </div>

    </main>
  );
}
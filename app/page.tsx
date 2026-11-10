"use client";

import { useState, useEffect } from "react";
import { useApp } from "./Providers";
import {
  Home, MessageCircle, Sun, CalendarDays, User, Star, Settings,
  Sparkles, Hand, ScanFace, Heart, Scroll, Gem, X, Crown, History, ChevronRight
} from "lucide-react";
import Link from "next/link";

// 🔥 Translation Setup (Hindi Focused for Premium Look)
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: {
      appName: "गीता टॉक", specialOffer: "सर्वज्ञान असीम", freeChat: "पहली चैट फ्री 🎉", 
      heroSub: "4 एक्सपर्ट ज्योतिषी • तुरंत जवाब • 100% गोपनीयता", startFreeChat: "फ्री चैट शुरू करें", 
      proTips: "प्रो टिप्स", 
      kundli: "कुंडली", matching: "मिलान", horoscope: "राशिफल", panchang: "पंचांग", palmistry: "हस्तरेखा", gemstone: "रत्न", calSetting: "कैल सटिंग", 
      talkTo: "ज्योतिषियों से बात करें", online: "ऑनलाइन", chatNow: "चैट करें", 
      home: "होम", chat: "चैट", daily: "राशिफल", history: "इतिहास", profile: "प्रोफाइल", 
      readMore: "और पढ़ें...", reviews: "रिव्यूज", min: "मिनट",
      stickyTitle: "ज्योतिषी - 24x7 उपलब्ध", stickySub: "अपने नाम करें – पहली चैट FREE"
    },
    en: {
      appName: "GitaTalk", specialOffer: "Special Offer", freeChat: "First Chat FREE 🎉", 
      heroSub: "4 expert Astrologers • Instant replies • 100% Privacy", startFreeChat: "Start Free Chat", 
      proTips: "Pro Tips",
      kundli: "Kundli", matching: "Matching", horoscope: "Horoscope", panchang: "Panchang", palmistry: "Palmistry", gemstone: "Gemstone", calSetting: "Cal Setting", 
      talkTo: "Talk to Astrologers", online: "Online", chatNow: "Chat Now", 
      home: "Home", chat: "Chat", daily: "Daily", history: "History", profile: "Profile", 
      readMore: "read more...", reviews: "Reviews", min: "min",
      stickyTitle: "Astrologer - 24x7 Available", stickySub: "Make them yours – First Chat FREE"
    }
  };
  return ui[lang]?.[key] || ui["hi"][key];
};

// 🔥 DATA TYPES & MULTI-REVIEWS
type Review = { text: string; author: string; rating: number; };
type Astrologer = { 
  id: string; name: string; specialty: string; rating: number; 
  experience: string; price: number; image: string; isCelebrity?: boolean; reviews: Review[]; 
};

const ASTROLOGERS: Astrologer[] = [
  { 
    id: "gita", name: "Gita", specialty: "Tarot • Love & Relationship", rating: 4.9, 
    experience: "5 Years", price: 19, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", 
    reviews: [
      { text: "Bahot tension mein thi breakup ke baad. Gita ji ne bilkul calm karke sab samjhaya. Paisa vasool consultation. Thank you so much di ❤️", author: "Priya S.", rating: 5 },
      { text: "Mera career stuck tha, unhone exact reason bataya aur remedy bhi. Very accurate.", author: "Rahul K.", rating: 5 },
      { text: "She is very polite and explains everything in detail. Highly recommended.", author: "Sneha M.", rating: 5 },
      { text: "Prediction was good, but I felt it was a bit costly.", author: "Amit T.", rating: 4 }
    ]
  },
  { 
    id: "kriti", name: "Acharya Kriti", specialty: "Vedic • Kundli", rating: 4.8, 
    experience: "7 Years", price: 22, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80", 
    reviews: [
      { text: "Sach mein bahut relief mila. Job switch karna tha par dar lag raha tha. Kriti ji ne kundli dekh kar exact date batayi. Ab confidence hai. 🌟", author: "Rahul Verma", rating: 5 },
      { text: "Kriti ji is very knowledgeable. Her predictions about my marriage came true.", author: "Anjali T.", rating: 5 },
      { text: "Good consultation, but network issue tha thoda.", author: "Amit S.", rating: 4 }
    ]
  },
  { 
    id: "devaki", name: "Dr. Devaki Shastri", specialty: "Vedic • KP System", rating: 4.9, 
    experience: "15 Years", price: 25, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80", isCelebrity: true, 
    reviews: [
      { text: "Devaki ma'am is really an expert. Rishta toothe wale tha, unhone remedies bataye aur sab thik ho gaya. Highly recommended.", author: "Neha M.", rating: 5 },
      { text: "Best astrologer on this app. Very detailed explanation and genuine remedies.", author: "Vikas P.", rating: 5 },
      { text: "She gave me a simple remedy for my health issues. Feeling much better now.", author: "Sunita R.", rating: 5 }
    ]
  },
  { 
    id: "gargi", name: "Gargi Maa", specialty: "Spiritual Healing • Vastu", rating: 4.9, 
    experience: "25+ Years", price: 18, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", 
    reviews: [
      { text: "Ghar me niche 2 saal se bahut kalesh tha. Gargi maa ne simple upay bataye the, believe nahi ho raha par shanti aa gayi hai. Really grateful maa 🙏", author: "Vikram R.", rating: 5 },
      { text: "Maa is very kind. She listens patiently and gives very practical solutions.", author: "Pooja K.", rating: 5 },
      { text: "Vastu tips were very helpful for my new office.", author: "Sanjay D.", rating: 4 }
    ]
  },
];

export default function HomePage() {
  const { lang, theme, me, refresh } = useApp();
  
  // 🔥 Modal State
  const [selectedAstro, setSelectedAstro] = useState<Astrologer | null>(null);

  const t = (key: string) => getUIText(lang || "hi", key);

  const walletBalanceRupees = (me?.user?.walletBalancePaise ?? 0) / 100;

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    // Main Background - Deep Dark Navy (Premium Look)
    <main className="min-h-[100dvh] w-full pb-40 bg-[#070b14] text-slate-100 font-sans">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[#070b14]/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2.5">
          {/* Glowing Logo Effect */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-orange-500 blur-md opacity-30 rounded-full"></div>
            <img src="/icon-192.png" alt="Gita Logo" className="relative z-10 h-9 w-9 rounded-full object-cover border border-orange-500/30" onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=G&background=ff6b00&color=fff'; }}/>
          </div>
          <span className="text-[17px] font-bold tracking-tight text-white">{t("appName")}</span>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button className="rounded-full p-2 bg-[#151d2c] text-slate-300 hover:bg-[#1f2937] transition-colors">
            <Settings size={18} strokeWidth={2} />
          </button>
          <Link href="/wallet" className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold bg-[#151d2c] text-slate-200 border border-[#2a3547] hover:bg-[#1f2937] transition-colors">
            ₹{me?.user ? walletBalanceRupees : "3"}
            <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#ff6b00] text-[10px] text-white ml-0.5">+</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-xl space-y-5 px-4 py-4">
        
        {/* HERO BANNER */}
        <section className="relative overflow-hidden rounded-[1.2rem] bg-gradient-to-r from-[#FF5A00] via-[#FF3D00] to-[#D30000] p-5 text-white shadow-[0_8px_30px_rgba(255,61,0,0.2)]">
          {/* Subtle Star Graphic Overlay */}
          <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
          
          <div className="relative z-10 space-y-1.5">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-orange-100">
              <Sparkles size={13} className="text-amber-200" /> {t("specialOffer")}
            </p>
            <h2 className="text-[28px] font-extrabold leading-tight text-white tracking-tight">{t("freeChat")}</h2>
            <p className="text-[12px] font-medium text-orange-50 max-w-[85%]">{t("heroSub")}</p>
            
            <Link href="/chat" className="mt-3.5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-[13px] font-bold text-[#FF3D00] shadow-sm transition-transform active:scale-95">
              {t("startFreeChat")} <ChevronRight size={16} strokeWidth={3} />
            </Link>
          </div>
        </section>

        {/* PRO TIPS (Free Tools) */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4.5 bg-[#ff6b00] rounded-full"></div>
            <h2 className="text-[16px] font-bold text-white tracking-wide">
              {t("proTips")}
            </h2>
          </div>
          
          <div className="flex justify-between items-center overflow-x-auto gap-3 pb-2 scrollbar-hide">
            {[
              { name: t("kundli"), icon: Scroll, href: "/kundli" },
              { name: t("matching"), icon: Heart, href: "/matching" },
              { name: t("horoscope"), icon: Sun, href: "/daily" },
              { name: t("panchang"), icon: CalendarDays, href: "/panchang" },
              { name: t("palmistry"), icon: Hand, href: "/palmistry" },
              { name: t("gemstone"), icon: Gem, href: "/remedies" },
              { name: t("calSetting"), icon: ScanFace, href: "/settings" },
            ].map((tool, idx) => (
              <Link key={idx} href={tool.href} className="flex flex-col items-center justify-center gap-2 min-w-[65px]">
                <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-[#2a3547] bg-[#121927] text-[#ff6b00] transition-all hover:border-[#ff6b00] hover:bg-[#ff6b00]/10">
                  <tool.icon size={22} strokeWidth={1.5} />
                </div>
                <span className="text-[11px] font-semibold text-slate-300 whitespace-nowrap">{tool.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ASTROLOGER LIST */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4.5 bg-[#ff6b00] rounded-full"></div>
              <h2 className="text-[16px] font-bold text-white tracking-wide">
                {t("talkTo")}
              </h2>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span> {t("online")}
            </span>
          </div>

          <div className="space-y-4">
            {ASTROLOGERS.map((astro) => {
              const firstReview = astro.reviews[0];
              
              return (
                <article key={astro.id} className="rounded-[1.2rem] bg-[#121927] p-4 shadow-sm border border-[#1f2937]">
                  <div className="flex gap-3.5">
                    {/* Avatar */}
                    <div className="relative h-[68px] w-[68px] shrink-0">
                      <img src={astro.image} alt={astro.name} className="h-full w-full object-cover rounded-full border border-slate-700" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${astro.name}&background=ff6b00&color=fff`; }} />
                      <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-[2.5px] border-[#121927] bg-emerald-500"></span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-[16px] font-bold text-white">{astro.name}</h3>
                          {astro.isCelebrity && <span className="rounded-md bg-[#FEF3C7] px-1.5 py-0.5 text-[9px] font-extrabold text-amber-800 tracking-wide">Celebrity</span>}
                        </div>
                        <p className="text-[12px] font-medium text-slate-400 mt-0.5">{astro.specialty}</p>
                        
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 mt-1.5">
                          <Star size={11} fill="#ff6b00" className="text-[#ff6b00]" /> {astro.rating}
                          <span className="text-slate-500">•</span>
                          <span>{astro.experience}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        <p className="text-[17px] font-black text-[#ff6b00]">
                          ₹{astro.price} <span className="text-[11px] font-medium text-slate-400 ml-0.5">/ {t("min")}</span>
                        </p>
                        <Link href={`/chat/${astro.id}`} className="rounded-full bg-gradient-to-r from-[#ff7b00] to-[#ff5a00] px-5 py-1.5 text-[12px] font-bold text-white shadow-md shadow-orange-500/20 active:scale-95 transition-transform">
                          {t("chatNow")}
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* REVIEW PREVIEW & READ MORE */}
                  <div className="mt-3.5 rounded-xl bg-[#090d15] p-3 text-[12.5px] leading-relaxed border border-[#1f2937]/70">
                    <div className="flex items-center gap-0.5 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill={i < firstReview.rating ? "#ff6b00" : "none"} className="text-[#ff6b00]" />
                      ))}
                      <span className="ml-1.5 font-bold text-slate-300">- {firstReview.author}</span>
                    </div>
                    <p className="text-slate-300 font-medium">
                      "{firstReview.text}"{" "}
                      <button 
                        onClick={() => setSelectedAstro(astro)} 
                        className="text-[#ff6b00] font-bold hover:underline ml-0.5 cursor-pointer"
                      >
                        - {t("readMore")}
                      </button>
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {/* BOTTOM STICKY BANNER (Pink/Red) */}
      <div className="fixed bottom-[64px] left-0 right-0 z-40 px-4 pb-2 bg-gradient-to-t from-[#070b14] via-[#070b14]/90 to-transparent pt-6">
        <div className="mx-auto max-w-xl rounded-full bg-gradient-to-r from-[#F5156B] to-[#D30038] p-1 shadow-[0_4px_20px_rgba(245,21,107,0.3)] flex items-center justify-between pl-3 pr-1 border border-pink-500/30">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Crown size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-pink-100 tracking-wide">{t("stickyTitle")}</p>
              <p className="text-[14px] font-black text-white">{t("stickySub")}</p>
            </div>
          </div>
          <button className="bg-white rounded-full h-10 w-10 flex items-center justify-center shadow-sm active:scale-95 transition-transform">
            <Crown size={20} className="text-[#D30038]" />
          </button>
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#070b14] border-t border-[#1f2937] pb-safe">
        <div className="flex justify-between items-center px-6 py-2 max-w-xl mx-auto">
          <Link href="/" className="flex flex-col items-center gap-1 text-[#ff6b00]">
            <Home size={22} strokeWidth={2.5} />
            <span className="text-[10px] font-bold">{t("home")}</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
            <MessageCircle size={22} strokeWidth={2} />
            <span className="text-[10px] font-medium">{t("chat")}</span>
          </Link>
          <Link href="/daily" className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
            <Sun size={22} strokeWidth={2} />
            <span className="text-[10px] font-medium">{t("daily")}</span>
          </Link>
          <Link href="/history" className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
            <History size={22} strokeWidth={2} />
            <span className="text-[10px] font-medium">{t("history")}</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
            <User size={22} strokeWidth={2} />
            <span className="text-[10px] font-medium">{t("profile")}</span>
          </Link>
        </div>
      </nav>

      {/* 🔥 MODAL / POPUP FOR ALL REVIEWS (Click on "Aur Padhe") */}
      {selectedAstro && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl bg-[#121927] border-t sm:border border-[#1f2937] max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1f2937]">
              <div className="flex items-center gap-3">
                <img src={selectedAstro.image} alt={selectedAstro.name} className="h-10 w-10 rounded-full object-cover border border-slate-600" />
                <div>
                  <h3 className="font-bold text-[16px] text-white">{selectedAstro.name}</h3>
                  <p className="text-xs text-slate-400">{t("reviews")} ({selectedAstro.reviews.length})</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAstro(null)}
                className="p-2 rounded-full bg-[#1f2937] text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body - Scrollable List of Reviews */}
            <div className="overflow-y-auto space-y-3 pr-1 scrollbar-hide">
              {selectedAstro.reviews.map((rev, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#090d15] border border-[#1f2937]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-[13px] text-slate-200">{rev.author}</span>
                    <div className="flex gap-0.5 text-[#ff6b00]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[13px] leading-relaxed text-slate-300 font-medium">
                    "{rev.text}"
                  </p>
                </div>
              ))}
            </div>
            
            {/* Modal Footer */}
            <div className="pt-4 mt-2">
              <button 
                onClick={() => setSelectedAstro(null)}
                className="w-full py-3 rounded-xl font-bold bg-[#ff6b00] text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
// app/page.tsx
"use client";

import { useState } from "react";
import { useApp } from "./Providers";
import {
  Home,
  MessageCircle,
  Sun,
  CalendarDays,
  User,
  Star,
  Eye,
  Settings,
  Sparkles,
  Hand,
  ScanFace,
  Heart,
  Scroll,
} from "lucide-react";
import Link from "next/link";

type Astrologer = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  chats: string;
  experience: string;
  price: number;
  oldPrice: number;
  image: string;
  isCelebrity?: boolean;
  review: string;
  reviewer: string;
};

const ASTROLOGERS: Astrologer[] = [
  {
    id: "gita",
    name: "Gita",
    specialty: "Tarot • Love & Relationship",
    rating: 4.9,
    chats: "12.4k+",
    experience: "5 Years",
    price: 19,
    oldPrice: 29,
    image: "/astrologers/riya.jpg", // Gita uses Riya's photo from your folder
    review: "Bohot tension mein thi breakup ke baad. Gita ji ne bilkul calm karke sab samjhaya. Paisa vasool consultation. Thank you so much di ❤️",
    reviewer: "Priya S."
  },
  {
    id: "kriti",
    name: "Acharya Kriti",
    specialty: "Vedic • Kundli",
    rating: 4.8,
    chats: "18.7k+",
    experience: "7 Years",
    price: 22,
    oldPrice: 35,
    image: "/astrologers/kriti.jpg",
    review: "Sach mein bahut relief mila. Job switch karna tha par dar lag raha tha. Kriti ji ne kundli dekh kar exact date batayi. Ab confidence hai. 🌟",
    reviewer: "Rahul Verma"
  },
  {
    id: "devaki",
    name: "Dr. Devaki Shastri",
    specialty: "Vedic • KP System",
    rating: 4.9,
    chats: "31k+",
    experience: "15 Years",
    price: 25,
    oldPrice: 45,
    image: "/astrologers/devaki.jpg",
    isCelebrity: true,
    review: "Devaki ma'am is really an expert. Rishta tootne wala tha, unhone remedies bataye aur sab thik ho gaya. Highly recommended for serious issues.",
    reviewer: "Neha M."
  },
  {
    id: "gargi",
    name: "Gargi Maa",
    specialty: "Spiritual Healing • Vastu",
    rating: 4.95,
    chats: "42k+",
    experience: "25+ Years",
    price: 18,
    oldPrice: 30,
    image: "/astrologers/gargi.jpg",
    review: "Ghar me pichle 2 saal se bahut kalesh tha. Gargi maa ne simple upay bataye the, believe nahi ho raha par shanti aa gayi hai. Really grateful maa 🙏",
    reviewer: "Vikram R."
  },
];

export default function HomePage() {
  const { lang, theme } = useApp();
  const [activeTab, setActiveTab] = useState("home");

  const isDark = theme === "dark";
  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  const t = (hi: string, hing: string, en: string) =>
    isHindi ? hi : isHinglish ? hing : en;

  return (
    <main
      className={`min-h-screen w-full pb-32 transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-violet-50" : "bg-[#FEF8EF] text-slate-900"
      }`}
    >
      {/* HEADER */}
      <header
        className={`sticky top-0 z-40 flex items-center justify-between px-4 py-3 shadow-sm ${
          isDark ? "bg-slate-900" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
            G
          </div>
          <span className="text-lg font-bold">GitaTalk</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className={`rounded-full p-2 ${
              isDark ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-600"
            }`}
          >
            <Settings size={18} />
          </Link>
          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
              isDark ? "bg-slate-800 text-orange-400" : "bg-orange-50 text-orange-600"
            }`}
          >
            ₹0
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
              +
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-xl space-y-7 px-4 py-5">
        {/* HERO BANNER */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-5 text-white shadow-lg">
          <div className="relative z-10 space-y-2">
            <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-orange-100">
              <Sparkles size={14} /> {t("स्पेशल ऑफर", "Special Offer", "Special Offer")}
            </p>
            <h2 className="text-2xl font-black">
              {t("पहली चैट फ्री 🎉", "First Chat FREE 🎉", "First Chat FREE 🎉")}
            </h2>
            <p className="text-xs font-medium text-orange-100">
              {t(
                "4 एक्सपर्ट ज्योतिषी • तुरंत जवाब • 100% गोपनीयता",
                "4 expert Astrologers • Instant replies • 100% Privacy",
                "4 expert Astrologers • Instant replies • 100% Privacy"
              )}
            </p>
            <Link 
              href="/chat"
              className="mt-3 inline-block rounded-full bg-white px-5 py-2 text-sm font-bold text-orange-600 shadow-sm transition hover:bg-orange-50 active:scale-95"
            >
              {t("फ्री चैट शुरू करें", "Start Free Chat", "Start Free Chat")}
            </Link>
          </div>
          <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-8 right-10 h-24 w-24 rounded-full bg-yellow-300/20 blur-xl" />
        </section>

        {/* FREE TOOLS */}
        <section className="space-y-3">
          <h3 className={`text-sm font-bold ${isDark ? "text-slate-300" : "text-gray-700"}`}>
            {t("फ्री टूल्स", "Free Tools", "Free Tools")}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: t("कुंडली", "Kundli", "Kundli"), icon: Scroll, href: "/kundli" },
              { name: t("मिलान", "Matching", "Matching"), icon: Heart, href: "/matching" },
              { name: t("राशिफल", "Horoscope", "Horoscope"), icon: Sun, href: "/daily" },
              { name: t("पंचांग", "Panchang", "Panchang"), icon: CalendarDays, href: "#" },
              { name: t("हस्तरेखा", "Palmistry", "Palmistry"), icon: Hand, href: "/palmistry" },
              { name: t("फेस रीडिंग", "Face Reading", "Face Reading"), icon: ScanFace, href: "/face-reading" },
            ].map((tool, idx) => (
              <Link
                key={idx}
                href={tool.href}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center transition hover:scale-105 ${
                  isDark
                    ? "border-slate-700 bg-slate-900"
                    : "border-orange-100 bg-white shadow-sm"
                }`}
              >
                <div className="text-orange-500">
                  <tool.icon size={22} />
                </div>
                <span className="text-[11px] font-semibold">{tool.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ASTROLOGER LIST */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-bold ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              {t("ज्योतिषियों से बात करें", "Talk to Astrologers", "Talk to Astrologers")}
            </h3>
            <span className="text-xs font-semibold text-orange-500">
              {t("4 ऑनलाइन", "4 Online", "4 Online")}
            </span>
          </div>

          <div className="space-y-4">
            {ASTROLOGERS.map((astro) => (
              <div
                key={astro.id}
                className={`flex flex-col gap-3 rounded-2xl border p-3 shadow-sm ${
                  isDark ? "border-slate-700 bg-slate-900" : "border-orange-100 bg-white"
                }`}
              >
                <div className="flex gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-orange-200">
                    <img
                      src={astro.image}
                      alt={astro.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${astro.name}&background=f97316&color=fff`;
                      }}
                    />
                    <span className="absolute bottom-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-green-500"></span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold">{astro.name}</h4>
                        {astro.isCelebrity && (
                          <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[9px] font-bold text-yellow-700">
                            Celebrity
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-gray-500">
                        {astro.specialty}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[10px] font-semibold text-gray-500">
                        <span className="flex items-center gap-0.5 text-yellow-500">
                          <Star size={10} fill="currentColor" /> {astro.rating}
                        </span>
                        <span>• {astro.chats} chats</span>
                        <span>• {astro.experience}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[10px]">
                        <span className="flex items-center gap-1 font-bold text-green-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Online
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <Eye size={10} /> {Math.floor(Math.random() * 30) + 20} viewing
                        </span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-2">
                      <div>
                        <p className="text-sm font-black text-orange-600">
                          ₹{astro.price}{" "}
                          <span className="text-[10px] font-medium text-gray-400 line-through">
                            ₹{astro.oldPrice}
                          </span>
                          <span className="text-[10px] text-gray-400"> /min</span>
                        </p>
                      </div>
                      {/* YAHAN LINK LAGA HAI */}
                      <Link 
                        href={`/chat/${astro.id}`}
                        className="rounded-full bg-orange-500 px-4 py-1.5 text-xs font-bold text-white shadow transition hover:bg-orange-600 active:scale-95"
                      >
                        {t("चैट करें", "Chat Now", "Chat Now")}
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* REVIEW */}
                <div className={`mt-1 rounded-lg p-2 text-[11px] leading-tight ${isDark ? "bg-slate-800 text-slate-300" : "bg-gray-50 text-gray-600"}`}>
                  <div className="flex items-center gap-1 mb-1">
                    <Star size={10} fill="#FBBF24" className="text-yellow-500" />
                    <Star size={10} fill="#FBBF24" className="text-yellow-500" />
                    <Star size={10} fill="#FBBF24" className="text-yellow-500" />
                    <Star size={10} fill="#FBBF24" className="text-yellow-500" />
                    <Star size={10} fill="#FBBF24" className="text-yellow-500" />
                    <span className="font-semibold ml-1">- {astro.reviewer}</span>
                  </div>
                  <p className="italic">"{astro.review}"</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* BOTTOM NAVIGATION */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t px-2 py-2 ${
          isDark ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white"
        }`}
      >
        {[
          { id: "home", label: t("होम", "Home", "Home"), icon: Home, href: "/" },
          { id: "chat", label: t("चैट", "Chat", "Chat"), icon: MessageCircle, href: "/chat" },
          { id: "daily", label: t("दैनिक", "Daily", "Daily"), icon: Sun, href: "/daily" },
          { id: "kundli", label: t("कुंडली", "Kundli", "Kundli"), icon: Scroll, href: "/kundli" },
          { id: "profile", label: t("प्रोफाइल", "Profile", "Profile"), icon: User, href: "/settings" },
        ].map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center gap-1 p-1 ${
              activeTab === item.id
                ? "text-orange-500"
                : isDark
                ? "text-slate-400"
                : "text-gray-500"
            }`}
          >
            <item.icon size={20} />
            <span className="text-[9px] font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* FIXED RED BAR (Changed text & Linked to Chat) */}
      <div className="fixed bottom-[60px] left-0 right-0 z-40 mx-auto max-w-xl px-2">
        <Link
          href="/chat"
          className="flex items-center justify-between gap-3 rounded-t-xl bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 px-4 py-2 text-white shadow-xl"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
              <MessageCircle size={14} />
            </span>
            <div className="leading-tight">
              <p className="text-[9px] font-black uppercase tracking-wider text-rose-100">
                {isHindi ? "ज्योतिषी • 24x7 उपलब्ध" : "Astrologer • 24x7 Available"}
              </p>
              <p className="text-xs font-black">
                {isHindi ? "अभी बात करें — पहली चैट FREE" : "Talk Now — First Chat FREE"}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-rose-700">
            {isHindi ? "चैट" : "Chat"}
          </span>
        </Link>
      </div>
    </main>
  );
}
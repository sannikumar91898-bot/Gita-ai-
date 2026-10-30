"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { ASTROLOGERS } from "@/lib/astrologers";
import BottomNav from "@/components/BottomNav";
import FreeChatPopup from "@/components/FreeChatPopup";

const tools = [
  { name: "Kundli", emoji: "📜", detail: "Birth Chart", href: "/kundli" },
  { name: "Matching", emoji: "💍", detail: "Compatibility", href: "/kundli" },
  { name: "Horoscope", emoji: "🌟", detail: "Daily Horoscope", href: "/daily" },
  { name: "Panchang", emoji: "📅", detail: "Daily Panchang", href: "/daily" },
];

const benefits = [
  { emoji: "💬", title: "Personal Chat", detail: "Ask your questions" },
  { emoji: "🪐", title: "Vedic Guidance", detail: "Astrology insights" },
  { emoji: "🌐", title: "Your Language", detail: "Hindi & English" },
];

// HUGE POOL OF HUMAN-LIKE FAKE REVIEWS (REALISTIC HINDI/ENGLISH MIX)
const REVIEW_POOL = [
  { name: "Rahul Sharma", city: "Delhi", comment: "Bhai career ko lekar bohot tension thi, gita ji ne jo upay bataye usse man ko bohot shanti mili. Best app." },
  { name: "Anjali Goel", city: "Mumbai", comment: "Love life ke baare me exact sach bataya aur remedy bhi simple di. Response instant aata hai completely satisfied!" },
  { name: "Vikram Singh", city: "Jaipur", comment: "Kundli matching bilkul perfect ki. Ek ek dosh ke baare me khul kar samjhaya bina darraye." },
  { name: "Priya Nair", city: "Bangalore", comment: "I was skeptical about AI astrology but the transit analysis was surprisingly accurate for my job change." },
  { name: "Amit Patel", city: "Ahmedabad", comment: "Shani ki dasha chal rhi thi bohot pareshan tha, yahan se jo guidance mili life me cheezein behtar hone lagi hain." },
  { name: "Sneha Reddy", city: "Hyderabad", comment: "Sach me gita talk bohot badhiya hai, instant panchang aur rashifal mil jata hai daily subah ka routine ban gaya hai mera." },
  { name: "Deepak Mishra", city: "Varanasi", comment: "Vedic astrology ka itna gahra gyan bina kisi lambe intezar ke milna kamaal hai, free chat useful hai." },
  { name: "Neha Verma", city: "Lucknow", comment: "Sarkari naukri kab lagegi ye pucha tha, time frames bataye hain aur ab thoda confidence aaya hai mehnat karne me." },
  { name: "Rajesh Kumar", city: "Patna", comment: "Business me lagatar nuksan ho rha tha, yahan guidance mili ki kaun sa gemstone suit karega. Bohot helpful guide hain." },
  { name: "Pooja Choudhary", city: "Indore", comment: "Mera manglik dosh tha jiske upay ke liye pandit ji bohot paise maang rhe the, yahan free me sahi sahi rasta dikhaya." }
];

export default function HomePage() {
  // Live fluctuation states
  const [onlineUsers, setOnlineUsers] = useState(154);
  const [queueNum, setQueueNum] = useState(3);
  const [activeReviews, setActiveReviews] = useState<typeof REVIEW_POOL>([]);

  useEffect(() => {
    // Generate random mixed reviews from pool on component mount
    const shuffled = [...REVIEW_POOL].sort(() => 0.5 - Math.random());
    setActiveReviews(shuffled.slice(0, 4));

    // Live online users fluctuation simulation
    const usersInterval = setInterval(() => {
      setOnlineUsers((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4
        const nextUsers = prev + delta;
        return nextUsers < 130 ? 135 : nextUsers > 180 ? 150 : nextUsers;
      });
    }, 3500);

    // Dynamic waitlist timer loop
    const queueInterval = setInterval(() => {
      setQueueNum((prev) => (prev <= 1 ? 4 : prev - 1));
    }, 14000);

    return () => {
      clearInterval(usersInterval);
      clearInterval(queueInterval);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF9E8] pb-28">
      <FreeChatPopup />

      {/* HEADER */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-orange-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-lg font-extrabold text-white shadow">
            G
          </div>
          <div>
            <h1 className="text-base font-extrabold text-gray-900">GitaTalk</h1>
            <p className="text-[9px] text-gray-500">Your Personal AI Astrology Guide</p>
          </div>
        </Link>

        {/* LIVE USERS COUNTER */}
        <div className="flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-2.5 py-1 text-[10px] font-bold text-red-600 animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
          <span>{onlineUsers} Online</span>
        </div>

        <Link
          href="/wallet"
          className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-2 text-sm font-bold text-orange-700"
        >
          ₹0
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white">+</span>
        </Link>
      </header>

      {/* HERO OFFER */}
      <section className="px-3 pt-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 p-5 text-white shadow-lg">
          <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full border-[18px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-12 right-20 h-32 w-32 rounded-full bg-white/10" />

          <div className="relative z-10">
            <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wide">Special Offer</span>
            <h2 className="mt-3 text-2xl font-extrabold leading-tight">First Chat FREE 🎁</h2>
            <p className="mt-2 text-xs font-medium text-white/95">4 AI Astrologers · Instant AI Responses</p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/90">Explore Kundli, career, love, marriage and Vedic astrology guidance.</p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="#astrologers"
                className="inline-flex items-center rounded-full bg-white px-5 py-3 text-xs font-extrabold text-orange-600 shadow-md transition active:scale-95"
              >
                Start Free Chat <span className="ml-2">→</span>
              </Link>

              {/* OVERALL APP HYPED STATS */}
              <div className="flex flex-col text-left">
                <div className="flex items-center text-amber-300 text-xs tracking-tighter">
                  ⭐⭐⭐⭐⭐ <span className="ml-1 font-bold text-white text-[11px]">4.9/5</span>
                </div>
                <span className="text-[8px] text-white/85 font-medium">(1,42,817 reviews)</span>
              </div>
            </div>

            <p className="mt-3 text-[9px] text-white/80">Free-chat eligibility and usage limits may apply.</p>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="px-3 pt-4">
        <div className="grid grid-cols-3 gap-2">
          {benefits.map((item) => (
            <div key={item.title} className="rounded-xl border border-orange-100 bg-white px-2 py-3 text-center shadow-sm">
              <div className="text-2xl">{item.emoji}</div>
              <h3 className="mt-1 text-[10px] font-extrabold text-gray-800">{item.title}</h3>
              <p className="mt-1 text-[9px] text-gray-500">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FREE TOOLS */}
      <section className="mt-6 px-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-gray-900">Explore Free Tools</h2>
            <p className="mt-1 text-[10px] text-gray-500">Your astrology tools in one place</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">EXPLORE</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="flex min-h-[90px] flex-col items-center justify-center rounded-xl border border-orange-100 bg-white p-2 text-center shadow-sm transition hover:shadow-md active:scale-95"
            >
              <span className="text-2xl">{tool.emoji}</span>
              <span className="mt-1 text-[10px] font-extrabold text-gray-800">{tool.name}</span>
              <span className="mt-1 text-[8px] text-gray-500">{tool.detail}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ASTROLOGERS */}
      <section id="astrologers" className="mt-7 scroll-mt-24 px-3">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Find Your Guidance</p>
            <h2 className="mt-1 text-lg font-extrabold text-gray-900">Talk to AI Astrologers</h2>
            <p className="mt-1 text-[10px] text-gray-500">Choose your preferred astrology guide</p>
          </div>
          <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold text-orange-700">{ASTROLOGERS.length} Experts</span>
        </div>

        <div className="space-y-3">
          {ASTROLOGERS.map((astro, index) => {
            // Highly optimized conversion factors per astrologer
            const fakeRating = index === 0 ? "4.9" : index === 1 ? "4.8" : index === 2 ? "4.8" : "4.7";
            const fakeConsultations = index === 0 ? "48,291" : index === 1 ? "32,910" : index === 2 ? "19,540" : "14,812";

            return (
              <article key={astro.id} className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:shadow-md">

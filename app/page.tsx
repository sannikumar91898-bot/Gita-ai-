"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { ASTROLOGERS } from "@/lib/astrologers";
import BottomNav from "@/components/BottomNav";
import FreeChatPopup from "@/components/FreeChatPopup";

const FREE_TOOLS = [
  {
    name: "Kundli",
    emoji: "📜",
    description: "Birth chart",
    href: "/kundli",
  },
  {
    name: "Matching",
    emoji: "💍",
    description: "Compatibility",
    href: "/kundli",
  },
  {
    name: "Horoscope",
    emoji: "🌟",
    description: "Daily guidance",
    href: "/daily",
  },
  {
    name: "Panchang",
    emoji: "📅",
    description: "Aaj ka Panchang",
    href: "/daily",
  },
];

export default function HomePage() {
  // Realtime fake stats states
  const [onlineUsers, setOnlineUsers] = useState(143);
  const [queueNum, setQueueNum] = useState(4);

  useEffect(() => {
    // Fake live users fluctuate dynamically
    const usersInterval = setInterval(() => {
      setOnlineUsers((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const nextUsers = prev + delta;
        return nextUsers < 120 ? 125 : nextUsers > 160 ? 152 : nextUsers;
      });
    }, 4000);

    // Fake queue decreases over time then resets
    const queueInterval = setInterval(() => {
      setQueueNum((prev) => (prev <= 1 ? 5 : prev - 1));
    }, 12000);

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
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-extrabold text-white shadow-sm">
            G
          </div>

          <div>
            <h1 className="text-base font-extrabold tracking-tight text-gray-900">
              GitaTalk
            </h1>
            <p className="text-[9px] font-medium text-gray-500">
              Your Personal AI Astrology Guide
            </p>
          </div>
        </Link>

        {/* FAKE LIVE USERS BADGE */}
        <div className="flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-2.5 py-1 text-[10px] font-bold text-red-600 animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
          <span>{onlineUsers} Online</span>
        </div>

        <Link
          href="/wallet"
          className="flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-sm font-bold text-orange-700"
        >
          <span>₹0</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
            +
          </span>
        </Link>
      </header>

      {/* PROMOTIONAL HERO */}
      <section className="px-3 pt-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 p-5 text-white shadow-lg">
          <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full border-[18px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-12 right-16 h-32 w-32 rounded-full bg-white/10" />

          <div className="relative z-10">
            <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wide">
              Special Offer
            </span>

            <h2 className="mt-2 text-2xl font-extrabold leading-tight">
              First Chat FREE 🎁
            </h2>

            <p className="mt-1 text-xs font-medium text-white/95">
              4 AI Astrologers · Hindi · Hinglish · English
            </p>

            <p className="mt-2 max-w-[280px] text-xs leading-relaxed text-white/90">
              Kundli, career, love, marriage aur Vedic astrology guidance.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="#astrologers"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-xs font-extrabold text-orange-600 shadow-md transition hover:bg-orange-50 active:scale-95"
              >
                Start Free Chat
                <span className="ml-2">→</span>
              </Link>
              
              {/* FAKE OVERALL RATING */}
              <div className="flex flex-col text-left">
                <div className="flex items-center text-amber-300 text-xs tracking-tighter">
                  ⭐⭐⭐⭐⭐ <span className="ml-1 font-bold text-white text-[11px]">4.9/5</span>
                </div>
                <span className="text-[8px] text-white/80 font-medium">(42,817 reviews)</span>
              </div>
            </div>

            <p className="mt-3 text-[9px] text-white/80">
              Offer eligibility and free-chat limits may apply.
            </p>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="px-3 pt-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              emoji: "💬",
              title: "Personal Chat",
              subtitle: "Ask your questions",
            },
            {
              emoji: "🪐",
              title: "Vedic Guidance",
              subtitle: "Astrology insights",
            },
            {
              emoji: "🌐",
              title: "Your Language",
              subtitle: "Hindi & English",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-orange-100 bg-white px-2 py-3 text-center shadow-sm"
            >
              <div className="text-xl">{item.emoji}</div>
              <h3 className="mt-1 text-[10px] font-extrabold text-gray-800">
                {item.title}
              </h3>
              <p className="mt-0.5 text-[9px] text-gray-500">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FREE TOOLS */}
      <section className="mt-6 px-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-gray-900">
              Explore Free Tools
            </h2>
            <p className="mt-0.5 text-[10px] text-gray-500">
              Discover your astrology insights
            </p>
          </div>

          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">
            FREE TO EXPLORE
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {FREE_TOOLS.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="flex min-h-[91px] flex-col items-center justify-center rounded-xl border border-orange-100 bg-white p-2 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-95"
            >
              <span className="text-2xl">{tool.emoji}</span>
              <span className="mt-1 text-[10px] font-extrabold text-gray-800">
                {tool.name}
              </span>
              <span className="mt-0.5 text-[8px] text-gray-500">
                {tool.description}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ASTROLOGERS SECTION */}
      <section id="astrologers" className="mt-7 scroll-mt-24 px-3">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
              Find Your Guidance
            </span>

            <h2 className="mt-1 text-lg font-extrabold text-gray-900">
              Talk to AI Astrologers
            </h2>

            <p className="mt-1 text-[10px] text-gray-500">
              Choose the guide that matches your needs
            </p>
          </div>

          <span className="mb-1 rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold text-orange-700">
            {ASTROLOGERS.length} Experts
          </span>
        </div>

        <div className="space-y-3">
          {ASTROLOGERS.map((astro, index) => {
            // High ratings for conversion setup
            const fakeRating = index === 0 ? "4.9" : index === 1 ? "4.8" : "4.7";
            const fakeOrders = index === 0 ? "12.4K" : index === 1 ? "8.9K" : "5.1K";

            return (
              <article
                key={astro.id}
                className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* ASTROLOGER DETAILS */}
                <div className="flex gap-3 p-3.5">
                  <div className="relative h-[76px] w-[76px] flex-shrink-0 overflow-hidden rounded-full border-[3px] border-orange-100 bg-orange-50 shadow-sm">
                    <Image
                      src={astro.photo}
                      alt={astro.name}
                      fill
                      sizes="76px"
                      className="object-cover"
                    />

                    <span className="absolute inset-x-0 bottom-0 bg-emerald-600 py-0.5 text-center text-[8px] font-extrabold text-white">
                      AI GUIDE
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="text-sm font-extrabold text-gray-900">


"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ASTROLOGERS } from "@/lib/astrologers";
import BottomNav from "@/components/BottomNav";
import FreeChatPopup from "@/components/FreeChatPopup";
import ReviewsSection from "@/components/ReviewsSection";

export default function HomePage() {
  const router = useRouter();

  const [activeReviewAstro, setActiveReviewAstro] =
    useState<string | null>(null);

  const handleChatClick = (astroId: string) => {
    router.push(`/chat/${astroId}`);
  };

  return (
    <div className="min-h-screen bg-[#FFF9E6] pb-24">
      <FreeChatPopup />

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-orange-100 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-bold text-white">
            G
          </div>

          <span className="text-lg font-bold text-gray-900">
            GitaTalk
          </span>
        </div>

        <Link
          href="/wallet"
          className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700"
        >
          <span>₹0</span>
          <span className="rounded-full bg-orange-500 px-1.5 py-0.5 text-xs text-white">
            +
          </span>
        </Link>
      </header>

      {/* Hero */}
      <section className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white shadow-lg">
          <p className="text-sm font-medium opacity-90">
            Special Offer
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            First Chat FREE 🎁
          </h2>

          <p className="mt-1 text-sm opacity-90">
            4 AI Astrologers • Instant guidance
          </p>

          <Link
            href="#astrologers"
            className="mt-4 inline-block rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-orange-600 shadow"
          >
            Start Free Chat
          </Link>
        </div>
      </section>

      {/* Free Tools */}
      <section className="mt-6 px-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">
          Free Tools
        </h3>

        <div className="grid grid-cols-4 gap-3">
          {[
            { name: "Kundli", emoji: "📜", href: "/kundli" },
            { name: "Matching", emoji: "💍", href: "/kundli" },
            { name: "Horoscope", emoji: "🌟", href: "/daily" },
            { name: "Panchang", emoji: "📅", href: "/daily" },
          ].map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-orange-50 bg-white p-3 shadow-sm"
            >
              <span className="text-2xl">{tool.emoji}</span>
              <span className="text-[11px] font-medium text-gray-700">
                {tool.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Astrologers */}
      <section id="astrologers" className="mt-8 px-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">
            Talk to Astrologers
          </h3>

          <span className="text-xs font-medium text-orange-600">
            {ASTROLOGERS.length} Available
          </span>
        </div>

        <div className="space-y-4">
          {ASTROLOGERS.map((astro) => (
            <article
              key={astro.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm"
            >
              {/* Profile */}
              <button
                type="button"
                onClick={() => setActiveReviewAstro(astro.name)}
                aria-label={`Read ${astro.name} reviews`}
                className="group flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
              >
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-orange-100">
                  <Image
                    src={astro.photo}
                    alt={astro.name}
                    fill
                    sizes="56px"
                    className="object-cover transition-transform group-hover:scale-105"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-emerald-600 py-0.5 text-center text-[8px] font-bold tracking-tight text-white">
                    AI
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="truncate text-sm font-bold text-gray-950">
                      {astro.name}
                    </h4>

                    {astro.isCelebrity && (
                      <span className="rounded-sm bg-amber-400 px-1 text-[9px] font-semibold text-amber-950">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-gray-500">
                    {astro.expertise.join(" • ")}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-gray-400">
                    <span className="font-bold text-orange-500">
                      ★ {astro.rating.toFixed(1)}
                    </span>

                    <span>•</span>

                    <span>{astro.totalChats} chats</span>
                  </div>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-900">
                      ₹{astro.pricePerMin}/min
                    </span>

                    {astro.originalPrice > astro.pricePerMin && (
                      <span className="text-[10px] text-gray-400 line-through">
                        ₹{astro.originalPrice}/min
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {/* Chat Button */}
              <button
                type="button"
                onClick={() => handleChatClick(astro.id)}
                className="whitespace-nowrap rounded-full bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-95"
              >
                Chat Now
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <ReviewsSection
        selectedAstrologer={activeReviewAstro}
        onClose={() => setActiveReviewAstro(null)}
      />

      <BottomNav />
    </div>
  );
}

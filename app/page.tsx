
"use client";

import Image from "next/image";
import Link from "next/link";

import { ASTROLOGERS } from "@/lib/astrologers";
import BottomNav from "@/components/BottomNav";
import FreeChatPopup from "@/components/FreeChatPopup";

export default function HomePage() {
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
            Welcome to GitaTalk
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Your Personal AI Astrologers 🌟
          </h2>

          <p className="mt-2 text-sm opacity-90">
            Kundli, career, relationships and Vedic astrology guidance.
          </p>

          <Link
            href="#astrologers"
            className="mt-4 inline-block rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-orange-600 shadow"
          >
            Explore Astrologers
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

      {/* AI Astrologers */}
      <section id="astrologers" className="mt-8 px-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Talk to Astrologers
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Choose your preferred AI astrologer
            </p>
          </div>

          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            {ASTROLOGERS.length} AI Experts
          </span>
        </div>

        <div className="space-y-4">
          {ASTROLOGERS.map((astro) => (
            <article
              key={astro.id}
              className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm"
            >
              <div className="flex items-start gap-3 p-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-orange-100">
                  <Image
                    src={astro.photo}
                    alt={astro.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-emerald-600 py-0.5 text-center text-[8px] font-bold text-white">
                    AI
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h4 className="text-sm font-bold text-gray-950">
                      {astro.name}
                    </h4>

                    {astro.isCelebrity && (
                      <span className="rounded-sm bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-800">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                    {astro.expertise.join(" • ")}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                      AI Astrologer
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {astro.languages.join(" / ")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-orange-50 px-4 py-3">
                <div>
                  <span className="text-lg font-bold text-orange-600">
                    ₹{astro.pricePerMin}
                  </span>

                  {astro.originalPrice > astro.pricePerMin && (
                    <span className="ml-1.5 text-xs text-gray-400 line-through">
                      ₹{astro.originalPrice}
                    </span>
                  )}

                  <span className="ml-1 text-xs text-gray-500">
                    /min
                  </span>
                </div>

                <Link
                  href={`/chat/${astro.id}`}
                  className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-orange-600 hover:to-orange-700 active:scale-95"
                >
                  Chat Now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}

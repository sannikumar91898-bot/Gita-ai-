// app/page.tsx

import Link from "next/link";
import { ASTROLOGERS } from "@/lib/astrologers";
import AstrologerCard from "@/components/AstrologerCard";
import BottomNav from "@/components/BottomNav";
import FreeChatPopup from "@/components/FreeChatPopup";
import ReviewsSection from "@/components/ReviewsSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFF9E6] pb-24">
      <FreeChatPopup />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-orange-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
            G
          </div>
          <span className="font-bold text-lg text-gray-900">GitaTalk</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/wallet"
            className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium"
          >
            <span>₹0</span>
            <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded-full">+</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white p-5 shadow-lg">
          <p className="text-sm font-medium opacity-90">Special Offer</p>
          <h2 className="text-2xl font-bold mt-1">First Chat FREE 🎁</h2>
          <p className="text-sm mt-1 opacity-90">4 expert AI Astrologers • Instant replies</p>
          <Link
            href="#astrologers"
            className="inline-block mt-4 bg-white text-orange-600 font-semibold px-5 py-2.5 rounded-full text-sm shadow"
          >
            Start Free Chat
          </Link>
        </div>
      </section>

      {/* Free Tools */}
      <section className="px-4 mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Free Tools</h3>
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
              className="bg-white rounded-xl p-3 flex flex-col items-center gap-1.5 shadow-sm border border-orange-50"
            >
              <span className="text-2xl">{tool.emoji}</span>
              <span className="text-[11px] font-medium text-gray-700">{tool.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Astrologers */}
      <section id="astrologers" className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Talk to Astrologers</h3>
          <span className="text-xs text-orange-600 font-medium">4 Available</span>
        </div>
        <div className="space-y-4">
          {ASTROLOGERS.map((astro) => (
            <AstrologerCard key={astro.id} astrologer={astro} />
          ))}
        </div>
      </section>

      {/* Verified AI Astrologer Reviews Section with Bottom Spacing Fix */}
      <section className="mt-8 mb-12 pb-6">
        <ReviewsSection />
      </section>

      <BottomNav />
    </div>
  );
}

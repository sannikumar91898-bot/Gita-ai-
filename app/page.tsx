// app/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ASTROLOGERS } from "@/lib/astrologers";
import BottomNav from "@/components/BottomNav";
import FreeChatPopup from "@/components/FreeChatPopup";
import ReviewsSection from "@/components/ReviewsSection";

export default function HomePage() {
  const router = useRouter();
  const [activeReviewAstro, setActiveReviewAstro] = useState<string | null>(null);

  const handleChatClick = (astroId: string) => {
    router.push(`/chat/${astroId}`);
  };

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

      {/* Astrologers Section */}
      <section id="astrologers" className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Talk to Astrologers</h3>
          <span className="text-xs text-orange-600 font-medium">4 Available</span>
        </div>
        
        <div className="space-y-4">
          {ASTROLOGERS.map((astro: any) => {
            // इमेज के लिए सुरक्षित पाथ ढूंढने का तरीका ताकि टाइप एरर न आए
            const astroImage = astro.image || astro.avatar || `/_next/image?url=%2Fastrologers%2Friya.jpg&w=256&q=75`;

            return (
              <div 
                key={astro.id} 
                className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 flex justify-between items-center gap-3"
              >
                {/* प्रोफाइल फोटो, रेटिंग और व्यूइंग डिटेल्स */}
                <div 
                  onClick={() => setActiveReviewAstro(astro.name)}
                  className="flex items-center gap-3 cursor-pointer group flex-1"
                >
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border border-orange-100">
                    <img 
                      src={astroImage} 
                      alt={astro.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-emerald-500 text-[8px] text-white text-center py-0.5 font-bold tracking-tight">
                      Online
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="font-bold text-gray-950 text-sm">{astro.name}</h4>
                      {astro.isCelebrity && (
                        <span className="text-[9px] bg-amber-400 text-amber-950 px-1 rounded-sm font-semibold scale-90">Celebrity</span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium">{astro.specialty || 'Tarot • Relationship'}</p>
                    
                    {/* रेटिंग, चैट्स और लाइव व्यूइंग ट्रिगर */}
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400">
                      <span className="text-orange-500 font-bold">★ {astro.rating || '4.9'}</span>
                      <span>•</span>
                      <span>{astro.chatsCount || '12k+'} chats</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-medium bg-emerald-50 px-1 rounded-sm">👁 {astro.viewing || '43'} viewing</span>
                    </div>
                    
                    {/* प्राइसिंग */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-gray-900 font-bold text-xs">₹{astro.price || '19'}/min</span>
                      <span className="text-[10px] text-gray-400 line-through">₹{astro.originalPrice || '29'}/min</span>
                    </div>
                  </div>
                </div>

                {/* Chat Now बटन */}
                <button
                  onClick={() => handleChatClick(astro.id)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-sm transition-all active:scale-95 whitespace-nowrap"
                >
                  Chat Now
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* डायनामिक रिव्यू पॉपअप मॉडल */}
      <ReviewsSection 
        selectedAstrologer={activeReviewAstro} 
        onClose={() => setActiveReviewAstro(null)} 
      />

      <BottomNav />
    </div>
  );
}

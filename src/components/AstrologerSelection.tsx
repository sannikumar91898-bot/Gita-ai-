"use client";

import React, { useState } from "react";
import { Sparkles, MessageCircle, Star } from "lucide-react";

interface Astrologer {
  id: string;
  name: string;
  avatar: string;
  specializations: string;
  languages: string;
  pricePerMin: number;
  originalPrice: number;
}

interface AstrologerSelectionProps {
  userId: string;
  onSelectAstrologer: (conversationId: string, personaName: string) => void;
}

// 1. आपके स्क्रीनशॉट के अनुसार 100% सटीक डेटा सेट
const ASTROLOGERS: Astrologer[] = [
  {
    id: "astro_gita",
    name: "Gita",
    avatar: "https://unsplash.com", // प्रॉपर फीमेल प्रोफाइल इमेज अवतार
    specializations: "Vedic Astrology • Love & Relationship • Marriage • Compatibility",
    languages: "Hindi / Hinglish / English",
    pricePerMin: 19,
    originalPrice: 29,
  },
  {
    id: "astro_kriti",
    name: "Acharya Kriti",
    avatar: "https://unsplash.com",
    specializations: "Vedic Astrology • Kundli • Career • Government Jobs • Business",
    languages: "Hindi / Hinglish / English",
    pricePerMin: 22,
    originalPrice: 35,
  },
  {
    id: "astro_devaki",
    name: "Dr. Devaki Shastri",
    avatar: "https://unsplash.com",
    specializations: "Vedic Astrology • KP Astrology • Kundli Analysis • Planetary Periods",
    languages: "Hindi / Hinglish / English",
    pricePerMin: 25,
    originalPrice: 45,
  },
  {
    id: "astro_gargi",
    name: "Gargi Maa",
    avatar: "https://unsplash.com",
    specializations: "Vedic Spirituality • Vastu • Traditional Remedies • Bhagavad Gita Wisdom",
    languages: "Hindi / Hinglish",
    pricePerMin: 18,
    originalPrice: 30,
  },
];

export default function AstrologerSelection({ userId, onSelectAstrologer }: AstrologerSelectionProps) {
  const [isCreating, setIsCreating] = useState<string | null>(null);

  // 2. चैट शुरू करने और डेटाबेस में न्यू कन्वर्सेशन बनाने का लॉजिक
  const handleStartChat = async (astrologer: Astrologer) => {
    setIsCreating(astrologer.id);
    try {
      // बैकएंड पर नया कन्वर्सेशन बनाएं जिसमें 'persona' और 'topic' सेव हो
      const res = await fetch("/api/conversations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          persona: astrologer.name,
          title: `${astrologer.name} जी से परामर्श`,
          topic: astrologer.name === "Acharya Kriti" ? "career" : astrologer.name === "Gita" ? "love" : "general"
        }),
      });

      const data = await res.json();
      
      if (data.conversationId) {
        // पैरेंट कॉम्पोनेंट को सूचित करें ताकि स्क्रीन चैट पर स्विच हो जाए
        onSelectAstrologer(data.conversationId, astrologer.name);
      }
    } catch (err) {
      console.error("Error creating conversation thread:", err);
    } finally {
      setIsCreating(null);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 px-4">
      {/* हेडर सेक्शन */}
      <div className="flex items-center justify-between border-b border-amber-100 pb-2">
        <div>
          <h3 className="font-extrabold text-amber-950 text-base flex items-center gap-1.5">
            Talk to Astrologers
          </h3>
          <p className="text-xs text-amber-600/70 font-medium">Choose your preferred AI astrologer</p>
        </div>
        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
          4 AI Experts Live
        </span>
      </div>

      {/* ज्योतिषियों की सूची (100% UI Match) */}
      <div className="space-y-4">
        {ASTROLOGERS.map((astro) => (
          <div
            key={astro.id}
            className="flex items-center justify-between p-4 bg-white border border-amber-100/70 hover:border-amber-200 rounded-2xl shadow-sm transition-all hover:shadow-md"
          >
            {/* लेफ्ट प्रोफाइल और डिटेल्स */}
            <div className="flex items-start gap-4 flex-1 pr-2">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={astro.avatar}
                  alt={astro.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-400"
                />
                <span className="absolute bottom-0 right-0 bg-emerald-500 border-2 border-white w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                  AI
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-amber-950 text-sm leading-none">{astro.name}</h4>
                  <div className="flex items-center text-[10px] text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
                    <Star className="w-2.5 h-2.5 fill-current mr-0.5" /> 5.0
                  </div>
                </div>
                <p className="text-[11px] text-amber-800/80 font-medium line-clamp-1">{astro.specializations}</p>
                <p className="text-[10px] text-amber-600/60 font-semibold uppercase tracking-wider">
                  🗣️ {astro.languages}
                </p>
                
                {/* प्राइस टैग */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-sm font-black text-orange-600">₹{astro.pricePerMin}/min</span>
                  <span className="text-xs text-amber-800/40 line-through">₹{astro.originalPrice}/min</span>
                </div>
              </div>
            </div>

            {/* राइट: चैट नाउ बटन */}
            <button
              onClick={() => handleStartChat(astro)}
              disabled={isCreating !== null}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow active:scale-[0.98] transition-all flex items-center gap-1.5 tracking-wide min-w-[100px] justify-center"
            >
              {isCreating === astro.id ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <MessageCircle className="w-3.5 h-3.5" />
                  Chat Now
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

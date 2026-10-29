"use client";

import React, { useState, useEffect } from 'react';

interface Review {
  id: string;
  name: string;
  stars: number;
  timeAgo: string;
  comment: string;
}

interface AstrologerReviews {
  astrologerName: string;
  title: string;
  rating: number;
  totalOrders: string;
  reviews: Review[];
}

export default function ReviewsSection() {
  const [astrologersData, setAstrologersData] = useState<AstrologerReviews[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 'और देखें' के लिए स्टेट (खुलने पर सीधे पूरे 10 कमेंट्स दिखेंगे)
  const [expandedAstro, setExpandedAstro] = useState<Record<string, boolean>>({});
  
  // प्रत्येक कमेंट के 'Helpful' काउंट को ट्रैक करने का स्टेट
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          setAstrologersData(data);
          
          // हर कमेंट के लिए एक रैंडम शुरुआती 'Helpful' काउंट जेनरेट करें (जैसे 5 से 25 के बीच)
          const initialHelpful: Record<string, number> = {};
          data.forEach((astro: AstrologerReviews) => {
            astro.reviews.forEach((rev) => {
              initialHelpful[rev.id] = Math.floor(Math.random() * 20) + 5;
            });
          });
          setHelpfulCounts(initialHelpful);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const handleShowAll = (name: string) => {
    setExpandedAstro(prev => ({ ...prev, [name]: true }));
  };

  const handleHelpfulClick = (reviewId: string) => {
    if (userVoted[reviewId]) return; // एक यूजर एक ही बार वोट कर सकता है
    
    setUserVoted(prev => ({ ...prev, [reviewId]: true }));
    setHelpfulCounts(prev => ({
      ...prev,
      [reviewId]: prev[reviewId] + 1
    }));
  };

  if (loading) {
    return (
      <div className="w-full bg-[#0d0d0d] text-zinc-500 font-sans min-h-screen flex items-center justify-center">
        <p className="text-sm animate-pulse tracking-wide">समीक्षाएं लोड हो रही हैं...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0d0d0d] text-[#e3e3e3] font-sans min-h-screen py-8 px-4 md:px-6 select-none">
      <div className="max-w-xl mx-auto space-y-8">
        
        {astrologersData.map((astro) => {
          const isExpanded = expandedAstro[astro.astrologerName];
          // अगर एक्सपैंडेड नहीं है तो शुरू के 3 दिखेंगे, क्लिक करने पर सभी 10
          const visibleReviews = isExpanded ? astro.reviews : astro.reviews.slice(0, 3);
          const hasMore = astro.reviews.length > 3 && !isExpanded;

          return (
            <div key={astro.astrologerName} className="bg-[#141414] rounded-xl p-5 shadow-2xl border border-zinc-900/80 space-y-5">
              
              {/* ज्योतिष हेडर प्रोफाइल */}
              <div className="flex justify-between items-start border-b border-zinc-800/60 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-lg shadow-inner">
                    {astro.astrologerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-100 tracking-wide">{astro.astrologerName}</h3>
                    <p className="text-[11px] text-zinc-500">{astro.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <span className="text-2xl font-black text-white tracking-tighter">{astro.rating.toFixed(2)}</span>
                    <div className="text-amber-400 text-sm tracking-tighter flex">
                      {"★".repeat(5)}
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-medium mt-0.5">👤 {astro.totalOrders} आदेश</p>
                </div>
              </div>

              {/* वास्तविक इंसानी कमेंट लिस्टिंग */}
              <div className="space-y-5">
                {visibleReviews.map((rev) => (
                  <div key={rev.id} className="border-b border-zinc-900/60 pb-4 last:border-0 last:pb-0 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center font-semibold text-[10px] uppercase border border-zinc-700">
                          {rev.name.charAt(0)}
                        </div>
                        <span className="font-medium text-xs text-zinc-300">{rev.name}</span>
                      </div>
                      <span className="text-[9px] text-zinc-600 font-mono">{rev.timeAgo}</span>
                    </div>
                    
                    {/* स्टार रेटिंग */}
                    <div className="text-amber-500 text-[10px] flex">
                      {"★".repeat(rev.stars)}
                      {"☆".repeat(5 - rev.stars)}
                    </div>
                    
                    {/* कमेंट टेक्स्ट */}
                    <p className="text-zinc-400 text-[12.5px] leading-relaxed font-normal break-words whitespace-pre-wrap">
                      {rev.comment}
                    </p>

                    {/* इंटरैक्टिव Helpful 👍 बटन */}
                    <div className="pt-1 flex items-center">
                      <button
                        onClick={() => handleHelpfulClick(rev.id)}
                        disabled={userVoted[rev.id]}
                        className={`flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-full border transition-all active:scale-95 ${
                          userVoted[rev.id] 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                            : 'bg-zinc-800/30 border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-zinc-400'
                        }`}
                      >
                        <span>👍 {userVoted[rev.id] ? 'Helpful' : 'Helpful'}</span>
                        <span className="font-mono text-[9px] bg-zinc-900/60 px-1 rounded-sm text-zinc-400">
                          {helpfulCounts[rev.id] || 0}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 'और देखें' बटन विकल्प (एक बार में पूरा खोलने के लिए) */}
              {hasMore && (
                <div className="text-center pt-1">
                  <button
                    onClick={() => handleShowAll(astro.astrologerName)}
                    className="text-amber-400/90 hover:text-amber-300 text-[11px] font-semibold tracking-wide border border-amber-500/20 px-5 py-1.5 rounded-md bg-amber-500/5 hover:bg-amber-500/10 transition-all active:scale-95"
                  >
                    और देखें... ({astro.reviews.length - 3} अधिक समीक्षाएं)
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

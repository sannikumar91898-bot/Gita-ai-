"use client";

import React, { useState, useEffect } from 'react';

interface Review {
  id: string;
  name: string;
  stars: number;
  timeAgo: string;
  comment: string;
  helpfulCount: number;
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
  const [expandedAstro, setExpandedAstro] = useState<Record<string, boolean>>({});
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          setAstrologersData(data);
          
          // डेटाबेस से आने वाले वास्तविक helpfulCount को स्टेट में सेट करें
          const initialHelpful: Record<string, number> = {};
          data.forEach((astro: AstrologerReviews) => {
            astro.reviews.forEach((rev) => {
              initialHelpful[rev.id] = rev.helpfulCount || 0;
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

  const handleHelpfulClick = async (reviewId: string) => {
    if (userVoted[reviewId]) return;
    
    // फ्रंटएंड पर तुरंत स्टेट अपडेट करें (Optimistic UI Update)
    setUserVoted(prev => ({ ...prev, [reviewId]: true }));
    setHelpfulCounts(prev => ({ ...prev, [reviewId]: (prev[reviewId] || 0) + 1 }));

    try {
      // डेटाबेस में काउंट को हमेशा के लिए सुरक्षित करने के लिए बैकएंड API हिट करें
      await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId }),
      });
    } catch (error) {
      console.error("Error updating helpful count in DB:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full text-gray-400 font-sans py-8 text-center flex items-center justify-center">
        <p className="text-xs animate-pulse tracking-wide">समीक्षाएं लोड हो रही हैं...</p>
      </div>
    );
  }

  return (
    <div className="w-full font-sans pb-12 px-4 select-none">
      <div className="max-w-xl mx-auto space-y-6">
        <h3 className="text-base font-bold text-gray-900 mb-2">यूज़र्स के अनुभव (Reviews)</h3>
        
        {astrologersData.map((astro) => {
          const isExpanded = expandedAstro[astro.astrologerName];
          const visibleReviews = isExpanded ? astro.reviews : astro.reviews.slice(0, 3);
          const hasMore = astro.reviews.length > 3 && !isExpanded;

          return (
            <div key={astro.astrologerName} className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100/70 space-y-4">
              
              {/* ज्योतिष हेडर प्रोफाइल - मैचिंग विद गिताटॉक लाइट थीम */}
              <div className="flex justify-between items-start border-b border-orange-50 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {astro.astrologerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 tracking-wide">{astro.astrologerName}</h4>
                    <p className="text-[10px] text-gray-500 font-medium">{astro.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <span className="text-base font-black text-gray-900 tracking-tighter">{astro.rating.toFixed(2)}</span>
                    <span className="text-orange-500 text-xs">★</span>
                  </div>
                  <p className="text-[9px] text-gray-400 font-medium mt-0.5">👥 {astro.totalOrders} परामर्श</p>
                </div>
              </div>

              {/* वास्तविक इंसानी कमेंट लिस्टिंग */}
              <div className="space-y-4">
                {visibleReviews.map((rev) => (
                  <div key={rev.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0 space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-5 h-5 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold text-[9px] uppercase border border-gray-200">
                          {rev.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-[11px] text-gray-700">{rev.name}</span>
                      </div>
                      <span className="text-[8px] text-gray-400 font-mono">{rev.timeAgo}</span>
                    </div>
                    
                    {/* स्टार रेटिंग */}
                    <div className="text-orange-400 text-[9px] flex">
                      {"★".repeat(rev.stars)}
                      {"☆".repeat(5 - rev.stars)}
                    </div>
                    
                    {/* कमेंट टेक्स्ट */}
                    <p className="text-gray-600 text-[12px] leading-relaxed font-normal break-words whitespace-pre-wrap">
                      {rev.comment}
                    </p>

                    {/* इंटरैक्टिव Helpful 👍 बटन */}
                    <div className="pt-1 flex items-center">
                      <button
                        onClick={() => handleHelpfulClick(rev.id)}
                        disabled={userVoted[rev.id]}
                        className={`flex items-center space-x-1 text-[9px] px-2 py-0.5 rounded-full border transition-all active:scale-95 ${
                          userVoted[rev.id] 
                            ? 'bg-emerald-500 text-white border-emerald-500' 
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-500'
                        }`}
                      >
                        <span>👍 Helpful</span>
                        <span className="font-mono text-[8px] bg-gray-200/60 px-1 rounded-sm text-gray-600">
                          {helpfulCounts[rev.id] || 0}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 'और देखें' बटन विकल्प */}
              {hasMore && (
                <div className="text-center pt-1">
                  <button
                    onClick={() => handleShowAll(astro.astrologerName)}
                    className="text-orange-600 hover:text-orange-700 text-[11px] font-bold tracking-wide border border-orange-200 px-4 py-1.5 rounded-full bg-orange-50/50 hover:bg-orange-50 transition-all active:scale-95"
                  >
                    और देखें ({astro.reviews.length - 3} अधिक समीक्षाएं)
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

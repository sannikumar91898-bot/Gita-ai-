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

interface ReviewsSectionProps {
  selectedAstrologer: string | null;
  onClose: () => void;
}

export default function ReviewsSection({ selectedAstrologer, onClose }: ReviewsSectionProps) {
  const [astroData, setAstroData] = useState<AstrologerReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!selectedAstrologer) return;

    async function fetchReviews() {
      setLoading(true);
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          // केवल सिलेक्टेड ज्योतिषी का डेटा ढूंढें
          const currentAstro = data.find((a: AstrologerReviews) => a.astrologerName === selectedAstrologer);
          
          if (currentAstro) {
            setAstroData(currentAstro);
            const initialHelpful: Record<string, number> = {};
            currentAstro.reviews.forEach((rev: Review) => {
              initialHelpful[rev.id] = rev.helpfulCount || 0;
            });
            setHelpfulCounts(initialHelpful);
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [selectedAstrologer]);

  if (!selectedAstrologer) return null;

  const handleHelpfulClick = async (reviewId: string) => {
    if (userVoted[reviewId]) return;
    setUserVoted(prev => ({ ...prev, [reviewId]: true }));
    setHelpfulCounts(prev => ({ ...prev, [reviewId]: (prev[reviewId] || 0) + 1 }));

    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId }),
      });
    } catch (error) {
      console.error("Error updating helpful count:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      {/* बैकड्रॉप पर क्लिक करने से बंद होने के लिए */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl z-10 animate-slide-up space-y-4">
        
        {/* क्लोज बार/बटन */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="text-base font-bold text-gray-900">यूज़र्स के अनुभव (Reviews)</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold px-2 py-1">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <p className="text-xs text-gray-400 animate-pulse">समीक्षाएं लोड हो रही हैं...</p>
          </div>
        ) : astroData ? (
          <div className="space-y-4">
            {/* ज्योतिषी का छोटा हेडर */}
            <div className="flex justify-between items-center bg-orange-50/50 p-3 rounded-xl border border-orange-100/50">
              <div>
                <h4 className="text-sm font-bold text-gray-900">{astroData.astrologerName}</h4>
                <p className="text-[10px] text-gray-500 font-medium">{astroData.title}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end space-x-1">
                  <span className="text-sm font-black text-gray-900">{astroData.rating.toFixed(2)}</span>
                  <span className="text-orange-500 text-xs">★</span>
                </div>
                <p className="text-[9px] text-gray-400 font-medium">👥 {astroData.totalOrders} परामर्श</p>
              </div>
            </div>

            {/* कमेंट लिस्टिंग */}
            <div className="space-y-4 divide-y divide-gray-100 max-h-[50vh] overflow-y-auto pr-1">
              {astroData.reviews.map((rev) => (
                <div key={rev.id} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-5 h-5 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold text-[9px] uppercase border border-gray-200">
                        {rev.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-[11px] text-gray-700">{rev.name}</span>
                    </div>
                    <span className="text-[8px] text-gray-400 font-mono">{rev.timeAgo}</span>
                  </div>
                  
                  <div className="text-orange-400 text-[9px] flex">
                    {"★".repeat(rev.stars)}
                    {"☆".repeat(5 - rev.stars)}
                  </div>
                  
                  <p className="text-gray-600 text-[12px] leading-relaxed break-words whitespace-pre-wrap">
                    {rev.comment}
                  </p>

                  <div className="pt-1">
                    <button
                      onClick={() => handleHelpfulClick(rev.id)}
                      disabled={userVoted[rev.id]}
                      className={`flex items-center space-x-1 text-[9px] px-2 py-0.5 rounded-full border transition-all ${
                        userVoted[rev.id] 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-500' 
                          : 'bg-gray-50 border-gray-200 text-gray-500'
                      }`}
                    >
                      <span>👍 Helpful</span>
                      <span className="font-mono text-[8px] bg-gray-200/60 px-1 rounded-sm">
                        {helpfulCounts[rev.id] || 0}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-xs text-gray-400 py-6">कोई समीक्षा नहीं मिली।</p>
        )}
      </div>
    </div>
  );
}

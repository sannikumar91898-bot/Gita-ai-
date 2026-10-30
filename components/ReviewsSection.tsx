"use client";

import React, { useState, useEffect } from 'react';

interface APIReview {
  id: string;
  persona: string;
  reviewerName: string;
  stars: number;
  comment: string;
  helpfulCount: number;
  isApproved: boolean;
  createdAt: string;
}

interface ReviewsSectionProps {
  selectedAstrologer: string | null; // ये gita, kriti, devaki, gargi पास करेगा
  onClose: () => void;
}

export default function ReviewsSection({ selectedAstrologer, onClose }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<APIReview[]>([]);
  const [metrics, setMetrics] = useState<{ averageRating: number; totalReviewsCount: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!selectedAstrologer) return;

    async function fetchReviews() {
      setLoading(true);
      try {
        // FIXED: नई API के हिसाब से पैरामीटर (?persona=) पास किया
        const res = await fetch(`/api/reviews?persona=${selectedAstrologer.toLowerCase()}&limit=20`);
        if (res.ok) {
          const data = await res.json();
          
          if (data.success && data.reviews) {
            setReviews(data.reviews);
            setMetrics(data.metrics);
            
            // हेल्पफुल काउंट्स को स्टेट में सेट करना
            const initialHelpful: Record<string, number> = {};
            data.reviews.forEach((rev: APIReview) => {
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

  // ज्योतिषी के नाम का पहला अक्षर बड़ा दिखाने और सुंदर टाइटल के लिए हेल्पर मैपिंग
  const astroMeta: Record<string, { name: string; title: string }> = {
    gita: { name: "Gita", title: "Vedic & Relationship Expert" },
    kriti: { name: "Acharya Kriti", title: "Career & Financial Astrologer" },
    devaki: { name: "Dr. Devaki Shastri", title: "Senior Jyotish & KP Scholar" },
    gargi: { name: "Gargi Maa", title: "Spiritual Guide & Remedial Expert" },
  };

  const currentMeta = astroMeta[selectedAstrologer.toLowerCase()] || { 
    name: selectedAstrologer, 
    title: "Vedic Astrologer Expert" 
  };

  // तारीख को सुंदर "timeAgo" फॉर्मेट में बदलने वाला छोटा फंक्शन
  const formatTimeAgo = (dateStr: string) => {
    try {
      const diff = new Date().getTime() - new Date(dateStr).getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days <= 0) return "Today";
      if (days === 1) return "1 day ago";
      return `${days} days ago`;
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl z-10 space-y-4">
        
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
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            
            {/* ज्योतिषी का छोटा हेडर - अब मेट्रिक्स के वास्तविक डेटा के साथ सिंक है */}
            <div className="flex justify-between items-center bg-orange-50/50 p-3 rounded-xl border border-orange-100/50">
              <div>
                <h4 className="text-sm font-bold text-gray-900">{currentMeta.name}</h4>
                <p className="text-[10px] text-gray-500 font-medium">{currentMeta.title}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end space-x-1">
                  <span className="text-sm font-black text-gray-900">
                    {metrics ? metrics.averageRating.toFixed(1) : "4.9"}
                  </span>
                  <span className="text-orange-500 text-xs">★</span>
                </div>
                <p className="text-[9px] text-gray-400 font-medium">
                  👥 {metrics ? metrics.totalReviewsCount : "1,200+"} परामर्श
                </p>
              </div>
            </div>

            {/* कमेंट लिस्टिंग */}
            <div className="space-y-4 divide-y divide-gray-100 max-h-[50vh] overflow-y-auto pr-1">
              {reviews.map((rev) => (
                <div key={rev.id} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-5 h-5 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold text-[9px] uppercase border border-gray-200">
                        {rev.reviewerName.charAt(0)}
                      </div>
                      <span className="font-semibold text-[11px] text-gray-700">{rev.reviewerName}</span>
                    </div>
                    <span className="text-[8px] text-gray-400 font-mono">{formatTimeAgo(rev.createdAt)}</span>
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

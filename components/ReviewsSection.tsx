"use client";

import React, { useState } from 'react';

interface Review {
  id: string;
  name: string;
  stars: number;
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
  const astrologersData: AstrologerReviews[] = [
    {
      astrologerName: "Gita",
      title: "वैदिक एवं आध्यात्मिक मार्गदर्शन",
      rating: 4.99,
      totalOrders: "42,150",
      reviews: [
        { id: "g1", name: "Asha", stars: 5, comment: "thank you ji..will update you ji..very nice talking to you..he guided me well.. 🙏🙏🙏" },
        { id: "g2", name: "Deepak", stars: 5, comment: "Superb experience and realistic predictions, will connect again once I start seeing the changes as advised, but I am confident I will 😊🙏" },
        { id: "g3", name: "Bhavna", stars: 5, comment: "Very straight forward and clear guidance. accuracy and knows what he says. Definitely recommend and looking forward..." },
        { id: "g4", name: "Rohan", stars: 5, comment: "गीता जी से बात करके मन की सारी दुविधा दूर हो गई। बहुत ही सरल और प्रभावशाली उपाय बताए हैं इन्होंने।" },
        { id: "g5", name: "Meera", stars: 5, comment: "Highly accurate readings! Unmatched wisdom on this platform." }
      ]
    },
    {
      astrologerName: "Acharya Kriti",
      title: "केपी एवं आधुनिक ज्योतिष विशेषज्ञ",
      rating: 4.98,
      totalOrders: "31,890",
      reviews: [
        { id: "k1", name: "Ritika", stars: 5, comment: "He is amazing, the way he explains the chart, my goddd!! How wonderful it is, and his predictions are unmatched. Truly a great person inside out." },
        { id: "k2", name: "Latika", stars: 5, comment: "my go to place for any kind of a solution. thank you sir for always being there 🙏😊" },
        { id: "k3", name: "Manish", stars: 5, comment: "Very knowledgeable and accurate astrologer. His guidance is clear, precise, and to the point. Truly insightful and highly recommended! 🙏" },
        { id: "k4", name: "Suresh Kumar", stars: 5, comment: "आचार्य कृति जी की भविष्यवाणियां शत-प्रतिशत सही साबित हुईं। मेरे व्यापार में बहुत सुधार आया है।" },
        { id: "k5", name: "Nisha", stars: 5, comment: "Best astrologer for career guidance. Clean, crisp and honest logic." }
      ]
    },
    {
      astrologerName: "Dr. Devaki Shastri",
      title: "वरिष्ठ नक्षत्र एवं नाड़ी विशेषज्ञ",
      rating: 4.99,
      totalOrders: "54,200",
      reviews: [
        { id: "d1", name: "Swarna", stars: 5, comment: "he is exceptional.... i have been in toich with him since last 2 years and he is the best" },
        { id: "d2", name: "Neeru", stars: 5, comment: "He is very kind and his prediction is accurate.. he always solve my all problems with very easy remedies. His remedies r also eff..." },
        { id: "d3", name: "Aditi", stars: 5, comment: "Just had 4-5 mins with him but he was very clear in what he says and very straight forward. His guidance really helped me..." },
        { id: "d4", name: "Vikas Hegde", stars: 5, comment: "डॉ. देवकी जी के पास असीम ज्ञान है। उनके ग्रहों के गोचर का विश्लेषण अद्भुत है।" },
        { id: "d5", name: "Pooja", stars: 5, comment: "Truly a saviour in desperate times. Thank you doctor saab!" }
      ]
    },
    {
      astrologerName: "Gargi Maa",
      title: "टैरो कार्ड एवं ध्यान साधना गुरु",
      rating: 4.97,
      totalOrders: "28,450",
      reviews: [
        { id: "m1", name: "Tejaswini", stars: 5, comment: "To me He is the best person available on this platform,completely Reliable,Astonishingly Accurate.." },
        { id: "m2", name: "Swaroop", stars: 5, comment: "my saviour...this one word is enough how knowledgeable he is and how his predictions are precise and true indeed...Sir..." },
        { id: "m3", name: "Anjali", stars: 5, comment: "As usual, sir is the best, bang on predictions, very straightforward and exceptional, i have trusted him in the past and whatever he says is true." },
        { id: "m4", name: "Harish", stars: 5, comment: "गार्गी मां का आशीर्वाद मिलते ही मेरे जीवन की सारी बाधाएं समाप्त होने लगीं। कोटि-कोटि नमन।" },
        { id: "m5", name: "Kiran", stars: 5, comment: "Her intuition is top notch. Every word resonates deeply with reality." }
      ]
    }
  ];

  // प्रत्येक ज्योतिषी के लिए दिख रहे कमेंट्स की संख्या को ट्रैक करने का स्टेट
  const [visibleCount, setVisibleCount] = useState<Record<string, number>>({
    "Gita": 3,
    "Acharya Kriti": 3,
    "Dr. Devaki Shastri": 3,
    "Gargi Maa": 3
  });

  const handleShowMore = (name: string) => {
    setVisibleCount(prev => ({
      ...prev,
      [name]: prev[name] + 3
    }));
  };

  return (
    <div className="w-full bg-[#111111] text-[#e0e0e0] font-sans min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <h2 className="text-3xl font-bold text-center text-amber-400 mb-8 border-b border-zinc-800 pb-4">
          Gita AI प्रमाणित ज्योतिषी समीक्षाएं
        </h2>

        {astrologersData.map((astro) => {
          const currentVisible = visibleCount[astro.astrologerName] || 3;
          const hasMore = astro.reviews.length > currentVisible;

          return (
            <div key={astro.astrologerName} className="bg-[#161616] rounded-2xl p-6 shadow-xl border border-zinc-900 space-y-6">
              {/* ज्योतिषी हेडर */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-2xl font-bold text-amber-300">{astro.astrologerName}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{astro.title}</p>
                </div>
                <div className="mt-3 sm:mt-0 text-left sm:text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-extrabold tracking-tight text-white">{astro.rating.toFixed(2)}</span>
                    <div className="text-amber-400 text-xl">★★★★★</div>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">👥 {astro.totalOrders} परामर्श पूरे किए</p>
                </div>
              </div>

              {/* कमेंट लिस्टिंग */}
              <div className="space-y-6">
                {astro.reviews.slice(0, currentVisible).map((rev) => (
                  <div key={rev.id} className="border-b border-zinc-800/50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-7 h-7 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center font-bold text-xs">
                        {rev.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-sm text-zinc-200">{rev.name}</span>
                    </div>
                    <div className="text-amber-400 text-xs mb-1">
                      {"★".repeat(rev.stars)}
                    </div>
                    <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">{rev.comment}</p>
                  </div>
                ))}
              </div>

              {/* 'और देखें' बटन */}
              {hasMore && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => handleShowMore(astro.astrologerName)}
                    className="text-amber-400 hover:text-amber-300 text-xs font-medium tracking-wide border border-amber-500/30 px-4 py-1.5 rounded-full bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
                  >
                    और देखें +
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

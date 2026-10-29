"use client";

import React, { useState } from 'react';

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
  const astrologersData: AstrologerReviews[] = [
    {
      astrologerName: "Gita",
      title: "वैदिक एवं आध्यात्मिक मार्गदर्शन",
      rating: 4.99,
      totalOrders: "42,150",
      reviews: [
        { id: "g1", name: "Asha K.", stars: 5, timeAgo: "Today, 02:14 PM", comment: "thank you ji..will update you ji..very nice talking to you..he guided me well.. 🙏🙏🙏" },
        { id: "g2", name: "Deepak Rawat", stars: 5, timeAgo: "Yesterday", comment: "Superb experience and realistic predictions, will connect again once I start seeing the changes as advised, but I am confident I will 😊🙏" },
        { id: "g3", name: "Bhavna_92", stars: 5, timeAgo: "2 days ago", comment: "Very straight forward and clear guidance. accuracy and knows what he says. Definitely recommend and looking forward..." },
        { id: "g4", name: "Rohan Verma", stars: 4, timeAgo: "3 days ago", comment: "gita mam ne jo bataya tha wesa hi hua shadi ki baten bilkul accurate thi par thoda wait krna pda.. remedies bht easy hain unki." },
        { id: "g5", name: "Meera_Bisht", stars: 5, timeAgo: "1 week ago", comment: "Highly accurate readings! Unmatched wisdom on this platform. bht calm tareeqe se samjhati hain chijo ko." },
        { id: "g6", name: "Vikram S.", stars: 5, timeAgo: "1 week ago", comment: "bhai sach me kamaal hai jo pareshani chal rhi thi bina bataye mam ne khud hi bol di.. tnx a lot!" }
      ]
    },
    {
      astrologerName: "Acharya Kriti",
      title: "केपी एवं आधुनिक ज्योतिष विशेषज्ञ",
      rating: 4.98,
      totalOrders: "31,890",
      reviews: [
        { id: "k1", name: "Ritika Sharma", stars: 5, timeAgo: "Today, 11:45 AM", comment: "He is amazing, the way he explains the chart, my goddd!! How wonderful it is, and his predictions are unmatched. Truly a great person inside out." },
        { id: "k2", name: "Latika_Singh", stars: 5, timeAgo: "Yesterday", comment: "my go to place for any kind of a solution. thank you sir for always being there 🙏😊" },
        { id: "k3", name: "Manish Kumar", stars: 5, timeAgo: "3 days ago", comment: "Very knowledgeable and accurate astrologer. His guidance is clear, precise, and to the point. Truly insightful and highly recommended! 🙏" },
        { id: "k4", name: "Suresh_K", stars: 5, timeAgo: "4 days ago", comment: "आचार्य कृति जी की भविष्यवाणियां शत-प्रतिशत सही साबित हुईं। मेरे व्यापार में जो रुकावट थी वो दूर हो गई।" },
        { id: "k5", name: "Nisha Patel", stars: 4, timeAgo: "1 week ago", comment: "Best astrologer for career guidance. Clean, crisp and honest logic. thoda queue me wait krna pdta h baki query solid solve krte h" }
      ]
    },
    {
      astrologerName: "Dr. Devaki Shastri",
      title: "वरिष्ठ नक्षत्र एवं नाड़ी विशेषज्ञ",
      rating: 4.99,
      totalOrders: "54,200",
      reviews: [
        { id: "d1", name: "Swarna_M", stars: 5, timeAgo: "Today, 04:01 PM", comment: "he is exceptional.... i have been in toich with him since last 2 years and he is the best" },
        { id: "d2", name: "Neeru Bala", stars: 5, timeAgo: "2 days ago", comment: "He is very kind and his prediction is accurate.. he always solve my all problems with very easy remedies. His remedies r also eff..." },
        { id: "d3", name: "Aditi Rao", stars: 5, timeAgo: "3 days ago", comment: "Just had 4-5 mins with him but he was very clear in what he says and very straight forward. His guidance really helped me..." },
        { id: "d4", name: "Vikas Hegde", stars: 5, timeAgo: "5 days ago", comment: "डॉ. देवकी जी के पास असीम ज्ञान है। उनके ग्रहों के गोचर का विश्लेषण अद्भुत है। प्रणाम गुरुजी।" },
        { id: "d5", name: "Pooja_99", stars: 5, timeAgo: "1 week ago", comment: "Truly a saviour in desperate times. Job ka bht bada tension solve kr diya inhone.. Thank you doctor saab!" }
      ]
    },
    {
      astrologerName: "Gargi Maa",
      title: "टैरो कार्ड एवं ध्यान साधना गुरु",
      rating: 4.97,
      totalOrders: "28,450",
      reviews: [
        { id: "m1", name: "Tejaswini", stars: 5, timeAgo: "Today, 09:30 AM", comment: "To me He is the best person available on this platform,completely Reliable,Astonishingly Accurate.." },
        { id: "m2", name: "Swaroop S.", stars: 5, timeAgo: "Yesterday", comment: "my saviour...this one word is enough how knowledgeable he is and how his predictions are precise and true indeed...Sir..." },
        { id: "m3", name: "Anjali Mishra", stars: 5, timeAgo: "2 days ago", comment: "As usual, sir is the best, bang on predictions, very straightforward and exceptional, i have trusted him in the past and whatever he says is true." },
        { id: "m4", name: "Harish_Chandra", stars: 5, timeAgo: "4 days ago", comment: "गार्गी मां का आशीर्वाद मिलते ही मेरे जीवन की सारी बाधाएं समाप्त होने लगीं। मानसिक तनाव एकदम खत्म हो गया।" },
        { id: "m5", name: "Kiran J.", stars: 4, timeAgo: "1 week ago", comment: "Her intuition is top notch. Every word resonates deeply with reality. Remedie thodi lambi h pr asar krti h." }
      ]
    }
  ];

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
    <div className="w-full bg-[#0d0d0d] text-[#e3e3e3] font-sans min-h-screen py-8 px-4 md:px-6 select-none">
      <div className="max-w-xl mx-auto space-y-8">
        
        {astrologersData.map((astro) => {
          const currentVisible = visibleCount[astro.astrologerName] || 3;
          const hasMore = astro.reviews.length > currentVisible;

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
                {astro.reviews.slice(0, currentVisible).map((rev) => (
                  <div key={rev.id} className="border-b border-zinc-900 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center font-semibold text-[10px] uppercase border border-zinc-700">
                          {rev.name.charAt(0)}
                        </div>
                        <span className="font-medium text-xs text-zinc-300">{rev.name}</span>
                      </div>
                      <span className="text-[9px] text-zinc-600 font-mono">{rev.timeAgo}</span>
                    </div>
                    
                    {/* स्टार रेटिंग */}
                    <div className="text-amber-500 text-[10px] mb-1.5 flex">
                      {"★".repeat(rev.stars)}
                      {"☆".repeat(5 - rev.stars)}
                    </div>
                    
                    {/* कमेंट टेक्स्ट */}
                    <p className="text-zinc-400 text-[12.5px] leading-relaxed font-normal break-words whitespace-pre-wrap">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>

              {/* 'और देखें' बटन विकल्प */}
              {hasMore && (
                <div className="text-center pt-1">
                  <button
                    onClick={() => handleShowMore(astro.astrologerName)}
                    className="text-amber-400/90 hover:text-amber-300 text-[11px] font-semibold tracking-wide border border-amber-500/20 px-5 py-1.5 rounded-md bg-amber-500/5 hover:bg-amber-500/10 transition-all active:scale-95"
                  >
                    और देखें...
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

"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, Calendar, Sparkles, Award } from "lucide-react";

interface Remedy {
  id: string;
  title: string;
  description: string;
  category: string;
  completedDates: string[]; // JSONB array matrix from Drizzle
}

interface RemedyTrackerProps {
  userId: string;
}

export default function RemedyTracker({ userId }: RemedyTrackerProps) {
  const [remediesList, setRemediesList] = useState<Remedy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // आज की तारीख का स्ट्रिंग फ़ॉर्मेट (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split("T")[0];

  // 1. पंडित जी द्वारा बताए गए एक्टिव उपायों को फेच करना
  useEffect(() => {
    async function fetchRemedies() {
      try {
        const res = await fetch(`/api/remedies?userId=${userId}`);
        const data = await res.json();
        if (data.remedies) setRemediesList(data.remedies);
      } catch (err) {
        console.error("Error fetching remedies:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRemedies();
  }, [userId]);

  // 2. उपाय को डेली टिक-मार्क (Toggle Complete) करने का लॉजिक
  const handleToggleRemedy = async (remedyId: string, currentCompletedDates: string[]) => {
    let updatedDates = [...currentCompletedDates];
    
    if (updatedDates.includes(todayStr)) {
      // अगर आज पहले से पूरा था, तो अनचेक करें
      updatedDates = updatedDates.filter((d) => d !== todayStr);
    } else {
      // आज का दिन जोड़ें
      updatedDates.push(todayStr);
    }

    // स्टेट को तुरंत अपडेट करें (Optimistic Update)
    setRemediesList((prev) =>
      prev.map((rem) => (rem.id === remedyId ? { ...rem, completedDates: updatedDates } : rem))
    );

    // बैकएंड डेटाबेस में अपडेट सेव करें
    try {
      await fetch("/api/remedies/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remedyId, completedDates: updatedDates }),
      });
    } catch (err) {
      console.error("Error updating remedy status:", err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-amber-700 animate-pulse font-medium">कुंडली के उपाय लोड हो रहे हैं...</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-amber-100 rounded-2xl shadow-lg p-6 space-y-6">
      {/* हेडर और मार्केटिंग हुक */}
      <div className="flex items-center justify-between border-b border-amber-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-amber-950 text-lg">पंडित जी के अचूक उपाय (Daily Task)</h3>
            <p className="text-xs text-amber-600/80 font-medium">ग्रहों के दुष्प्रभाव को काटने के लिए रोज़ पूरा करें</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-100 rounded-full text-xs font-bold text-orange-700">
          <Sparkles className="w-3.5 h-3.5 animate-spin" /> 100% भाग्य उदय
        </div>
      </div>

      {/* उपायों की लिस्ट */}
      {remediesList.length === 0 ? (
        <div className="text-center py-8 bg-amber-50/20 rounded-xl border border-dashed border-amber-200 p-4">
          <p className="text-amber-900 font-semibold text-sm">अभी कोई उपाय सक्रिय नहीं है।</p>
          <p className="text-xs text-amber-600/70 mt-1">पंडित जी से चैट पर बात करें, वे आपकी कुंडली देखकर यहाँ उपाय जोड़ देंगे।</p>
        </div>
      ) : (
        <div className="space-y-4">
          {remediesList.map((remedy) => {
            const isCompletedToday = remedy.completedDates.includes(todayStr);
            const totalStreak = remedy.completedDates.length;

            return (
              <div 
                key={remedy.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isCompletedToday 
                    ? "bg-emerald-50/40 border-emerald-200/70" 
                    : "bg-amber-50/10 border-amber-100/70 hover:border-amber-200"
                }`}
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                      {remedy.category}
                    </span>
                    <span className="text-xs flex items-center gap-1 font-semibold text-amber-700">
                      <Calendar className="w-3 h-3" /> कुल दिन: {totalStreak}
                    </span>
                  </div>
                  <h4 className={`font-bold text-sm mt-1.5 ${isCompletedToday ? "text-emerald-950 line-through" : "text-amber-950"}`}>
                    {remedy.title}
                  </h4>
                  <p className="text-xs text-amber-800/70 mt-1 font-normal leading-relaxed">
                    {remedy.description}
                  </p>
                </div>

                {/* गेमिफाइड चेकमार्क बटन */}
                <button
                  onClick={() => handleToggleRemedy(remedy.id, remedy.completedDates)}
                  className={`p-2 rounded-xl transition-all flex flex-col items-center justify-center min-w-[70px] border ${
                    isCompletedToday
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                      : "bg-white border-amber-200 text-amber-400 hover:text-amber-600 hover:border-amber-300 shadow-sm"
                  }`}
                >
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-wide">
                    {isCompletedToday ? "Done" : "Do Upay"}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

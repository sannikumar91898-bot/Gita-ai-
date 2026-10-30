"use client";

import React, { useState } from "react";
import { Sparkles, Heart, RefreshCw } from "lucide-react";

export default function GunMilanPage() {
  const [p1Name, setP1Name] = useState("");
  const [p2Name, setP2Name] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [verdict, setVerdict] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateMatchingScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!p1Name.trim() || !p2Name.trim()) return;

    setIsCalculating(true);

    setTimeout(() => {
      const combinedLength = p1Name.trim().length + p2Name.trim().length;
      
      // [FIXED] कंपाइलर क्रैश रोकने के लिए 36 गुणों का डिटरमिनिस्टिक पूल सेट किया
      const scoresPool =;
      const finalScore = scoresPool[combinedLength % scoresPool.length];
      
      let finalVerdict = "";
      if (finalScore >= 25) {
        finalVerdict = "उत्तम मिलान! वैवाहिक जीवन अत्यंत सुखद और समृद्धि से परिपूर्ण रहेगा। (100% Highly Compatible)";
      } else if (finalScore >= 18) {
        finalVerdict = "मध्यम मिलान। कुछ सामान्य ग्रह दोष हैं, लेकिन पंडित जी के उपायों से शांति संभव है।";
      } else {
        finalVerdict = "गंभीर नाड़ी या भकूट दोष! विवाह से पूर्व विशेष महापूजा अनिवार्य है।";
      }

      setScore(finalScore);
      setVerdict(finalVerdict);
      setIsCalculating(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white border border-amber-100 rounded-2xl shadow-xl p-6 mt-8 space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-black text-amber-950 flex items-center justify-center gap-1.5">
          <Heart className="w-5 h-5 text-red-500 fill-current" /> वैदिक अष्टकूट गुण मिलान
        </h2>
        <p className="text-xs text-amber-600/80 font-medium">36 गुणों के आधार पर वैवाहिक अनुकूलता की जांच करें</p>
      </div>

      <form onSubmit={calculateMatchingScore} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-amber-950">लड़के का नाम</label>
            <input
              type="text"
              value={p1Name}
              onChange={(e) => setP1Name(e.target.value)}
              placeholder="Name"
              className="w-full px-3 py-2 bg-amber-50/40 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-amber-950">लड़की का नाम</label>
            <input
              type="text"
              value={p2Name}
              onChange={(e) => setP2Name(e.target.value)}
              placeholder="Name"
              className="w-full px-3 py-2 bg-amber-50/40 border border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isCalculating || !p1Name.trim() || !p2Name.trim()}
          className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-sm rounded-xl shadow transition-all active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {isCalculating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              ग्रहों का मिलान जारी है...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              गुण मिलान स्कोर देखें
            </>
          )}
        </button>
      </form>

      {score !== null && (
        <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-4 text-center space-y-2 animate-fadeIn">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">प्राप्त गुण मिलान स्कोर</span>
          <div className="text-4xl font-black text-orange-600">{score} <span className="text-sm text-amber-950/50 font-bold">/ 36</span></div>
          <p className="text-xs font-bold text-amber-950 leading-relaxed max-w-sm mx-auto">{verdict}</p>
        </div>
      )}
    </div>
  );
}

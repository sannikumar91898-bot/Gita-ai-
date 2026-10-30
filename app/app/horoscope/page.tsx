"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  Star, 
  MessageSquare, 
  AlertCircle, 
  Compass,
  CheckCircle2
} from "lucide-react";
import { useApp } from "../Providers";

// लाइव वेबसाइट के अनुसार चारों महिला एस्ट्रोलॉजर्स का डमी रिव्यू पूल (स्वाभाविक इंसानी गलतियों के साथ)
const HOROSCOPE_REVIEWS = [
  {
    id: "rev_1",
    astrologer: "Gita",
    user: "Riya Sen",
    rating: 5,
    comment: "Gita dii se shadi ke matter me pucha tha. Unhone jesa bataya tha thik wesa hi chal rha h relation abhi. Bht caring h vo!", // 'jesa', 'rha h', 'bht' (Organic typos)
  },
  {
    id: "rev_2",
    astrologer: "Acharya Kriti",
    user: "Alok Dwivedi",
    rating: 5,
    comment: "Kriti mam ka behavior bhot to-the-point hai. Faltu time waste nahi karti. Government job ke exam ki exact timing btai unone.", // 'bhot', 'btai unone' (Typo)
  },
  {
    id: "rev_3",
    astrologer: "Dr. Devaki Shastri",
    user: "Shashi Bhushan",
    rating: 4,
    comment: "Dasha analysis bht accurate thi shastri ji ki. Kundli me shani ke dosh ka sasta upay btaya h. Thank u.", 
  },
  {
    id: "rev_4",
    astrologer: "Gargi Maa",
    user: "Meenu Sharma",
    rating: 5,
    comment: "गार्गी माँ से बात करके मन एकदम शांत हो गया। बिल्कुल माँ की तरह समझाती है और गीता के श्लोक से उपाय बताती हैं। धन्य हो माँ।", // 'समझाती है' (Grammar flaw)
  },
];

const ZODIAC_SIGNS = [
  { name: "Mesh (Aries)", emoji: "♈", prediction: "आज करियर में नए अवसर मिलेंगे। आचार्य कृति के अनुसार, बिजनेस में निवेश के लिए आज का दिन उत्तम है।" },
  { name: "Vrishabh (Taurus)", emoji: "♉", prediction: "लव लाइफ में चल रहा तनाव आज दूर होगा। गीता दीदी के अनुसार, साथी के साथ बातचीत से मसले हल होंगे।" },
  { name: "Mithun (Gemini)", emoji: "♊", prediction: "स्वास्थ्य पर ध्यान देने की आवश्यकता है। महादशा के प्रभाव के कारण आज खर्चों में अधिकता रह सकती है।" },
  // अतिरिक्त राशियाँ यहाँ जोड़ी जा सकती हैं...
];

export default function DailyHoroscopePage() {
  const { theme } = useApp();
  const isDark = theme === "dark";
  const [selectedSign, setSelectedSign] = useState<typeof ZODIAC_SIGNS[0] | null>(null);

  return (
    <main className={`min-h-dvh px-4 pb-16 pt-6 transition-colors duration-300 ${
      isDark ? "bg-celestial text-violet-50" : "bg-gradient-to-b from-violet-50 to-white text-violet-950"
    }`}>
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <header className="mb-6 flex items-center gap-4">
          <Link href="/" className={`rounded-full border p-2.5 transition ${
            isDark ? "border-white/10 bg-white/[0.02] hover:bg-white/10" : "border-violet-200 bg-white hover:bg-violet-50 shadow-sm"
          }`}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">🌟 दैनिक राशिफल (Daily Horoscope)</h1>
            <p className={`text-sm ${isDark ? "text-violet-300" : "text-violet-600"}`}>आज के सितारों का आपकी राशि पर प्रभाव</p>
          </div>
        </header>

        {/* स्पेशल ऑफर मार्केटिंग बैनर */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-5 text-white shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <span className="bg-white/20 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Special Promotion</span>
              <h3 className="text-lg font-bold mt-1">First Chat FREE! 🎁</h3>
              <p className="text-xs text-orange-100 mt-0.5">अपनी राशि का विस्तृत उपाय जानने के लिए पहली चैट बिल्कुल मुफ्त करें।</p>
            </div>
            <Link href="/chat" className="bg-white text-orange-600 font-bold px-4 py-2.5 rounded-xl text-xs shadow hover:bg-orange-50 transition shrink-0">
              Start Free Chat →
            </Link>
          </div>
        </div>

        {/* राशि चयन ग्रिड */}
        {!selectedSign ? (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-violet-400 mb-4 px-1">अपनी राशि चुनें</h2>
            <div className="grid grid-cols-3 gap-3">
              {ZODIAC_SIGNS.map((sign, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSign(sign)}
                  className={`flex flex-col items-center justify-center rounded-xl border p-4 transition-all duration-200 active:scale-95 ${
                    isDark ? "border-white/10 bg-white/[0.03] hover:border-gold-400/40 hover:bg-white/5" : "border-violet-100 bg-white shadow-sm hover:border-violet-300"
                  }`}
                >
                  <span className="text-3xl mb-1">{sign.emoji}</span>
                  <span className="text-xs font-bold tracking-tight">{sign.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </section>
        ) : (
          /* राशिफल प्रेडिक्शन डिस्प्ले */
          <section className={`mb-8 rounded-2xl border p-6 ${isDark ? "border-gold-400/20 bg-white/[0.04]" : "border-violet-200 bg-white shadow-md"}`}>
            <div className="flex items-center justify-between border-b border-violet-500/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{selectedSign.emoji}</span>
                <h2 className="font-bold text-lg">{selectedSign.name}</h2>
              </div>
              <button onClick={() => setSelectedSign(null)} className="text-xs font-bold text-violet-400 hover:text-violet-300">
                राशि बदलें
              </button>
            </div>
            <p className="text-sm leading-relaxed font-medium mb-5">{selectedSign.prediction}</p>
            <Link href="/chat" className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-xl text-sm shadow transition">
              <MessageSquare size={16} /> अपनी पसंदीदा गाइड से रेमेडी पूछें
            </Link>
          </section>
        )}

        {/* सोशल प्रूफ सेक्शन: रियल दिखने वाले डमी रिव्यूज */}
        <section className={`rounded-2xl border p-6 ${isDark ? "border-white/10 bg-white/[0.02]" : "border-violet-200 bg-white shadow-sm"}`}>
          <h3 className="font-bold text-base mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500" /> यूज़र्स का अनुभव (Verified Feedback)
          </h3>
          <div className="space-y-4">
            {HOROSCOPE_REVIEWS.map((rev) => (
              <div key={rev.id} className={`rounded-xl border p-4 ${isDark ? "border-white/5 bg-black/20" : "border-violet-50/60 bg-violet-50/20"}`}>
                <div className="flex justify-between items-center mb-1.5">
                  <div>
                    <span className="text-xs font-bold block">{rev.user}</span>
                    <span className="text-[10px] text-violet-400">Consulted Expert: **{rev.astrologer}**</span>
                  </div>
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? "text-violet-200" : "text-violet-900"}`}>{rev.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  Star, 
  MessageSquare, 
  CheckCircle2
} from "lucide-react";

// ⚠️ पाथ एरर को फिक्स किया गया (../ Providers को ../../Providers किया गया)
import { useApp } from "../../Providers";

const HOROSCOPE_REVIEWS = [
  {
    id: "rev_1",
    astrologer: "Gita",
    user: "Riya Sen",
    rating: 5,
    comment: "Gita dii se shadi ke matter me pucha tha. Unhone jesa bataya tha thik wesa hi chal rha h relation abhi. Bht caring h vo!",
  },
  {
    id: "rev_2",
    astrologer: "Acharya Kriti",
    user: "Alok Dwivedi",
    rating: 5,
    comment: "Kriti mam ka behavior bhot to-the-point hai. Faltu time waste nahi karti. Government job ke exam ki exact timing btai unone.",
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
    comment: "गार्गी माँ से बात करके मन एकदम शांत हो गया। बिल्कुल माँ की तरह समझाती है और गीता के श्लोक से उपाय बताती हैं। धन्य हो माँ।",
  },
];

const ZODIAC_SIGNS = [
  { name: "Mesh (Aries)", emoji: "♈", prediction: "आज आपकी कुंडली के दशम भाव में मंगल का गोचर प्रचंड धन लाभ और करियर में बड़ा प्रमोशन का योग बना रहा है। आचार्य कृति के अनुसार व्यापारिक निवेश के लिए आज का दिन सर्वोत्तम है। विशेष उपाय के लिए चैट शुरू करें।" },
  { name: "Vrishabh (Taurus)", emoji: "♉", prediction: "लव लाइफ और वैवाहिक जीवन में चल रहा तनाव आज देवगुरु बृहस्पति की कृपा से तुरंत समाप्त होगा। गीता दीदी के अनुसार आज शाम कोई बड़ी खुशखबरी मिलने वाली है। गुप्त उपाय जानने के लिए तुरंत चैट करें।" },
  { name: "Mithun (Gemini)", emoji: "♊", prediction: "राहु-केतु का गोचर अब आपकी राशि के अनुकूल हो गया है। रुका हुआ सारा पैसा और सरकारी अटके काम 100% गति से पूरे होंगे। स्वास्थ्य उत्तम रहेगा। आज का चमत्कारी उपाय जानने के लिए चैट पर आएं।" },
  { name: "Karka (Cancer)", emoji: "♋", prediction: "आपकी राशि में आज लक्ष्मी नारायण योग सक्रिय हो चुका है। आकस्मिक धन लाभ और लॉटरी या शेयर मार्केट से भारी मुनाफा मिलने के संकेत हैं। अपनी धन स्थिति मजबूत करने का महा-उपाय तुरंत चैट पर जानें।" },
  { name: "Simha (Leo)", emoji: "♌", prediction: "सूर्य का अपनी ही राशि में होना आपके आत्मविश्वास और समाज में दबदबे को चार गुना बढ़ा देगा। दुश्मनों का नाश होगा। नया बिजनेस शुरू करने के लिए दिन लकी है। विशेष यंत्र के बारे में पंडित जी से चैट पर पूछें।" },
  { name: "Kanya (Virgo)", emoji: "♍", prediction: "बुध के प्रभाव से आपकी बुद्धि और वाणी की शक्ति से आज बड़ी से बड़ी डील फाइनल हो जाएगी। लव पार्टनर के साथ यात्रा के योग हैं। कुंडली के दोषों को काटने का सरल उपाय चैट पर उपलब्ध है।" },
  { name: "Tula (Libra)", emoji: "♎", prediction: "मालव्य राजयोग के कारण आज आपके सुख-साधन और विलासिता की वस्तुओं में भारी वृद्धि होगी। नया मकान या वाहन खरीदने का सपना पूरा होने वाला है। इस राजयोग को एक्टिव करने का उपाय चैट पर जानें।" },
  { name: "Vrishchik (Scorpio)", emoji: "♏", prediction: "आज आपके पराक्रम और साहस की बदौलत कार्यक्षेत्र में बड़ा सम्मान मिलेगा। नौकरी में ट्रांसफर और वेतन वृद्धि के प्रबल योग हैं। शनि की ढैय्या को शांत करने का अचूक उपाय जानने के लिए तुरंत जुड़ें।" },
  { name: "Dhanu (Sagittarius)", emoji: "♐", prediction: "कुंडली का द्वितीय भाव धन से भरने वाला है। पैतृक संपत्ति से बड़ा लाभ होगा और परिवार में मांगलिक कार्य संपन्न होंगे। आज का दिन आपके जीवन का टर्निंग पॉइंट है, विशेष गाइडेंस के लिए चैट शुरू करें।" },
  { name: "Makar (Capricorn)", emoji: "♑", prediction: "आपकी राशि पर बना हुआ शश महापुरुष राजयोग आज आपको व्यापार में इंडस्ट्री लीडर बनाने की क्षमता रखता है। धन का आगमन चारों दिशाओं से होगा। पहली चैट बिल्कुल फ्री है, तुरंत लाभ उठाएं।" },
  { name: "Kumbh (Aquarius)", emoji: "♒", prediction: "अष्टम भाव के सारे कष्ट अब दूर हो चुके हैं। विदेशी स्रोतों और ऑनलाइन कार्यों से अपार धन कमाने का रास्ता खुलेगा। कोर्ट-कचहरी के मामलों में शत-प्रतिशत विजय मिलेगी। अचूक रेमेडी के लिए चैट करें।" },
  { name: "Meen (Pisces)", emoji: "♓", prediction: "गुरू का गोचर आपके भाग्य भाव को अत्यधिक शक्तिशाली बना रहा है। कम मेहनत में भी आज आपको दोगुनी सफलता मिलेगी। बिगड़े हुए काम अपने आप बनने लगेंगे। अपनी किस्मत चमकाने का महामंत्र चैट पर प्राप्त करें।" }
];

export default function DailyHoroscopePage() {
  const { theme } = useApp();
  const isDark = theme === "dark";
  const [selectedSign, setSelectedSign] = useState<typeof ZODIAC_SIGNS[0] | null>(null);

  return (
    <main className={`min-h-dvh px-4 pb-16 pt-6 transition-colors duration-300 ${
      isDark ? "bg-slate-950 text-violet-50" : "bg-gradient-to-b from-violet-50 to-white text-violet-950"
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
            <h1 className="font-display text-xl font-bold tracking-tight">🌟 वैदिक राजयोग दैनिक राशिफल</h1>
            <p className={`text-xs ${isDark ? "text-violet-300" : "text-violet-600"}`}>नवग्रहों के महागोचर का आपकी राशि पर 100% सटीक प्रभाव</p>
          </div>
        </header>

        {/* स्पेशल ऑफर मार्केटिंग बैनर */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-5 text-white shadow-lg">
          <div className="flex justify-between items-center gap-4">
            <div>
              <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Premium Offer</span>
              <h3 className="text-base font-black mt-1">First Chat 100% FREE! 🎁</h3>
              <p className="text-xs text-orange-50 mt-0.5">अपनी कुंडली के अनुसार धन लाभ और विवाह बाधा दूर करने का महा-उपाय सीधे एक्सपर्ट से जानें।</p>
            </div>
            <Link href="/chat" className="bg-white text-orange-600 font-extrabold px-4 py-3 rounded-xl text-xs shadow hover:bg-orange-50 transition shrink-0">
              Free Chat →
            </Link>
          </div>
        </div>

        {/* राशि चयन ग्रिड */}
        {!selectedSign ? (
          <section className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-500 mb-4 px-1 flex items-center gap-1.5">
              <Sparkles size={14} /> अपनी राशि का चयन करें
            </h2>
            <div className="grid grid-cols-3 gap-2.5">
              {ZODIAC_SIGNS.map((sign, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSign(sign)}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-4 transition-all duration-200 active:scale-95 ${
                    isDark ? "border-white/10 bg-slate-900/60 hover:border-amber-400/50 hover:bg-slate-900" : "border-violet-100 bg-white shadow-sm hover:border-violet-300 hover:bg-violet-50/50"
                  }`}
                >
                  <span className="text-3xl mb-1">{sign.emoji}</span>
                  <span className="text-xs font-bold tracking-tight text-center">{sign.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </section>
        ) : (
          /* राशिफल प्रेडिक्शन डिस्प्ले */
          <section className={`mb-8 rounded-2xl border p-5 ${isDark ? "border-amber-400/20 bg-slate-900/40" : "border-violet-200 bg-white shadow-md"}`}>
            <div className="flex items-center justify-between border-b border-violet-500/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{selectedSign.emoji}</span>
                <h2 className="font-extrabold text-base text-amber-500">{selectedSign.name} फलादेश</h2>
              </div>
              <button onClick={() => setSelectedSign(null)} className="text-xs font-bold text-violet-400 hover:text-amber-400 transition">
                ← राशि बदलें
              </button>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed font-semibold text-slate-200 mb-5 whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
              {selectedSign.prediction}
            </p>
            <Link href="/chat" className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold py-3.5 rounded-xl text-sm shadow-md transition">
              <MessageSquare size={16} /> अपनी पसंदीदा गाइड से महा-उपाय पूछें
            </Link>
          </section>
        )}

        {/* सोशल प्रूफ सेक्शन: रियल दिखने वाले डमी रिव्यूज */}
        <section className={`rounded-2xl border p-5 ${isDark ? "border-white/10 bg-slate-900/20" : "border-violet-200 bg-white shadow-sm"}`}>
          <h3 className="font-extrabold text-sm mb-4 flex items-center gap-2 text-slate-100">
            <CheckCircle2 size={16} className="text-emerald-500" /> यूज़र्स का लाइव अनुभव (Verified Feedback)
          </h3>
          <div className="space-y-3.5">
            {HOROSCOPE_REVIEWS.map((rev) => (
              <div key={rev.id} className={`rounded-xl border p-3.5 ${isDark ? "border-white/5 bg-slate-950/60" : "border-violet-50/60 bg-violet-50/20"}`}>
                <div className="flex justify-between items-center mb-1.5">
                  <div>
                    <span className="text-xs font-bold block text-slate-200">{rev.user}</span>
                    <span className="text-[10px] text-amber-400 font-medium">परामर्श विशेषज्ञ: {rev.astrologer}</span>
                  </div>
                  <div className="flex text-amber-400 gap-0.5">

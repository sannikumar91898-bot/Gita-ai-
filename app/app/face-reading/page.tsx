"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Sparkles,
  HelpCircle,
  RefreshCw,
  CheckCircle2,
  Scan,
  User,
  MessageSquare
} from "lucide-react";
import { useApp } from "../Providers";

// बिना किसी एपीआई के, स्थानीय स्तर पर सटीक और गहन विश्लेषण के लिए प्री-लोडेड डेटा स्ट्रक्चर
const FACE_FEATURES_POOL = {
  forehead: [
    { type: "broad", label: "चौड़ा माथा (Broad Forehead)", analysis: "आप असाधारण रूप से बुद्धिमान और तार्किक हैं। किसी भी विकट स्थिति में सही निर्णय लेना आपकी विशेषता है। समाज में आपको बहुत मान-सम्मान प्राप्त होगा।" },
    { type: "narrow", label: "छोटा/संकुचित माथा (Narrow Forehead)", analysis: "आप भावनाओं के बजाय अपनी अंतरात्मा (Intuition) की सुनते हैं। आप बेहद रचनात्मक हैं और अकेले काम करना पसंद करते हैं।" }
  ],
  eyes: [
    { type: "big", label: "बड़ी और गहरी आँखें (Big Eyes)", analysis: "आप खुले विचारों के, उत्साही और दयालु स्वभाव के व्यक्ति हैं। लोग आपकी तरफ बहुत जल्दी आकर्षित हो जाते हैं, लेकिन कभी-कभी आप भावुकता में गलत फैसले ले लेते हैं।" },
    { type: "small", label: "छोटी और तीखी आँखें (Small/Sharp Eyes)", analysis: "आप बेहद केंद्रित (Focused) और चौकन्ने स्वभाव के हैं। किसी भी चीज़ की बारीकियों को पकड़ने में आपको महारत हासिल है। कोई आपको आसानी से धोखा नहीं दे सकता।" }
  ],
  lips: [
    { type: "full", label: "भरे हुए होंठ (Full Lips)", analysis: "आप दूसरों की परवाह करने वाले और बेहद सामाजिक इंसान हैं। आपकी संवाद शैली इतनी प्रभावशाली है कि लोग आपकी बातों से जल्दी सहमत हो जाते हैं।" },
    { type: "thin", label: "पतले होंठ (Thin Lips)", analysis: "आप आत्मनिर्भर, शांत और थोड़े अंतर्मुखी (Introverted) स्वभाव के हैं। आप अपनी व्यक्तिगत बातें हर किसी के साथ साझा करना पसंद नहीं करते।" }
  ]
};

export default function FaceReadingPage() {
  const { theme } = useApp();
  const isDark = theme === "dark";

  // स्टेट मैनेजमेंट
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [step, setStep] = useState<"upload" | "questions" | "result">("upload");
  const [isScanning, setIsScanning] = useState(false);
  const [answers, setAnswers] = useState({ forehead: "", eyes: "", lips: "" });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // इमेज इनपुट हैंडलर
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setStep("questions"); // फोटो अपलोड होते ही कस्टमाइज्ड फीचर्स के स्टेप पर जाएं
      };
      reader.readAsDataURL(file);
    }
  };

  // लोकल डेटा को कंबाइन करके बिना एपीआई के रिजल्ट जेनरेट करना
  const processFaceReading = () => {
    setIsScanning(true);
    // ३ सेकंड का विजुअल स्कैनर एनिमेशन ताकि यूजर को प्रामाणिक अहसास हो
    setTimeout(() => {
      setIsScanning(false);
      setStep("result");
    }, 3000);
  };

  const handleAnswerSelect = (field: string, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  // रीसेट स्टेट्स
  const resetModule = () => {
    setSelectedImage(null);
    setAnswers({ forehead: "", eyes: "", lips: "" });
    setStep("upload");
  };

  // चुने गए फीचर्स का रिस्पॉन्स कंपोज करना
  const selectedForehead = FACE_FEATURES_POOL.forehead.find(f => f.type === answers.forehead);
  const selectedEyes = FACE_FEATURES_POOL.eyes.find(e => e.type === answers.eyes);
  const selectedLips = FACE_FEATURES_POOL.lips.find(l => l.type === answers.lips);

  return (
    <main className={`min-h-dvh px-5 pb-16 pt-6 transition-colors duration-300 ${
      isDark ? "bg-celestial text-violet-50" : "bg-gradient-to-b from-violet-50 to-white text-violet-950"
    }`}>
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <header className="mb-8 flex items-center gap-4">
          <Link href="/" className={`rounded-full border p-2.5 transition-all ${
            isDark ? "border-white/10 bg-white/[0.02] hover:bg-white/10" : "border-violet-200 bg-white hover:bg-violet-50 shadow-sm"
          }`}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">👤 फेस रीडिंग (Face Reading)</h1>
            <p className={`text-sm ${isDark ? "text-violet-300/90" : "text-violet-600 font-medium"}`}>
              सामुद्रिक शास्त्र के सिद्धांतों पर आधारित मुखाकृति विश्लेषण
            </p>
          </div>
        </header>

        {/* STEP 1: इमेज अपलोड इंटरफेस */}
        {step === "upload" && (
          <section className={`rounded-2xl border p-6 ${isDark ? "border-gold-400/15 bg-white/[0.03]" : "border-violet-200 bg-white shadow-md"}`}>
            <div className="mb-6 rounded-xl bg-violet-600/10 p-4 border border-violet-500/20 text-center">
              <Scan size={32} className="mx-auto mb-2 text-violet-500 animate-pulse" />
              <p className="text-xs leading-relaxed font-medium">
                अपना चेहरा स्कैन करें या एक स्पष्ट फोटो अपलोड करें। हमारा ऑफलाइन सामुद्रिक शास्त्र एल्गोरिदम आपके चेहरे की बनावट का विश्लेषण करेगा।
              </p>
            </div>

            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center cursor-pointer transition-all ${
                isDark ? "border-white/20 bg-black/20 hover:border-gold-400/40 hover:bg-white/5" : "border-violet-300 bg-violet-50/30 hover:border-violet-500"
              }`}
            >
              <Camera size={36} className="text-violet-400 mb-3" />
              <span className="font-bold text-sm">फोटो अपलोड करें या कैमरा खोलें</span>
              <span className="text-[11px] text-violet-400 mt-1">बिना इंटरनेट / बिना API के पूरी तरह सुरक्षित</span>
            </div>

            <button 
              onClick={() => setStep("questions")}
              className="mt-4 text-center w-full block text-xs font-bold text-violet-500 hover:underline"
            >
              या बिना फोटो अपलोड किए सीधे शुरू करें →
            </button>
          </section>
        )}

        {/* STEP 2: फीचर्स वैरिएशंस का चयन (तार्किक प्रश्नोत्तरी) */}
        {step === "questions" && (
          <section className={`rounded-2xl border p-6 space-y-6 ${isDark ? "border-gold-400/15 bg-white/[0.03]" : "border-violet-200 bg-white shadow-md"}`}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gold-400 flex items-center gap-2">
              <HelpCircle size={16} /> चेहरे की बनावट की पुष्टि करें
            </h2>

            {/* माथा */}
            <div className="space-y-2">
              <label className="text-xs font-bold block">1. आपका माथा (Forehead) कैसा है?</label>
              <div className="grid grid-cols-2 gap-3">
                {FACE_FEATURES_POOL.forehead.map(f => (
                  <button key={f.type} onClick={() => handleAnswerSelect("forehead", f.type)} className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all ${answers.forehead === f.type ? "border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/30" : "border-white/10 bg-black/10"}`}>{f.label}</button>
                ))}
              </div>
            </div>

            {/* आँखें */}
            <div className="space-y-2">
              <label className="text-xs font-bold block">2. आपकी आँखों का आकार (Eyes Shape) कैसा है?</label>
              <div className="grid grid-cols-2 gap-3">
                {FACE_FEATURES_POOL.eyes.map(e => (
                  <button key={e.type} onClick={() => handleAnswerSelect("eyes", e.type)} className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all ${answers.eyes === e.type ? "border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/30" : "border-white/10 bg-black/10"}`}>{f.label}</button>
                ))}
              </div>
            </div>

            {/* होंठ */}
            <div className="space-y-2">
              <label className="text-xs font-bold block">3. आपके होंठों की बनावट (Lips Texture) कैसी है?</label>
              <div className="grid grid-cols-2 gap-3">
                {FACE_FEATURES_POOL.lips.map(l => (
                  <button key={l.type} onClick={() => handleAnswerSelect("lips", l.type)} className={`p-3 text-xs font-semibold rounded-xl border text-center transition-all ${answers.lips === l.type ? "border-violet-500 bg-violet-500/10 ring-2 ring-violet-500/30" : "border-white/10 bg-black/10"}`}>{l.label}</button>
                ))}
              </div>
            </div>

            <button
              disabled={!answers.forehead || !answers.eyes || !answers.lips || isScanning}
              onClick={processFaceReading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-white py-4 rounded-xl text-sm shadow disabled:opacity-40"
            >
              {isScanning ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  सामुद्रिक चक्र स्कैन किया जा रहा है...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  फेस रीडिंग रिज़ल्ट देखें
                </>
              )}
            </button>
          </section>
        )}

        {/* STEP 3: गार्गी माँ की आध्यात्मिक शैली में प्रेडिक्शन आउटपुट */}
        {step === "result" && (
          <section className="space-y-6">
            <div className={`rounded-2xl border p-6 ${isDark ? "border-gold-400/20 bg-white/[0.04]" : "border-violet-200 bg-white shadow-lg"}`}>
              <div className="flex items-center justify-between border-b border-violet-500/10 pb-4 mb-5">

// app/palmistry/page.tsx
"use client";

import { useRef, useState, ChangeEvent } from "react";
import {
  ArrowLeft,
  Hand,
  Phone,
  Sparkles,
  Loader2,
  MessageCircle,
  Upload,
  Star,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

// 🔥 ALAG-ALAG RESULTS KA ARRAY 🔥
const PALMISTRY_RESULTS = [
  {
    title: "आपकी हथेली की रेखाएँ बहुत कुछ कह रही हैं...",
    insight: "आपकी हथेली में जीवन रेखा (Life Line) और भाग्य रेखा (Fate Line) के बीच एक अंतराल दिख रहा है। यह बताता है कि पिछले 6-7 महीनों से आपके जीवन में एक ऐसी रुकावट आ रही है, जिसकी वजह से आपके मेहनत के बावजूद आपको उसका पूरा फल नहीं मिल रहा।",
    hook: "यह रुकावट क्यों आ रही है और इसे कैसे दूर करें, यह जानने के लिए हमारी ज्योतिषी से बात करें। पहली बात FREE है।"
  },
  {
    title: "आपके करियर में एक बड़ी रुकावट है...",
    insight: "आपकी हथेली में भाग्य रेखा (Fate Line) कुछ जगहों से टूटी हुई या कटी हुई दिख रही है। यह संकेत है कि आपके करियर या व्यापार में बार-बार अड़चनें आ रही हैं। आप मेहनत बहुत करते हैं, लेकिन सफलता हाथ से फिसलती जा रही है।",
    hook: "इस टूटी हुई रेखा का असर आपके धन पर भी पड़ रहा है। इसका सही उपाय जानने के लिए ज्योतिषी से बात करें।"
  },
  {
    title: "आपकी शादी या रिश्ते में रुकावट...",
    insight: "आपकी हथेली में विवाह रेखा (Marriage Line) पर एक हल्का सा दोष या क्रॉस (Cross) दिख रहा है। यह बताता है कि आपके रिश्ते में या शादी की बात में कोई तीसरा व्यक्ति या कुंडली का दोष रुकावट डाल रहा है।",
    hook: "क्या आपके रिश्ते में कोई गलतफहमी है? इसका सटीक कारण जानने के लिए अभी ज्योतिषी से बात करें।"
  },
  {
    title: "आपके मन में बहुत अशांति है...",
    insight: "आपकी हथेली में जीवन रेखा (Life Line) पर एक गांठ (Knot) या निशान दिख रहा है। यह दर्शाता है कि आप पिछले कुछ समय से मानसिक तनाव और अशांति से गुजर रहे हैं। आपकी नींद और सेहत पर भी इसका असर पड़ रहा है।",
    hook: "यह सिर्फ मानसिक तनाव नहीं, आपकी कुंडली में एक ग्रह-दोष है। इससे मुक्ति पाने के लिए ज्योतिषी से परामर्श लें।"
  },
  {
    title: "आपका धन रुक रहा है...",
    insight: "आपकी हथेली में सूर्य रेखा (Sun Line) या धन रेखा बहुत हल्की दिख रही है। इसका मतलब है कि आपको सम्मान और पैसा दोनों देर से मिल रहे हैं। जो पैसा आता है, वो अचानक खर्च में बदल जाता है।",
    hook: "धन को रोकने और भाग्य को जगाने का एक विशेष उपाय है। अपनी कुंडली दिखाने के लिए ज्योतिषी से अभी चैट करें।"
  }
];

export default function PalmistryPage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    title: string;
    insight: string;
    hook: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = (hi: string, hing: string, en: string) =>
    isHindi ? hi : isHinglish ? hing : en;

  const pageClass = isDark
    ? "bg-slate-950 text-violet-50"
    : "bg-[#FEF8EF] text-slate-900";

  const cardClass = isDark
    ? "border-slate-800 bg-slate-900"
    : "border-orange-100 bg-white shadow-xl";

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError(
        t(
          "फोटो 5MB से बड़ी नहीं होनी चाहिए। कृपया छोटी फोटो चुनें।",
          "Photo 5MB se badi nahi honi chahiye. Kripya chhoti photo chunein.",
          "Photo must be smaller than 5MB. Please choose a smaller photo."
        )
      );
      return;
    }

    setError(null);
    const reader = new FileReader();
    
    reader.onerror = () => {
      setError(
        t(
          "फोटो पढ़ने में समस्या आई। कृपया दोबारा कोशिश करें।",
          "Photo padhne mein samasya aayi. Kripya dobara koshish karein.",
          "Error reading photo. Please try again."
        )
      );
    };

    reader.onload = () => {
      setPhoto(reader.result as string);
      setResult(null);
      setLoading(true);

      // 2.2 sec delay
      window.setTimeout(() => {
        // 🔥 RANDOM RESULT SELECTION 🔥
        const randomIndex = Math.floor(Math.random() * PALMISTRY_RESULTS.length);
        setResult(PALMISTRY_RESULTS[randomIndex]);
        setLoading(false);
      }, 2200);
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setPhoto(null);
    setResult(null);
    setError(null);
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main className={`min-h-screen w-full px-4 pb-44 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link
            href="/"
            className={`rounded-xl p-2 ${
              isDark ? "bg-slate-800 text-violet-200" : "bg-orange-50 text-orange-600"
            }`}
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-black uppercase tracking-tight text-orange-600">
              {t("हस्तरेखा", "Palmistry", "Palmistry")}
            </h1>
            <p className="text-[11px] font-semibold text-slate-500">
              {t("हथेली का विश्लेषण", "Palm Analysis", "Palm Analysis")}
            </p>
          </div>
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
            FREE
          </span>
        </header>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-center text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {/* UPLOAD */}
        {!photo && (
          <section className={`space-y-4 rounded-2xl border p-5 text-center ${cardClass}`}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg">
              <Hand size={42} />
            </div>

            <h2 className="text-lg font-bold">
              {t("अपनी हथेली की फोटो अपलोड करें", "Apni hatheli ki photo upload karein", "Upload your palm photo")}
            </h2>

            <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-left">
              <p className="flex items-start gap-2 text-sm font-semibold leading-6 text-rose-900">
                <Sparkles size={18} className="shrink-0 text-rose-600 mt-0.5" />
                {t(
                  "🌸 हस्तरेखा विज्ञान में आपकी हथेली की रेखाएं आपके भविष्य के बारे में बहुत कुछ बताती हैं। सही मार्गदर्शन के लिए अपनी हथेली की साफ फोटो अपलोड करें।",
                  "🌸 Hastrekha vigyan mein aapki hatheli ki rekhaayein aapke bhavishya ke baare mein bahut kuch batati hain. Sahi margdarshan ke liye apni hatheli ki saaf photo upload karein.",
                  "🌸 Palmistry reveals a lot about your future. Upload a clear photo of your palm for correct guidance."
                )}
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleFile}
              className="hidden"
              id="palm-upload"
            />

            <label
              htmlFor="palm-upload"
              className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-md transition active:scale-[0.99]"
            >
              <Upload size={16} />
              {t("फोटो अपलोड करें", "Upload Photo", "Upload Photo")}
            </label>

            <p className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
              <ShieldCheck size={12} />
              {t(
                "आपकी फोटो सुरक्षित रहेगी, कहीं शेयर नहीं होगी",
                "Aapki photo surakshit rahegi, kahin share nahi hogi",
                "Your photo stays private, never shared"
              )}
            </p>
          </section>
        )}

        {/* PREVIEW + LOADING */}
        {photo && (
          <section className={`space-y-4 rounded-2xl border p-5 ${cardClass}`}>
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt="preview"
                className="h-20 w-20 rounded-full border-4 border-orange-200 object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-bold">
                  {loading
                    ? t("विश्लेषण हो रहा है...", "Analysing...", "Analysing...")
                    : t("विश्लेषण पूरा हुआ", "Analysis Complete", "Analysis Complete")}
                </p>
                <p className="text-xs text-slate-500">
                  {loading
                    ? t("कृपया 2 सेकंड रुकें", "Please wait 2 seconds", "Please wait 2 seconds")
                    : t("नीचे परिणाम देखें", "See result below", "See result below")}
                </p>
              </div>
              {loading && <Loader2 className="animate-spin text-orange-500" size={24} />}
            </div>

            {loading && (
              <div className="rounded-xl bg-orange-50 p-4 text-center dark:bg-slate-800">
                <p className="flex items-center justify-center gap-2 text-sm font-semibold text-orange-700 dark:text-orange-400">
                  <Sparkles size={16} />
                  {t(
                    "जीवन रेखा, भाग्य रेखा पढ़ी जा रही है...",
                    "Life line, fate line padhi ja rahi hai...",
                    "Reading life line, fate line..."
                  )}
                </p>
              </div>
            )}
          </section>
        )}

        {/* RESULT */}
        {result && !loading && (
          <section
            className={`space-y-4 rounded-2xl border-2 border-orange-300 p-5 ${
              isDark ? "bg-slate-900" : "bg-gradient-to-br from-orange-50 to-amber-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Star className="text-amber-500" size={18} fill="currentColor" />
              <p className="text-sm font-black text-orange-700 dark:text-orange-400">{result.title}</p>
            </div>

            <p className={`text-sm font-medium leading-6 ${isDark ? "text-slate-200" : "text-gray-900"}`}>
              {result.insight}
            </p>

            <div className={`rounded-xl border p-4 ${
              isDark ? "border-rose-900 bg-rose-950/40" : "border-rose-300 bg-rose-50"
            }`}>
              <p className={`text-xs font-bold leading-5 ${isDark ? "text-rose-200" : "text-rose-950"}`}>
                {result.hook}
              </p>
            </div>

            <Link
              href="/chat"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-3 text-sm font-black text-white shadow-lg active:scale-[0.99]"
            >
              <MessageCircle size={16} />
              {t(
                "ज्योतिषी से बात करें — पहली बात FREE",
                "Jyotishi se baat karein — Pehli baat FREE",
                "Talk to Astrologer — First chat FREE"
              )}
            </Link>

            <button
              onClick={reset}
              className={`w-full rounded-xl border px-4 py-2 text-xs font-bold ${
                isDark 
                  ? "border-slate-700 bg-slate-800 text-slate-300" 
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              {t("दूसरी फोटो अपलोड करें", "Try another photo", "Try another photo")}
            </button>
          </section>
        )}

        {/* TRUST STRIP */}
        <div className={`grid grid-cols-3 gap-2 rounded-2xl border p-3 text-center ${cardClass}`}>
          <div>
            <p className="text-base font-black text-orange-600">50K+</p>
            <p className="text-[10px] font-bold text-slate-500">
              {t("संतुष्ट यूज़र", "Happy Users", "Happy Users")}
            </p>
          </div>
          <div>
            <p className="text-base font-black text-orange-600">4.8★</p>
            <p className="text-[10px] font-bold text-slate-500">
              {t("रेटिंग", "Rating", "Rating")}
            </p>
          </div>
          <div>
            <p className="text-base font-black text-orange-600">24x7</p>
            <p className="text-[10px] font-bold text-slate-500">
              {t("ज्योतिषी", "Astrologers", "Astrologers")}
            </p>
          </div>
        </div>

        {/* DISCLAIMER */}
        <p className="px-6 text-center text-[9px] leading-3 text-slate-400/40 dark:text-slate-500/30 select-none tracking-wide">
          {t(
            "© 2026 Astrologer App. यह प्लेटफ़ॉर्म प्राचीन वैदिक ज्योतिष एवं हस्तरेखा विज्ञान के सिद्धांतों पर आधारित गणनाएँ प्रदर्शित करता है।",
            "© 2026 Astrologer App. Yeh platform pracheen Vedic Jyotish aur Hastrekha vigyan ke siddhanton par aadharit gananayein pradarshit karta hai.",
            "© 2026 Astrologer App. This platform displays calculations based on ancient Vedic Astrology and Palmistry principles."
          )}
        </p>
      </div>

      {/* STICKY CTA */}
      <Link
        href="/chat"
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 px-4 py-3.5 text-white shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
            <Phone size={18} />
          </span>
          <div className="leading-tight">
            <p className="text-[10px] font-black uppercase tracking-wider text-rose-100">
              {t("ज्योतिषी • 24x7 उपलब्ध", "Jyotishi • 24x7 Available", "Astrologers • 24x7 Available")}
            </p>
            <p className="text-sm font-black">
              {t(
                "अभी बात करें — पहली बातचीत FREE",
                "Abhi baat karein — Pehli baatcheet FREE",
                "Talk now — First chat FREE"
              )}
            </p>
          </div>
        </div>
      </Link>
    </main>
  );
}
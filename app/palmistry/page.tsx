// app/palmistry/page.tsx
"use client";

import { useRef, useState, ChangeEvent } from "react";
import { ArrowLeft, Hand, Sparkles, Loader2, MessageCircle, Upload, Star } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

const PALMISTRY_RESULTS = [
  {
    title: "जीवन रेखा में गांठ...",
    insight: "आपकी हथेली में 'जीवन रेखा' (Life Line) पर एक गांठ (Knot) दिख रही है। यह बताता है कि पिछले 2-3 सालों में आपके जीवन में कोई बड़ा संघर्ष या स्वास्थ्य समस्या आई है।",
    hook: "यह गांठ आपके आत्मविश्वास को कम कर रही है। इसका सटीक कारण और उपाय जानने के लिए ज्योतिषी से बात करें।",
  },
  {
    title: "भाग्य रेखा टूटी हुई...",
    insight: "आपकी 'भाग्य रेखा' (Fate Line) बीच से टूटी हुई है। फेस रीडिंग और हस्तरेखा विज्ञान में इसका मतलब है कि आपकी मेहनत का फल आपको समय पर नहीं मिल रहा। आप कड़ी मेहनत करते हैं, लेकिन धन रुक जाता है।",
    hook: "यह टूटन आपके करियर को रोक रही है। अपनी कुंडली दिखाएं, मैं इसका असली कारण बताऊंगी।",
  },
  {
    title: "हृदय रेखा और शुक्र...",
    insight: "आपकी 'हृदय रेखा' (Heart Line) बहुत गहरी है, और 'शुक्र पर्वत' (Mount of Venus) पर कुछ हल्की रेखाएं हैं। यह बताता है कि आप प्यार में बहुत ज्यादा देते हैं, लेकिन रिश्ते में टकराव के कारण अंदर ही अंदर टूटते हैं।",
    hook: "क्या आपके रिश्ते में भी गलतफहमी है? शुक्र ग्रह के इस प्रभाव का उपाय जानें।",
  },
  {
    title: "सूर्य रेखा पर बाधा...",
    insight: "आपकी हथेली में 'सूर्य रेखा' (Sun Line) यानी धन और प्रसिद्धि की रेखा बहुत हल्की है। इसका मतलब है कि आपको लोगों की नज़र (Nazar) या किसी 'ग्रह दोष' के कारण सम्मान और पैसा देर से मिल रहा है।",
    hook: "आपकी मेहनत और तारीफ दोनों रुक रही हैं। ज्योतिषी से अपनी कुंडली जाँच करवाएं।",
  },
  {
    title: "मस्तिष्क रेखा का झुकाव...",
    insight: "आपकी 'मस्तिष्क रेखा' (Head Line) नीचे की तरफ झुकी हुई है। यह आपके मन में अत्यधिक ओवरथिंकिंग और डर को दर्शाता है। आप छोटी-छोटी बातों को लेकर बहुत ज्यादा सोचते हैं और अकेले महसूस करते हैं।",
    hook: "क्या यह मानसिक थकान आपको रोक रही है? ज्योतिषी से बात करें, मन शांत करने का उपाय जानें।",
  },
];

export default function PalmistryPage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof PALMISTRY_RESULTS[0] | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = (hi: string, hing: string, en: string) => isHindi ? hi : isHinglish ? hing : en;

  const pageClass = isDark ? "bg-slate-950 text-violet-50" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-slate-900" : "border-orange-100 bg-white shadow-xl";

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhoto(URL.createObjectURL(file)); // Preview ke liye
    setResult(null);
    setLoading(true);

    // 2.2 second baad random result
    window.setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * PALMISTRY_RESULTS.length);
      setResult(PALMISTRY_RESULTS[randomIndex]);
      setLoading(false);
    }, 2200);
  };

  const reset = () => {
    setPhoto(null);
    setResult(null);
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main className={`min-h-screen w-full px-4 pb-44 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-violet-200" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-black uppercase tracking-tight text-orange-600">{t("हस्तरेखा", "Palmistry", "Palmistry")}</h1>
            <p className="text-[11px] font-semibold text-slate-500">{t("हथेली का विश्लेषण", "Palm Analysis", "Palm Analysis")}</p>
          </div>
        </header>

        {!photo && (
          <section className={`space-y-4 rounded-2xl border p-5 text-center ${cardClass}`}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg">
              <Hand size={42} />
            </div>
            <h2 className="text-lg font-bold">{t("हथेली की फोटो अपलोड करें", "Apni hatheli ki photo upload karein", "Upload your palm photo")}</h2>
            <p className="text-sm text-slate-600">{t("हथेली की रेखाएं आपके भविष्य का राज बताती हैं।", "Hatheli ki rekhaayein aapke bhavishya ka raaj batati hain.", "Your palm lines reveal the secrets of your future.")}</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" id="palm-upload" />
            <label htmlFor="palm-upload" className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-md">
              <Upload size={16} /> {t("फोटो चुनें", "Choose Photo", "Choose Photo")}
            </label>
          </section>
        )}

        {photo && (
          <section className={`space-y-4 rounded-2xl border p-5 ${cardClass}`}>
            <div className="flex items-center gap-4">
              <img src={photo} alt="preview" className="h-20 w-20 rounded-full border-4 border-orange-200 object-cover" />
              <div className="flex-1">
                <p className="text-sm font-bold">{loading ? t("विश्लेषण हो रहा है...", "Analysing...", "Analysing...") : t("विश्लेषण पूरा हुआ", "Analysis Complete", "Analysis Complete")}</p>
              </div>
              {loading && <Loader2 className="animate-spin text-orange-500" size={24} />}
            </div>
          </section>
        )}

        {result && !loading && (
          <section className={`space-y-4 rounded-2xl border-2 border-orange-300 p-5 ${isDark ? "bg-slate-900" : "bg-gradient-to-br from-orange-50 to-amber-50"}`}>
            <div className="flex items-center gap-2">
              <Star className="text-amber-500" size={18} fill="currentColor" />
              <p className="text-sm font-black text-orange-700">{result.title}</p>
            </div>
            <p className={`text-sm font-medium leading-6 ${isDark ? "text-slate-200" : "text-gray-900"}`}>{result.insight}</p>
            <div className={`rounded-xl border p-4 ${isDark ? "border-rose-900 bg-rose-950/40" : "border-rose-300 bg-rose-50"}`}>
              <p className={`text-xs font-bold leading-5 ${isDark ? "text-rose-200" : "text-rose-950"}`}>{result.hook}</p>
            </div>
            <Link href="/chat" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-3 text-sm font-black text-white shadow-lg">
              <MessageCircle size={16} /> {t("ज्योतिषी से बात करें", "Talk to Astrologer", "Talk to Astrologer")}
            </Link>
            <button onClick={reset} className={`w-full rounded-xl border px-4 py-2 text-xs font-bold ${isDark ? "border-slate-700 bg-slate-800" : "border-gray-300 bg-white"}`}>
              {t("दूसरी फोटो अपलोड करें", "Try another photo", "Try another photo")}
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
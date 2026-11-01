// app/face-reading/page.tsx
"use client";

import { useRef, useState, ChangeEvent } from "react";
import { ArrowLeft, ScanFace, Phone, Sparkles, Loader2, MessageCircle, Upload, Star, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

const FACE_READING_RESULTS = [
  {
    title: "आपके माथे पर ग्रहों की छाया...",
    insight: "आपके माथे (Forehead) का आकार बताता है कि आपके भाग्य में बड़ा उतार-चढ़ाव है। माथे पर हल्की सिकुड़न (Lines) दिख रही है, जो पिछले 6-7 महीनों से चल रही मानसिक अशांति को दर्शाती है।",
    hook: "यह अशांति आपके करियर और धन को रोक रही है। पूरी कुंडली जाँच के लिए ज्योतिषी से बात करें।",
  },
  {
    title: "आपकी आँखों में राहु का प्रभाव...",
    insight: "आपकी आँखों (Eyes) की बनावट और उनके नीचे का काला घेरा बताता है कि आपकी नींद और मानसिक शांति प्रभावित है। फेस रीडिंग में इसे राहु और चंद्रमा का असंतुलन माना जाता है।",
    hook: "इसके कारण आपका फोकस और आत्मविश्वास कम हो रहा है। सही उपाय जानने के लिए चैट करें।",
  },
  {
    title: "आपकी नाक धन का प्रतीक...",
    insight: "आपकी नाक (Nose) का आकार 'धन भाव' (Wealth) को दर्शाता है। आपकी नाक की नोक थोड़ी नीचे है, जिसका मतलब है कि पैसा आता है लेकिन रुकता नहीं। 'धन का रिसाव' हो रहा है।",
    hook: "क्या आपके साथ भी ऐसा हो रहा है? धन रोकने का उपाय जानने के लिए ज्योतिषी से मिलें।",
  },
  {
    title: "आपके होंठ और शुक्र ग्रह...",
    insight: "आपके होंठ (Lips) पतले हैं और उन पर कोई हल्की सी लकीर दिख रही है। यह शुक्र (Venus) ग्रह के कमजोर होने का संकेत है, जिससे रिश्तों में गलतफहमी और अकेलापन महसूस होता है।",
    hook: "रिश्तों में रुकावट का कारण यही ग्रह है। अपनी कुंडली दिखाकर सही उपाय जानें।",
  },
  {
    title: "आपके गालों पर कर्म का असर...",
    insight: "आपके गालों (Cheeks) की बनावट बताती है कि आप 'दिल के अच्छे' हैं, लेकिन लोग इसका फायदा उठाते हैं। यह आपकी कुंडली में 'पितृ दोष' या 'नज़र' के कारण हो सकता है।",
    hook: "इससे आपके रिश्ते और पैसे दोनों प्रभावित हो रहे हैं। मुझसे बात करें, मैं जाँच करूँगी।",
  },
];

export default function FaceReadingPage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<typeof FACE_READING_RESULTS[0] | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = (hi: string, hing: string, en: string) => isHindi ? hi : isHinglish ? hing : en;

  const pageClass = isDark ? "bg-slate-950 text-violet-50" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-slate-900" : "border-orange-100 bg-white shadow-xl";

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError(t("फोटो 5MB से बड़ी नहीं होनी चाहिए।", "Photo 5MB se badi nahi honi chahiye.", "Photo must be smaller than 5MB."));
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
      setResult(null);
      setLoading(true);

      window.setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * FACE_READING_RESULTS.length);
        setResult(FACE_READING_RESULTS[randomIndex]);
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
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-violet-200" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-black uppercase tracking-tight text-orange-600">{t("फेस रीडिंग", "Face Reading", "Face Reading")}</h1>
            <p className="text-[11px] font-semibold text-slate-500">{t("वैदिक विश्लेषण", "Vedic Analysis", "Vedic Analysis")}</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">FREE</span>
        </header>

        {error && <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-center text-sm font-bold text-red-700">{error}</div>}

        {!photo && (
          <section className={`space-y-4 rounded-2xl border p-5 text-center ${cardClass}`}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg">
              <ScanFace size={42} />
            </div>
            <h2 className="text-lg font-bold">{t("अपना फोटो अपलोड करें", "Apna photo upload karein", "Upload your photo")}</h2>
            <p className="text-sm text-slate-600">{t("आपके चेहरे के लक्षण आपके भाग्य की दिशा बताते हैं", "Aapke chehre ke lakshan aapke bhagya ki disha batate hain", "Your facial features reveal your destiny")}</p>
            <input ref={fileInputRef} type="file" accept="image/jpeg, image/png, image/webp" onChange={handleFile} className="hidden" id="face-upload" />
            <label htmlFor="face-upload" className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-md">
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
                <p className="text-xs text-slate-500">{loading ? t("कृपया रुकें...", "Please wait...", "Please wait...") : t("नीचे परिणाम देखें", "See result below", "See result below")}</p>
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
// app/face-reading/page.tsx
"use client";

import { useRef, useState, ChangeEvent } from "react";
import {
  ArrowLeft,
  ScanFace,
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

export default function FaceReadingPage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Error handling state
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

    // Photo Validation (Max 5MB)
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
    
    // FileReader Error Handling
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

      // Marketing Magic: 2.2 sec delay
      window.setTimeout(() => {
        setResult({
          title: t(
            "आपके चेहरे की रेखाएँ कुछ कह रही हैं...",
            "Aapke chehre ki rekhaayein kuch keh rahi hain...",
            "Your facial lines are saying something..."
          ),
          insight: t(
            "आपके माथे और आँखों की बनावट बताती है कि आपके भाग्य में एक बड़ा मोड़ आने वाला है — लेकिन एक रुकावट इसे रोक रही है। यह रुकावट पिछले 7-8 महीनों से सक्रिय है, जिसकी वजह से आपके प्रयास पूरे होकर भी अधूरे रह जाते हैं।",
            "Aapke maathe aur aankhon ki bnawat batati hai ki aapke bhagya mein ek bada mod aane wala hai — lekin ek rukawat ise rok rahi hai. Yeh rukawat pichhle 7-8 mahino se sakriya hai, jiski wajah se aapke prayaas poore hokar bhi adhoore reh jaate hain.",
            "The shape of your forehead and eyes reveals that a big turning point is coming — but a blockage is holding it back. This blockage has been active for the last 7-8 months, causing your efforts to remain incomplete."
          ),
          hook: t(
            "यह रुकावट क्या है और इसे कैसे दूर करें — यह सिर्फ पूरी कुंडली जाँचने पर पता चलेगा। हमारी ज्योतिषी अभी online हैं — पहली बातचीत FREE।",
            "Yeh rukawat kya hai aur ise kaise door karein — yeh sirf poori kundli jaanchne par pata chalega. Hamari jyotishi abhi online hain — pehli baatcheet FREE.",
            "What is this blockage and how to remove it — only a full Kundli reading can tell. Our astrologer is online now — first chat FREE."
          ),
        });
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
              {t("फेस रीडिंग", "Face Reading", "Face Reading")}
            </h1>
            <p className="text-[11px] font-semibold text-slate-500">
              {t("वैदिक + AI विश्लेषण", "Vedic + AI Analysis", "Vedic + AI Analysis")}
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
              <ScanFace size={42} />
            </div>

            <h2 className="text-lg font-bold">
              {t("अपना फोटो अपलोड करें", "Apna photo upload karein", "Upload your photo")}
            </h2>

            <p className="text-sm text-slate-600">
              {t(
                "आपके चेहरे के लक्षण आपके भाग्य की दिशा बताते हैं",
                "Aapke chehre ke lakshan aapke bhagya ki disha batate hain",
                "Your facial features reveal the direction of your destiny"
              )}
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleFile}
              className="hidden"
              id="face-upload"
            />

            <label
              htmlFor="face-upload"
              className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-md transition active:scale-[0.99]"
            >
              <Upload size={16} />
              {t("फोटो चुनें", "Choose Photo", "Choose Photo")}
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
              <div className="rounded-xl bg-orange-50 p-4 text-center">
                <p className="flex items-center justify-center gap-2 text-sm font-semibold text-orange-700">
                  <Sparkles size={16} />
                  {t(
                    "माथा, आँखें, होंठ पढ़े जा रहे हैं...",
                    "Maathe, aankhen, honth padhe ja rahe hain...",
                    "Reading forehead, eyes, lips..."
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
              <p className="text-sm font-black text-orange-700">{result.title}</p>
            </div>

            <p className="text-sm font-medium leading-6 text-slate-800 dark:text-slate-200">
              {result.insight}
            </p>

            <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 dark:bg-rose-950/30 dark:border-rose-900">
              <p className="text-xs font-semibold leading-5 text-rose-800 dark:text-rose-200">
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
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
            "© 2026 Astrologer App. यह प्लेटफ़ॉर्म प्राचीन वैदिक ज्योतिष एवं मुखाकृति विज्ञान (Face Reading) के सिद्धांतों पर आधारित गणनाएँ प्रदर्शित करता है।",
            "© 2026 Astrologer App. Yeh platform pracheen Vedic Jyotish aur Face Reading ke siddhanton par aadharit gananayein pradarshit karta hai.",
            "© 2026 Astrologer App. This platform displays calculations based on ancient Vedic Astrology and Face Reading principles."
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
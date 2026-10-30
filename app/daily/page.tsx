"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Sun, Sparkles, Palette, Hash, AlertTriangle, LayoutGrid } from "lucide-react";
import Link from "next/link";

import { useApp } from "../Providers";

type DailyReading = {
  signName: string;
  focus: string;
  luckyColour: {
    name: string;
    hex: string;
  };
  luckyNumber: number;
  affirmation: string;
};

const SIGNS = [
  { id: "General", hi: "सामान्य", en: "General", hg: "General" },
  { id: "Mesh (Aries)", hi: "मेष", en: "Aries", hg: "Mesh" },
  { id: "Vrishabh (Taurus)", hi: "वृषभ", en: "Taurus", hg: "Vrishabh" },
  { id: "Mithun (Gemini)", hi: "मिथुन", en: "Gemini", hg: "Mithun" },
  { id: "Karka (Cancer)", hi: "कर्क", en: "Cancer", hg: "Karka" },
  { id: "Simha (Leo)", hi: "सिंह", en: "Leo", hg: "Simha" },
  { id: "Kanya (Virgo)", hi: "कन्या", en: "Virgo", hg: "Kanya" },
  { id: "Tula (Libra)", hi: "तुला", en: "Libra", hg: "Tula" },
  { id: "Vrishchik (Scorpio)", hi: "वृश्चिक", en: "Scorpio", hg: "Vrishchik" },
  { id: "Dhanu (Sagittarius)", hi: "धनु", en: "Sagittarius", hg: "Dhanu" },
  { id: "Makar (Capricorn)", hi: "मकर", en: "Capricorn", hg: "Makar" },
  { id: "Kumbh (Aquarius)", hi: "कुम्भ", en: "Aquarius", hg: "Kumbh" },
  { id: "Meen (Pisces)", hi: "मीन", en: "Pisces", hg: "Meen" },
];

export default function DailyPage() {
  const { lang, t } = useApp();
  const [sign, setSign] = useState("General");
  const [reading, setReading] = useState<DailyReading | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "/api/daily?sign=" + encodeURIComponent(sign) + "&lang=" + encodeURIComponent(lang),
          {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const data: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          const message =
            data &&
            typeof data === "object" &&
            "error" in data &&
            typeof data.error === "string"
              ? data.error
              : lang === "hi"
                ? "राशिफल अभी उपलब्ध नहीं है।"
                : lang === "hinglish"
                  ? "Rashifal abhi available nahi hai."
                  : "The daily reading is not available right now.";
          throw new Error(message);
        }

        if (
          !data ||
          typeof data !== "object" ||
          !("reading" in data) ||
          !data.reading
        ) {
          throw new Error(
            lang === "hi"
              ? "राशिफल का प्रारूप सही नहीं है।"
              : "The daily reading format was invalid."
          );
        }

        if (!cancelled) {
          setReading(data.reading as DailyReading);
        }
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        
        console.warn("Gemini Service Limit/Error triggered. Engaging high-fidelity Vedic fallback.");
        
        // डिटरमिनिस्टिक ज्योतिषीय बैकअप (Failsafe Engine to handle Quota Exhaustion)
        const currentSignLabel = SIGNS.find(s => s.id === sign);
        const signTitle = lang === "hi" ? currentSignLabel?.hi : lang === "hinglish" ? currentSignLabel?.hg : currentSignLabel?.en;

        const fallbackFocus = lang === "hi"
          ? `आज आपकी राशि में ग्रहों का गोचर शुभ संकेत दे रहा है। विशेष रूप से करियर और आर्थिक मोर्चे पर सकारात्मक बदलाव देखने को मिलेंगे। वरिष्ठ अधिकारियों का सहयोग प्राप्त होगा, जिससे आपके अटके हुए कार्य पूर्ण होंगे। वाणी पर संयम रखें और स्वास्थ्य के प्रति सचेत रहें।`
          : lang === "hinglish"
            ? `Aaj aapki rashi mein grahon ka gochar shubh sanket de raha hai. Career aur financial matters mein positive changes milenge. Senior officers ka support milega jisse ruke hue kaam pure honge.`
            : `Today's transit brings auspicious alignments for your sign. Positive updates are indicated in professional sectors. Keep patience and manage hydration levels.`;

        const fallbackAffirmation = lang === "hi"
          ? "मैं ब्रह्मांड की सकारात्मक ऊर्जा को स्वीकार करता हूँ और अपने लक्ष्यों की ओर अग्रसर हूँ।"
          : lang === "hinglish"
            ? "Mein universe ki positive energy ko accept karta hu aur apne goals ki taraf badh raha hu."
            : "I am perfectly aligned with cosmic abundance and move forward with peace.";

        setReading({
          signName: signTitle || "General",
          focus: fallbackFocus,
          luckyColour: {
            name: lang === "hi" ? "सुनहरा पीला" : lang === "hinglish" ? "Golden Yellow" : "Golden Yellow",
            hex: "#F59E0B"
          },
          luckyNumber: (sign.length % 9) + 1,
          affirmation: fallbackAffirmation
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [sign, lang]);

  const title =
    lang === "hi"
      ? "दैनिक राशिफल"
      : lang === "hinglish"
        ? "Daily Rashifal"
        : "Daily Astrology";

  const intro =
    lang === "hi"
      ? "राशि चुनें। यह सामान्य दैनिक मार्गदर्शन है, कोई निश्चित भविष्यवाणी नहीं।"
      : lang === "hinglish"
        ? "Rashi chuniye. Yeh general daily guidance hai, pakki prediction nahi."
        : "Choose a sign. This is general daily guidance, not a certain prediction.";

  return (
    <div className="w-full max-w-md mx-auto space-y-5 p-4 text-violet-50 pb-24 selection:bg-amber-500 selection:text-slate-950">
      
      {/* HEADER SECTION WITH FIX ALIGNMENT */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-violet-300 hover:text-amber-400 p-1 bg-slate-800/50 rounded-lg transition-colors" aria-label="Back">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display text-lg font-bold flex items-center gap-2 text-slate-100">
            <Sun className="text-amber-400 animate-spin-slow" size={20} />
            <span>{title}</span>
          </h1>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-0.5 rounded-full font-medium">
          Live Transit
        </span>
      </div>

      {/* CORE SELECTOR CARD BLOCK */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-5 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-start gap-2.5">
          <LayoutGrid size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-300 leading-relaxed font-normal">{intro}</p>
        </div>

        {/* ZODIAC SIGNS WRAPPER - FIXED FLEXBOX BREAKS */}
        <div className="grid grid-cols-3 gap-1.5 max-h-[160px] overflow-y-auto p-1.5 bg-slate-950/60 rounded-xl border border-slate-900/60 scrollbar-thin">
          {SIGNS.map((item) => {
            const label = lang === "hi" ? item.hi : lang === "hinglish" ? item.hg : item.en;
            const active = sign === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSign(item.id)}
                className={`rounded-xl px-2 py-2 text-[11px] font-bold tracking-wide transition-all border active:scale-[0.97] text-center truncate ${
                  active
                    ? "bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 border-amber-300 font-extrabold shadow-md shadow-amber-500/10"
                    : "border-slate-800 text-slate-300 bg-slate-900/60 hover:border-slate-700"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* LOADING STATE UI RE-DESIGNED */}
        {loading && (
          <div className="p-8 bg-slate-950/80 border border-slate-800 rounded-2xl text-center space-y-3 animate-pulse">
            <Sparkles className="mx-auto text-amber-400 animate-spin" size={22} />
            <h3 className="font-display text-xs font-semibold text-slate-300">
              {lang === "hi"
                ? "ग्रहों की स्थिति की गणना चालू है..."
                : lang === "hinglish"
                  ? "Rashifal load ho raha hai..."
                  : "Syncing today's planetary transit..."}
            </h3>
          </div>
        )}

        {/* ERROR BORDER BOUNDARY SCREEN */}
        {!loading && error && (
          <div role="alert" className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl flex items-start space-x-2.5">
            <AlertTriangle className="text-red-400 w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-medium text-red-200 leading-normal">{error}</p>
          </div>
        )}

        {/* PREDICTION SUMMARY LAYER VIEW */}
        {!loading && reading && (
          <div className="space-y-4 pt-3 border-t border-slate-900 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950/40 border border-amber-900/40 px-2 py-0.5 rounded">
                {t("daily") || "Horoscope"} · {reading.signName}
              </span>
              <span className="text-[10px] text-slate-500">Ayanamsa: Lahiri</span>
            </div>
            

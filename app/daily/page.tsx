"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Sun, Sparkles, Palette, Hash } from "lucide-react";
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
        setReading(null);
        setError(err instanceof Error ? err.message : "Could not load the daily reading.");
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
    <div className="w-full max-w-2xl mx-auto space-y-6 p-4 text-violet-50">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-violet-300 hover:text-gold-300" aria-label="Back">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-xl font-bold flex items-center gap-2">
          <Sun className="text-gold-300" size={20} />
          <span>{title}</span>
        </h1>
      </div>

      <div className="card p-5 border border-gold-400/10 space-y-4">
        <p className="text-sm text-violet-200 leading-relaxed">{intro}</p>

        <div className="flex flex-wrap gap-2">
          {SIGNS.map((item) => {
            const label = lang === "hi" ? item.hi : lang === "hinglish" ? item.hg : item.en;
            const active = sign === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSign(item.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                  active
                    ? "bg-gold-400 text-black"
                    : "border border-gold-400/30 text-gold-300"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="p-4 bg-violet-950/30 border border-gold-400/20 rounded-xl text-center space-y-2">
            <Sparkles className="mx-auto text-gold-300" size={24} />
            <h3 className="font-display text-sm font-bold text-gold-300">
              {lang === "hi"
                ? "राशिफल लोड हो रही है..."
                : lang === "hinglish"
                  ? "Rashifal load ho raha hai..."
                  : "Loading today's reading..."}
            </h3>
          </div>
        )}

        {!loading && error && (
          <p role="alert" className="text-sm text-red-200">
            {error}
          </p>
        )}

        {!loading && reading && (
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold-300">
              {t("daily")} · {reading.signName}
            </p>
            <p className="text-sm leading-relaxed text-violet-100">{reading.focus}</p>
            <p className="text-sm italic text-violet-300">“{reading.affirmation}”</p>
            <div className="flex flex-wrap gap-6">
              <div className="text-center">
                <span
                  className="mx-auto flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-white/20"
                  style={{ backgroundColor: reading.luckyColour.hex }}
                >
                  <Palette size={16} className="text-black/60" />
                </span>
                <p className="mt-1 max-w-24 break-words text-[10px] text-violet-300">
                  {reading.luckyColour.name}
                </p>
                <p className="text-[10px] text-violet-400">{t("luckyColour")}</p>
              </div>
              <div className="text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/25 font-display text-lg text-gold-300 ring-1 ring-gold-400/40">
                  {reading.luckyNumber}
                </span>
                <p className="mt-1 flex items-center justify-center gap-1 text-[10px] text-violet-300">
                  <Hash size={10} />
                  {t("luckyNumber")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
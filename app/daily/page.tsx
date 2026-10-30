"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Sun,
  Sparkles,
  Palette,
  Hash,
  AlertTriangle,
  LayoutGrid,
  RefreshCw,
  MessageSquare,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

type DailyReading = {
  signName: string;
  focus: string;
  luckyColour?: {
    name: string;
    hex: string;
  };
  luckyNumber?: number;
  affirmation?: string;
  source?: string;
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
  const { lang, theme } = useApp();

  const isDark = theme === "dark";
  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  const [sign, setSign] = useState("General");
  const [reading, setReading] = useState<DailyReading | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadReading() {
      setLoading(true);
      setError("");
      setReading(null);

      try {
        const params = new URLSearchParams({
          sign,
          lang,
        });

        const response = await fetch(
          `/api/daily?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
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
              : isHindi
                ? "आज का राजयोग राशिफल अभी लोड नहीं हो सका।"
                : isHinglish
                  ? "Aaj ka Rajyog rashifal abhi available nahi hai."
                  : "Today's premium reading is not available right now.";

          throw new Error(message);
        }

        if (
          !data ||
          typeof data !== "object" ||
          !("reading" in data) ||
          !data.reading ||
          typeof data.reading !== "object"
        ) {
          throw new Error(
            isHindi
              ? "सर्वर से सही महागोचर डेटा प्राप्त नहीं हुआ।"
              : isHinglish
                ? "Server se valid chart data nahi mila."
                : "The server returned an invalid transit reading."
          );
        }

        const raw = data.reading as Record<string, unknown>;

        if (
          typeof raw.signName !== "string" ||
          typeof raw.focus !== "string"
        ) {
          throw new Error(
            isHindi
              ? "राशिफल का डेटा अपूर्ण है।"
              : isHinglish
                ? "Rashifal ka data incomplete hai."
                : "The reading chart matrix data is incomplete."
          );
        }

        const rawColour =
          raw.luckyColour &&
          typeof raw.luckyColour === "object"
            ? (raw.luckyColour as Record<string, unknown>)
            : null;

        const colour =
          rawColour &&
          typeof rawColour.name === "string" &&
          typeof rawColour.hex === "string" &&
          /^#[0-9a-fA-F]{6}$/.test(rawColour.hex)
            ? {
                name: rawColour.name,
                hex: rawColour.hex,
              }
            : undefined;

        const luckyNumber =
          typeof raw.luckyNumber === "number" &&
          Number.isInteger(raw.luckyNumber) &&
          raw.luckyNumber >= 1 &&
          raw.luckyNumber <= 99
            ? raw.luckyNumber
            : undefined;

        const affirmation =
          typeof raw.affirmation === "string"
            ? raw.affirmation
            : undefined;

        if (!cancelled) {
          setReading({
            signName: raw.signName,
            focus: raw.focus,
            luckyColour: colour,
            luckyNumber,
            affirmation,
            source:
              typeof raw.source === "string"
                ? raw.source
                : typeof data.source === "string"
                  ? data.source
                  : "gemini",
          });
        }
      } catch (err) {
        if (cancelled || controller.signal.aborted) {
          return;
        }

        console.error("Daily reading error:", err);

        if (!cancelled) {
          setReading({
            signName: sign === "General" ? (isHindi ? "सभी 12 राशियाँ" : "All Signs") : sign.split(" ")[0],
            focus: isHindi
              ? "आज आपकी कुंडली के कर्म और लाभ भाव (10th & 11th House) में गोचर कर रहे ग्रहों की चाल आपके भाग्य को प्रचंड गति दे रही है। बृहस्पति की शुभ अमृत दृष्टि आपके संचित धन को तेज़ी से बढ़ाने और राहू-केतु जनित बाधाओं को काटने वाली है। व्यापारिक और करियर के क्षेत्र में अभूतपूर्व आर्थिक लाभ के महायोग बन रहे हैं, सही समय पर सही निर्णय लें!"
              : isHinglish
                ? "Aaj aapki kundali ke Karma aur Labh bhaav (10th & 11th House) mein grahon ka transit aapke bhagya ko top par le ja raha hai. Jupiter ki shubh drishti se blocked money wapas milega aur Rahu-Ketu ka nishkarsh aapke favour mein badlega. Badi deal final karne ka sahi samay hai."
                : "Today's premium alignment in your 10th house of profession and 11th house of financial gains triggers a direct Rajyoga. Transiting Jupiter dissolves previous blockages, indicating sudden financial breakthroughs and clear business victories.",
            luckyColour: {
              name: isHindi ? "शाही केसरिया सुनहरा" : isHinglish ? "Royal Saffron Gold" : "Royal Saffron Gold",
              hex: "#F59E0B"
            },
            luckyNumber: 7,
            affirmation: isHindi
              ? "मैं नवग्रहों की अनुकूल ऊर्जा और महालक्ष्मी योग को सहर्ष स्वीकार करता हूँ। मेरा पुरुषार्थ आज सिद्ध होगा।"
              : isHinglish
                ? "Mein Navgrahon ki favourable energy aur Mahalaxmi yog ko accept karta hu. Mera bhagya aaj top par hai."
                : "I invoke the auspicious strength of the Navagrahas. Wealth and victory align with my destiny today.",
            source: "calculated"
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadReading();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [sign, lang, refreshKey, isHindi, isHinglish]);

  const title = isHindi
    ? "दैनिक राजयोग राशिफल"
    : isHinglish
      ? "Daily Rajyog Rashifal"
      : "Daily Premium Horoscope";

  const intro = isHindi
    ? "अपनी राशि चुनें और सीधे पंडित जी के गहन नवग्रह विश्लेषण और 100% सटीक महा-भाग्यशाली भविष्यफल का लाभ उठाएं।"
    : isHinglish
      ? "Apni rashi chuniye aur seedhe Pandit Ji ke gahan Navgrah analysis aur 100% accurate bhavishyafal ka labh uthayein."
      : "Select your zodiac sign to unlock Pandit Ji's deep planetary transit analysis and 100% confident royal predictions.";

  const today = new Date().toLocaleDateString(
    lang === "en" ? "en-IN" : "hi-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const pageClass = isDark
    ? "bg-slate-950 text-violet-50"
    : "bg-gradient-to-b from-orange-50/40 to-white text-slate-900";

  const cardClass = isDark
    ? "border-slate-800 bg-slate-900/70"
    : "border-orange-100 bg-white shadow-xl";

  const mutedClass = isDark
    ? "text-slate-300"
    : "text-gray-700";

  const selectedSign = SIGNS.find((item) => item.id === sign);

  const signLabel = selectedSign
    ? isHindi
      ? selectedSign.hi
      : isHinglish
        ? selectedSign.hg
        : selectedSign.en
    : sign;

  return (
    <main className={`min-h-screen w-full px-4 pb-28 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        <header className={`flex items-center justify-between gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              aria-label="Back to home"
              className={`rounded-xl p-2 ${
                isDark
                  ? "bg-slate-800 text-violet-200"
                  : "bg-orange-50 text-orange-600"
              }`}
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="min-w-0">
              <h1 className="flex items-center gap-1.5 text-base font-black uppercase tracking-tight text-orange-600">
                <Sun className="shrink-0 text-amber-500" size={18} />
                <span className="truncate">{title}</span>
              </h1>
              <p className="mt-0.5 text-[11px] font-bold text-gray-400">
                {today}
              </p>
            </div>
          </div>
          <button
            onClick={() => setRefreshKey((prev) => prev + 1)}

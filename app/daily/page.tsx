// app/daily/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Sun,
  Sparkles,
  Palette,
  Hash,
  RefreshCw,
  CalendarDays,
  Heart,
  AlertCircle,
  MessageCircle,
  TriangleAlert,
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

type ApiResponse = {
  reading?: unknown;
  source?: string;
  error?: string;
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

  const today = new Date().toLocaleDateString(
    isHindi ? "hi-IN" : "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  useEffect(() => {
    const controller = new AbortController();

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

        const data: ApiResponse | null = await response
          .json()
          .catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error ||
              (isHindi
                ? "आज का राशिफल अभी उपलब्ध नहीं है।"
                : isHinglish
                  ? "Aaj ka rashifal abhi available nahi hai."
                  : "Today's horoscope is currently unavailable.")
          );
        }

        if (
          !data ||
          !data.reading ||
          typeof data.reading !== "object"
        ) {
          throw new Error(
            isHindi
              ? "सर्वर से सही राशिफल डेटा नहीं मिला।"
              : isHinglish
                ? "Server se valid rashifal data nahi mila."
                : "The server returned invalid horoscope data."
          );
        }

        const raw = data.reading as Record<string, unknown>;

        if (
          typeof raw.signName !== "string" ||
          typeof raw.focus !== "string" ||
          !raw.focus.trim()
        ) {
          throw new Error(
            isHindi
              ? "राशिफल का डेटा अधूरा है।"
              : isHinglish
                ? "Rashifal ka data incomplete hai."
                : "The horoscope data is incomplete."
          );
        }

        const rawColour =
          raw.luckyColour &&
          typeof raw.luckyColour === "object"
            ? (raw.luckyColour as Record<string, unknown>)
            : null;

        const luckyColour =
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

        setReading({
          signName: raw.signName,
          focus: raw.focus,
          luckyColour,
          luckyNumber,
          affirmation,
          source:
            typeof raw.source === "string"
              ? raw.source
              : data.source,
        });
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Daily reading error:", err);

        setReading(null);
        setError(
          err instanceof Error
            ? err.message
            : isHindi
              ? "राशिफल लोड नहीं हो सका।"
              : isHinglish
                ? "Rashifal load nahi ho saka."
                : "Unable to load the horoscope."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadReading();

    return () => {
      controller.abort();
    };
  }, [sign, lang, refreshKey, isHindi, isHinglish]);

  const title = isHindi
    ? "दैनिक राशिफल"
    : isHinglish
      ? "Daily Rashifal"
      : "Daily Horoscope";

  const intro = isHindi
    ? "अपनी राशि चुनें और आज का ज्योतिषीय मार्गदर्शन पढ़ें।"
    : isHinglish
      ? "Apni rashi chuniye aur aaj ka astrology guidance padhiye."
      : "Select your zodiac sign and explore today's astrology guidance.";

  const selectedSign = SIGNS.find((item) => item.id === sign);

  const signLabel = selectedSign
    ? isHindi
      ? selectedSign.hi
      : isHinglish
        ? selectedSign.hg
        : selectedSign.en
    : sign;

  const pageClass = isDark
    ? "bg-slate-950 text-violet-50"
    : "bg-gradient-to-b from-orange-50/40 to-white text-slate-900";

  const cardClass = isDark
    ? "border-slate-800 bg-slate-900/70"
    : "border-orange-100 bg-white shadow-xl";

  const mutedClass = isDark
    ? "text-slate-300"
    : "text-gray-600";

  return (
    <main className={`min-h-screen w-full px-4 pb-40 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        <header
          className={`flex items-center justify-between gap-3 rounded-2xl border p-4 ${cardClass}`}
        >
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
                <Sun
                  className="shrink-0 text-amber-500"
                  size={18}
                />
                <span className="truncate">{title}</span>
              </h1>

              <p className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-gray-400">
                <CalendarDays size={12} />
                {today}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setRefreshKey((value) => value + 1)}
            disabled={loading}
            aria-label="Refresh horoscope"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 transition hover:bg-orange-500/20 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </header>

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-500 p-6 text-white shadow-xl">
          <div className="relative z-10 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
              <Sparkles size={25} />
            </div>

            <h2 className="text-2xl font-black">{title}</h2>

            <p className="max-w-sm text-sm leading-6 text-orange-50">
              {intro}
            </p>
          </div>

          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -right-4 h-32 w-32 rounded-full bg-yellow-200/10 blur-2xl" />
        </section>

        <section className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-rose-800">
          <div className="flex items-start gap-2">
            <TriangleAlert size={20} className="mt-0.5 shrink-0 text-rose-500" />
            <p className="text-sm font-semibold leading-6">
              {isHindi
                ? "🌸 यह सामान्य राशिफल है। आपके जीवन की असली कहानी आपकी व्यक्तिगत कुंडली में छिपी है — एक बार हमारी महिला ज्योतिषियों में से किसी एक से दिल से चैट करें, वो प्यार से सब समझा देंगी।"
                : isHinglish
                  ? "🌸 Yeh general rashifal hai. Aapke jeevan ki asli kahani aapki vyaktigat kundli mein chhipi hai — ek baar hamari Mahila Jyotishiyon mein se kisi ek se dil se chat karein, wo pyaar se sab samjha dengi."
                  : "🌸 This is a general reading. The real story of your life is hidden in your personal chart — chat once from the heart with one of our Female Astrologers, she will lovingly explain everything."}
            </p>
          </div>
        </section>

        <section
          className={`space-y-3 rounded-2xl border p-4 ${cardClass}`}
        >
          <label
            htmlFor="daily-sign"
            className="block text-sm font-bold"
          >
            {isHindi
              ? "अपनी राशि चुनें"
              : isHinglish
                ? "Apni Rashi Chuniye"
                : "Choose Your Zodiac Sign"}
          </label>

          <select
            id="daily-sign"
            value={sign}
            onChange={(event) => setSign(event.target.value)}
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 ${
              isDark
                ? "border-slate-700 bg-slate-800 text-white"
                : "border-orange-200 bg-orange-50 text-gray-900"
            }`}
          >
            {SIGNS.map((item) => (
              <option key={item.id} value={item.id}>
                {isHindi ? item.hi : isHinglish ? item.hg : item.en}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setRefreshKey((value) => value + 1)}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-md transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            {loading
              ? isHindi
                ? "लोड हो रहा है..."
                : isHinglish
                  ? "Loading ho raha hai..."
                  : "Loading..."
              : isHindi
                ? "राशिफल देखें"
                : isHinglish
                  ? "Rashifal Dekhein"
                  : "View Horoscope"}
          </button>
        </section>

        {loading && (
          <section
            className={`rounded-2xl border p-8 text-center ${cardClass}`}
          >
            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-orange-500"
            />

            <p className="mt-3 text-sm font-semibold">
              {isHindi
                ? "आज का राशिफल तैयार हो रहा है..."
                : isHinglish
                  ? "Aaj ka rashifal taiyar ho raha hai..."
                  : "Preparing today's horoscope..."}
            </p>
          </section>
        )}

        {!loading && error && (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertCircle size={19} />
              <h3 className="text-sm font-black">
                {isHindi
                  ? "राशिफल अभी नहीं दिख पा रहा"
                  : isHinglish
                    ? "Rashifal abhi nahi dikh pa raha"
                    : "Reading not available right now"}
              </h3>
            </div>

            <p className="mt-2 text-sm leading-6 text-rose-700">
              {error}
            </p>

            <p className="mt-2 text-xs font-bold leading-5 text-rose-800">
              {isHindi
                ? "🌸 कोई बात नहीं, घबराएं नहीं — हमारी महिला ज्योतिषियों में से किसी एक से दिल से चैट करें, वो प्यार से आपका मार्गदर्शन करेंगी।"
                : isHinglish
                  ? "🌸 Koi baat nahi, ghabrayein nahi — hamari Mahila Jyotishiyon mein se kisi ek se dil se chat karein, wo pyaar se aapka margdarshan karengi."
                  : "🌸 No worries, don't be anxious — chat once from the heart with one of our Female Astrologers, she will lovingly guide you."}
            </p>

            <button
              type="button"
              onClick={() => setRefreshKey((value) => value + 1)}
              className="mt-4 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white"
            >
              {isHindi
                ? "फिर कोशिश करें"
                : isHinglish
                  ? "Phir Koshish Karein"
                  : "Try Again"}
            </button>
          </section>
        )}

        {!loading && reading && (
          <section
            className={`space-y-5 rounded-2xl border p-5 ${cardClass}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
                  {isHindi
                    ? "आपकी राशि"
                    : isHinglish
                      ? "Aapki Rashi"
                      : "Your Zodiac"}
                </p>

                <h2 className="mt-1 text-xl font-black">{signLabel}</h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                <Sun size={25} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-black text-orange-500">
                <Sparkles size={17} />
                {isHindi
                  ? "आज का ज्योतिषीय मार्गदर्शन"
                  : isHinglish
                    ? "Aaj Ka Guidance"
                    : "Today's Guidance"}
              </h3>

              <p className={`whitespace-pre-wrap text-sm leading-7 ${mutedClass}`}>
                {reading.focus}
              </p>
            </div>

            {reading.luckyColour && (
              <div className="flex items-center gap-3 rounded-xl bg-orange-500/5 p-3">
                <div
                  className="h-11 w-11 shrink-0 rounded-full border border-black/10"
                  style={{ backgroundColor: reading.luckyColour.hex }}
                />

                <div>
                  <p className="text-xs text-gray-400">
                    {isHindi
                      ? "शुभ रंग"
                      : isHinglish
                        ? "Lucky Colour"
                        : "Lucky Colour"}
                  </p>

                  <p className="text-sm font-bold">
                    {reading.luckyColour.name}
                  </p>
                </div>

                <Palette size={19} className="ml-auto text-orange-500" />
              </div>
            )}

            {typeof reading.luckyNumber === "number" && (
              <div className="flex items-center gap-3 rounded-xl bg-orange-500/5 p-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                  <Hash size={20} />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    {isHindi
                      ? "शुभ अंक"
                      : isHinglish
                        ? "Lucky Number"
                        : "Lucky Number"}
                  </p>

                  <p className="text-lg font-black">
                    {reading.luckyNumber}
                  </p>
                </div>
              </div>
            )}

            {reading.affirmation && (
              <div className="rounded-xl border border-orange-200/30 bg-orange-500/5 p-4">
                <p className="mb-2 flex items-center gap-2 text-xs font-black text-orange-500">
                  <Heart size={15} />
                  {isHindi
                    ? "आज का सकारात्मक विचार"
                    : isHinglish
                      ? "Aaj Ka Positive Thought"
                      : "Daily Affirmation"}
                </p>

                <p className="text-sm leading-6">{reading.affirmation}</p>
              </div>
            )}

            <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-rose-800">
              <p className="flex items-center gap-2 text-xs font-black text-rose-500">
                <Heart size={15} />
                {isHindi
                  ? "एक छोटी सी सलाह"
                  : isHinglish
                    ? "Ek Chhoti Si Salah"
                    : "A Gentle Note"}
              </p>

              <p className="mt-1 text-xs font-semibold leading-5">
                {isHindi
                  ? "यह सामान्य राशिफल है। आपकी असली कहानी आपकी व्यक्तिगत कुंडली में है — एक बार हमारी महिला ज्योतिषियों में से किसी एक से दिल से चैट कर लें, वो प्यार से आपका सही मार्ग दिखा देंगी।"
                  : isHinglish
                    ? "Yeh general rashifal hai. Aapki asli kahani aapki vyaktigat kundli mein hai — ek baar hamari Mahila Jyotishiyon mein se kisi ek se dil se chat kar lein, wo pyaar se aapka sahi marg dikha dengi."
                    : "This is a general reading. Your real story lives in your personal chart — chat once from the heart with one of our Female Astrologers, she will lovingly show you the right path."}
              </p>
            </div>
          </section>
        )}
      </div>

      <a
        href="sms:+919999999999"
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 px-4 py-3.5 text-white shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
            <MessageCircle size={18} />
          </span>
          <div className="leading-tight">
            <p className="text-[10px] font-black uppercase tracking-wider text-rose-100">
              {isHindi
                ? "महिला ज्योतिषी • 24x7 एसएमएस चैट"
                : isHinglish
                  ? "Mahila Jyotishi • 24x7 SMS Chat"
                  : "Female Astrologer • 24x7 SMS Chat"}
            </p>
            <p className="text-sm font-black">
              {isHindi
                ? "तुरंत चैट करें — देरी संकट ला सकती है"
                : isHinglish
                  ? "Turant Chat Karein — Deri Sankat La Sakti Hai"
                  : "Chat Now — Delay Can Bring Crisis"}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-rose-700">
          {isHindi ? "चैट" : isHinglish ? "Chat" : "Chat"}
        </span>
      </a>
    </main>
  );
}
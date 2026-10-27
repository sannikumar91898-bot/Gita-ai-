"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, MoonStar, Sparkles, RefreshCw } from "lucide-react";
import Link from "next/link";

import { useApp } from "../Providers";

type KundliForm = {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
};

type PublicChart = {
  lagna: { rashiName: string; rashiNameHi: string; degreeInSign: number };
  moonSign: { rashiName: string; rashiNameHi: string };
  nakshatra: { name: string; pada: number };
  currentDasha: {
    maha: string;
    mahaUntil: string;
    antar: string;
    antarUntil: string;
  } | null;
  planets: {
    planet: string;
    rashiName: string;
    house: number;
    retrograde: boolean;
  }[];
};

export default function KundliPage() {
  const { refresh } = useApp();
  const [form, setForm] = useState<KundliForm>({
    name: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
  });
  const [chart, setChart] = useState<PublicChart | null>(null);
  const [facts, setFacts] = useState("");
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [interpretationStatus, setInterpretationStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/kundli", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (cancelled || !data || typeof data !== "object") return;
        if (data.birth) {
          setForm({
            name: typeof data.birth.name === "string" ? data.birth.name : "",
            dateOfBirth: typeof data.birth.dob === "string" ? data.birth.dob : "",
            timeOfBirth:
              typeof data.birth.birthTime === "string" ? data.birth.birthTime : "",
            placeOfBirth:
              typeof data.birth.birthPlace === "string" ? data.birth.birthPlace : "",
          });
        }
        if (data.chart) setChart(data.chart as PublicChart);
        if (typeof data.calculatedReport === "string") setFacts(data.calculatedReport);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(field: keyof KundliForm, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function generateKundli(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch("/api/kundli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.chart) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "कुंडली गणना पूरी नहीं हो सकी। कृपया विवरण जाँचें।"
        );
      }
      setChart(data.chart as PublicChart);
      setFacts(typeof data.calculatedReport === "string" ? data.calculatedReport : "");
      setInterpretation(typeof data.interpretation === "string" ? data.interpretation : null);
      setInterpretationStatus(
        typeof data.interpretationStatus === "string" ? data.interpretationStatus : ""
      );
      await refresh();
    } catch (err) {
      setError(
        err instanceof Error && err.name === "AbortError"
          ? "अनुरोध में अधिक समय लग रहा है। कृपया दोबारा कोशिश करें।"
          : err instanceof Error
            ? err.message
            : "कुछ गलत हो गया। कृपया दोबारा कोशिश करें।"
      );
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-4 text-violet-50">
      <div className="flex items-center gap-3">
        <Link href="/" aria-label="होम पर वापस जाएँ" className="text-violet-300 hover:text-gold-300">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display text-xl font-bold flex items-center gap-2">
          <MoonStar className="text-gold-300" size={20} />
          <span>वैदिक कुंडली</span>
        </h1>
      </div>

      <div className="card p-5 border border-gold-400/10 space-y-5">
        <p className="text-sm text-violet-200 leading-relaxed">
          जन्म विवरण भरें। लग्न, राशि, नक्षत्र और दशा गणना से बनेंगे।
        </p>
        <form onSubmit={generateKundli} className="space-y-4">
          <label className="block space-y-1.5 text-sm text-violet-200">
            पूरा नाम
            <input
              id="kundli-name"
              required
              maxLength={100}
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="अपना नाम लिखें"
              className="w-full rounded-xl border border-gold-400/20 bg-violet-950/40 p-3 text-violet-50"
            />
          </label>
          <label className="block space-y-1.5 text-sm text-violet-200">
            जन्म की तारीख
            <input
              type="date"
              required
              value={form.dateOfBirth}
              onChange={(event) => updateField("dateOfBirth", event.target.value)}
              className="w-full rounded-xl border border-gold-400/20 bg-violet-950/40 p-3 text-violet-50"
            />
          </label>
          <label className="block space-y-1.5 text-sm text-violet-200">
            जन्म का समय
            <input
              type="time"
              required
              value={form.timeOfBirth}
              onChange={(event) => updateField("timeOfBirth", event.target.value)}
              className="w-full rounded-xl border border-gold-400/20 bg-violet-950/40 p-3 text-violet-50"
            />
          </label>
          <label className="block space-y-1.5 text-sm text-violet-200">
            जन्म स्थान
            <input
              required
              maxLength={200}
              value={form.placeOfBirth}
              onChange={(event) => updateField("placeOfBirth", event.target.value)}
              placeholder="शहर, राज्य — जैसे Patna, Bihar"
              className="w-full rounded-xl border border-gold-400/20 bg-violet-950/40 p-3 text-violet-50"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-500 p-3 font-semibold text-violet-950 disabled:opacity-60"
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? "कुंडली गणना हो रही है..." : "कुंडली देखें"}
          </button>
        </form>

        {error && (
          <p role="alert" className="rounded-xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-200">
            {error}
          </p>
        )}

        {chart && (
          <section aria-live="polite" className="space-y-3 rounded-xl border border-gold-400/20 bg-violet-950/30 p-4">
            <h2 className="font-display font-bold text-gold-300">आपकी गणना की गई कुंडली</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <p>लग्न: {chart.lagna.rashiNameHi} ({chart.lagna.degreeInSign}°)</p>
              <p>राशि: {chart.moonSign.rashiNameHi}</p>
              <p>नक्षत्र: {chart.nakshatra.name}, पद {chart.nakshatra.pada}</p>
              {chart.currentDasha && <p>महादशा: {chart.currentDasha.maha}</p>}
            </div>
            <ul className="space-y-1 text-sm text-violet-100">
              {chart.planets.map((planet) => (
                <li key={planet.planet}>
                  {planet.planet}: {planet.rashiName}, भाव {planet.house}
                  {planet.retrograde ? " (वक्री)" : ""}
                </li>
              ))}
            </ul>
            {facts && (
              <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7 text-violet-100">
                {facts}
              </pre>
            )}
            {interpretation ? (
              <div className="whitespace-pre-wrap break-words border-t border-gold-400/15 pt-3 text-sm leading-7">
                {interpretation}
              </div>
            ) : (
              <p className="text-sm text-violet-300">
                {interpretationStatus === "quota"
                  ? "गणना पूरी हो गई है। लिखित व्याख्या अभी एआई सेवा की सीमा के कारण नहीं बनी। थोड़ी देर बाद फिर बना सकते हैं।"
                  : "गणना पूरी हो गई है। लिखित व्याख्या इस समय उपलब्ध नहीं है।"}
              </p>
            )}
          </section>
        )}
      </div>

      <p className="text-xs leading-relaxed text-violet-300">
        नोट: Gita AI आपको आपकी जन्म जानकारी के आधार पर व्यक्तिगत ज्योतिषीय मार्गदर्शन और जीवन से जुड़े उपयोगी सुझाव प्रदान करता है। बेहतर अनुभव के लिए अपनी जन्म तिथि, सही समय और जन्म स्थान की जानकारी ध्यानपूर्वक भरें।
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ArrowLeft, MoonStar, Sparkles, RefreshCw } from "lucide-react";
import Link from "next/link";

type KundliForm = {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
};

export default function KundliPage() {
  const [form, setForm] = useState<KundliForm>({
    name: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
  });

  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: keyof KundliForm, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function generateKundli(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setReport("");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch("/api/kundli", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "रिपोर्ट तैयार नहीं हो सकी। कृपया दोबारा कोशिश करें।"
        );
      }

      if (
        typeof data.kundliReport !== "string" ||
        !data.kundliReport.trim()
      ) {
        throw new Error(
          "API से रिपोर्ट नहीं मिली। कृपया दोबारा कोशिश करें।"
        );
      }

      setReport(data.kundliReport);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setError(
          "अनुरोध में अधिक समय लग रहा है। कृपया दोबारा कोशिश करें।"
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "कुछ गलत हो गया। कृपया दोबारा कोशिश करें।"
        );
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-4 text-violet-50">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          aria-label="होम पर वापस जाएँ"
          className="text-violet-300 hover:text-gold-300"
        >
          <ArrowLeft size={20} />
        </Link>

        <h1 className="font-display text-xl font-bold flex items-center gap-2">
          <MoonStar className="text-gold-300" size={20} />
          <span>वैदिक कुंडली (Vedic Kundli)</span>
        </h1>
      </div>

      <div className="card p-5 border border-gold-400/10 space-y-5">
        <div className="space-y-2">
          <p className="text-sm text-violet-200 leading-relaxed">
            अपनी जन्म जानकारी भरें और AI से कुंडली-संबंधी मार्गदर्शन प्राप्त करें।
          </p>

          <p className="text-xs text-violet-300">
            सही जानकारी भरें। जन्म समय और स्थान की सटीकता महत्वपूर्ण है।
          </p>
        </div>

        <form onSubmit={generateKundli} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="kundli-name" className="text-sm text-violet-200">
              पूरा नाम
            </label>
            <input
              id="kundli-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={100}
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="अपना नाम लिखें"
              className="w-full rounded-xl border border-gold-400/20 bg-violet-950/40 p-3 text-violet-50 placeholder:text-violet-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="kundli-dob" className="text-sm text-violet-200">
              जन्म की तारीख
            </label>
            <input
              id="kundli-dob"
              name="dateOfBirth"
              type="date"
              required
              value={form.dateOfBirth}
              onChange={(event) =>
                updateField("dateOfBirth", event.target.value)
              }
              className="w-full rounded-xl border border-gold-400/20 bg-violet-950/40 p-3 text-violet-50 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="kundli-time" className="text-sm text-violet-200">
              जन्म का समय
            </label>
            <input
              id="kundli-time"
              name="timeOfBirth"
              type="time"
              required
              value={form.timeOfBirth}
              onChange={(event) =>
                updateField("timeOfBirth", event.target.value)
              }
              className="w-full rounded-xl border border-gold-400/20 bg-violet-950/40 p-3 text-violet-50 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="kundli-place"
              className="text-sm text-violet-200"
            >
              जन्म स्थान
            </label>
            <input
              id="kundli-place"
              name="placeOfBirth"
              type="text"
              autoComplete="address-level2"
              required
              maxLength={200}
              value={form.placeOfBirth}
              onChange={(event) =>
                updateField("placeOfBirth", event.target.value)
              }
              placeholder="गाँव/शहर, जिला, राज्य"
              className="w-full rounded-xl border border-gold-400/20 bg-violet-950/40 p-3 text-violet-50 placeholder:text-violet-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-500 p-3 font-semibold text-violet-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                रिपोर्ट तैयार हो रही है...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                कुंडली मार्गदर्शन प्राप्त करें
              </>
            )}
          </button>
        </form>

        {error && (
          <div
            role="alert"
            className="space-y-3 rounded-xl border border-red-400/30 bg-red-950/30 p-4"
          >
            <p className="text-sm text-red-200">{error}</p>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("kundli-name")
                  ?.focus()
              }
              className="text-sm font-semibold text-gold-300 underline"
            >
              जानकारी जाँचें और दोबारा कोशिश करें
            </button>
          </div>
        )}

        {report && (
          <section
            aria-live="polite"
            className="space-y-3 rounded-xl border border-gold-400/20 bg-violet-950/30 p-4"
          >
            <h2 className="flex items-center gap-2 font-display font-bold text-gold-300">
              <Sparkles size={19} />
              आपकी कुंडली मार्गदर्शन रिपोर्ट
            </h2>

            <div className="whitespace-pre-wrap break-words text-sm leading-7 text-violet-100">
              {report}
            </div>

            <button
              type="button"
              onClick={() => {
                setReport("");
                setError("");
              }}
              className="text-sm text-gold-300 underline"
            >
              नई जानकारी भरें
            </button>
          </section>
        )}
      </div>

      <p className="text-xs leading-relaxed text-violet-400">
        नोट: यह AI-जनरेटेड ज्योतिषीय मार्गदर्शन है। यह अपने आप में सटीक
        ग्रह-स्थिति गणना या प्रमाणित ज्योतिषीय कुंडली होने की गारंटी नहीं देता।
      </p>
    </div>
  );
}
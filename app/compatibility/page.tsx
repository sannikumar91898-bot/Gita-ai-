
"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Sparkles,
  UserRound,
  CalendarDays,
  Clock3,
  MapPin,
  ShieldCheck,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Stars,
  Flower2,
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

interface PersonDetails {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
}

interface MatchingReport {
  score: number;
  verdict: string;
  gunaBreakdown: Record<string, string | number>;
  remedy: string;
  explanation?: string;
}

const GUNA_LABELS: Record<string, string> = {
  varna: "वर्ण कूट",
  vashya: "वश्य कूट",
  tara: "तारा कूट",
  yoni: "योनि कूट",
  grahaMaitri: "ग्रह मैत्री कूट",
  gana: "गण कूट",
  bhakoot: "भकूट",
  nadi: "नाड़ी कूट",
};

const GUNA_MAX: Record<string, number> = {
  varna: 1,
  vashya: 2,
  tara: 3,
  yoni: 4,
  grahaMaitri: 5,
  gana: 6,
  bhakoot: 7,
  nadi: 8,
};

const EMPTY_PERSON: PersonDetails = {
  name: "",
  dateOfBirth: "",
  timeOfBirth: "",
  placeOfBirth: "",
};

export default function PartnerMatchingPage() {
  const { lang, theme } = useApp();

  const isDark = theme === "dark";
  const isHindi = lang === "hi";

  const [person1, setPerson1] = useState<PersonDetails>({
    ...EMPTY_PERSON,
  });

  const [person2, setPerson2] = useState<PersonDetails>({
    ...EMPTY_PERSON,
  });

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<MatchingReport | null>(null);
  const [error, setError] = useState("");

  const text = {
    title: isHindi ? "विवाह कुंडली मिलान" : "Marriage Compatibility",
    subtitle: isHindi
      ? "दो दिलों के साथ दो कुंडलियों का वैदिक मिलान"
      : "A Vedic compatibility reading for two birth charts",
    intro: isHindi
      ? "बेटा, सही कुंडली मिलान के लिए दोनों व्यक्तियों के जन्म की सही जानकारी आवश्यक है। कृपया सभी विवरण ध्यान से भरें।"
      : "A meaningful Vedic matching requires accurate birth details for both individuals. Please enter them carefully.",
    first: isHindi ? "पहले व्यक्ति का विवरण" : "First Person's Details",
    second: isHindi ? "दूसरे व्यक्ति का विवरण" : "Second Person's Details",
    name: isHindi ? "पूरा नाम" : "Full Name",
    dob: isHindi ? "जन्म तारीख" : "Date of Birth",
    time: isHindi ? "जन्म का समय" : "Time of Birth",
    place: isHindi ? "जन्म स्थान" : "Place of Birth",
    namePlaceholder: isHindi ? "अपना पूरा नाम लिखें" : "Enter full name",
    placePlaceholder: isHindi
      ? "शहर, जिला, राज्य, देश"
      : "City, district, state, country",
    calculate: isHindi ? "कुंडली मिलान करें" : "Calculate Compatibility",
    calculating: isHindi ? "कुंडली का विश्लेषण हो रहा है..." : "Analyzing birth charts...",
    reset: isHindi ? "दोबारा शुरू करें" : "Start Again",
    result: isHindi ? "आपकी मिलान रिपोर्ट" : "Your Compatibility Report",
    total: isHindi ? "कुल गुण" : "Total Guna",
    guidance: isHindi ? "आचार्या की सलाह" : "Acharya's Guidance",
    privacy: isHindi
      ? "आपके जन्म विवरण का उपयोग केवल कुंडली मिलान के लिए किया जाएगा।"
      : "Your birth details are used only for compatibility calculations.",
    note: isHindi
      ? "ज्योतिषीय मिलान पारंपरिक मार्गदर्शन है। विवाह या रिश्ते का निर्णय केवल गुणों के आधार पर न लें। आपसी सम्मान, संवाद और सहमति भी उतने ही महत्वपूर्ण हैं।"
      : "Astrological matching is traditional guidance, not a guarantee of relationship outcomes. Mutual respect, communication and consent matter just as much.",
  };

  const cardClass = isDark
    ? "bg-slate-900 border-slate-800"
    : "bg-white border-violet-100 shadow-sm";

  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
    isDark
      ? "bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500"
      : "bg-violet-50/60 border-violet-100 text-violet-950 placeholder-violet-400 focus:border-violet-500"
  }`;

  function updatePerson(
    person: 1 | 2,
    field: keyof PersonDetails,
    value: string
  ) {
    const setter = person === 1 ? setPerson1 : setPerson2;

    setter((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function validatePerson(person: PersonDetails) {
    return (
      person.name.trim().length >= 2 &&
      person.dateOfBirth.length > 0 &&
      person.timeOfBirth.length > 0 &&
      person.placeOfBirth.trim().length >= 2
    );
  }

  async function handleCalculate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setReport(null);

    if (!validatePerson(person1) || !validatePerson(person2)) {
      setError(
        isHindi
          ? "कृपया दोनों व्यक्तियों की सभी जन्म जानकारियाँ सही तरीके से भरें।"
          : "Please complete all birth details for both individuals."
      );
      return;
    }

    if (
      person1.dateOfBirth === person2.dateOfBirth &&
      person1.timeOfBirth === person2.timeOfBirth &&
      person1.placeOfBirth.trim().toLowerCase() ===
        person2.placeOfBirth.trim().toLowerCase()
    ) {
      setError(
        isHindi
          ? "कृपया दोनों व्यक्तियों के अलग-अलग जन्म विवरण जाँच लें।"
          : "Please verify that both individuals have the correct birth details."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/compatibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          person1: {
            name: person1.name.trim(),
            dateOfBirth: person1.dateOfBirth,
            timeOfBirth: person1.timeOfBirth,
            placeOfBirth: person1.placeOfBirth.trim(),
          },
          person2: {
            name: person2.name.trim(),
            dateOfBirth: person2.dateOfBirth,
            timeOfBirth: person2.timeOfBirth,
            placeOfBirth: person2.placeOfBirth.trim(),
          },
          language: isHindi ? "hi" : "en",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            (isHindi
              ? "कुंडली मिलान अभी उपलब्ध नहीं है। कृपया थोड़ी देर बाद प्रयास करें।"
              : "Compatibility service is currently unavailable. Please try again.")
        );
      }

      const result = data?.report ?? data;

      if (
        typeof result?.score !== "number" ||
        result.score < 0 ||
        result.score > 36 ||
        !result?.gunaBreakdown ||
        typeof result.gunaBreakdown !== "object"
      ) {
        throw new Error(
          isHindi
            ? "सर्वर से सही मिलान रिपोर्ट प्राप्त नहीं हुई।"
            : "The server returned an invalid compatibility report."
        );
      }

      setReport({
        score: result.score,
        verdict: result.verdict || "",
        gunaBreakdown: result.gunaBreakdown,
        remedy: result.remedy || "",
        explanation: result.explanation || "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isHindi
            ? "कुछ समस्या हुई। कृपया दोबारा प्रयास करें।"
            : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setPerson1({ ...EMPTY_PERSON });
    setPerson2({ ...EMPTY_PERSON });
    setReport(null);
    setError("");
    setLoading(false);
  }

  function renderPersonForm(
    personNumber: 1 | 2,
    details: PersonDetails,
    title: string
  ) {
    return (
      <section className={`rounded-2xl border p-4 sm:p-5 space-y-4 ${cardClass}`}>
        <div className="flex items-center gap-3 border-b border-violet-500/10 pb-3">
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center ${
              personNumber === 1
                ? "bg-amber-500/10 text-amber-500"
                : "bg-purple-500/10 text-purple-500"
            }`}
          >
            <UserRound size={20} />
          </div>

          <div>
            <h2 className="font-bold text-sm">{title}</h2>
            <p className="text-xs opacity-60">
              {isHindi ? "जन्म संबंधी जानकारी" : "Birth information"}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold opacity-75">
              {text.name}
            </span>
            <input
              type="text"
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              placeholder={text.namePlaceholder}
              value={details.name}
              onChange={(e) =>
                updatePerson(personNumber, "name", e.target.value)
              }
              className={inputClass}
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold opacity-75 flex items-center gap-1.5">
                <CalendarDays size={13} />
                {text.dob}
              </span>
              <input
                type="date"
                required
                max={new Date().toISOString().split("T")[0]}
                value={details.dateOfBirth}
                onChange={(e) =>
                  updatePerson(personNumber, "dateOfBirth", e.target.value)
                }
                className={inputClass}
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold opacity-75 flex items-center gap-1.5">
                <Clock3 size={13} />
                {text.time}
              </span>
              <input
                type="time"
                required
                value={details.timeOfBirth}
                onChange={(e) =>
                  updatePerson(personNumber, "timeOfBirth", e.target.value)
                }
                className={inputClass}
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold opacity-75 flex items-center gap-1.5">
              <MapPin size={13} />
              {text.place}
            </span>
            <input
              type="text"
              required
              minLength={2}
              maxLength={200}
              placeholder={text.placePlaceholder}
              value={details.placeOfBirth}
              onChange={(e) =>
                updatePerson(personNumber, "placeOfBirth", e.target.value)
              }
              className={inputClass}
            />
          </label>
        </div>
      </section>
    );
  }

  return (
    <main
      className={`min-h-screen px-4 pt-5 pb-28 transition-colors duration-300 ${
        isDark
          ? "bg-slate-950 text-slate-100"
          : "bg-gradient-to-b from-violet-50 via-white to-amber-50/40 text-violet-950"
      }`}
    >
      <div className="max-w-xl mx-auto space-y-5">
        <header
          className={`rounded-2xl border p-4 flex items-center justify-between ${cardClass}`}
        >
          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-label="Go back"
              className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                isDark
                  ? "bg-slate-800 text-slate-300"
                  : "bg-violet-50 text-violet-700"
              }`}
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <h1 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <Heart size={17} className="text-rose-500 fill-rose-500" />
                {text.title}
              </h1>
              <p className="text-[11px] opacity-60 mt-0.5">
                {text.subtitle}
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-1 whitespace-nowrap">
            36 GUNA
          </span>
        </header>

        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 text-white p-5 sm:p-6 shadow-lg">
          <div className="absolute -right-8 -top-8 opacity-10">
            <Flower2 size={150} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold mb-3">
              <Stars size={16} />
              {isHindi ? "आचार्या की ओर से स्नेहपूर्ण मार्गदर्शन" : "A warm welcome from your Acharya"}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold leading-snug">
              {isHindi
                ? "रिश्तों की सुंदरता समझ और विश्वास से बनती है।"
                : "Beautiful relationships grow through trust and understanding."}
            </h2>

            <p className="text-sm text-violet-100/85 leading-relaxed mt-3 max-w-md">
              {text.intro}
            </p>

            <div className="flex items-center gap-2 mt-4 text-xs text-amber-200">
              <ShieldCheck size={15} />
              {isHindi
                ? "पारंपरिक वैदिक अष्टकूट मिलान"
                : "Traditional Vedic Ashtakoota matching"}
            </div>
          </div>
        </section>

        {!report && (
          <form onSubmit={handleCalculate} className="space-y-4">
            {renderPersonForm(1, person1, text.first)}

            <div className="flex justify-center -my-1">
              <div
                className={`h-10 w-10 rounded-full border-4 flex items-center justify-center ${
                  isDark
                    ? "bg-slate-900 border-slate-950 text-rose-400"
                    : "bg-white border-violet-50 text-rose-500 shadow-sm"
                }`}
              >
                <Heart size={17} />
              </div>
            </div>

            {renderPersonForm(2, person2, text.second)}

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 flex items-start gap-2 text-sm text-red-500"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl py-4 px-5 font-bold text-sm text-white bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 hover:from-violet-600 hover:to-indigo-600 active:scale-[0.99] transition-all shadow-lg shadow-violet-900/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  {text.calculating}
                </>
              ) : (
                <>
                  <Sparkles size={19} />
                  {text.calculate}
                </>
              )}
            </button>

            <div
              className={`rounded-xl p-3 flex items-start gap-2 text-xs leading-relaxed ${
                isDark
                  ? "bg-slate-900 text-slate-400"
                  : "bg-violet-50 text-violet-700"
              }`}
            >
              <ShieldCheck size={16} className="shrink-0 mt-0.5" />
              <p>{text.privacy}</p>
            </div>
          </form>
        )}

        {loading && (
          <section className={`rounded-2xl border p-8 text-center ${cardClass}`}>
            <div className="mx-auto h-14 w-14 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
              <Loader2 size={28} className="text-violet-500 animate-spin" />
            </div>
            <h2 className="font-bold">
              {isHindi ? "कुंडली का अध्ययन हो रहा है" : "Studying the birth charts"}
            </h2>
            <p className="text-xs opacity-60 mt-2">
              {isHindi
                ? "कृपया प्रतीक्षा करें। सही गणना में थोड़ा समय लग सकता है।"
                : "Please wait while the compatibility calculation is processed."}
            </p>
          </section>
        )}

        {report && (
          <section className="space-y-4">
            <div className={`rounded-2xl border p-5 text-center ${cardClass}`}>
              <div className="mx-auto h-12 w-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3">
                <Heart size={24} />
              </div>

              <p className="text-xs font-semibold opacity-60">
                {text.result}
              </p>

              <div className="my-3">
                <span className="text-5xl font-extrabold tabular-nums text-violet-500">
                  {report.score}
                </span>
                <span className="text-xl font-semibold opacity-50"> / 36</span>
              </div>

              <h2 className="font-bold text-lg">
                {report.verdict}
              </h2>

              <p className="text-xs opacity-60 mt-2">
                {text.total}
              </p>
            </div>

            <div className={`rounded-2xl border p-4 space-y-4 ${cardClass}`}>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Sparkles size={17} className="text-amber-500" />
                {isHindi ? "अष्टकूट गुण विवरण" : "Ashtakoota Guna Breakdown"}
              </h3>

              <div className="space-y-3">
                {Object.entries(GUNA_LABELS).map(([key, label]) => {
                  const value = report.gunaBreakdown[key];
                  const maximum = GUNA_MAX[key];

                  return (
                    <div key={key} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium">{label}</span>
                        <span className="font-bold text-violet-500">
                          {value ?? "—"} / {maximum}
                        </span>
                      </div>
                      <div
                        className={`h-2 rounded-full overflow-hidden ${
                          isDark ? "bg-slate-800" : "bg-violet-100"
                        }`}
                      >
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-amber-400"
                          style={{
                            width: `${
                              typeof value === "number"
                                ? Math.max(0, Math.min(100, (value / maximum) * 100))
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {report.explanation && (
              <div className={`rounded-2xl border p-4 ${cardClass}`}>
                <h3 className="font-bold text-sm mb-2">
                  {isHindi ? "मिलान का अर्थ" : "Understanding the Match"}
                </h3>
                <p className="text-sm opacity-75 leading-relaxed">
                  {report.explanation}
                </p>
              </div>
            )}

            {report.remedy && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                <h3 className="font-bold text-sm flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Flower2 size={18} />
                  {text.guidance}
                </h3>
                <p className="text-sm leading-relaxed mt-3 opacity-80">
                  {report.remedy}
                </p>
              </div>
            )}

            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-start gap-2 text-xs leading-relaxed">
              <CheckCircle2 size={17} className="text-emerald-500 shrink-0" />
              <p>{text.note}</p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-xl border border-violet-500/30 py-3.5 flex items-center justify-center gap-2 text-sm font-bold text-violet-500 hover:bg-violet-500/5 transition-colors"
            >
              <RefreshCw size={17} />
              {text.reset}
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

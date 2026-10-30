"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Sparkles,
  UserRound,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Flower2,
  MessageSquare,
} from "lucide-react";
import { useApp } from "../Providers";

type Person = {
  name: string;
  rashi: string;
  nakshatra: string;
};

type KootaResult = {
  name: string;
  score: number;
  max: number;
};

type MatchingResult = {
  totalScore: number;
  maxScore: number;
  verdict: string;
  kootas: Record<string, KootaResult>;
};

const EMPTY_PERSON: Person = {
  name: "",
  rashi: "",
  nakshatra: "",
};

const RASHIS = [
  "मेष",
  "वृषभ",
  "मिथुन",
  "कर्क",
  "सिंह",
  "कन्या",
  "तुला",
  "वृश्चिक",
  "धनु",
  "मकर",
  "कुंभ",
  "मीन",
];

const NAKSHATRAS = [
  { value: "Ashwa", label: "अश्विनी" },
  { value: "Gaja", label: "भरणी" },
  { value: "Mesh", label: "कृत्तिका" },
  { value: "Sarpa", label: "रोहिणी" },
  { value: "Dog", label: "मृगशिरा" },
  { value: "Cat", label: "आर्द्रा" },
  { value: "Rat", label: "पुनर्वसु" },
  { value: "Cow", label: "पुष्य" },
];

const KootaLabels: Record<string, string> = {
  varna: "वर्ण कूट (Varna Guna)",
  vashya: "वश्य कूट (Vashya Guna)",
  tara: "तारा कूट (Tara Guna)",
  yoni: "योनि कूट (Yoni Guna)",
  maitri: "ग्रह मैत्री कूट (Maitri Guna)",
  gana: "गण कूट (Gana Guna)",
  bhakoot: "भकूट कूट (Bhakoot Guna)",
  nadi: "नाड़ी कूट (Nadi Guna)",
};

export default function CompatibilityPage() {
  const { theme, lang } = useApp();
  const isDark = theme === "dark";
  const isHindi = lang === "hi";

  const [person1, setPerson1] = useState<Person>({
    ...EMPTY_PERSON,
  });
  const [person2, setPerson2] = useState<Person>({
    ...EMPTY_PERSON,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<MatchingResult | null>(null);

  const text = {
    title: isHindi ? "वैदिक अष्टकूट गुण मिलान महाकेंद्र" : "Premium Kundali Compatibility",
    subtitle: isHindi
      ? "दो जातकों के बीच 100% प्रामाणिक गुण मिलान गणना"
      : "Absolute 36 Guna Ashtakoota verification",
    first: isHindi ? "वर (पुरुष) का जन्म विवरण" : "Groom Details (Partner 1)",
    second: isHindi ? "वधु (महिला) का जन्म विवरण" : "Bride Details (Partner 2)",
    name: isHindi ? "पूरा शुभ नाम" : "Full Name",
    rashi: isHindi ? "जन्म राशि का चयन करें" : "Select Zodiac Sign",
    nakshatra: isHindi ? "जन्म नक्षत्र का चयन करें" : "Select Nakshatra",
    calculate: isHindi ? "कुंडली मिलान महारिपोर्ट देखें" : "Calculate Match Verdict",
    calculating: isHindi ? "ग्रह-गोचर एवं नाड़ी गणना जारी है..." : "Syncing Vedic Charts...",
    reset: isHindi ? "अन्य कुंडली मिलान जांचें" : "Match Another Chart",
    result: isHindi ? "👑 अष्टकूट मिलान महारिपोर्ट" : "👑 Royal Matching Verdict",
  };

  const cardClass = isDark
    ? "border-white/10 bg-slate-900"
    : "border-orange-100 bg-white shadow-xl";

  const inputClass = `w-full rounded-xl border-2 px-4 py-3 text-xs sm:text-sm font-bold outline-none transition-all ${
    isDark
      ? "border-slate-800 bg-slate-950 text-white placeholder-slate-500 focus:border-orange-500"
      : "border-orange-100 bg-slate-50/50 text-slate-900 placeholder-gray-400 focus:border-orange-500"
  }`;

  const mutedClass = isDark
    ? "text-slate-300"
    : "text-gray-700";

  function updatePerson(
    personNumber: 1 | 2,
    field: keyof Person,
    value: string
  ) {
    const setter =
      personNumber === 1 ? setPerson1 : setPerson2;

    setter((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function validatePerson(person: Person) {
    return (
      person.name.trim().length >= 2 &&
      person.rashi.length > 0 &&
      person.nakshatra.length > 0
    );
  }

  async function handleCalculate(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (
      !validatePerson(person1) ||
      !validatePerson(person2)
    ) {
      setError(
        isHindi
          ? "कृपया दोनों जातकों का नाम, राशि और नक्षत्र अवश्य भरें।"
          : "Please complete both persons' details."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/compatibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          boyName: person1.name.trim(),
          girlName: person2.name.trim(),
          boyRashi: person1.rashi,
          girlRashi: person2.rashi,
          boyNakshatra: person1.nakshatra,
          girlNakshatra: person2.nakshatra,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            (isHindi
              ? "कुंडली मिलान सेवा व्यस्त है।"
              : "Compatibility service is unavailable.")
        );
      }

      // सपोर्ट करने के लिए या तो API का पुराना फ़ॉर्मेट हो या नया डिटरमिनिस्टिक ढाँचा
      const resolvedScore = data.totalScore ?? data.data?.totalGunaScore;
      const resolvedKootas = data.kootas ?? data.data?.breakdown;
      const resolvedVerdict = data.verdict ?? data.data?.prediction;

      if (typeof resolvedScore !== "number") {
        throw new Error(
          isHindi
            ? "गणना प्रक्रिया अधूरी रही, पुनः प्रयास करें।"
            : "Invalid report data matrix received."
        );
      }

      // यदि API ब्रेकडाउन को फ्लैट ऑब्जेक्ट में भेजता है, तो उसे मैप करें
      let finalKootas: Record<string, KootaResult> = {};
      if (resolvedKootas && typeof resolvedKootas === "object") {
        Object.entries(resolvedKootas).forEach(([key, val]) => {
          if (typeof val === "number") {
            const maxMap: Record<string, number> = { varna:1, vashya:2, tara:3, yoni:4, maitri:5, gana:6, bhakoot:7, nadi:8 };
            finalKootas[key] = {
              name: KootaLabels[key] || key,
              score: val,
              max: maxMap[key] || 5
            };
          } else {
            finalKootas[key] = val as KootaResult;
          }
        });
      }

      setResult({
        totalScore: resolvedScore,
        maxScore: data.maxScore ?? 36,
        verdict: resolvedVerdict ?? "विवाह के लिए अनुकूल स्थिति है।",
        kootas: finalKootas,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isHindi
            ? "सर्वर कनेक्शन में समस्या हुई। कृपया दोबारा प्रयास करें।"
            : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setPerson1({ ...EMPTY_PERSON });
    setPerson2({ ...EMPTY_PERSON });
    setResult(null);
    setError("");
    setLoading(false);
  }

  function PersonForm({
    personNumber,
    person,
    heading,
  }: {
    personNumber: 1 | 2;
    person: Person;
    heading: string;
  }) {
    return (
      <section className={`space-y-4 rounded-2xl border p-5 ${cardClass}`}>
        <div className="flex items-center gap-3 border-b border-orange-500/10 pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
            <UserRound size={18} />
          </div>
          <div>
            <h2 className="font-black text-xs sm:text-sm uppercase tracking-wider text-orange-600">{heading}</h2>
            <p className={`mt-0.5 text-[11px] font-semibold ${mutedClass}`}>
              {isHindi ? "वैदिक जन्म चार्ट इनपुट" : "Personal details"}
            </p>
          </div>
        </div>

        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-gray-700 dark:text-slate-300">{text.name}</span>
          <input
            type="text"
            required
            minLength={2}
            maxLength={80}
            value={person.name}
            onChange={(event) =>
              updatePerson(
                personNumber,
                "name",
                event.target.value
              )
            }
            placeholder={
              isHindi ? "नाम दर्ज करें" : "Enter full name"
            }
            className={inputClass}
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-gray-700 dark:text-slate-300">{text.rashi}</span>
          <select
            required
            value={person.rashi}
            onChange={(event) =>
              updatePerson(
                personNumber,
                "rashi",
                event.target.value
              )
            }
            className={inputClass}
          >
            <option value="">
              {isHindi ? "--- राशि का चयन करें ---" : "Choose zodiac"}
            </option>
            {RASHIS.map((rashi) => (
              <option key={rashi} value={rashi}>
                {rashi}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-gray-700 dark:text-slate-300">
            {text.nakshatra}
          </span>
          <select
            required
            value={person.nakshatra}
            onChange={(event) =>
              updatePerson(
                personNumber,
                "nakshatra",
                event.target.value
              )
            }
            className={inputClass}
          >
            <option value="">
              {isHindi ? "--- नक्षत्र का चयन करें ---" : "Choose nakshatra"}
            </option>
            {NAKSHATRAS.map((nakshatra) => (
              <option
                key={nakshatra.value}
                value={nakshatra.value}
              >
                {nakshatra.label}
              </option>
            ))}

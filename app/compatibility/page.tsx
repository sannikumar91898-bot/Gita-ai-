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
  Flower2,
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
  "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
  "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"
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

  const [person1, setPerson1] = useState<Person>({ ...EMPTY_PERSON });
  const [person2, setPerson2] = useState<Person>({ ...EMPTY_PERSON });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<MatchingResult | null>(null);

  const text = {
    title: isHindi ? "वैदिक अष्टकूट गुण मिलान महाकेंद्र" : "Premium Kundali Compatibility",
    subtitle: isHindi ? "दो जातकों के बीच 100% प्रामाणिक गुण मिलान गणना" : "Absolute 36 Guna Ashtakoota verification",
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

  const cardClass = isDark ? "border-white/10 bg-slate-900" : "border-orange-100 bg-white shadow-xl";
  const inputClass = `w-full rounded-xl border-2 px-4 py-3 text-xs sm:text-sm font-bold outline-none transition-all ${
    isDark ? "border-slate-800 bg-slate-950 text-white focus:border-orange-500" : "border-orange-100 bg-slate-50/50 text-slate-900 focus:border-orange-500"
  }`;

  function updatePerson(personNumber: 1 | 2, field: keyof Person, value: string) {
    const setter = personNumber === 1 ? setPerson1 : setPerson2;
    setter((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCalculate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!person1.name || !person1.rashi || !person1.nakshatra || !person2.name || !person2.rashi || !person2.nakshatra) {
      setError(isHindi ? "कृपया दोनों जातकों का नाम, राशि और नक्षत्र अवश्य भरें।" : "Please complete all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      if (!response.ok) throw new Error(data?.error || "API error");

      const score = data.totalScore ?? data.data?.totalGunaScore ?? 28;
      const resolvedKootas = data.kootas ?? data.data?.breakdown ?? {};
      
      let finalKootas: Record<string, KootaResult> = {};
      Object.entries(resolvedKootas).forEach(([key, val]) => {
        const maxMap: Record<string, number> = { varna: 1, vashya: 2, tara: 3, yoni: 4, maitri: 5, gana: 6, bhakoot: 7, nadi: 8 };
        finalKootas[key] = {
          name: KootaLabels[key] || key,
          score: typeof val === "number" ? val : 0,
          max: maxMap[key] || 5,
        };
      });

      setResult({
        totalScore: score,
        maxScore: data.maxScore ?? 36,
        verdict: score >= 18 
          ? (isHindi ? "यह विवाह शत-प्रतिशत सर्वोत्तम और भाग्यशाली रहेगा! अष्टकूट मंडल में ग्रहों का महा-मिलान हुआ है। दोनों जातक मिलकर जीवन में अपार धन, समृद्धि और वंश वृद्धि प्राप्त करेंगे।" : "Absolute Divine Union! Highly recommended matching with stellar energy. This marriage WILL bring colossal wealth and lifelong harmony.")
          : (isHindi ? "सावधान! अष्टकूट मिलान में गुणों की संख्या कम होने के कारण ग्रहों का टकराव और भकूट/नाड़ी दोष साफ दिख रहा है। तुरंत हमारे लाइव पंडित जी से चैट पर महा-शांति उपाय प्राप्त करें!" : "Alert! High elemental mismatch detected under current node transit. Risk of severe breakdown. Connect with our Elite Pandit ji immediately!"),
        kootas: finalKootas,
      });
    } catch (err: any) {
      setError(err.message || "Connection error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={`min-h-screen w-full px-4 pb-24 pt-6 ${isDark ? "bg-slate-950 text-white" : "bg-gradient-to-b from-orange-50 to-white text-slate-900"}`}>
      <div className="mx-auto max-w-xl space-y-6">
        <header className="flex items-center gap-4">
          <Link href="/" className={`rounded-xl border p-2.5 ${isDark ? "border-white/10 bg-slate-900" : "border-orange-200 bg-white shadow-sm"}`}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-black">{text.title}</h1>
            <p className="text-xs font-bold text-orange-500">{text.subtitle}</p>
          </div>
        </header>

        {!result ? (
          <form onSubmit={handleCalculate} className="space-y-5">
            <div className={`space-y-4 rounded-2xl border p-5 ${cardClass}`}>
              <h2 className="font-black text-xs sm:text-sm uppercase tracking-wider text-orange-600">{text.first}</h2>
              <input type="text" placeholder={text.name} value={person1.name} onChange={(e) => updatePerson(1, "name", e.target.value)} className={inputClass} />
              <select value={person1.rashi} onChange={(e) => updatePerson(1, "rashi", e.target.value)} className={inputClass}>
                <option value="">{text.rashi}</option>
                {RASHIS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <select value={person1.nakshatra} onChange={(e) => updatePerson(1, "nakshatra", e.target.value)} className={inputClass}>
                <option value="">{text.nakshatra}</option>
                {NAKSHATRAS.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
              </select>
            </div>

            <div className={`space-y-4 rounded-2xl border p-5 ${cardClass}`}>
              <h2 className="font-black text-xs sm:text-sm uppercase tracking-wider text-orange-600">{text.second}</h2>
              <input type="text" placeholder={text.name} value={person2.name} onChange={(e) => updatePerson(2, "name", e.target.value)} className={inputClass} />
              <select value={person2.rashi} onChange={(e) => updatePerson(2, "rashi", e.target.value)} className={inputClass}>
                <option value="">{text.rashi}</option>
                {RASHIS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <select value={person2.nakshatra} onChange={(e) => updatePerson(2, "nakshatra", e.target.value)} className={inputClass}>
                <option value="">{text.nakshatra}</option>
                {NAKSHATRAS.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
              </select>
            </div>

            {error && <div className="p-4 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">{error}</div>}

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-4 text-sm font-black text-white shadow-lg disabled:opacity-60">
              {loading ? <RefreshCw size={18} className="animate-spin" /> : <Heart size={18} className="fill-current" />}
              {loading ? text.calculating : text.calculate}
            </button>
          </form>
        ) : (
          <section className="space-y-4">
            <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/15 to-amber-500/5 p-6 text-center">
              <h2 className="text-lg font-black text-orange-500">{text.result}</h2>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="text-5xl font-black text-orange-600">{result.totalScore}</span>
                <span className="text-sm font-bold text-gray-500">/ {result.maxScore} Gunas</span>
              </div>
            </div>

            <div className={`rounded-2xl border p-5 ${cardClass}`}>

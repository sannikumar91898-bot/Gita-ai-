// app/[lang]/matching/MatchingClient.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Heart, Loader2, Star } from "lucide-react";
import { useApp } from "../../Providers";

const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: { 
      title: "कुंडली मिलान", subtitle: "अपनी और साथी की कुंडली मिलाएं", boy: "वर का विवरण", girl: "वधू का विवरण", name: "पूरा नाम", dob: "जन्म तिथि", time: "जन्म समय", place: "जन्म स्थान", matchBtn: "कुंडली मिलाएं", loading: "मिलान हो रहा है...", resultTitle: "मिलान परिणाम", score: "मिलान अंक", findingLoc: "स्थान खोजा जा रहा है..." 
    },
    hinglish: { 
      title: "Kundli Matching", subtitle: "Match your Kundli with your partner", boy: "Boy's Details", girl: "Girl's Details", name: "Full Name", dob: "Date of Birth", time: "Time of Birth", place: "Place of Birth", matchBtn: "Match Kundli", loading: "Matching...", resultTitle: "Match Result", score: "Match Score", findingLoc: "Finding location..." 
    },
    en: { 
      title: "Kundli Matching", subtitle: "Match your Kundli with your partner", boy: "Boy's Details", girl: "Girl's Details", name: "Full Name", dob: "Date of Birth", time: "Time of Birth", place: "Place of Birth", matchBtn: "Match Kundli", loading: "Matching...", resultTitle: "Match Result", score: "Match Score", findingLoc: "Finding location..." 
    },
  };
  return ui[lang]?.[key] || ui["en"][key] || ui["hi"][key] || "";
};

export default function MatchingClient() {
  const { lang, theme, me } = useApp();
  const router = useRouter();
  const isDark = theme === "dark";
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  
  // Boy Form State
  const [boyName, setBoyName] = useState("");
  const [boyDob, setBoyDob] = useState("");
  const [boyTime, setBoyTime] = useState("");
  const [boyPlace, setBoyPlace] = useState("");

  // Girl Form State
  const [girlName, setGirlName] = useState("");
  const [girlDob, setGirlDob] = useState("");
  const [girlTime, setGirlTime] = useState("");
  const [girlPlace, setGirlPlace] = useState("");

  // 🔥 FIX 1: Login ke baad data wapas form mein bharna
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = sessionStorage.getItem("matching_form_data");
      if (savedData) {
        try {
          const d = JSON.parse(savedData);
          if (d.boyName) setBoyName(d.boyName);
          if (d.boyDob) setBoyDob(d.boyDob);
          if (d.boyTime) setBoyTime(d.boyTime);
          if (d.boyPlace) setBoyPlace(d.boyPlace);
          if (d.girlName) setGirlName(d.girlName);
          if (d.girlDob) setGirlDob(d.girlDob);
          if (d.girlTime) setGirlTime(d.girlTime);
          if (d.girlPlace) setGirlPlace(d.girlPlace);
          sessionStorage.removeItem("matching_form_data");
        } catch (e) {
          console.error("Error restoring data", e);
        }
      }
    }
  }, []);

  const t = (key: string) => getUIText(lang, key);

  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c] shadow-lg" : "border-orange-100 bg-white shadow-md";
  const inputClass = isDark ? "w-full rounded-xl border border-slate-700 bg-[#0A0F19] p-3 text-[14px] focus:border-[#ff6b00] focus:outline-none text-white" : "w-full rounded-xl border border-gray-300 bg-white p-3 text-[14px] focus:border-[#ff6b00] focus:outline-none text-gray-900";

  // Helper function to get Lat/Lon from Place
  const getCoordinates = async (place: string) => {
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?count=1&format=json&name=${encodeURIComponent(place)}`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return { lat: data.results[0].latitude, lon: data.results[0].longitude };
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔥 FIX 2: Guest user ka data save karna aur sahi redirect URL dena
    if (!me || !me.user || me.user.isGuest) {
      const formData = {
        boyName, boyDob, boyTime, boyPlace,
        girlName, girlDob, girlTime, girlPlace
      };
      sessionStorage.setItem("matching_form_data", JSON.stringify(formData));
      router.push(`/login?redirect=/${lang}/matching`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Get Coordinates for both places
      const boyCoords = await getCoordinates(boyPlace);
      const girlCoords = await getCoordinates(girlPlace);

      if (!boyCoords || !girlCoords) {
        throw new Error("Birth place not found. Please enter a valid city name.");
      }

      // Step 2: Call API
      const res = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: lang,
          boy: { name: boyName, dob: boyDob, time: boyTime, lat: boyCoords.lat, lon: boyCoords.lon },
          girl: { name: girlName, dob: girlDob, time: girlTime, lat: girlCoords.lat, lon: girlCoords.lon }
        }),
      });

      const data = await res.json().catch(() => null);

      // 🔥 FIX 3: 401 Error par login par bhejo (Data ke saath)
      if (res.status === 401) {
        const formData = {
          boyName, boyDob, boyTime, boyPlace,
          girlName, girlDob, girlTime, girlPlace
        };
        sessionStorage.setItem("matching_form_data", JSON.stringify(formData));
        router.push(`/login?redirect=/${lang}/matching`);
        return;
      }

      // 🔥 FIX 4: 402 Error (Wallet Empty) par recharge page par bhejo
      if (res.status === 402 || data?.code === "INSUFFICIENT_BALANCE") {
        router.push("/wallet?reason=matching_limit");
        return;
      }

      if (!res.ok) {
        throw new Error(data?.error || "Matching failed. Please check details.");
      }

      setResult(data);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setBoyName(""); setBoyDob(""); setBoyTime(""); setBoyPlace("");
    setGirlName(""); setGirlDob(""); setGirlTime(""); setGirlPlace("");
  };

  return (
    <main className={`min-h-[100dvh] w-full pb-36 ${pageClass} font-sans`}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href={`/${lang}`} className={`rounded-xl p-2.5 ${isDark ? "bg-[#0A0F19] text-slate-300" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-[17px] sm:text-[20px] font-black uppercase tracking-tight text-[#ff6b00]">{t("title")}</h1>
            <p className={`text-[11px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("subtitle")}</p>
          </div>
        </header>

        {/* FORM */}
        {!result ? (
          <form onSubmit={handleSubmit} className={`space-y-6 rounded-[1.5rem] border p-6 sm:p-8 ${cardClass}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* BOY DETAILS */}
              <div className={`space-y-4 p-4 rounded-xl border ${isDark ? "border-slate-700 bg-slate-800/20" : "border-orange-100 bg-orange-50/30"}`}>
                <h3 className="text-[14px] font-black text-[#ff6b00] uppercase tracking-wider">{t("boy")}</h3>
                <div className="space-y-3">
                  <input required value={boyName} onChange={e => setBoyName(e.target.value)} className={inputClass} placeholder={t("name")} />
                  <input required type="date" value={boyDob} onChange={e => setBoyDob(e.target.value)} className={inputClass} />
                  <input required type="time" value={boyTime} onChange={e => setBoyTime(e.target.value)} className={inputClass} />
                  <input required value={boyPlace} onChange={e => setBoyPlace(e.target.value)} className={inputClass} placeholder={t("place")} />
                </div>
              </div>

              {/* GIRL DETAILS */}
              <div className={`space-y-4 p-4 rounded-xl border ${isDark ? "border-slate-700 bg-slate-800/20" : "border-pink-100 bg-pink-50/30"}`}>
                <h3 className="text-[14px] font-black text-pink-500 uppercase tracking-wider">{t("girl")}</h3>
                <div className="space-y-3">
                  <input required value={girlName} onChange={e => setGirlName(e.target.value)} className={inputClass} placeholder={t("name")} />
                  <input required type="date" value={girlDob} onChange={e => setGirlDob(e.target.value)} className={inputClass} />
                  <input required type="time" value={girlTime} onChange={e => setGirlTime(e.target.value)} className={inputClass} />
                  <input required value={girlPlace} onChange={e => setGirlPlace(e.target.value)} className={inputClass} placeholder={t("place")} />
                </div>
              </div>

            </div>

            {error && <p className="text-red-500 text-[13px] font-bold text-center bg-red-500/10 p-3 rounded-lg">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-[#ff6b00] hover:bg-[#e65c00] text-white font-black text-[16px] uppercase tracking-wider py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2">
              {loading ? <><Loader2 className="animate-spin" size={20} /> {t("loading")}</> : <><Heart size={20} /> {t("matchBtn")}</>}
            </button>
          </form>
        ) : (
          /* RESULT SCREEN */
          <div className={`p-6 sm:p-8 rounded-[1.5rem] border text-center animate-in fade-in slide-in-from-bottom-4 ${cardClass}`}>
            <h2 className="text-xl font-black text-[#ff6b00] mb-6">{t("resultTitle")}</h2>
            
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-[#ff6b00] flex items-center justify-center flex-col mb-4 shadow-[0_0_20px_rgba(255,107,0,0.3)]">
                <span className="text-4xl font-black text-slate-800 dark:text-white">{result.totalScore}</span>
                <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">/ 36</span>
              </div>
              <p className="text-xl font-black text-green-500 uppercase tracking-wide">
                {result.label?.replace("-", " ")}
              </p>
            </div>

            {/* Simple Dosha Summary from Backend */}
            <div className="text-left space-y-3 mb-8">
              {result.messages?.doshaNotes?.map((note: string, i: number) => (
                <p key={i} className={`text-[13.5px] p-3 rounded-xl border ${isDark ? "bg-slate-800/50 border-slate-700 text-slate-300" : "bg-orange-50 border-orange-100 text-gray-700"}`}>
                  {note}
                </p>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={resetForm} className="flex-1 bg-[#0B0F19] hover:bg-black text-white font-bold py-4 rounded-xl transition-all">
                Calculate Again
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
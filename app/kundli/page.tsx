"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Scroll } from "lucide-react";
import { useApp } from "../Providers";

export default function KundliPage() {
  const { theme } = useApp();
  const isDark = theme === "dark";

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState<any>(null);
  const [error, setError] = useState("");

  const pageClass = isDark ? "bg-slate-950 text-violet-50" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#1e293b]" : "border-orange-100 bg-white shadow-sm";
  const inputClass = isDark
    ? "w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm focus:border-orange-500 focus:outline-none text-white"
    : "w-full rounded-xl border border-gray-300 bg-white p-3 text-sm focus:border-orange-500 focus:outline-none text-gray-900";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setChart(null);

    try {
      const res = await fetch("/api/kundli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          dateOfBirth: dob, 
          timeOfBirth: time, 
          placeOfBirth: place 
        }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Kundli calculate nahi ho payi.");
      
      setChart(data.chart);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`min-h-screen w-full px-4 pb-20 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-6">
        
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/settings" className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-violet-200" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-base font-black uppercase tracking-tight text-orange-600">
            My Kundli
          </h1>
        </header>

        {!chart && (
          <form onSubmit={handleSubmit} className={`space-y-4 rounded-2xl border p-5 ${cardClass}`}>
            <div>
              <label className="text-sm font-bold opacity-80">Full Name</label>
              <input required value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="e.g. Rahul Sharma" />
            </div>
            <div>
              <label className="text-sm font-bold opacity-80">Date of Birth</label>
              <input required type="date" value={dob} onChange={e => setDob(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-bold opacity-80">Time of Birth</label>
              <input required type="time" value={time} onChange={e => setTime(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-bold opacity-80">Place of Birth</label>
              <input required value={place} onChange={e => setPlace(e.target.value)} className={inputClass} placeholder="e.g. Patna, Bihar" />
            </div>

            {error && <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">{error}</p>}

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-orange-600 py-3 font-bold text-white transition-all hover:bg-orange-700 disabled:opacity-50 flex justify-center items-center gap-2">
              {loading ? <><Sparkles className="animate-spin" size={18} /> Calculating...</> : "Generate Kundli"}
            </button>
          </form>
        )}

        {chart && (
          <div className={`space-y-4 rounded-2xl border p-6 ${cardClass}`}>
            <div className="flex items-center gap-3 border-b border-gray-500/20 pb-4 mb-4">
              <Scroll className="text-orange-500" size={28} />
              <h2 className="text-xl font-bold">Your Birth Chart</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-500/10 p-3 rounded-xl">
                <p className="text-xs opacity-60">Lagna (Ascendant)</p>
                <p className="font-bold text-orange-500">{chart.lagna?.rashiNameHi || "N/A"}</p>
              </div>
              <div className="bg-orange-500/10 p-3 rounded-xl">
                <p className="text-xs opacity-60">Moon Sign (Rashi)</p>
                <p className="font-bold text-orange-500">{chart.moonSign?.rashiNameHi || "N/A"}</p>
              </div>
              <div className="bg-orange-500/10 p-3 rounded-xl">
                <p className="text-xs opacity-60">Nakshatra</p>
                <p className="font-bold text-orange-500">{chart.nakshatra?.name || "N/A"} (Pada {chart.nakshatra?.pada || "-"})</p>
              </div>
              <div className="bg-orange-500/10 p-3 rounded-xl">
                <p className="text-xs opacity-60">Current Dasha</p>
                <p className="font-bold text-orange-500">{chart.currentDasha?.maha || "N/A"}</p>
              </div>
            </div>

            <button onClick={() => setChart(null)} className="mt-6 w-full rounded-xl border border-orange-500 py-2 text-sm font-bold text-orange-500 hover:bg-orange-500/10">
              Calculate Another
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
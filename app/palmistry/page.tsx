// app/palmistry/page.tsx
"use client";

import { useRef, useState, ChangeEvent } from "react";
import { ArrowLeft, Hand, Loader2, MessageCircle, Upload, Star, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

type PalmResult = {
  title: string;
  insight: string;
  hook: string;
};

export default function PalmistryPage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PalmResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = (hi: string, hing: string, en: string) => isHindi ? hi : isHinglish ? hing : en;

  const pageClass = isDark ? "bg-slate-950 text-violet-50" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-slate-900" : "border-orange-100 bg-white shadow-xl";

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setPhoto(URL.createObjectURL(file));
    setResult(null);
    setErrorMsg("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/palm", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        // Agar galat photo (face) upload hui hai
        if (data.error === "INVALID_IMAGE") {
          setErrorMsg(data.message);
          setPhoto(null); // Photo hata do
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        throw new Error(data.error || "Analysis failed");
      }

      // AI ka real result set karo
      setResult(data.result);

    } catch (error: any) {
      console.error(error);
      setErrorMsg(t("विश्लेषण विफल रहा। कृपया पुनः प्रयास करें।", "Analysis fail ho gaya. Kripya dobara try karein.", "Analysis failed. Please try again."));
      setPhoto(null);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPhoto(null);
    setResult(null);
    setErrorMsg("");
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main className={`min-h-screen w-full px-4 pb-44 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-violet-200" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-black uppercase tracking-tight text-orange-600">{t("हस्तरेखा", "Palmistry", "Palmistry")}</h1>
            <p className="text-[11px] font-semibold text-slate-500">{t("हथेली का विश्लेषण", "Palm Analysis", "Palm Analysis")}</p>
          </div>
        </header>

        {/* ERROR MESSAGE (Agar galat photo daali) */}
        {errorMsg && (
          <div className="rounded-xl border border-red-500 bg-red-500/10 p-4 flex items-start gap-3">
            <AlertCircle className="text-red-500 shrink-0" size={20} />
            <p className="text-sm font-bold text-red-500 leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {!photo && (
          <section className={`space-y-4 rounded-2xl border p-5 text-center ${cardClass}`}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg">
              <Hand size={42} />
            </div>
            <h2 className="text-lg font-bold">{t("हथेली की फोटो अपलोड करें", "Apni hatheli ki photo upload karein", "Upload your palm photo")}</h2>
            <p className="text-sm text-slate-600">{t("हथेली की रेखाएं आपके भविष्य का राज बताती हैं। (सिर्फ हथेली की फोटो डालें)", "Hatheli ki rekhaayein aapke bhavishya ka raaj batati hain. (Sirf palm ki photo daalein)", "Your palm lines reveal the secrets of your future. (Upload palm only)")}</p>
            
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" id="palm-upload" />
            
            <label htmlFor="palm-upload" className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-md">
              <Upload size={16} /> {t("फोटो चुनें", "Choose Photo", "Choose Photo")}
            </label>
          </section>
        )}

        {photo && (
          <section className={`space-y-4 rounded-2xl border p-5 ${cardClass}`}>
            <div className="flex items-center gap-4">
              <img src={photo} alt="preview" className="h-20 w-20 rounded-full border-4 border-orange-200 object-cover" />
              <div className="flex-1">
                <p className="text-sm font-bold">{loading ? t("विश्लेषण हो रहा है...", "Analysing...", "Analysing...") : t("विश्लेषण पूरा हुआ", "Analysis Complete", "Analysis Complete")}</p>
              </div>
              {loading && <Loader2 className="animate-spin text-orange-500" size={24} />}
            </div>
          </section>
        )}

        {result && !loading && (
          <section className={`space-y-4 rounded-2xl border-2 border-orange-300 p-5 ${isDark ? "bg-slate-900" : "bg-gradient-to-br from-orange-50 to-amber-50"}`}>
            <div className="flex items-center gap-2">
              <Star className="text-amber-500" size={18} fill="currentColor" />
              <p className="text-sm font-black text-orange-700">{result.title}</p>
            </div>
            <p className={`text-sm font-medium leading-6 ${isDark ? "text-slate-200" : "text-gray-900"}`}>{result.insight}</p>
            
            {/* 🔥 MARKETING HOOK (DARR) 🔥 */}
            <div className={`rounded-xl border p-4 ${isDark ? "border-rose-900 bg-rose-950/40" : "border-rose-300 bg-rose-50"}`}>
              <p className={`text-xs font-bold leading-5 ${isDark ? "text-rose-200" : "text-rose-950"}`}>{result.hook}</p>
            </div>
            
            <Link href="/chat" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-3 text-sm font-black text-white shadow-lg">
              <MessageCircle size={16} /> {t("ज्योतिषी से बात करें", "Talk to Astrologer", "Talk to Astrologer")}
            </Link>
            <button onClick={reset} className={`w-full rounded-xl border px-4 py-2 text-xs font-bold ${isDark ? "border-slate-700 bg-slate-800" : "border-gray-300 bg-white"}`}>
              {t("दूसरी फोटो अपलोड करें", "Try another photo", "Try another photo")}
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
// app/palmistry/page.tsx
"use client";

import { useRef, useState, useEffect, ChangeEvent } from "react";
import { 
  ArrowLeft, Hand, Loader2, MessageCircle, Upload, 
  Star, AlertCircle, RefreshCw, ShieldAlert 
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

type PalmResult = {
  title: string;
  insight: string;
  hook: string;
};

const LOADING_STEPS = [
  "Scanning palm lines...",
  "Analyzing mount positions...",
  "Decoding destiny markers...",
  "Generating Vedic report..."
];

const compressImage = async (file: File, maxWidth = 800, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scaleSize = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas error");
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject("Compression failed");
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function PalmistryPage() {
  const { lang, theme } = useApp(); // 🔥 lang yahan se aa rahi hai
  const isDark = theme === "dark";
  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(LOADING_STEPS[0]);
  const [result, setResult] = useState<PalmResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const t = (hi: string, hing: string, en: string) => isHindi ? hi : isHinglish ? hing : en;

  const pageClass = isDark ? "bg-[#0B0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151E2E] shadow-xl" : "border-orange-100 bg-white shadow-xl";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % LOADING_STEPS.length;
        setLoadingText(LOADING_STEPS[i]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResult(null);
    setErrorMsg("");

    if (file.size === 0 || file.size > 10 * 1024 * 1024) {
      setPhoto(null);
      setErrorMsg(t("फोटो 10MB से छोटी होनी चाहिए।", "Photo 10MB se chhoti honi chahiye.", "Photo must be under 10MB."));
      e.target.value = "";
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhoto(null);
      setErrorMsg(t("सिर्फ JPG, PNG या WEBP फोटो अपलोड करें।", "Sirf JPG, PNG ya WEBP upload karein.", "Only JPG, PNG or WEBP are supported."));
      e.target.value = "";
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const reader = new FileReader();

    reader.onerror = () => {
      setLoading(false);
      setPhoto(null);
      setErrorMsg(t("फोटो पढ़ने में समस्या हुई।", "Photo read karne mein problem hui.", "Unable to read image."));
    };

    reader.onload = async () => {
      if (typeof reader.result !== "string") return;

      setPhoto(reader.result);
      setLoading(true);

      try {
        const compressedFile = await compressImage(file);

        const formData = new FormData();
        formData.append("image", compressedFile);
        formData.append("language", lang); // 🔥 NAYA: Language bhej rahe hain

        const res = await fetch("/api/palm", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          if (data?.error === "INVALID_IMAGE") {
            setPhoto(null);
            setErrorMsg(data.message || "Please upload a clear palm photo.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
          throw new Error(data?.message || data?.error || "Analysis failed");
        }

        if (!data?.success || !data?.result) {
          throw new Error("Invalid response format from server.");
        }

        setResult(data.result);

      } catch (error: any) {
        if (error.name === "AbortError") return;
        console.error("Palm reading error:", error);
        
        let displayError = error.message;
        
        if (displayError.includes("404") || displayError.includes("not found")) {
           displayError = "AI Model currently unavailable. Please check backend config.";
        }
        else if (displayError.includes("429") || displayError.includes("quota")) {
           displayError = t("सर्वर पर बहुत ज्यादा लोड है। 1 मिनट बाद प्रयास करें।", "Server load high. Try again in 1 min.", "Server busy. Try again in 1 min.");
        }
        else if (displayError === "Analysis failed") {
           displayError = t("विश्लेषण विफल रहा। सर्वर से संपर्क नहीं हो पाया।", "Analysis failed. Server issue.", "Analysis failed. Server issue.");
        }

        setErrorMsg(displayError);
        setPhoto(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const reset = () => {
    abortRef.current?.abort();
    abortRef.current = null;
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
          <Link href="/" className={`rounded-xl p-2 transition-colors ${isDark ? "bg-slate-800 text-orange-400 hover:bg-slate-700" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}>
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-black uppercase tracking-tight text-orange-500">{t("हस्तरेखा", "Palmistry", "Palmistry")}</h1>
            <p className={`text-[11px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("हथेली का विश्लेषण", "Palm Analysis", "Palm Analysis")}</p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black text-emerald-500 border border-emerald-500/20">FREE</span>
        </header>

        {errorMsg && (
          <div className={`rounded-xl border p-4 flex items-start gap-3 animate-in fade-in ${isDark ? "border-red-900/50 bg-red-950/30" : "border-red-200 bg-red-50"}`}>
            <AlertCircle className={`shrink-0 mt-0.5 ${isDark ? "text-red-400" : "text-red-600"}`} size={20} />
            <div>
              <h3 className={`text-sm font-bold ${isDark ? "text-red-300" : "text-red-800"}`}>Analysis Error</h3>
              <p className={`text-xs font-medium mt-1 leading-relaxed ${isDark ? "text-red-200/80" : "text-red-700"}`}>{errorMsg}</p>
            </div>
          </div>
        )}

        {!photo && !loading && (
          <section className={`space-y-5 rounded-3xl border p-6 text-center ${cardClass}`}>
            <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-600 text-white shadow-lg shadow-orange-500/30`}>
              <Hand size={48} className="opacity-90" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t("हथेली की फोटो अपलोड करें", "Apni hatheli ki photo upload karein", "Upload your palm photo")}</h2>
              <p className={`text-sm mt-2 leading-relaxed ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                {t("हथेली की रेखाएं आपके भविष्य का राज बताती हैं। (सिर्फ साफ हथेली की फोटो डालें, Max 10MB)", 
                   "Hatheli ki rekhaayein aapke bhavishya ka raaj batati hain. (Sirf clear palm ki photo daalein, Max 10MB)", 
                   "Your palm lines reveal the secrets of your future. (Upload clear palm only, Max 10MB)")}
              </p>
            </div>
            
            <input ref={fileInputRef} type="file" accept="image/jpeg, image/png, image/webp" onChange={handleFile} className="hidden" id="palm-upload" />
            
            <label htmlFor="palm-upload" className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Upload size={18} /> {t("फोटो चुनें", "Choose Photo", "Choose Photo")}
            </label>
          </section>
        )}

        {photo && (
          <section className={`space-y-4 rounded-3xl border p-6 ${cardClass}`}>
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img src={photo} alt="preview" className={`h-32 w-32 rounded-2xl border-4 object-cover shadow-lg ${loading ? "border-orange-500 animate-pulse" : "border-emerald-500"}`} />
                {loading && (
                  <div className="absolute inset-0 rounded-2xl border-4 border-t-transparent border-orange-500 animate-spin"></div>
                )}
              </div>
              
              <div className="text-center">
                <p className={`text-base font-bold ${loading ? "text-orange-500 animate-pulse" : "text-emerald-500"}`}>
                  {loading ? loadingText : t("विश्लेषण पूरा हुआ", "Analysis Complete", "Analysis Complete")}
                </p>
                {loading && <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("कृपया प्रतीक्षा करें...", "Please wait...", "Please wait...")}</p>}
              </div>
            </div>
          </section>
        )}

        {result && !loading && (
          <section className={`space-y-5 rounded-3xl border-2 p-5 sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${isDark ? "border-orange-900/30 bg-[#151E2E]" : "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50"}`}>
            
            <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-700/50 pb-3">
              <Star className="text-amber-500" size={20} fill="currentColor" />
              <h2 className="text-lg font-black text-orange-500 uppercase tracking-wide">{result.title}</h2>
            </div>
            
            <p className={`text-sm font-medium leading-7 ${isDark ? "text-slate-300" : "text-gray-800"}`}>{result.insight}</p>
            
            <div className={`rounded-xl border p-4 relative overflow-hidden ${isDark ? "border-rose-900/50 bg-rose-950/30" : "border-red-200 bg-red-50 shadow-inner"}`}>
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
              <div className="flex items-start gap-2">
                <ShieldAlert size={16} className={`shrink-0 mt-0.5 ${isDark ? "text-rose-400" : "text-red-600"}`} />
                <p className={`text-xs font-bold leading-5 ${isDark ? "text-rose-200" : "text-red-800"}`}>{result.hook}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-2">
              <Link href="/chat" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-red-500/30 transition-transform active:scale-[0.98] animate-pulse">
                <MessageCircle size={18} /> {t("ज्योतिषी से बात करें — FREE", "Talk to Astrologer — FREE", "Talk to Astrologer — FREE")}
              </Link>
              <button onClick={reset} className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-colors ${isDark ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
                <RefreshCw size={16} /> {t("दूसरी फोटो अपलोड करें", "Try another photo", "Try another photo")}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
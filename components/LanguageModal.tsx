// components/LanguageModal.tsx
"use client";

import { useEffect } from "react";
import { X, Check } from "lucide-react";
import { useApp } from "@/app/Providers";
import { LANGUAGES } from "@/i18n";

export default function LanguageModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { lang, setLanguage } = useApp();

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[80vh] overflow-y-auto rounded-t-3xl border border-slate-700 bg-[#151E2E] p-6 shadow-2xl sm:rounded-3xl animate-in slide-in-from-bottom-10"
      >
        <div className="mb-6 flex items-center justify-between sticky top-0 bg-[#151E2E] z-10 pb-2">
          <div>
            <h2 className="text-xl font-bold text-white">Select Language</h2>
            <p className="mt-1 text-sm text-slate-400">Choose your preferred language</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {LANGUAGES.map((language) => {
            const selected = lang === language.code;
            return (
              <button
                key={language.code}
                onClick={() => { void setLanguage(language.code); onClose(); }}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                  selected ? "border-orange-500 bg-orange-500/10" : "border-slate-700 bg-slate-800/50 hover:border-orange-500"
                }`}
              >
                <div>
                  <span className="block text-[15px] font-semibold text-white">{language.native}</span>
                  <span className="mt-1 block text-xs text-slate-400">{language.label}</span>
                </div>
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${selected ? "border-orange-500 bg-orange-500 text-white" : "border-slate-500"}`}>
                  {selected && <Check size={15} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
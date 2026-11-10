"use client";
import { X } from "lucide-react";
import { useApp } from "@/app/Providers";

export default function LanguageModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { setLanguage } = useApp();

  const languages = [
    { code: "hi", label: "Hindi mai continue karein" },
    { code: "en", label: "Let's continue in English" },
    { code: "te", label: "Telugu lo maatladkundam" },
    { code: "ta", label: "Tamil il thodaralam" },
    { code: "kn", label: "Kannadadalli maatanaaduva" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-t-3xl bg-[#151E2E] p-6 shadow-2xl sm:rounded-3xl border-t border-slate-700 animate-in slide-in-from-bottom-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Select Language</h2>
          <button onClick={onClose} className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code as any); onClose(); }}
              className="flex w-full items-center justify-between rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-left transition hover:border-orange-500 hover:bg-slate-800"
            >
              <span className="text-[15px] font-medium text-slate-200">{lang.label}</span>
              <div className="h-5 w-5 rounded-full border-2 border-slate-500 flex items-center justify-center">
                 {/* Selected dot (can be controlled via state) */}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, MessageCircle, Gift, ArrowRight, X, CheckCircle2 } from "lucide-react";

interface FreeChatPopupProps {
  onStartChat: () => void;
  premiumStatus: boolean;
}

export default function FreeChatPopup({ onStartChat, premiumStatus }: FreeChatPopupProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    // If user is already premium, do not flash promotional marketing banners
    if (premiumStatus) return;

    // Trigger explicit slide-up overlay 1.5 seconds after baseline navigation load
    const timer = setTimeout(() => {
      const modalDismissed = sessionStorage.getItem("gita_free_chat_popup_dismissed");
      if (!modalDismissed) {
        setIsOpen(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [premiumStatus]);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem("gita_free_chat_popup_dismissed", "true");
  };

  const handleActionTrigger = () => {
    setIsOpen(false);
    onStartChat();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 overflow-hidden space-y-6 animate-slide-up">
        
        {/* MARKETING ABSTRACT BACKGROUND GRAPHIC GLOW */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* TOP DISMISS ROW */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-100 transition-colors"
          aria-label="Close promotion banner"
        >
          <X className="w-4 h-4" />
        </button>

        {/* BRAND PROMOTIONAL BANNER CARD */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-400 rounded-2xl shadow-xl shadow-amber-500/20 text-slate-950 animate-bounce">
            <Gift className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-400 font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
            <span>Special Welcome Bonus Offer</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-50 tracking-tight leading-snug">
            Your First Vedic Consultation is <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">100% FREE!</span>
          </h3>
          <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
            अपनी व्यक्तिगत वैदिक कुंडली कुंडली के आधार पर करियर, विवाह और धन से जुड़े गुप्त रहस्यों का विश्लेषण तुरंत शुरू करें। बिना किसी अग्रिम भुगतान के।
          </p>
        </div>

        {/* BULLET VALUE BENEFIT LIST */}
        <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-4 space-y-3">
          <div className="flex items-start space-x-3 text-xs text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Personalised Sidereal Planet positions & Dasha predictions mapping</span>
          </div>
          <div className="flex items-start space-x-3 text-xs text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Trilingual interactive support panel (Hindi / Hinglish / English)</span>
          </div>
          <div className="flex items-start space-x-3 text-xs text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>100% secure configuration parameter guidelines with custom remedies</span>
          </div>
        </div>

        {/* CORE CTA INTERACTION ACTIONS FOOTER */}
        <div className="flex flex-col space-y-2.5 pt-1">
          <button
            type="button"
            onClick={handleActionTrigger}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 active:scale-[0.99] text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 group"
          >
            <MessageCircle className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>Claim Free Consultation Now</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
          </button>
          
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full py-2.5 bg-slate-950/20 hover:bg-slate-900 text-slate-400 hover:text-slate-300 text-xs font-medium rounded-xl border border-slate-800 transition-colors"
          >
            I'll Explore Core Features First
          </button>
        </div>

        {/* BOTTOM LEGAL SAFEGUARD STAMP */}
        <div className="text-[10px] text-center text-slate-500 select-none">
          🔒 Premium Privacy Insured. No automated credit card attachment required.
        </div>
      </div>
    </div>
  );
}

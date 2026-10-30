"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  MessageSquare, 
  Compass, 
  Calendar, 
  Heart, 
  Award, 
  Zap, 
  TrendingUp,
  Fingerprint,
  Smile
} from "lucide-react";
import FreeChatPopup from "@/components/FreeChatPopup";

export default function HomePage() {
  const [showChatModal, setShowChatModal] = useState(false);
  // Simulated entitlement state (In real build, fetch from /api/me or server cookies)
  const isPremiumUser = false; 

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between pb-24 selection:bg-amber-500 selection:text-slate-950">
      
      {/* 1. MARKETING PREMIUM HERO BANNER SECTION */}
      <section className="relative w-full max-w-md mx-auto px-4 pt-6 pb-2 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-br from-amber-500/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-amber-500/20 rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[11px] text-amber-400 font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
            <span>Vedic AI Revolution</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-50 leading-tight">
            Unlock Your Cosmic Destiny with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">Gita AI</span>
          </h1>
          
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal">
            प्राचीन वैदिक ज्योतिष और आधुनिक एआई का अनूठा संगम। अपनी कुंडली, सटीक राशिफल और दोषों के सरल उपाय जानें तुरंत।
          </p>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowChatModal(true)}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/10 transition-all flex items-center justify-center space-x-2 group active:scale-[0.99]"
            >
              <MessageSquare className="w-4 h-4 fill-slate-950" />
              <span>Chat Now (First Free)</span>
            </button>
            
            <Link 
              href="/kundli" 
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700/60 transition-colors flex items-center justify-center"
            >
              Free Kundli
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES GRID SECTION (ALIGNMENT FIXED) */}
      <section className="w-full max-w-md mx-auto px-4 mt-6 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">
          Explore Sacred Science Features
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          <Link href="/daily" className="p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 transition-all hover:border-slate-700 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Daily Horoscope</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">दैनिक राशिफल और शुभ समय जानें।</p>
            </div>
          </Link>

          <Link href="/kundli" className="p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 transition-all hover:border-slate-700 group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-slate-950 transition-colors">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Vedic Kundli</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">सटीक जन्म कुंडली चक्र और महादशा।</p>
            </div>
          </Link>

          <Link href="/compatibility" className="p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 transition-all hover:border-slate-700 group">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-slate-950 transition-colors">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Partner Matching</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">गुण मिलान और वैवाहिक अनुकूलता।</p>
            </div>
          </Link>

          <Link href="/palmistry" className="p-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 transition-all hover:border-slate-700 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Palm & Face AI</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">हस्तरेखा और चेहरा पठन विश्लेषण।</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. PROMOTIONAL UPSELL MARKETING CARDS */}
      <section className="w-full max-w-md mx-auto px-4 mt-6">
        <div className="p-4 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-900/40 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-purple-400 font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Premium Access Plan</span>
            </div>
            <h4 className="text-sm font-bold text-slate-200">Unlock Lifetime Remedy Tracker</h4>
            <p className="text-[11px] text-slate-400">सिर्फ ₹49/सप्ताह में असीमित चैट और उपाय ट्रैकिंग।</p>
          </div>
          <Link href="/wallet" className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-slate-100 text-xs font-bold rounded-lg transition-colors flex-shrink-0">
            Join ₹49
          </Link>
        </div>
      </section>

      {/* 4. STATISTICS SOCIAL PROOF ROW */}
      <section className="w-full max-w-md mx-auto px-6 mt-6 grid grid-cols-3 gap-2 text-center border-t border-slate-900 pt-4">
        <div>
          <div className="text-lg font-black text-amber-500 tracking-tight">4.99 ★</div>
          <div className="text-[10px] text-slate-400 font-medium">User Rating</div>
        </div>
        <div className="border-x border-slate-900">
          <div className="text-lg font-black text-slate-100 tracking-tight">1.2M+</div>
          <div className="text-[10px] text-slate-400 font-medium">Consultations</div>
        </div>
        <div>
          <div className="text-lg font-black text-emerald-400 tracking-tight">99.4%</div>
          <div className="text-[10px] text-slate-400 font-medium">Accuracy Log</div>
        </div>
      </section>

      {/* CONTEXT-CONSTRAINED CONDITIONAL POPUP MODAL CONTROL */}
      <FreeChatPopup 
        premiumStatus={isPremiumUser} 
        forcedTrigger={showChatModal} 
        onClose={() => setShowChatModal(false)}
        onStartChat={() => {
          setShowChatModal(false);
          window.location.href = "/chat/Gita";
        }}
      />
    </div>
  );
}

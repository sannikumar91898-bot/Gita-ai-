// app/privacy/page.tsx
"use client";

import { ArrowLeft, ShieldCheck, Lock, Eye, Database, Mail, Fingerprint, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

export default function PrivacyPolicyPage() {
  const { theme } = useApp();
  const isDark = theme === "dark";

  const pageClass = isDark ? "bg-[#070B14] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800/80 bg-[#151D2C]/90 shadow-xl" : "border-orange-100 bg-white shadow-lg";

  return (
    <main className={`min-h-[100dvh] w-full px-4 pb-24 pt-5 font-sans ${pageClass}`}>
      <div className="mx-auto max-w-3xl space-y-6">
        
        {/* 🔥 PREMIUM HERO HEADER (Psychological Trust) */}
        <header className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#FF6B00] via-[#E65A00] to-[#B90000] p-6 shadow-xl flex items-center gap-4">
          <div className="absolute right-0 top-0 w-[200px] h-[200px] opacity-20 pointer-events-none mix-blend-screen">
             <Sparkles size={200} className="text-white" />
          </div>
          
          <Link href="/settings" className="relative z-10 rounded-xl bg-white/20 backdrop-blur-sm p-2.5 text-white hover:bg-white/30 transition-colors">
            <ArrowLeft size={22} />
          </Link>
          <div className="relative z-10 flex-1">
            <h1 className="text-[22px] font-black tracking-tight text-white flex items-center gap-2">
               Privacy Policy <ShieldCheck size={20} className="text-amber-200" />
            </h1>
            <p className="text-[13px] font-medium text-orange-100 mt-0.5">
              Your trust is our top priority. 100% Secure & Confidential.
            </p>
          </div>
        </header>

        {/* 🔥 TRUST BADGES (Psychological Marketing) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className={`flex items-center gap-2 p-3 rounded-xl border ${isDark ? "border-emerald-500/20 bg-emerald-500/10" : "border-emerald-200 bg-emerald-50"}`}>
            <Lock size={16} className="text-emerald-500 shrink-0" />
            <span className={`text-[11px] font-bold ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>Data Encrypted</span>
          </div>
          <div className={`flex items-center gap-2 p-3 rounded-xl border ${isDark ? "border-amber-500/20 bg-amber-500/10" : "border-amber-200 bg-amber-50"}`}>
            <Fingerprint size={16} className="text-amber-500 shrink-0" />
            <span className={`text-[11px] font-bold ${isDark ? "text-amber-400" : "text-amber-700"}`}>No Data Selling</span>
          </div>
          <div className={`flex items-center gap-2 p-3 rounded-xl border sm:col-span-1 col-span-2 ${isDark ? "border-blue-500/20 bg-blue-500/10" : "border-blue-200 bg-blue-50"}`}>
            <ShieldCheck size={16} className="text-blue-500 shrink-0" />
            <span className={`text-[11px] font-bold ${isDark ? "text-blue-400" : "text-blue-700"}`}>DPDP Act Compliant</span>
          </div>
        </div>

        {/* 🔥 MAIN CONTENT CARDS */}
        <div className={`rounded-[1.5rem] border p-5 sm:p-7 space-y-7 ${cardClass}`}>
          
          {/* Section 1 */}
          <section className="space-y-3 relative">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
                <Database size={20} />
              </div>
              <h2 className={`text-[16px] font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                1. What Information Do We Collect?
              </h2>
            </div>
            <p className={`text-[13.5px] leading-relaxed pl-1 sm:pl-14 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
              To calculate your accurate <strong className="text-[#ff6b00]">Janam Kundli</strong> and provide Vedic insights, we collect your Name, Date of Birth, Time, and Place of Birth. If you use our <strong className="text-[#ff6b00]">AI Palmistry</strong> or <strong className="text-[#ff6b00]">Face Reading</strong> tools, we temporarily process your photos in real-time. 
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 relative">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
                <Eye size={20} />
              </div>
              <h2 className={`text-[16px] font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                2. How We Use Your Data
              </h2>
            </div>
            <p className={`text-[13.5px] leading-relaxed pl-1 sm:pl-14 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
              Your birth details are used solely to generate planetary positions, dosha cancellations, and horoscopes. Your chat history with our AI and Astrologers is stored securely to give you continuous context.
            </p>
            <div className={`ml-1 sm:ml-14 mt-2 p-3 rounded-lg border flex items-start gap-2 ${isDark ? "border-rose-500/20 bg-rose-500/5" : "border-rose-100 bg-rose-50"}`}>
              <CheckCircle2 size={16} className="text-rose-500 shrink-0 mt-0.5" />
              <p className={`text-[12.5px] font-bold ${isDark ? "text-rose-300" : "text-rose-700"}`}>
                We strictly NEVER sell, trade, or share your personal data or birth charts with any third-party marketing agencies.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 relative">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
                <ShieldCheck size={20} />
              </div>
              <h2 className={`text-[16px] font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                3. AI Processing & Third-Parties
              </h2>
            </div>
            <p className={`text-[13.5px] leading-relaxed pl-1 sm:pl-14 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
              We use advanced secure AI models to generate astrological insights. Your photos (Palm/Face) are processed in real-time and are <strong>not permanently stored</strong> on our servers. All payments are handled securely via <strong>Razorpay</strong>, meaning we never store your card or UPI details.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 relative">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
                <Lock size={20} />
              </div>
              <h2 className={`text-[16px] font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                4. Data Security & Your Rights
              </h2>
            </div>
            <p className={`text-[13.5px] leading-relaxed pl-1 sm:pl-14 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
              Under the DPDP Act (India), you have full rights over your data. We use industry-standard encryption to protect your info. If you ever wish to delete your account and all associated data, simply email us, and it will be permanently erased.
            </p>
          </section>

          {/* 🔥 CONTACT SECTION (Psychologically reassuring) */}
          <div className={`mt-8 p-5 rounded-2xl border ${isDark ? "border-slate-700 bg-slate-800/50" : "border-orange-200 bg-orange-50"} flex flex-col items-center text-center space-y-3`}>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm">
              <Mail size={24} className="text-[#ff6b00]" />
            </div>
            <div>
              <h3 className={`text-[15px] font-black ${isDark ? "text-white" : "text-slate-900"}`}>Still have questions?</h3>
              <p className={`text-[12.5px] mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Our support team is here to help you 24x7.
              </p>
            </div>
            <a 
              href="mailto:gitaaisupport@gmail.com" 
              className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-[#ff6b00] to-amber-600 text-white text-[13px] font-bold px-6 py-2.5 rounded-full shadow-md hover:scale-105 transition-transform"
            >
              Contact Support
            </a>
            <p className="text-[11px] font-medium text-slate-500 mt-1">
              gitaaisupport@gmail.com
            </p>
          </div>

        </div>

        {/* Footer Note */}
        <p className={`text-center text-[11px] font-medium ${isDark ? "text-slate-500" : "text-gray-500"}`}>
          © {new Date().getFullYear()} GitaTalk (gitatalk.in). All Rights Reserved.
        </p>

      </div>
    </main>
  );
}
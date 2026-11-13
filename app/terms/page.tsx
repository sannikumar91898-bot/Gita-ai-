// app/terms/page.tsx
"use client";

import { 
  ArrowLeft, FileText, AlertTriangle, CreditCard, 
  UserCheck, Scale, RefreshCcw, ShieldCheck, 
  CheckCircle2, Mail, Sparkles, Lock
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

export default function TermsPage() {
  const { theme } = useApp();
  const isDark = theme === "dark";

  const pageClass = isDark ? "bg-[#070B14] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800/80 bg-[#151D2C]/90 shadow-xl" : "border-orange-100 bg-white shadow-lg";

  return (
    <main className={`min-h-[100dvh] w-full px-4 pb-24 pt-5 font-sans ${pageClass}`}>
      <div className="mx-auto max-w-3xl space-y-6">
        
        {/* 🔥 PREMIUM HERO HEADER */}
        <header className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#FF6B00] via-[#E65A00] to-[#B90000] p-6 shadow-xl flex items-center gap-4">
          <div className="absolute right-0 top-0 w-[200px] h-[200px] opacity-20 pointer-events-none mix-blend-screen">
             <Sparkles size={200} className="text-white" />
          </div>
          
          <Link href="/settings" className="relative z-10 rounded-xl bg-white/20 backdrop-blur-sm p-2.5 text-white hover:bg-white/30 transition-colors">
            <ArrowLeft size={22} />
          </Link>
          <div className="relative z-10 flex-1">
            <h1 className="text-[22px] font-black tracking-tight text-white flex items-center gap-2">
               Terms & Refunds <FileText size={20} className="text-amber-200" />
            </h1>
            <p className="text-[13px] font-medium text-orange-100 mt-0.5">
               Transparent rules for a safe & trusted experience.
            </p>
          </div>
        </header>

        {/* 🔥 TRUST BADGES (Psychological Marketing) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className={`flex items-center gap-2 p-3 rounded-xl border ${isDark ? "border-emerald-500/20 bg-emerald-500/10" : "border-emerald-200 bg-emerald-50"}`}>
            <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
            <span className={`text-[11px] font-bold ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>100% Safe Payments</span>
          </div>
          <div className={`flex items-center gap-2 p-3 rounded-xl border ${isDark ? "border-amber-500/20 bg-amber-500/10" : "border-amber-200 bg-amber-50"}`}>
            <RefreshCcw size={16} className="text-amber-500 shrink-0" />
            <span className={`text-[11px] font-bold ${isDark ? "text-amber-400" : "text-amber-700"}`}>Easy Refunds</span>
          </div>
          <div className={`flex items-center gap-2 p-3 rounded-xl border sm:col-span-1 col-span-2 ${isDark ? "border-blue-500/20 bg-blue-500/10" : "border-blue-200 bg-blue-50"}`}>
            <Lock size={16} className="text-blue-500 shrink-0" />
            <span className={`text-[11px] font-bold ${isDark ? "text-blue-400" : "text-blue-700"}`}>Razorpay Secured</span>
          </div>
        </div>

        {/* 🔥 MAIN CONTENT CARDS */}
        <div className={`rounded-[1.5rem] border p-5 sm:p-7 space-y-7 ${cardClass}`}>
          
          {/* Section 1 */}
          <section className="space-y-3 relative">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
                <FileText size={20} />
              </div>
              <h2 className={`text-[16px] font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                1. Acceptance of Terms
              </h2>
            </div>
            <p className={`text-[13.5px] leading-relaxed pl-1 sm:pl-14 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
              By accessing <strong>GitaTalk (gitatalk.in)</strong>, you agree to these Terms. Our platform provides AI-generated Vedic astrological guidance. You must be at least 18 years old to use paid consultation services or make wallet recharges.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 relative">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
                <AlertTriangle size={20} />
              </div>
              <h2 className={`text-[16px] font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                2. Astrological Disclaimer
              </h2>
            </div>
            <p className={`text-[13.5px] leading-relaxed pl-1 sm:pl-14 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
              Astrology is a traditional science meant for guidance and self-reflection. Our AI-generated readings and human astrologer consultations do not guarantee future outcomes. We are not responsible for any life decisions (financial, medical, or personal) made based on these readings.
            </p>
          </section>

          {/* Section 3 - Payment & Refund (Most Important for Trust) */}
          <section className="space-y-3 relative">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
                <CreditCard size={20} />
              </div>
              <h2 className={`text-[16px] font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                3. Payments & Refund Policy
              </h2>
            </div>
            <p className={`text-[13.5px] leading-relaxed pl-1 sm:pl-14 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
              Your first chat with our Astrologers is absolutely FREE. Subsequent chats require a wallet balance, which can be recharged securely via <strong>Razorpay</strong>.
            </p>
            
            {/* Trust Booster Box for Refund */}
            <div className={`ml-1 sm:ml-14 mt-2 p-4 rounded-xl border flex flex-col gap-2 ${isDark ? "border-emerald-500/20 bg-emerald-500/5" : "border-emerald-100 bg-emerald-50"}`}>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className={`text-[12.5px] font-bold ${isDark ? "text-emerald-300" : "text-emerald-800"}`}>
                  Auto-Refund on Disconnection
                </p>
              </div>
              <p className={`text-[12px] pl-6 ${isDark ? "text-emerald-400/80" : "text-emerald-700"}`}>
                If a chat gets disconnected due to server/technical issues, the deducted amount is instantly refunded to your GitaTalk wallet.
              </p>
              
              <div className="flex items-start gap-2 mt-2">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className={`text-[12.5px] font-bold ${isDark ? "text-emerald-300" : "text-emerald-800"}`}>
                  Duplicate Payment Refund
                </p>
              </div>
              <p className={`text-[12px] pl-6 ${isDark ? "text-emerald-400/80" : "text-emerald-700"}`}>
                If you accidentally paid twice, email us within 7 days for a full refund to your bank account.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 relative">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
                <UserCheck size={20} />
              </div>
              <h2 className={`text-[16px] font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                4. User Conduct & Privacy
              </h2>
            </div>
            <p className={`text-[13.5px] leading-relaxed pl-1 sm:pl-14 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
              You agree not to upload abusive images, use offensive language with astrologers, or misuse the platform. Accounts violating this will be banned without refund. Your privacy is governed by our <Link href="/privacy" className="text-[#ff6b00] hover:underline font-semibold">Privacy Policy</Link>.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 relative">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isDark ? "bg-orange-500/10 text-orange-400" : "bg-orange-100 text-orange-600"}`}>
                <Scale size={20} />
              </div>
              <h2 className={`text-[16px] font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                5. Limitation of Liability
              </h2>
            </div>
            <p className={`text-[13.5px] leading-relaxed pl-1 sm:pl-14 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
              GitaTalk and its creators shall not be liable for any indirect or incidental damages resulting from the use of our services. The service is provided "as is" without any warranties.
            </p>
          </section>

          {/* 🔥 CONTACT SECTION (Psychologically reassuring) */}
          <div className={`mt-8 p-5 rounded-2xl border ${isDark ? "border-slate-700 bg-slate-800/50" : "border-orange-200 bg-orange-50"} flex flex-col items-center text-center space-y-3`}>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm">
              <Mail size={24} className="text-[#ff6b00]" />
            </div>
            <div>
              <h3 className={`text-[15px] font-black ${isDark ? "text-white" : "text-slate-900"}`}>Need help with a payment?</h3>
              <p className={`text-[12.5px] mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Our support team is available 24x7 for refunds or queries.
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
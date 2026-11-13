// app/terms/page.tsx
"use client";

import { ArrowLeft, FileText, CreditCard, RefreshCcw, AlertTriangle, Mail, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

export default function TermsPage() {
  const { theme } = useApp();
  const isDark = theme === "dark";

  const pageClass = isDark ? "bg-[#0B0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151E2E] shadow-xl" : "border-orange-100 bg-white shadow-xl";

  return (
    <main className={`min-h-screen w-full px-4 pb-20 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-2xl space-y-6">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/settings" className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-orange-400" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tight text-orange-500">Terms & Conditions</h1>
            <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-gray-500"}`}>Last updated: November 2026</p>
          </div>
        </header>

        {/* CONTENT */}
        <div className={`rounded-2xl border p-6 space-y-6 ${cardClass}`}>
          
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-orange-500">
              <FileText size={18} /> 1. Nature of Service
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              GitaTalk provides AI-based astrological guidance and access to independent human astrologers. Astrology is a traditional belief system. Our services are for <strong>guidance and entertainment purposes only</strong> and do not replace professional medical, legal, or financial advice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-orange-500">
              <CreditCard size={18} /> 2. Payments & Wallet
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              We offer a Free First Chat. Subsequent chats with human astrologers are charged per minute as displayed on their profile. Wallet recharges are processed securely via trusted payment gateways like Razorpay. You must be 18+ to make payments.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-orange-500">
              <RefreshCcw size={18} /> 3. Refund Policy
            </h2>
            <div className={`text-sm leading-relaxed space-y-2 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              <p>• <strong>Technical Errors:</strong> If a chat disconnects due to an issue from our end, the deducted amount will be automatically refunded to your GitaTalk wallet.</p>
              <p>• <strong>Duplicate Payments:</strong> If you are charged twice by mistake, you can request a refund to your original payment method within 7 days by emailing us.</p>
              <p>• <strong>Completed Sessions:</strong> Astrological consultations are non-refundable once the chat session is successfully completed.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-orange-500">
              <ShieldAlert size={18} /> 4. User Responsibilities
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              You agree not to upload abusive images, use offensive language with astrologers, or misuse the platform. Accounts violating these rules will be banned without a refund.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-orange-500">
              <Mail size={18} /> 5. Contact & Support
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              For any payment issues, refund requests, or complaints, please contact us at: <br/>
              <span className="font-bold text-orange-500">gitaaisupport@gmail.com</span>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
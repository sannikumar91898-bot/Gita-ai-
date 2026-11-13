// app/refund/page.tsx
"use client";

import { ArrowLeft, RefreshCcw, CreditCard, Clock } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

export default function RefundPolicyPage() {
  const { theme } = useApp();
  const isDark = theme === "dark";

  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c] shadow-lg" : "border-orange-100 bg-white shadow-xl";

  return (
    <main className={`min-h-screen w-full px-4 pb-20 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-2xl space-y-6">
        
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-orange-400" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tight text-orange-500">Refund & Cancellation</h1>
            <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-gray-500"}`}>Last updated: November 2026</p>
          </div>
        </header>

        <div className={`rounded-2xl border p-6 space-y-6 ${cardClass}`}>
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-orange-500">
              <CreditCard size={18} /> 1. Wallet Recharges
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              Any amount added to the GitaTalk wallet is non-refundable and cannot be transferred back to your bank account. Wallet balance can only be used for availing astrology services on our platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-orange-500">
              <Clock size={18} /> 2. Failed Transactions
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              If your money is deducted but the wallet balance is not updated, it is usually due to a bank delay. If the amount is not reflected within 24 hours, please contact us. In case of a failed transaction, the amount is automatically refunded by your bank within 5-7 working days.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-orange-500">
              <RefreshCcw size={18} /> 3. Chat & Report Cancellations
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              Once a chat session is initiated or a digital report (Kundli, Palmistry) is generated, it cannot be cancelled or refunded. However, if you face a technical glitch where the chat disconnected from our side, please email us within 24 hours with a screenshot, and we will credit the amount back to your wallet.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-orange-500 mt-4">Contact for Support</h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              For any payment-related queries, please email us at: <br/>
              <span className="font-bold text-orange-500">support@gitatalk.in</span>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
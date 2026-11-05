// app/terms/page.tsx
"use client";

import { ArrowLeft, FileText, AlertTriangle, CreditCard, UserCheck, Scale, RefreshCcw } from "lucide-react";
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
              <FileText size={18} /> 1. Acceptance of Terms
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              By accessing and using Gita AI, you agree to comply with these Terms. Our platform provides AI-generated astrological guidance based on Vedic principles. You must be at least 18 years old to use paid consultation services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-orange-500">
              <AlertTriangle size={18} /> 2. Astrological Disclaimer
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              Astrology is a traditional science meant for guidance and self-reflection. Our AI-generated readings do not guarantee future outcomes. We are not responsible for any life decisions (financial, medical, or personal) made based on these consultations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-orange-500">
              <CreditCard size={18} /> 3. Payments & Refunds
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              The first chat is free. Subsequent chats or detailed reports may require payment via our secure wallet system. All payments made are final. Refunds are processed only in cases of technical failure where the service was not delivered.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-orange-500">
              <UserCheck size={18} /> 4. User Conduct
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              You agree not to misuse the platform, upload inappropriate images for face/palm reading, or attempt to hack or disrupt our services. We reserve the right to ban accounts violating these rules.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-orange-500">
              <Scale size={18} /> 5. Limitation of Liability
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              Gita AI and its creators shall not be liable for any direct, indirect, or incidental damages resulting from the use of our services. The service is provided "as is" without any warranties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-orange-500">
              <RefreshCcw size={18} /> 6. Changes to Terms
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              We may update these Terms from time to time. Continued use of the app after changes means you accept the new Terms. 
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
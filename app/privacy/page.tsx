// app/privacy/page.tsx
"use client";

import { ArrowLeft, Shield, Lock, Eye, Database, Mail } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

export default function PrivacyPolicyPage() {
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
            <h1 className="text-lg font-black uppercase tracking-tight text-orange-500">Privacy Policy</h1>
            <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-gray-500"}`}>Last updated: November 2026</p>
          </div>
        </header>

        {/* CONTENT */}
        <div className={`rounded-2xl border p-6 space-y-6 ${cardClass}`}>
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-orange-500">
              <Database size={18} /> 1. Information We Collect
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              To provide accurate Vedic astrology readings, we collect personal information such as your Name, Date of Birth, Time of Birth, and Place of Birth. If you use our Face Reading or Palmistry features, we temporarily process your uploaded images.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-orange-500">
              <Eye size={18} /> 2. How We Use Your Data
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              Your data is used solely to generate Kundli calculations, horoscopes, and personalized AI astrological guidance. We do not sell your personal data to third parties. Your chat history is stored securely to provide you with continuous context.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-orange-500">
              <Shield size={18} /> 3. AI & Third-Party Services
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              We use advanced AI models (such as Google Gemini) to process your inputs and generate readings. These models do not permanently store your personal identifiers. For payments, we use secure third-party gateways like Razorpay, which comply with PCI-DSS standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-orange-500">
              <Lock size={18} /> 4. Data Security
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              We implement industry-standard security measures to protect your data. Uploaded images for Face/Palm reading are processed in real-time and are not permanently saved on our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-orange-500">
              <Mail size={18} /> 5. Contact Us
            </h2>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              If you have any questions regarding this Privacy Policy, please contact us at: <br/>
              {/* 🔥 YAHAN NAYI EMAIL UPDATE KAR DI HAI 🔥 */}
              <span className="font-bold text-orange-500">gitaaisupport@gmail.com</span>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
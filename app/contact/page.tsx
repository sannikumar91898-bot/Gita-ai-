// app/contact/page.tsx
"use client";

import { ArrowLeft, Mail, Send, MessageCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";
import { useState } from "react";

export default function ContactPage() {
  const { theme } = useApp();
  const isDark = theme === "dark";
  const [submitted, setSubmitted] = useState(false);

  const pageClass = isDark ? "bg-[#0B0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151E2E] shadow-xl" : "border-orange-100 bg-white shadow-xl";
  const inputClass = `mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${isDark ? "border-slate-700 bg-slate-800 text-white focus:border-orange-500" : "border-gray-200 bg-gray-50 text-slate-900 focus:border-orange-400"}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Yahan aap chaho toh koi EmailJS ya backend API laga sakte hain mail bhejne ke liye.
    setSubmitted(true);
  };

  return (
    <main className={`min-h-screen w-full px-4 pb-20 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-2xl space-y-6">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/settings" className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-orange-400" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tight text-orange-500">Contact & Support</h1>
            <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-gray-500"}`}>We are here to help you 24x7</p>
          </div>
        </header>

        {/* QUICK SUPPORT OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Email Card */}
          <div className={`rounded-2xl border p-6 flex flex-col items-center text-center space-y-2 ${cardClass}`}>
            <div className="h-12 w-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mb-2">
              <Mail size={24} />
            </div>
            <h3 className="font-bold">Email Support</h3>
            {/* 🔥 YAHAN AAPKI NAYI ID UPDATE HO GAYI HAI 🔥 */}
            <a href="mailto:gitaaisupport@gmail.com" className="text-sm font-semibold text-orange-500 hover:underline">
              gitaaisupport@gmail.com
            </a>
            <p className={`text-xs flex items-center gap-1 mt-1 ${isDark ? "text-slate-500" : "text-gray-400"}`}>
              <Clock size={12} /> Reply within 24 hours
            </p>
          </div>

          {/* Live Chat Card */}
          <div className={`rounded-2xl border p-6 flex flex-col items-center text-center space-y-2 ${cardClass}`}>
            <div className="h-12 w-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mb-2">
              <MessageCircle size={24} />
            </div>
            <h3 className="font-bold">Live AI Chat</h3>
            <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>Talk to Gita AI instantly</p>
            <Link href="/chat" className="text-xs font-bold text-orange-500 hover:underline mt-1">Start Chat Now →</Link>
          </div>
        </div>

        {/* MESSAGE FORM */}
        <div className={`rounded-2xl border p-6 ${cardClass}`}>
          <h2 className="text-base font-bold text-orange-500 mb-4">Send us a Message</h2>
          
          {submitted ? (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-sm font-bold text-center">
              Thank you! Your message has been sent. We will get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500">Your Name</label>
                  <input type="text" required placeholder="Enter your name" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">Email Address</label>
                  <input type="email" required placeholder="Enter your email" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Message</label>
                <textarea required placeholder="How can we help you?" rows={4} className={inputClass}></textarea>
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-transform">
                <Send size={16} /> Send Message
              </button>
            </form>
          )}
        </div>

      </div>
    </main>
  );
}
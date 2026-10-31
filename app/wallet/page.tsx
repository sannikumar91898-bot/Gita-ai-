// app/wallet/page.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Wallet as WalletIcon, Zap, ShieldCheck, CheckCircle2, ChevronRight, Gift } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

export default function WalletPage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  const [amount, setAmount] = useState(11); 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const t = (hi: string, hing: string, en: string) =>
    isHindi ? hi : isHinglish ? hing : en;

  // Dark theme for wallet looks premium, but we'll respect user's theme
  const pageClass = isDark ? "bg-slate-950 text-violet-50" : "bg-[#FEF8EF] text-slate-900";

  // Razorpay Test Integration Logic (Mock)
  const handlePayment = () => {
    setLoading(true);
    setSuccess(false);
    
    // Yahan baad mein Razorpay ka script aayega
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  const offers = [
    { price: 11, desc: "1 Question", tag: "Trial" },
    { price: 21, desc: "5 Mins Chat", tag: "Budget" },
    { price: 51, desc: "15 Mins Chat", tag: "Popular" },
    { price: 99, desc: "Detailed Chat", tag: "" },
    { price: 121, desc: "Full Kundli + Upay", tag: "Premium" },
  ];

  return (
    <main className={`min-h-screen w-full px-4 pb-40 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        
        {/* HEADER */}
        <header className={`flex items-center justify-between rounded-2xl border p-4 ${isDark ? "border-slate-800 bg-slate-900" : "border-orange-100 bg-white shadow-sm"}`}>
          <div className="flex items-center gap-3">
            <Link href="/" className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-violet-200" : "bg-orange-50 text-orange-600"}`}>
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-base font-black uppercase tracking-tight text-orange-600">
              {t("मेरा वॉलेट", "My Wallet", "My Wallet")}
            </h1>
          </div>
          <WalletIcon className="text-orange-500" size={22} />
        </header>

        {/* PREMIUM BALANCE CARD */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-2xl border border-slate-700">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <WalletIcon size={120} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t("कुल बैलेंस", "Total Balance", "Total Balance")}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black">₹0</span>
              <span className="text-sm font-medium text-slate-400">INR</span>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-bold text-green-400 border border-green-500/30">
                <ShieldCheck size={12} /> {t("सुरक्षित", "Secured", "Secured")}
              </span>
            </div>
          </div>
        </section>

        {/* RECHARGE PLANS GRID (Screenshot 2 Style) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              <Zap size={16} className="text-orange-500" /> {t("रिचार्ज प्लान चुनें", "Choose Recharge Plan", "Choose Recharge Plan")}
            </h2>
            <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-200">
              <Gift size={12} /> {t("एक्स्ट्रा बोनस", "Extra Bonus", "Extra Bonus")}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {offers.map((offer) => (
              <button
                key={offer.price}
                onClick={() => setAmount(offer.price)}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all duration-200 ${
                  amount === offer.price
                    ? "border-orange-500 bg-gradient-to-b from-orange-50 to-white dark:from-slate-800 dark:to-slate-900 shadow-lg scale-[1.02]"
                    : isDark ? "border-slate-700 bg-slate-800/40 hover:border-slate-500" : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md"
                }`}
              >
                {offer.tag && (
                  <span className={`absolute -top-2.5 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm ${
                    offer.tag === "Popular" ? "bg-gradient-to-r from-rose-500 to-red-500" : 
                    offer.tag === "Premium" ? "bg-gradient-to-r from-amber-500 to-orange-500" : 
                    "bg-slate-800"
                  }`}>
                    {offer.tag}
                  </span>
                )}
                <span className={`text-2xl font-black ${amount === offer.price ? "text-orange-600 dark:text-orange-400" : isDark ? "text-white" : "text-gray-800"}`}>
                  ₹{offer.price}
                </span>
                
                {/* Fake Extra Bonus Badge */}
                <div className="mt-1.5 w-full flex items-center justify-center rounded-md bg-green-500/10 py-1">
                  <span className="text-[10px] font-bold text-green-600 dark:text-green-400">
                    {offer.price >= 51 ? `+₹${Math.floor(offer.price * 0.1)} Extra` : "No Bonus"}
                  </span>
                </div>
                <span className={`text-[10px] font-bold mt-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                  {offer.desc}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* PAYMENT BUTTON SECTION */}
        <section className={`rounded-2xl border p-5 ${isDark ? "border-slate-800 bg-slate-900" : "border-orange-100 bg-white shadow-lg"}`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-gray-600"}`}>{t("कुल भुगतान", "Total Payable", "Total Payable")}</span>
            <span className="text-xl font-black text-orange-600 dark:text-orange-400">₹{amount}</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3.5 text-sm font-black text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] active:scale-95 disabled:opacity-70"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? t("प्रोसेस हो रहा है...", "Processing...", "Processing...") : t(`UPI से ₹${amount} का पेमेंट करें`, `Pay ₹${amount} via UPI`, `Pay ₹${amount} via UPI`)}
              {!loading && <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />}
            </span>
          </button>

          {/* RAZORPAY TEST SUCCESS MSG */}
          {success && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-300 bg-green-50 p-3 text-sm font-bold text-green-700 animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 size={18} className="text-green-600" />
              {t("टेस्ट पेमेंट सफल! (रोज़रपे जल्द जुड़ेगा)", "Test Payment Successful! (Razorpay soon)", "Test Payment Successful! (Razorpay soon)")}
            </div>
          )}

          <p className="mt-4 text-center text-[10px] text-gray-400">
            Secure payments powered by Razorpay (Test Mode)
          </p>
        </section>
      </div>
    </main>
  );
}
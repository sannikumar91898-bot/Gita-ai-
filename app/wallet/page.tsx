// app/wallet/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Wallet as WalletIcon, Zap, ShieldCheck, CheckCircle2, ChevronRight, Gift, MessageCircle, Loader2, Clock } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

declare global {
  interface Window { Razorpay: any; }
}

// 🔥 10 Language Translation Helper
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: { title: "मेरा वॉलेट", total: "कुल बैलेंस", secured: "सुरक्षित", choose: "दक्षिणा चुनें", bonus: "10% एक्स्ट्रा बोनस", noBonus: "कोई बोनस नहीं", totalDakshina: "कुल दक्षिणा", pay: "₹X दक्षिणा दें", processing: "प्रोसेस हो रहा है...", verifying: "पेमेंट वेरिफाई हो रहा है...", success: "दक्षिणा सफल! बैलेंस अपडेट हो गया है।", securePay: "100% सुरक्षित भुगतान • UPI / कार्ड", sticky: "ज्योतिषी • 24x7 उपलब्ध", stickySub: "अभी बात करें — पहली चैट FREE", chat: "चैट" },
    hinglish: { title: "My Wallet", total: "Total Balance", secured: "Secured", choose: "Choose Dakshina", bonus: "10% Extra Bonus", noBonus: "No Bonus", totalDakshina: "Total Dakshina", pay: "Pay ₹X Dakshina", processing: "Processing...", verifying: "Verifying payment...", success: "Dakshina successful! Balance updated.", securePay: "100% Secure Payments • UPI / Card", sticky: "Astrologer • 24x7 Available", stickySub: "Talk Now — First Chat FREE", chat: "Chat" },
    en: { title: "My Wallet", total: "Total Balance", secured: "Secured", choose: "Choose Dakshina", bonus: "10% Extra Bonus", noBonus: "No Bonus", totalDakshina: "Total Dakshina", pay: "Pay ₹X Dakshina", processing: "Processing...", verifying: "Verifying payment...", success: "Dakshina successful! Balance updated.", securePay: "100% Secure Payments • UPI / Card", sticky: "Astrologer • 24x7 Available", stickySub: "Talk Now — First Chat FREE", chat: "Chat" },
    te: { title: "నా వాలెట్", total: "మొత్తం నిల్వ", secured: "సురక్షితం", choose: "దక్షిణ ఎంచుకోండి", bonus: "10% అదనపు బోనస్", noBonus: "బోనస్ లేదు", totalDakshina: "మొత్తం దక్షిణ", pay: "₹X దక్షిణ చెల్లించండి", processing: "ప్రాసెస్ అవుతోంది...", verifying: "చెల్లింపు ధృవీకరిస్తోంది...", success: "దక్షిణ విజయవంతం! బ్యాలెన్స్ అప్‌డేట్ అయింది.", securePay: "100% సురక్షిత చెల్లింపులు • UPI / కార్డ్", sticky: "జ్యోతిష్యుడు • 24x7 అందుబాటులో", stickySub: "ఇప్పుడే మాట్లాడండి — మొదటి చాట్ ఉచితం", chat: "చాట్" },
    ta: { title: "எனது பணப்பை", total: "மொத்த இருப்பு", secured: "பாதுகாப்பானது", choose: "தட்சிணை தேர்ந்தெடுக்கவும்", bonus: "10% கூடுதல் போனஸ்", noBonus: "போனஸ் இல்லை", totalDakshina: "மொத்த தட்சிணை", pay: "₹X தட்சிணை செலுத்துங்கள்", processing: "செயலாக்கப்படுகிறது...", verifying: "பணம் சரிபார்க்கப்படுகிறது...", success: "தட்சிணை வெற்றி! இருப்பு புதுப்பிக்கப்பட்டது.", securePay: "100% பாதுகாப்பான பணம் • UPI / கார்டு", sticky: "ஜோதிடர் • 24x7 கிடைக்கும்", stickySub: "இப்போது பேசுங்கள் — முதல் அரட்டை இலவசம்", chat: "அரட்டை" },
    kn: { title: "ನನ್ನ ವಾಲೆಟ್", total: "ಒಟ್ಟು ಬಾಕಿ", secured: "ಸುರಕ್ಷಿತ", choose: "ದಕ್ಷಿಣೆ ಆಯ್ಕೆಮಾಡಿ", bonus: "10% ಹೆಚ್ಚುವರಿ ಬೋನಸ್", noBonus: "ಬೋನಸ್ ಇಲ್ಲ", totalDakshina: "ಒಟ್ಟು ದಕ್ಷಿಣೆ", pay: "₹X ದಕ್ಷಿಣೆ ಪಾವತಿಸಿ", processing: "ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...", verifying: "ಪಾವತಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...", success: "ದಕ್ಷಿಣೆ ಯಶಸ್ವಿ! ಬ್ಯಾಲೆನ್ಸ್ ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ.", securePay: "100% ಸುರಕ್ಷಿತ ಪಾವತಿಗಳು • UPI / ಕಾರ್ಡ್", sticky: "ಜ್ಯೋತಿಷಿ • 24x7 ಲಭ್ಯವಿದೆ", stickySub: "ಈಗ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ", chat: "ಚಾಟ್" },
    bn: { title: "আমার ওয়ালেট", total: "মোট ব্যালেন্স", secured: "সুরক্ষিত", choose: "দক্ষিণা চয়ন করুন", bonus: "10% অতিরিক্ত বোনাস", noBonus: "কোনো বোনাস নেই", totalDakshina: "মোট দক্ষিণা", pay: "₹X দক্ষিণা দিন", processing: "প্রসেস হচ্ছে...", verifying: "পেমেন্ট যাচাই করা হচ্ছে...", success: "দক্ষিণা সফল! ব্যালেন্স আপডেট হয়েছে।", securePay: "100% সুরক্ষিত পেমেন্ট • UPI / কার্ড", sticky: "জ্যোতিষী • 24x7 উপলব্ধ", stickySub: "এখনই কথা বলুন — প্রথম চ্যাট ফ্রি", chat: "চ্যাট" },
    mr: { title: "माझे वॉलेट", total: "एकूण शिल्लक", secured: "सुरक्षित", choose: "दक्षिणा निवडा", bonus: "10% अतिरिक्त बोनस", noBonus: "बोनस नाही", totalDakshina: "एकूण दक्षिणा", pay: "₹X दक्षिणा द्या", processing: "प्रक्रिया सुरू आहे...", verifying: "पेमेंट तपासत आहे...", success: "दक्षिणा यशस्वी! बॅलन्स अपडेट झाला.", securePay: "100% सुरक्षित पेमेंट • UPI / कार्ड", sticky: "ज्योतिषी • 24x7 उपलब्ध", stickySub: "आता बोला — पहिली चॅट मोफत", chat: "चॅट" },
    gu: { title: "મારું વોલેટ", total: "કુલ બેલેન્સ", secured: "સુરક્ષિત", choose: "દક્ષિણા પસંદ કરો", bonus: "10% વધારાનું બોનસ", noBonus: "કોઈ બોનસ નથી", totalDakshina: "કુલ દક્ષિણા", pay: "₹X દક્ષિણા આપો", processing: "પ્રોસેસ થઈ રહ્યું છે...", verifying: "પેમેન્ટ ચકાસી રહ્યું છે...", success: "દક્ષિણા સફળ! બેલેન્સ અપડેટ થયું.", securePay: "100% સુરક્ષિત પેમેન્ટ • UPI / કાર્ડ", sticky: "જ્યોતિષી • 24x7 ઉપલબ્ધ", stickySub: "હમણાં વાત કરો — પ્રથમ ચેટ મફત", chat: "ચેટ" },
    ml: { title: "എന്റെ വാലറ്റ്", total: "മൊത്തം ബാലൻസ്", secured: "സുരക്ഷിതം", choose: "ദക്ഷിണ തിരഞ്ഞെടുക്കുക", bonus: "10% അധിക ബോണസ്", noBonus: "ബോണസ് ഇല്ല", totalDakshina: "മൊത്തം ദക്ഷിണ", pay: "₹X ദക്ഷിണ നൽകുക", processing: "പ്രോസസ്സ് ചെയ്യുന്നു...", verifying: "പേയ്‌മെന്റ് സ്ഥിരീകരിക്കുന്നു...", success: "ദക്ഷിണ വിജയകരം! ബാലൻസ് അപ്‌ഡേറ്റ് ചെയ്തു.", securePay: "100% സുരക്ഷിത പേയ്‌മെന്റുകൾ • UPI / കാർഡ്", sticky: "ജ്യോതിഷി • 24x7 ലഭ്യമാണ്", stickySub: "ഇപ്പോൾ സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം", chat: "ചാറ്റ്" },
  };
  return ui[lang]?.[key] || ui["en"][key];
};

const getOfferDesc = (lang: string, price: number) => {
  const map: Record<string, Record<number, string>> = {
    hi: { 11: "1 सवाल", 21: "5 मिनट चैट", 51: "पूरा समाधान", 101: "विस्तृत रीडिंग", 121: "पूरी कुंडली + उपाय", 151: "अल्टीमेट परामर्श" },
    hinglish: { 11: "1 Question", 21: "5 Mins Chat", 51: "Full Solution", 101: "Detailed Reading", 121: "Full Kundli + Upay", 151: "Ultimate Consultation" },
    en: { 11: "1 Question", 21: "5 Mins Chat", 51: "Full Solution", 101: "Detailed Reading", 121: "Full Kundli + Upay", 151: "Ultimate Consultation" },
    te: { 11: "1 ప్రశ్న", 21: "5 నిమిషాల చాట్", 51: "పూర్తి పరిష్కారం", 101: "వివరమైన పఠనం", 121: "పూర్తి కుండలి + పరిహారం", 151: "అంతిమ సంప్రదింపు" },
    ta: { 11: "1 கேள்வி", 21: "5 நிமிட அரட்டை", 51: "முழு தீர்வு", 101: "விரிவான வாசிப்பு", 121: "முழு ஜாதகம் + பரிகாரம்", 151: "இறுதி ஆலோசனை" },
    kn: { 11: "1 ಪ್ರಶ್ನೆ", 21: "5 ನಿಮಿಷ ಚಾಟ್", 51: "ಸಂಪೂರ್ಣ ಪರಿಹಾರ", 101: "ವಿವರವಾದ ಓದುವಿಕೆ", 121: "ಪೂರ್ಣ ಕುಂಡಲಿ + ಪರಿಹಾರ", 151: "ಅಂತಿಮ ಸಮಾಲೋಚನೆ" },
    bn: { 11: "1 প্রশ্ন", 21: "5 মিনিট চ্যাট", 51: "সম্পূর্ণ সমাধান", 101: "বিস্তারিত পাঠ", 121: "সম্পূর্ণ কুণ্ডলী + প্রতিকার", 151: "চূড়ান্ত পরামর্শ" },
    mr: { 11: "1 प्रश्न", 21: "5 मिनिट चॅट", 51: "संपूर्ण उपाय", 101: "तपशीलवार वाचन", 121: "संपूर्ण कुंडली + उपाय", 151: "अंतिम सल्ला" },
    gu: { 11: "1 પ્રશ્ન", 21: "5 મિનિટ ચેટ", 51: "સંપૂર્ણ ઉપાય", 101: "વિગતવાર વાંચન", 121: "સંપૂર્ણ કુંડળી + ઉપાય", 151: "અંતિમ પરામર્શ" },
    ml: { 11: "1 ചോദ്യം", 21: "5 മിനിറ്റ് ചാറ്റ്", 51: "പൂർണ്ണ പരിഹാരം", 101: "വിശദമായ വായന", 121: "പൂർണ്ണ കുണ്ഡലി + പരിഹാരം", 151: "അന്തിമ കൺസൾട്ടേഷൻ" },
  };
  return map[lang]?.[price] || map["en"][price];
};

export default function WalletPage() {
  const { lang, theme, refresh } = useApp(); 
  const isDark = theme === "dark";

  const [amount, setAmount] = useState(11); 
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false); // 🔥 NAYA: Verifying state
  const [success, setSuccess] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const t = (key: string) => getUIText(lang, key);

  const pageClass = isDark ? "bg-[#0B0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      const data = await res.json();
      if (data.user) setWalletBalance(data.user.walletBalancePaise || 0);
    } catch (e) {
      console.error("Failed to fetch wallet balance", e);
    }
  }, []);

  useEffect(() => { void fetchProfile(); }, [fetchProfile]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  const handlePayment = async () => {
    if (typeof window === "undefined" || !window.Razorpay) {
      alert("Razorpay is loading. Please wait 2 seconds.");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setVerifying(false);

    try {
      const bonusAmount = amount >= 51 ? Math.floor(amount * 0.1) : 0;
      const totalCredit = amount + bonusAmount;

      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, bonusAmount, totalCredit }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.orderId) throw new Error(orderData.error || "Order creation failed");

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: "INR",
        name: "Gita AI Astrologer",
        description: `Dakshina - ₹${amount}`,
        order_id: orderData.orderId,
        image: "/icon-192.png",
        handler: async function (response: any) {
          // 🔥 FIX 1: Verifying state ON karo, Razorpay checkout band karo but success mat dikhao
          setVerifying(true);
          setLoading(false);

          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              // 🔥 FIX 2: Pehle Global refresh (Homepage), phir Local Wallet refresh — AWAIT ke sath
              await refresh();
              await fetchProfile();
              
              // 🔥 FIX 3: Sirf ab Success dikhao jab balance update ho chuka ho
              setSuccess(true);
              setVerifying(false);
              setTimeout(() => setSuccess(false), 6000);
            } else {
              setVerifying(false);
              alert("Payment verification failed. Please contact support. Your money is safe and will be credited within 24 hours.");
            }
          } catch (error) {
            console.error("Verify error:", error);
            setVerifying(false);
            alert("Verification network error. Please contact support. Your money is safe.");
          }
        },
        prefill: { name: "Guest User", email: "guest@example.com", contact: "9999999999" },
        theme: { color: "#f97316" },
        modal: { 
          ondismiss: function () { 
            setLoading(false); 
            setVerifying(false);
          } 
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        alert("Payment failed. Please try again.");
        setLoading(false);
        setVerifying(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Payment error:", err);
      alert(err.message || "Payment failed.");
      setLoading(false);
      setVerifying(false);
    }
  };

  const offers = [
    { price: 11, tag: "Trial" },
    { price: 21, tag: "Budget" },
    { price: 51, tag: "Popular" },
    { price: 101, tag: "Value" },
    { price: 121, tag: "Premium" },
    { price: 151, tag: "Best" },
  ];

  return (
    <main className={`min-h-screen w-full px-4 pb-32 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        
        {/* HEADER */}
        <header className={`flex items-center justify-between rounded-2xl border p-4 ${isDark ? "border-slate-800 bg-[#151E2E]" : "border-orange-100 bg-white shadow-sm"}`}>
          <div className="flex items-center gap-3">
            <Link href="/" className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-orange-400" : "bg-orange-50 text-orange-600"}`}>
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-base font-black uppercase tracking-tight text-orange-500">{t("title")}</h1>
          </div>
          <WalletIcon className="text-orange-500" size={22} />
        </header>

        {/* BALANCE CARD */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-6 text-white shadow-2xl shadow-orange-500/20">
          <div className="absolute top-0 right-0 p-4 opacity-20"><WalletIcon size={140} /></div>
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-widest text-orange-100">{t("total")}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-5xl font-black drop-shadow-lg">₹{walletBalance / 100}</span>
              <span className="text-sm font-bold text-orange-200">INR</span>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-black text-white border border-white/30">
                <ShieldCheck size={12} /> {t("secured")}
              </span>
            </div>
          </div>
        </section>

        {/* RECHARGE PLANS GRID */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
              <Zap size={16} className="text-orange-500" /> {t("choose")}
            </h2>
            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <Gift size={12} /> {t("bonus")}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {offers.map((offer) => {
              const isSelected = amount === offer.price;
              
              return (
                <button
                  key={offer.price}
                  onClick={() => setAmount(offer.price)}
                  disabled={verifying || loading}
                  className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all duration-200 disabled:opacity-60 ${
                    isSelected
                      ? `border-orange-500 shadow-lg shadow-orange-500/10 scale-[1.02] ${isDark ? "bg-[#1e293b]" : "bg-orange-50"}`
                      : isDark ? "border-slate-700/50 bg-[#151E2E] hover:border-slate-600" : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md"
                  }`}
                >
                  {offer.tag && (
                    <span className={`absolute -top-2.5 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-sm ${
                      offer.tag === "Popular" || offer.tag === "Best" ? "bg-gradient-to-r from-rose-500 to-red-500" : 
                      offer.tag === "Premium" ? "bg-gradient-to-r from-amber-500 to-orange-500" : 
                      "bg-slate-700"
                    }`}>
                      {offer.tag}
                    </span>
                  )}
                  
                  <span className={`text-2xl font-black ${isSelected ? (isDark ? "text-orange-400" : "text-orange-600") : isDark ? "text-white" : "text-gray-800"}`}>
                    ₹{offer.price}
                  </span>
                  
                  <div className={`mt-1.5 w-full flex items-center justify-center rounded-md py-1 ${offer.price >= 51 ? "bg-emerald-500/10" : isDark ? "bg-slate-700/50" : "bg-slate-100"}`}>
                    <span className={`text-[10px] font-black ${offer.price >= 51 ? "text-emerald-500" : isDark ? "text-slate-400" : "text-gray-500"}`}>
                      {offer.price >= 51 ? `+₹${Math.floor(offer.price * 0.1)} Bonus` : t("noBonus")}
                    </span>
                  </div>
                  
                  <span className={`text-[10px] font-bold mt-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                    {getOfferDesc(lang, offer.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* PAYMENT BUTTON SECTION */}
        <section className={`rounded-2xl border p-5 ${isDark ? "border-slate-800 bg-[#151E2E]" : "border-orange-100 bg-white shadow-lg"}`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-gray-600"}`}>{t("totalDakshina")}</span>
            <span className="text-2xl font-black text-orange-500">₹{amount}</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading || verifying}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-4 text-sm font-black text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] active:scale-95 disabled:opacity-70"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {t("processing")}
                </>
              ) : verifying ? (
                <>
                  <Clock size={18} className="animate-pulse" />
                  {t("verifying")}
                </>
              ) : (
                <>
                  {t("pay").replace("₹X", `₹${amount}`)}
                  <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </span>
          </button>

          {success && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-bold text-emerald-500 animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 size={18} />
              {t("success")}
            </div>
          )}

          <p className={`mt-4 text-center text-[10px] font-medium ${isDark ? "text-slate-500" : "text-gray-400"}`}>
            {t("securePay")}
          </p>
        </section>
      </div>

      {/* FIXED BOTTOM RED BAR */}
      <Link href="/chat" className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 px-4 py-3.5 text-white shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20"><MessageCircle size={18} /></span>
          <div className="leading-tight">
            <p className="text-[10px] font-black uppercase tracking-wider text-rose-100">{t("sticky")}</p>
            <p className="text-sm font-black">{t("stickySub")}</p>
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-rose-700">{t("chat")}</span>
      </Link>
    </main>
  );
}
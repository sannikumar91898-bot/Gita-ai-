"use client";

import React, { useState } from "react";
import { Sparkles, ShieldCheck, Loader2 } from "lucide-react";

interface UnlockPremiumButtonProps {
  userId: string;
  amount: number; // रुपये में (उदा: 499)
  onSuccess: () => void; // पेमेंट सफल होने के बाद का एक्शन
}

export default function UnlockPremiumButton({ userId, amount, onSuccess }: UnlockPremiumButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Razorpay की आधिकारिक स्क्रिप्ट को लोड करने का हेल्पर फंक्शन
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://razorpay.com";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 2. पेमेंट प्रोसेस शुरू करने का मुख्य फंक्शन
  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // क) Razorpay स्क्रिप्ट लोड करें
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Razorpay SDK लोड करने में विफलता हुई। कृपया अपना इंटरनेट कनेक्शन जांचें।");
        setIsProcessing(false);
        return;
      }

      // ख) हमारे बैकएंड API से ऑर्डर आईडी जेनरेट करवाएं
      const response = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amountInINR: amount }),
      });

      const orderData = await response.json();

      if (!response.ok || orderData.error) {
        throw new Error(orderData.error || "ऑर्डर जनरेशन फ़ेल हो गया");
      }

      // ग) Razorpay चेकआउट ऑप्शन्स कॉन्फ़िगर करें (100% Premium Branding)
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AstroPandit Premium",
        description: "पंडित जी की वीआईपी 100% सटीक महाकुंडली भविष्यवाणियां अनलॉक करें",
        image: "/astro-logo.png", // आपके ऐप का लोगो पाथ
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // यह तब ट्रिगर होता है जब यूज़र की तरफ से पेमेंट सक्सेसफुल हो जाए
          // सुरक्षा के लिए हमारा वेबहुक बैकएंड पर काम करेगा, लेकिन फ्रंटएंड को तुरंत रिफ्रेश करने के लिए:
          setIsProcessing(false);
          onSuccess();
        },
        prefill: {
          name: "", // यदि आपके पास यूज़र का नाम पहले से स्टोर हो
          email: "",
        },
        theme: {
          color: "#ea580c", // ऑरेंज/अंबर प्रीमियम थीम कलर
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Payment Gateway Initialization Failure:", error);
      alert("पेमेंट गेटवे शुरू करने में समस्या आई। कृपया पुनः प्रयास करें।");
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200 rounded-2xl p-6 text-center shadow-xl space-y-4">
      <div className="space-y-1">
        <div className="inline-flex p-2.5 bg-orange-100 rounded-full text-orange-600 shadow-inner">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h4 className="text-xl font-extrabold text-amber-950 tracking-tight">प्रीमियम वीआईपी भविष्यवाणियां</h4>
        <p className="text-xs text-amber-800/80 max-w-xs mx-auto font-medium">
          पंडित जी महाराज के गुप्त ग्रह गोचर गणना एल्गोरिदम और 100% अचूक जीवन टाइमलाइंस को तुरंत अनलॉक करें।
        </p>
      </div>

      {/* प्राइसिंग टेबल हुक */}
      <div className="bg-white border border-orange-100 rounded-xl py-4 shadow-sm">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">सीमित समय का ऑफर</span>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-sm font-bold text-amber-950/40 line-through">₹1,999</span>
          <span className="text-3xl font-black text-amber-950">₹{amount}</span>
          <span className="text-xs font-bold bg-orange-600 text-white px-2 py-0.5 rounded-md">75% OFF</span>
        </div>
        <p className="text-[10px] text-amber-700/60 mt-1 font-medium">पूरे 30 दिनों के लिए असीमित एक्सेस</p>
      </div>

      {/* एक्शन बटन */}
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full py-3.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 text-sm tracking-wide"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            सुरक्षित पेमेंट विंडो खुल रही है...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            अभी भाग्य अनलॉक करें (Pay ₹{amount})
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
        <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL सुरक्षित Razorpay पेमेंट
      </div>
    </div>
  );
}

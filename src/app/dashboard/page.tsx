"use client";

import React, { useState, useEffect } from "react";
import AstrologyChat from "@/components/AstrologyChat";
import RemedyTracker from "@/components/RemedyTracker";
import UnlockPremiumButton from "@/components/UnlockPremiumButton";
import { Sparkles, Lock, ShieldCheck, UserCheck } from "lucide-react";

// सिम्युलेटेड एक्टिव यूजर क्रेडेंशियल्स (आप इसे अपने Auth / Session से बदल सकते हैं)
const MOCK_USER_ID = "u_987654321_alpha";
const MOCK_CONVERSATION_ID = "c_123456789_omega";
const PERSONA_NAME = "Acharya Kriti"; // 100% मार्केटिंग ओरिएंटेड पंडित जी नाम

export default function DashboardPage() {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);

  // 1. यूजर का प्रीमियम स्टेटस डेटाबेस (users table) से चेक करें
  const checkPremiumStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/status?userId=${MOCK_USER_ID}`);
      const data = await res.json();
      
      if (data.premiumUntil) {
        const premiumExpiry = new Date(data.premiumUntil);
        const today = new Date();
        
        if (premiumExpiry > today) {
          setIsPremium(true);
          // बचे हुए दिन कैलकुलेट करें
          const diffTime = Math.abs(premiumExpiry.getTime() - today.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDaysRemaining(diffDays);
        } else {
          setIsPremium(false);
        }
      }
    } catch (err) {
      console.error("Error checking premium status:", err);
      setIsPremium(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50/20">
        <Sparkles className="w-8 h-8 text-amber-600 animate-spin" />
        <p className="text-amber-950 font-bold text-sm mt-3">आपकी दिव्य महाकुंडली लोड हो रही है...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-orange-50/20 p-4 md:p-8">
      {/* टॉप नेविगेशन / ब्रांड बार */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between border-b border-amber-100 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-amber-950 flex items-center gap-2">
            🔮 AstroPandit <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">V2.0</span>
          </h1>
          <p className="text-xs text-amber-800 font-medium mt-1">100% सटीक ज्योतिषीय समय-सीमा गणना एल्गोरिदम</p>
        </div>

        {/* स्टेटस बैज (100% Trust Marketing) */}
        <div className="flex items-center gap-3">
          {isPremium ? (
            <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black shadow-md">
              <UserCheck className="w-4 h-4" /> VIP एक्सेस सक्रिय ({daysRemaining} दिन शेष)
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold">
              <Lock className="w-4 h-4 text-amber-700" /> फ्री / गेस्ट मोड सक्रिय
            </div>
          )}
        </div>
      </div>

      {/* मुख्य डैशबोर्ड ग्रिड */}
      <div className="max-w-6xl mx-auto">
        {isPremium ? (
          /* ==========================================
             प्रीमियम व्यू: चैट और डेली टास्क दोनों लाइव
             ========================================== */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* लेफ्ट: 100% कड़क एआई चैट कॉम्पोनेंट */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-orange-600 uppercase tracking-widest block ml-2">लाइव ज्योतिष कंसल्टेशन</span>
              <AstrologyChat userId={MOCK_USER_ID} conversationId={MOCK_CONVERSATION_ID} personaName={PERSONA_NAME} />
            </div>

            {/* राइट: डेली उपाय ट्रैकर विजेट (Retention Loop) */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest block ml-2">भाग्य उदय दैनिक क्रिया</span>
              <RemedyTracker userId={MOCK_USER_ID} />
            </div>
          </div>
        ) : (
          /* ==========================================
             नॉन-प्रीमियम व्यू: हाइपर-कन्वर्शन पेवॉल लॉक स्क्रीन
             ========================================== */
          <div className="flex flex-col items-center justify-center py-12 space-y-8 animate-fadeIn">
            <div className="text-center space-y-2 max-w-lg">
              <h2 className="text-3xl font-black text-amber-950 tracking-tight">आपकी वीआईपी भविष्यवाणियां लॉक हैं!</h2>
              <p className="text-sm text-amber-800/80 font-medium">
                आपके ग्रहों के गोचर, विवाह की सटीक तिथि, और धन लाभ के गुप्त योगों की गणना {PERSONA_NAME} द्वारा पूरी की जा चुकी है। तुरंत अनलॉक करें।
              </p>
            </div>

            {/* पेवॉल बटन कॉम्पोनेंट (Pay to Unlock) */}
            <UnlockPremiumButton userId={MOCK_USER_ID} amount={499} onSuccess={checkPremiumStatus} />

            {/* क्रेडिबिलिटी सोशल प्रूफ फुटप्रिंट */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-amber-800/50">
              <div className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% गोपनीयता गारंटी</div>
              <div className="flex items-center gap-1">✨ 1.2+ लाख संतुष्ट यूज़र्स</div>
              <div className="flex items-center gap-1">🕉️ वैदिक विधि द्वारा सत्यापित</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

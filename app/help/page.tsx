// app/help/page.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Search, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

type FAQ = {
  id: number;
  category: string;
  question: { en: string; hi: string; hinglish: string };
  answer: { en: string; hi: string; hinglish: string };
};

const faqs: FAQ[] = [
  {
    id: 1,
    category: "Wallet & Payment",
    question: {
      en: "How do I add money to my wallet?",
      hi: "मैं अपने वॉलेट में पैसे कैसे जोड़ूं?",
      hinglish: "Main apne wallet mein paise kaise add karu?",
    },
    answer: {
      en: "Go to the Wallet section, click on 'Add Money', enter the amount, and complete the payment via Razorpay (UPI, Card, or Netbanking).",
      hi: "वॉलेट सेक्शन में जाएं, 'Add Money' पर क्लिक करें, राशि डालें और Razorpay (UPI, कार्ड या नेटबैंकिंग) से भुगतान पूरा करें।",
      hinglish: "Wallet section mein jayen, 'Add Money' par click karein, amount daalein aur Razorpay (UPI, Card ya Netbanking) se payment complete karein.",
    },
  },
  {
    id: 2,
    category: "Wallet & Payment",
    question: {
      en: "My money was deducted but not added to the wallet. What to do?",
      hi: "पैसे कट गए लेकिन वॉलेट में नहीं जुड़े। क्या करें?",
      hinglish: "Paise kat gaye but wallet mein nahi aaye. Kya karu?",
    },
    answer: {
      en: "Usually, bank refunds take 3-5 working days. If it doesn't reflect, please raise a support ticket with your transaction ID.",
      hi: "आमतौर पर बैंक रिफंड में 3-5 कार्य दिवस लगते हैं। अगर फिर भी न आए, तो ट्रांजैक्शन आईडी के साथ सपोर्ट टिकट बनाएं।",
      hinglish: "Aam taur par refund aane mein 3-5 working days lagte hain. Agar phir bhi na aaye, toh transaction ID ke sath support ticket banayein.",
    },
  },
  {
    id: 3,
    category: "Kundli & Astrology",
    question: {
      en: "How do I download my Kundli PDF?",
      hi: "मैं अपनी कुंडली PDF कैसे डाउनलोड करूं?",
      hinglish: "Main apni Kundli PDF kaise download karu?",
    },
    answer: {
      en: "After generating your Kundli in the 'My Kundli' section, a 'Download PDF' button will appear at the bottom of the report.",
      hi: "'मेरी कुंडली' सेक्शन में कुंडली बनने के बाद, रिपोर्ट के नीचे 'Download PDF' बटन दिखाई देगा।",
      hinglish: "'My Kundli' section mein kundli banne ke baad, report ke neeche 'Download PDF' button dikhega.",
    },
  },
  {
    id: 4,
    category: "Chat & Astrologers",
    question: {
      en: "The astrologer is not replying to my chat. What should I do?",
      hi: "ज्योतिषी मेरे चैट का जवाब नहीं दे रहे हैं। मुझे क्या करना चाहिए?",
      hinglish: "Astrologer mere chat ka reply nahi kar rahe. Mujhe kya karna chahiye?",
    },
    answer: {
      en: "Astrologers might be busy with other consultations. Please wait for 2-3 minutes. If it disconnects, try starting a new chat.",
      hi: "ज्योतिषी अन्य परामर्शों में व्यस्त हो सकते हैं। कृपया 2-3 मिनट प्रतीक्षा करें। अगर चैट डिस्कनेक्ट हो जाए, तो नई चैट शुरू करें।",
      hinglish: "Astrologer dusre consultations mein busy ho sakte hain. Kripya 2-3 minute wait karein. Agar disconnect ho jaye toh nayi chat start karein.",
    },
  },
  {
    id: 5,
    category: "Account & Login",
    question: {
      en: "I am not receiving the OTP for login.",
      hi: "मुझे लॉगिन के लिए OTP नहीं मिल रहा है।",
      hinglish: "Mujhe login ke liye OTP nahi mil raha.",
    },
    answer: {
      en: "Please check your spam folder or ensure you have network coverage. You can also try logging in using your Email or Google account.",
      hi: "कृपया अपना स्पैम फ़ोल्डर जांचें या सुनिश्चित करें कि आपके पास नेटवर्क है। आप ईमेल या Google अकाउंट से भी लॉगिन कर सकते हैं।",
      hinglish: "Kripya apna spam folder check karein ya network coverage ensure karein. Aap Email ya Google account se bhi login kar sakte hain.",
    },
  },
];

export default function HelpCenterPage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  const isHindi = lang === "hi";
  const isHinglish = lang === "hinglish";

  const t = (hi: string, hing: string, en: string) =>
    isHindi ? hi : isHinglish ? hing : en;

  const pageClass = isDark ? "bg-slate-950 text-violet-50" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#1e293b]" : "border-orange-100 bg-white shadow-sm";
  const inputClass = isDark
    ? "w-full rounded-xl border border-slate-700 bg-slate-900 p-3 pl-10 text-sm focus:border-orange-500 focus:outline-none text-white"
    : "w-full rounded-xl border border-gray-300 bg-white p-3 pl-10 text-sm focus:border-orange-500 focus:outline-none text-gray-900";

  // Search filter logic
  const filteredFaqs = faqs.filter((faq) => {
    const qText = faq.question[lang] || faq.question.en;
    const aText = faq.answer[lang] || faq.answer.en;
    const search = searchQuery.toLowerCase();
    return qText.toLowerCase().includes(search) || aText.toLowerCase().includes(search);
  });

  return (
    <main className={`min-h-screen w-full px-4 pb-20 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-6">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/settings" className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-violet-200" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-base font-black uppercase tracking-tight text-orange-600">
              {t("सहायता केंद्र", "Help Center", "Help Center")}
            </h1>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              {t("आपके सवालों के जवाब", "Aapke sawalon ke jawab", "Answers to your questions")}
            </p>
          </div>
        </header>

        {/* SEARCH BAR */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className={isDark ? "text-slate-400" : "text-gray-400"} />
          </div>
          <input
            type="text"
            placeholder={t("अपनी समस्या खोजें...", "Apni problem search karein...", "Search your issue...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* FAQ LIST */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className={`text-center py-10 rounded-2xl border ${cardClass}`}>
              <p className="text-sm font-semibold">{t("कोई परिणाम नहीं मिला।", "Koi result nahi mila.", "No results found.")}</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <div key={faq.id} className={`overflow-hidden rounded-2xl border transition-all ${cardClass}`}>
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-1 block">
                      {faq.category}
                    </span>
                    <span className="text-sm font-semibold">
                      {faq.question[lang] || faq.question.en}
                    </span>
                  </div>
                  {openId === faq.id ? (
                    <ChevronUp size={18} className="shrink-0 text-orange-500" />
                  ) : (
                    <ChevronDown size={18} className={`shrink-0 ${isDark ? "text-slate-400" : "text-gray-400"}`} />
                  )}
                </button>
                
                {openId === faq.id && (
                  <div className={`border-t px-4 pb-4 pt-3 text-sm leading-relaxed ${isDark ? "border-slate-700 text-slate-300" : "border-gray-100 text-gray-600"}`}>
                    {faq.answer[lang] || faq.answer.en}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* STILL NEED HELP CTA */}
        <div className={`mt-8 rounded-2xl border p-6 text-center ${cardClass}`}>
          <h3 className="text-base font-bold mb-2">
            {t("अभी भी मदद चाहिए?", "Abhi bhi madad chahiye?", "Still need help?")}
          </h3>
          <p className={`text-xs mb-4 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            {t("हमारी सपोर्ट टीम आपकी मदद के लिए तैयार है।", "Hamari support team aapki madad ke liye taiyar hai.", "Our support team is ready to help you.")}
          </p>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-orange-700"
          >
            <MessageCircle size={16} />
            {t("सपोर्ट से संपर्क करें", "Contact Support", "Contact Support")}
          </Link>
        </div>

      </div>
    </main>
  );
}
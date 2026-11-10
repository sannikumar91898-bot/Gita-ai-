// app/panchang/page.tsx
"use client";

import { ArrowLeft, CalendarDays, Sun, Moon, Flame, MessageCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

// 🔥 10 Language Translation Helper
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: { 
      title: "दैनिक पंचांग", 
      today: "आज का पंचांग", 
      tithi: "तिथि", 
      shukla: "शुक्ल पक्ष", 
      rahu: "राहु काल", 
      shubh: "शुभ मुहूर्त", 
      sunset: "सूर्यास्त", 
      warningTitle: "आज राहु काल में कोई शुभ काम न करें।", 
      warningText: "यदि आपको आज कोई बड़ा काम करना है, तो पहले ज्योतिषी से शुभ मुहूर्त की पुष्टि कर लें।", 
      askMuhurat: "शुभ मुहूर्त पूछें",
      muhuratBtn: "ज्योतिषी से पूछें"
    },
    hinglish: { 
      title: "Daily Panchang", 
      today: "Aaj Ka Panchang", 
      tithi: "Tithi", 
      shukla: "Shukla Paksha", 
      rahu: "Rahu Kaal", 
      shubh: "Shubh Muhurat", 
      sunset: "Sunset", 
      warningTitle: "Aaj Rahu Kaal mein koi shubh kaam na karein.", 
      warningText: "Agar aapko aaj koi bada kaam karna hai, toh pehle jyotishi se shubh muhurat confirm kar lein.", 
      askMuhurat: "Shubh Muhurat Puchhein",
      muhuratBtn: "Astrologer se poochhein"
    },
    en: { 
      title: "Daily Panchang", 
      today: "Today's Panchang", 
      tithi: "Tithi", 
      shukla: "Shukla Paksha", 
      rahu: "Rahu Kaal", 
      shubh: "Shubh Muhurat", 
      sunset: "Sunset", 
      warningTitle: "Avoid starting any auspicious work during Rahu Kaal today.", 
      warningText: "If you have an important task today, confirm the auspicious time with an astrologer first.", 
      askMuhurat: "Ask for Shubh Muhurat",
      muhuratBtn: "Ask Astrologer"
    },
    te: { title: "దైనందిన పంచాంగం", today: "నేటి పంచాంగం", tithi: "తిథి", shukla: "శుక్ల పక్షం", rahu: "రాహు కాలం", shubh: "శుభ ముహూర్తం", sunset: "సూర్యాస్తమయం", warningTitle: "ఈరోజు రాహు కాలంలో ఎటువంటి శుభకార్యాలు చేయవద్దు.", warningText: "ఈరోజు ముఖ్యమైన పని ఉంటే, ముందుగా జ్యోతిష్యుడిని సంప్రదించి శుభ ముహూర్తాన్ని నిర్ధారించుకోండి.", askMuhurat: "శుభ ముహూర్తం అడగండి", muhuratBtn: "జ్యోతిష్యుడిని అడగండి" },
    ta: { title: "தினசரி பஞ்சாங்கம்", today: "இன்றைய பஞ்சாங்கம்", tithi: "திதி", shukla: "சுக்ல பக்ஷம்", rahu: "ராகு காலம்", shubh: "சுப முகூர்த்தம்", sunset: "சூரிய அஸ்தமனம்", warningTitle: "இன்று ராகு காலத்தில் எந்த சுப காரியங்களையும் செய்ய வேண்டாம்.", warningText: "இன்று முக்கியமான வேலை இருந்தால், முதலில் ஜோதிடரை அணுகி சுப முகூர்த்தத்தை உறுதிப்படுத்தவும்.", askMuhurat: "சுப முகூர்த்தம் கேளுங்கள்", muhuratBtn: "ஜோதிடரிடம் கேளுங்கள்" },
    kn: { title: "ದೈನಂದಿನ ಪಂಚಾಂಗ", today: "ಇಂದಿನ ಪಂಚಾಂಗ", tithi: "ತಿಥಿ", shukla: "ಶುಕ್ಲ ಪಕ್ಷ", rahu: "ರಾಹು ಕಾಲ", shubh: "ಶುಭ ಮುಹೂರ್ತ", sunset: "ಸೂರ್ಯಾಸ್ತ", warningTitle: "ಇಂದು ರಾಹು ಕಾಲದಲ್ಲಿ ಯಾವುದೇ ಶುಭ ಕಾರ್ಯ ಮಾಡಬೇಡಿ.", warningText: "ಇಂದು ಪ್ರಮುಖ ಕೆಲಸವಿದ್ದರೆ, ಮೊದಲು ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ ಶುಭ ಮುಹೂರ್ತವನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.", askMuhurat: "ಶುಭ ಮುಹೂರ್ತ ಕೇಳಿ", muhuratBtn: "ಜ್ಯೋತಿಷಿಯನ್ನು ಕೇಳಿ" },
    bn: { title: "দৈনিক পঞ্জিকা", today: "আজকের পঞ্জিকা", tithi: "তিথি", shukla: "শুক্ল পক্ষ", rahu: "রাহু কাল", shubh: "শুভ মুহূর্ত", sunset: "সূর্যাস্ত", warningTitle: "আজ রাহু কালে কোনো শুভ কাজ করবেন না।", warningText: "আজ যদি কোনো গুরুত্বপূর্ণ কাজ থাকে, তবে প্রথমে জ্যোতিষীর সাথে পরামর্শ করে শুভ মুহূর্ত নিশ্চিত করুন।", askMuhurat: "শুভ মুহূর্ত জিজ্ঞাসা করুন", muhuratBtn: "জ্যোতিষীকে জিজ্ঞাসা করুন" },
    mr: { title: "दैनिक पंचांग", today: "आजचे पंचांग", tithi: "तिथी", shukla: "शुक्ल पक्ष", rahu: "राहू काळ", shubh: "शुभ मुहूर्त", sunset: "सूर्यास्त", warningTitle: "आज राहू काळात कोणतेही शुभ कार्य करू नका.", warningText: "आज महत्त्वाचे काम असल्यास, प्रथम ज्योतिषाशी सल्ला घेऊन शुभ मुहूर्त निश्चित करा.", askMuhurat: "शुभ मुहूर्त विचारा", muhuratBtn: "ज्योतिषाला विचारा" },
    gu: { title: "દૈનિક પંચાંગ", today: "આજનું પંચાંગ", tithi: "તિથિ", shukla: "શુક્લ પક્ષ", rahu: "રાહુ કાળ", shubh: "શુભ મુહૂર્ત", sunset: "સૂર્યાસ્ત", warningTitle: "આજે રાહુ કાળમાં કોઈ શુભ કાર્ય ન કરો.", warningText: "જો આજે કોઈ મહત્વનું કામ હોય, તો પહેલા જ્યોતિષીની સલાહ લઈને શુભ મુહૂર્ત નક્કી કરો.", askMuhurat: "શુભ મુહૂર્ત પૂછો", muhuratBtn: "જ્યોતિષીને પૂછો" },
    ml: { title: "ദൈനംദിന പഞ്ചാംഗം", today: "ഇന്നത്തെ പഞ്ചാംഗം", tithi: "തിഥി", shukla: "ശുക്ല പക്ഷം", rahu: "രാഹുകാലം", shubh: "ശുഭ മുഹൂർത്തം", sunset: "സൂര്യാസ്തമയം", warningTitle: "ഇന്ന് രാഹുകാലത്ത് ശുഭകാര്യങ്ങൾ ഒഴിവാക്കുക.", warningText: "ഇന്ന് പ്രധാനപ്പെട്ട ജോലിയുണ്ടെങ്കിൽ, ആദ്യം ജ്യോതിഷിയെ സമീപിച്ച് ശുഭ മുഹൂർത്തം ഉറപ്പാക്കുക.", askMuhurat: "ശുഭ മുഹൂർത്തം ചോദിക്കുക", muhuratBtn: "ജ്യോതിഷിയോട് ചോദിക്കുക" },
  };
  return ui[lang]?.[key] || ui["en"][key];
};

export default function PanchangPage() {
  const { theme, lang } = useApp();
  const isDark = theme === "dark";

  // Helper to get localized text
  const t = (key: string) => getUIText(lang, key);

  const pageClass = isDark ? "bg-[#0B0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151E2E] shadow-xl" : "border-orange-100 bg-white shadow-xl";
  const innerCardClass = isDark ? "border-slate-700 bg-slate-800/50" : "border-orange-100 bg-orange-50";

  return (
    <main className={`min-h-screen w-full px-4 pb-40 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2 transition-colors ${isDark ? "bg-slate-800 text-orange-400 hover:bg-slate-700" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}>
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-black uppercase tracking-tight text-orange-500">{t("title")}</h1>
          </div>
        </header>

        <section className={`rounded-3xl border p-5 sm:p-6 ${cardClass}`}>
          <h2 className="text-lg font-black mb-5 flex items-center gap-2 text-orange-500">
            <CalendarDays size={22} /> {t("today")}
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-2xl border p-4 transition-all hover:scale-[1.02] ${innerCardClass}`}>
              <p className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("tithi")}</p>
              <p className={`text-sm font-black mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{t("shukla")}</p>
            </div>
            
            <div className={`rounded-2xl border p-4 transition-all hover:scale-[1.02] ${innerCardClass}`}>
              <p className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("rahu")}</p>
              <p className="text-sm font-black text-rose-500 mt-1">12:00 PM - 1:30 PM</p>
            </div>
            
            <div className={`rounded-2xl border p-4 transition-all hover:scale-[1.02] ${innerCardClass}`}>
              <p className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("shubh")}</p>
              <p className="text-sm font-black text-emerald-500 mt-1">10:15 AM - 11:45 AM</p>
            </div>
            
            <div className={`rounded-2xl border p-4 transition-all hover:scale-[1.02] ${innerCardClass}`}>
              <p className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("sunset")}</p>
              <p className={`text-sm font-black mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>06:15 PM</p>
            </div>
          </div>

          {/* PREMIUM WARNING BOX */}
          <div className={`mt-6 rounded-2xl border p-5 relative overflow-hidden ${isDark ? "border-rose-900/50 bg-rose-950/20" : "border-red-200 bg-red-50"}`}>
            <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
            <p className={`text-sm font-black mb-1.5 flex items-center gap-2 ${isDark ? "text-rose-300" : "text-red-800"}`}>
              <AlertCircle size={16} /> {t("warningTitle")}
            </p>
            <p className={`text-xs font-medium leading-relaxed ${isDark ? "text-rose-200/80" : "text-red-700"}`}>
              {t("warningText")}
            </p>
          </div>

          {/* CTA BUTTON */}
          <Link 
            href="/chat" 
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle size={18} /> {t("askMuhurat")}
          </Link>
        </section>
      </div>
    </main>
  );
}
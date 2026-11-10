// app/panchang/page.tsx
"use client";

import { ArrowLeft, CalendarDays, Sun, Moon, Flame, MessageCircle, AlertCircle, Home, User, Crown } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

// 🔥 10 Language Translation Helper
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: { 
      title: "दैनिक पंचांग", today: "आज का पंचांग", tithi: "तिथि", shukla: "शुक्ल पक्ष", 
      rahu: "राहु काल", shubh: "शुभ मुहूर्त", sunset: "सूर्यास्त", 
      warningTitle: "आज राहु काल में कोई शुभ काम न करें।", 
      warningText: "यदि आपको आज कोई बड़ा काम करना है, तो पहले ज्योतिषी से शुभ मुहूर्त की पुष्टि कर लें।", 
      askMuhurat: "शुभ मुहूर्त पूछें", muhuratBtn: "ज्योतिषी से पूछें",
      bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "अपने नाम करें – पहली चैट FREE",
      home: "होम", chat: "चैट", daily: "राशिफल", profile: "प्रोफाइल"
    },
    hinglish: { 
      title: "Daily Panchang", today: "Aaj Ka Panchang", tithi: "Tithi", shukla: "Shukla Paksha", 
      rahu: "Rahu Kaal", shubh: "Shubh Muhurat", sunset: "Sunset", 
      warningTitle: "Aaj Rahu Kaal mein koi shubh kaam na karein.", 
      warningText: "Agar aapko aaj koi bada kaam karna hai, toh pehle jyotishi se shubh muhurat confirm kar lein.", 
      askMuhurat: "Shubh Muhurat Puchhein", muhuratBtn: "Astrologer se poochhein",
      bannerTitle: "Astrologer - 24x7 Available", bannerSub: "Make them yours – First Chat FREE",
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile"
    },
    en: { 
      title: "Daily Panchang", today: "Today's Panchang", tithi: "Tithi", shukla: "Shukla Paksha", 
      rahu: "Rahu Kaal", shubh: "Shubh Muhurat", sunset: "Sunset", 
      warningTitle: "Avoid starting any auspicious work during Rahu Kaal today.", 
      warningText: "If you have an important task today, confirm the auspicious time with an astrologer first.", 
      askMuhurat: "Ask for Shubh Muhurat", muhuratBtn: "Ask Astrologer",
      bannerTitle: "Astrologer - 24x7 Available", bannerSub: "Make them yours – First Chat FREE",
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile"
    },
    te: { title: "దైనందిన పంచాంగం", today: "నేటి పంచాంగం", tithi: "తిథి", shukla: "శుక్ల పక్షం", rahu: "రాహు కాలం", shubh: "శుభ ముహూర్తం", sunset: "సూర్యాస్తమయం", warningTitle: "ఈరోజు రాహు కాలంలో ఎటువంటి శుభకార్యాలు చేయవద్దు.", warningText: "ఈరోజు ముఖ్యమైన పని ఉంటే, ముందుగా జ్యోతిష్యుడిని సంప్రదించి శుభ ముహూర్తాన్ని నిర్ధారించుకోండి.", askMuhurat: "శుభ ముహూర్తం అడగండి", muhuratBtn: "జ్యోతిష్యుడిని అడగండి", bannerTitle: "జ్యోతిష్యుడు - 24x7 అందుబాటులో", bannerSub: "ఇప్పుడే మాట్లాడండి — మొదటి చాట్ ఉచితం", home: "హోమ్", chat: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్" },
    ta: { title: "தினசரி பஞ்சாங்கம்", today: "இன்றைய பஞ்சாங்கம்", tithi: "திதி", shukla: "சுக்ல பக்ஷம்", rahu: "ராகு காலம்", shubh: "சுப முகூர்த்தம்", sunset: "சூரிய அஸ்தமனம்", warningTitle: "இன்று ராகு காலத்தில் எந்த சுப காரியங்களையும் செய்ய வேண்டாம்.", warningText: "இன்று முக்கியமான வேலை இருந்தால், முதலில் ஜோதிடரை அணுகி சுப முகூர்த்தத்தை உறுதிப்படுத்தவும்.", askMuhurat: "சுப முகூர்த்தம் கேளுங்கள்", muhuratBtn: "ஜோதிடரிடம் கேளுங்கள்", bannerTitle: "ஜோதிடர் - 24x7 கிடைக்கும்", bannerSub: "இப்போது பேசுங்கள் — முதல் அரட்டை இலவசம்", home: "முகப்பு", chat: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்" },
    kn: { title: "ದೈನಂದಿನ ಪಂಚಾಂಗ", today: "ಇಂದಿನ ಪಂಚಾಂಗ", tithi: "ತಿಥಿ", shukla: "ಶುಕ್ಲ ಪಕ್ಷ", rahu: "ರಾಹು ಕಾಲ", shubh: "ಶುಭ ಮುಹೂರ್ತ", sunset: "ಸೂರ್ಯಾಸ್ತ", warningTitle: "ಇಂದು ರಾಹು ಕಾಲದಲ್ಲಿ ಯಾವುದೇ ಶುಭ ಕಾರ್ಯ ಮಾಡಬೇಡಿ.", warningText: "ಇಂದು ಪ್ರಮುಖ ಕೆಲಸವಿದ್ದರೆ, ಮೊದಲು ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ ಶುಭ ಮುಹೂರ್ತವನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.", askMuhurat: "ಶುಭ ಮುಹೂರ್ತ ಕೇಳಿ", muhuratBtn: "ಜ್ಯೋತಿಷಿಯನ್ನು ಕೇಳಿ", bannerTitle: "ಜ್ಯೋತಿಷಿ - 24x7 ಲಭ್ಯವಿದೆ", bannerSub: "ಈಗ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ", home: "ಮುಖಪುಟ", chat: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್" },
    bn: { title: "দৈনিক পঞ্জিকা", today: "আজকের পঞ্জিকা", tithi: "তিথি", shukla: "শুক্ল পক্ষ", rahu: "রাহু কাল", shubh: "শুভ মুহূর্ত", sunset: "সূর্যাস্ত", warningTitle: "আজ রাহু কালে কোনো শুভ কাজ করবেন না।", warningText: "আজ যদি কোনো গুরুত্বপূর্ণ কাজ থাকে, তবে প্রথমে জ্যোতিষীর সাথে পরামর্শ করে শুভ মুহূর্ত নিশ্চিত করুন।", askMuhurat: "শুভ মুহূর্ত জিজ্ঞাসা করুন", muhuratBtn: "জ্যোতিষীকে জিজ্ঞাসা করুন", bannerTitle: "জ্যোতিষী - 24x7 উপলব্ধ", bannerSub: "এখনই কথা বলুন — প্রথম চ্যাট ফ্রি", home: "হোম", chat: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল" },
    mr: { title: "दैनिक पंचांग", today: "आजचे पंचांग", tithi: "तिथी", shukla: "शुक्ल पक्ष", rahu: "राहू काळ", shubh: "शुभ मुहूर्त", sunset: "सूर्यास्त", warningTitle: "आज राहू काळात कोणतेही शुभ कार्य करू नका.", warningText: "आज महत्त्वाचे काम असल्यास, प्रथम ज्योतिषाशी सल्ला घेऊन शुभ मुहूर्त निश्चित करा.", askMuhurat: "शुभ मुहूर्त विचारा", muhuratBtn: "ज्योतिषाला विचारा", bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "आता बोला — पहिली चॅट मोफत", home: "होम", chat: "चॅट", daily: "दैनिक", profile: "प्रोफाइल" },
    gu: { title: "દૈનિક પંચાંગ", today: "આજનું પંચાંગ", tithi: "તિથિ", shukla: "શુક્લ પક્ષ", rahu: "રાહુ કાળ", shubh: "શુભ મુહૂર્ત", sunset: "સૂર્યાસ્ત", warningTitle: "આજે રાહુ કાળમાં કોઈ શુભ કાર્ય ન કરો.", warningText: "જો આજે કોઈ મહત્વનું કામ હોય, તો પહેલા જ્યોતિષીની સલાહ લઈને શુભ મુહૂર્ત નક્કી કરો.", askMuhurat: "શુભ મુહૂર્ત પૂછો", muhuratBtn: "જ્યોતિષીને પૂછો", bannerTitle: "જ્યોતિષી - 24x7 ઉપલબ્ધ", bannerSub: "હમણાં વાત કરો — પ્રથમ ચેટ મફત", home: "હોમ", chat: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ" },
    ml: { title: "ദൈനംദിന പഞ്ചാംഗം", today: "ഇന്നത്തെ പഞ്ചാംഗം", tithi: "തിഥി", shukla: "ശുക്ല പക്ഷം", rahu: "രാഹുകാലം", shubh: "ശുഭ മുഹൂർത്തം", sunset: "സൂര്യാസ്തമയം", warningTitle: "ഇന്ന് രാഹുകാലത്ത് ശുഭകാര്യങ്ങൾ ഒഴിവാക്കുക.", warningText: "ഇന്ന് പ്രധാനപ്പെട്ട ജോലിയുണ്ടെങ്കിൽ, ആദ്യം ജ്യോതിഷിയെ സമീപിച്ച് ശുഭ മുഹൂർത്തം ഉറപ്പാക്കുക.", askMuhurat: "ശുഭ മുഹൂർത്തം ചോദിക്കുക", muhuratBtn: "ജ്യോതിഷിയോട് ചോദിക്കുക", bannerTitle: "ജ്യോതിഷി - 24x7 ലഭ്യമാണ്", bannerSub: "ഇപ്പോൾ സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം", home: "ഹോം", chat: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ" },
  };
  return ui[lang]?.[key] || ui["en"][key] || ui["hi"][key];
};

export default function PanchangPage() {
  const { theme, lang } = useApp();
  const isDark = theme === "dark";

  // Helper to get localized text
  const t = (key: string) => getUIText(lang, key);

  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c] shadow-lg" : "border-orange-100 bg-white shadow-xl";
  const innerCardClass = isDark ? "border-slate-800 bg-[#0A0F19]" : "border-orange-100 bg-orange-50";

  return (
    // 🔥 Full Screen Layout (min-h-[100dvh] aur pb-36 taaki bottom nav ke piche content na chhupe)
    <main className={`min-h-[100dvh] w-full pb-36 ${pageClass} font-sans`}>
      
      {/* Container - w-full aur px-3 kiya gaya hai */}
      <div className="w-full px-3 pt-4 space-y-5">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2.5 transition-colors ${isDark ? "bg-[#0A0F19] text-slate-300" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[17px] font-black uppercase tracking-tight text-[#ff6b00]">{t("title")}</h1>
          </div>
        </header>

        {/* MAIN CARD */}
        <section className={`rounded-[1.5rem] border p-4 sm:p-5 ${cardClass}`}>
          
          <h2 className="text-[18px] font-black mb-5 flex items-center gap-2 text-[#ff6b00]">
            <CalendarDays size={22} /> {t("today")}
          </h2>
          
          {/* GRID - Lambai aur Chaurai badhai gayi hai */}
          <div className="grid grid-cols-2 gap-3.5">
            
            {/* Tithi */}
            <div className={`rounded-2xl border p-4 sm:p-5 transition-all hover:scale-[1.02] flex flex-col justify-center gap-2 ${innerCardClass}`}>
              <div className="flex items-center gap-2">
                <Moon size={16} className="text-[#ff6b00]" />
                <p className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("tithi")}</p>
              </div>
              <p className={`text-[16px] font-black mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{t("shukla")}</p>
            </div>
            
            {/* Rahu Kaal */}
            <div className={`rounded-2xl border p-4 sm:p-5 transition-all hover:scale-[1.02] flex flex-col justify-center gap-2 ${innerCardClass}`}>
               <div className="flex items-center gap-2">
                <Flame size={16} className="text-rose-500" />
                <p className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("rahu")}</p>
              </div>
              <p className="text-[15px] font-black text-rose-500 mt-1">12:00 PM - 1:30 PM</p>
            </div>
            
            {/* Shubh Muhurat */}
            <div className={`rounded-2xl border p-4 sm:p-5 transition-all hover:scale-[1.02] flex flex-col justify-center gap-2 ${innerCardClass}`}>
               <div className="flex items-center gap-2">
                <Sun size={16} className="text-emerald-500" />
                <p className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("shubh")}</p>
              </div>
              <p className="text-[15px] font-black text-emerald-500 mt-1">10:15 AM - 11:45 AM</p>
            </div>
            
            {/* Sunset */}
            <div className={`rounded-2xl border p-4 sm:p-5 transition-all hover:scale-[1.02] flex flex-col justify-center gap-2 ${innerCardClass}`}>
               <div className="flex items-center gap-2">
                <Sun size={16} className="text-amber-500" />
                <p className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("sunset")}</p>
              </div>
              <p className={`text-[16px] font-black mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>06:15 PM</p>
            </div>
          </div>

          {/* PREMIUM WARNING BOX */}
          <div className={`mt-6 rounded-2xl border p-4 sm:p-5 relative overflow-hidden ${isDark ? "border-rose-500/30 bg-[#2a151a]" : "border-red-200 bg-red-50"}`}>
            <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
            <p className={`text-[13px] font-black mb-1.5 flex items-center gap-2 ${isDark ? "text-rose-300" : "text-red-800"}`}>
              <AlertCircle size={18} /> {t("warningTitle")}
            </p>
            <p className={`text-[12.5px] font-medium leading-relaxed ${isDark ? "text-rose-200/80" : "text-red-700"}`}>
              {t("warningText")}
            </p>
          </div>

          {/* CTA BUTTON */}
          <Link 
            href="/chat" 
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] px-4 py-4 text-[15px] font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle size={18} /> {t("askMuhurat")}
          </Link>

        </section>
      </div>

      {/* 🔥 STICKY BOTTOM BANNER & NAVIGATION (Wapas Joda Gaya Hai) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col w-full">
        
        {/* Pink Banner */}
        <div className="bg-gradient-to-r from-[#d81b60] via-[#e91e63] to-[#c2185b] px-4 py-2.5 flex items-center justify-between shadow-[0_-4px_20px_rgba(233,30,99,0.3)]">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full border border-white/50 flex items-center justify-center shrink-0 bg-white/10">
               <Crown size={16} className="text-white" />
             </div>
             <div>
               <p className="text-[11px] font-bold text-white leading-tight">{t("bannerTitle")}</p>
               <p className="text-[13px] font-extrabold text-white leading-tight">{t("bannerSub")}</p>
             </div>
          </div>
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-md">
               <Crown size={16} className="text-[#d81b60]" fill="#d81b60" />
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <nav className="bg-[#0a0f19] border-t border-slate-800 flex justify-around items-center pt-2.5 pb-5 px-2 w-full">
          <Link href="/" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
            <Home size={22} />
            <span className="text-[11px] font-medium">{t("home")}</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
            <MessageCircle size={22} />
            <span className="text-[11px] font-medium">{t("chat")}</span>
          </Link>
          <Link href="/daily" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
            <Sun size={22} />
            <span className="text-[11px] font-medium">{t("daily")}</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors">
            <User size={22} />
            <span className="text-[11px] font-medium">{t("profile")}</span>
          </Link>
        </nav>
      </div>

    </main>
  );
}
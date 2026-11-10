// app/horoscope/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Sun, Phone, TriangleAlert, Sparkles, MessageCircle, Star, RefreshCw, Palette, Hash, Heart
} from "lucide-react";
import { useApp } from "../Providers";

// 🔥 10 Language Translation Helper (UI Text)
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: { title: "दैनिक राशिफल", subtitle: "दैनिक ज्योतिषीय मार्गदर्शन", heroTitle: "दैनिक राशिफल", heroSub: "अपनी राशि चुनें और आज का मार्गदर्शन पाएं।", warning: "🌸 यह सामान्य रीडिंग है। आपकी असली कहानी आपकी व्यक्तिगत कुंडली में छिपी है — हमारी महिला ज्योतिषी से बात करें।", chooseSign: "अपनी राशि चुनें", viewBtn: "राशिफल देखें", yourZodiac: "आपकी राशि", guidance: "आज का मार्गदर्शन", luckyColor: "शुभ रंग", luckyNumber: "शुभ अंक", affirmation: "दैनिक संकल्प", gentleNote: "एक कोमल संदेश", noteDesc: "यह सामान्य रीडिंग है। आपकी असली कहानी आपकी व्यक्तिगत कुंडली में है — हमारी महिला ज्योतिषी से बात करें।", cta: "ज्योतिषी से बात करें — पहली बात FREE", stickyTitle: "ज्योतिषी • 24x7 उपलब्ध", stickySub: "अभी बात करें — पहली बातचीत FREE", chat: "चैट" },
    hinglish: { title: "Daily Horoscope", subtitle: "Daily Astrological Guidance", heroTitle: "Daily Horoscope", heroSub: "Select your zodiac sign and explore today's guidance.", warning: "🌸 This is a general reading. The real story is hidden in your personal chart — chat with our Female Astrologer.", chooseSign: "Choose Your Zodiac Sign", viewBtn: "View Horoscope", yourZodiac: "Your Zodiac", guidance: "Today's Guidance", luckyColor: "Lucky Colour", luckyNumber: "Lucky Number", affirmation: "Daily Affirmation", gentleNote: "A Gentle Note", noteDesc: "This is a general reading. Your real story lives in your personal chart — chat with our Female Astrologer.", cta: "Talk to Astrologer — First chat FREE", stickyTitle: "Astrologer • 24x7 Available", stickySub: "Talk now — First chat FREE", chat: "Chat" },
    en: { title: "Daily Horoscope", subtitle: "Daily Astrological Guidance", heroTitle: "Daily Horoscope", heroSub: "Select your zodiac sign and explore today's guidance.", warning: "🌸 This is a general reading. The real story is hidden in your personal chart — chat with our Female Astrologer.", chooseSign: "Choose Your Zodiac Sign", viewBtn: "View Horoscope", yourZodiac: "Your Zodiac", guidance: "Today's Guidance", luckyColor: "Lucky Colour", luckyNumber: "Lucky Number", affirmation: "Daily Affirmation", gentleNote: "A Gentle Note", noteDesc: "This is a general reading. Your real story lives in your personal chart — chat with our Female Astrologer.", cta: "Talk to Astrologer — First chat FREE", stickyTitle: "Astrologer • 24x7 Available", stickySub: "Talk now — First chat FREE", chat: "Chat" },
    te: { title: "దైనందిన జాతకం", subtitle: "రోజువారీ జ్యోతిష్య మార్గదర్శకత్వం", heroTitle: "దైనందిన జాతకం", heroSub: "మీ రాశి చిహ్నాన్ని ఎంచుకోండి మరియు నేటి మార్గదర్శకత్వాన్ని అన్వేషించండి.", warning: "🌸 ఇది సాధారణ పఠనం. నిజమైన కథ మీ వ్యక్తిగత జాతకంలో దాగి ఉంది — మా మహిళా జ్యోతిష్యురాలితో చాట్ చేయండి.", chooseSign: "మీ రాశి చిహ్నాన్ని ఎంచుకోండి", viewBtn: "జాతకం చూడండి", yourZodiac: "మీ రాశి", guidance: "నేటి మార్గదర్శకత్వం", luckyColor: "అదృష్ట రంగు", luckyNumber: "అదృష్ట సంఖ్య", affirmation: "దైనందిన సంకల్పం", gentleNote: "ఒక సున్నితమైన గమనిక", noteDesc: "ఇది సాధారణ పఠనం. నిజమైన కథ మీ వ్యక్తిగత జాతకంలో ఉంది — మా మహిళా జ్యోతిష్యురాలితో చాట్ చేయండి.", cta: "జ్యోతిష్యుడితో మాట్లాడండి — మొదటి చాట్ ఉచితం", stickyTitle: "జ్యోతిష్యుడు • 24x7 అందుబాటులో", stickySub: "ఇప్పుడే మాట్లాడండి — మొదటి చాట్ ఉచితం", chat: "చాట్" },
    ta: { title: "தினசரி ராசிபலன்", subtitle: "தினசரி ஜோதிட வழிகாட்டுதல்", heroTitle: "தினசரி ராசிபலன்", heroSub: "உங்கள் ராசி அடையாளத்தைத் தேர்ந்தெடுத்து இன்றைய வழிகாட்டுதலை அறியுங்கள்.", warning: "🌸 இது பொதுவான வாசிப்பு. உண்மையான கதை உங்கள் தனிப்பட்ட ஜாதகத்தில் மறைந்துள்ளது — எங்கள் பெண் ஜோதிடருடன் அரட்டையடிக்கவும்.", chooseSign: "உங்கள் ராசி அடையாளத்தைத் தேர்ந்தெடுக்கவும்", viewBtn: "ராசிபலனைப் பார்க்க", yourZodiac: "உங்கள் ராசி", guidance: "இன்றைய வழிகாட்டுதல்", luckyColor: "அதிர்ஷ்ட நிறம்", luckyNumber: "அதிர்ஷ்ட எண்", affirmation: "தினசரி உறுதிமொழி", gentleNote: "ஒரு மென்மையான குறிப்பு", noteDesc: "இது பொதுவான வாசிப்பு. உண்மையான கதை உங்கள் தனிப்பட்ட ஜாதகத்தில் உள்ளது — எங்கள் பெண் ஜோதிடருடன் அரட்டையடிக்கவும்.", cta: "ஜோதிடரிடம் பேசுங்கள் — முதல் அரட்டை இலவசம்", stickyTitle: "ஜோதிடர் • 24x7 கிடைக்கும்", stickySub: "இப்போது பேசுங்கள் — முதல் அரட்டை இலவசம்", chat: "அரட்டை" },
    kn: { title: "ದೈನಂದಿನ ರಾಶಿಫಲ", subtitle: "ದೈನಂದಿನ ಜ್ಯೋತಿಷ್ಯ ಮಾರ್ಗದರ್ಶನ", heroTitle: "ದೈನಂದಿನ ರಾಶಿಫಲ", heroSub: "ನಿಮ್ಮ ರಾಶಿ ಚಿಹ್ನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಇಂದಿನ ಮಾರ್ಗದರ್ಶನವನ್ನು ಅನ್ವೇಷಿಸಿ.", warning: "🌸 ಇದು ಸಾಮಾನ್ಯ ಓದುವಿಕೆ. ನಿಜವಾದ ಕಥೆ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಕುಂಡಲಿಯಲ್ಲಿ ಅಡಗಿದೆ — ನಮ್ಮ ಮಹಿಳಾ ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ.", chooseSign: "ನಿಮ್ಮ ರಾಶಿ ಚಿಹ್ನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", viewBtn: "ರಾಶಿಫಲ ನೋಡಿ", yourZodiac: "ನಿಮ್ಮ ರಾಶಿ", guidance: "ಇಂದಿನ ಮಾರ್ಗದರ್ಶನ", luckyColor: "ಅದೃಷ್ಟದ ಬಣ್ಣ", luckyNumber: "ಅದೃಷ್ಟದ ಸಂಖ್ಯೆ", affirmation: "ದೈನಂದಿನ ಸಂಕಲ್ಪ", gentleNote: "ಒಂದು ಸೌಮ್ಯ ಟಿಪ್ಪಣಿ", noteDesc: "ಇದು ಸಾಮಾನ್ಯ ಓದುವಿಕೆ. ನಿಜವಾದ ಕಥೆ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಕುಂಡಲಿಯಲ್ಲಿದೆ — ನಮ್ಮ ಮಹಿಳಾ ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ.", cta: "ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ", stickyTitle: "ಜ್ಯೋತಿಷಿ • 24x7 ಲಭ್ಯವಿದೆ", stickySub: "ಈಗ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ", chat: "ಚಾಟ್" },
    bn: { title: "দৈনিক রাশিফল", subtitle: "দৈনিক জ্যোতিষ নির্দেশিকা", heroTitle: "দৈনিক রাশিফল", heroSub: "আপনার রাশি চিহ্ন চয়ন করুন এবং আজকের নির্দেশিকা অন্বেষণ করুন।", warning: "🌸 এটি একটি সাধারণ পাঠ। আসল গল্প আপনার ব্যক্তিগত কুণ্ডলীতে লুকিয়ে আছে — আমাদের মহিলা জ্যোতিষীর সাথে চ্যাট করুন।", chooseSign: "আপনার রাশি চিহ্ন চয়ন করুন", viewBtn: "রাশিফল দেখুন", yourZodiac: "আপনার রাশি", guidance: "আজকের নির্দেশিকা", luckyColor: "শুভ রঙ", luckyNumber: "শুভ সংখ্যা", affirmation: "দৈনিক প্রতিজ্ঞা", gentleNote: "একটি মৃদু নোট", noteDesc: "এটি একটি সাধারণ পাঠ। আসল গল্প আপনার ব্যক্তিগত কুণ্ডলীতে রয়েছে — আমাদের মহিলা জ্যোতিষীর সাথে চ্যাট করুন।", cta: "জ্যোতিষীর সাথে কথা বলুন — প্রথম চ্যাট ফ্রি", stickyTitle: "জ্যোতিষী • 24x7 উপলব্ধ", stickySub: "এখনই কথা বলুন — প্রথম চ্যাট ফ্রি", chat: "চ্যাট" },
    mr: { title: "दैनिक राशीभविष्य", subtitle: "दैनिक ज्योतिष मार्गदर्शन", heroTitle: "दैनिक राशीभविष्य", heroSub: "तुमची राशी निवडा आणि आजचे मार्गदर्शन एक्सप्लोर करा.", warning: "🌸 हे सामान्य वाचन आहे. खरी गोष्ट तुमच्या वैयक्तिक कुंडलीत लपलेली आहे — आमच्या महिला ज्योतिषाशी बोला.", chooseSign: "तुमची राशी निवडा", viewBtn: "राशीभविष्य पहा", yourZodiac: "तुमची राशी", guidance: "आजचे मार्गदर्शन", luckyColor: "शुभ रंग", luckyNumber: "शुभ अंक", affirmation: "दैनिक संकल्प", gentleNote: "एक सौम्य सूचना", noteDesc: "हे सामान्य वाचन आहे. खरी गोष्ट तुमच्या वैयक्तिक कुंडलीत आहे — आमच्या महिला ज्योतिषाशी बोला.", cta: "ज्योतिषाशी बोला — पहिली चॅट मोफत", stickyTitle: "ज्योतिषी • 24x7 उपलब्ध", stickySub: "आता बोला — पहिली चॅट मोफत", chat: "चॅट" },
    gu: { title: "દૈનિક રાશિફળ", subtitle: "દૈનિક જ્યોતિષ માર્ગદર્શન", heroTitle: "દૈનિક રાશિફળ", heroSub: "તમારી રાશિ પસંદ કરો અને આજનું માર્ગદર્શન શોધો.", warning: "🌸 આ સામાન્ય વાંચન છે. સાચી વાર્તા તમારી વ્યક્તિગત કુંડળીમાં છુપાયેલી છે — અમારી મહિલા જ્યોતિષી સાથે ચેટ કરો.", chooseSign: "તમારી રાશિ પસંદ કરો", viewBtn: "રાશિફળ જુઓ", yourZodiac: "તમારી રાશિ", guidance: "આજનું માર્ગદર્શન", luckyColor: "શુભ રંગ", luckyNumber: "શુભ અંક", affirmation: "દૈનિક સંકલ્પ", gentleNote: "એક નમ્ર નોંધ", noteDesc: "આ સામાન્ય વાંચન છે. સાચી વાર્તા તમારી વ્યક્તિગત કુંડળીમાં છે — અમારી મહિલા જ્યોતિષી સાથે ચેટ કરો.", cta: "જ્યોતિષી સાથે વાત કરો — પ્રથમ ચેટ મફત", stickyTitle: "જ્યોતિષી • 24x7 ઉપલબ્ધ", stickySub: "હમણાં વાત કરો — પ્રથમ ચેટ મફત", chat: "ચેટ" },
    ml: { title: "ദൈനംദിന രാശിഫലം", subtitle: "ദൈനംദിന ജ്യോതിഷ മാർഗ്ഗനിർദ്ദേശം", heroTitle: "ദൈനംദിന രാശിഫലം", heroSub: "നിങ്ങളുടെ രാശി അടയാളം തിരഞ്ഞെടുത്ത് ഇന്നത്തെ മാർഗ്ഗനിർദ്ദേശം കണ്ടെത്തുക.", warning: "🌸 ഇതൊരു പൊതുവായ വായനയാണ്. യഥാർത്ഥ കഥ നിങ്ങളുടെ വ്യക്തിഗത ജാതകത്തിൽ ഒളിഞ്ഞിരിക്കുന്നു — ഞങ്ങളുടെ വനിതാ ജ്യോതിഷിയുമായി സംസാരിക്കുക.", chooseSign: "നിങ്ങളുടെ രാശി അടയാളം തിരഞ്ഞെടുക്കുക", viewBtn: "രാശിഫലം കാണുക", yourZodiac: "നിങ്ങളുടെ രാശി", guidance: "ഇന്നത്തെ മാർഗ്ഗനിർദ്ദേശം", luckyColor: "ഭാഗ്യ നിറം", luckyNumber: "ഭാഗ്യ നമ്പർ", affirmation: "ദൈനംദിന സത്യവാങ്മൂലം", gentleNote: "ഒരു സൗമ്യമായ കുറിപ്പ്", noteDesc: "ഇതൊരു പൊതുവായ വായനയാണ്. യഥാർത്ഥ കഥ നിങ്ങളുടെ വ്യക്തിഗത ജാതകത്തിലുണ്ട് — ഞങ്ങളുടെ വനിതാ ജ്യോതിഷിയുമായി സംസാരിക്കുക.", cta: "ജ്യോതിഷിയോട് സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം", stickyTitle: "ജ്യോതിഷി • 24x7 ലഭ്യമാണ്", stickySub: "ഇപ്പോൾ സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം", chat: "ചാറ്റ്" },
  };
  return ui[lang]?.[key] || ui["en"][key];
};

// Zodiac Data (Generic for now to match screenshot)
const ZODIAC_SIGNS = ["General", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

export default function HoroscopePage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  const [selectedSign, setSelectedSign] = useState("General");
  const [loading, setLoading] = useState(false);

  // Helper to get localized text
  const t = (key: string) => getUIText(lang, key);

  const pageClass = isDark ? "bg-[#0B0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151E2E] shadow-xl" : "border-orange-100 bg-white shadow-xl";

  return (
    <main className={`min-h-screen w-full px-4 pb-44 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2 transition-colors ${isDark ? "bg-slate-800 text-orange-400 hover:bg-slate-700" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}>
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="flex items-center gap-1.5 text-base font-black uppercase tracking-tight text-orange-500">
              <Sun size={18} className="text-amber-500" />
              {t("title")}
            </h1>
            <p className={`mt-0.5 text-[11px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              {new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 500); }} className={`p-2 rounded-full ${isDark ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-600"}`}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </header>

        {/* HERO CARD */}
        <section className="rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-black/10 blur-2xl"></div>
          <div className="relative z-10">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30">
              <Sparkles size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-black mb-1">{t("heroTitle")}</h2>
            <p className="text-sm font-medium text-orange-50">{t("heroSub")}</p>
          </div>
        </section>

        {/* WARNING BOX */}
        <div className={`rounded-2xl border p-4 relative overflow-hidden ${isDark ? "border-rose-900/50 bg-rose-950/20" : "border-red-200 bg-red-50"}`}>
          <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
          <p className={`flex items-start gap-2 text-xs font-bold leading-5 ${isDark ? "text-rose-300" : "text-red-800"}`}>
            <TriangleAlert size={16} className="mt-0.5 shrink-0 text-rose-500" />
            {t("warning")}
          </p>
        </div>

        {/* ZODIAC SELECTOR */}
        <div className={`rounded-3xl border p-5 ${cardClass}`}>
          <label className={`text-sm font-bold mb-2 block ${isDark ? "text-slate-300" : "text-gray-700"}`}>{t("chooseSign")}</label>
          <select 
            value={selectedSign} 
            onChange={(e) => setSelectedSign(e.target.value)}
            className={`w-full rounded-xl border px-4 py-3.5 text-sm font-semibold outline-none transition-all appearance-none cursor-pointer ${isDark ? "border-slate-700 bg-slate-800/50 text-white focus:border-orange-500" : "border-gray-200 bg-gray-50 text-slate-900 focus:border-orange-400"}`}
          >
            {ZODIAC_SIGNS.map(sign => <option key={sign} value={sign}>{sign}</option>)}
          </select>
          
          <button className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-transform">
            <RefreshCw size={16} /> {t("viewBtn")}
          </button>
        </div>

        {/* RESULT CARD */}
        <div className={`rounded-3xl border p-5 sm:p-6 ${cardClass}`}>
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-slate-700/50 pb-3">
            <div>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("yourZodiac")}</p>
              <h3 className={`text-xl font-black ${isDark ? "text-white" : "text-slate-900"}`}>{selectedSign}</h3>
            </div>
            <div className={`p-2.5 rounded-full ${isDark ? "bg-amber-500/10 text-amber-500" : "bg-orange-50 text-orange-600"}`}>
              <Sun size={22} />
            </div>
          </div>

          <h4 className="flex items-center gap-2 text-sm font-bold text-orange-500 mb-2">
            <Sparkles size={16} /> {t("guidance")}
          </h4>
          <p className={`text-sm leading-7 mb-6 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
            Aaj ka din mixed rahega. Life ke kisi bhi area mein chal rahi dikkat ya duvidha ko avoid na karein. Humari experienced Jyotishi se consult kar sahi guidance payein.
          </p>

          {/* LUCKY COLOR & NUMBER */}
          <div className="space-y-3 mb-6">
            <div className={`flex items-center gap-3 p-4 rounded-2xl border ${isDark ? "border-slate-700/50 bg-slate-800/30" : "border-gray-100 bg-gray-50"}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isDark ? "bg-amber-500/20 text-amber-500" : "bg-orange-100 text-orange-600"}`}>
                <Palette size={18} />
              </div>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("luckyColor")}</p>
                <p className={`text-sm font-black ${isDark ? "text-amber-400" : "text-amber-600"}`}>Peela (Yellow)</p>
              </div>
            </div>
            
            <div className={`flex items-center gap-3 p-4 rounded-2xl border ${isDark ? "border-slate-700/50 bg-slate-800/30" : "border-gray-100 bg-gray-50"}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isDark ? "bg-amber-500/20 text-amber-500" : "bg-orange-100 text-orange-600"}`}>
                <Hash size={18} />
              </div>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("luckyNumber")}</p>
                <p className={`text-sm font-black ${isDark ? "text-amber-400" : "text-amber-600"}`}>7</p>
              </div>
            </div>
          </div>

          {/* AFFIRMATION */}
          <div className={`rounded-2xl border p-4 ${isDark ? "border-amber-900/30 bg-amber-950/20" : "border-orange-200 bg-orange-50"}`}>
            <h4 className={`flex items-center gap-2 text-xs font-bold mb-1.5 ${isDark ? "text-amber-500" : "text-orange-700"}`}>
              <Heart size={14} /> {t("affirmation")}
            </h4>
            <p className={`text-sm font-medium italic ${isDark ? "text-amber-200/80" : "text-orange-900"}`}>
              "Shanti mann mein hai, bahar nahi."
            </p>
          </div>

          {/* GENTLE NOTE */}
          <div className={`mt-6 rounded-2xl border p-4 ${isDark ? "border-rose-900/30 bg-rose-950/20" : "border-red-100 bg-red-50"}`}>
            <h4 className={`flex items-center gap-2 text-xs font-bold mb-1 ${isDark ? "text-rose-400" : "text-red-700"}`}>
              <Heart size={12} className="fill-current" /> {t("gentleNote")}
            </h4>
            <p className={`text-xs font-medium leading-5 ${isDark ? "text-rose-200/70" : "text-red-800/80"}`}>
              {t("noteDesc")}
            </p>
          </div>
        </div>

      </div>

      {/* STICKY CTA */}
      <Link
        href="/chat"
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 px-4 py-3.5 text-white shadow-[0_-10px_30px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-full"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
            <Phone size={18} />
          </span>
          <div className="leading-tight">
            <p className="text-[10px] font-black uppercase tracking-wider text-rose-100">{t("stickyTitle")}</p>
            <p className="text-sm font-black">{t("stickySub")}</p>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-black text-rose-700">
          <Star size={11} fill="currentColor" />
          {t("chat")}
        </span>
      </Link>
    </main>
  );
}
// app/horoscope/page.tsx
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Sun,
  Phone,
  TriangleAlert,
  Sparkles,
  MessageCircle,
  Star,
} from "lucide-react";
import { useApp } from "../Providers";

// 🔥 10 Language Translation Helper
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: {
      title: "राशिफल",
      subtitle: "दैनिक ज्योतिषीय मार्गदर्शन",
      warning: "🌸 राशिफल सामान्य मार्गदर्शन है। आपकी व्यक्तिगत कुंडली में छिपे दोष शारीरिक व आर्थिक संकट ला सकते हैं। सही समय पर उपाय जानने के लिए हमारे ज्योतिषी से बात करें।",
      msgTitle: "आज का विशेष संदेश",
      message: "आज का दिन आपके लिए भावनात्मक रूप से महत्वपूर्ण है। परिवार या रिश्तों में किसी बात को लेकर मन में उलझन हो सकती है। इसे अनदेखा न करें। अपनी कुंडली की सही जाँच के लिए ज्योतिषी से बात करें।",
      cta: "ज्योतिषी से बात करें — पहली बात FREE",
      trust1: "संतुष्ट यूज़र",
      trust2: "रेटिंग",
      trust3: "ज्योतिषी",
      disclaimer: "© 2026 Astrologer App. यह प्लेटफ़ॉर्म प्राचीन वैदिक ज्योतिष के सिद्धांतों पर आधारित गणनाएँ प्रदर्शित करता है।",
      stickyTitle: "ज्योतिषी • 24x7 उपलब्ध",
      stickySub: "अभी बात करें — पहली बातचीत FREE",
      chat: "चैट"
    },
    hinglish: {
      title: "Horoscope",
      subtitle: "Daily Astrological Guidance",
      warning: "🌸 Rashifal samanya margdarshan hai. Aapki vyaktigat kundli mein chhipe dosh sharirik va aarthik sankat la sakte hain. Sahi samay par upay jaanne ke liye hamare jyotishi se baat karein.",
      msgTitle: "Aaj Ka Vishesh Sandesh",
      message: "Aaj ka din aapke liye bhawnatmak roop se mahatvapurn hai. Parivaar ya rishton mein kisi baat ko lekar mann mein uljhan ho sakti hai. Ise andekha na karein. Apni kundli ki sahi jaanch ke liye jyotishi se baat karein.",
      cta: "Jyotishi se baat karein — Pehli baat FREE",
      trust1: "Happy Users",
      trust2: "Rating",
      trust3: "Astrologers",
      disclaimer: "© 2026 Astrologer App. Yeh platform pracheen Vedic Jyotish ke siddhanton par aadharit gananayein pradarshit karta hai.",
      stickyTitle: "Jyotishi • 24x7 Available",
      stickySub: "Abhi baat karein — Pehli baatcheet FREE",
      chat: "Chat"
    },
    en: {
      title: "Horoscope",
      subtitle: "Daily Astrological Guidance",
      warning: "🌸 Horoscope is general guidance. Hidden doshas in your personal chart can bring physical and financial crisis. Talk to our astrologer to know the right remedy at the right time.",
      msgTitle: "Today's Special Message",
      message: "Today is emotionally significant for you. Some confusion might trouble your mind regarding family or relationships. Do not ignore this. Talk to our astrologer for an accurate Kundli reading.",
      cta: "Talk to Astrologer — First chat FREE",
      trust1: "Happy Users",
      trust2: "Rating",
      trust3: "Astrologers",
      disclaimer: "© 2026 Astrologer App. This platform displays calculations based on ancient Vedic Astrology principles.",
      stickyTitle: "Astrologers • 24x7 Available",
      stickySub: "Talk now — First chat FREE",
      chat: "Chat"
    },
    te: { title: "జాతకం", subtitle: "రోజువారీ జ్యోతిష్య మార్గదర్శకత్వం", warning: "🌸 జాతకం సాధారణ మార్గదర్శకత్వం. మీ వ్యక్తిగత కుండలిలో దాగి ఉన్న దోషాలు శారీరక మరియు ఆర్థిక సంక్షోభాన్ని తెస్తాయి. సరైన సమయంలో పరిహారం తెలుసుకోవడానికి మా జ్యోతిష్యుడిని సంప్రదించండి.", msgTitle: "నేటి ప్రత్యేక సందేశం", message: "ఈరోజు మీకు భావోద్వేగపరంగా ముఖ్యమైనది. కుటుంబం లేదా సంబంధాలలో ఏదో గందరగోళం మీ మనసును వేధించవచ్చు. దీన్ని విస్మరించవద్దు. ఖచ్చితమైన కుండలి పఠనం కోసం మా జ్యోతిష్యుడిని సంప్రదించండి.", cta: "జ్యోతిష్యుడితో మాట్లాడండి — మొదటి చాట్ ఉచితం", trust1: "సంతృప్తి చెందిన యూజర్లు", trust2: "రేటింగ్", trust3: "జ్యోతిష్యులు", disclaimer: "© 2026 Astrologer App. ఈ ప్లాట్‌ఫారమ్ ప్రాచీన వేద జ్యోతిష్య సూత్రాల ఆధారంగా లెక్కలను ప్రదర్శిస్తుంది.", stickyTitle: "జ్యోతిష్యుడు • 24x7 అందుబాటులో", stickySub: "ఇప్పుడే మాట్లాడండి — మొదటి చాట్ ఉచితం", chat: "చాట్" },
    ta: { title: "ராசிபலன்", subtitle: "தினசரி ஜோதிட வழிகாட்டுதல்", warning: "🌸 ராசிபலன் பொதுவான வழிகாட்டுதல். உங்கள் தனிப்பட்ட ஜாதகத்தில் மறைந்திருக்கும் தோஷங்கள் உடல் மற்றும் நிதி நெருக்கடியை ஏற்படுத்தும். சரியான நேரத்தில் பரிகாரம் அறிய எங்கள் ஜோதிடரை அணுகவும்.", msgTitle: "இன்றைய சிறப்பு செய்தி", message: "இன்று உங்களுக்கு உணர்வுபூர்வமாக முக்கியமானது. குடும்பம் அல்லது உறவுகளில் ஏதோ குழப்பம் உங்கள் மனதை பாதிக்கலாம். இதை புறக்கணிக்காதீர்கள். துல்லியமான ஜாதக வாசிப்புக்கு எங்கள் ஜோதிடரை அணுகவும்.", cta: "ஜோதிடரிடம் பேசுங்கள் — முதல் அரட்டை இலவசம்", trust1: "மகிழ்ச்சியான பயனர்கள்", trust2: "மதிப்பீடு", trust3: "ஜோதிடர்கள்", disclaimer: "© 2026 Astrologer App. இந்த தளம் பண்டைய வேத ஜோதிட கொள்கைகளின் அடிப்படையில் கணக்கீடுகளைக் காட்டுகிறது.", stickyTitle: "ஜோதிடர் • 24x7 கிடைக்கும்", stickySub: "இப்போது பேசுங்கள் — முதல் அரட்டை இலவசம்", chat: "அரட்டை" },
    kn: { title: "ರಾಶಿಫಲ", subtitle: "ದೈನಂದಿನ ಜ್ಯೋತಿಷ್ಯ ಮಾರ್ಗದರ್ಶನ", warning: "🌸 ರಾಶಿಫಲ ಸಾಮಾನ್ಯ ಮಾರ್ಗದರ್ಶನ. ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಕುಂಡಲಿಯಲ್ಲಿ ಅಡಗಿರುವ ದೋಷಗಳು ದೈಹಿಕ ಮತ್ತು ಆರ್ಥಿಕ ಬಿಕ್ಕಟ್ಟನ್ನು ತರಬಹುದು. ಸರಿಯಾದ ಸಮಯದಲ್ಲಿ ಪರಿಹಾರ ತಿಳಿಯಲು ನಮ್ಮ ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.", msgTitle: "ಇಂದಿನ ವಿಶೇಷ ಸಂದೇಶ", message: "ಇಂದು ನಿಮಗೆ ಭಾವನಾತ್ಮಕವಾಗಿ ಮುಖ್ಯವಾಗಿದೆ. ಕುಟುಂಬ ಅಥವಾ ಸಂಬಂಧಗಳಲ್ಲಿ ಏನೋ ಗೊಂದಲ ನಿಮ್ಮ ಮನಸ್ಸನ್ನು ಕಾಡಬಹುದು. ಇದನ್ನು ನಿರ್ಲಕ್ಷಿಸಬೇಡಿ. ನಿಖರವಾದ ಕುಂಡಲಿ ಓದುವಿಕೆಗಾಗಿ ನಮ್ಮ ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.", cta: "ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ", trust1: "ಸಂತೃಪ್ತ ಬಳಕೆದಾರರು", trust2: "ರೇಟಿಂಗ್", trust3: "ಜ್ಯೋತಿಷಿಗಳು", disclaimer: "© 2026 Astrologer App. ಈ ವೇದಿಕೆಯು ಪ್ರಾಚೀನ ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ತತ್ವಗಳ ಆಧಾರದ ಮೇಲೆ ಲೆಕ್ಕಾಚಾರಗಳನ್ನು ಪ್ರದರ್ಶಿಸುತ್ತದೆ.", stickyTitle: "ಜ್ಯೋತಿಷಿ • 24x7 ಲಭ್ಯವಿದೆ", stickySub: "ಈಗ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ", chat: "ಚಾಟ್" },
    bn: { title: "রাশিফল", subtitle: "দৈনিক জ্যোতিষ নির্দেশিকা", warning: "🌸 রাশিফল সাধারণ নির্দেশিকা। আপনার ব্যক্তিগত কুণ্ডলীতে লুকানো দোষ শারীরিক ও আর্থিক সংকট আনতে পারে। সঠিক সময়ে প্রতিকার জানতে আমাদের জ্যোতিষীর সাথে কথা বলুন।", msgTitle: "আজকের বিশেষ বার্তা", message: "আজ আপনার জন্য আবেগগতভাবে গুরুত্বপূর্ণ। পরিবার বা সম্পর্কে কিছু বিভ্রান্তি আপনার মনকে উদ্বিগ্ন করতে পারে। এটি উপেক্ষা করবেন না। সঠিক কুণ্ডলী পাঠের জন্য আমাদের জ্যোতিষীর সাথে কথা বলুন।", cta: "জ্যোতিষীর সাথে কথা বলুন — প্রথম চ্যাট ফ্রি", trust1: "সন্তুষ্ট ব্যবহারকারী", trust2: "রেটিং", trust3: "জ্যোতিষী", disclaimer: "© 2026 Astrologer App. এই প্ল্যাটফর্মটি প্রাচীন বৈদিক জ্যোতিষ নীতির উপর ভিত্তি করে গণনা প্রদর্শন করে।", stickyTitle: "জ্যোতিষী • 24x7 উপলব্ধ", stickySub: "এখনই কথা বলুন — প্রথম চ্যাট ফ্রি", chat: "চ্যাট" },
    mr: { title: "राशीभविष्य", subtitle: "दैनिक ज्योतिष मार्गदर्शन", warning: "🌸 राशीभविष्य सामान्य मार्गदर्शन आहे. तुमच्या वैयक्तिक कुंडलीतील लपलेले दोष शारीरिक आणि आर्थिक संकट आणू शकतात. योग्य वेळी उपाय जाणून घेण्यासाठी आमच्या ज्योतिषाशी बोला.", msgTitle: "आजचा विशेष संदेश", message: "आजचा दिवस तुमच्यासाठी भावनिकदृष्ट्या महत्त्वाचा आहे. कुटुंब किंवा नात्यांमध्ये काही गोंधळ तुमच्या मनाला त्रास देऊ शकतो. याकडे दुर्लक्ष करू नका. अचूक कुंडली वाचनासाठी आमच्या ज्योतिषाशी बोला.", cta: "ज्योतिषाशी बोला — पहिली चॅट मोफत", trust1: "समाधानी वापरकर्ते", trust2: "रेटिंग", trust3: "ज्योतिषी", disclaimer: "© 2026 Astrologer App. हे व्यासपीठ प्राचीन वैदिक ज्योतिष तत्त्वांवर आधारित गणना दर्शवते.", stickyTitle: "ज्योतिषी • 24x7 उपलब्ध", stickySub: "आता बोला — पहिली चॅट मोफत", chat: "चॅट" },
    gu: { title: "રાશિફળ", subtitle: "દૈનિક જ્યોતિષ માર્ગદર્શન", warning: "🌸 રાશિફળ સામાન્ય માર્ગદર્શન છે. તમારી વ્યક્તિગત કુંડળીમાં છુપાયેલા દોષ શારીરિક અને આર્થિક કટોકટી લાવી શકે છે. યોગ્ય સમયે ઉપાય જાણવા માટે અમારા જ્યોતિષી સાથે વાત કરો.", msgTitle: "આજનો ખાસ સંદેશ", message: "આજનો દિવસ તમારા માટે ભાવનાત્મક રીતે મહત્વપૂર્ણ છે. પરિવાર અથવા સંબંધોમાં કંઈક ગૂંચવણ તમારા મનને પરેશાન કરી શકે છે. આને અવગણો નહીં. સચોટ કુંડળી વાંચન માટે અમારા જ્યોતિષી સાથે વાત કરો.", cta: "જ્યોતિષી સાથે વાત કરો — પ્રથમ ચેટ મફત", trust1: "સંતુષ્ટ વપરાશકર્તાઓ", trust2: "રેટિંગ", trust3: "જ્યોતિષીઓ", disclaimer: "© 2026 Astrologer App. આ પ્લેટફોર્મ પ્રાચીન વૈદિક જ્યોતિષ સિદ્ધાંતોના આધારે ગણતરીઓ દર્શાવે છે.", stickyTitle: "જ્યોતિષી • 24x7 ઉપલબ્ધ", stickySub: "હમણાં વાત કરો — પ્રથમ ચેટ મફત", chat: "ચેટ" },
    ml: { title: "രാശിഫലം", subtitle: "ദൈനംദിന ജ്യോതിഷ മാർഗ്ഗനിർദ്ദേശം", warning: "🌸 രാശിഫലം പൊതുവായ മാർഗ്ഗനിർദ്ദേശമാണ്. നിങ്ങളുടെ വ്യക്തിഗത ജാതകത്തിലെ ഗുപ്തദോഷങ്ങൾ ശാരീരികവും സാമ്പത്തികവുമായ പ്രതിസന്ധികൾ ഉണ്ടാക്കാം. ശരിയായ സമയത്ത് പരിഹാരം അറിയാൻ ഞങ്ങളുടെ ജ്യോതിഷിയുമായി സംസാരിക്കുക.", msgTitle: "ഇന്നത്തെ പ്രത്യേക സന്ദേശം", message: "ഇന്ന് നിങ്ങൾക്ക് വൈകാരികമായി പ്രധാനമാണ്. കുടുംബത്തിലോ ബന്ധങ്ങളിലോ എന്തെങ്കിലും ആശയക്കുഴപ്പം നിങ്ങളുടെ മനസ്സിനെ അലട്ടിയേക്കാം. ഇത് അവഗണിക്കരുത്. കൃത്യമായ ജാതക വായനയ്ക്കായി ഞങ്ങളുടെ ജ്യോതിഷിയുമായി സംസാരിക്കുക.", cta: "ജ്യോതിഷിയോട് സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം", trust1: "സംതൃപ്തരായ ഉപയോക്താക്കൾ", trust2: "റേറ്റിംഗ്", trust3: "ജ്യോതിഷികൾ", disclaimer: "© 2026 Astrologer App. ഈ പ്ലാറ്റ്ഫോം പുരാതന വൈദിക ജ്യോതിഷ തത്വങ്ങളെ അടിസ്ഥാനമാക്കിയുള്ള കണക്കുകൂട്ടലുകൾ പ്രദർശിപ്പിക്കുന്നു.", stickyTitle: "ജ്യോതിഷി • 24x7 ലഭ്യമാണ്", stickySub: "ഇപ്പോൾ സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം", chat: "ചാറ്റ്" },
  };
  return ui[lang]?.[key] || ui["en"][key];
};

export default function HoroscopePage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";

  // Helper to get localized text
  const t = (key: string) => getUIText(lang, key);

  const pageClass = isDark ? "bg-[#0B0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151E2E] shadow-xl" : "border-orange-100 bg-white shadow-xl";
  const mutedClass = isDark ? "text-slate-300" : "text-slate-600";

  return (
    <main className={`min-h-screen w-full px-4 pb-44 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        
        {/* ================= HEADER ================= */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2 transition-colors ${isDark ? "bg-slate-800 text-orange-400 hover:bg-slate-700" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}>
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="flex items-center gap-1.5 text-base font-black uppercase tracking-tight text-orange-500">
              <Sun size={18} className="text-amber-500" />
              {t("title")}
            </h1>
            <p className={`mt-0.5 text-[11px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("subtitle")}</p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black text-emerald-500 border border-emerald-500/20">FREE</span>
        </header>

        {/* ================= WARNING BOX ================= */}
        <section className={`space-y-4 rounded-3xl border p-5 sm:p-6 ${cardClass}`}>
          <div className={`rounded-2xl border p-4 relative overflow-hidden ${isDark ? "border-rose-900/50 bg-rose-950/20" : "border-red-200 bg-red-50"}`}>
            <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
            <p className={`flex items-start gap-2 text-sm font-bold leading-6 ${isDark ? "text-rose-300" : "text-red-800"}`}>
              <TriangleAlert size={18} className="mt-0.5 shrink-0 text-rose-500" />
              {t("warning")}
            </p>
          </div>

          {/* Today's message */}
          <div className={`rounded-2xl border p-5 ${isDark ? "border-slate-700 bg-slate-800/30" : "border-orange-200 bg-white shadow-sm"}`}>
            <h3 className="mb-3 flex items-center gap-1.5 text-sm font-black text-orange-500 uppercase tracking-wide">
              <Sparkles size={16} />
              {t("msgTitle")}
            </h3>
            <p className={`text-sm leading-7 font-medium ${mutedClass}`}>
              {t("message")}
            </p>
          </div>

          {/* CTA inside card */}
          <Link
            href="/chat"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 px-4 py-4 text-sm font-black text-white shadow-lg shadow-rose-500/30 transition-transform active:scale-[0.98] animate-pulse"
          >
            <MessageCircle size={18} />
            {t("cta")}
          </Link>
        </section>

        {/* ================= TRUST STRIP ================= */}
        <div className={`grid grid-cols-3 gap-2 rounded-2xl border p-4 text-center ${cardClass}`}>
          <div>
            <p className="text-base font-black text-orange-500">50K+</p>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("trust1")}</p>
          </div>
          <div className={`border-x ${isDark ? "border-slate-700/50" : "border-gray-200"}`}>
            <p className="text-base font-black text-orange-500">4.8★</p>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("trust2")}</p>
          </div>
          <div>
            <p className="text-base font-black text-orange-500">24x7</p>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("trust3")}</p>
          </div>
        </div>

        {/* ================= DISCLAIMER ================= */}
        <p className={`px-6 text-center text-[9px] leading-3 select-none tracking-wide ${isDark ? "text-slate-600" : "text-gray-400"}`}>
          {t("disclaimer")}
        </p>
      </div>

      {/* ================= STICKY CTA → /chat ================= */}
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
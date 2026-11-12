// app/remedies/page.tsx
"use client";

import { ArrowLeft, Gem, Info, MessageCircle, Sparkles, Star, Home, Sun, User, Crown } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

// 🔥 10 Language Translation Helper
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: { 
      title: "रत्न और उपाय", sub: "ग्रहों के अनुसार रत्न", planet: "ग्रह", stone: "रत्न", metal: "धातु", day: "दिन", finger: "उंगली", 
      warning: "ध्यान दें: बिना ज्योतिषी की सलाह के कोई भी रत्न न पहनें।", cta: "व्यक्तिगत सलाह लें", 
      gold: "सोना", silver: "चांदी", copper: "तांबा", platinum: "प्लैटिनम", 
      sunday: "रविवार", monday: "सोमवार", tuesday: "मंगलवार", wednesday: "बुधवार", thursday: "गुरुवार", friday: "शुक्रवार", saturday: "शनिवार", 
      ring: "अनामिका", little: "कनिष्ठा", index: "तर्जनी", middle: "मध्यमा",
      bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "अपने नाम करें – पहली चैट FREE",
      home: "होम", chat: "चैट", daily: "राशिफल", profile: "प्रोफाइल",
      prefill: "नमस्ते, मुझे मेरी कुंडली के हिसाब से सही रत्न पहनने की सलाह चाहिए। कौन सा रत्न मेरे लिए शुभ रहेगा?"
    },
    hinglish: { 
      title: "Gemstones & Remedies", sub: "Gemstones according to Planets", planet: "Planet", stone: "Stone", metal: "Metal", day: "Day", finger: "Finger", 
      warning: "Note: Do not wear any gemstone without consulting an astrologer.", cta: "Get Personal Recommendation", 
      gold: "Gold", silver: "Silver", copper: "Copper", platinum: "Platinum", 
      sunday: "Sunday", monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday", 
      ring: "Ring Finger", little: "Little Finger", index: "Index Finger", middle: "Middle Finger",
      bannerTitle: "Astrologer - 24x7 Available", bannerSub: "Make them yours – First Chat FREE",
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile",
      prefill: "Namaste, mujhe meri kundli ke hisaab se sahi ratna pehnne ki salah chahiye. Kaun sa ratna mere liye shubh rahega?"
    },
    en: { 
      title: "Gemstones & Remedies", sub: "Gemstones according to Planets", planet: "Planet", stone: "Stone", metal: "Metal", day: "Day", finger: "Finger", 
      warning: "Note: Do not wear any gemstone without consulting an astrologer.", cta: "Get Personal Recommendation", 
      gold: "Gold", silver: "Silver", copper: "Copper", platinum: "Platinum", 
      sunday: "Sunday", monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday", 
      ring: "Ring Finger", little: "Little Finger", index: "Index Finger", middle: "Middle Finger",
      bannerTitle: "Astrologer - 24x7 Available", bannerSub: "Make them yours – First Chat FREE",
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile",
      prefill: "Hello, I want a personal gemstone recommendation based on my Kundli. Which stone will be auspicious for me?"
    },
    te: { 
      title: "రత్నాలు & పరిహారాలు", sub: "గ్రహాల ప్రకారం రత్నాలు", planet: "గ్రహం", stone: "రత్నం", metal: "లోహం", day: "రోజు", finger: "వేలు", 
      warning: "గమనిక: జ్యోతిష్యుడిని సంప్రదించకుండా ఏ రత్నాన్ని ధరించవద్దు.", cta: "వ్యక్తిగత సిఫార్సు పొందండి", 
      gold: "బంగారం", silver: "వెండి", copper: "రాగి", platinum: "ప్లాటినం", 
      sunday: "ఆదివారం", monday: "సోమవారం", tuesday: "మంగళవారం", wednesday: "బుధవారం", thursday: "గురువారం", friday: "శుక్రవారం", saturday: "శనివారం", 
      ring: "ఉంగరపు వేలు", little: "చిటికెన వేలు", index: "చూపుడు వేలు", middle: "మధ్య వేలు",
      bannerTitle: "జ్యోతిష్యుడు - 24x7 అందుబాటులో", bannerSub: "ఇప్పుడే మాట్లాడండి — మొదటి చాట్ ఉచితం",
      home: "హోమ్", chat: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్",
      prefill: "నమస్తే, నా కుండలి ఆధారంగా నాకు సరైన రత్నం ఏదో సిఫార్సు చేయండి. నాకు ఏ రత్నం శుభప్రదం?"
    },
    ta: { 
      title: "ரத்தினங்கள் & பரிகாரங்கள்", sub: "கிரகங்களுக்கு ஏற்ப ரத்தினங்கள்", planet: "கிரகம்", stone: "ரத்தினம்", metal: "உலோகம்", day: "நாள்", finger: "விரல்", 
      warning: "குறிப்பு: ஜோதிடரை ஆலோசிக்காமல் எந்த ரத்தினத்தையும் அணிய வேண்டாம்.", cta: "தனிப்பயனாக்கப்பட்ட பரிந்துரையைப் பெறுங்கள்", 
      gold: "தங்கம்", silver: "வெள்ளி", copper: "செம்பு", platinum: "பிளாட்டினம்", 
      sunday: "ஞாயிறு", monday: "திங்கள்", tuesday: "செவ்வாய்", wednesday: "புதன்", thursday: "வியாழன்", friday: "வெள்ளி", saturday: "சனி", 
      ring: "மோதிர விரல்", little: "சிறு விரல்", index: "ஆள்காட்டி விரல்", middle: "நடு விரல்",
      bannerTitle: "ஜோதிடர் - 24x7 கிடைக்கும்", bannerSub: "இப்போது பேசுங்கள் — முதல் அரட்டை இலவசம்",
      home: "முகப்பு", chat: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்",
      prefill: "வணக்கம், எனது ஜாதகத்தின் அடிப்படையில் எனக்கு எந்த ரத்தினம் சரியானது என்று பரிந்துரைக்க முடியுமா?"
    },
    kn: { 
      title: "ರತ್ನಗಳು & ಪರಿಹಾರಗಳು", sub: "ಗ್ರಹಗಳ ಪ್ರಕಾರ ರತ್ನಗಳು", planet: "ಗ್ರಹ", stone: "ರತ್ನ", metal: "ಲೋಹ", day: "ದಿನ", finger: "ಬೆರಳು", 
      warning: "ಗಮನಿಸಿ: ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸದೆ ಯಾವುದೇ ರತ್ನವನ್ನು ಧರಿಸಬೇಡಿ.", cta: "ವೈಯಕ್ತಿಕ ಶಿಫಾರಸು ಪಡೆಯಿರಿ", 
      gold: "ಚಿನ್ನ", silver: "ಬೆಳ್ಳಿ", copper: "ತಾಮ್ರ", platinum: "ಪ್ಲಾಟಿನಂ", 
      sunday: "ಭಾನುವಾರ", monday: "ಸೋಮವಾರ", tuesday: "ಮಂಗಳವಾರ", wednesday: "ಬುಧವಾರ", thursday: "ಗುರುವಾರ", friday: "ಶುಕ್ರವಾರ", saturday: "ಶನಿವಾರ", 
      ring: "ಉಂಗುರದ ಬೆರಳು", little: "ಕಿರುಬೆರಳು", index: "ತೋರು ಬೆರಳು", middle: "ಮಧ್ಯದ ಬೆರಳು",
      bannerTitle: "ಜ್ಯೋತಿಷಿ - 24x7 ಲಭ್ಯವಿದೆ", bannerSub: "ಈಗ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ",
      home: "ಮುಖಪುಟ", chat: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್",
      prefill: "ನಮಸ್ಕಾರ, ನನ್ನ ಕುಂಡಲಿ ಆಧಾರದ ಮೇಲೆ ನನಗೆ ಯಾವ ರತ್ನ ಶುಭವೆಂದು ಸಲಹೆ ನೀಡಬಹುದೇ?"
    },
    bn: { 
      title: "রত্ন & প্রতিকার", sub: "গ্রহ অনুযায়ী রত্ন", planet: "গ্রহ", stone: "রত্ন", metal: "ধাতু", day: "দিন", finger: "আঙুল", 
      warning: "দ্রষ্টব্য: জ্যোতিষীর পরামর্শ ছাড়া কোনো রত্ন পরবেন না।", cta: "ব্যক্তিগত সুপারিশ পান", 
      gold: "সোনা", silver: "রূপা", copper: "তামা", platinum: "প্ল্যাটিনাম", 
      sunday: "রবিবার", monday: "সোমবার", tuesday: "মঙ্গলবার", wednesday: "বুধবার", thursday: "বৃহস্পতিবার", friday: "শুক্রবার", saturday: "শনিবার", 
      ring: "অনামিকা", little: "কনিষ্ঠা", index: "তর্জনী", middle: "মধ্যমা",
      bannerTitle: "জ্যোতিষী - 24x7 উপলব্ধ", bannerSub: "এখনই কথা বলুন — প্রথম চ্যাট ফ্রি",
      home: "হোম", chat: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল",
      prefill: "নমস্কার, আমার কুণ্ডলী অনুযায়ী আমার জন্য কোন রত্ন শুভ হবে তা পরামর্শ দিতে পারেন?"
    },
    mr: { 
      title: "रत्ने & उपाय", sub: "ग्रहांनुसार रत्ने", planet: "ग्रह", stone: "रत्न", metal: "धातू", day: "दिवस", finger: "बोट", 
      warning: "टीप: ज्योतिषाच्या सल्ल्याशिवाय कोणतेही रत्न घालू नका.", cta: "वैयक्तिक शिफारस मिळवा", 
      gold: "सोने", silver: "चांदी", copper: "तांबे", platinum: "प्लॅटिनम", 
      sunday: "रविवार", monday: "सोमवार", tuesday: "मंगळवार", wednesday: "बुधवार", thursday: "गुरुवार", friday: "शुक्रवार", saturday: "शनिवार", 
      ring: "अनामिका", little: "कनिष्ठा", index: "तर्जनी", middle: "मध्यमा",
      bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "आता बोला — पहिली चॅट मोफत",
      home: "होम", chat: "चॅट", daily: "दैनिक", profile: "प्रोफाइल",
      prefill: "नमस्कार, माझ्या कुंडलीनुसार मला कोणते रत्न शुभ ठरेल याचा सल्ला देऊ शकता का?"
    },
    gu: { 
      title: "રત્નો & ઉપાયો", sub: "ગ્રહો મુજબ રત્નો", planet: "ગ્રહ", stone: "રત્ન", metal: "ધાતુ", day: "દિવસ", finger: "આંગળી", 
      warning: "નોંધ: જ્યોતિષીની સલાહ વિના કોઈપણ રત્ન ન પહેરો.", cta: "વ્યક્તિગત સલાહ મેળવો", 
      gold: "સોનું", silver: "ચાંદી", copper: "તાંબું", platinum: "પ્લેટિનમ", 
      sunday: "રવિવાર", monday: "સોમવાર", tuesday: "મંગળવાર", wednesday: "બુધવાર", thursday: "ગુરુવાર", friday: "શુક્રવાર", saturday: "શનિવાર", 
      ring: "અનામિકા", little: "કનિષ્ઠા", index: "તર્જની", middle: "મધ્યમા",
      bannerTitle: "જ્યોતિષી - 24x7 ઉપલબ્ધ", bannerSub: "હમણાં વાત કરો — પ્રથમ ચેટ મફત",
      home: "હોમ", chat: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ",
      prefill: "નમસ્તે, મારી કુંડળી મુજબ મારે કયું રત્ન પહેરવું શુભ રહેશે તેની સલાહ આપી શકશો?"
    },
    ml: { 
      title: "രത്നങ്ങൾ & പരിഹാരങ്ങൾ", sub: "ഗ്രഹങ്ങൾക്കനുസരിച്ചുള്ള രത്നങ്ങൾ", planet: "ഗ്രഹം", stone: "രത്നം", metal: "ലോഹം", day: "ദിവസം", finger: "വിരൽ", 
      warning: "ശ്രദ്ധിക്കുക: ജ്യോതിഷിയെ കാണാതെ ഒരു രത്നവും ധരിക്കരുത്.", cta: "വ്യക്തിഗത ശുപാർശ നേടുക", 
      gold: "സ്വർണ്ണം", silver: "വെള്ളി", copper: "ചെമ്പ്", platinum: "പ്ലാറ്റിനം", 
      sunday: "ഞായറാഴ്ച", monday: "തിങ്കളാഴ്ച", tuesday: "ചൊവ്വാഴ്ച", wednesday: "ബുധനാഴ്ച", thursday: "വ്യാഴാഴ്ച", friday: "വെള്ളിയാഴ്ച", saturday: "ശനിയാഴ്ച", 
      ring: "മോതിരവിരൽ", little: "ചെറുവിരൽ", index: "ചൂണ്ടുവിരൽ", middle: "നടുവിരൽ",
      bannerTitle: "ജ്യോതിഷി - 24x7 ലഭ്യമാണ്", bannerSub: "ഇപ്പോൾ സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം",
      home: "ഹോം", chat: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ",
      prefill: "നമസ്തേ, എന്റെ കുണ്ഡലി അനുസരിച്ച് എനിക്ക് ഏത് രത്നമാണ് ശുഭകരമെന്ന് നിർദ്ദേശിക്കാമോ?"
    },
  };
  return ui[lang]?.[key] || ui["en"][key] || ui["hi"][key];
};

const GEMSTONES = [
  { planetKey: "Sun", planetHi: "सूर्य", stoneKey: "Ruby", stoneHi: "माणिक्य", color: "#EF4444", metalKey: "copper", dayKey: "sunday", fingerKey: "ring" },
  { planetKey: "Moon", planetHi: "चंद्र", stoneKey: "Pearl", stoneHi: "मोती", color: "#FFFFFF", metalKey: "silver", dayKey: "monday", fingerKey: "little" },
  { planetKey: "Mars", planetHi: "मंगल", stoneKey: "Red Coral", stoneHi: "मूंगा", color: "#DC2626", metalKey: "copper", dayKey: "tuesday", fingerKey: "ring" },
  { planetKey: "Mercury", planetHi: "बुध", stoneKey: "Emerald", stoneHi: "पन्ना", color: "#22C55E", metalKey: "gold", dayKey: "wednesday", fingerKey: "little" },
  { planetKey: "Jupiter", planetHi: "गुरु", stoneKey: "Yellow Sapphire", stoneHi: "पुखराज", color: "#FDE047", metalKey: "gold", dayKey: "thursday", fingerKey: "index" },
  { planetKey: "Venus", planetHi: "शुक्र", stoneKey: "Diamond", stoneHi: "हीरा", color: "#E2E8F0", metalKey: "platinum", dayKey: "friday", fingerKey: "middle" },
  { planetKey: "Saturn", planetHi: "शनि", stoneKey: "Blue Sapphire", stoneHi: "नीलम", color: "#3B82F6", metalKey: "silver", dayKey: "saturday", fingerKey: "middle" },
  { planetKey: "Rahu", planetHi: "राहु", stoneKey: "Hessonite", stoneHi: "गोमेद", color: "#D97706", metalKey: "silver", dayKey: "saturday", fingerKey: "middle" },
  { planetKey: "Ketu", planetHi: "केतु", stoneKey: "Cat's Eye", stoneHi: "लहसुनिया", color: "#6B7280", metalKey: "silver", dayKey: "tuesday", fingerKey: "middle" },
];

export default function RemediesPage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";

  const t = (key: string) => getUIText(lang, key);

  const getLocalizedPlanet = (p: any) => lang === "hi" ? p.planetHi : p.planetKey;
  const getLocalizedStone = (s: any) => lang === "hi" ? s.stoneHi : s.stoneKey;

  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c] shadow-lg" : "border-orange-100 bg-white shadow-xl";
  
  // 🔥 FIX: Divider aur Nav ke liye dynamic classes
  const dividerClass = isDark ? "border-slate-800/50" : "border-gray-100";
  const navClass = isDark ? "bg-[#0b101b] border-slate-800 text-slate-400" : "bg-white border-gray-200 text-gray-500";

  const chatLink = `/chat/gita?prefill=${encodeURIComponent(t("prefill"))}`;

  return (
    <main className={`min-h-[100dvh] w-full pb-36 ${pageClass} font-sans`}>
      
      <div className="w-full max-w-2xl mx-auto px-3 pt-4 space-y-5">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2.5 transition-colors ${isDark ? "bg-[#0A0F19] text-slate-300 hover:bg-slate-800" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}>
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[17px] font-black uppercase tracking-tight text-[#ff6b00]">{t("title")}</h1>
            <p className={`text-[11px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("sub")}</p>
          </div>
          <Gem className="text-[#ff6b00]" size={26} />
        </header>

        {/* WARNING BOX */}
        <div className={`rounded-xl border p-4 relative overflow-hidden ${isDark ? "border-rose-500/30 bg-[#2a151a]" : "border-red-200 bg-red-50"}`}>
          <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
          <div className="flex items-start gap-3">
            <Info size={20} className="text-rose-500 shrink-0 mt-0.5" />
            <p className={`text-[13px] font-bold leading-relaxed ${isDark ? "text-rose-300" : "text-red-800"}`}>
              {t("warning")}
            </p>
          </div>
        </div>

        {/* GEMSTONES GRID */}
        <div className="grid grid-cols-1 gap-4">
          {GEMSTONES.map((item, idx) => (
            <div key={idx} className={`group relative overflow-hidden rounded-[1.5rem] border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cardClass}`}>
              
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-40 pointer-events-none" style={{ backgroundColor: item.color }} />

              <div className="relative z-10 flex gap-4">
                <div className="shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner border border-white/20" style={{ backgroundColor: item.color }}>
                    <Gem size={28} className="text-black/40 drop-shadow-md" />
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("planet")}</p>
                      <h3 className="text-[18px] font-black text-[#ff6b00]">{getLocalizedPlanet(item)}</h3>
                    </div>
                    <div className="text-right">
                      <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("stone")}</p>
                      <p className={`text-[15px] font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{getLocalizedStone(item)}</p>
                    </div>
                  </div>
                  
                  <div className={`grid grid-cols-3 gap-y-3 gap-x-2 pt-3 border-t mt-2 ${dividerClass}`}>
                    <div>
                      <p className={`text-[10px] font-bold uppercase ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("metal")}</p>
                      <p className={`text-[12.5px] font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}>{t(item.metalKey)}</p>
                    </div>
                    <div>
                      <p className={`text-[10px] font-bold uppercase ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("day")}</p>
                      <p className={`text-[12.5px] font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}>{t(item.dayKey)}</p>
                    </div>
                    <div>
                      <p className={`text-[10px] font-bold uppercase ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("finger")}</p>
                      <p className={`text-[12.5px] font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}>{t(item.fingerKey)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA BUTTON (Frictionless Chat) */}
        <Link 
          href={chatLink} 
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] px-4 py-4 text-[15px] font-bold text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-[1.02] active:scale-95 mt-2"
        >
          <Sparkles size={20} /> {t("cta")}
        </Link>

      </div>

      {/* STICKY BOTTOM BANNER & NAVIGATION */}
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
          <Link href="/chat" className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-md active:scale-95 transition-transform">
               <Crown size={16} className="text-[#d81b60]" fill="#d81b60" />
          </Link>
        </div>

        {/* Bottom Navigation Bar - FIXED THEME */}
        <nav className={`border-t flex justify-around items-center pt-2.5 pb-5 px-2 w-full ${navClass}`}>
          <Link href="/" className="flex flex-col items-center gap-1 hover:text-orange-500 transition-colors">
            <Home size={22} />
            <span className="text-[11px] font-medium">{t("home")}</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center gap-1 hover:text-orange-500 transition-colors">
            <MessageCircle size={22} />
            <span className="text-[11px] font-medium">{t("chat")}</span>
          </Link>
          <Link href="/daily" className="flex flex-col items-center gap-1 hover:text-orange-500 transition-colors">
            <Sun size={22} />
            <span className="text-[11px] font-medium">{t("daily")}</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 hover:text-orange-500 transition-colors">
            <User size={22} />
            <span className="text-[11px] font-medium">{t("profile")}</span>
          </Link>
        </nav>
      </div>

    </main>
  );
}
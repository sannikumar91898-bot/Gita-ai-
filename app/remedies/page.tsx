// app/remedies/page.tsx
"use client";

import { ArrowLeft, Gem, Info, MessageCircle, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

// 🔥 10 Language Translation Helper
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: { title: "रत्न और उपाय", sub: "ग्रहों के अनुसार रत्न", planet: "ग्रह", stone: "रत्न", metal: "धातु", day: "दिन", finger: "उंगली", warning: "ध्यान दें: बिना ज्योतिषी की सलाह के कोई भी रत्न न पहनें।", cta: "व्यक्तिगत सलाह लें", stickyTitle: "ज्योतिषी • 24x7 उपलब्ध", stickySub: "अभी बात करें — पहली चैट FREE", chatBtn: "चैट", gold: "सोना", silver: "चांदी", copper: "तांबा", platinum: "प्लैटिनम", sunday: "रविवार", monday: "सोमवार", tuesday: "मंगलवार", wednesday: "बुधवार", thursday: "गुरुवार", friday: "शुक्रवार", saturday: "शनिवार", ring: "अनामिका", little: "कनिष्ठा", index: "तर्जनी", middle: "मध्यमा" },
    hinglish: { title: "Gemstones & Remedies", sub: "Gemstones according to Planets", planet: "Planet", stone: "Stone", metal: "Metal", day: "Day", finger: "Finger", warning: "Note: Do not wear any gemstone without consulting an astrologer.", cta: "Get Personal Recommendation", stickyTitle: "Astrologer • 24x7 Available", stickySub: "Talk Now — First Chat FREE", chatBtn: "Chat", gold: "Gold", silver: "Silver", copper: "Copper", platinum: "Platinum", sunday: "Sunday", monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday", ring: "Ring Finger", little: "Little Finger", index: "Index Finger", middle: "Middle Finger" },
    en: { title: "Gemstones & Remedies", sub: "Gemstones according to Planets", planet: "Planet", stone: "Stone", metal: "Metal", day: "Day", finger: "Finger", warning: "Note: Do not wear any gemstone without consulting an astrologer.", cta: "Get Personal Recommendation", stickyTitle: "Astrologer • 24x7 Available", stickySub: "Talk Now — First Chat FREE", chatBtn: "Chat", gold: "Gold", silver: "Silver", copper: "Copper", platinum: "Platinum", sunday: "Sunday", monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday", ring: "Ring Finger", little: "Little Finger", index: "Index Finger", middle: "Middle Finger" },
    te: { title: "రత్నాలు & పరిహారాలు", sub: "గ్రహాల ప్రకారం రత్నాలు", planet: "గ్రహం", stone: "రత్నం", metal: "లోహం", day: "రోజు", finger: "వేలు", warning: "గమనిక: జ్యోతిష్యుడిని సంప్రదించకుండా ఏ రత్నాన్ని ధరించవద్దు.", cta: "వ్యక్తిగత సిఫార్సు పొందండి", stickyTitle: "జ్యోతిష్యుడు • 24x7 అందుబాటులో", stickySub: "ఇప్పుడే మాట్లాడండి — మొదటి చాట్ ఉచితం", chatBtn: "చాట్", gold: "బంగారం", silver: "వెండి", copper: "రాగి", platinum: "ప్లాటినం", sunday: "ఆదివారం", monday: "సోమవారం", tuesday: "మంగళవారం", wednesday: "బుధవారం", thursday: "గురువారం", friday: "శుక్రవారం", saturday: "శనివారం", ring: "ఉంగరపు వేలు", little: "చిటికెన వేలు", index: "చూపుడు వేలు", middle: "మధ్య వేలు" },
    ta: { title: "ரத்தினங்கள் & பரிகாரங்கள்", sub: "கிரகங்களுக்கு ஏற்ப ரத்தினங்கள்", planet: "கிரகம்", stone: "ரத்தினம்", metal: "உலோகம்", day: "நாள்", finger: "விரல்", warning: "குறிப்பு: ஜோதிடரை ஆலோசிக்காமல் எந்த ரத்தினத்தையும் அணிய வேண்டாம்.", cta: "தனிப்பயனாக்கப்பட்ட பரிந்துரையைப் பெறுங்கள்", stickyTitle: "ஜோதிடர் • 24x7 கிடைக்கும்", stickySub: "இப்போது பேசுங்கள் — முதல் அரட்டை இலவசம்", chatBtn: "அரட்டை", gold: "தங்கம்", silver: "வெள்ளி", copper: "செம்பு", platinum: "பிளாட்டினம்", sunday: "ஞாயிறு", monday: "திங்கள்", tuesday: "செவ்வாய்", wednesday: "புதன்", thursday: "வியாழன்", friday: "வெள்ளி", saturday: "சனி", ring: "மோதிர விரல்", little: "சிறு விரல்", index: "ஆள்காட்டி விரல்", middle: "நடு விரல்" },
    kn: { title: "ರತ್ನಗಳು & ಪರಿಹಾರಗಳು", sub: "ಗ್ರಹಗಳ ಪ್ರಕಾರ ರತ್ನಗಳು", planet: "ಗ್ರಹ", stone: "ರತ್ನ", metal: "ಲೋಹ", day: "ದಿನ", finger: "ಬೆರಳು", warning: "ಗಮನಿಸಿ: ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸದೆ ಯಾವುದೇ ರತ್ನವನ್ನು ಧರಿಸಬೇಡಿ.", cta: "ವೈಯಕ್ತಿಕ ಶಿಫಾರಸು ಪಡೆಯಿರಿ", stickyTitle: "ಜ್ಯೋತಿಷಿ • 24x7 ಲಭ್ಯವಿದೆ", stickySub: "ಈಗ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ", chatBtn: "ಚಾಟ್", gold: "ಚಿನ್ನ", silver: "ಬೆಳ್ಳಿ", copper: "ತಾಮ್ರ", platinum: "ಪ್ಲಾಟಿನಂ", sunday: "ಭಾನುವಾರ", monday: "ಸೋಮವಾರ", tuesday: "ಮಂಗಳವಾರ", wednesday: "ಬುಧವಾರ", thursday: "ಗುರುವಾರ", friday: "ಶುಕ್ರವಾರ", saturday: "ಶನಿವಾರ", ring: "ಉಂಗುರದ ಬೆರಳು", little: "ಕಿರುಬೆರಳು", index: "ತೋರು ಬೆರಳು", middle: "ಮಧ್ಯದ ಬೆರಳು" },
    bn: { title: "রত্ন & প্রতিকার", sub: "গ্রহ অনুযায়ী রত্ন", planet: "গ্রহ", stone: "রত্ন", metal: "ধাতু", day: "দিন", finger: "আঙুল", warning: "দ্রষ্টব্য: জ্যোতিষীর পরামর্শ ছাড়া কোনো রত্ন পরবেন না।", cta: "ব্যক্তিগত সুপারিশ পান", stickyTitle: "জ্যোতিষী • 24x7 উপলব্ধ", stickySub: "এখনই কথা বলুন — প্রথম চ্যাট ফ্রি", chatBtn: "চ্যাট", gold: "সোনা", silver: "রূপা", copper: "তামা", platinum: "প্ল্যাটিনাম", sunday: "রবিবার", monday: "সোমবার", tuesday: "মঙ্গলবার", wednesday: "বুধবার", thursday: "বৃহস্পতিবার", friday: "শুক্রবার", saturday: "শনিবার", ring: "অনামিকা", little: "কনিষ্ঠা", index: "তর্জনী", middle: "মধ্যমা" },
    mr: { title: "रत्ने & उपाय", sub: "ग्रहांनुसार रत्ने", planet: "ग्रह", stone: "रत्न", metal: "धातू", day: "दिवस", finger: "बोट", warning: "टीप: ज्योतिषाच्या सल्ल्याशिवाय कोणतेही रत्न घालू नका.", cta: "वैयक्तिक शिफारस मिळवा", stickyTitle: "ज्योतिषी • 24x7 उपलब्ध", stickySub: "आता बोला — पहिली चॅट मोफत", chatBtn: "चॅट", gold: "सोने", silver: "चांदी", copper: "तांबे", platinum: "प्लॅटिनम", sunday: "रविवार", monday: "सोमवार", tuesday: "मंगळवार", wednesday: "बुधवार", thursday: "गुरुवार", friday: "शुक्रवार", saturday: "शनिवार", ring: "अनामिका", little: "कनिष्ठा", index: "तर्जनी", middle: "मध्यमा" },
    gu: { title: "રત્નો & ઉપાયો", sub: "ગ્રહો મુજબ રત્નો", planet: "ગ્રહ", stone: "રત્ન", metal: "ધાતુ", day: "દિવસ", finger: "આંગળી", warning: "નોંધ: જ્યોતિષીની સલાહ વિના કોઈપણ રત્ન ન પહેરો.", cta: "વ્યક્તિગત સલાહ મેળવો", stickyTitle: "જ્યોતિષી • 24x7 ઉપલબ્ધ", stickySub: "હમણાં વાત કરો — પ્રથમ ચેટ મફત", chatBtn: "ચેટ", gold: "સોનું", silver: "ચાંદી", copper: "તાંબું", platinum: "પ્લેટિનમ", sunday: "રવિવાર", monday: "સોમવાર", tuesday: "મંગળવાર", wednesday: "બુધવાર", thursday: "ગુરુવાર", friday: "શુક્રવાર", saturday: "શનિવાર", ring: "અનામિકા", little: "કનિષ્ઠા", index: "તર્જની", middle: "મધ્યમા" },
    ml: { title: "രത്നങ്ങൾ & പരിഹാരങ്ങൾ", sub: "ഗ്രഹങ്ങൾക്കനുസരിച്ചുള്ള രത്നങ്ങൾ", planet: "ഗ്രഹം", stone: "രത്നം", metal: "ലോഹം", day: "ദിവസം", finger: "വിരൽ", warning: "ശ്രദ്ധിക്കുക: ജ്യോതിഷിയെ കാണാതെ ഒരു രത്നവും ധരിക്കരുത്.", cta: "വ്യക്തിഗത ശുപാർശ നേടുക", stickyTitle: "ജ്യോതിഷി • 24x7 ലഭ്യമാണ്", stickySub: "ഇപ്പോൾ സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം", chatBtn: "ചാറ്റ്", gold: "സ്വർണ്ണം", silver: "വെള്ളി", copper: "ചെമ്പ്", platinum: "പ്ലാറ്റിനം", sunday: "ഞായറാഴ്ച", monday: "തിങ്കളാഴ്ച", tuesday: "ചൊവ്വാഴ്ച", wednesday: "ബുധനാഴ്ച", thursday: "വ്യാഴാഴ്ച", friday: "വെള്ളിയാഴ്ച", saturday: "ശനിയാഴ്ച", ring: "മോതിരവിരൽ", little: "ചെറുവിരൽ", index: "ചൂണ്ടുവിരൽ", middle: "നടുവിരൽ" },
  };
  return ui[lang]?.[key] || ui["en"][key];
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
  const isHindi = lang === "hi";

  const t = (key: string) => getUIText(lang, key);

  // Helper to get localized planet/stone names (fallback to English if translation missing)
  const getLocalizedPlanet = (p: any) => {
    if (lang === "hi") return p.planetHi;
    return p.planetKey;
  };
  const getLocalizedStone = (s: any) => {
    if (lang === "hi") return s.stoneHi;
    return s.stoneKey;
  };

  const pageClass = isDark ? "bg-[#0B0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";

  return (
    <main className={`min-h-screen w-full px-4 pb-32 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-6">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-3xl border p-4 shadow-sm backdrop-blur-xl ${isDark ? "border-white/5 bg-[#151E2E]/80" : "border-orange-100 bg-white/80"}`}>
          <Link href="/" className={`rounded-full p-2.5 transition-transform hover:scale-105 ${isDark ? "bg-slate-800 text-orange-400" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-orange-500">{t("title")}</h1>
            <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("sub")}</p>
          </div>
          <Gem className="ml-auto text-orange-500" size={28} />
        </header>

        {/* WARNING BOX */}
        <div className={`rounded-3xl border p-5 relative overflow-hidden ${isDark ? "border-rose-900/50 bg-rose-950/20" : "border-red-200 bg-red-50"}`}>
          <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
          <div className="flex items-start gap-3">
            <Info size={20} className="text-rose-500 shrink-0 mt-0.5" />
            <p className={`text-sm font-bold leading-relaxed ${isDark ? "text-rose-300" : "text-red-800"}`}>
              {t("warning")}
            </p>
          </div>
        </div>

        {/* GEMSTONES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GEMSTONES.map((item, idx) => (
            <div key={idx} className={`group relative overflow-hidden rounded-3xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${isDark ? "border-white/5 bg-[#151E2E]" : "border-orange-100 bg-white"}`}>
              
              {/* Background Glow */}
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-40" style={{ backgroundColor: item.color }} />

              <div className="relative z-10 flex gap-4">
                {/* Gem Icon */}
                <div className="shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner border border-white/20" style={{ backgroundColor: item.color }}>
                    <Gem size={28} className="text-black/40 drop-shadow-md" />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("planet")}</p>
                    <h3 className="text-base font-black text-orange-500">{getLocalizedPlanet(item)}</h3>
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("stone")}</p>
                    <p className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{getLocalizedStone(item)}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100 dark:border-slate-700/50 mt-2">
                    <div>
                      <p className={`text-[9px] font-bold uppercase ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("metal")}</p>
                      <p className={`text-[11px] font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}>{t(item.metalKey)}</p>
                    </div>
                    <div>
                      <p className={`text-[9px] font-bold uppercase ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("day")}</p>
                      <p className={`text-[11px] font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}>{t(item.dayKey)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className={`text-[9px] font-bold uppercase ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("finger")}</p>
                      <p className={`text-[11px] font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}>{t(item.fingerKey)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA BUTTON */}
        <Link href="/chat" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/20 transition-transform hover:scale-[1.02] active:scale-95">
          <Sparkles size={18} /> {t("cta")}
        </Link>

      </div>

      {/* STICKY BOTTOM BAR (Optional, same as other pages) */}
      <Link href="/chat" className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 px-4 py-3.5 text-white shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
            <MessageCircle size={18} />
          </span>
          <div className="leading-tight">
            <p className="text-[10px] font-black uppercase tracking-wider text-rose-100">{t("stickyTitle")}</p>
            <p className="text-sm font-black">{t("stickySub")}</p>
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-rose-700">{t("chatBtn")}</span>
      </Link>
    </main>
  );
}
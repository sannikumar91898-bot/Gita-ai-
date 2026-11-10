// app/daily/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft, Sun, Sparkles, Palette, Hash, RefreshCw, CalendarDays,
  Heart, AlertCircle, MessageCircle, TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

type DailyReading = {
  signName: string;
  focus: string;
  luckyColour?: { name: string; hex: string; };
  luckyNumber?: number;
  affirmation?: string;
  source?: string;
};

type ApiResponse = { reading?: unknown; source?: string; error?: string; };

// 🔥 10 Languages Dictionary
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: { title: "दैनिक राशिफल", intro: "अपनी राशि चुनें और आज का ज्योतिषीय मार्गदर्शन पढ़ें।", selectSign: "अपनी राशि चुनें", viewBtn: "राशिफल देखें", loading: "लोड हो रहा है...", preparing: "आज का राशिफल तैयार हो रहा है...", errorTitle: "राशिफल अभी नहीं दिख पा रहा", tryAgain: "फिर कोशिश करें", yourSign: "आपकी राशि", guidance: "आज का ज्योतिषीय मार्गदर्शन", luckyColor: "शुभ रंग", luckyNum: "शुभ अंक", affirmation: "आज का सकारात्मक विचार", noteTitle: "एक छोटी सी सलाह", note: "यह सामान्य राशिफल है। आपकी असली कहानी आपकी व्यक्तिगत कुंडली में है — एक बार हमारी महिला ज्योतिषियों में से किसी एक से दिल से चैट कर लें।", warning: "🌸 यह सामान्य राशिफल है। आपके जीवन की असली कहानी आपकी व्यक्तिगत कुंडली में छिपी है।", stickyTitle: "ज्योतिषी • 24x7 उपलब्ध", stickySub: "अभी बात करें — पहली चैट FREE", chatBtn: "चैट" },
    hinglish: { title: "Daily Rashifal", intro: "Apni rashi chuniye aur aaj ka astrology guidance padhiye.", selectSign: "Apni Rashi Chuniye", viewBtn: "Rashifal Dekhein", loading: "Loading...", preparing: "Aaj ka rashifal taiyar ho raha hai...", errorTitle: "Rashifal abhi nahi dikh pa raha", tryAgain: "Phir Koshish Karein", yourSign: "Aapki Rashi", guidance: "Aaj Ka Guidance", luckyColor: "Lucky Colour", luckyNum: "Lucky Number", affirmation: "Aaj Ka Positive Thought", noteTitle: "Ek Chhoti Si Salah", note: "Yeh general rashifal hai. Aapki asli kahani aapki vyaktigat kundli mein hai — ek baar hamari Mahila Jyotishiyon mein se kisi ek se dil se chat kar lein.", warning: "🌸 Yeh general rashifal hai. Aapke jeevan ki asli kahani aapki vyaktigat kundli mein chhipi hai.", stickyTitle: "Astrologer • 24x7 Available", stickySub: "Talk Now — First Chat FREE", chatBtn: "Chat" },
    en: { title: "Daily Horoscope", intro: "Select your zodiac sign and explore today's astrology guidance.", selectSign: "Choose Your Zodiac Sign", viewBtn: "View Horoscope", loading: "Loading...", preparing: "Preparing today's horoscope...", errorTitle: "Reading not available right now", tryAgain: "Try Again", yourSign: "Your Zodiac", guidance: "Today's Guidance", luckyColor: "Lucky Colour", luckyNum: "Lucky Number", affirmation: "Daily Affirmation", noteTitle: "A Gentle Note", note: "This is a general reading. Your real story lives in your personal chart — chat once from the heart with one of our Female Astrologers.", warning: "🌸 This is a general reading. The real story of your life is hidden in your personal chart.", stickyTitle: "Astrologer • 24x7 Available", stickySub: "Talk Now — First Chat FREE", chatBtn: "Chat" },
    te: { title: "దైనందిన జాతకం", intro: "మీ రాశి చిహ్నాన్ని ఎంచుకోండి మరియు నేటి జ్యోతిష్య మార్గదర్శకత్వాన్ని చదవండి.", selectSign: "మీ రాశి చిహ్నాన్ని ఎంచుకోండి", viewBtn: "జాతకం చూడండి", loading: "లోడ్ అవుతోంది...", preparing: "నేటి జాతకం సిద్ధమవుతోంది...", errorTitle: "జాతకం ఇప్పుడు అందుబాటులో లేదు", tryAgain: "మళ్లీ ప్రయత్నించండి", yourSign: "మీ రాశి", guidance: "నేటి మార్గదర్శకత్వం", luckyColor: "అదృష్ట రంగు", luckyNum: "అదృష్ట సంఖ్య", affirmation: "దైనందిన సంకల్పం", noteTitle: "ఒక చిన్న సూచన", note: "ఇది సాధారణ జాతకం. నిజమైన కథ మీ వ్యక్తిగత జాతకంలో ఉంది — మా మహిళా జ్యోతిష్యురాలితో చాట్ చేయండి.", warning: "🌸 ఇది సాధారణ జాతకం. మీ జీవిత అసలు కథ మీ వ్యక్తిగత జాతకంలో దాగి ఉంది.", stickyTitle: "జ్యోతిష్యుడు • 24x7 అందుబాటులో", stickySub: "ఇప్పుడే మాట్లాడండి — మొదటి చాట్ ఉచితం", chatBtn: "చాట్" },
    ta: { title: "தினசரி ராசிபலன்", intro: "உங்கள் ராசி அடையாளத்தைத் தேர்ந்தெடுத்து இன்றைய ஜோதிட வழிகாட்டுதலைப் படியுங்கள்.", selectSign: "உங்கள் ராசி அடையாளத்தைத் தேர்ந்தெடுக்கவும்", viewBtn: "ராசிபலனைப் பார்க்க", loading: "ஏற்றப்படுகிறது...", preparing: "இன்றைய ராசிபலன் தயாராகிறது...", errorTitle: "ராசிபலன் இப்போது கிடைக்கவில்லை", tryAgain: "மீண்டும் முயற்சிக்கவும்", yourSign: "உங்கள் ராசி", guidance: "இன்றைய வழிகாட்டுதல்", luckyColor: "அதிர்ஷ்ட நிறம்", luckyNum: "அதிர்ஷ்ட எண்", affirmation: "தினசரி உறுதிமொழி", noteTitle: "ஒரு சிறிய ஆலோசனை", note: "இது பொதுவான ராசிபலன். உண்மையான கதை உங்கள் தனிப்பட்ட ஜாதகத்தில் உள்ளது — எங்கள் பெண் ஜோதிடருடன் அரட்டையடிக்கவும்.", warning: "🌸 இது பொதுவான வாசிப்பு. உங்கள் வாழ்க்கையின் உண்மையான கதை உங்கள் தனிப்பட்ட ஜாதகத்தில் மறைந்துள்ளது.", stickyTitle: "ஜோதிடர் • 24x7 கிடைக்கும்", stickySub: "இப்போது பேசுங்கள் — முதல் அரட்டை இலவசம்", chatBtn: "அரட்டை" },
    kn: { title: "ದೈನಂದಿನ ರಾಶಿಫಲ", intro: "ನಿಮ್ಮ ರಾಶಿ ಚಿಹ್ನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಇಂದಿನ ಜ್ಯೋತಿಷ್ಯ ಮಾರ್ಗದರ್ಶನವನ್ನು ಓದಿ.", selectSign: "ನಿಮ್ಮ ರಾಶಿ ಚಿಹ್ನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", viewBtn: "ರಾಶಿಫಲ ನೋಡಿ", loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...", preparing: "ಇಂದಿನ ರಾಶಿಫಲ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...", errorTitle: "ರಾಶಿಫಲ ಈಗ ಲಭ್ಯವಿಲ್ಲ", tryAgain: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ", yourSign: "ನಿಮ್ಮ ರಾಶಿ", guidance: "ಇಂದಿನ ಮಾರ್ಗದರ್ಶನ", luckyColor: "ಅದೃಷ್ಟದ ಬಣ್ಣ", luckyNum: "ಅದೃಷ್ಟದ ಸಂಖ್ಯೆ", affirmation: "ದೈನಂದಿನ ಸಂಕಲ್ಪ", noteTitle: "ಒಂದು ಸಣ್ಣ ಸಲಹೆ", note: "ಇದು ಸಾಮಾನ್ಯ ರಾಶಿಫಲ. ನಿಜವಾದ ಕಥೆ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಕುಂಡಲಿಯಲ್ಲಿದೆ — ನಮ್ಮ ಮಹಿಳಾ ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ.", warning: "🌸 ಇದು ಸಾಮಾನ್ಯ ಓದುವಿಕೆ. ನಿಮ್ಮ ಜೀವನದ ನಿಜವಾದ ಕಥೆ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಕುಂಡಲಿಯಲ್ಲಿ ಅಡಗಿದೆ.", stickyTitle: "ಜ್ಯೋತಿಷಿ • 24x7 ಲಭ್ಯವಿದೆ", stickySub: "ಈಗ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ", chatBtn: "ಚಾಟ್" },
    bn: { title: "দৈনিক রাশিফল", intro: "আপনার রাশি চিহ্ন চয়ন করুন এবং আজকের জ্যোতিষ নির্দেশিকা পড়ুন।", selectSign: "আপনার রাশি চিহ্ন চয়ন করুন", viewBtn: "রাশিফল দেখুন", loading: "লোড হচ্ছে...", preparing: "আজকের রাশিফল তৈরি হচ্ছে...", errorTitle: "রাশিফল এখন উপলব্ধ নেই", tryAgain: "আবার চেষ্টা করুন", yourSign: "আপনার রাশি", guidance: "আজকের নির্দেশিকা", luckyColor: "শুভ রঙ", luckyNum: "শুভ সংখ্যা", affirmation: "দৈনিক প্রতিজ্ঞা", noteTitle: "একটি ছোট পরামর্শ", note: "এটি একটি সাধারণ রাশিফল। আসল গল্প আপনার ব্যক্তিগত কুণ্ডলীতে রয়েছে — আমাদের মহিলা জ্যোতিষীর সাথে চ্যাট করুন।", warning: "🌸 এটি একটি সাধারণ পাঠ। আপনার জীবনের আসল গল্প আপনার ব্যক্তিগত কুণ্ডলীতে লুকিয়ে আছে।", stickyTitle: "জ্যোতিষী • 24x7 উপলব্ধ", stickySub: "এখনই কথা বলুন — প্রথম চ্যাট ফ্রি", chatBtn: "চ্যাট" },
    mr: { title: "दैनिक राशीभविष्य", intro: "तुमची राशी निवडा आणि आजचे ज्योतिष मार्गदर्शन वाचा.", selectSign: "तुमची राशी निवडा", viewBtn: "राशीभविष्य पहा", loading: "लोड होत आहे...", preparing: "आजचे राशीभविष्य तयार होत आहे...", errorTitle: "राशीभविष्य आता उपलब्ध नाही", tryAgain: "पुन्हा प्रयत्न करा", yourSign: "तुमची राशी", guidance: "आजचे मार्गदर्शन", luckyColor: "शुभ रंग", luckyNum: "शुभ अंक", affirmation: "दैनिक संकल्प", noteTitle: "एक छोटी सी सल्ला", note: "हे सामान्य राशीभविष्य आहे. खरी गोष्ट तुमच्या वैयक्तिक कुंडलीत आहे — आमच्या महिला ज्योतिषाशी चॅट करा.", warning: "🌸 हे सामान्य वाचन आहे. तुमच्या जीवनातील खरी गोष्ट तुमच्या वैयक्तिक कुंडलीत लपलेली आहे.", stickyTitle: "ज्योतिषी • 24x7 उपलब्ध", stickySub: "आता बोला — पहिली चॅट मोफत", chatBtn: "चॅट" },
    gu: { title: "દૈનિક રાશિફળ", intro: "તમારી રાશિ પસંદ કરો અને આજનું જ્યોતિષ માર્ગદર્શન વાંચો.", selectSign: "તમારી રાશિ પસંદ કરો", viewBtn: "રાશિફળ જુઓ", loading: "લોડ થઈ રહ્યું છે...", preparing: "આજનું રાશિફળ તૈયાર થઈ રહ્યું છે...", errorTitle: "રાશિફળ હવે ઉપલબ્ધ નથી", tryAgain: "ફરી પ્રયાસ કરો", yourSign: "તમારી રાશિ", guidance: "આજનું માર્ગદર્શન", luckyColor: "શુભ રંગ", luckyNum: "શુભ અંક", affirmation: "દૈનિક સંકલ્પ", noteTitle: "એક નાની સલાહ", note: "આ સામાન્ય રાશિફળ છે. સાચી વાર્તા તમારી વ્યક્તિગત કુંડળીમાં છે — અમારા મહિલા જ્યોતિષી સાથે ચેટ કરો.", warning: "🌸 આ સામાન્ય વાંચન છે. તમારા જીવનની સાચી વાર્તા તમારી વ્યક્તિગત કુંડળીમાં છુપાયેલી છે.", stickyTitle: "જ્યોતિષી • 24x7 ઉપલબ્ધ", stickySub: "હમણાં વાત કરો — પ્રથમ ચેટ મફત", chatBtn: "ચેટ" },
    ml: { title: "ദൈനംദിന രാശിഫലം", intro: "നിങ്ങളുടെ രാശി അടയാളം തിരഞ്ഞെടുത്ത് ഇന്നത്തെ ജ്യോതിഷ മാർഗ്ഗനിർദ്ദേശം വായിക്കുക.", selectSign: "നിങ്ങളുടെ രാശി അടയാളം തിരഞ്ഞെടുക്കുക", viewBtn: "രാശിഫലം കാണുക", loading: "ലോഡ് ചെയ്യുന്നു...", preparing: "ഇന്നത്തെ രാശിഫലം തയ്യാറാക്കുന്നു...", errorTitle: "രാശിഫലം ഇപ്പോൾ ലഭ്യമല്ല", tryAgain: "വീണ്ടും ശ്രമിക്കുക", yourSign: "നിങ്ങളുടെ രാശി", guidance: "ഇന്നത്തെ മാർഗ്ഗനിർദ്ദേശം", luckyColor: "ഭാഗ്യ നിറം", luckyNum: "ഭാഗ്യ നമ്പർ", affirmation: "ദൈനംദിന സത്യവാങ്മൂലം", noteTitle: "ഒരു ചെറിയ ഉപദേശം", note: "ഇതൊരു പൊതുവായ രാശിഫലമാണ്. യഥാർത്ഥ കഥ നിങ്ങളുടെ വ്യക്തിഗത ജാതകത്തിലുണ്ട് — ഞങ്ങളുടെ വനിതാ ജ്യോതിഷിയുമായി ചാറ്റ് ചെയ്യുക.", warning: "🌸 ഇതൊരു പൊതുവായ വായനയാണ്. നിങ്ങളുടെ ജീവിതത്തിന്റെ യഥാർത്ഥ കഥ നിങ്ങളുടെ വ്യക്തിഗത ജാതകത്തിൽ ഒളിഞ്ഞിരിക്കുന്നു.", stickyTitle: "ജ്യോതിഷി • 24x7 ലഭ്യമാണ്", stickySub: "ഇപ്പോൾ സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം", chatBtn: "ചാറ്റ്" },
  };
  return ui[lang]?.[key] || ui["en"][key];
};

// 🔥 10 Languages Zodiac Signs List
const SIGNS = [
  { id: "General", hi: "सामान्य", hg: "General", en: "General", te: "సాధారణ", ta: "பொது", kn: "ಸಾಮಾನ್ಯ", bn: "সাধারণ", mr: "सामान्य", gu: "સામાન્ય", ml: "പൊതുവായത്" },
  { id: "Mesh (Aries)", hi: "मेष", hg: "Mesh", en: "Aries", te: "మేషం", ta: "மேஷம்", kn: "ಮೇಷ", bn: "মেষ", mr: "मेष", gu: "મેષ", ml: "മേഷം" },
  { id: "Vrishabh (Taurus)", hi: "वृषभ", hg: "Vrishabh", en: "Taurus", te: "వృషభం", ta: "ரிஷபம்", kn: "ವೃಷಭ", bn: "বৃষভ", mr: "वृषभ", gu: "વૃષભ", ml: "വൃഷഭം" },
  { id: "Mithun (Gemini)", hi: "मिथुन", hg: "Mithun", en: "Gemini", te: "మిథునం", ta: "மிதுனம்", kn: "ಮಿಥುನ", bn: "মিথুন", mr: "मिथुन", gu: "મિથુન", ml: "മിഥുനം" },
  { id: "Karka (Cancer)", hi: "कर्क", hg: "Karka", en: "Cancer", te: "కర్కాటకం", ta: "கடகம்", kn: "ಕರ್ಕ", bn: "কর্কট", mr: "कर्क", gu: "કર્ક", ml: "കർക്കടകം" },
  { id: "Simha (Leo)", hi: "सिंह", hg: "Simha", en: "Leo", te: "సింహం", ta: "சிம்மம்", kn: "ಸಿಂಹ", bn: "সিংহ", mr: "सिंह", gu: "સિંહ", ml: "സിംഹം" },
  { id: "Kanya (Virgo)", hi: "कन्या", hg: "Kanya", en: "Virgo", te: "కన్యా", ta: "கன்னி", kn: "ಕನ್ಯಾ", bn: "কন্যা", mr: "कन्या", gu: "કન્યા", ml: "കന്നി" },
  { id: "Tula (Libra)", hi: "तुला", hg: "Tula", en: "Libra", te: "తులా", ta: "துலாம்", kn: "ತುಲಾ", bn: "তুলা", mr: "तूळ", gu: "તુલા", ml: "തുലാം" },
  { id: "Vrishchik (Scorpio)", hi: "वृश्चिक", hg: "Vrishchik", en: "Scorpio", te: "వృశ్చికం", ta: "விருச்சிகம்", kn: "ವೃಶ್ಚಿಕ", bn: "বৃশ্চিক", mr: "वृश्चिक", gu: "વૃશ્ચિક", ml: "വൃശ്ചികം" },
  { id: "Dhanu (Sagittarius)", hi: "धनु", hg: "Dhanu", en: "Sagittarius", te: "ధనుస్సు", ta: "தனுசு", kn: "ಧನು", bn: "ধনু", mr: "धनु", gu: "ધનુ", ml: "ധനു" },
  { id: "Makar (Capricorn)", hi: "मकर", hg: "Makar", en: "Capricorn", te: "మకరం", ta: "மகரம்", kn: "ಮಕರ", bn: "মকর", mr: "मकर", gu: "મકર", ml: "മകരം" },
  { id: "Kumbh (Aquarius)", hi: "कुम्भ", hg: "Kumbh", en: "Aquarius", te: "కుంభం", ta: "கும்பம்", kn: "ಕುಂಭ", bn: "কুম্ভ", mr: "कुंभ", gu: "કુંભ", ml: "കുംഭം" },
  { id: "Meen (Pisces)", hi: "मीन", hg: "Meen", en: "Pisces", te: "మీనం", ta: "மீனம்", kn: "ಮೀನ", bn: "মীন", mr: "मीन", gu: "મીન", ml: "മീനം" },
];

export default function DailyPage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";

  const [sign, setSign] = useState("General");
  const [reading, setReading] = useState<DailyReading | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const t = (key: string) => getUIText(lang, key);

  const today = new Date().toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadReading() {
      setLoading(true);
      setError("");
      setReading(null);

      try {
        const params = new URLSearchParams({ sign, lang });
        const response = await fetch(`/api/daily?${params.toString()}`, {
          method: "GET", headers: { Accept: "application/json" }, cache: "no-store", signal: controller.signal,
        });

        const data: ApiResponse | null = await response.json().catch(() => null);

        if (!response.ok) throw new Error(data?.error || "Horoscope unavailable.");
        if (!data || !data.reading || typeof data.reading !== "object") throw new Error("Invalid data.");

        const raw = data.reading as Record<string, unknown>;

        if (typeof raw.signName !== "string" || typeof raw.focus !== "string" || !raw.focus.trim()) {
          throw new Error("Incomplete data.");
        }

        const rawColour = raw.luckyColour && typeof raw.luckyColour === "object" ? (raw.luckyColour as Record<string, unknown>) : null;
        const luckyColour = rawColour && typeof rawColour.name === "string" && typeof rawColour.hex === "string" && /^#[0-9a-fA-F]{6}$/.test(rawColour.hex)
          ? { name: rawColour.name, hex: rawColour.hex } : undefined;

        const luckyNumber = typeof raw.luckyNumber === "number" && Number.isInteger(raw.luckyNumber) && raw.luckyNumber >= 1 && raw.luckyNumber <= 99
          ? raw.luckyNumber : undefined;

        const affirmation = typeof raw.affirmation === "string" ? raw.affirmation : undefined;

        setReading({ signName: raw.signName, focus: raw.focus, luckyColour, luckyNumber, affirmation, source: typeof raw.source === "string" ? raw.source : data.source });
      } catch (err) {
        if (controller.signal.aborted) return;
        setReading(null);
        setError(err instanceof Error ? err.message : "Unable to load.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadReading();
    return () => { controller.abort(); };
  }, [sign, lang, refreshKey]);

  const selectedSign = SIGNS.find((item) => item.id === sign);
  const signLabel = selectedSign ? ((selectedSign as any)[lang] || selectedSign.en) : sign;

  const pageClass = isDark ? "bg-slate-950 text-violet-50" : "bg-gradient-to-b from-orange-50/40 to-white text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-slate-900/70" : "border-orange-100 bg-white shadow-xl";
  const mutedClass = isDark ? "text-slate-300" : "text-gray-600";

  return (
    <main className={`min-h-screen w-full px-4 pb-40 pt-5 ${pageClass}`}>
      <div className="mx-auto max-w-xl space-y-5">
        
        {/* HEADER */}
        <header className={`flex items-center justify-between gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" aria-label="Back to home" className={`rounded-xl p-2 ${isDark ? "bg-slate-800 text-violet-200" : "bg-orange-50 text-orange-600"}`}>
              <ArrowLeft size={18} />
            </Link>
            <div className="min-w-0">
              <h1 className="flex items-center gap-1.5 text-base font-black uppercase tracking-tight text-orange-600">
                <Sun className="shrink-0 text-amber-500" size={18} />
                <span className="truncate">{t("title")}</span>
              </h1>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-gray-400">
                <CalendarDays size={12} /> {today}
              </p>
            </div>
          </div>
          <button type="button" onClick={() => setRefreshKey((value) => value + 1)} disabled={loading} aria-label="Refresh horoscope" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 transition hover:bg-orange-500/20 disabled:opacity-50">
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          </button>
        </header>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-500 p-6 text-white shadow-xl">
          <div className="relative z-10 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20"><Sparkles size={25} /></div>
            <h2 className="text-2xl font-black">{t("title")}</h2>
            <p className="max-w-sm text-sm leading-6 text-orange-50">{t("intro")}</p>
          </div>
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -right-4 h-32 w-32 rounded-full bg-yellow-200/10 blur-2xl" />
        </section>

        {/* WARNING */}
        <section className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-rose-800">
          <div className="flex items-start gap-2">
            <TriangleAlert size={20} className="mt-0.5 shrink-0 text-rose-500" />
            <p className="text-sm font-semibold leading-6">{t("warning")}</p>
          </div>
        </section>

        {/* SELECTOR */}
        <section className={`space-y-3 rounded-2xl border p-4 ${cardClass}`}>
          <label htmlFor="daily-sign" className="block text-sm font-bold">{t("selectSign")}</label>
          <select id="daily-sign" value={sign} onChange={(event) => setSign(event.target.value)} className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 ${isDark ? "border-slate-700 bg-slate-800 text-white" : "border-orange-200 bg-orange-50 text-gray-900"}`}>
            {SIGNS.map((item) => (
              <option key={item.id} value={item.id}>
                {(item as any)[lang] || item.en}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => setRefreshKey((value) => value + 1)} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-md transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            {loading ? t("loading") : t("viewBtn")}
          </button>
        </section>

        {/* LOADING */}
        {loading && (
          <section className={`rounded-2xl border p-8 text-center ${cardClass}`}>
            <RefreshCw size={30} className="mx-auto animate-spin text-orange-500" />
            <p className="mt-3 text-sm font-semibold">{t("preparing")}</p>
          </section>
        )}

        {/* ERROR */}
        {!loading && error && (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertCircle size={19} />
              <h3 className="text-sm font-black">{t("errorTitle")}</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-rose-700">{error}</p>
            <button type="button" onClick={() => setRefreshKey((value) => value + 1)} className="mt-4 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white">
              {t("tryAgain")}
            </button>
          </section>
        )}

        {/* RESULT */}
        {!loading && reading && (
          <section className={`space-y-5 rounded-2xl border p-5 ${cardClass}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-500">{t("yourSign")}</p>
                <h2 className="mt-1 text-xl font-black">{signLabel}</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500"><Sun size={25} /></div>
            </div>

            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-black text-orange-500"><Sparkles size={17} /> {t("guidance")}</h3>
              <p className={`whitespace-pre-wrap text-sm leading-7 ${mutedClass}`}>{reading.focus}</p>
            </div>

            {reading.luckyColour && (
              <div className="flex items-center gap-3 rounded-xl bg-orange-500/5 p-3">
                <div className="h-11 w-11 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: reading.luckyColour.hex }} />
                <div>
                  <p className="text-xs text-gray-400">{t("luckyColor")}</p>
                  <p className="text-sm font-bold">{reading.luckyColour.name}</p>
                </div>
                <Palette size={19} className="ml-auto text-orange-500" />
              </div>
            )}

            {typeof reading.luckyNumber === "number" && (
              <div className="flex items-center gap-3 rounded-xl bg-orange-500/5 p-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500/10 text-orange-500"><Hash size={20} /></div>
                <div>
                  <p className="text-xs text-gray-400">{t("luckyNum")}</p>
                  <p className="text-lg font-black">{reading.luckyNumber}</p>
                </div>
              </div>
            )}

            {reading.affirmation && (
              <div className="rounded-xl border border-orange-200/30 bg-orange-500/5 p-4">
                <p className="mb-2 flex items-center gap-2 text-xs font-black text-orange-500"><Heart size={15} /> {t("affirmation")}</p>
                <p className="text-sm leading-6">{reading.affirmation}</p>
              </div>
            )}

            <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-rose-800">
              <p className="flex items-center gap-2 text-xs font-black text-rose-500"><Heart size={15} /> {t("noteTitle")}</p>
              <p className="mt-1 text-xs font-semibold leading-5">{t("note")}</p>
            </div>
          </section>
        )}
      </div>

      {/* STICKY CTA */}
      <Link href="/chat" className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 px-4 py-3.5 text-white shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20"><MessageCircle size={18} /></span>
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
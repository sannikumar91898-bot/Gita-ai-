// app/matching/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, Heart, Sparkles, MessageCircle, Download, 
  RefreshCw, ShieldAlert, MapPin, Calendar, Clock, CheckCircle2,
  Home, Sun, User, Crown, Share2, FileText, RotateCcw
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

// 🔥 Loading Text for 10 Languages
const getLoadingSteps = (lang: string) => {
  const steps: Record<string, string[]> = {
    hi: ["ग्रहों की स्थिति मिलाई जा रही है...", "नाड़ी और भकूट स्कोर की गणना...", "मंगल दोष का विश्लेषण...", "कॉस्मिक रिपोर्ट तैयार हो रही है..."],
    hinglish: ["Planetary positions align ho rahi hain...", "Nadi aur Bhakoot score calculate ho raha hai...", "Manglik Dosha analyze ho raha hai...", "Cosmic report taiyaar ho rahi hai..."],
    en: ["Aligning planetary positions...", "Calculating Nadi and Bhakoot scores...", "Analyzing Manglik Dosha...", "Generating Cosmic Diagnostic Report..."],
    te: ["గ్రహ స్థానాలు సరిచేయబడుతున్నాయి...", "నాడి మరియు భకూట్ స్కోర్లు లెక్కిస్తోంది...", "మంగళ దోషాన్ని విశ్లేషిస్తోంది...", "కాస్మిక్ నివేదిక సిద్ధమవుతోంది..."],
    ta: ["கிரக நிலைகள் சீரமைக்கப்படுகின்றன...", "நாடி மற்றும் பகூட் மதிப்பெண்கள் கணக்கிடப்படுகிறது...", "மங்கள தோஷம் ஆராயப்படுகிறது...", "காஸ்மிக் அறிக்கை தயாராகிறது..."],
    kn: ["ಗ್ರಹಗಳ ಸ್ಥಾನಗಳನ್ನು ಜೋಡಿಸಲಾಗುತ್ತಿದೆ...", "ನಾಡಿ ಮತ್ತು ಭಕೂಟ್ ಸ್ಕೋರ್ಗಳನ್ನು ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ...", "ಮಂಗಳ ದೋಷವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...", "ಕಾಸ್ಮಿಕ್ ವರದಿ ಸಿದ್ಧವಾಗುತ್ತಿದೆ..."],
    bn: ["গ্রহের অবস্থান সারিবদ্ধ করা হচ্ছে...", "নাড়ি এবং ভকূট স্কোর গণনা করা হচ্ছে...", "মঙ্গল দোষ বিশ্লেষণ করা হচ্ছে...", "কসমিক রিপোর্ট তৈরি হচ্ছে..."],
    mr: ["ग्रहांची स्थिती जुळवली जात आहे...", "नाडी आणि भकूट स्कोअर मोजले जात आहे...", "मंगळ दोषाचे विश्लेषण केले जात आहे...", "कॉस्मिक अहवाल तयार होत आहे..."],
    gu: ["ગ્રહોની સ્થિતિ ગોઠવાઈ રહી છે...", "નાડી અને ભકૂટ સ્કોરની ગણતરી થઈ રહી છે...", "મંગળ દોષનું વિશ્લેષણ થઈ રહ્યું છે...", "કોસ્મિક રિપોર્ટ તૈયાર થઈ રહ્યો છે..."],
    ml: ["ഗ്രഹസ്ഥാനങ്ങൾ ക്രമീകരിക്കുന്നു...", "നാഡിയും ഭകൂട്ടും കണക്കാക്കുന്നു...", "ചൊവ്വാദോഷം വിശകലനം ചെയ്യുന്നു...", "കോസ്മിക് റിപ്പോർട്ട് തയ്യാറാക്കുന്നു..."],
  };
  return steps[lang] || steps["hinglish"];
};

// 🔥 Global Translation Helper for UI
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: { 
      title: "कुंडली मिलान", subtitle: "सटीक विवाह मिलान", boy: "वर (लड़के) का विवरण", girl: "वधू (लड़की) का विवरण", 
      name: "पूरा नाम", city: "जन्म स्थान (City)", matchBtn: "मिलान करें", alertCity: "कृपया लिस्ट से शहर चुनें!", 
      result: "मिलान परिणाम", total: "/ 36 कुल अष्टकूट मिलान", breakdown: "विस्तृत विवरण", 
      chat: "ज्योतिषी से बात करें — पहली चैट FREE", pdf: "PDF डाउनलोड", reset: "दोबारा बनाएं",
      bannerTitle: "ज्योतिषी • 24x7 उपलब्ध", bannerSub: "रुकावट का कारण जानने के लिए चैट करें — FREE",
      warning: "विवाह जीवन का सबसे बड़ा निर्णय है। कुंडली में छिपे दोष (जैसे मंगल दोष) रिश्तों में रुकावट ला सकते हैं।",
      home: "होम", chatNav: "चैट", daily: "राशिफल", profile: "प्रोफाइल",
      scoreTitle: "कुल अष्टकूट स्कोर", scoreSub: "दोनों कुंडलियों का मिलान", 
      excellent: "उत्कृष्ट मिलान", good: "अच्छा मिलान", avg: "औसत मिलान", poor: "कमज़ोर मिलान"
    },
    hinglish: { 
      title: "Kundli Milan", subtitle: "Accurate Marriage Matching", boy: "Boy's Details", girl: "Girl's Details", 
      name: "Full Name", city: "Birth City", matchBtn: "Milan Karein", alertCity: "Kripya list me se city select karein!", 
      result: "Matching Result", total: "/ 36 Total Ashtakoot", breakdown: "Detailed Breakdown", 
      chat: "Jyotishi se baat karein — Pehli chat FREE", pdf: "PDF Download", reset: "Reset",
      bannerTitle: "Astrologer • 24x7 Available", bannerSub: "Rukawat ka karan jaanne ke liye chat karein — FREE",
      warning: "Vivah jeevan ka sabse bada nirnay hai. Kundli mein chhipe dosh rishton mein rukawat la sakte hain.",
      home: "Home", chatNav: "Chat", daily: "Daily", profile: "Profile",
      scoreTitle: "Total Ashtakoot Score", scoreSub: "Match of both Kundlis", 
      excellent: "Excellent Match", good: "Good Match", avg: "Average Match", poor: "Poor Match"
    },
    en: { 
      title: "Kundli Matching", subtitle: "Accurate Marriage Matching", boy: "Boy's Details", girl: "Girl's Details", 
      name: "Full Name", city: "Birth City", matchBtn: "Match Now", alertCity: "Please select a valid city from the list!", 
      result: "Matching Result", total: "/ 36 Total Ashtakoot", breakdown: "Detailed Breakdown", 
      chat: "Talk to Astrologer — First chat FREE", pdf: "PDF Download", reset: "Reset",
      bannerTitle: "Astrologer • 24x7 Available", bannerSub: "Chat to know the cause of blockage — FREE",
      warning: "Marriage is life's biggest decision. Hidden doshas can bring obstructions.",
      home: "Home", chatNav: "Chat", daily: "Daily", profile: "Profile",
      scoreTitle: "Total Ashtakoot Score", scoreSub: "Match of both Kundlis", 
      excellent: "Excellent Match", good: "Good Match", avg: "Average Match", poor: "Poor Match"
    },
    te: { title: "కుండలి మిలన్", subtitle: "ఖచ్చితమైన వివాహ మ్యాచింగ్", boy: "అబ్బాయి వివరాలు", girl: "అమ్మాయి వివరాలు", name: "పూర్తి పేరు", city: "పుట్టిన నగరం", matchBtn: "మ్యాచ్ చేయండి", alertCity: "దయచేసి జాబితా నుండి నగరాన్ని ఎంచుకోండి!", result: "మ్యాచింగ్ ఫలితం", total: "/ 36 మొత్తం అష్టకూట్", breakdown: "వివరమైన విభజన", chat: "జ్యోతిష్యుడితో మాట్లాడండి — మొదటి చాట్ FREE", pdf: "PDF", reset: "రీసెట్", bannerTitle: "జ్యోతిష్యుడు • 24x7 అందుబాటులో", bannerSub: "అడ్డంకి కారణం తెలుసుకోవడానికి చాట్ చేయండి", warning: "వివాహం జీవితంలో అతిపెద్ద నిర్ణయం. దాచిన దోషాలు అడ్డంకులు కలిగిస్తాయి.", home: "హోమ్", chatNav: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్", scoreTitle: "మొత్తం అష్టకూట్ స్కోరు", scoreSub: "రెండు కుండలీల మ్యాచ్", excellent: "అద్భుతమైన మ్యాచ్", good: "మంచి మ్యాచ్", avg: "సగటు మ్యాచ్", poor: "బలహీనమైన మ్యాచ్" },
    ta: { title: "ஜாதக பொருத்தம்", subtitle: "துல்லியமான திருமண பொருத்தம்", boy: "ஆண் விவரங்கள்", girl: "பெண் விவரங்கள்", name: "முழு பெயர்", city: "பிறந்த நகரம்", matchBtn: "பொருத்தம் பார்க்க", alertCity: "பட்டியலில் இருந்து நகரத்தை தேர்ந்தெடுக்கவும்!", result: "பொருத்தம் முடிவு", total: "/ 36 மொத்த அஷ்டகூடம்", breakdown: "விரிவான பிரிவு", chat: "ஜோதிடரிடம் பேசுங்கள் — முதல் அரட்டை FREE", pdf: "PDF", reset: "மீட்டமை", bannerTitle: "ஜோதிடர் • 24x7 கிடைக்கும்", bannerSub: "தடைக்கான காரணத்தை அறிய அரட்டை செய்யுங்கள்", warning: "திருமணம் வாழ்க்கையின் மிகப்பெரிய முடிவு. மறைந்துள்ள தோஷங்கள் தடைகளை ஏற்படுத்தும்.", home: "முகப்பு", chatNav: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்", scoreTitle: "மொத்த அஷ்டகூட மதிப்பெண்", scoreSub: "இரு ஜாதகங்களின் பொருத்தம்", excellent: "சிறந்த பொருத்தம்", good: "நல்ல பொருத்தம்", avg: "சராசரி பொருத்தம்", poor: "மோசமான பொருத்தம்" },
    kn: { title: "ಕುಂಡಲಿ ಹೊಂದಾಣಿಕೆ", subtitle: "ನಿಖರವಾದ ವಿವಾಹ ಹೊಂದಾಣಿಕೆ", boy: "ಹುಡುಗನ ವಿವರಗಳು", girl: "ಹುಡುಗಿಯ ವಿವರಗಳು", name: "ಪೂರ್ಣ ಹೆಸರು", city: "ಹುಟ್ಟಿದ ನಗರ", matchBtn: "ಹೊಂದಿಸಿ", alertCity: "ದಯವಿಟ್ಟು ಪಟ್ಟಿಯಿಂದ ನಗರವನ್ನು ಆಯ್ಕೆಮಾಡಿ!", result: "ಹೊಂದಾಣಿಕೆಯ ಫಲಿತಾಂಶ", total: "/ 36 ಒಟ್ಟು ಅಷ್ಟಕೂಟ", breakdown: "ವಿವರವಾದ ವಿಭಜನೆ", chat: "ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ FREE", pdf: "PDF", reset: "ಮರುಹೊಂದಿಸಿ", bannerTitle: "ಜ್ಯೋತಿಷಿ • 24x7 ಲಭ್ಯವಿದೆ", bannerSub: "ತಡೆಯ ಕಾರಣವನ್ನು ತಿಳಿಯಲು ಚಾಟ್ ಮಾಡಿ", warning: "ವಿವಾಹವು ಜೀವನದ ದೊಡ್ಡ ನಿರ್ಧಾರವಾಗಿದೆ. ಗುಪ್ತ ದೋಷಗಳು ತಡೆಗಳನ್ನು ತರಬಹುದು.", home: "ಮುಖಪುಟ", chatNav: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್", scoreTitle: "ಒಟ್ಟು ಅಷ್ಟಕೂಟ ಸ್ಕೋರ್", scoreSub: "ಎರಡೂ ಕುಂಡಲಿಗಳ ಹೊಂದಾಣಿಕೆ", excellent: "ಅತ್ಯುತ್ತಮ ಹೊಂದಾಣಿಕೆ", good: "ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ", avg: "ಸರಾಸರಿ ಹೊಂದಾಣಿಕೆ", poor: "ಕಳಪೆ ಹೊಂದಾಣಿಕೆ" },
    bn: { title: "কুণ্ডলী মিলন", subtitle: "সঠিক বিবাহ ম্যাচিং", boy: "ছেলের বিবরণ", girl: "মেয়ের বিবরণ", name: "পুরো নাম", city: "জন্ম শহর", matchBtn: "মিলন করুন", alertCity: "অনুগ্রহ করে তালিকা থেকে শহর নির্বাচন করুন!", result: "মিলন ফলাফল", total: "/ 36 মোট অষ্টকূট", breakdown: "বিস্তারিত ব্রেকডাউন", chat: "জ্যোতিষীর সাথে কথা বলুন — প্রথম চ্যাট FREE", pdf: "PDF", reset: "রিসেট", bannerTitle: "জ্যোতিষী • 24x7 উপলব্ধ", bannerSub: "বাধার কারণ জানতে চ্যাট করুন", warning: "বিবাহ জীবনের সবচেয়ে বড় সিদ্ধান্ত। লুকানো দোষ বাধা সৃষ্টি করতে পারে।", home: "হোম", chatNav: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল", scoreTitle: "মোট অষ্টকূট স্কোর", scoreSub: "উভয় কুণ্ডলীর মিলন", excellent: "চমৎকার মিলন", good: "ভালো মিলন", avg: "গড় মিলন", poor: "দুর্বল মিলন" },
    mr: { title: "कुंडली मिलन", subtitle: "अचूक विवाह जुळणी", boy: "मुलाचे तपशील", girl: "मुलीचे तपशील", name: "पूर्ण नाव", city: "जन्म शहर", matchBtn: "जुळवा", alertCity: "कृपया यादीतून शहर निवडा!", result: "जुळणी निकाल", total: "/ 36 एकूण अष्टकूट", breakdown: "तपशीलवार विभागणी", chat: "ज्योतिषाशी बोला — पहिली चॅट FREE", pdf: "PDF", reset: "रीसेट", bannerTitle: "ज्योतिषी • 24x7 उपलब्ध", bannerSub: "अडथळ्याचे कारण जाणून घेण्यासाठी चॅट करा", warning: "विवाह हा जीवनातील सर्वात मोठा निर्णय आहे. लपलेले दोष अडथळे आणू शकतात.", home: "होम", chatNav: "चॅट", daily: "दैनिक", profile: "प्रोफाइल", scoreTitle: "एकूण अष्टकूट स्कोअर", scoreSub: "दोन्ही कुंडलींची जुळणी", excellent: "उत्कृष्ट जुळणी", good: "चांगली जुळणी", avg: "सरासरी जुळणी", poor: "कमकुवत जुळणी" },
    gu: { title: "કુંડળી મેળાપ", subtitle: "સચોટ લગ્ન મેચિંગ", boy: "છોકરાની વિગતો", girl: "છોકરીની વિગતો", name: "પૂરું નામ", city: "જન્મ શહેર", matchBtn: "મેળવો", alertCity: "કૃપા કરીને સૂચિમાંથી શહેર પસંદ કરો!", result: "મેચિંગ પરિણામ", total: "/ 36 કુલ અષ્ટકૂટ", breakdown: "વિગતવાર વિભાજન", chat: "જ્યોતિષી સાથે વાત કરો — પ્રથમ ચેટ FREE", pdf: "PDF", reset: "રીસેટ", bannerTitle: "જ્યોતિષી • 24x7 ઉપલબ્ધ", bannerSub: "અવરોધનું કારણ જાણવા ચેટ કરો", warning: "લગ્ન એ જીવનનો સૌથી મોટો નિર્ણય છે. છુપાયેલા દોષ અવરોધ લાવી શકે છે.", home: "હોમ", chatNav: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ", scoreTitle: "કુલ અષ્ટકૂટ સ્કોર", scoreSub: "બંને કુંડળીની મેચિંગ", excellent: "ઉત્કૃષ્ટ મેચિંગ", good: "સારું મેચિંગ", avg: "સરેરાશ મેચિંગ", poor: "નબળું મેચિંગ" },
    ml: { title: "കുണ്ഡലി മാച്ചിംഗ്", subtitle: "കൃത്യമായ വിവാഹ മാച്ചിംഗ്", boy: "ആൺകുട്ടിയുടെ വിവരങ്ങൾ", girl: "പെൺകുട്ടിയുടെ വിവരങ്ങൾ", name: "പൂർണ്ണ നാമം", city: "ജനന നഗരം", matchBtn: "മാച്ച് ചെയ്യുക", alertCity: "ലിസ്റ്റിൽ നിന്ന് ഒരു നഗരം തിരഞ്ഞെടുക്കുക!", result: "മാച്ചിംഗ് ഫലം", total: "/ 36 മൊത്തം അഷ്ടകൂട്ടം", breakdown: "വിശദമായ വിഭജനം", chat: "ജ്യോതിഷിയോട് സംസാരിക്കുക — ആദ്യ ചാറ്റ് FREE", pdf: "PDF", reset: "പുനഃസജ്ജമാക്കുക", bannerTitle: "ജ്യോതിഷി • 24x7 ലഭ്യമാണ്", bannerSub: "തടസ്സത്തിന്റെ കാരണം അറിയാൻ ചാറ്റ് ചെയ്യുക", warning: "വിവാഹം ജീവിതത്തിലെ ഏറ്റവും വലിയ തീരുമാനമാണ്. മറഞ്ഞിരിക്കുന്ന ദോഷങ്ങൾ തടസ്സങ്ങൾ ഉണ്ടാക്കാം.", home: "ഹോം", chatNav: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ", scoreTitle: "മൊത്തം അഷ്ടകൂട്ട സ്കോർ", scoreSub: "രണ്ട് കുണ്ഡലികളുടെയും മാച്ചിംഗ്", excellent: "മികച്ച മാച്ചിംഗ്", good: "നല്ല മാച്ചിംഗ്", avg: "ശരാശരി മാച്ചിംഗ്", poor: "മോശം മാച്ചിംഗ്" },
  };
  return ui[lang]?.[key] || ui["en"][key];
};

export default function MatchingPage() {
  const { lang, theme } = useApp();
  const isDark = theme === "dark";
  
  const [boy, setBoy] = useState({ name: "", dob: "", time: "", city: "", lat: "", lon: "" });
  const [girl, setGirl] = useState({ name: "", dob: "", time: "", city: "", lat: "", lon: "" });
  
  const [boySuggestions, setBoySuggestions] = useState([]);
  const [girlSuggestions, setGirlSuggestions] = useState([]);
  
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  // Helper to get localized text
  const t = (key: string) => getUIText(lang, key);

  // Premium Colors (Full Width adjustments)
  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c] shadow-lg" : "border-orange-100 bg-white shadow-xl";
  const inputClass = `w-full rounded-xl border px-4 py-3.5 text-[14px] font-medium outline-none transition-all focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 ${isDark ? "border-slate-700 bg-[#0A0F19] text-white" : "border-gray-200 bg-gray-50 text-slate-900"}`;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const steps = getLoadingSteps(lang);
    if (loading) {
      setLoadingText(steps[0]);
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % steps.length;
        setLoadingText(steps[i]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading, lang]);

  const searchCity = async (query: string, setSuggestions: any) => {
    if (query.length < 3) { setSuggestions([]); return; }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`);
      const data = await res.json();
      setSuggestions(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    const delay = setTimeout(() => searchCity(boy.city, setBoySuggestions), 600);
    return () => clearTimeout(delay);
  }, [boy.city]);

  useEffect(() => {
    const delay = setTimeout(() => searchCity(girl.city, setGirlSuggestions), 600);
    return () => clearTimeout(delay);
  }, [girl.city]);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boy.lat || !girl.lat) {
      alert(t("alertCity"));
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boy, girl, language: lang }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResult(data);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    if (!resultRef.current) return;
    setIsDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: 0.4,
        filename: `${boy.name}_${girl.name}_Milan.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: isDark ? "#0f172a" : "#ffffff" },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };
      await html2pdf().set(opt).from(resultRef.current).save();
    } catch (error) {
      console.error("PDF Error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const resetForm = () => {
    setBoy({ name: "", dob: "", time: "", city: "", lat: "", lon: "" });
    setGirl({ name: "", dob: "", time: "", city: "", lat: "", lon: "" });
    setResult(null);
  };

  return (
    // 🔥 Full Screen Layout (w-full aur min-h-[100dvh])
    <main className={`min-h-[100dvh] w-full pb-36 ${pageClass} font-sans`}>
      
      {/* Container - w-full aur px-3 kiya gaya hai taaki side se chipke */}
      <div className="w-full px-3 pt-4 space-y-5 flex-1">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2.5 transition-colors ${isDark ? "bg-[#0A0F19] text-slate-300" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[17px] font-black uppercase tracking-tight text-[#ff6b00]">
              {t("title")}
            </h1>
            <p className={`text-[11px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>
              {t("subtitle")}
            </p>
          </div>
        </header>

        {/* FORM SCREEN */}
        {!result && !loading && (
          <>
            <div className={`rounded-xl border p-4 ${isDark ? "border-rose-500/30 bg-[#2a151a]" : "border-red-200 bg-red-50"}`}>
              <p className={`flex items-start gap-2 text-[12.5px] font-bold leading-relaxed ${isDark ? "text-rose-200" : "text-red-700"}`}>
                <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                {t("warning")}
              </p>
            </div>

            <form onSubmit={handleMatch} className={`space-y-5 rounded-[1.5rem] border p-4 sm:p-5 ${cardClass}`}>
              
              {/* BOY DETAILS */}
              <div className={`space-y-3.5 p-4 rounded-2xl border ${isDark ? "border-slate-800 bg-[#0A0F19]/50" : "border-gray-200 bg-gray-50"}`}>
                <h3 className="text-[14px] font-bold text-[#ff6b00] flex items-center gap-2">
                  <span className="bg-[#ff6b00]/10 p-1.5 rounded-lg text-[16px]">👦</span> {t("boy")}
                </h3>
                <input type="text" required placeholder={t("name")} value={boy.name} onChange={e => setBoy({...boy, name: e.target.value})} className={inputClass} />
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="date" required value={boy.dob} onChange={e => setBoy({...boy, dob: e.target.value})} className={`${inputClass} pl-10`} />
                  </div>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="time" required value={boy.time} onChange={e => setBoy({...boy, time: e.target.value})} className={`${inputClass} pl-10`} />
                  </div>
                </div>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="text" required placeholder={t("city")} value={boy.city} onChange={e => setBoy({...boy, city: e.target.value, lat: "", lon: ""})} className={`${inputClass} pl-10`} />
                  {boySuggestions.length > 0 && (
                    <ul className={`absolute z-10 w-full mt-1 rounded-xl max-h-40 overflow-y-auto shadow-2xl border ${isDark ? "bg-[#151d2c] border-slate-700" : "bg-white border-gray-200"}`}>
                      {boySuggestions.map((item: any) => (
                        <li key={item.place_id} className={`px-4 py-2.5 text-[12px] font-medium cursor-pointer hover:bg-[#ff6b00]/10 ${isDark ? "text-slate-200" : "text-slate-800"}`} onClick={() => { setBoy({ ...boy, city: item.display_name.split(',')[0], lat: item.lat, lon: item.lon }); setBoySuggestions([]); }}>
                          {item.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex justify-center text-[#ff6b00] py-1">
                <Heart size={26} fill="currentColor" className="animate-pulse drop-shadow-md" />
              </div>

              {/* GIRL DETAILS */}
              <div className={`space-y-3.5 p-4 rounded-2xl border ${isDark ? "border-slate-800 bg-[#0A0F19]/50" : "border-gray-200 bg-gray-50"}`}>
                <h3 className="text-[14px] font-bold text-[#ff6b00] flex items-center gap-2">
                  <span className="bg-[#ff6b00]/10 p-1.5 rounded-lg text-[16px]">👧</span> {t("girl")}
                </h3>
                <input type="text" required placeholder={t("name")} value={girl.name} onChange={e => setGirl({...girl, name: e.target.value})} className={inputClass} />
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="date" required value={girl.dob} onChange={e => setGirl({...girl, dob: e.target.value})} className={`${inputClass} pl-10`} />
                  </div>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="time" required value={girl.time} onChange={e => setGirl({...girl, time: e.target.value})} className={`${inputClass} pl-10`} />
                  </div>
                </div>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="text" required placeholder={t("city")} value={girl.city} onChange={e => setGirl({...girl, city: e.target.value, lat: "", lon: ""})} className={`${inputClass} pl-10`} />
                  {girlSuggestions.length > 0 && (
                    <ul className={`absolute z-10 w-full mt-1 rounded-xl max-h-40 overflow-y-auto shadow-2xl border ${isDark ? "bg-[#151d2c] border-slate-700" : "bg-white border-gray-200"}`}>
                      {girlSuggestions.map((item: any) => (
                        <li key={item.place_id} className={`px-4 py-2.5 text-[12px] font-medium cursor-pointer hover:bg-[#ff6b00]/10 ${isDark ? "text-slate-200" : "text-slate-800"}`} onClick={() => { setGirl({ ...girl, city: item.display_name.split(',')[0], lat: item.lat, lon: item.lon }); setGirlSuggestions([]); }}>
                          {item.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] px-4 py-4 text-[15px] font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-2">
                {loading ? loadingText : t("matchBtn")}
              </button>
            </form>
          </>
        )}

        {/* LOADING SCREEN */}
        {loading && (
          <div className={`flex flex-col items-center justify-center h-[50vh] rounded-[1.5rem] border ${cardClass}`}>
            <Sparkles size={40} className="text-[#ff6b00] animate-spin mb-4" />
            <p className="text-[15px] font-bold text-[#ff6b00] animate-pulse text-center px-4">{loadingText}</p>
          </div>
        )}

        {/* RESULT SCREEN (Jo aapke code me adhura tha) */}
        {result && !loading && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* PDF TARGET AREA */}
            <div ref={resultRef} className={`space-y-5 rounded-[1.5rem] border-2 p-5 sm:p-6 relative overflow-hidden ${isDark ? "border-orange-900/30 bg-[#151d2c]" : "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50"}`}>
              
              {/* Result Header */}
              <div className="text-center pb-2 border-b border-slate-800/50">
                <h2 className="text-[22px] font-black text-[#ff6b00]">{t("result")}</h2>
                <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{t("scoreSub")}</p>
              </div>

              {/* Score Circle */}
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative h-36 w-36 flex items-center justify-center">
                  <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="transparent" className={isDark ? "text-slate-800" : "text-gray-200"} />
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * (result.totalScore || 0)) / 36} className="text-[#ff6b00]" strokeLinecap="round" />
                  </svg>
                  <span className="text-[42px] font-black text-[#ff6b00] drop-shadow-sm">{result.totalScore || 0}</span>
                </div>
                <p className="text-[13px] font-bold text-slate-400 mt-2">{t("total")}</p>
                <div className={`mt-3 px-4 py-1.5 rounded-full text-[12px] font-bold ${result.totalScore >= 25 ? "bg-green-500/20 text-green-500" : result.totalScore >= 18 ? "bg-yellow-500/20 text-yellow-500" : "bg-rose-500/20 text-rose-500"}`}>
                  {result.totalScore >= 25 ? t("excellent") : result.totalScore >= 18 ? t("good") : result.totalScore >= 12 ? t("avg") : t("poor")}
                </div>
              </div>

              {/* Breakdown (Assuming result.breakdown is an array) */}
              {result.breakdown && Array.isArray(result.breakdown) && (
                <div className="space-y-3 pt-3">
                  <h3 className="text-[14px] font-bold text-[#ff6b00] border-b border-slate-800/50 pb-2">{t("breakdown")}</h3>
                  {result.breakdown.map((item: any, idx: number) => (
                    <div key={idx} className={`flex justify-between items-center p-3 rounded-xl border ${isDark ? "bg-[#0A0F19] border-slate-800" : "bg-white border-gray-200"}`}>
                      <div className="flex flex-col">
                        <span className={`text-[13px] font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}>{item.name}</span>
                        <span className="text-[11px] text-slate-500">{item.description}</span>
                      </div>
                      <div className="flex items-center gap-1 font-bold">
                        <span className="text-[14px] text-[#ff6b00]">{item.score}</span>
                        <span className="text-[12px] text-slate-500">/{item.maxScore || 8}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons (Chat, Download, Reset) */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Link href="/chat" className="col-span-2 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#d81b60] to-[#e91e63] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-pink-500/20 active:scale-95 transition-transform text-[14px]">
                <MessageCircle size={18} /> {t("chat")}
              </Link>
              
              <button onClick={downloadPdf} disabled={isDownloading} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[13px] border transition-colors ${isDark ? "bg-[#151d2c] border-slate-700 text-slate-300 hover:bg-slate-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                {isDownloading ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />} {t("pdf")}
              </button>
              
              <button onClick={resetForm} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[13px] border transition-colors ${isDark ? "bg-[#151d2c] border-slate-700 text-slate-300 hover:bg-slate-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                <RotateCcw size={16} /> {t("reset")}
              </button>
            </div>
          </div>
        )}

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
            <span className="text-[11px] font-medium">{t("chatNav")}</span>
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
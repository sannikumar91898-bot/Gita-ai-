// app/matching/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, Heart, Sparkles, MessageCircle, Download,
  ShieldAlert, MapPin, Calendar, Clock, ChevronDown, ChevronUp,
  Home, User, Share2, FileText, Star, AlertCircle,
  CheckCircle2, ArrowRight, RefreshCw, Sun, Lock, Wallet
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "../Providers";

// ============================================================
// 1. CITIES DATA FOR SEARCH
// ============================================================
const INDIAN_CITIES = [
  { name: "Patna, Bihar", lat: 25.5941, lng: 85.1376, timeZone: "Asia/Kolkata" },
  { name: "Delhi, NCR", lat: 28.6139, lng: 77.2090, timeZone: "Asia/Kolkata" },
  { name: "Mumbai, Maharashtra", lat: 19.0760, lng: 72.8777, timeZone: "Asia/Kolkata" },
  { name: "Lucknow, Uttar Pradesh", lat: 26.8467, lng: 80.9462, timeZone: "Asia/Kolkata" },
  { name: "Jaipur, Rajasthan", lat: 26.9124, lng: 75.7873, timeZone: "Asia/Kolkata" },
  { name: "Bhopal, Madhya Pradesh", lat: 23.2599, lng: 77.4126, timeZone: "Asia/Kolkata" },
  { name: "Kolkata, West Bengal", lat: 22.5726, lng: 88.3639, timeZone: "Asia/Kolkata" },
  { name: "Chennai, Tamil Nadu", lat: 13.0827, lng: 80.2707, timeZone: "Asia/Kolkata" },
  { name: "Bengaluru, Karnataka", lat: 12.9716, lng: 77.5946, timeZone: "Asia/Kolkata" },
  { name: "Hyderabad, Telangana", lat: 17.3850, lng: 78.4867, timeZone: "Asia/Kolkata" },
  { name: "Ahmedabad, Gujarat", lat: 23.0225, lng: 72.5714, timeZone: "Asia/Kolkata" },
  { name: "Pune, Maharashtra", lat: 18.5204, lng: 73.8567, timeZone: "Asia/Kolkata" },
];

// ============================================================
// 2. CITY SEARCH COMPONENT (Dropdown)
// ============================================================
const CitySearchInput = ({ value, onChange, placeholder, className }: any) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");

  const filteredCities = INDIAN_CITIES.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <input
        type="text"
        className={className}
        value={searchTerm}
        placeholder={placeholder}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onChange(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />
      {showDropdown && searchTerm && (
        <ul className="absolute z-50 w-full bg-[#1e1e2d] border border-gray-700 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-xl">
          {filteredCities.length > 0 ? (
            filteredCities.map((city, idx) => (
              <li
                key={idx}
                className="p-3 hover:bg-gray-700 cursor-pointer text-white text-sm border-b border-gray-800 last:border-0"
                onClick={() => {
                  setSearchTerm(city.name);
                  onChange(city.name);
                  setShowDropdown(false);
                }}
              >
                {city.name}
              </li>
            ))
          ) : (
            <li className="p-3 text-gray-400 text-sm">City not found in list</li>
          )}
        </ul>
      )}
    </div>
  );
};

// ============================================================
// 3. LOADING STEPS (10 Languages)
// ============================================================
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

// ============================================================
// 4. UI TEXT & DICTIONARY (10 Languages + New SEO/FAQ)
// ============================================================
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: {
      title: "कुंडली मिलान", subtitle: "सटीक विवाह मिलान", boy: "वर (लड़के) का विवरण", girl: "वधू (लड़की) का विवरण",
      name: "पूरा नाम", city: "जन्म स्थान (City)", matchBtn: "मिलान करें", alertCity: "कृपया लिस्ट से शहर चुनें!",
      result: "मिलान परिणाम", total: "/ 36 कुल अष्टकूट मिलान", breakdown: "सभी 8 गुणों का गणित देखें",
      chat: "ज्योतिषी से बात करें — पहली चैट FREE", pdf: "PDF डाउनलोड", reset: "दोबारा बनाएं", share: "WhatsApp पर भेजें",
      bannerTitle: "ज्योतिषी • 24x7 उपलब्ध", bannerSub: "मिलान को गहराई से समझने के लिए चैट करें — FREE",
      warning: "सही मिलान समझने से रिश्ता और मजबूत बनता है। यह रिपोर्ट आपको सही दिशा देने के लिए है।",
      home: "होम", chatNav: "चैट", daily: "राशिफल", profile: "प्रोफाइल",
      doshaTitle: "दोष और उनका निवारण", strengths: "आपकी 3 सबसे बड़ी ताकत", attention: "ध्यान देने वाली बातें",
      advice: "व्यवहारिक सलाह", nextSteps: "अगला कदम", soulLabel: "रिश्ते का निचोड़",
      doshaPresent: "उपस्थित", doshaCancelled: "निवारित", doshaAbsent: "कोई दोष नहीं",
      manglik: "मंगल दोष", nadi: "नाड़ी दोष", bhakoot: "भकूट दोष",
      disclaimer: "यह रिपोर्ट पारंपरिक वैदिक ज्योतिष पर आधारित है।",
      askQ: "और जानना चाहते हैं?", q1: "क्या हमारी शादी में परिवार आसानी से मान जाएगा?", q2: "हमारी कुंडली के अनुसार शादी का सबसे शुभ समय कब है?", q3: "करियर और धन पर इस रिश्ते का क्या असर होगा?",
      labelUtkrisht: "उत्कृष्ट मिलान", labelBahutAcha: "बहुत अच्छा मिलान", labelAcha: "अच्छा मिलान", labelAusat: "औसत मिलान", labelSudhar: "सुधार की गुंजाइश",
      boyPrefix: "वर", girlPrefix: "वधू", limitTitle: "आपकी फ्री लिमिट खत्म हो गई है!",
      limitSub: "आगे कुंडली मिलान के लिए वॉलेट रिचार्ज करें या ज्योतिषी से बात करें।", recharge: "वॉलेट रिचार्ज करें",
      seoTitle: "कुंडली मिलान के बारे में", 
      seoDesc: "हिंदू धर्म में विवाह से पहले कुंडली मिलान करना बहुत महत्वपूर्ण माना जाता है। यह वर और वधू के भविष्य, स्वभाव और ग्रहों की स्थिति को समझने में मदद करता है। सही मिलान से रिश्ता मजबूत होता है।",
      faqTitle: "अक्सर पूछे जाने वाले प्रश्न (FAQs)", 
      faq1Q: "कुंडली मिलान में 36 गुण क्या हैं?", 
      faq1A: "वैदिक ज्योतिष में 8 अलग-अलग श्रेणियों (अष्टकूट) में कुल 36 गुण होते हैं। जितने अधिक गुण मिलते हैं, विवाह उतना ही शुभ माना जाता है (18+ गुण अच्छे माने जाते हैं)।", 
      faq2Q: "क्या मांगलिक दोष विवाह में बाधा है?", 
      faq2A: "जरूरी नहीं। अगर दोनों पक्षों में मांगलिक दोष हो या कुछ विशेष उपाय किए जाएं, तो यह दोष शांत हो जाता है। GitaTalk आपको सटीक विश्लेषण और उपाय देता है।", 
      footerText: "यह रिपोर्ट सामान्य जानकारी के लिए है। सटीक परिणामों के लिए किसी अच्छे ज्योतिषी से परामर्श लें।"
    },
    hinglish: {
      title: "Kundli Milan", subtitle: "Accurate Marriage Matching", boy: "Boy's Details", girl: "Girl's Details",
      name: "Full Name", city: "Birth City", matchBtn: "Milan Karein", alertCity: "Kripya list me se city select karein!",
      result: "Matching Result", total: "/ 36 Total Ashtakoot", breakdown: "Saare 8 gunon ka ganit dekhein",
      chat: "Jyotishi se baat karein — Pehli chat FREE", pdf: "PDF Download", reset: "Reset", share: "WhatsApp par bhejein",
      bannerTitle: "Astrologer • 24x7 Available", bannerSub: "Milan ki gehrai samajhne ke liye chat karein — FREE",
      warning: "Sahi milan samajhne se rishta aur mazboot banta hai. Yeh report aapko sahi disha dene ke liye hai.",
      home: "Home", chatNav: "Chat", daily: "Daily", profile: "Profile",
      doshaTitle: "Dosh aur Unka Nivaran", strengths: "Aapki 3 Sabse Badi Taaqat", attention: "Dhyan Dene Wali Baatein",
      advice: "Vyavaharik Salah", nextSteps: "Agla Kadam", soulLabel: "Rishte ka Nichod",
      doshaPresent: "Upasthit", doshaCancelled: "Nivarit", doshaAbsent: "Koi Dosh Nahi",
      manglik: "Manglik Dosh", nadi: "Nadi Dosh", bhakoot: "Bhakoot Dosh",
      disclaimer: "Yeh report traditional Vedic astrology par aadharit hai.",
      askQ: "Aur jaanna chahte hain?", q1: "Kya hamari shaadi mein family aasani se maan jayegi?", q2: "Hamari kundli ke anusaar shaadi ka sabse shubh samay kab hai?", q3: "Career aur dhan par is rishte ka kya asar hoga?",
      labelUtkrisht: "Utkrisht Milan", labelBahutAcha: "Bahut Acha Milan", labelAcha: "Acha Milan", labelAusat: "Ausat Milan", labelSudhar: "Sudhar ki Gunjayish",
      boyPrefix: "Var", girlPrefix: "Vadhu", limitTitle: "Aapki Free Limit Khatam Ho Gayi Hai!",
      limitSub: "Aage matching ke liye wallet recharge karein ya jyotishi se baat karein.", recharge: "Wallet Recharge",
      seoTitle: "Kundli Matching ke baare mein",
      seoDesc: "Hindu dharm mein vivah se pehle Kundli Milan karna bahut zaroori maana jata hai. Yeh var aur vadhu ke future, swabhav aur grahon ki sthiti samajhne mein madad karta hai. Sahi milan se rishta mazboot hota hai.",
      faqTitle: "Frequently Asked Questions (FAQs)",
      faq1Q: "Kundli Milan mein 36 Gun kya hain?",
      faq1A: "Vedic astrology mein 8 alag categories (Ashtakoot) mein total 36 gun hote hain. Jitne zyada gun milte hain, vivah utna hi shubh mana jata hai (18+ gun ache maane jate hain).",
      faq2Q: "Kya Manglik Dosh vivah mein badha hai?",
      faq2A: "Zaroori nahi. Agar dono partners Manglik hon ya kuch upay kiye jaayein, toh yeh dosh shaant ho jata hai. GitaTalk aapko sahi analysis deta hai.",
      footerText: "Yeh report general information ke liye hai. Accurate results ke liye astrologer se consult karein."
    },
    en: {
      title: "Kundli Matching", subtitle: "Accurate Marriage Matching", boy: "Boy's Details", girl: "Girl's Details",
      name: "Full Name", city: "Birth City", matchBtn: "Match Now", alertCity: "Please select a valid city from the list!",
      result: "Matching Result", total: "/ 36 Total Ashtakoot", breakdown: "See all 8 koota calculations",
      chat: "Talk to Astrologer — First chat FREE", pdf: "PDF Download", reset: "Reset", share: "Share on WhatsApp",
      bannerTitle: "Astrologer • 24x7 Available", bannerSub: "Chat to deeply understand the match — FREE",
      warning: "Understanding the match better strengthens the relationship. This report gives you right direction.",
      home: "Home", chatNav: "Chat", daily: "Daily", profile: "Profile",
      doshaTitle: "Doshas & Their Cancellation", strengths: "Your 3 Greatest Strengths", attention: "Areas of Attention",
      advice: "Practical Advice", nextSteps: "Next Steps", soulLabel: "Soul Summary",
      doshaPresent: "Present", doshaCancelled: "Cancelled", doshaAbsent: "No Dosha",
      manglik: "Manglik Dosha", nadi: "Nadi Dosha", bhakoot: "Bhakoot Dosha",
      disclaimer: "This report is based on traditional Vedic astrology.",
      askQ: "Want to know more?", q1: "Will our families easily agree to this marriage?", q2: "What is the most auspicious time for marriage as per our charts?", q3: "How will this relationship affect career and wealth?",
      labelUtkrisht: "Excellent Match", labelBahutAcha: "Very Good Match", labelAcha: "Good Match", labelAusat: "Average Match", labelSudhar: "Needs Improvement",
      boyPrefix: "Groom", girlPrefix: "Bride", limitTitle: "Your Free Limit is Exhausted!",
      limitSub: "Recharge your wallet or talk to an astrologer for further matchings.", recharge: "Recharge Wallet",
      seoTitle: "About Kundli Matching",
      seoDesc: "In Hinduism, Kundli matching before marriage is considered very important. It helps understand the future, nature, and planetary positions of the groom and bride. A good match strengthens the relationship.",
      faqTitle: "Frequently Asked Questions (FAQs)",
      faq1Q: "What are the 36 Gunas in Kundli Matching?",
      faq1A: "In Vedic astrology, there are 36 Gunas across 8 different categories (Ashtakoot). The more Gunas match, the more auspicious the marriage is considered (18+ is generally good).",
      faq2Q: "Is Manglik Dosha a barrier to marriage?",
      faq2A: "Not necessarily. If both partners are Manglik or certain remedies are performed, the dosha is pacified. GitaTalk provides accurate analysis and remedies.",
      footerText: "This report is for general information. Consult an astrologer for accurate calculations."
    }
  };

  // Fallback for other languages (Copy English content if not translated yet)
  const defaultLang = ui["en"];
  const currentLang = ui[lang] || defaultLang;

  // Agar kisi nayi bhasha mein key missing hai, to English se utha lega
  return currentLang[key] || defaultLang[key] || key; 
};
// ============================================================
// MAIN COMPONENT
// ============================================================
export default function MatchingPage() {
  const router = useRouter();
  const { user, language = "hinglish", refreshUser } = useApp() as any;
  
  // Form States
  const [boyName, setBoyName] = useState("");
  const [boyDob, setBoyDob] = useState("");
  const [boyTime, setBoyTime] = useState("");
  const [boyPlace, setBoyPlace] = useState("");

  const [girlName, setGirlName] = useState("");
  const [girlDob, setGirlDob] = useState("");
  const [girlTime, setGirlTime] = useState("");
  const [girlPlace, setGirlPlace] = useState("");

  // UI States
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [limitExceeded, setLimitExceeded] = useState(false);

  const t = (key: string) => getUIText(language, key);
  const loadingSteps = getLoadingSteps(language);

  // Loading animation effect
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading, loadingSteps.length]);

  // Date Format Fix (Converts DD/MM/YYYY to YYYY-MM-DD)
  const formatDateForBackend = (dateStr: string) => {
    if (!dateStr) return "";
    if (dateStr.includes('/')) {
      const [d, m, y] = dateStr.split('/');
      return `${y}-${m}-${d}`;
    }
    return dateStr; // Already YYYY-MM-DD (from standard date picker)
  };

  const handleMatch = async () => {
    setError("");
    if (!boyPlace || !girlPlace) {
      setError(t('alertCity'));
      return;
    }
    
    setLoading(true);
    
    try {
      const payload = {
        boy: {
          name: boyName,
          dateOfBirth: formatDateForBackend(boyDob),
          timeOfBirth: boyTime,
          placeOfBirth: boyPlace
        },
        girl: {
          name: girlName,
          dateOfBirth: formatDateForBackend(girlDob),
          timeOfBirth: girlTime,
          placeOfBirth: girlPlace
        },
        language: language
      };

      const res = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setLimitExceeded(true);
        }
        throw new Error(data.message || "Kundli calculation mein problem aayi.");
      }

      setResult(data);
      if (refreshUser) refreshUser(); // Wallet balance update karne ke liye
    } catch (err: any) {
      setError(err.message || "Kuch galat ho gaya. Kripya thodi der baad try karein.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError("");
    setLimitExceeded(false);
  };
    // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-[#13111c] text-white pb-20">
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-[#13111c]/90 backdrop-blur-md border-b border-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="p-2 bg-[#1e1e2d] rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-orange-500 font-bold text-lg">{t('title')}</h1>
            <p className="text-xs text-gray-400">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {!result ? (
          <>
            {/* FORM SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* BOY DETAILS */}
              <div className="bg-[#1e1e2d] p-4 rounded-xl border border-gray-800">
                <h2 className="text-blue-400 font-semibold mb-4 text-sm">{t('boy')}</h2>
                <div className="space-y-3">
                  <input type="text" placeholder={t('name')} value={boyName} onChange={(e) => setBoyName(e.target.value)} className="w-full bg-[#13111c] text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-sm" />
                  <input type="date" value={boyDob} onChange={(e) => setBoyDob(e.target.value)} className="w-full bg-[#13111c] text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-sm" />
                  <input type="time" value={boyTime} onChange={(e) => setBoyTime(e.target.value)} className="w-full bg-[#13111c] text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-sm" />
                  <CitySearchInput 
                    value={boyPlace} 
                    onChange={(val: string) => setBoyPlace(val)} 
                    placeholder={t('city')} 
                    className="w-full bg-[#13111c] text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-sm" 
                  />
                </div>
              </div>

              {/* GIRL DETAILS */}
              <div className="bg-[#1e1e2d] p-4 rounded-xl border border-gray-800">
                <h2 className="text-pink-400 font-semibold mb-4 text-sm">{t('girl')}</h2>
                <div className="space-y-3">
                  <input type="text" placeholder={t('name')} value={girlName} onChange={(e) => setGirlName(e.target.value)} className="w-full bg-[#13111c] text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-pink-500 text-sm" />
                  <input type="date" value={girlDob} onChange={(e) => setGirlDob(e.target.value)} className="w-full bg-[#13111c] text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-pink-500 text-sm" />
                  <input type="time" value={girlTime} onChange={(e) => setGirlTime(e.target.value)} className="w-full bg-[#13111c] text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-pink-500 text-sm" />
                  <CitySearchInput 
                    value={girlPlace} 
                    onChange={(val: string) => setGirlPlace(val)} 
                    placeholder={t('city')} 
                    className="w-full bg-[#13111c] text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-pink-500 text-sm" 
                  />
                </div>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">
                {error}
              </div>
            )}

            {/* LIMIT EXCEEDED */}
            {limitExceeded && (
              <div className="bg-orange-500/10 border border-orange-500/50 text-orange-400 p-4 rounded-xl mb-4 text-center">
                <p className="font-bold mb-2">{t('limitTitle')}</p>
                <p className="text-sm mb-4">{t('limitSub')}</p>
                <button onClick={() => router.push('/wallet')} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold">
                  {t('recharge')}
                </button>
              </div>
            )}

            {/* MATCH BUTTON */}
            {!loading && (
              <button onClick={handleMatch} className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">
                <Heart size={20} /> {t('matchBtn')}
              </button>
            )}

            {/* LOADING STATE */}
            {loading && (
              <div className="bg-[#1e1e2d] p-8 rounded-xl border border-gray-800 text-center mt-4">
                <RefreshCw className="animate-spin mx-auto text-orange-500 mb-4" size={32} />
                <p className="text-white text-sm animate-pulse">{loadingSteps[loadingStep]}</p>
              </div>
            )}
          </>
        ) : (
          /* RESULT SECTION (Aapka purana result logic yahan aayega) */
          <div className="bg-[#1e1e2d] p-6 rounded-xl border border-gray-800 text-center">
            <h2 className="text-2xl font-bold text-orange-500 mb-2">{t('result')}</h2>
            <div className="text-5xl font-bold text-white mb-2">{result.totalScore} <span className="text-lg text-gray-400">{t('total')}</span></div>
            <button onClick={handleReset} className="mt-6 bg-[#13111c] border border-gray-700 text-white px-6 py-2 rounded-lg">
              {t('reset')}
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* SEO & FAQ SECTION (Daily Panchang jaisa design) */}
        {/* ============================================================ */}
        <div className="mt-8 mb-10">
          {/* SEO TEXT */}
          <div className="bg-[#1e1e2d] rounded-xl p-5 mb-6 border border-gray-800">
            <h2 className="text-white text-lg font-semibold mb-3">{t('seoTitle')}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{t('seoDesc')}</p>
          </div>

          {/* FAQS */}
          <div className="bg-[#1e1e2d] rounded-xl p-5 border border-gray-800">
            <h3 className="text-white text-lg font-semibold mb-4">{t('faqTitle')}</h3>
            <div className="mb-4">
              <p className="text-white font-medium text-sm mb-1">Q: {t('faq1Q')}</p>
              <p className="text-gray-400 text-sm">A: {t('faq1A')}</p>
            </div>
            <div>
              <p className="text-white font-medium text-sm mb-1">Q: {t('faq2Q')}</p>
              <p className="text-gray-400 text-sm">A: {t('faq2A')}</p>
            </div>
          </div>

          {/* FOOTER DISCLAIMER */}
          <p className="text-center text-xs text-gray-500 mt-6 px-4">
            {t('footerText')}
          </p>
        </div>

      </div>
    </div>
  );
  
                                                                    }

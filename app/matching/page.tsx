// app/matching/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft, Heart, Sparkles, MessageCircle, Download,
  ShieldAlert, ChevronDown, ChevronUp,
  Home, User, Share2, Star, AlertCircle,
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
// 2. SHARED STYLE TOKENS
// ============================================================
const INPUT_CLASS =
  "w-full bg-[#0f0c1a]/80 text-white placeholder-gray-500 px-4 py-3 rounded-xl border border-white/10 " +
  "focus:outline-none focus:border-orange-400/70 focus:ring-2 focus:ring-orange-400/20 text-sm transition-all";

const CARD_CLASS =
  "relative bg-gradient-to-br from-[#221c36] to-[#17132a] border border-white/10 rounded-2xl shadow-xl shadow-black/30";

// ============================================================
// 3. CITY SEARCH COMPONENT (Dropdown)
// ============================================================
const CitySearchInput = ({ value, onChange, placeholder, className }: any) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");

  useEffect(() => {
    if (value === "") setSearchTerm("");
  }, [value]);

  const filteredCities = INDIAN_CITIES.filter((city) =>
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
        <ul className="absolute z-50 w-full bg-[#1c1730] border border-white/10 rounded-xl mt-2 max-h-48 overflow-y-auto shadow-2xl shadow-black/50">
          {filteredCities.length > 0 ? (
            filteredCities.map((city, idx) => (
              <li
                key={idx}
                className="px-4 py-3 hover:bg-orange-500/15 cursor-pointer text-white text-sm border-b border-white/5 last:border-0 transition-colors"
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
            <li className="px-4 py-3 text-gray-400 text-sm">City not found in list</li>
          )}
        </ul>
      )}
    </div>
  );
};

// ============================================================
// 4. LOADING STEPS (10 Languages)
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
// 5. UI TEXT & DICTIONARY (Hindi, Hinglish, English + fallback)
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
      boyPrefix: "वर", girlPrefix: "वधू",
      limitTitle: "✨ आपकी पूरी कुंडली रिपोर्ट तैयार है",
      limitSub: "गुण मिलान के साथ मांगलिक और अन्य दोषों का विस्तार से विश्लेषण देखें। वॉलेट रिचार्ज करके पूरी रिपोर्ट अनलॉक करें।",
      recharge: "वॉलेट रिचार्ज करें",
      seoTitle: "कुंडली मिलान के बारे में",
      seoDesc: "हिंदू धर्म में विवाह से पहले कुंडली मिलान करना बहुत महत्वपूर्ण माना जाता है। यह वर और वधू के भविष्य, स्वभाव और ग्रहों की स्थिति को समझने में मदद करता है। सही मिलान से रिश्ता मजबूत होता है।",
      faqTitle: "अक्सर पूछे जाने वाले प्रश्न (FAQs)",
      faq1Q: "कुंडली मिलान में 36 गुण क्या हैं?",
      faq1A: "वैदिक ज्योतिष में 8 अलग-अलग श्रेणियों (अष्टकूट) में कुल 36 गुण होते हैं। जितने अधिक गुण मिलते हैं, विवाह उतना ही शुभ माना जाता है (18+ गुण अच्छे माने जाते हैं)।",
      faq2Q: "क्या मांगलिक दोष विवाह में बाधा है?",
      faq2A: "जरूरी नहीं। अगर दोनों पक्षों में मांगलिक दोष हो या कुछ विशेष उपाय किए जाएं, तो यह दोष शांत हो जाता है। GitaTalk आपको सटीक विश्लेषण और उपाय देता है।",
      footerText: "यह रिपोर्ट सामान्य जानकारी के लिए है। सटीक परिणामों के लिए किसी अच्छे ज्योतिषी से परामर्श लें।",
      talkAstro: "ज्योतिषी से बात करें",
      errCalc: "कुंडली गणना में समस्या आई।", errGeneric: "कुछ गलत हो गया। कृपया थोड़ी देर बाद फिर कोशिश करें।"
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
      boyPrefix: "Var", girlPrefix: "Vadhu",
      limitTitle: "✨ Aapki puri Kundli report taiyaar hai",
      limitSub: "Guna Milan ke saath Manglik aur anya doshon ka vistaar se vishleshan dekhein. Wallet recharge karke puri report unlock karein.",
      recharge: "Wallet Recharge Karein",
      seoTitle: "Kundli Matching ke baare mein",
      seoDesc: "Hindu dharm mein vivah se pehle Kundli Milan karna bahut zaroori maana jata hai. Yeh var aur vadhu ke future, swabhav aur grahon ki sthiti samajhne mein madad karta hai. Sahi milan se rishta mazboot hota hai.",
      faqTitle: "Frequently Asked Questions (FAQs)",
      faq1Q: "Kundli Milan mein 36 Gun kya hain?",
      faq1A: "Vedic astrology mein 8 alag categories (Ashtakoot) mein total 36 gun hote hain. Jitne zyada gun milte hain, vivah utna hi shubh mana jata hai (18+ gun ache maane jate hain).",
      faq2Q: "Kya Manglik Dosh vivah mein badha hai?",
      faq2A: "Zaroori nahi. Agar dono partners Manglik hon ya kuch upay kiye jaayein, toh yeh dosh shaant ho jata hai. GitaTalk aapko sahi analysis deta hai.",
      footerText: "Yeh report general information ke liye hai. Accurate results ke liye astrologer se consult karein.",
      talkAstro: "Jyotishi se baat karein",
      errCalc: "Kundli calculation mein problem aayi.", errGeneric: "Kuch galat ho gaya. Kripya thodi der baad try karein."
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
      boyPrefix: "Groom", girlPrefix: "Bride",
      limitTitle: "✨ Your full Kundli report is ready",
      limitSub: "See a detailed analysis of Guna Milan, Manglik and other doshas. Recharge your wallet to unlock the full report.",
      recharge: "Recharge Wallet",
      seoTitle: "About Kundli Matching",
      seoDesc: "In Hinduism, Kundli matching before marriage is considered very important. It helps understand the future, nature, and planetary positions of the groom and bride. A good match strengthens the relationship.",
      faqTitle: "Frequently Asked Questions (FAQs)",
      faq1Q: "What are the 36 Gunas in Kundli Matching?",
      faq1A: "In Vedic astrology, there are 36 Gunas across 8 different categories (Ashtakoot). The more Gunas match, the more auspicious the marriage is considered (18+ is generally good).",
      faq2Q: "Is Manglik Dosha a barrier to marriage?",
      faq2A: "Not necessarily. If both partners are Manglik or certain remedies are performed, the dosha is pacified. GitaTalk provides accurate analysis and remedies.",
      footerText: "This report is for general information. Consult an astrologer for accurate calculations.",
      talkAstro: "Talk to Astrologer",
      errCalc: "There was a problem calculating the Kundli.", errGeneric: "Something went wrong. Please try again in a while."
    },
    te: {
      title: "కుండలి మ్యాచింగ్", subtitle: "ఖచ్చితమైన వివాహ మ్యాచింగ్", boy: "వరుడి వివరాలు", girl: "వధువు వివరాలు",
      name: "పూర్తి పేరు", city: "జన్మ స్థలం (నగరం)", matchBtn: "మ్యాచ్ చేయండి", alertCity: "దయచేసి జాబితా నుండి నగరాన్ని ఎంచుకోండి!",
      result: "మ్యాచింగ్ ఫలితం", total: "/ 36 మొత్తం అష్టకూట గుణాలు", breakdown: "మొత్తం 8 కూటాల లెక్కలు చూడండి",
      chat: "జ్యోతిష్కుడితో మాట్లాడండి — మొదటి చాట్ ఉచితం", pdf: "PDF డౌన్‌లోడ్", reset: "మళ్లీ ప్రారంభించండి", share: "WhatsApp లో షేర్ చేయండి",
      bannerTitle: "జ్యోతిష్కుడు • 24x7 అందుబాటులో", bannerSub: "మ్యాచ్‌ను లోతుగా తెలుసుకోవడానికి చాట్ చేయండి — ఉచితం",
      warning: "మ్యాచ్‌ను సరిగ్గా అర్థం చేసుకుంటే బంధం మరింత బలపడుతుంది. ఈ నివేదిక మీకు సరైన దిశ చూపుతుంది.",
      home: "హోమ్", chatNav: "చాట్", daily: "రాశిఫలం", profile: "ప్రొఫైల్",
      doshaTitle: "దోషాలు మరియు పరిహారాలు", strengths: "మీ 3 గొప్ప బలాలు", attention: "శ్రద్ధ పెట్టవలసిన అంశాలు",
      advice: "ఆచరణాత్మక సలహా", nextSteps: "తదుపరి అడుగు", soulLabel: "బంధం సారాంశం",
      doshaPresent: "ఉంది", doshaCancelled: "నివారించబడింది", doshaAbsent: "దోషం లేదు",
      manglik: "మంగళ దోషం", nadi: "నాడి దోషం", bhakoot: "భకూట దోషం",
      disclaimer: "ఈ నివేదిక సంప్రదాయ వైదిక జ్యోతిష్యంపై ఆధారపడింది.",
      askQ: "మరింత తెలుసుకోవాలనుకుంటున్నారా?", q1: "మన పెళ్లికి కుటుంబాలు సులభంగా అంగీకరిస్తాయా?", q2: "మన జాతకాల ప్రకారం పెళ్లికి అత్యంత శుభ సమయం ఏది?", q3: "ఈ బంధం కెరీర్ మరియు ధనంపై ఎలా ప్రభావం చూపుతుంది?",
      labelUtkrisht: "అత్యుత్తమ మ్యాచ్", labelBahutAcha: "చాలా మంచి మ్యాచ్", labelAcha: "మంచి మ్యాచ్", labelAusat: "సగటు మ్యాచ్", labelSudhar: "మెరుగుదల అవసరం",
      boyPrefix: "వరుడు", girlPrefix: "వధువు",
      limitTitle: "✨ మీ పూర్తి కుండలి నివేదిక సిద్ధంగా ఉంది",
      limitSub: "గుణ మిలన్‌తో పాటు మంగళ మరియు ఇతర దోషాల వివరణాత్మక విశ్లేషణను చూడండి. వాలెట్ రీఛార్జ్ చేసి పూర్తి నివేదికను అన్‌లాక్ చేయండి.",
      recharge: "వాలెట్ రీఛార్జ్ చేయండి", talkAstro: "జ్యోతిష్కుడితో మాట్లాడండి",
      seoTitle: "కుండలి మ్యాచింగ్ గురించి",
      seoDesc: "హిందూ సంప్రదాయంలో పెళ్లికి ముందు కుండలి మ్యాచింగ్ చాలా ముఖ్యమైనదిగా భావిస్తారు. ఇది వరుడు, వధువు స్వభావం, భవిష్యత్తు మరియు గ్రహ స్థితులను అర్థం చేసుకోవడానికి సహాయపడుతుంది.",
      faqTitle: "తరచుగా అడిగే ప్రశ్నలు (FAQs)",
      faq1Q: "కుండలి మ్యాచింగ్‌లో 36 గుణాలు అంటే ఏమిటి?",
      faq1A: "వైదిక జ్యోతిష్యంలో 8 వర్గాలలో (అష్టకూట) మొత్తం 36 గుణాలు ఉంటాయి. ఎక్కువ గుణాలు కలిస్తే వివాహం అంత శుభప్రదంగా భావిస్తారు (18+ మంచిది).",
      faq2Q: "మంగళ దోషం పెళ్లికి అడ్డంకా?",
      faq2A: "తప్పనిసరిగా కాదు. ఇద్దరూ మంగళికులైనా లేదా కొన్ని పరిహారాలు చేసినా ఈ దోషం శాంతిస్తుంది. GitaTalk ఖచ్చితమైన విశ్లేషణ ఇస్తుంది.",
      footerText: "ఈ నివేదిక సాధారణ సమాచారం కోసం మాత్రమే. ఖచ్చితమైన ఫలితాల కోసం జ్యోతిష్కుడిని సంప్రదించండి.",
      errCalc: "కుండలి లెక్కింపులో సమస్య వచ్చింది.", errGeneric: "ఏదో తప్పు జరిగింది. దయచేసి కాసేపటి తర్వాత మళ్లీ ప్రయత్నించండి."
    },
    ta: {
      title: "குண்டலி பொருத்தம்", subtitle: "துல்லியமான திருமணப் பொருத்தம்", boy: "மணமகன் விவரங்கள்", girl: "மணமகள் விவரங்கள்",
      name: "முழு பெயர்", city: "பிறந்த இடம் (நகரம்)", matchBtn: "பொருத்தம் பார்", alertCity: "பட்டியலிலிருந்து நகரத்தைத் தேர்ந்தெடுக்கவும்!",
      result: "பொருத்த முடிவு", total: "/ 36 மொத்த அஷ்டகூட பொருத்தம்", breakdown: "8 கூடங்களின் கணக்கீட்டைப் பார்க்கவும்",
      chat: "ஜோதிடரிடம் பேசுங்கள் — முதல் அரட்டை இலவசம்", pdf: "PDF பதிவிறக்கம்", reset: "மீண்டும் தொடங்கு", share: "WhatsApp-இல் பகிரவும்",
      bannerTitle: "ஜோதிடர் • 24x7 கிடைக்கும்", bannerSub: "பொருத்தத்தை ஆழமாக அறிய அரட்டை செய்யுங்கள் — இலவசம்",
      warning: "பொருத்தத்தைச் சரியாகப் புரிந்துகொண்டால் உறவு வலுப்படும். இந்த அறிக்கை உங்களுக்கு சரியான திசையைக் காட்டும்.",
      home: "முகப்பு", chatNav: "அரட்டை", daily: "ராசிபலன்", profile: "சுயவிவரம்",
      doshaTitle: "தோஷங்களும் பரிகாரங்களும்", strengths: "உங்கள் 3 பெரிய பலங்கள்", attention: "கவனிக்க வேண்டியவை",
      advice: "நடைமுறை ஆலோசனை", nextSteps: "அடுத்த படி", soulLabel: "உறவின் சாரம்",
      doshaPresent: "உள்ளது", doshaCancelled: "நிவர்த்தியானது", doshaAbsent: "தோஷம் இல்லை",
      manglik: "மங்கள தோஷம்", nadi: "நாடி தோஷம்", bhakoot: "பகூட தோஷம்",
      disclaimer: "இந்த அறிக்கை பாரம்பரிய வேத ஜோதிடத்தை அடிப்படையாகக் கொண்டது.",
      askQ: "மேலும் அறிய வேண்டுமா?", q1: "நம் திருமணத்திற்கு குடும்பங்கள் எளிதில் சம்மதிக்குமா?", q2: "நம் ஜாதகப்படி திருமணத்திற்கு மிகவும் சுபமான நேரம் எது?", q3: "இந்த உறவு தொழில் மற்றும் செல்வத்தில் என்ன தாக்கம் ஏற்படுத்தும்?",
      labelUtkrisht: "சிறந்த பொருத்தம்", labelBahutAcha: "மிக நல்ல பொருத்தம்", labelAcha: "நல்ல பொருத்தம்", labelAusat: "சராசரி பொருத்தம்", labelSudhar: "மேம்பாடு தேவை",
      boyPrefix: "மணமகன்", girlPrefix: "மணமகள்",
      limitTitle: "✨ உங்கள் முழு குண்டலி அறிக்கை தயாராக உள்ளது",
      limitSub: "குண மிலானுடன் மங்கள மற்றும் பிற தோஷங்களின் விரிவான பகுப்பாய்வைப் பாருங்கள். வாலெட்டை ரீசார்ஜ் செய்து முழு அறிக்கையைத் திறக்கவும்.",
      recharge: "வாலெட் ரீசார்ஜ் செய்யவும்", talkAstro: "ஜோதிடரிடம் பேசுங்கள்",
      seoTitle: "குண்டலி பொருத்தம் பற்றி",
      seoDesc: "இந்து மரபில் திருமணத்திற்கு முன் குண்டலி பொருத்தம் பார்ப்பது மிக முக்கியமாகக் கருதப்படுகிறது. மணமகன், மணமகளின் குணம், எதிர்காலம் மற்றும் கிரக நிலைகளைப் புரிந்துகொள்ள இது உதவுகிறது.",
      faqTitle: "அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQs)",
      faq1Q: "குண்டலி பொருத்தத்தில் 36 குணங்கள் என்றால் என்ன?",
      faq1A: "வேத ஜோதிடத்தில் 8 பிரிவுகளில் (அஷ்டகூடம்) மொத்தம் 36 குணங்கள் உள்ளன. அதிக குணங்கள் பொருந்தினால் திருமணம் சுபமாகக் கருதப்படும் (18+ நல்லது).",
      faq2Q: "மங்கள தோஷம் திருமணத்திற்குத் தடையா?",
      faq2A: "அவசியமில்லை. இருவரும் மங்களிகளாக இருந்தாலோ சில பரிகாரங்கள் செய்தாலோ இந்த தோஷம் தணியும். GitaTalk துல்லியமான பகுப்பாய்வை வழங்குகிறது.",
      footerText: "இந்த அறிக்கை பொதுத் தகவலுக்கு மட்டுமே. துல்லியமான முடிவுகளுக்கு ஜோதிடரை அணுகவும்.",
      errCalc: "குண்டலி கணக்கீட்டில் சிக்கல் ஏற்பட்டது.", errGeneric: "ஏதோ தவறு நடந்தது. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்."
    },
    kn: {
      title: "ಕುಂಡಲಿ ಮ್ಯಾಚಿಂಗ್", subtitle: "ನಿಖರವಾದ ವಿವಾಹ ಹೊಂದಾಣಿಕೆ", boy: "ವರನ ವಿವರಗಳು", girl: "ವಧುವಿನ ವಿವರಗಳು",
      name: "ಪೂರ್ಣ ಹೆಸರು", city: "ಜನ್ಮ ಸ್ಥಳ (ನಗರ)", matchBtn: "ಹೊಂದಾಣಿಕೆ ನೋಡಿ", alertCity: "ದಯವಿಟ್ಟು ಪಟ್ಟಿಯಿಂದ ನಗರವನ್ನು ಆಯ್ಕೆಮಾಡಿ!",
      result: "ಹೊಂದಾಣಿಕೆ ಫಲಿತಾಂಶ", total: "/ 36 ಒಟ್ಟು ಅಷ್ಟಕೂಟ ಗುಣಗಳು", breakdown: "ಎಲ್ಲಾ 8 ಕೂಟಗಳ ಲೆಕ್ಕ ನೋಡಿ",
      chat: "ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ", pdf: "PDF ಡೌನ್‌ಲೋಡ್", reset: "ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ", share: "WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ",
      bannerTitle: "ಜ್ಯೋತಿಷಿ • 24x7 ಲಭ್ಯ", bannerSub: "ಹೊಂದಾಣಿಕೆಯನ್ನು ಆಳವಾಗಿ ತಿಳಿಯಲು ಚಾಟ್ ಮಾಡಿ — ಉಚಿತ",
      warning: "ಹೊಂದಾಣಿಕೆಯನ್ನು ಸರಿಯಾಗಿ ಅರ್ಥಮಾಡಿಕೊಂಡರೆ ಸಂಬಂಧ ಇನ್ನಷ್ಟು ಬಲಗೊಳ್ಳುತ್ತದೆ. ಈ ವರದಿ ನಿಮಗೆ ಸರಿಯಾದ ದಿಕ್ಕು ತೋರಿಸುತ್ತದೆ.",
      home: "ಮುಖಪುಟ", chatNav: "ಚಾಟ್", daily: "ರಾಶಿಫಲ", profile: "ಪ್ರೊಫೈಲ್",
      doshaTitle: "ದೋಷಗಳು ಮತ್ತು ಪರಿಹಾರಗಳು", strengths: "ನಿಮ್ಮ 3 ದೊಡ್ಡ ಶಕ್ತಿಗಳು", attention: "ಗಮನಿಸಬೇಕಾದ ವಿಷಯಗಳು",
      advice: "ಪ್ರಾಯೋಗಿಕ ಸಲಹೆ", nextSteps: "ಮುಂದಿನ ಹೆಜ್ಜೆ", soulLabel: "ಸಂಬಂಧದ ಸಾರ",
      doshaPresent: "ಇದೆ", doshaCancelled: "ನಿವಾರಣೆಯಾಗಿದೆ", doshaAbsent: "ದೋಷವಿಲ್ಲ",
      manglik: "ಮಂಗಳ ದೋಷ", nadi: "ನಾಡಿ ದೋಷ", bhakoot: "ಭಕೂಟ ದೋಷ",
      disclaimer: "ಈ ವರದಿ ಸಾಂಪ್ರದಾಯಿಕ ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯವನ್ನು ಆಧರಿಸಿದೆ.",
      askQ: "ಇನ್ನಷ್ಟು ತಿಳಿಯಬೇಕೇ?", q1: "ನಮ್ಮ ಮದುವೆಗೆ ಕುಟುಂಬಗಳು ಸುಲಭವಾಗಿ ಒಪ್ಪುತ್ತವೆಯೇ?", q2: "ನಮ್ಮ ಜಾತಕದ ಪ್ರಕಾರ ಮದುವೆಗೆ ಅತ್ಯಂತ ಶುಭ ಸಮಯ ಯಾವುದು?", q3: "ಈ ಸಂಬಂಧ ವೃತ್ತಿ ಮತ್ತು ಧನದ ಮೇಲೆ ಏನು ಪರಿಣಾಮ ಬೀರುತ್ತದೆ?",
      labelUtkrisht: "ಅತ್ಯುತ್ತಮ ಹೊಂದಾಣಿಕೆ", labelBahutAcha: "ತುಂಬಾ ಒಳ್ಳೆಯ ಹೊಂದಾಣಿಕೆ", labelAcha: "ಒಳ್ಳೆಯ ಹೊಂದಾಣಿಕೆ", labelAusat: "ಸರಾಸರಿ ಹೊಂದಾಣಿಕೆ", labelSudhar: "ಸುಧಾರಣೆ ಬೇಕು",
      boyPrefix: "ವರ", girlPrefix: "ವಧು",
      limitTitle: "✨ ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಕುಂಡಲಿ ವರದಿ ಸಿದ್ಧವಾಗಿದೆ",
      limitSub: "ಗುಣ ಮಿಲನದ ಜೊತೆಗೆ ಮಂಗಳ ಮತ್ತು ಇತರ ದೋಷಗಳ ವಿವರವಾದ ವಿಶ್ಲೇಷಣೆಯನ್ನು ನೋಡಿ. ವಾಲೆಟ್ ರೀಚಾರ್ಜ್ ಮಾಡಿ ಪೂರ್ಣ ವರದಿಯನ್ನು ಅನ್‌ಲಾಕ್ ಮಾಡಿ.",
      recharge: "ವಾಲೆಟ್ ರೀಚಾರ್ಜ್ ಮಾಡಿ", talkAstro: "ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ",
      seoTitle: "ಕುಂಡಲಿ ಮ್ಯಾಚಿಂಗ್ ಬಗ್ಗೆ",
      seoDesc: "ಹಿಂದೂ ಸಂಪ್ರದಾಯದಲ್ಲಿ ಮದುವೆಗೆ ಮೊದಲು ಕುಂಡಲಿ ಹೊಂದಾಣಿಕೆ ನೋಡುವುದು ಬಹಳ ಮುಖ್ಯ. ಇದು ವರ ಮತ್ತು ವಧುವಿನ ಸ್ವಭಾವ, ಭವಿಷ್ಯ ಮತ್ತು ಗ್ರಹಸ್ಥಿತಿಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
      faqTitle: "ಪದೇ ಪದೇ ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು (FAQs)",
      faq1Q: "ಕುಂಡಲಿ ಮ್ಯಾಚಿಂಗ್‌ನಲ್ಲಿ 36 ಗುಣಗಳು ಎಂದರೇನು?",
      faq1A: "ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯದಲ್ಲಿ 8 ವರ್ಗಗಳಲ್ಲಿ (ಅಷ್ಟಕೂಟ) ಒಟ್ಟು 36 ಗುಣಗಳಿವೆ. ಹೆಚ್ಚು ಗುಣಗಳು ಹೊಂದಿದರೆ ವಿವಾಹ ಶುಭ ಎಂದು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ (18+ ಒಳ್ಳೆಯದು).",
      faq2Q: "ಮಂಗಳ ದೋಷ ಮದುವೆಗೆ ಅಡ್ಡಿಯೇ?",
      faq2A: "ಅಗತ್ಯವಿಲ್ಲ. ಇಬ್ಬರೂ ಮಾಂಗಲಿಕರಾಗಿದ್ದರೆ ಅಥವಾ ಕೆಲವು ಪರಿಹಾರಗಳನ್ನು ಮಾಡಿದರೆ ಈ ದೋಷ ಶಾಂತವಾಗುತ್ತದೆ. GitaTalk ನಿಖರವಾದ ವಿಶ್ಲೇಷಣೆ ನೀಡುತ್ತದೆ.",
      footerText: "ಈ ವರದಿ ಸಾಮಾನ್ಯ ಮಾಹಿತಿಗಾಗಿ ಮಾತ್ರ. ನಿಖರ ಫಲಿತಾಂಶಕ್ಕಾಗಿ ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.",
      errCalc: "ಕುಂಡಲಿ ಲೆಕ್ಕಾಚಾರದಲ್ಲಿ ಸಮಸ್ಯೆ ಉಂಟಾಯಿತು.", errGeneric: "ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
    },
    bn: {
      title: "কুণ্ডলী মিলান", subtitle: "নির্ভুল বিবাহ মিলান", boy: "পাত্রের বিবরণ", girl: "পাত্রীর বিবরণ",
      name: "পুরো নাম", city: "জন্মস্থান (শহর)", matchBtn: "মিলান করুন", alertCity: "অনুগ্রহ করে তালিকা থেকে শহর বেছে নিন!",
      result: "মিলানের ফলাফল", total: "/ 36 মোট অষ্টকূট গুণ", breakdown: "সব 8 কূটের হিসাব দেখুন",
      chat: "জ্যোতিষীর সঙ্গে কথা বলুন — প্রথম চ্যাট ফ্রি", pdf: "PDF ডাউনলোড", reset: "আবার শুরু করুন", share: "WhatsApp-এ শেয়ার করুন",
      bannerTitle: "জ্যোতিষী • 24x7 উপলব্ধ", bannerSub: "মিলান গভীরভাবে বুঝতে চ্যাট করুন — ফ্রি",
      warning: "মিলান ঠিকভাবে বুঝলে সম্পর্ক আরও মজবুত হয়। এই রিপোর্ট আপনাকে সঠিক দিশা দেখাবে।",
      home: "হোম", chatNav: "চ্যাট", daily: "রাশিফল", profile: "প্রোফাইল",
      doshaTitle: "দোষ ও তার প্রতিকার", strengths: "আপনার ৩টি সবচেয়ে বড় শক্তি", attention: "যে বিষয়ে মনোযোগ দিতে হবে",
      advice: "বাস্তব পরামর্শ", nextSteps: "পরবর্তী পদক্ষেপ", soulLabel: "সম্পর্কের সারকথা",
      doshaPresent: "আছে", doshaCancelled: "খণ্ডিত", doshaAbsent: "কোনো দোষ নেই",
      manglik: "মঙ্গল দোষ", nadi: "নাড়ি দোষ", bhakoot: "ভকূট দোষ",
      disclaimer: "এই রিপোর্ট ঐতিহ্যবাহী বৈদিক জ্যোতিষের উপর ভিত্তি করে তৈরি।",
      askQ: "আরও জানতে চান?", q1: "আমাদের বিয়েতে কি পরিবার সহজে রাজি হবে?", q2: "আমাদের কুণ্ডলী অনুযায়ী বিয়ের সবচেয়ে শুভ সময় কখন?", q3: "এই সম্পর্ক ক্যারিয়ার ও অর্থের উপর কী প্রভাব ফেলবে?",
      labelUtkrisht: "চমৎকার মিলান", labelBahutAcha: "খুব ভালো মিলান", labelAcha: "ভালো মিলান", labelAusat: "মাঝারি মিলান", labelSudhar: "উন্নতির সুযোগ আছে",
      boyPrefix: "পাত্র", girlPrefix: "পাত্রী",
      limitTitle: "✨ আপনার সম্পূর্ণ কুণ্ডলী রিপোর্ট তৈরি",
      limitSub: "গুণ মিলানের সঙ্গে মঙ্গল ও অন্যান্য দোষের বিস্তারিত বিশ্লেষণ দেখুন। ওয়ালেট রিচার্জ করে সম্পূর্ণ রিপোর্ট আনলক করুন।",
      recharge: "ওয়ালেট রিচার্জ করুন", talkAstro: "জ্যোতিষীর সঙ্গে কথা বলুন",
      seoTitle: "কুণ্ডলী মিলান সম্পর্কে",
      seoDesc: "হিন্দু ধর্মে বিয়ের আগে কুণ্ডলী মিলান করা অত্যন্ত গুরুত্বপূর্ণ মনে করা হয়। এটি পাত্র-পাত্রীর স্বভাব, ভবিষ্যৎ ও গ্রহের অবস্থান বুঝতে সাহায্য করে।",
      faqTitle: "সাধারণ জিজ্ঞাসা (FAQs)",
      faq1Q: "কুণ্ডলী মিলানে ৩৬ গুণ কী?",
      faq1A: "বৈদিক জ্যোতিষে ৮টি শ্রেণিতে (অষ্টকূট) মোট ৩৬ গুণ থাকে। যত বেশি গুণ মেলে, বিয়ে তত শুভ ধরা হয় (১৮+ ভালো)।",
      faq2Q: "মঙ্গল দোষ কি বিয়ের বাধা?",
      faq2A: "জরুরি নয়। দুজনেই মাঙ্গলিক হলে বা কিছু প্রতিকার করলে এই দোষ শান্ত হয়। GitaTalk নির্ভুল বিশ্লেষণ দেয়।",
      footerText: "এই রিপোর্ট সাধারণ তথ্যের জন্য। সঠিক ফলাফলের জন্য জ্যোতিষীর পরামর্শ নিন।",
      errCalc: "কুণ্ডলী গণনায় সমস্যা হয়েছে।", errGeneric: "কিছু ভুল হয়েছে। অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন।"
    },
    mr: {
      title: "कुंडली मिलन", subtitle: "अचूक विवाह जुळणी", boy: "वराचा तपशील", girl: "वधूचा तपशील",
      name: "पूर्ण नाव", city: "जन्म ठिकाण (शहर)", matchBtn: "मिलन करा", alertCity: "कृपया यादीतून शहर निवडा!",
      result: "मिलन निकाल", total: "/ 36 एकूण अष्टकूट गुण", breakdown: "सर्व 8 कूटांचे गणित पहा",
      chat: "ज्योतिषांशी बोला — पहिली चॅट मोफत", pdf: "PDF डाउनलोड", reset: "पुन्हा सुरू करा", share: "WhatsApp वर पाठवा",
      bannerTitle: "ज्योतिषी • 24x7 उपलब्ध", bannerSub: "मिलन सविस्तर समजून घेण्यासाठी चॅट करा — मोफत",
      warning: "योग्य मिलन समजल्याने नाते अधिक घट्ट होते. हा अहवाल तुम्हाला योग्य दिशा देईल.",
      home: "होम", chatNav: "चॅट", daily: "राशीभविष्य", profile: "प्रोफाइल",
      doshaTitle: "दोष आणि त्यांचे निवारण", strengths: "तुमच्या 3 सर्वात मोठ्या ताकदी", attention: "लक्ष देण्यासारख्या गोष्टी",
      advice: "व्यावहारिक सल्ला", nextSteps: "पुढचे पाऊल", soulLabel: "नात्याचे सार",
      doshaPresent: "आहे", doshaCancelled: "निवारित", doshaAbsent: "दोष नाही",
      manglik: "मंगळ दोष", nadi: "नाडी दोष", bhakoot: "भकूट दोष",
      disclaimer: "हा अहवाल पारंपरिक वैदिक ज्योतिषावर आधारित आहे.",
      askQ: "अजून जाणून घ्यायचे आहे?", q1: "आपल्या लग्नाला कुटुंब सहज तयार होईल का?", q2: "आपल्या कुंडलीनुसार लग्नाचा सर्वात शुभ काळ कोणता?", q3: "या नात्याचा करिअर आणि धनावर काय परिणाम होईल?",
      labelUtkrisht: "उत्कृष्ट मिलन", labelBahutAcha: "खूप चांगले मिलन", labelAcha: "चांगले मिलन", labelAusat: "सरासरी मिलन", labelSudhar: "सुधारणेला वाव",
      boyPrefix: "वर", girlPrefix: "वधू",
      limitTitle: "✨ तुमचा पूर्ण कुंडली अहवाल तयार आहे",
      limitSub: "गुण मिलनासोबत मंगळ आणि इतर दोषांचे सविस्तर विश्लेषण पहा. वॉलेट रिचार्ज करून पूर्ण अहवाल अनलॉक करा.",
      recharge: "वॉलेट रिचार्ज करा", talkAstro: "ज्योतिषांशी बोला",
      seoTitle: "कुंडली मिलनाबद्दल",
      seoDesc: "हिंदू धर्मात लग्नापूर्वी कुंडली मिलन करणे खूप महत्त्वाचे मानले जाते. हे वर आणि वधूचा स्वभाव, भविष्य आणि ग्रहस्थिती समजून घेण्यास मदत करते.",
      faqTitle: "वारंवार विचारले जाणारे प्रश्न (FAQs)",
      faq1Q: "कुंडली मिलनात 36 गुण म्हणजे काय?",
      faq1A: "वैदिक ज्योतिषात 8 वेगवेगळ्या श्रेणींमध्ये (अष्टकूट) एकूण 36 गुण असतात. जितके जास्त गुण जुळतात तितका विवाह शुभ मानला जातो (18+ चांगले).",
      faq2Q: "मंगळ दोष लग्नात अडथळा आहे का?",
      faq2A: "आवश्यक नाही. दोघेही मांगलिक असतील किंवा काही उपाय केले तर हा दोष शांत होतो. GitaTalk अचूक विश्लेषण देते.",
      footerText: "हा अहवाल सामान्य माहितीसाठी आहे. अचूक निकालांसाठी ज्योतिषांचा सल्ला घ्या.",
      errCalc: "कुंडली गणनेत अडचण आली.", errGeneric: "काहीतरी चुकले. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा."
    },
    gu: {
      title: "કુંડળી મિલાન", subtitle: "ચોક્કસ લગ્ન મેળાપ", boy: "વરની વિગતો", girl: "વધૂની વિગતો",
      name: "પૂરું નામ", city: "જન્મ સ્થળ (શહેર)", matchBtn: "મિલાન કરો", alertCity: "કૃપા કરીને યાદીમાંથી શહેર પસંદ કરો!",
      result: "મિલાન પરિણામ", total: "/ 36 કુલ અષ્ટકૂટ ગુણ", breakdown: "બધા 8 કૂટનો હિસાબ જુઓ",
      chat: "જ્યોતિષી સાથે વાત કરો — પહેલી ચેટ મફત", pdf: "PDF ડાઉનલોડ", reset: "ફરી શરૂ કરો", share: "WhatsApp પર મોકલો",
      bannerTitle: "જ્યોતિષી • 24x7 ઉપલબ્ધ", bannerSub: "મિલાનને ઊંડાણથી સમજવા ચેટ કરો — મફત",
      warning: "મિલાન સારી રીતે સમજવાથી સંબંધ વધુ મજબૂત બને છે. આ રિપોર્ટ તમને સાચી દિશા આપશે.",
      home: "હોમ", chatNav: "ચેટ", daily: "રાશિફળ", profile: "પ્રોફાઇલ",
      doshaTitle: "દોષ અને તેમના નિવારણ", strengths: "તમારી 3 સૌથી મોટી તાકાત", attention: "ધ્યાન આપવા જેવી બાબતો",
      advice: "વ્યવહારુ સલાહ", nextSteps: "આગળનું પગલું", soulLabel: "સંબંધનો સાર",
      doshaPresent: "છે", doshaCancelled: "નિવારિત", doshaAbsent: "કોઈ દોષ નથી",
      manglik: "મંગળ દોષ", nadi: "નાડી દોષ", bhakoot: "ભકૂટ દોષ",
      disclaimer: "આ રિપોર્ટ પરંપરાગત વૈદિક જ્યોતિષ પર આધારિત છે.",
      askQ: "વધુ જાણવું છે?", q1: "શું આપણા લગ્ન માટે પરિવાર સરળતાથી માની જશે?", q2: "આપણી કુંડળી મુજબ લગ્નનો સૌથી શુભ સમય ક્યારે છે?", q3: "આ સંબંધની કારકિર્દી અને ધન પર શું અસર થશે?",
      labelUtkrisht: "ઉત્કૃષ્ટ મિલાન", labelBahutAcha: "ખૂબ સારું મિલાન", labelAcha: "સારું મિલાન", labelAusat: "સરેરાશ મિલાન", labelSudhar: "સુધારાને અવકાશ",
      boyPrefix: "વર", girlPrefix: "વધૂ",
      limitTitle: "✨ તમારો પૂરો કુંડળી રિપોર્ટ તૈયાર છે",
      limitSub: "ગુણ મિલાનની સાથે મંગળ અને અન્ય દોષોનું વિગતવાર વિશ્લેષણ જુઓ. વૉલેટ રિચાર્જ કરીને પૂરો રિપોર્ટ અનલૉક કરો.",
      recharge: "વૉલેટ રિચાર્જ કરો", talkAstro: "જ્યોતિષી સાથે વાત કરો",
      seoTitle: "કુંડળી મિલાન વિશે",
      seoDesc: "હિંદુ ધર્મમાં લગ્ન પહેલાં કુંડળી મિલાન કરવું ખૂબ મહત્વનું માનવામાં આવે છે. તે વર અને વધૂના સ્વભાવ, ભવિષ્ય અને ગ્રહોની સ્થિતિ સમજવામાં મદદ કરે છે.",
      faqTitle: "વારંવાર પૂછાતા પ્રશ્નો (FAQs)",
      faq1Q: "કુંડળી મિલાનમાં 36 ગુણ એટલે શું?",
      faq1A: "વૈદિક જ્યોતિષમાં 8 અલગ શ્રેણીઓ (અષ્ટકૂટ)માં કુલ 36 ગુણ હોય છે. જેટલા વધુ ગુણ મળે તેટલું લગ્ન શુભ ગણાય છે (18+ સારું).",
      faq2Q: "શું મંગળ દોષ લગ્નમાં અડચણ છે?",
      faq2A: "જરૂરી નથી. બંને માંગલિક હોય અથવા કેટલાક ઉપાય કરવામાં આવે તો આ દોષ શાંત થાય છે. GitaTalk ચોક્કસ વિશ્લેષણ આપે છે.",
      footerText: "આ રિપોર્ટ સામાન્ય માહિતી માટે છે. ચોક્કસ પરિણામ માટે જ્યોતિષીની સલાહ લો.",
      errCalc: "કુંડળીની ગણતરીમાં સમસ્યા આવી.", errGeneric: "કંઈક ખોટું થયું. કૃપા કરીને થોડીવાર પછી ફરી પ્રયાસ કરો."
    },
    ml: {
      title: "ജാതക പൊരുത്തം", subtitle: "കൃത്യമായ വിവാഹ പൊരുത്തം", boy: "വരന്റെ വിവരങ്ങൾ", girl: "വധുവിന്റെ വിവരങ്ങൾ",
      name: "മുഴുവൻ പേര്", city: "ജന്മസ്ഥലം (നഗരം)", matchBtn: "പൊരുത്തം നോക്കുക", alertCity: "ലിസ്റ്റിൽ നിന്ന് നഗരം തിരഞ്ഞെടുക്കുക!",
      result: "പൊരുത്ത ഫലം", total: "/ 36 ആകെ അഷ്ടകൂട ഗുണങ്ങൾ", breakdown: "8 കൂടങ്ങളുടെ കണക്ക് കാണുക",
      chat: "ജ്യോതിഷിയോട് സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം", pdf: "PDF ഡൗൺലോഡ്", reset: "വീണ്ടും തുടങ്ങുക", share: "WhatsApp-ൽ പങ്കിടുക",
      bannerTitle: "ജ്യോതിഷി • 24x7 ലഭ്യം", bannerSub: "പൊരുത്തം ആഴത്തിൽ അറിയാൻ ചാറ്റ് ചെയ്യുക — സൗജന്യം",
      warning: "പൊരുത്തം ശരിയായി മനസ്സിലാക്കുന്നത് ബന്ധം കൂടുതൽ ദൃഢമാക്കും. ഈ റിപ്പോർട്ട് ശരിയായ ദിശ കാണിക്കും.",
      home: "ഹോം", chatNav: "ചാറ്റ്", daily: "രാശിഫലം", profile: "പ്രൊഫൈൽ",
      doshaTitle: "ദോഷങ്ങളും പരിഹാരങ്ങളും", strengths: "നിങ്ങളുടെ 3 വലിയ ശക്തികൾ", attention: "ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ",
      advice: "പ്രായോഗിക ഉപദേശം", nextSteps: "അടുത്ത ചുവട്", soulLabel: "ബന്ധത്തിന്റെ സാരം",
      doshaPresent: "ഉണ്ട്", doshaCancelled: "പരിഹരിക്കപ്പെട്ടു", doshaAbsent: "ദോഷമില്ല",
      manglik: "ചൊവ്വാദോഷം", nadi: "നാഡി ദോഷം", bhakoot: "ഭകൂട ദോഷം",
      disclaimer: "ഈ റിപ്പോർട്ട് പരമ്പരാഗത വൈദിക ജ്യോതിഷത്തെ അടിസ്ഥാനമാക്കിയുള്ളതാണ്.",
      askQ: "കൂടുതൽ അറിയണോ?", q1: "നമ്മുടെ വിവാഹത്തിന് കുടുംബങ്ങൾ എളുപ്പത്തിൽ സമ്മതിക്കുമോ?", q2: "നമ്മുടെ ജാതകപ്രകാരം വിവാഹത്തിന് ഏറ്റവും ശുഭ സമയം ഏതാണ്?", q3: "ഈ ബന്ധം കരിയറിലും സമ്പത്തിലും എന്ത് സ്വാധീനം ചെലുത്തും?",
      labelUtkrisht: "ഉത്തമ പൊരുത്തം", labelBahutAcha: "വളരെ നല്ല പൊരുത്തം", labelAcha: "നല്ല പൊരുത്തം", labelAusat: "ശരാശരി പൊരുത്തം", labelSudhar: "മെച്ചപ്പെടുത്തൽ വേണം",
      boyPrefix: "വരൻ", girlPrefix: "വധു",
      limitTitle: "✨ നിങ്ങളുടെ പൂർണ്ണ ജാതക റിപ്പോർട്ട് തയ്യാറാണ്",
      limitSub: "ഗുണ മിലാനോടൊപ്പം ചൊവ്വാദോഷവും മറ്റ് ദോഷങ്ങളും വിശദമായി കാണുക. വാലറ്റ് റീചാർജ് ചെയ്ത് പൂർണ്ണ റിപ്പോർട്ട് അൺലോക്ക് ചെയ്യുക.",
      recharge: "വാലറ്റ് റീചാർജ് ചെയ്യുക", talkAstro: "ജ്യോതിഷിയോട് സംസാരിക്കുക",
      seoTitle: "ജാതക പൊരുത്തത്തെക്കുറിച്ച്",
      seoDesc: "ഹിന്ദു പാരമ്പര്യത്തിൽ വിവാഹത്തിന് മുമ്പ് ജാതക പൊരുത്തം നോക്കുന്നത് വളരെ പ്രധാനമാണ്. വരന്റെയും വധുവിന്റെയും സ്വഭാവം, ഭാവി, ഗ്രഹനില എന്നിവ മനസ്സിലാക്കാൻ ഇത് സഹായിക്കുന്നു.",
      faqTitle: "പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ (FAQs)",
      faq1Q: "ജാതക പൊരുത്തത്തിൽ 36 ഗുണങ്ങൾ എന്താണ്?",
      faq1A: "വൈദിക ജ്യോതിഷത്തിൽ 8 വിഭാഗങ്ങളിലായി (അഷ്ടകൂടം) ആകെ 36 ഗുണങ്ങളുണ്ട്. കൂടുതൽ ഗുണങ്ങൾ ചേർന്നാൽ വിവാഹം ശുഭമായി കണക്കാക്കുന്നു (18+ നല്ലത്).",
      faq2Q: "ചൊവ്വാദോഷം വിവാഹത്തിന് തടസ്സമാണോ?",
      faq2A: "നിർബന്ധമില്ല. ഇരുവർക്കും ചൊവ്വാദോഷമുണ്ടെങ്കിലോ ചില പരിഹാരങ്ങൾ ചെയ്താലോ ഈ ദോഷം ശമിക്കും. GitaTalk കൃത്യമായ വിശകലനം നൽകുന്നു.",
      footerText: "ഈ റിപ്പോർട്ട് പൊതുവായ വിവരങ്ങൾക്കുള്ളതാണ്. കൃത്യമായ ഫലത്തിന് ജ്യോതിഷിയെ സമീപിക്കുക.",
      errCalc: "ജാതക കണക്കുകൂട്ടലിൽ പ്രശ്നം ഉണ്ടായി.", errGeneric: "എന്തോ കുഴപ്പം സംഭവിച്ചു. ദയവായി കുറച്ച് കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുക."
    },
  };

  // Fallback for other languages (English content if not translated yet)
  const defaultLang = ui["en"];
  const currentLang = ui[lang] || defaultLang;
  return currentLang[key] || defaultLang[key] || key;
};

// ============================================================
// 6. HELPERS (score label, normalisers for API result)
// ============================================================
const getScoreMeta = (score: number, t: (k: string) => string) => {
  if (score >= 30) return { label: t("labelUtkrisht"), from: "#34d399", to: "#10b981", text: "text-emerald-300" };
  if (score >= 25) return { label: t("labelBahutAcha"), from: "#a3e635", to: "#22c55e", text: "text-lime-300" };
  if (score >= 18) return { label: t("labelAcha"), from: "#fbbf24", to: "#f59e0b", text: "text-amber-300" };
  if (score >= 12) return { label: t("labelAusat"), from: "#fb923c", to: "#f97316", text: "text-orange-300" };
  return { label: t("labelSudhar"), from: "#fb7185", to: "#ef4444", text: "text-rose-300" };
};

const toArray = (v: any): any[] => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "string") return [v];
  return Object.values(v);
};

const itemText = (v: any): string => {
  if (typeof v === "string") return v;
  return v?.text || v?.title || v?.description || v?.detail || "";
};

const normaliseKootas = (r: any) => {
  const raw = r?.kootas ?? r?.breakdown ?? r?.ashtakoot ?? r?.gunas ?? [];
  const list = Array.isArray(raw)
    ? raw
    : Object.entries(raw || {}).map(([k, v]: any) =>
        typeof v === "object" ? { name: k, ...v } : { name: k, score: v }
      );
  return list.map((k: any) => ({
    name: k.name || k.koota || k.title || "-",
    score: Number(k.score ?? k.obtained ?? k.points ?? 0),
    max: Number(k.max ?? k.total ?? k.outOf ?? 0),
    note: k.description || k.meaning || k.note || "",
  }));
};

const doshaStatus = (v: any): "present" | "cancelled" | "absent" => {
  const s = String(typeof v === "object" ? v?.status ?? v?.state ?? "" : v ?? "").toLowerCase();
  if (v === true || s === "present" || s === "true" || s === "yes") return "present";
  if (s.includes("cancel") || s.includes("nivar")) return "cancelled";
  return "absent";
};

// ============================================================
// 7. SMALL UI PIECES
// ============================================================
const ScoreRing = ({ score, from, to }: { score: number; from: string; to: string }) => {
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(score / 36, 1));
  return (
    <div className="relative w-52 h-52 mx-auto">
      <div className="absolute inset-0 rounded-full blur-2xl opacity-30" style={{ background: `linear-gradient(135deg, ${from}, ${to})` }} />
      <svg viewBox="0 0 200 200" className="relative w-full h-full -rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
        <circle
          cx="100" cy="100" r={radius} fill="none" stroke="url(#ringGrad)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={circumference * (1 - pct)}
          style={{ transition: "stroke-dashoffset 1.4s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-extrabold text-white leading-none">{score}</span>
        <span className="text-xs text-gray-400 mt-2">/ 36</span>
      </div>
    </div>
  );
};

const SectionTitle = ({ icon, children }: any) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/30 to-pink-500/20 border border-orange-400/20 flex items-center justify-center text-orange-300">
      {icon}
    </span>
    <h3 className="text-base font-bold text-white">{children}</h3>
  </div>
);

const BulletList = ({ items, tone }: { items: any[]; tone: "good" | "warn" | "info" }) => {
  const dot =
    tone === "good" ? "text-emerald-400" : tone === "warn" ? "text-amber-400" : "text-sky-400";
  const Icon = tone === "good" ? CheckCircle2 : tone === "warn" ? AlertCircle : Star;
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-sm text-gray-200 leading-relaxed">
          <Icon size={18} className={`${dot} mt-0.5 shrink-0`} />
          <span>{itemText(it)}</span>
        </li>
      ))}
    </ul>
  );
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
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
    if (dateStr.includes("/")) {
      const [d, m, y] = dateStr.split("/");
      return `${y}-${m}-${d}`;
    }
    return dateStr; // Already YYYY-MM-DD (from standard date picker)
  };

  const handleMatch = async () => {
    setError("");
    if (!boyPlace || !girlPlace) {
      setError(t("alertCity"));
      return;
    }

    setLoading(true);

    try {
      const payload = {
        boy: {
          name: boyName,
          dateOfBirth: formatDateForBackend(boyDob),
          timeOfBirth: boyTime,
          placeOfBirth: boyPlace,
        },
        girl: {
          name: girlName,
          dateOfBirth: formatDateForBackend(girlDob),
          timeOfBirth: girlTime,
          placeOfBirth: girlPlace,
        },
        language: language,
      };

      const res = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          setLimitExceeded(true);
        }
        throw new Error(data.message || t("errCalc"));
      }

      setResult(data);
      if (refreshUser) refreshUser(); // Wallet balance update karne ke liye
    } catch (err: any) {
      setError(err.message || t("errGeneric"));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError("");
    setLimitExceeded(false);
    setShowBreakdown(false);
  };

  const handleShare = () => {
    const score = Number(result?.totalScore ?? result?.score ?? result?.total ?? 0);
    const text = `${t("title")}: ${boyName || t("boyPrefix")} ❤️ ${girlName || t("girlPrefix")} — ${score}/36 (${getScoreMeta(score, t).label})`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  // ---------- derived result data ----------
  const score = Number(result?.totalScore ?? result?.score ?? result?.total ?? 0);
  const meta = getScoreMeta(score, t);
  const kootas = result ? normaliseKootas(result) : [];
  const rawDoshas = result?.doshas ?? result?.dosha ?? {};
  const doshaList = [
    { key: "manglik", label: t("manglik"), status: doshaStatus(rawDoshas?.manglik ?? result?.manglik) },
    { key: "nadi", label: t("nadi"), status: doshaStatus(rawDoshas?.nadi ?? result?.nadi) },
    { key: "bhakoot", label: t("bhakoot"), status: doshaStatus(rawDoshas?.bhakoot ?? result?.bhakoot) },
  ];
  const doshaNotes: Record<string, string> = {
    manglik: rawDoshas?.manglik?.description || rawDoshas?.manglik?.remedy || "",
    nadi: rawDoshas?.nadi?.description || rawDoshas?.nadi?.remedy || "",
    bhakoot: rawDoshas?.bhakoot?.description || rawDoshas?.bhakoot?.remedy || "",
  };
  const strengths = toArray(result?.strengths).slice(0, 3);
  const attention = toArray(result?.attention ?? result?.attentionPoints ?? result?.challenges);
  const advice = toArray(result?.advice ?? result?.practicalAdvice);
  const nextSteps = toArray(result?.nextSteps);
  const soul = result?.soulSummary ?? result?.summary ?? result?.soul ?? "";

  const statusStyle = (s: string) =>
    s === "present"
      ? { chip: "bg-rose-500/15 text-rose-300 border-rose-400/30", label: t("doshaPresent") }
      : s === "cancelled"
      ? { chip: "bg-amber-500/15 text-amber-300 border-amber-400/30", label: t("doshaCancelled") }
      : { chip: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30", label: t("doshaAbsent") };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-[#0f0c1a] text-white pb-28 relative overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-fuchsia-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-[#0f0c1a]/85 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-extrabold text-lg bg-gradient-to-r from-orange-300 via-amber-300 to-pink-300 bg-clip-text text-transparent">
              {t("title")}
            </h1>
            <p className="text-xs text-gray-400">{t("subtitle")}</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-orange-200 bg-orange-500/10 border border-orange-400/20 px-3 py-1.5 rounded-full">
          <Sparkles size={14} /> Vedic
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-6">
        {/* =====================================================
            LIMIT EXCEEDED SCREEN
        ===================================================== */}
        {limitExceeded && !result ? (
          <div className={`${CARD_CLASS} p-8 text-center overflow-hidden`}>
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />
            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg shadow-orange-500/30 mb-5">
                <Lock size={34} className="text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-3">{t("limitTitle")}</h2>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto mb-7">{t("limitSub")}</p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/wallet"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 via-amber-500 to-pink-500 shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-transform"
                >
                  <Wallet size={18} /> {t("recharge")}
                </Link>
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-orange-200 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <MessageCircle size={18} /> {t("talkAstro")}
                </Link>
              </div>

              <button onClick={handleReset} className="mt-6 text-xs text-gray-400 hover:text-gray-200 underline underline-offset-4">
                {t("reset")}
              </button>
            </div>
          </div>
        ) : !result ? (
          <>
            {/* =====================================================
                FORM SECTION
            ===================================================== */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/15 to-pink-500/15 border border-orange-400/20 text-orange-200 text-xs mb-4">
                <Heart size={14} className="text-pink-400" /> {t("subtitle")}
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight bg-gradient-to-r from-white via-orange-100 to-pink-200 bg-clip-text text-transparent">
                {t("title")}
              </h2>
              <p className="text-gray-400 text-sm mt-3 max-w-md mx-auto">{t("warning")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              {/* BOY DETAILS */}
              <div className={`${CARD_CLASS} p-5 overflow-hidden`}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-indigo-500" />
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400/30 to-indigo-500/30 border border-sky-400/30 flex items-center justify-center">
                    <User size={18} className="text-sky-300" />
                  </span>
                  <h2 className="text-sky-300 font-bold text-sm">{t("boy")}</h2>
                </div>
                <div className="space-y-3">
                  <input type="text" placeholder={t("name")} value={boyName} onChange={(e) => setBoyName(e.target.value)} className={INPUT_CLASS} />
                  <input type="date" value={boyDob} onChange={(e) => setBoyDob(e.target.value)} className={INPUT_CLASS} />
                  <input type="time" value={boyTime} onChange={(e) => setBoyTime(e.target.value)} className={INPUT_CLASS} />
                  <CitySearchInput value={boyPlace} onChange={(val: string) => setBoyPlace(val)} placeholder={t("city")} className={INPUT_CLASS} />
                </div>
              </div>

              {/* GIRL DETAILS */}
              <div className={`${CARD_CLASS} p-5 overflow-hidden`}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-fuchsia-500" />
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400/30 to-fuchsia-500/30 border border-pink-400/30 flex items-center justify-center">
                    <User size={18} className="text-pink-300" />
                  </span>
                  <h2 className="text-pink-300 font-bold text-sm">{t("girl")}</h2>
                </div>
                <div className="space-y-3">
                  <input type="text" placeholder={t("name")} value={girlName} onChange={(e) => setGirlName(e.target.value)} className={INPUT_CLASS} />
                  <input type="date" value={girlDob} onChange={(e) => setGirlDob(e.target.value)} className={INPUT_CLASS} />
                  <input type="time" value={girlTime} onChange={(e) => setGirlTime(e.target.value)} className={INPUT_CLASS} />
                  <CitySearchInput value={girlPlace} onChange={(val: string) => setGirlPlace(val)} placeholder={t("city")} className={INPUT_CLASS} />
                </div>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-400/30 text-rose-200 text-sm rounded-xl p-4 mb-5">
                <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* SUBMIT */}
            <button
              onClick={handleMatch}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-extrabold text-base text-white bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  <span className="text-sm font-semibold">{loadingSteps[loadingStep]}</span>
                </>
              ) : (
                <>
                  <Heart size={20} /> {t("matchBtn")}
                </>
              )}
            </button>

            {/* Loading progress dots */}
            {loading && (
              <div className="flex justify-center gap-2 mt-4">
                {loadingSteps.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i <= loadingStep ? "w-8 bg-orange-400" : "w-3 bg-white/15"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* ASTROLOGER BANNER */}
            <Link
              href="/chat"
              className="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-pink-500/15 border border-orange-400/20 hover:border-orange-400/40 transition-colors"
            >
              <span className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30">
                <MessageCircle size={22} />
              </span>
              <div className="flex-1">
                <p className="font-bold text-sm text-white">{t("bannerTitle")}</p>
                <p className="text-xs text-gray-300 mt-0.5">{t("bannerSub")}</p>
              </div>
              <ArrowRight size={18} className="text-orange-300" />
            </Link>

            {/* SEO + FAQ */}
            <div className={`${CARD_CLASS} p-6 mt-8`}>
              <SectionTitle icon={<Sparkles size={16} />}>{t("seoTitle")}</SectionTitle>
              <p className="text-sm text-gray-300 leading-relaxed">{t("seoDesc")}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4 text-white">{t("faqTitle")}</h3>
              <div className="space-y-3">
                {[
                  { q: t("faq1Q"), a: t("faq1A") },
                  { q: t("faq2Q"), a: t("faq2A") },
                ].map((f, i) => (
                  <div key={i} className="bg-[#1b1630] border border-white/10 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-3 text-left px-4 py-4"
                    >
                      <span className="text-sm font-semibold text-gray-100">{f.q}</span>
                      {openFaq === i ? <ChevronUp size={18} className="text-orange-300 shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
                    </button>
                    {openFaq === i && <p className="px-4 pb-4 text-sm text-gray-300 leading-relaxed">{f.a}</p>}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* =====================================================
                RESULT SECTION
            ===================================================== */}
            <div className={`${CARD_CLASS} p-6 text-center overflow-hidden`}>
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl opacity-20" style={{ background: `linear-gradient(135deg, ${meta.from}, ${meta.to})` }} />
              <div className="relative">
                <p className="text-sm text-gray-400 mb-5">{t("result")}</p>

                {/* Names */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="px-3 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-200 text-sm font-semibold">
                    {boyName || t("boyPrefix")}
                  </span>
                  <Heart size={20} className="text-pink-400 fill-pink-400" />
                  <span className="px-3 py-1.5 rounded-full bg-pink-500/15 border border-pink-400/30 text-pink-200 text-sm font-semibold">
                    {girlName || t("girlPrefix")}
                  </span>
                </div>

                <ScoreRing score={score} from={meta.from} to={meta.to} />

                <p className={`mt-5 text-xl font-extrabold ${meta.text}`}>{meta.label}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {score} {t("total")}
                </p>
              </div>
            </div>

            {/* BREAKDOWN */}
            {kootas.length > 0 && (
              <div className={`${CARD_CLASS} mt-5 overflow-hidden`}>
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="w-full flex items-center justify-between px-5 py-4"
                >
                  <span className="flex items-center gap-2 text-sm font-bold text-white">
                    <Star size={16} className="text-amber-300" /> {t("breakdown")}
                  </span>
                  {showBreakdown ? <ChevronUp size={18} className="text-orange-300" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>

                {showBreakdown && (
                  <div className="px-5 pb-5 space-y-4 border-t border-white/10 pt-4">
                    {kootas.map((k: any, i: number) => {
                      const pct = k.max ? Math.min((k.score / k.max) * 100, 100) : 0;
                      return (
                        <div key={i}>
                          <div className="flex items-center justify-between text-sm mb-1.5">
                            <span className="font-semibold text-gray-100">{k.name}</span>
                            <span className="text-orange-300 font-bold">
                              {k.score}
                              {k.max ? <span className="text-gray-500 font-normal"> / {k.max}</span> : null}
                            </span>
                          </div>
                          {k.max > 0 && (
                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all duration-1000"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          )}
                          {k.note && <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{k.note}</p>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* DOSHAS */}
            <div className={`${CARD_CLASS} mt-5 p-5`}>
              <SectionTitle icon={<ShieldAlert size={16} />}>{t("doshaTitle")}</SectionTitle>
              <div className="space-y-3">
                {doshaList.map((d) => {
                  const st = statusStyle(d.status);
                  return (
                    <div key={d.key} className="bg-black/20 border border-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-gray-100">{d.label}</span>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${st.chip}`}>{st.label}</span>
                      </div>
                      {doshaNotes[d.key] && <p className="text-xs text-gray-400 mt-2 leading-relaxed">{doshaNotes[d.key]}</p>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STRENGTHS */}
            {strengths.length > 0 && (
              <div className={`${CARD_CLASS} mt-5 p-5`}>
                <SectionTitle icon={<Sun size={16} />}>{t("strengths")}</SectionTitle>
                <BulletList items={strengths} tone="good" />
              </div>
            )}

            {/* ATTENTION */}
            {attention.length > 0 && (
              <div className={`${CARD_CLASS} mt-5 p-5`}>
                <SectionTitle icon={<AlertCircle size={16} />}>{t("attention")}</SectionTitle>
                <BulletList items={attention} tone="warn" />
              </div>
            )}

            {/* ADVICE */}
            {advice.length > 0 && (
              <div className={`${CARD_CLASS} mt-5 p-5`}>
                <SectionTitle icon={<Sparkles size={16} />}>{t("advice")}</SectionTitle>
                <BulletList items={advice} tone="info" />
              </div>
            )}

            {/* NEXT STEPS */}
            {nextSteps.length > 0 && (
              <div className={`${CARD_CLASS} mt-5 p-5`}>
                <SectionTitle icon={<ArrowRight size={16} />}>{t("nextSteps")}</SectionTitle>
                <BulletList items={nextSteps} tone="info" />
              </div>
            )}

            {/* SOUL SUMMARY */}
            {soul && (
              <div className="mt-5 p-6 rounded-2xl bg-gradient-to-br from-orange-500/15 via-rose-500/10 to-fuchsia-600/15 border border-orange-400/25">
                <div className="flex items-center gap-2 mb-3 text-orange-200">
                  <Heart size={16} className="fill-pink-400 text-pink-400" />
                  <span className="text-sm font-bold">{t("soulLabel")}</span>
                </div>
                <p className="text-sm text-gray-100 leading-relaxed">{itemText(soul)}</p>
              </div>
            )}

            {/* ASK MORE */}
            <div className={`${CARD_CLASS} mt-5 p-5`}>
              <SectionTitle icon={<MessageCircle size={16} />}>{t("askQ")}</SectionTitle>
              <div className="space-y-2.5">
                {[t("q1"), t("q2"), t("q3")].map((q, i) => (
                  <Link
                    key={i}
                    href={`/chat?q=${encodeURIComponent(q)}`}
                    className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl bg-black/20 border border-white/5 hover:border-orange-400/40 hover:bg-orange-500/10 transition-colors text-sm text-gray-200"
                  >
                    <span>{q}</span>
                    <ArrowRight size={16} className="text-orange-300 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              <Link
                href="/chat"
                className="sm:col-span-2 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 shadow-lg shadow-rose-500/25 hover:scale-[1.01] active:scale-[0.98] transition-transform"
              >
                <MessageCircle size={18} /> {t("chat")}
              </Link>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-emerald-200 bg-emerald-500/10 border border-emerald-400/30 hover:bg-emerald-500/20 transition-colors"
              >
                <Share2 size={17} /> {t("share")}
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sky-200 bg-sky-500/10 border border-sky-400/30 hover:bg-sky-500/20 transition-colors"
              >
                <Download size={17} /> {t("pdf")}
              </button>
              <button
                onClick={handleReset}
                className="sm:col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl text-sm text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <RefreshCw size={16} /> {t("reset")}
              </button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-6">{t("disclaimer")}</p>
          </>
        )}

        {/* FOOTER */}
        <p className="text-center text-[11px] text-gray-500 mt-8 mb-4 max-w-md mx-auto leading-relaxed">
          {t("footerText")}
        </p>
      </div>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f0c1a]/90 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-4xl mx-auto grid grid-cols-4 py-2">
          {[
            { href: "/", icon: <Home size={20} />, label: t("home"), active: false },
            { href: "/chat", icon: <MessageCircle size={20} />, label: t("chatNav"), active: false },
            { href: "/matching", icon: <Heart size={20} />, label: t("title"), active: true },
            { href: "/profile", icon: <User size={20} />, label: t("profile"), active: false },
          ].map((n, i) => (
            <Link
              key={i}
              href={n.href}
              className={`flex flex-col items-center gap-1 py-1.5 text-[11px] transition-colors ${
                n.active ? "text-orange-300" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <span className={n.active ? "p-2 -mt-1 rounded-full bg-orange-500/15 border border-orange-400/30" : "p-2 -mt-1"}>
                {n.icon}
              </span>
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

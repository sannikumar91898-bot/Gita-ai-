// app/kundli/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Download, RefreshCcw, Star, ShieldCheck, CheckCircle2, Home, MessageCircle, Sun, User, Loader2, FileText } from "lucide-react";
import { useApp } from "../Providers";

// 🔥 10 Language Translation Helper
const getUIText = (lang: string, key: string) => {
  const ui: Record<string, Record<string, string>> = {
    hi: { 
      title: "जन्म कुंडली", subtitle: "गीता ज्योतिषी द्वारा तैयार", name: "पूरा नाम", dob: "जन्म तिथि", time: "जन्म का समय", place: "जन्म स्थान", calc: "गणना हो रही है...", generate: "कुंडली बनाएं", chart: "जन्म कुंडली", by: "गीता ज्योतिषी द्वारा", lagna: "लग्न", rashi: "चंद्र राशि", nakshatra: "नक्षत्र", dasha: "वर्तमान दशा", planetsTitle: "ग्रह स्पष्ट", planet: "ग्रह", sign: "राशि", house: "भाव", noPlanets: "ग्रहों की जानकारी उपलब्ध नहीं है", generated: "तैयार किया गया", notice: "विशेष सुझाव:", scareText: "अपनी कुंडली के ग्रहों और सही करियर/विवाह टाइमिंग को समझने के लिए हमारी ज्योतिषी से बात करें।", chatCTA: "ज्योतिषी से बात करें — पहली चैट मुफ्त", wait: "रुकें...", download: "PDF डाउनलोड", again: "दोबारा बनाएं", consentText: "मैं अपनी जन्म तिथि, समय और स्थान को सुरक्षित रूप से सहेजने की सहमति देता/देती हूँ।", unknownTime: "मुझे अपना सही जन्म समय नहीं पता (12:00 PM मान लिया जाएगा)", aiReport: "ज्योतिषीय विश्लेषण", loadingHistory: "आपकी पुरानी कुंडली लोड हो रही है...", moonDegree: "चंद्र डिग्री"
    },
    hinglish: { 
      title: "Janam Kundli", subtitle: "Gita Jyotishi dwara taiyar", name: "Full Name", dob: "Date of Birth", time: "Time of Birth", place: "Place of Birth", calc: "Calculating...", generate: "Generate Kundli", chart: "Birth Chart", by: "By Gita Jyotishi", lagna: "Lagna", rashi: "Moon Sign", nakshatra: "Nakshatra", dasha: "Current Dasha", planetsTitle: "Graha Spashta", planet: "Planet", sign: "Sign", house: "House", noPlanets: "Planetary details unavailable", generated: "Generated on", notice: "Special Advice:", scareText: "Apni kundli ke grahon aur sahi career/vivah timing ko samajhne ke liye humari jyotishi se baat karein.", chatCTA: "Jyotishi se baat karein — First chat FREE", wait: "Wait...", download: "Download PDF", again: "Calculate Again", consentText: "Main apni janm tithi, samay aur sthan ko securely save karne ki consent deta/deti hoon.", unknownTime: "Mujhe apna exact birth time nahi pata (12:00 PM assume kiya jayega)", aiReport: "Jyotishiy Vishleshan", loadingHistory: "Aapki purani kundli load ho rahi hai...", moonDegree: "Moon Degree"
    },
    en: { 
      title: "Janam Kundli", subtitle: "Prepared by Gita Jyotishi", name: "Full Name", dob: "Date of Birth", time: "Time of Birth", place: "Place of Birth", calc: "Calculating...", generate: "Generate Kundli", chart: "Birth Chart", by: "By Gita Jyotishi", lagna: "Lagna", rashi: "Moon Sign", nakshatra: "Nakshatra", dasha: "Current Dasha", planetsTitle: "Planetary Positions", planet: "Planet", sign: "Sign", house: "House", noPlanets: "Planetary details unavailable", generated: "Generated on", notice: "Special Advice:", scareText: "Talk to our Jyotishi to understand the planets in your chart and accurate career/marriage timing.", chatCTA: "Talk to Jyotishi — First chat FREE", wait: "Wait...", download: "Download PDF", again: "Calculate Again", consentText: "I consent to storing my birth details securely to generate my personal kundli and readings.", unknownTime: "I don't know my exact birth time (12:00 PM will be assumed)", aiReport: "Astrological Analysis", loadingHistory: "Loading your previous kundli...", moonDegree: "Moon Degree"
    },
    te: { 
      title: "జనన కుండలి", subtitle: "గీత జ్యోతిషి ద్వారా తయారు చేయబడింది", name: "పూర్తి పేరు", dob: "పుట్టిన తేదీ", time: "పుట్టిన సమయం", place: "పుట్టిన స్థలం", calc: "లెక్కిస్తోంది...", generate: "కుండలిని రూపొందించండి", chart: "జనన చార్ట్", by: "గీత జ్యోతిషి ద్వారా", lagna: "లగ్నం", rashi: "రాశి", nakshatra: "నక్షత్రం", dasha: "ప్రస్తుత దశ", planetsTitle: "గ్రహ స్థానాలు", planet: "గ్రహం", sign: "రాశి", house: "ఇల్లు", noPlanets: "గ్రహ వివరాలు అందుబాటులో లేవు", generated: "రూపొందించబడింది", notice: "ప్రత్యేక సలహా:", scareText: "మీ కుండలిలోని గ్రహాలను మరియు ఖచ్చితమైన కెరీర్/వివాహ సమయాన్ని అర్థం చేసుకోవడానికి మా జ్యోతిషిని సంప్రదించండి.", chatCTA: "జ్యోతిషిని సంప్రదించండి — మొదటి చాట్ ఉచితం", wait: "వేచి ఉండండి...", download: "PDF డౌన్‌లోడ్", again: "మళ్లీ లెక్కించండి", consentText: "నా జనన వివరాలను సురక్షితంగా నిల్వ చేయడానికి నేను సమ్మతిస్తున్నాను.", unknownTime: "నాకు ఖచ్చితమైన పుట్టిన సమయం తెలియదు", aiReport: "జ్యోతిష్య విశ్లేషణ", loadingHistory: "మీ మునుపటి కుండలి లోడ్ అవుతోంది...", moonDegree: "చంద్ర డిగ్రీ" 
    },
    ta: { 
      title: "ஜனன ஜாதகம்", subtitle: "கீதா ஜோதிடரால் தயாரிக்கப்பட்டது", name: "முழு பெயர்", dob: "பிறந்த தேதி", time: "பிறந்த நேரம்", place: "பிறந்த இடம்", calc: "கணக்கிடப்படுகிறது...", generate: "ஜாதகத்தை உருவாக்கு", chart: "பிறப்பு விளக்கப்படம்", by: "கீதா ஜோதிடர் மூலம்", lagna: "லக்னம்", rashi: "ராசி", nakshatra: "நட்சத்திரம்", dasha: "தற்போதைய தசை", planetsTitle: "கிரக நிலைகள்", planet: "கிரகம்", sign: "ராசி", house: "வீடு", noPlanets: "கிரக விவரங்கள் இல்லை", generated: "உருவாக்கப்பட்டது", notice: "சிறப்பு ஆலோசனை:", scareText: "உங்கள் ஜாதகத்தில் உள்ள கிரகங்களையும், சரியான தொழில்/திருமண நேரத்தையும் புரிந்து கொள்ள எங்கள் ஜோதிடரை அணுகவும்.", chatCTA: "ஜோதிடரிடம் பேசுங்கள் — முதல் அரட்டை இலவசம்", wait: "காத்திருங்கள்...", download: "PDF பதிவிறக்கம்", again: "மீண்டும் கணக்கிடு", consentText: "எனது பிறப்பு விவரங்களை பாதுகாப்பாக சேமிக்க நான் ஒப்புக்கொள்கிறேன்.", unknownTime: "எனக்கு சரியான பிறந்த நேரம் தெரியாது", aiReport: "ஜோதிட பகுப்பாய்வு", loadingHistory: "உங்கள் முந்தைய ஜாதகம் ஏற்றப்படுகிறது...", moonDegree: "சந்திர டிகிரி" 
    },
    kn: { 
      title: "ಜನ್ಮ ಕುಂಡಲಿ", subtitle: "ಗೀತಾ ಜ್ಯೋತಿಷಿಯಿಂದ ತಯಾರಿಸಲಾಗಿದೆ", name: "ಪೂರ್ಣ ಹೆಸರು", dob: "ಹುಟ್ಟಿದ ದಿನಾಂಕ", time: "ಹುಟ್ಟಿದ ಸಮಯ", place: "ಹುಟ್ಟಿದ ಸ್ಥಳ", calc: "ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತಿದೆ...", generate: "ಕುಂಡಲಿ ರಚಿಸಿ", chart: "ಜನ್ಮ ಚಾರ್ಟ್", by: "ಗೀತಾ ಜ್ಯೋತಿಷಿಯಿಂದ", lagna: "ಲಗ್ನ", rashi: "ರಾಶಿ", nakshatra: "ನಕ್ಷತ್ರ", dasha: "ಪ್ರಸ್ತುತ ದಶೆ", planetsTitle: "ಗ್ರಹ ಸ್ಥಾನಗಳು", planet: "ಗ್ರಹ", sign: "ರಾಶಿ", house: "ಮನೆ", noPlanets: "ಗ್ರಹ ವಿವರಗಳು ಲಭ್ಯವಿಲ್ಲ", generated: "ರಚಿಸಲಾಗಿದೆ", notice: "ವಿಶೇಷ ಸಲಹೆ:", scareText: "ನಿಮ್ಮ ಕುಂಡಲಿಯಲ್ಲಿನ ಗ್ರಹಗಳನ್ನು ಮತ್ತು ನಿಖರವಾದ ವೃತ್ತಿ/ವಿವಾಹ ಸಮಯವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನಮ್ಮ ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.", chatCTA: "ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ", wait: "ನಿರೀಕ್ಷಿಸಿ...", download: "PDF ಡೌನ್‌ಲೋಡ್", again: "ಮತ್ತೆ ಲೆಕ್ಕಹಾಕಿ", consentText: "ನನ್ನ ಜನ್ಮ ವಿವರಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹಿಸಲು ನಾನು ಒಪ್ಪುತ್ತೇನೆ.", unknownTime: "ನನಗೆ ನಿಖರವಾದ ಜನ್ಮ ಸಮಯ ತಿಳಿದಿಲ್ಲ", aiReport: "ಜ್ಯೋತಿಷ್ಯ ವಿಶ್ಲೇಷಣೆ", loadingHistory: "ನಿಮ್ಮ ಹಿಂದಿನ ಕುಂಡಲಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...", moonDegree: "ಚಂದ್ರ ಡಿಗ್ರಿ" 
    },
    bn: { 
      title: "জন্ম কুণ্ডলী", subtitle: "গীতা জ্যোতিষী দ্বারা তৈরি", name: "পুরো নাম", dob: "জন্ম তারিখ", time: "জন্ম সময়", place: "জন্মস্থান", calc: "গণনা করা হচ্ছে...", generate: "কুণ্ডলী তৈরি করুন", chart: "জন্ম চার্ট", by: "গীতা জ্যোতিষী দ্বারা", lagna: "লগ্ন", rashi: "রাশি", nakshatra: "নক্ষত্র", dasha: "বর্তমান দশা", planetsTitle: "গ্রহের অবস্থান", planet: "গ্রহ", sign: "রাশি", house: "ঘর", noPlanets: "গ্রহের বিবরণ পাওয়া যায়নি", generated: "তৈরি করা হয়েছে", notice: "বিশেষ পরামর্শ:", scareText: "আপনার কুণ্ডলীর গ্রহগুলি এবং সঠিক কর্মজীবন/বিবাহের সময় বুঝতে আমাদের জ্যোতিষীর সাথে কথা বলুন।", chatCTA: "জ্যোতিষীর সাথে কথা বলুন — প্রথম চ্যাট ফ্রি", wait: "অপেক্ষা করুন...", download: "PDF ডাউনলোড", again: "আবার গণনা করুন", consentText: "আমার জন্ম বিবরণ সুরক্ষিতভাবে সংরক্ষণ করতে আমি সম্মত।", unknownTime: "আমি আমার সঠিক জন্ম সময় জানি না", aiReport: "জ্যোতিষ বিশ্লেষণ", loadingHistory: "আপনার আগের কুণ্ডলী লোড হচ্ছে...", moonDegree: "চাঁদের ডিগ্রি" 
    },
    mr: { 
      title: "जन्म कुंडली", subtitle: "गीता ज्योतिषी द्वारे तयार", name: "पूर्ण नाव", dob: "जन्म तारीख", time: "जन्म वेळ", place: "जन्मस्थान", calc: "गणना करत आहे...", generate: "कुंडली तयार करा", chart: "जन्म चार्ट", by: "गीता ज्योतिषी द्वारे", lagna: "लग्न", rashi: "राशी", nakshatra: "नक्षत्र", dasha: "सध्याची दशा", planetsTitle: "ग्रहांची स्थिती", planet: "ग्रह", sign: "राशी", house: "घर", noPlanets: "ग्रहांची माहिती उपलब्ध नाही", generated: "तयार केले", notice: "विशेष सल्ला:", scareText: "तुमच्या कुंडलीतील ग्रह आणि अचूक करिअर/विवाहाची वेळ समजून घेण्यासाठी आमच्या ज्योतिषाशी बोला.", chatCTA: "ज्योतिषाशी बोला — पहिली चॅट मोफत", wait: "थांबा...", download: "PDF डाउनलोड", again: "पुन्हा गणना करा", consentText: "माझे जन्म तपशील सुरक्षितपणे संग्रहित करण्यास मी संमती देतो/देते.", unknownTime: "मला माझी नेमकी जन्मवेळ माहित नाही", aiReport: "ज्योतिष विश्लेषण", loadingHistory: "तुमची जुनी कुंडली लोड होत आहे...", moonDegree: "चंद्र अंश" 
    },
    gu: { 
      title: "જન્મ કુંડળી", subtitle: "ગીતા જ્યોતિષી દ્વારા તૈયાર", name: "પૂરું નામ", dob: "જન્મ તારીખ", time: "જન્મ સમય", place: "જન્મ સ્થળ", calc: "ગણતરી થઈ રહી છે...", generate: "કુંડળી બનાવો", chart: "જન્મ ચાર્ટ", by: "ગીતા જ્યોતિષી દ્વારા", lagna: "લગ્ન", rashi: "રાશિ", nakshatra: "નક્ષત્ર", dasha: "વર્તમાન દશા", planetsTitle: "ગ્રહોની સ્થિતિ", planet: "ગ્રહ", sign: "રાશિ", house: "ઘર", noPlanets: "ગ્રહોની વિગતો ઉપલબ્ધ નથી", generated: "તૈયાર કરેલ", notice: "ખાસ સલાહ:", scareText: "તમારી કુંડળીના ગ્રહો અને સચોટ કરિયર/લગ્ન સમય સમજવા માટે અમારા જ્યોતિષી સાથે વાત કરો.", chatCTA: "જ્યોતિષી સાથે વાત કરો — પ્રથમ ચેટ મફત", wait: "રાહ જુઓ...", download: "PDF ડાઉનલોડ", again: "ફરી ગણતરી કરો", consentText: "હું મારી જન્મ વિગતો સુરક્ષિત રીતે સંગ્રહિત કરવા માટે સંમતિ આપું છું.", unknownTime: "મને મારો સચોટ જન્મ સમય ખબર નથી", aiReport: "જ્યોતિષ વિશ્લેષણ", loadingHistory: "તમારી જૂની કુંડળી લોડ થઈ રહી છે...", moonDegree: "ચંદ્ર અંશ" 
    },
    ml: { 
      title: "ജന്മ കുണ്ഡലി", subtitle: "ഗീത ജ്യോതിഷി തയ്യാറാക്കിയത്", name: "മുഴുവൻ പേര്", dob: "ജനന തീയതി", time: "ജനന സമയം", place: "ജനന സ്ഥലം", calc: "കണക്കാക്കുന്നു...", generate: "കുണ്ഡലി സൃഷ്ടിക്കുക", chart: "ജനന ചാർട്ട്", by: "ഗീത ജ്യോതിഷി വഴി", lagna: "ലഗ്നം", rashi: "രാശി", nakshatra: "നക്ഷത്രം", dasha: "നിലവിലെ ദശ", planetsTitle: "ഗ്രഹ സ്ഥാനങ്ങൾ", planet: "ഗ്രഹം", sign: "രാശി", house: "ഭാവം", noPlanets: "ഗ്രഹ വിവരങ്ങൾ ലഭ്യമല്ല", generated: "സൃഷ്ടിച്ചത്", notice: "പ്രത്യേക ഉപദേശം:", scareText: "നിങ്ങളുടെ ജാതകത്തിലെ ഗ്രഹങ്ങളും കൃത്യമായ കരിയർ/വിവാഹ സമയവും മനസ്സിലാക്കാൻ ഞങ്ങളുടെ ജ്യോതിഷിയുമായി സംസാരിക്കുക.", chatCTA: "ജ്യോതിഷിയോട് സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം", wait: "കാത്തിരിക്കുക...", download: "PDF ഡൗൺലോഡ്", again: "വീണ്ടും കണക്കാക്കുക", consentText: "എന്റെ ജനന വിവരങ്ങൾ സുരക്ഷിതമായി സൂക്ഷിക്കാൻ ഞാൻ സമ്മതിക്കുന്നു.", unknownTime: "എനിക്ക് കൃത്യമായ ജനന സമയം അറിയില്ല", aiReport: "ജ്യോതിഷ വിശകലനം", loadingHistory: "നിങ്ങളുടെ മുൻ കുണ്ഡലി ലോഡ് ചെയ്യുന്നു...", moonDegree: "ചന്ദ്ര ഡിഗ്രി" 
    },
  };
  return ui[lang]?.[key] || ui["en"][key];
};

export default function KundliPage() {
  const { theme, lang, me } = useApp();
  const router = useRouter();
  const isDark = theme === "dark";
  
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [chart, setChart] = useState<any>(null);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [suggestedChatPrompt, setSuggestedChatPrompt] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [notSureTime, setNotSureTime] = useState(false);

  const pdfRef = useRef<HTMLDivElement>(null);

  const t = (key: string) => getUIText(lang, key);

  useEffect(() => {
    let cancelled = false;
    async function fetchExisting() {
      try {
        const res = await fetch("/api/kundli", { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        
        if (data.chart) {
          setChart(data.chart);
          if (data.interpretation && typeof data.interpretation === "string") {
            setInterpretation(data.interpretation);
          }
          if (data.suggestedChatPrompt) {
            setSuggestedChatPrompt(data.suggestedChatPrompt);
          }
        }
        if (data.birth) {
          setName(data.birth.name || "");
          setDob(data.birth.dob || "");
          setTime(data.birth.birthTime || "");
          setPlace(data.birth.birthPlace || "");
          if (data.birth.isBirthTimeUnknown) setNotSureTime(true);
        }
      } catch (e) {
        console.error("Fetch existing kundli failed", e);
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    }
    void fetchExisting();
    return () => { cancelled = true; };
  }, []);

  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c] shadow-lg" : "border-orange-100 bg-white shadow-md";
  const inputClass = isDark ? "w-full rounded-xl border border-slate-700 bg-[#0A0F19] p-4 text-[15px] font-medium focus:border-[#ff6b00] focus:outline-none text-white transition-colors" : "w-full rounded-xl border border-gray-300 bg-white p-4 text-[15px] font-medium focus:border-[#ff6b00] focus:outline-none text-gray-900 shadow-sm transition-colors";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError(t("consentText")); 
      return;
    }
    
    setLoading(true);
    setError("");
    setChart(null);
    setInterpretation(null);
    setSuggestedChatPrompt(null);

    try {
      const res = await fetch("/api/kundli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          dateOfBirth: dob, 
          timeOfBirth: notSureTime ? "12:00" : time, 
          isTimeUnknown: notSureTime,
          placeOfBirth: place,
          language: lang,
          consent: true
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 422) {
          throw new Error(data.error || "Janm sthan nahi mila. Kripya sahi sheher likhein.");
        }
        throw new Error(data.error || t("generate") + " Failed");
      }
      
      setChart(data.chart);
      if (data.interpretation && typeof data.interpretation === "string") {
        setInterpretation(data.interpretation);
      }
      if (data.suggestedChatPrompt) {
        setSuggestedChatPrompt(data.suggestedChatPrompt);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!pdfRef.current) return;
    setIsDownloading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const html2pdf = (await import("html2pdf.js")).default;
      
      const opt = {
        margin:       [10, 10, 10, 10],
        filename:     `Kundli_${name || "User"}.pdf`,
        image:        { type: 'jpeg' as const, quality: 0.95 },
        html2canvas:  { scale: 1.5, useCORS: true, backgroundColor: "#ffffff", logging: false }, 
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(pdfRef.current).save();
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("PDF download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleChatNow = () => {
    if (suggestedChatPrompt) {
      router.push(`/chat/gita?prefill=${encodeURIComponent(suggestedChatPrompt)}`);
    } else {
      router.push("/chat/gita");
    }
  };

  if (historyLoading) {
    return (
      <div className={`min-h-[100dvh] flex flex-col items-center justify-center ${pageClass}`}>
        <Sparkles className="animate-spin text-[#ff6b00] mb-4" size={40} />
        <p className="text-[15px] font-bold text-[#ff6b00]">{t("loadingHistory")}</p>
      </div>
    );
  }

  return (
    <main className={`min-h-[100dvh] w-full pb-32 ${pageClass} font-sans`}>
      
      <div className="w-full max-w-2xl mx-auto px-3 pt-4 space-y-5">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2.5 transition-colors ${isDark ? "bg-[#0A0F19] text-slate-300" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-[17px] font-black uppercase tracking-tight text-[#ff6b00]">{t("title")}</h1>
            <p className={`text-[11px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("subtitle")}</p>
          </div>
        </header>

        {/* FORM (Show only if no chart is generated) */}
        {!chart && (
          <form onSubmit={handleSubmit} className={`space-y-5 rounded-[1.5rem] border p-5 sm:p-6 ${cardClass}`}>
            <div className="space-y-2">
              <label className={`text-[12px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("name")}</label>
              <input required value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="e.g. Rahul Sharma" />
            </div>
            
            <div className="space-y-2">
              <label className={`text-[12px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("dob")}</label>
              <input required type="date" value={dob} onChange={e => setDob(e.target.value)} className={inputClass} />
            </div>
            
            <div className="space-y-2">
              <label className={`text-[12px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("time")}</label>
              <input required type="time" value={time} onChange={e => setTime(e.target.value)} disabled={notSureTime} className={`${inputClass} ${notSureTime ? "opacity-50" : ""}`} />
              
              <div className={`flex items-center gap-3 mt-3 p-3 rounded-xl border ${isDark ? "border-slate-700 bg-slate-800/30" : "border-gray-200 bg-gray-50"}`}>
                <input type="checkbox" id="unknownTime" checked={notSureTime} onChange={e => setNotSureTime(e.target.checked)} className="w-5 h-5 accent-[#ff6b00] cursor-pointer rounded" />
                <label htmlFor="unknownTime" className={`text-[12.5px] font-medium cursor-pointer ${isDark ? "text-slate-300" : "text-gray-600"}`}>{t("unknownTime")}</label>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-[12px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("place")}</label>
              <input required value={place} onChange={e => setPlace(e.target.value)} className={inputClass} placeholder="e.g. Patna, Bihar" />
            </div>
            
            <div className={`flex items-start gap-3 p-4 rounded-xl border ${isDark ? "border-slate-700 bg-slate-800/30" : "border-orange-200 bg-orange-50"}`}>
              <input type="checkbox" id="consent" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1 w-5 h-5 accent-[#ff6b00] cursor-pointer rounded" />
              <label htmlFor="consent" className={`text-[12.5px] font-medium leading-relaxed cursor-pointer ${isDark ? "text-slate-300" : "text-gray-700"}`}>{t("consentText")}</label>
            </div>

            {error && <p className="text-[13px] text-rose-500 bg-rose-500/10 p-3.5 rounded-xl font-bold border border-rose-500/20">{error}</p>}
            
            {/* 🔥 FIXED: Completed submit button */}
            <button 
              type="submit" 
              disabled={loading || !consent} 
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] px-4 py-4 font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {t("calc")}
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  {t("generate")}
                </>
              )}
            </button>
          </form>
        )}

        {/* RESULT SCREEN */}
        {chart && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div ref={pdfRef} className={`rounded-[1.5rem] border p-6 relative overflow-hidden ${cardClass}`}>
              
              <div className="text-center mb-6 relative z-10">
                <div className="mx-auto w-16 h-16 rounded-full bg-[#ff6b00]/10 flex items-center justify-center mb-4">
                  <Star className="text-[#ff6b00] fill-[#ff6b00]" size={28} />
                </div>
                <h2 className={`text-xl font-black mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>{t("chart")}</h2>
                <p className={`text-[11px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("by")}</p>
              </div>

              {/* Core Details Grid */}
              <div className="grid grid-cols-2 gap-3 relative z-10 mb-6">
                <div className={`p-3 rounded-xl border ${isDark ? "bg-[#0A0F19] border-slate-800" : "bg-gray-50 border-gray-200"}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? "text-slate-500" : "text-gray-500"}`}>{t("lagna")}</p>
                  <p className={`text-[14px] font-black ${isDark ? "text-white" : "text-gray-900"}`}>{chart.lagna.rashiNameHi} ({chart.lagna.rashiName})</p>
                </div>
                <div className={`p-3 rounded-xl border ${isDark ? "bg-[#0A0F19] border-slate-800" : "bg-gray-50 border-gray-200"}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? "text-slate-500" : "text-gray-500"}`}>{t("rashi")}</p>
                  <p className={`text-[14px] font-black ${isDark ? "text-white" : "text-gray-900"}`}>{chart.moonSign.rashiNameHi} ({chart.moonSign.rashiName})</p>
                </div>
                <div className={`p-3 rounded-xl border ${isDark ? "bg-[#0A0F19] border-slate-800" : "bg-gray-50 border-gray-200"}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? "text-slate-500" : "text-gray-500"}`}>{t("nakshatra")}</p>
                  <p className={`text-[14px] font-black ${isDark ? "text-white" : "text-gray-900"}`}>{chart.nakshatra.name} (Pada {chart.nakshatra.pada})</p>
                  {/* 🔥 FIX: Added Moon Degree for clarity */}
                  <p className={`text-[10px] font-medium mt-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                    {t("moonDegree")}: {chart.moonSign.rashiName} {chart.planets.find((p:any) => p.planet === 'Moon')?.degreeInSign || ''}°
                  </p>
                </div>
                <div className={`p-3 rounded-xl border ${isDark ? "bg-[#0A0F19] border-slate-800" : "bg-gray-50 border-gray-200"}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isDark ? "text-slate-500" : "text-gray-500"}`}>{t("dasha")}</p>
                  <p className={`text-[14px] font-black ${isDark ? "text-white" : "text-gray-900"}`}>{chart.currentDasha?.maha} / {chart.currentDasha?.antar}</p>
                </div>
              </div>

              {/* Planets Table */}
              <div className="relative z-10">
                <h3 className={`text-[13px] font-black uppercase tracking-wider mb-3 border-b pb-2 ${isDark ? "text-slate-300 border-slate-700" : "text-gray-700 border-gray-200"}`}>{t("planetsTitle")}</h3>
                <div className="space-y-2">
                  {chart.planets.map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-[12.5px]">
                      <span className={`font-bold w-20 ${isDark ? "text-slate-200" : "text-gray-800"}`}>{p.planet}</span>
                      <span className={`flex-1 text-center ${isDark ? "text-slate-400" : "text-gray-500"}`}>{p.rashiName} {p.retrograde ? "(R)" : ""}</span>
                      <span className={`font-semibold w-16 text-right ${isDark ? "text-slate-300" : "text-gray-700"}`}>{t("house")} {p.house}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Astrological Report Text */}
              {interpretation && (
                <div className={`mt-6 pt-5 border-t relative z-10 ${isDark ? "border-slate-700" : "border-gray-200"}`}>
                  <h3 className={`text-[13px] font-black uppercase tracking-wider mb-2 ${isDark ? "text-[#ff6b00]" : "text-[#ff6b00]"}`}>{t("aiReport")}</h3>
                  <p className={`text-[13.5px] leading-relaxed whitespace-pre-wrap font-medium ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                    {interpretation}
                  </p>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleDownload} 
                disabled={isDownloading} 
                className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[14px] border transition-all ${isDark ? "border-slate-700 bg-[#151d2c] text-white hover:bg-slate-800" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />} 
                {t("download")}
              </button>
              <button 
                onClick={() => { setChart(null); setInterpretation(null); }} 
                className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[14px] border transition-all ${isDark ? "border-slate-700 bg-[#151d2c] text-white hover:bg-slate-800" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                <RefreshCcw size={18} /> 
                {t("again")}
              </button>
            </div>

            {/* CHAT CTA */}
            <button 
              onClick={handleChatNow}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white font-bold text-[15px] shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
            >
              <MessageCircle size={20} /> {t("chatCTA")}
            </button>

          </div>
        )}
      </div>
    </main>
  );
}
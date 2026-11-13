// app/panchang/page.tsx
"use client";

import { ArrowLeft, CalendarDays, Sun, Moon, Flame, MessageCircle, AlertCircle, Home, User, Crown, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
      bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "अपनी समस्या का समाधान पाएं – पहली चैट FREE",
      home: "होम", chat: "चैट", daily: "राशिफल", profile: "प्रोफाइल",
      seoTitle: "आज का पंचांग (Daily Panchang)", 
      seoDesc: "हिंदू धर्म में किसी भी शुभ कार्य को शुरू करने से पहले पंचांग देखना बहुत जरूरी माना जाता है। पंचांग में तिथि, वार, नक्षत्र, योग और करण की जानकारी होती है। GitaTalk पर पाएं आज का सटीक पंचांग, राहु काल, और सबसे शुभ मुहूर्त।",
      faqTitle: "अक्सर पूछे जाने वाले प्रश्न (FAQs)",
      f1q: "राहु काल क्या है?", f1a: "राहु काल दिन का वह समय होता है जो शुभ कार्यों के लिए अशुभ माना जाता है। इस दौरान नई शुरुआत या पूजा-पाठ नहीं करना चाहिए।",
      f2q: "पंचांग क्यों देखा जाता है?", f2a: "पंचांग से हमें दिन की शुभता और अशुभता का पता चलता है। यह बताता है कि किस समय कौन सा काम करना सही रहेगा।",
      disclaimer: "यह पंचांग सामान्य जानकारी के लिए है। सटीक गणना के लिए ज्योतिषी से परामर्श लें।"
    },
    hinglish: { 
      title: "Daily Panchang", today: "Aaj Ka Panchang", tithi: "Tithi", shukla: "Shukla Paksha", 
      rahu: "Rahu Kaal", shubh: "Shubh Muhurat", sunset: "Sunset", 
      warningTitle: "Aaj Rahu Kaal mein koi shubh kaam na karein.", 
      warningText: "Agar aapko aaj koi bada kaam karna hai, toh pehle jyotishi se shubh muhurat confirm kar lein.", 
      askMuhurat: "Shubh Muhurat Puchhein", muhuratBtn: "Astrologer se poochhein",
      bannerTitle: "Astrologer - 24x7 Available", bannerSub: "Apni samasya ka samadhan paayein – First Chat FREE",
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile",
      seoTitle: "Aaj Ka Panchang (Daily Panchang)", 
      seoDesc: "Hindu dharm mein kisi bhi shubh kaam ko shuru karne se pehle panchang dekhna bahut zaroori mana jata hai. Panchang mein tithi, vaar, nakshatra, yog aur karan ki jankari hoti hai. GitaTalk par paayein aaj ka sahi panchang, Rahu Kaal aur sabse shubh muhurat.",
      faqTitle: "Frequently Asked Questions (FAQs)",
      f1q: "Rahu Kaal kya hai?", f1a: "Rahu Kaal din ka voh samay hota hai jo shubh kaamon ke liye ashubh mana jata hai. Is dauran nayi shuruaat ya pooja-path nahi karni chahiye.",
      f2q: "Panchang kyun dekha jata hai?", f2a: "Panchang se hamein din ki shubhta aur ashubhta ka pata chalta hai. Yeh batata hai ki kis samay kaun sa kaam karna sahi rahega.",
      disclaimer: "Yeh panchang samanya jankari ke liye hai. Satik ganna ke liye jyotishi se paramarsh lein."
    },
    en: { 
      title: "Daily Panchang", today: "Today's Panchang", tithi: "Tithi", shukla: "Shukla Paksha", 
      rahu: "Rahu Kaal", shubh: "Shubh Muhurat", sunset: "Sunset", 
      warningTitle: "Avoid starting any auspicious work during Rahu Kaal today.", 
      warningText: "If you have an important task today, confirm the auspicious time with an astrologer first.", 
      askMuhurat: "Ask for Shubh Muhurat", muhuratBtn: "Ask Astrologer",
      bannerTitle: "Astrologer - 24x7 Available", bannerSub: "Get solutions to your problems – First Chat FREE",
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile",
      seoTitle: "Today's Panchang", 
      seoDesc: "In Hinduism, it is very important to check the Panchang before starting any auspicious work. Panchang provides information about Tithi, Vaar, Nakshatra, Yog, and Karan. Get accurate Panchang, Rahu Kaal, and the most auspicious Muhurat today on GitaTalk.",
      faqTitle: "Frequently Asked Questions (FAQs)",
      f1q: "What is Rahu Kaal?", f1a: "Rahu Kaal is the time of the day which is considered inauspicious for starting new or auspicious activities.",
      f2q: "Why is Panchang observed?", f2a: "Panchang helps us understand the auspiciousness of the day and the right time to perform specific activities.",
      disclaimer: "This Panchang is for general information. Consult an astrologer for accurate calculations."
    },
    te: { title: "దైనందిన పంచాంగం", today: "నేటి పంచాంగం", tithi: "తిథి", shukla: "శుక్ల పక్షం", rahu: "రాహు కాలం", shubh: "శుభ ముహూర్తం", sunset: "సూర్యాస్తమయం", warningTitle: "ఈరోజు రాహు కాలంలో ఎటువంటి శుభకార్యాలు చేయవద్దు.", warningText: "ఈరోజు ముఖ్యమైన పని ఉంటే, ముందుగా జ్యోతిష్యుడిని సంప్రదించి శుభ ముహూర్తాన్ని నిర్ధారించుకోండి.", askMuhurat: "శుభ ముహూర్తం అడగండి", muhuratBtn: "జ్యోతిష్యుడిని అడగండి", bannerTitle: "జ్యోతిష్యుడు - 24x7 అందుబాటులో", bannerSub: "ఇప్పుడే మాట్లాడండి — మొదటి చాట్ ఉచితం", home: "హోమ్", chat: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్", seoTitle: "నేటి పంచాంగం", seoDesc: "హిందూ ధర్మంలో ఏదైనా శుభకార్యం ప్రారంభించే ముందు పంచాంగం చూడటం చాలా ముఖ్యం. ఈరోజు పంచాంగం, రాహు కాలం మరియు శుభ ముహూర్తం ఇక్కడ తెలుసుకోండి.", faqTitle: "తరచుగా అడిగే ప్రశ్నలు", f1q: "రాహు కాలం అంటే ఏమిటి?", f1a: "రాహు కాలం అనేది శుభకార్యాలకు అశుభమని భావించే సమయం.", f2q: "పంచాంగం ఎందుకు చూస్తారు?", f2a: "రోజు శుభమా కాదా అని తెలుసుకోవడానికి పంచాంగం చూస్తారు.", disclaimer: "ఇది సాధారణ సమాచారం కోసం మాత్రమే." },
    ta: { title: "தினசரி பஞ்சாங்கம்", today: "இன்றைய பஞ்சாங்கம்", tithi: "திதி", shukla: "சுக்ல பக்ஷம்", rahu: "ராகு காலம்", shubh: "சுப முகூர்த்தம்", sunset: "சூரிய அஸ்தமனம்", warningTitle: "இன்று ராகு காலத்தில் எந்த சுப காரியங்களையும் செய்ய வேண்டாம்.", warningText: "இன்று முக்கியமான வேலை இருந்தால், முதலில் ஜோதிடரை அணுகி சுப முகூர்த்தத்தை உறுதிப்படுத்தவும்.", askMuhurat: "சுப முகூர்த்தம் கேளுங்கள்", muhuratBtn: "ஜோதிடரிடம் கேளுங்கள்", bannerTitle: "ஜோதிடர் - 24x7 கிடைக்கும்", bannerSub: "இப்போது பேசுங்கள் — முதல் அரட்டை இலவசம்", home: "முகப்பு", chat: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்", seoTitle: "இன்றைய பஞ்சாங்கம்", seoDesc: "எந்த ஒரு சுப காரியத்தையும் தொடங்கும் முன் பஞ்சாங்கம் பார்ப்பது மிகவும் முக்கியம். இன்றைய பஞ்சாங்கம், ராகு காலம் மற்றும் சுப முகூர்த்தத்தை இங்கே அறியுங்கள்.", faqTitle: "அடிக்கடி கேட்கப்படும் கேள்விகள்", f1q: "ராகு காலம் என்றால் என்ன?", f1a: "சுப காரியங்களுக்கு அசுபமான நேரம் ராகு காலம் எனப்படும்.", f2q: "பஞ்சாங்கம் ஏன் பார்க்கப்படுகிறது?", f2a: "நாளின் நல்ல நேரத்தை அறிய பஞ்சாங்கம் பார்க்கப்படுகிறது.", disclaimer: "இது பொதுவான தகவலுக்கு மட்டுமே." },
    kn: { title: "ದೈನಂದಿನ ಪಂಚಾಂಗ", today: "ಇಂದಿನ ಪಂಚಾಂಗ", tithi: "ತಿಥಿ", shukla: "ಶುಕ್ಲ ಪಕ್ಷ", rahu: "ರಾಹು ಕಾಲ", shubh: "ಶುಭ ಮುಹೂರ್ತ", sunset: "ಸೂರ್ಯಾಸ್ತ", warningTitle: "ಇಂದು ರಾಹು ಕಾಲದಲ್ಲಿ ಯಾವುದೇ ಶುಭ ಕಾರ್ಯ ಮಾಡಬೇಡಿ.", warningText: "ಇಂದು ಪ್ರಮುಖ ಕೆಲಸವಿದ್ದರೆ, ಮೊದಲು ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ ಶುಭ ಮುಹೂರ್ತವನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.", askMuhurat: "ಶುಭ ಮುಹೂರ್ತ ಕೇಳಿ", muhuratBtn: "ಜ್ಯೋತಿಷಿಯನ್ನು ಕೇಳಿ", bannerTitle: "ಜ್ಯೋತಿಷಿ - 24x7 ಲಭ್ಯವಿದೆ", bannerSub: "ಈಗ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ", home: "ಮುಖಪುಟ", chat: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್", seoTitle: "ಇಂದಿನ ಪಂಚಾಂಗ", seoDesc: "ಯಾವುದೇ ಶುಭ ಕಾರ್ಯವನ್ನು ಪ್ರಾರಂಭಿಸುವ ಮೊದಲು ಪಂಚಾಂಗವನ್ನು ನೋಡುವುದು ಬಹಳ ಮುಖ್ಯ. ಇಂದಿನ ಪಂಚಾಂಗ, ರಾಹು ಕಾಲ ಮತ್ತು ಶುಭ ಮುಹೂರ್ತವನ್ನು ಇಲ್ಲಿ ತಿಳಿಯಿರಿ.", faqTitle: "ಪದೇ ಪದೇ ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು", f1q: "ರಾಹು ಕಾಲ ಎಂದರೇನು?", f1a: "ಶುಭ ಕಾರ್ಯಗಳಿಗೆ ಅಶುಭವೆಂದು ಪರಿಗಣಿಸುವ ಸಮಯವೇ ರಾಹು ಕಾಲ.", f2q: "ಪಂಚಾಂಗ ಏಕೆ ನೋಡುತ್ತಾರೆ?", f2a: "ದಿನದ ಶುಭಾಶುಭಗಳನ್ನು ತಿಳಿಯಲು ಪಂಚಾಂಗ ನೋಡುತ್ತಾರೆ.", disclaimer: "ಇದು ಸಾಮಾನ್ಯ ಮಾಹಿತಿಗಾಗಿ ಮಾತ್ರ." },
    bn: { title: "দৈনিক পঞ্জিকা", today: "আজকের পঞ্জিকা", tithi: "তিথি", shukla: "শুক্ল পক্ষ", rahu: "রাহু কাল", shubh: "শুভ মুহূর্ত", sunset: "সূর্যাস্ত", warningTitle: "আজ রাহু কালে কোনো শুভ কাজ করবেন না।", warningText: "আজ যদি কোনো গুরুত্বপূর্ণ কাজ থাকে, তবে প্রথমে জ্যোতিষীর সাথে পরামর্শ করে শুভ মুহূর্ত নিশ্চিত করুন।", askMuhurat: "শুভ মুহূর্ত জিজ্ঞাসা করুন", muhuratBtn: "জ্যোতিষীকে জিজ্ঞাসা করুন", bannerTitle: "জ্যোতিষী - 24x7 উপলব্ধ", bannerSub: "এখনই কথা বলুন — প্রথম চ্যাট ফ্রি", home: "হোম", chat: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল", seoTitle: "আজকের পঞ্জিকা", seoDesc: "যেকোনো শুভ কাজ শুরু করার আগে পঞ্জিকা দেখা খুব জরুরি। আজকের পঞ্জিকা, রাহু কাল এবং শুভ মুহূর্ত এখানে জেনে নিন।", faqTitle: "সচরাচর জিজ্ঞাসিত প্রশ্নাবলী", f1q: "রাহু কাল কি?", f1a: "যে সময় শুভ কাজের জন্য অশুভ বলে মনে করা হয় তাকে রাহু কাল বলে।", f2q: "পঞ্জিকা কেন দেখা হয়?", f2a: "দিনের শুভ ও অশুভ সময় জানতে পঞ্জিকা দেখা হয়।", disclaimer: "এটি শুধুমাত্র সাধারণ তথ্যের জন্য।" },
    mr: { title: "दैनिक पंचांग", today: "आजचे पंचांग", tithi: "तिथी", shukla: "शुक्ल पक्ष", rahu: "राहू काळ", shubh: "शुभ मुहूर्त", sunset: "सूर्यास्त", warningTitle: "आज राहू काळात कोणतेही शुभ कार्य करू नका.", warningText: "आज महत्त्वाचे काम असल्यास, प्रथम ज्योतिषाशी सल्ला घेऊन शुभ मुहूर्त निश्चित करा.", askMuhurat: "शुभ मुहूर्त विचारा", muhuratBtn: "ज्योतिषाला विचारा", bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "आता बोला — पहिली चॅट मोफत", home: "होम", chat: "चॅट", daily: "दैनिक", profile: "प्रोफाइल", seoTitle: "आजचे पंचांग", seoDesc: "कोणतेही शुभ कार्य सुरू करण्यापूर्वी पंचांग पाहणे खूप महत्वाचे मानले जाते. आजचे पंचांग, राहू काळ आणि शुभ मुहूर्त येथे जाणून घ्या.", faqTitle: "नेहमी विचारले जाणारे प्रश्न", f1q: "राहू काळ काय आहे?", f1a: "शुभ कार्यांसाठी अशुभ मानला जाणारा काळ म्हणजे राहू काळ.", f2q: "पंचांग का पाहिले जाते?", f2a: "दिवसाची शुभता आणि अशुभता जाणून घेण्यासाठी पंचांग पाहिले जाते.", disclaimer: "हे केवळ सामान्य माहितीसाठी आहे." },
    gu: { title: "દૈનિક પંચાંગ", today: "આજનું પંચાંગ", tithi: "તિથિ", shukla: "શુક્લ પક્ષ", rahu: "રાહુ કાળ", shubh: "શુભ મુહૂર્ત", sunset: "સૂર્યાસ્ત", warningTitle: "આજે રાહુ કાળમાં કોઈ શુભ કાર્ય ન કરો.", warningText: "જો આજે કોઈ મહત્વનું કામ હોય, તો પહેલા જ્યોતિષીની સલાહ લઈને શુભ મુહૂર્ત નક્કી કરો.", askMuhurat: "શુભ મુહૂર્ત પૂછો", muhuratBtn: "જ્યોતિષીને પૂછો", bannerTitle: "જ્યોતિષી - 24x7 ઉપલબ્ધ", bannerSub: "હમણાં વાત કરો — પ્રથમ ચેટ મફત", home: "હોમ", chat: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ", seoTitle: "આજનું પંચાંગ", seoDesc: "કોઈપણ શુભ કાર્ય શરૂ કરતા પહેલા પંચાંગ જોવું ખૂબ જ જરૂરી માનવામાં આવે છે. આજનું પંચાંગ, રાહુ કાળ અને શુભ મુહૂર્ત અહીં જાણો.", faqTitle: "વારંવાર પૂછાતા પ્રશ્નો", f1q: "રાહુ કાળ શું છે?", f1a: "શુભ કાર્યો માટે અશુભ માનવામાં આવતો સમય રાહુ કાળ છે.", f2q: "પંચાંગ કેમ જોવામાં આવે છે?", f2a: "દિવસની શુભતા જાણવા માટે પંચાંગ જોવામાં આવે છે.", disclaimer: "આ ફક્ત સામાન્ય માહિતી માટે છે." },
    ml: { title: "ദൈനംദിന പഞ്ചാംഗം", today: "ഇന്നത്തെ പഞ്ചാംഗം", tithi: "തിഥി", shukla: "ശുക്ല പക്ഷം", rahu: "രാഹുകാലം", shubh: "ശുഭ മുഹൂർത്തം", sunset: "സൂര്യാസ്തമയം", warningTitle: "ഇന്ന് രാഹുകാലത്ത് ശുഭകാര്യങ്ങൾ ഒഴിവാക്കുക.", warningText: "ഇന്ന് പ്രധാനപ്പെട്ട ജോലിയുണ്ടെങ്കിൽ, ആദ്യം ജ്യോതിഷിയെ സമീപിച്ച് ശുഭ മുഹൂർത്തം ഉറപ്പാക്കുക.", askMuhurat: "ശുഭ മുഹൂർത്തം ചോദിക്കുക", muhuratBtn: "ജ്യോതിഷിയോട് ചോദിക്കുക", bannerTitle: "ജ്യോതിഷി - 24x7 ലഭ്യമാണ്", bannerSub: "ഇപ്പോൾ സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം", home: "ഹോം", chat: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ", seoTitle: "ഇന്നത്തെ പഞ്ചാംഗം", seoDesc: "ഏതെങ്കിലും ശുഭകാര്യം ആരംഭിക്കുന്നതിന് മുമ്പ് പഞ്ചാംഗം നോക്കുന്നത് വളരെ പ്രധാനമാണ്. ഇന്നത്തെ പഞ്ചാംഗം, രാഹുകാലം, ശുഭ മുഹൂർത്തം എന്നിവ ഇവിടെ അറിയുക.", faqTitle: "പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ", f1q: "രാഹുകാലം എന്നാൽ എന്താണ്?", f1a: "ശുഭകാര്യങ്ങൾക്ക് അനുയോജ്യമല്ലാത്ത സമയമാണ് രാഹുകാലം.", f2q: "എന്തിനാണ് പഞ്ചാംഗം നോക്കുന്നത്?", f2a: "ദിവസത്തിന്റെ ശുഭാശുഭങ്ങൾ അറിയാൻ പഞ്ചാംഗം നോക്കുന്നു.", disclaimer: "ഇത് പൊതുവായ വിവരങ്ങൾക്ക് മാത്രമുള്ളതാണ്." },
  };
  return ui[lang]?.[key] || ui["en"][key] || ui["hi"][key];
};

export default function PanchangPage() {
  const { theme, lang } = useApp();
  const router = useRouter();
  const isDark = theme === "dark";

  const t = (key: string) => getUIText(lang, key);

  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c] shadow-lg" : "border-orange-100 bg-white shadow-xl";
  const innerCardClass = isDark ? "border-slate-800 bg-[#0A0F19]" : "border-orange-100 bg-orange-50";

  // 🔥 NEW LOGIC: Chat Pre-fill
  const handleChatNow = () => {
    const summaryText = `Namaste, maine aaj ka panchang dekha hai.
    
Tithi: Shukla Paksha
Rahu Kaal: 12:00 PM - 1:30 PM
Shubh Muhurat: 10:15 AM - 11:45 AM
Sunset: 06:15 PM

Mujhe aaj ke shubh muhurat aur kisi bhi shubh kaam ke baare mein aur detail mein margdarshan chahiye.`;

    const encodedPrompt = encodeURIComponent(summaryText);
    router.push(`/chat/gita?prefill=${encodedPrompt}`);
  };

  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Rahu Kaal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Rahu Kaal is a specific time period in a day which is considered inauspicious for starting new ventures or performing important tasks."
        }
      },
      {
        "@type": "Question",
        "name": "Why is Panchang observed in Hinduism?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Panchang helps in determining the auspicious and inauspicious times of the day. It is used to find the right Muhurat for starting any auspicious work."
        }
      }
    ]
  };

  return (
    <main className={`min-h-[100dvh] w-full pb-36 ${pageClass} font-sans`}>
      
      {/* Inject FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        
        {/* HEADER */}
        <header className={`flex items-center gap-3 rounded-2xl border p-4 sm:p-5 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2.5 transition-colors ${isDark ? "bg-[#0A0F19] text-slate-300" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[17px] sm:text-[20px] font-black uppercase tracking-tight text-[#ff6b00]">{t("title")}</h1>
          </div>
          <CalendarDays className="text-[#ff6b00]" size={26} />
        </header>

        {/* MAIN CARD */}
        <section className={`rounded-[1.5rem] border p-5 sm:p-7 ${cardClass}`}>
          
          <h2 className="text-[18px] sm:text-[20px] font-black mb-5 flex items-center gap-2 text-[#ff6b00]">
            <CalendarDays size={22} /> {t("today")}
          </h2>
          
          {/* GRID - Lambai aur Chaurai badhai gayi hai */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Tithi */}
            <div className={`rounded-2xl border p-5 transition-all hover:scale-[1.02] flex flex-col justify-center gap-2 ${innerCardClass}`}>
              <div className="flex items-center gap-2">
                <Moon size={18} className="text-[#ff6b00]" />
                <p className={`text-[12px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("tithi")}</p>
              </div>
              <p className={`text-[18px] font-black mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>{t("shukla")}</p>
            </div>
            
            {/* Rahu Kaal */}
            <div className={`rounded-2xl border p-5 transition-all hover:scale-[1.02] flex flex-col justify-center gap-2 ${innerCardClass}`}>
               <div className="flex items-center gap-2">
                <Flame size={18} className="text-rose-500" />
                <p className={`text-[12px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("rahu")}</p>
              </div>
              <p className="text-[16px] font-black text-rose-500 mt-1">12:00 PM - 1:30 PM</p>
            </div>
            
            {/* Shubh Muhurat */}
            <div className={`rounded-2xl border p-5 transition-all hover:scale-[1.02] flex flex-col justify-center gap-2 ${innerCardClass}`}>
               <div className="flex items-center gap-2">
                <Sun size={18} className="text-emerald-500" />
                <p className={`text-[12px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("shubh")}</p>
              </div>
              <p className="text-[16px] font-black text-emerald-500 mt-1">10:15 AM - 11:45 AM</p>
            </div>
            
            {/* Sunset */}
            <div className={`rounded-2xl border p-5 transition-all hover:scale-[1.02] flex flex-col justify-center gap-2 ${innerCardClass}`}>
               <div className="flex items-center gap-2">
                <Sun size={18} className="text-amber-500" />
                <p className={`text-[12px] font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("sunset")}</p>
              </div>
              <p className={`text-[18px] font-black mt-1 ${isDark ? "text-white" : "text-slate-900"}`}>06:15 PM</p>
            </div>
          </div>

          {/* PREMIUM WARNING BOX */}
          <div className={`mt-6 rounded-2xl border p-5 relative overflow-hidden ${isDark ? "border-rose-500/30 bg-[#2a151a]" : "border-red-200 bg-red-50"}`}>
            <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
            <p className={`text-[14px] font-black mb-1.5 flex items-center gap-2 ${isDark ? "text-rose-300" : "text-red-800"}`}>
              <AlertCircle size={18} /> {t("warningTitle")}
            </p>
            <p className={`text-[13px] font-medium leading-relaxed ${isDark ? "text-rose-200/80" : "text-red-700"}`}>
              {t("warningText")}
            </p>
          </div>

          {/* CTA BUTTON */}
          <button 
            onClick={handleChatNow}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] px-4 py-4 text-[15px] font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            <MessageCircle size={18} /> {t("askMuhurat")}
          </button>

        </section>

        {/* 🔥 SEO CONTENT BLOCK */}
        <section className={`mt-4 px-5 sm:px-7 py-6 w-full rounded-[1.5rem] border ${isDark ? "border-slate-800/60 bg-[#0c111b]" : "border-orange-100 bg-white"} space-y-4`}>
          <h2 className={`text-[18px] sm:text-[20px] font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {t("seoTitle")}
          </h2>
          <p className={`text-[13px] sm:text-[14px] leading-relaxed ${isDark ? "text-slate-300" : "text-gray-600"}`}>
            {t("seoDesc")}
          </p>
          
          <h3 className={`text-[15px] font-bold mt-4 ${isDark ? "text-white" : "text-gray-900"}`}>{t("faqTitle")}</h3>
          <div className="space-y-3 mt-2">
            <div>
              <p className={`text-[13.5px] font-bold ${isDark ? "text-slate-200" : "text-gray-800"}`}>Q: {t("f1q")}</p>
              <p className={`text-[13px] leading-relaxed mt-1 ${isDark ? "text-slate-400" : "text-gray-600"}`}>A: {t("f1a")}</p>
            </div>
            <div>
              <p className={`text-[13.5px] font-bold ${isDark ? "text-slate-200" : "text-gray-800"}`}>Q: {t("f2q")}</p>
              <p className={`text-[13px] leading-relaxed mt-1 ${isDark ? "text-slate-400" : "text-gray-600"}`}>A: {t("f2a")}</p>
            </div>
          </div>
        </section>

        {/* 🔥 LEGAL FOOTER */}
        <footer className="mt-4 pt-6 pb-2 border-t border-slate-800/80 w-full text-center">
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-[12px] font-semibold text-slate-400">
            <Link href="/privacy-policy" className="hover:text-[#ff6b00] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#ff6b00] transition-colors">Terms & Refund Policy</Link>
            <a href="mailto:gitaaisupport@gmail.com" className="hover:text-[#ff6b00] transition-colors">Contact Us</a>
          </div>
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} GitaTalk (gitatalk.in). All rights reserved.<br/>
            {t("disclaimer")}
          </p>
        </footer>

      </div>

      {/* 🔥 STICKY BOTTOM BANNER & NAVIGATION */}
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
          <button onClick={() => router.push("/chat/gita")} className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-md">
               <Crown size={16} className="text-[#d81b60]" fill="currentColor" />
          </button>
        </div>

        {/* Bottom Navigation Bar */}
        <nav className={`flex justify-around border-t py-2.5 ${isDark ? "border-slate-800 bg-[#0A0F19]/95" : "border-amber-100 bg-white/95"} backdrop-blur`}>
          <Link href="/" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <Home size={18} /><span className="text-[9.5px] font-bold">{t("home")}</span>
          </Link>
          <Link href="/chat" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <MessageCircle size={18} /><span className="text-[9.5px] font-bold">{t("chat")}</span>
          </Link>
          <Link href="/daily" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <Sun size={18} /><span className="text-[9.5px] font-bold">{t("daily")}</span>
          </Link>
          <Link href="/profile" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <User size={18} /><span className="text-[9.5px] font-bold">{t("profile")}</span>
          </Link>
        </nav>
      </div>

    </main>
  );
}
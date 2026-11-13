// app/daily/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Sun, Sparkles, Palette, Hash, RefreshCw, CalendarDays,
  Heart, AlertCircle, MessageCircle, TriangleAlert, Home, User, PhoneCall, Crown,
  Lock, Wallet, X, HelpCircle, Share2
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
    hi: { 
      title: "दैनिक राशिफल", intro: "अपनी राशि चुनें और आज का ज्योतिषीय मार्गदर्शन पढ़ें।", selectSign: "अपनी राशि चुनें", viewBtn: "राशिफल देखें", loading: "लोड हो रहा है...", preparing: "आज का राशिफल तैयार हो रहा है...", errorTitle: "राशिफल अभी नहीं दिख पा रहा", tryAgain: "फिर कोशिश करें", yourSign: "आपकी राशि", guidance: "आज का ज्योतिषीय मार्गदर्शन", luckyColor: "शुभ रंग", luckyNum: "शुभ अंक", affirmation: "आज का सकारात्मक विचार", noteTitle: "एक छोटी सी सलाह", note: "यह सामान्य राशिफल है। आपकी असली कहानी आपकी व्यक्तिगत कुंडली में है — एक बार हमारी महिला ज्योतिषियों में से किसी एक से दिल से चैट कर लें।", warning: "🌸 यह सामान्य राशिफल है। आपके जीवन की असली कहानी आपकी व्यक्तिगत कुंडली में छिपी है।", stickyTitle: "ज्योतिषी • 24x7 उपलब्ध", stickySub: "अभी बात करें — पहली चैट FREE", chatBtn: "चैट", home: "होम", daily: "राशिफल", profile: "प्रोफाइल", chat: "चैट", chatNow: "इस राशिफल पर ज्योतिषी से बात करें", share: "WhatsApp पर शेयर करें",
      limitTitle: "आपकी फ्री लिमिट खत्म हो गई है!", limitSub: "अधिक जानकारी और सटीक सलाह के लिए ज्योतिषी से बात करें या वॉलेट रिचार्ज करें।", chatFree: "ज्योतिषी से फ्री बात करें", recharge: "वॉलेट रिचार्ज करें", close: "बंद करें"
    },
    hinglish: { 
      title: "Daily Rashifal", intro: "Apni rashi chuniye aur aaj ka astrology guidance padhiye.", selectSign: "Apni Rashi Chuniye", viewBtn: "Rashifal Dekhein", loading: "Loading...", preparing: "Aaj ka rashifal taiyar ho raha hai...", errorTitle: "Rashifal abhi nahi dikh pa raha", tryAgain: "Phir Koshish Karein", yourSign: "Aapki Rashi", guidance: "Aaj Ka Guidance", luckyColor: "Lucky Colour", luckyNum: "Lucky Number", affirmation: "Aaj Ka Positive Thought", noteTitle: "Ek Chhoti Si Salah", note: "Yeh general rashifal hai. Aapki asli kahani aapki vyaktigat kundli mein hai — ek baar hamari Mahila Jyotishiyon mein se kisi ek se dil se chat kar lein.", warning: "🌸 Yeh general rashifal hai. Aapke jeevan ki asli kahani aapki vyaktigat kundli mein chhipi hai.", stickyTitle: "Astrologer • 24x7 Available", stickySub: "Talk Now — First Chat FREE", chatBtn: "Chat", home: "Home", daily: "Daily", profile: "Profile", chat: "Chat", chatNow: "Is rashifal par jyotishi se baat karein", share: "WhatsApp par share karein",
      limitTitle: "Aapki Free Limit Khatam Ho Gayi Hai!", limitSub: "Aage ki jankari ke liye jyotishi se baat karein ya wallet recharge karein.", chatFree: "Jyotishi se Free baat karein", recharge: "Wallet Recharge", close: "Band karein"
    },
    en: { 
      title: "Daily Horoscope", intro: "Select your zodiac sign and explore today's astrology guidance.", selectSign: "Choose Your Zodiac Sign", viewBtn: "View Horoscope", loading: "Loading...", preparing: "Preparing today's horoscope...", errorTitle: "Reading not available right now", tryAgain: "Try Again", yourSign: "Your Zodiac", guidance: "Today's Guidance", luckyColor: "Lucky Colour", luckyNum: "Lucky Number", affirmation: "Daily Affirmation", noteTitle: "A Gentle Note", note: "This is a general reading. Your real story lives in your personal chart — chat once from the heart with one of our Female Astrologers.", warning: "🌸 This is a general reading. The real story of your life is hidden in your personal chart.", stickyTitle: "Astrologer • 24x7 Available", stickySub: "Talk Now — First Chat FREE", chatBtn: "Chat", home: "Home", daily: "Daily", profile: "Profile", chat: "Chat", chatNow: "Talk to Astrologer about this", share: "Share on WhatsApp",
      limitTitle: "Your Free Limit is Exhausted!", limitSub: "Talk to an astrologer for deeper insights or recharge your wallet.", chatFree: "Chat with Astrologer FREE", recharge: "Recharge Wallet", close: "Close"
    },
    te: { title: "దైనందిన జాతకం", intro: "మీ రాశి చిహ్నాన్ని ఎంచుకోండి మరియు నేటి జ్యోతిష్య మార్గదర్శకత్వాన్ని చదవండి.", selectSign: "మీ రాశి చిహ్నాన్ని ఎంచుకోండి", viewBtn: "జాతకం చూడండి", loading: "లోడ్ అవుతోంది...", preparing: "నేటి జాతకం సిద్ధమవుతోంది...", errorTitle: "జాతకం ఇప్పుడు అందుబాటులో లేదు", tryAgain: "మళ్లీ ప్రయత్నించండి", yourSign: "మీ రాశి", guidance: "నేటి మార్గదర్శకత్వం", luckyColor: "అదృష్ట రంగు", luckyNum: "అదృష్ట సంఖ్య", affirmation: "దైనందిన సంకల్పం", noteTitle: "ఒక చిన్న సూచన", note: "ఇది సాధారణ జాతకం. నిజమైన కథ మీ వ్యక్తిగత జాతకంలో ఉంది — మా మహిళా జ్యోతిష్యురాలితో చాట్ చేయండి.", warning: "🌸 ఇది సాధారణ జాతకం. మీ జీవిత అసలు కథ మీ వ్యక్తిగత జాతకంలో దాగి ఉంది.", stickyTitle: "జ్యోతిష్యుడు • 24x7 అందుబాటులో", stickySub: "ఇప్పుడే మాట్లాడండి — మొదటి చాట్ ఉచితం", chatBtn: "చాట్", home: "హోమ్", daily: "డైలీ", profile: "ప్రొఫైల్", chat: "చాట్", chatNow: "ఈ జాతకం గురించి జ్యోతిష్యుడితో మాట్లాడండి", share: "WhatsApp లో పంచుకోండి", limitTitle: "మీ ఉచిత పరిమితి ముగిసింది!", limitSub: "మరింత సమాచారం కోసం జ్యోతిష్యుడిని సంప్రదించండి.", chatFree: "ఉచితంగా మాట్లాడండి", recharge: "వాలెట్ రీఛార్జ్", close: "మూసివేయి" },
    ta: { title: "தினசரி ராசிபலன்", intro: "உங்கள் ராசி அடையாளத்தைத் தேர்ந்தெடுத்து இன்றைய ஜோதிட வழிகாட்டுதலைப் படியுங்கள்.", selectSign: "உங்கள் ராசி அடையாளத்தைத் தேர்ந்தெடுக்கவும்", viewBtn: "ராசிபலனைப் பார்க்க", loading: "ஏற்றப்படுகிறது...", preparing: "இன்றைய ராசிபலன் தயாராகிறது...", errorTitle: "ராசிபலன் இப்போது கிடைக்கவில்லை", tryAgain: "மீண்டும் முயற்சிக்கவும்", yourSign: "உங்கள் ராசி", guidance: "இன்றைய வழிகாட்டுதல்", luckyColor: "அதிர்ஷ்ட நிறம்", luckyNum: "அதிர்ஷ்ட எண்", affirmation: "தினசரி உறுதிமொழி", noteTitle: "ஒரு சிறிய ஆலோசனை", note: "இது பொதுவான ராசிபலன். உண்மையான கதை உங்கள் தனிப்பட்ட ஜாதகத்தில் உள்ளது — எங்கள் பெண் ஜோதிடருடன் அரட்டையடிக்கவும்.", warning: "🌸 இது பொதுவான வாசிப்பு. உங்கள் வாழ்க்கையின் உண்மையான கதை உங்கள் தனிப்பட்ட ஜாதகத்தில் மறைந்துள்ளது.", stickyTitle: "ஜோதிடர் • 24x7 கிடைக்கும்", stickySub: "இப்போது பேசுங்கள் — முதல் அரட்டை இலவசம்", chatBtn: "அரட்டை", home: "முகப்பு", daily: "தினசரி", profile: "சுயவிவரம்", chat: "அரட்டை", chatNow: "இந்த ராசிபலன் பற்றி ஜோதிடரிடம் பேசுங்கள்", share: "WhatsApp இல் பகிரவும்", limitTitle: "உங்கள் இலவச வரம்பு முடிந்தது!", limitSub: "மேலும் அறிய ஜோதிடரை அணுகவும்.", chatFree: "இலவசமாக பேசுங்கள்", recharge: "வாலெட் ரீசார்ஜ்", close: "மூடு" },
    kn: { title: "ದೈನಂದಿನ ರಾಶಿಫಲ", intro: "ನಿಮ್ಮ ರಾಶಿ ಚಿಹ್ನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಇಂದಿನ ಜ್ಯೋತಿಷ್ಯ ಮಾರ್ಗದರ್ಶನವನ್ನು ಓದಿ.", selectSign: "ನಿಮ್ಮ ರಾಶಿ ಚಿಹ್ನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", viewBtn: "ರಾಶಿಫಲ ನೋಡಿ", loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...", preparing: "ಇಂದಿನ ರಾಶಿಫಲ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...", errorTitle: "ರಾಶಿಫಲ ಈಗ ಲಭ್ಯವಿಲ್ಲ", tryAgain: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ", yourSign: "ನಿಮ್ಮ ರಾಶಿ", guidance: "ಇಂದಿನ ಮಾರ್ಗದರ್ಶನ", luckyColor: "ಅದೃಷ್ಟದ ಬಣ್ಣ", luckyNum: "ಅದೃಷ್ಟದ ಸಂಖ್ಯೆ", affirmation: "ದೈನಂದಿನ ಸಂಕಲ್ಪ", noteTitle: "ಒಂದು ಸಣ್ಣ ಸಲಹೆ", note: "ಇದು ಸಾಮಾನ್ಯ ರಾಶಿಫಲ. ನಿಜವಾದ ಕಥೆ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಕುಂಡಲಿಯಲ್ಲಿದೆ — ನಮ್ಮ ಮಹಿಳಾ ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ.", warning: "🌸 ಇದು ಸಾಮಾನ್ಯ ಓದುವಿಕೆ. ನಿಮ್ಮ ಜೀವನದ ನಿಜವಾದ ಕಥೆ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಕುಂಡಲಿಯಲ್ಲಿ ಅಡಗಿದೆ.", stickyTitle: "ಜ್ಯೋತಿಷಿ • 24x7 ಲಭ್ಯವಿದೆ", stickySub: "ಈಗ ಮಾತನಾಡಿ — ಮೊದಲ ಚಾಟ್ ಉಚಿತ", chatBtn: "ಚಾಟ್", home: "ಮುಖಪುಟ", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್", chat: "ಚಾಟ್", chatNow: "ಈ ರಾಶಿಫಲದ ಬಗ್ಗೆ ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ", share: "WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ", limitTitle: "ನಿಮ್ಮ ಉಚಿತ ಮಿತಿ ಮುಗಿದಿದೆ!", limitSub: "ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.", chatFree: "ಉಚಿತವಾಗಿ ಮಾತನಾಡಿ", recharge: "ವಾಲೆಟ್ ರೀಚಾರ್ಜ್", close: "ಮುಚ್ಚಿ" },
    bn: { title: "দৈনিক রাশিফল", intro: "আপনার রাশি চিহ্ন চয়ন করুন এবং আজকের জ্যোতিষ নির্দেশিকা পড়ুন।", selectSign: "আপনার রাশি চিহ্ন চয়ন করুন", viewBtn: "রাশিফল দেখুন", loading: "লোড হচ্ছে...", preparing: "আজকের রাশিফল তৈরি হচ্ছে...", errorTitle: "রাশিফল এখন উপলব্ধ নেই", tryAgain: "আবার চেষ্টা করুন", yourSign: "আপনার রাশি", guidance: "আজকের নির্দেশিকা", luckyColor: "শুভ রঙ", luckyNum: "শুভ সংখ্যা", affirmation: "দৈনিক প্রতিজ্ঞা", noteTitle: "একটি ছোট পরামর্শ", note: "এটি একটি সাধারণ রাশিফল। আসল গল্প আপনার ব্যক্তিগত কুণ্ডলীতে রয়েছে — আমাদের মহিলা জ্যোতিষীর সাথে চ্যাট করুন।", warning: "🌸 এটি একটি সাধারণ পাঠ। আপনার জীবনের আসল গল্প আপনার ব্যক্তিগত কুণ্ডলীতে লুকিয়ে আছে।", stickyTitle: "জ্যোতিষী • 24x7 উপলব্ধ", stickySub: "এখনই কথা বলুন — প্রথম চ্যাট ফ্রি", chatBtn: "চ্যাট", home: "হোম", daily: "দৈনিক", profile: "প্রোফাইল", chat: "চ্যাট", chatNow: "এই রাশিফল সম্পর্কে জ্যোতিষীর সাথে কথা বলুন", share: "WhatsApp এ শেয়ার করুন", limitTitle: "আপনার ফ্রি সীমা শেষ!", limitSub: "আরও জানতে জ্যোতিষীর সাথে কথা বলুন।", chatFree: "ফ্রি চ্যাট করুন", recharge: "ওয়ালেট রিচার্জ", close: "বন্ধ করুন" },
    mr: { title: "दैनिक राशीभविष्य", intro: "तुमची राशी निवडा आणि आजचे ज्योतिष मार्गदर्शन वाचा.", selectSign: "तुमची राशी निवडा", viewBtn: "राशीभविष्य पहा", loading: "लोड होत आहे...", preparing: "आजचे राशीभविष्य तयार होत आहे...", errorTitle: "राशीभविष्य आता उपलब्ध नाही", tryAgain: "पुन्हा प्रयत्न करा", yourSign: "तुमची राशी", guidance: "आजचे मार्गदर्शन", luckyColor: "शुभ रंग", luckyNum: "शुभ अंक", affirmation: "दैनिक संकल्प", noteTitle: "एक छोटी सी सल्ला", note: "हे सामान्य राशीभविष्य आहे. खरी गोष्ट तुमच्या वैयक्तिक कुंडलीत आहे — आमच्या महिला ज्योतिषाशी चॅट करा.", warning: "🌸 हे सामान्य वाचन आहे. तुमच्या जीवनातील खरी गोष्ट तुमच्या वैयक्तिक कुंडलीत लपलेली आहे.", stickyTitle: "ज्योतिषी • 24x7 उपलब्ध", stickySub: "आता बोला — पहिली चॅट मोफत", chatBtn: "चॅट", home: "होम", daily: "दैनिक", profile: "प्रोफाइल", chat: "चॅट", chatNow: "या राशीभविष्याबद्दल ज्योतिषाशी बोला", share: "WhatsApp वर शेअर करा", limitTitle: "तुमची मोफत मर्यादा संपली आहे!", limitSub: "अधिक माहितीसाठी ज्योतिषाशी बोला.", chatFree: "मोफत बोला", recharge: "वॉलेट रिचार्ज", close: "बंद करा" },
    gu: { title: "દૈનિક રાશિફળ", intro: "તમારી રાશિ પસંદ કરો અને આજનું જ્યોતિષ માર્ગદર્શન વાંચો.", selectSign: "તમારી રાશિ પસંદ કરો", viewBtn: "રાશિફળ જુઓ", loading: "લોડ થઈ રહ્યું છે...", preparing: "આજનું રાશિફળ તૈયાર થઈ રહ્યું છે...", errorTitle: "રાશિફળ હવે ઉપલબ્ધ નથી", tryAgain: "ફરી પ્રયાસ કરો", yourSign: "તમારી રાશિ", guidance: "આજનું માર્ગદર્શન", luckyColor: "શુભ રંગ", luckyNum: "શુભ અંક", affirmation: "દૈનિક સંકલ્પ", noteTitle: "એક નાની સલાહ", note: "આ સામાન્ય રાશિફળ છે. સાચી વાર્તા તમારી વ્યક્તિગત કુંડળીમાં છે — અમારા મહિલા જ્યોતિષી સાથે ચેટ કરો.", warning: "🌸 આ સામાન્ય વાંચન છે. તમારા જીવનની સાચી વાર્તા તમારી વ્યક્તિગત કુંડળીમાં છુપાયેલી છે.", stickyTitle: "જ્યોતિષી • 24x7 ઉપલબ્ધ", stickySub: "હમણાં વાત કરો — પ્રથમ ચેટ મફત", chatBtn: "ચેટ", home: "હોમ", daily: "દૈનિક", profile: "પ્રોફાઇલ", chat: "ચેટ", chatNow: "આ રાશિફળ વિશે જ્યોતિષી સાથે વાત કરો", share: "WhatsApp પર શેર કરો", limitTitle: "તમારી મફત મર્યાદા સમાપ્ત થઈ ગઈ છે!", limitSub: "વધુ માહિતી માટે જ્યોતિષી સાથે વાત કરો.", chatFree: "મફત વાત કરો", recharge: "વોલેટ રિચાર્જ", close: "બંધ કરો" },
    ml: { title: "ദൈനംദിന രാശിഫലം", intro: "നിങ്ങളുടെ രാശി അടയാളം തിരഞ്ഞെടുത്ത് ഇന്നത്തെ ജ്യോതിഷ മാർഗ്ഗനിർദ്ദേശം വായിക്കുക.", selectSign: "നിങ്ങളുടെ രാശി അടയാളം തിരഞ്ഞെടുക്കുക", viewBtn: "രാശിഫലം കാണുക", loading: "ലോഡ് ചെയ്യുന്നു...", preparing: "ഇന്നത്തെ രാശിഫലം തയ്യാറാക്കുന്നു...", errorTitle: "രാശിഫലം ഇപ്പോൾ ലഭ്യമല്ല", tryAgain: "വീണ്ടും ശ്രമിക്കുക", yourSign: "നിങ്ങളുടെ രാശി", guidance: "ഇന്നത്തെ മാർഗ്ഗനിർദ്ദേശം", luckyColor: "ഭാഗ്യ നിറം", luckyNum: "ഭാഗ്യ നമ്പർ", affirmation: "ദൈനംദിന സത്യവാങ്മൂലം", noteTitle: "ഒരു ചെറിയ ഉപദേശം", note: "ഇതൊരു പൊതുവായ രാശിഫലമാണ്. യഥാർത്ഥ കഥ നിങ്ങളുടെ വ്യക്തിഗത ജാതകത്തിലുണ്ട് — ഞങ്ങളുടെ വനിതാ ജ്യോതിഷിയുമായി ചാറ്റ് ചെയ്യുക.", warning: "🌸 ഇതൊരു പൊതുവായ വായനയാണ്. നിങ്ങളുടെ ജീവിതത്തിന്റെ യഥാർത്ഥ കഥ നിങ്ങളുടെ വ്യക്തിഗത ജാതകത്തിൽ ഒളിഞ്ഞിരിക്കുന്നു.", stickyTitle: "ജ്യോതിഷി • 24x7 ലഭ്യമാണ്", stickySub: "ഇപ്പോൾ സംസാരിക്കുക — ആദ്യ ചാറ്റ് സൗജന്യം", chatBtn: "ചാറ്റ്", home: "ഹോം", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ", chat: "ചാറ്റ്", chatNow: "ഈ രാശിഫലത്തെക്കുറിച്ച് ജ്യോതിഷിയോട് സംസാരിക്കുക", share: "WhatsApp ൽ പങ്കിടുക", limitTitle: "നിങ്ങളുടെ സൗജന്യ പരിധി തീർന്നു!", limitSub: "കൂടുതൽ അറിയാൻ ജ്യോതിഷിയുമായി സംസാരിക്കുക.", chatFree: "സൗജന്യമായി സംസാരിക്കുക", recharge: "വാലറ്റ് റീചാർജ്", close: "അടയ്ക്കുക" },
  };
  return ui[lang]?.[key] || ui["en"][key] || ui["hi"][key];
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
  const { lang, theme, me } = useApp();
  const router = useRouter();
  const isDark = theme === "dark";

  const [sign, setSign] = useState("General");
  const [reading, setReading] = useState<DailyReading | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // 🔥 Limit & Popup State
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [scanCount, setScanCount] = useState(0);

  const t = (key: string) => getUIText(lang, key);

  const today = new Date().toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric" });

  // Check Limit
  useEffect(() => {
    const todayStr = new Date().toDateString();
    const savedDate = localStorage.getItem('daily_scan_date');
    let savedCount = parseInt(localStorage.getItem('daily_scan_count') || "0");

    if (savedDate !== todayStr) {
      localStorage.setItem('daily_scan_date', todayStr);
      savedCount = 0;
      localStorage.setItem('daily_scan_count', "0");
    }
    setScanCount(savedCount);
  }, [me?.user]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadReading() {
      // 🔥 Limit Check on Auto-load (Allow first load)
      const maxLimit = me?.user ? 2 : 1; 
      if (refreshKey > 0 && scanCount >= maxLimit) {
        setShowLimitModal(true);
        setLoading(false);
        return;
      }

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
        
        // Update Limit Count
        if (refreshKey > 0) {
          const newCount = scanCount + 1;
          setScanCount(newCount);
          localStorage.setItem('daily_scan_count', newCount.toString());
        }

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
  }, [sign, lang, refreshKey, me?.user]); // Removed scanCount from here to avoid infinite loops

  const selectedSign = SIGNS.find((item) => item.id === sign);
  const signLabel = selectedSign ? ((selectedSign as any)[lang] || selectedSign.en) : sign;

  // 🔥 NEW LOGIC: Chat Pre-fill
  const handleChatNow = () => {
    if (!reading) return;

    const summaryText = `Namaste, maine aaj ka apna rashifal (${signLabel}) dekha hai.
    
Aaj ka focus: ${reading.focus}
${reading.luckyColour ? `Lucky Colour: ${reading.luckyColour.name}` : ""}
${reading.luckyNumber ? `Lucky Number: ${reading.luckyNumber}` : ""}

Mujhe iske baare mein thoda aur detail mein margdarshan chahiye.`;

    const encodedPrompt = encodeURIComponent(summaryText);
    router.push(`/chat/gita?prefill=${encodedPrompt}`);
  };

  const handleShare = async () => {
    if (!reading) return;
    const text = `Aaj ka mera Rashifal (${signLabel}):\n\n${reading.focus}\n\nLucky Colour: ${reading.luckyColour?.name || "N/A"}\nLucky Number: ${reading.luckyNumber || "N/A"}\n\nCheck yours at GitaTalk!`;
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({ title: "Daily Horoscope", text, url: window.location.href });
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + window.location.href)}`, "_blank");
      }
    } catch {}
  };

  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c]" : "border-orange-100 bg-white shadow-md";
  const mutedClass = isDark ? "text-slate-300" : "text-gray-600";

  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How is today's horoscope calculated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Daily horoscopes are based on the transit of the Moon and other planets through your zodiac sign. Our AI analyzes these Vedic planetary positions to provide accurate guidance."
        }
      },
      {
        "@type": "Question",
        "name": "Is daily horoscope accurate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Horoscopes provide general guidance for your Sun sign. For highly specific predictions, it is always recommended to consult a personal astrologer with your birth details."
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
        <header className={`flex items-center justify-between gap-3 rounded-2xl border p-4 sm:p-5 ${cardClass}`}>
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" aria-label="Back to home" className={`rounded-xl p-2.5 ${isDark ? "bg-[#0A0F19] text-slate-300" : "bg-orange-50 text-orange-600"}`}>
              <ArrowLeft size={20} />
            </Link>
            <div className="min-w-0">
              <h1 className="flex items-center gap-1.5 text-[17px] sm:text-[20px] font-black tracking-tight text-[#ff6b00]">
                <Sun className="shrink-0 text-amber-500" size={22} />
                <span className="truncate">{t("title")}</span>
              </h1>
              <p className={`mt-0.5 flex items-center gap-1 text-[11px] sm:text-[13px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                <CalendarDays size={12} /> {today}
              </p>
            </div>
          </div>
          <button type="button" onClick={() => setRefreshKey((value) => value + 1)} disabled={loading} aria-label="Refresh horoscope" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-[#ff6b00] transition hover:bg-orange-500/20 disabled:opacity-50 border border-orange-500/20">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </header>

        {/* 🔥 POPUP MODAL (Limit Reached) */}
        {showLimitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl relative ${isDark ? "bg-[#151d2c] border border-slate-700" : "bg-white border border-gray-100"}`}>
              <button 
                onClick={() => setShowLimitModal(false)} 
                className={`absolute top-4 right-4 p-2 rounded-full ${isDark ? "bg-slate-800 text-slate-400" : "bg-gray-100 text-gray-500"}`}
              >
                <X size={18} />
              </button>
              
              <div className="flex flex-col items-center text-center mt-2">
                <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
                  <Lock size={30} className="text-rose-500" />
                </div>
                <h2 className={`text-[19px] font-black leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>{t("limitTitle")}</h2>
                <p className={`text-[13px] font-medium mt-2 mb-6 ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("limitSub")}</p>

                <div className="w-full space-y-3">
                  <button 
                    onClick={() => router.push("/chat/gita")}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3.5 text-[14px] font-black text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
                  >
                    <MessageCircle size={18} /> {t("chatFree")}
                  </button>
                  <button 
                    onClick={() => router.push("/wallet")}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 text-[14px] font-black text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
                  >
                    <Wallet size={18} /> {t("recharge")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HERO BANNER */}
        <section className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#FF8A00] to-[#FF3D00] p-6 sm:p-8 text-white shadow-lg">
          <div className="relative z-10 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"><Sparkles size={26} /></div>
            <h2 className="text-[26px] sm:text-[30px] font-black leading-tight">{t("title")}</h2>
            <p className="max-w-sm text-[13.5px] sm:text-[15px] font-medium leading-relaxed text-white/90">{t("intro")}</p>
          </div>
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -right-4 h-32 w-32 rounded-full bg-yellow-200/10 blur-2xl" />
        </section>

        {/* WARNING */}
        <section className={`rounded-2xl border p-4 ${isDark ? "border-rose-500/30 bg-[#2a151a] text-rose-200" : "border-rose-300 bg-rose-50 text-rose-800"}`}>
          <div className="flex items-start gap-3">
            <TriangleAlert size={20} className="mt-0.5 shrink-0 text-rose-500" />
            <p className="text-[13px] font-semibold leading-relaxed">{t("warning")}</p>
          </div>
        </section>

        {/* SELECTOR */}
        <section className={`space-y-4 rounded-[1.5rem] border p-5 sm:p-6 ${cardClass}`}>
          <label htmlFor="daily-sign" className="block text-[14px] font-bold">{t("selectSign")}</label>
          <select 
            id="daily-sign" 
            value={sign} 
            onChange={(event) => setSign(event.target.value)} 
            className={`w-full rounded-xl border px-4 py-4 text-[15px] font-medium outline-none transition focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 ${isDark ? "border-slate-700 bg-[#0A0F19] text-white" : "border-orange-200 bg-orange-50 text-gray-900"}`}
          >
            {SIGNS.map((item) => (
              <option key={item.id} value={item.id}>
                {(item as any)[lang] || item.en}
              </option>
            ))}
          </select>
          <button 
            type="button" 
            onClick={() => setRefreshKey((value) => value + 1)} 
            disabled={loading} 
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] px-4 py-4 text-[15px] font-bold text-white shadow-lg shadow-orange-500/20 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            {loading ? t("loading") : t("viewBtn")}
          </button>
        </section>

        {/* LOADING */}
        {loading && (
          <section className={`rounded-2xl border p-8 text-center ${cardClass}`}>
            <RefreshCw size={32} className="mx-auto animate-spin text-[#ff6b00]" />
            <p className="mt-4 text-[14px] font-semibold">{t("preparing")}</p>
          </section>
        )}

        {/* ERROR */}
        {!loading && error && (
          <section className={`rounded-2xl border p-5 ${isDark ? "border-rose-500/30 bg-[#2a151a]" : "border-rose-200 bg-rose-50"}`}>
            <div className={`flex items-center gap-2 ${isDark ? "text-rose-400" : "text-rose-700"}`}>
              <AlertCircle size={20} />
              <h3 className="text-[15px] font-black">{t("errorTitle")}</h3>
            </div>
            <p className={`mt-2 text-[13px] font-medium ${isDark ? "text-rose-200" : "text-rose-600"}`}>{error}</p>
            <button onClick={() => setRefreshKey(k => k + 1)} className="mt-4 rounded-lg bg-rose-500 px-4 py-2 text-[12px] font-bold text-white active:scale-95">Try Again</button>
          </section>
        )}

        {/* RESULT CARD */}
        {!loading && reading && (
          <section className={`space-y-5 rounded-[1.5rem] border p-5 sm:p-7 ${cardClass}`}>
            <div className="flex items-center justify-between border-b border-slate-700/30 pb-4">
              <div>
                <p className={`text-[11px] font-black uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("yourSign")}</p>
                <h3 className="text-[24px] font-black text-[#ff6b00]">{signLabel}</h3>
              </div>
              <Sparkles className="text-amber-500" size={28} />
            </div>

            <div>
              <p className={`text-[12px] font-bold uppercase tracking-wider mb-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("guidance")}</p>
              <p className={`text-[14.5px] leading-relaxed font-medium ${isDark ? "text-slate-200" : "text-gray-800"}`}>
                {reading.focus}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {reading.luckyColour && (
                <div className={`rounded-xl border p-4 flex flex-col items-center justify-center text-center ${isDark ? "border-slate-700 bg-[#0A0F19]/50" : "border-orange-100 bg-orange-50"}`}>
                  <Palette size={20} className="text-[#ff6b00] mb-2" />
                  <p className={`text-[10px] font-bold uppercase ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("luckyColor")}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: reading.luckyColour.hex }}></span>
                    <p className="text-[13px] font-black">{reading.luckyColour.name}</p>
                  </div>
                </div>
              )}
              {reading.luckyNumber && (
                <div className={`rounded-xl border p-4 flex flex-col items-center justify-center text-center ${isDark ? "border-slate-700 bg-[#0A0F19]/50" : "border-orange-100 bg-orange-50"}`}>
                  <Hash size={20} className="text-[#ff6b00] mb-2" />
                  <p className={`text-[10px] font-bold uppercase ${isDark ? "text-slate-500" : "text-gray-400"}`}>{t("luckyNum")}</p>
                  <p className="text-[18px] font-black mt-1">{reading.luckyNumber}</p>
                </div>
              )}
            </div>

            {reading.affirmation && (
              <div className={`rounded-xl border p-4 text-center ${isDark ? "border-amber-500/30 bg-amber-900/10" : "border-amber-200 bg-amber-50"}`}>
                <p className={`text-[11px] font-bold uppercase mb-1 ${isDark ? "text-amber-400" : "text-amber-700"}`}>{t("affirmation")}</p>
                <p className={`text-[13.5px] font-semibold italic ${isDark ? "text-amber-100" : "text-amber-900"}`}>"{reading.affirmation}"</p>
              </div>
            )}

            {/* CHAT CTA */}
            <div className={`mt-6 rounded-xl border p-5 ${isDark ? "border-emerald-500/30 bg-emerald-900/10" : "border-emerald-200 bg-emerald-50"}`}>
              <div className="flex items-start gap-3">
                <MessageCircle size={20} className={isDark ? "text-emerald-400" : "text-emerald-600"} />
                <div className="flex-1">
                  <h4 className={`text-[13px] font-black mb-1 ${isDark ? "text-emerald-300" : "text-emerald-800"}`}>{t("noteTitle")}</h4>
                  <p className={`text-[12px] font-medium leading-relaxed mb-3 ${isDark ? "text-emerald-100/70" : "text-emerald-700"}`}>
                    {t("note")}
                  </p>
                  <button 
                    onClick={handleChatNow}
                    className="w-full rounded-lg bg-emerald-500 py-2.5 text-[13px] font-bold text-white shadow-md active:scale-95 transition-transform"
                  >
                    {t("chatNow")}
                  </button>
                </div>
              </div>
            </div>

            {/* SHARE BUTTON */}
            <button 
              onClick={handleShare}
              className={`w-full flex items-center justify-center gap-2 rounded-xl border py-3.5 text-[13px] font-bold transition-colors ${isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
            >
              <Share2 size={18} className="text-[#25D366]" /> {t("share")}
            </button>
          </section>
        )}

        {/* 🔥 SEO CONTENT BLOCK */}
        <section className={`mt-8 px-5 sm:px-7 py-6 w-full rounded-[1.5rem] border ${isDark ? "border-slate-800/60 bg-[#0c111b]" : "border-orange-100 bg-white"} space-y-4`}>
          <h2 className={`text-[18px] sm:text-[20px] font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Aaj Ka Rashifal (Daily Horoscope)
          </h2>
          <p className={`text-[13px] sm:text-[14px] leading-relaxed ${isDark ? "text-slate-300" : "text-gray-600"}`}>
            आज का राशिफल आपको दिन की शुरुआत एक सकारात्मक सोच के साथ करने में मदद करता है। ज्योतिष शास्त्र के अनुसार, चंद्रमा और अन्य ग्रहों की स्थिति हर दिन बदलती है, जिसका असर हमारे मन और कार्यों पर पड़ता है। GitaTalk पर पाएं अपनी राशि के अनुसार सटीक दैनिक राशिफल, शुभ रंग, शुभ अंक और आज का ज्योतिषीय मार्गदर्शन।
          </p>
          
          <h3 className={`text-[15px] font-bold mt-4 ${isDark ? "text-white" : "text-gray-900"}`}>Frequently Asked Questions (FAQs)</h3>
          <div className="space-y-3 mt-2">
            <div>
              <p className={`text-[13.5px] font-bold ${isDark ? "text-slate-200" : "text-gray-800"}`}>Q: दैनिक राशिफल कैसे काम करता है?</p>
              <p className={`text-[13px] leading-relaxed mt-1 ${isDark ? "text-slate-400" : "text-gray-600"}`}>A: यह चंद्रमा और अन्य ग्रहों के गोचर (Transit) पर आधारित होता है। जब चंद्रमा आपकी राशि से गुजरता है, तो आपके मन और भावनाओं में बदलाव आते हैं, जिसे हमारा AI विश्लेषण करता है।</p>
            </div>
            <div>
              <p className={`text-[13.5px] font-bold ${isDark ? "text-slate-200" : "text-gray-800"}`}>Q: क्या यह राशिफल सटीक है?</p>
              <p className={`text-[13px] leading-relaxed mt-1 ${isDark ? "text-slate-400" : "text-gray-600"}`}>A: राशिफल सामान्य मार्गदर्शन देता है। सटीक भविष्यवाणी के लिए, आपको अपनी जन्म कुंडली (Birth Chart) और वर्तमान दशा के आधार पर ज्योतिषी से परामर्श लेना चाहिए।</p>
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
            Astrology is for guidance purposes only. Not a substitute for professional advice.
          </p>
        </footer>

      </div>

      {/* STICKY BOTTOM BANNER & NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col w-full">
        <div className="bg-gradient-to-r from-[#d81b60] via-[#e91e63] to-[#c2185b] px-4 py-2.5 flex items-center justify-between shadow-[0_-4px_20px_rgba(233,30,99,0.3)]">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-full border border-white/50 flex items-center justify-center shrink-0 bg-white/10">
               <Crown size={16} className="text-white" />
             </div>
             <div>
               <p className="text-[11px] font-bold text-white leading-tight">{t("stickyTitle")}</p>
               <p className="text-[13px] font-extrabold text-white leading-tight">{t("stickySub")}</p>
             </div>
          </div>
          <button onClick={() => router.push("/chat/gita")} className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-md">
               <Crown size={16} className="text-[#d81b60]" fill="currentColor" />
          </button>
        </div>

        <nav className={`flex justify-around border-t py-2.5 ${isDark ? "border-slate-800 bg-[#0A0F19]/95" : "border-amber-100 bg-white/95"} backdrop-blur`}>
          <Link href="/" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <Home size={18} /><span className="text-[9.5px] font-bold">{t("home")}</span>
          </Link>
          <Link href="/chat" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            <MessageCircle size={18} /><span className="text-[9.5px] font-bold">{t("chat")}</span>
          </Link>
          <Link href="/daily" className={`flex flex-col items-center gap-0.5 px-3 ${isDark ? "text-[#ff6b00]" : "text-[#ff6b00]"}`}>
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
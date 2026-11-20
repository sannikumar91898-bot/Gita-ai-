// app/palmistry/page.tsx
"use client";

import { useRef, useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Hand, MessageCircle, Upload, X, Lock, Wallet,
  Camera, Sun, Home, User, AlertCircle, CheckCircle, Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useApp } from "../Providers";

type PalmResult = { title: string; insight: string; hook: string; };

// 🔥 Loading Text — Palm specific — 10 languages
const getLoadingSteps = (lang: string) => {
  const steps: Record<string, string[]> = {
    hi: [
      "हथेली स्कैन हो रही है...",
      "रेखाओं का विश्लेषण हो रहा है...",
      "ग्रहों की स्थिति देखी जा रही है...",
      "रिपोर्ट तैयार हो रही है...",
    ],
    hinglish: [
      "Hatheli scan ho rahi hai...",
      "Rekhaon ka vishleshan ho raha hai...",
      "Planets check kiye ja rahe hain...",
      "Report taiyaar ho rahi hai...",
    ],
    en: [
      "Scanning palm lines...",
      "Analyzing mount positions...",
      "Checking planetary alignments...",
      "Generating Vedic report...",
    ],
    te: [
      "అరచేయి స్కాన్ అవుతోంది...",
      "రేఖల విశ్లేషణ జరుగుతోంది...",
      "గ్రహాల స్థితి పరిశీలిస్తోంది...",
      "నివేదిక సిద్ధమవుతోంది...",
    ],
    ta: [
      "உள்ளங்கை ஸ்கேன் செய்யப்படுகிறது...",
      "கோடுகள் ஆராயப்படுகிறது...",
      "கிரக நிலைகள் பார்க்கப்படுகிறது...",
      "அறிக்கை தயாராகிறது...",
    ],
    kn: [
      "ಅಂಗೈ ಸ್ಕ್ಯಾನ್ ಆಗುತ್ತಿದೆ...",
      "ರೇಖೆಗಳ ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ...",
      "ಗ್ರಹಗಳ ಸ್ಥಿತಿ ನೋಡಲಾಗುತ್ತಿದೆ...",
      "ವರದಿ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...",
    ],
    bn: [
      "হাতের তালু স্ক্যান হচ্ছে...",
      "রেখাগুলো বিশ্লেষণ হচ্ছে...",
      "গ্রহের অবস্থান দেখা হচ্ছে...",
      "রিপোর্ট তৈরি হচ্ছে...",
    ],
    mr: [
      "हाताचा तळवा स्कॅन होत आहे...",
      "रेषांचे विश्लेषण होत आहे...",
      "ग्रहांची स्थिती पाहिली जात आहे...",
      "अहवाल तयार होत आहे...",
    ],
    gu: [
      "હથેળી સ્કેન થઈ રહી છે...",
      "રેખાઓનું વિશ્લેષણ થઈ રહ્યું છે...",
      "ગ્રહોની સ્થિતિ જોવાઈ રહી છે...",
      "રિપોર્ટ તૈયાર થઈ રહ્યો છે...",
    ],
    ml: [
      "കൈപ്പത്തി സ്കാൻ ചെയ്യുന്നു...",
      "വരകൾ വിശകലനം ചെയ്യുന്നു...",
      "ഗ്രഹങ്ങളുടെ സ്ഥിതി പരിശോധിക്കുന്നു...",
      "റിപ്പോർട്ട് തയ്യാറാക്കുന്നു...",
    ],
  };
  return steps[lang] || steps["hinglish"];
};

// 🔥 UI Text — 10 languages
const getUIText = (lang: string, key: string): string => {
  const ui: Record<string, Record<string, string>> = {
    hi: {
      title: "हस्तरेखा रीडिंग", subtitle: "वैदिक विश्लेषण", free: "FREE",
      errorTitle: "त्रुटि",
      errSize: "फोटो 10MB से छोटी होनी चाहिए।",
      errType: "सिर्फ JPG, PNG या WEBP फोटो अपलोड करें।",
      errNotPalm: "ये हथेली की फोटो नहीं लग रही। कृपया साफ, सीधी हथेली की फोटो डालें।",
      uploadTitle: "अपनी हथेली की फोटो अपलोड करें",
      uploadDesc: "हथेली की रेखाएँ आपके भाग्य की दिशा बताती हैं। सीधी, खुली हथेली की साफ फोटो डालें (Max 10MB)।",
      guideTitle: "अच्छी फोटो कैसे लें?",
      guide1: "सीधी हथेली", guide2: "अच्छी रोशनी", guide3: "साफ फोकस",
      privacyNote: "आपकी फोटो सुरक्षित है — सर्वर पर सेव नहीं होती।",
      chooseBtn: "फोटो चुनें", complete: "विश्लेषण पूरा हुआ",
      talkAstro: "ज्योतिषी से बात करें — FREE",
      tryAnother: "दूसरी फोटो अपलोड करें",
      bannerTitle: "ज्योतिषी - 24x7 उपलब्ध",
      bannerSub: "पहली चैट FREE — अभी बात करें",
      home: "होम", chat: "चैट", daily: "राशिफल", profile: "प्रोफाइल",
      limitTitle: "आपकी फ्री लिमिट खत्म हो गई है!",
      limitSub: "आगे की रीडिंग के लिए वॉलेट रिचार्ज करें या ज्योतिषी से बात करें।",
      chatFree: "ज्योतिषी से फ्री बात करें",
      recharge: "वॉलेट रिचार्ज करें",
      close: "बंद करें",
      chatNow: "इस रिपोर्ट पर ज्योतिषी से बात करें",
    },
    hinglish: {
      title: "Palm Reading", subtitle: "Vedic Analysis", free: "FREE",
      errorTitle: "Error",
      errSize: "Photo 10MB se chhoti honi chahiye.",
      errType: "Sirf JPG, PNG ya WEBP upload karein.",
      errNotPalm: "Ye hatheli ki photo nahi lag rahi. Kripya saaf, seedhi hatheli ki photo daalein.",
      uploadTitle: "Apni hatheli ki photo upload karein",
      uploadDesc: "Hatheli ki rekhaayein aapke bhagya ki disha batati hain. Seedhi, khuli hatheli ki saaf photo daalein (Max 10MB).",
      guideTitle: "Achhi photo kaise lein?",
      guide1: "Seedhi hatheli", guide2: "Achhi roshni", guide3: "Saaf focus",
      privacyNote: "Aapki photo safe hai — server par save nahi hoti.",
      chooseBtn: "Choose Photo", complete: "Analysis Complete",
      talkAstro: "Talk to Astrologer — FREE",
      tryAnother: "Try another photo",
      bannerTitle: "Astrologer - 24x7 Available",
      bannerSub: "Pehli Chat FREE — abhi baat karein",
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile",
      limitTitle: "Aapki Free Limit Khatam Ho Gayi Hai!",
      limitSub: "Aage ki reading ke liye wallet recharge karein ya jyotishi se baat karein.",
      chatFree: "Jyotishi se Free baat karein",
      recharge: "Wallet Recharge",
      close: "Band karein",
      chatNow: "Is report par jyotishi se baat karein",
    },
    en: {
      title: "Palm Reading", subtitle: "Vedic Analysis", free: "FREE",
      errorTitle: "Error",
      errSize: "Photo must be under 10MB.",
      errType: "Only JPG, PNG or WEBP are supported.",
      errNotPalm: "This doesn't look like a palm photo. Please upload a clear, straight palm photo.",
      uploadTitle: "Upload your palm photo",
      uploadDesc: "Your palm lines reveal your destiny. Upload a clear photo of your open, straight palm (Max 10MB).",
      guideTitle: "How to take a good photo?",
      guide1: "Straight palm", guide2: "Good lighting", guide3: "Clear focus",
      privacyNote: "Your photo is safe — not stored on our servers.",
      chooseBtn: "Choose Photo", complete: "Analysis Complete",
      talkAstro: "Talk to Astrologer — FREE",
      tryAnother: "Try another photo",
      bannerTitle: "Astrologer - 24x7 Available",
      bannerSub: "First Chat FREE — talk now",
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile",
      limitTitle: "Your Free Limit is Exhausted!",
      limitSub: "Recharge your wallet or talk to an astrologer for further readings.",
      chatFree: "Chat with Astrologer FREE",
      recharge: "Recharge Wallet",
      close: "Close",
      chatNow: "Talk to Astrologer about this",
    },
    te: {
      title: "హస్త రేఖా పఠనం", subtitle: "వేద విశ్లేషణ", free: "ఉచితం",
      errorTitle: "లోపం",
      errSize: "ఫోటో 10MB కంటే తక్కువ ఉండాలి.",
      errType: "JPG, PNG లేదా WEBP మాత్రమే.",
      errNotPalm: "ఇది అరచేయి ఫోటోలా కనిపించడం లేదు. స్పష్టమైన, నేరుగా ఉన్న అరచేయి ఫోటో అప్‌లోడ్ చేయండి.",
      uploadTitle: "మీ అరచేయి ఫోటో అప్‌లోడ్ చేయండి",
      uploadDesc: "మీ అరచేయి రేఖలు మీ విధిని వెల్లడిస్తాయి. తెరిచిన, నేరుగా ఉన్న అరచేయి స్పష్టమైన ఫోటో పంపండి (Max 10MB).",
      guideTitle: "మంచి ఫోటో ఎలా తీయాలి?",
      guide1: "నేరుగా అరచేయి", guide2: "మంచి వెలుతురు", guide3: "స్పష్టమైన ఫోకస్",
      privacyNote: "మీ ఫోటో సురక్షితం — సర్వర్‌లో సేవ్ చేయబడదు.",
      chooseBtn: "ఫోటో ఎంచుకోండి", complete: "విశ్లేషణ పూర్తయింది",
      talkAstro: "జ్యోతిష్యుడితో మాట్లాడండి — ఉచితం",
      tryAnother: "మరో ఫోటో ప్రయత్నించండి",
      bannerTitle: "జ్యోతిష్యుడు - 24x7 అందుబాటులో",
      bannerSub: "మొదటి చాట్ ఉచితం — ఇప్పుడే మాట్లాడండి",
      home: "హోమ్", chat: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్",
      limitTitle: "మీ ఉచిత పరిమితి ముగిసింది!",
      limitSub: "మరిన్ని పఠనాల కోసం వాలెట్ రీఛార్జ్ చేయండి లేదా జ్యోతిష్యుడిని సంప్రదించండి.",
      chatFree: "ఉచితంగా మాట్లాడండి",
      recharge: "వాలెట్ రీఛార్జ్",
      close: "మూసివేయి",
      chatNow: "ఈ నివేదిక గురించి జ్యోతిష్యుడితో మాట్లాడండి",
    },
    ta: {
      title: "கைரேகை படிப்பு", subtitle: "வேத பகுப்பாய்வு", free: "இலவசம்",
      errorTitle: "பிழை",
      errSize: "புகைப்படம் 10MB க்குள் இருக்க வேண்டும்.",
      errType: "JPG, PNG அல்லது WEBP மட்டும்.",
      errNotPalm: "இது உள்ளங்கை புகைப்படம் போல் தெரியவில்லை. தெளிவான, நேராக உள்ள உள்ளங்கை புகைப்படத்தை பதிவேற்றவும்.",
      uploadTitle: "உங்கள் உள்ளங்கை புகைப்படத்தை பதிவேற்றவும்",
      uploadDesc: "உங்கள் உள்ளங்கை கோடுகள் உங்கள் விதியை வெளிப்படுத்துகின்றன. திறந்த, நேராக உள்ள உள்ளங்கையின் தெளிவான புகைப்படத்தை அனுப்பவும் (Max 10MB).",
      guideTitle: "நல்ல புகைப்படம் எப்படி எடுப்பது?",
      guide1: "நேராக உள்ளங்கை", guide2: "நல்ல வெளிச்சம்", guide3: "தெளிவான ஃபோகஸ்",
      privacyNote: "உங்கள் புகைப்படம் பாதுகாப்பானது — சேவையகத்தில் சேமிக்கப்படாது.",
      chooseBtn: "புகைப்படத்தை தேர்ந்தெடு", complete: "பகுப்பாய்வு முடிந்தது",
      talkAstro: "ஜோதிடரிடம் பேசுங்கள் — இலவசம்",
      tryAnother: "மற்றொரு புகைப்படத்தை முயற்சிக்கவும்",
      bannerTitle: "ஜோதிடர் - 24x7 கிடைக்கும்",
      bannerSub: "முதல் அரட்டை இலவசம் — இப்போது பேசுங்கள்",
      home: "முகப்பு", chat: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்",
      limitTitle: "உங்கள் இலவச வரம்பு முடிந்தது!",
      limitSub: "மேலும் படிப்புகளுக்கு வாலெட் ரீசார்ஜ் செய்யுங்கள் அல்லது ஜோதிடரை அணுகவும்.",
      chatFree: "இலவசமாக பேசுங்கள்",
      recharge: "வாலெட் ரீசார்ஜ்",
      close: "மூடு",
      chatNow: "இந்த அறிக்கை பற்றி ஜோதிடரிடம் பேசுங்கள்",
    },
    kn: {
      title: "ಕರನ್ಯಾಸ ಓದುವಿಕೆ", subtitle: "ವೈದಿಕ ವಿಶ್ಲೇಷಣೆ", free: "ಉಚಿತ",
      errorTitle: "ದೋಷ",
      errSize: "ಫೋಟೋ 10MB ಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.",
      errType: "JPG, PNG ಅಥವಾ WEBP ಮಾತ್ರ.",
      errNotPalm: "ಇದು ಅಂಗೈ ಫೋಟೋ ಎಂದು ತೋರುತ್ತಿಲ್ಲ. ಸ್ಪಷ್ಟವಾದ, ನೇರವಾದ ಅಂಗೈ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
      uploadTitle: "ನಿಮ್ಮ ಅಂಗೈ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
      uploadDesc: "ನಿಮ್ಮ ಅಂಗೈ ರೇಖೆಗಳು ನಿಮ್ಮ ಭವಿಷ್ಯವನ್ನು ಬಹಿರಂಗಪಡಿಸುತ್ತವೆ. ತೆರೆದ, ನೇರವಾದ ಅಂಗೈಯ ಸ್ಪಷ್ಟ ಫೋಟೋ ಕಳುಹಿಸಿ (Max 10MB).",
      guideTitle: "ಉತ್ತಮ ಫೋಟೋ ತೆಗೆಯುವುದು ಹೇಗೆ?",
      guide1: "ನೇರ ಅಂಗೈ", guide2: "ಉತ್ತಮ ಬೆಳಕು", guide3: "ಸ್ಪಷ್ಟ ಫೋಕಸ್",
      privacyNote: "ನಿಮ್ಮ ಫೋಟೋ ಸುರಕ್ಷಿತ — ಸರ್ವರ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗುವುದಿಲ್ಲ.",
      chooseBtn: "ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ", complete: "ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ",
      talkAstro: "ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ — ಉಚಿತ",
      tryAnother: "ಇನ್ನೊಂದು ಫೋಟೋ ಪ್ರಯತ್ನಿಸಿ",
      bannerTitle: "ಜ್ಯೋತಿಷಿ - 24x7 ಲಭ್ಯವಿದೆ",
      bannerSub: "ಮೊದಲ ಚಾಟ್ ಉಚಿತ — ಈಗ ಮಾತನಾಡಿ",
      home: "ಮುಖಪುಟ", chat: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್",
      limitTitle: "ನಿಮ್ಮ ಉಚಿತ ಮಿತಿ ಮುಗಿದಿದೆ!",
      limitSub: "ಹೆಚ್ಚಿನ ಓದುವಿಕೆಗಾಗಿ ವಾಲೆಟ್ ರೀಚಾರ್ಜ್ ಮಾಡಿ ಅಥವಾ ಜ್ಯೋತಿಷಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.",
      chatFree: "ಉಚಿತವಾಗಿ ಮಾತನಾಡಿ",
      recharge: "ವಾಲೆಟ್ ರೀಚಾರ್ಜ್",
      close: "ಮುಚ್ಚಿ",
      chatNow: "ಈ ವರದಿ ಬಗ್ಗೆ ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ",
    },
    bn: {
      title: "হস্তরেখা পাঠ", subtitle: "বৈদিক বিশ্লেষণ", free: "ফ্রি",
      errorTitle: "ত্রুটি",
      errSize: "ছবি 10MB এর কম হতে হবে।",
      errType: "শুধুমাত্র JPG, PNG বা WEBP।",
      errNotPalm: "এটি হাতের তালুর ছবি মনে হচ্ছে না। স্পষ্ট, সোজা হাতের তালুর ছবি আপলোড করুন।",
      uploadTitle: "আপনার হাতের তালুর ছবি আপলোড করুন",
      uploadDesc: "আপনার হাতের তালুর রেখা আপনার ভাগ্য প্রকাশ করে। খোলা, সোজা হাতের তালুর স্পষ্ট ছবি পাঠান (Max 10MB)।",
      guideTitle: "ভালো ছবি কীভাবে তুলবেন?",
      guide1: "সোজা হাতের তালু", guide2: "ভালো আলো", guide3: "স্পষ্ট ফোকাস",
      privacyNote: "আপনার ছবি নিরাপদ — সার্ভারে সংরক্ষণ করা হয় না।",
      chooseBtn: "ছবি চয়ন করুন", complete: "বিশ্লেষণ সম্পন্ন",
      talkAstro: "জ্যোতিষীর সাথে কথা বলুন — ফ্রি",
      tryAnother: "অন্য ছবি চেষ্টা করুন",
      bannerTitle: "জ্যোতিষী - 24x7 উপলব্ধ",
      bannerSub: "প্রথম চ্যাট ফ্রি — এখনই কথা বলুন",
      home: "হোম", chat: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল",
      limitTitle: "আপনার ফ্রি সীমা শেষ!",
      limitSub: "আরও পাঠের জন্য ওয়ালেট রিচার্জ করুন বা জ্যোতিষীর সাথে কথা বলুন।",
      chatFree: "ফ্রি চ্যাট করুন",
      recharge: "ওয়ালেট রিচার্জ",
      close: "বন্ধ করুন",
      chatNow: "এই রিপোর্ট সম্পর্কে জ্যোতিষীর সাথে কথা বলুন",
    },
    mr: {
      title: "हस्तरेषा वाचन", subtitle: "वैदिक विश्लेषण", free: "मोफत",
      errorTitle: "त्रुटी",
      errSize: "फोटो 10MB पेक्षा लहान असावा.",
      errType: "फक्त JPG, PNG किंवा WEBP.",
      errNotPalm: "हा हाताच्या तळव्याचा फोटो वाटत नाही. स्पष्ट, सरळ हाताच्या तळव्याचा फोटो अपलोड करा.",
      uploadTitle: "तुमच्या हाताच्या तळव्याचा फोटो अपलोड करा",
      uploadDesc: "तुमच्या हाताच्या तळव्याच्या रेषा तुमचे भविष्य सांगतात. उघडा, सरळ हाताच्या तळव्याचा स्पष्ट फोटो पाठवा (Max 10MB).",
      guideTitle: "चांगला फोटो कसा घ्यावा?",
      guide1: "सरळ तळवा", guide2: "चांगला प्रकाश", guide3: "स्पष्ट फोकस",
      privacyNote: "तुमचा फोटो सुरक्षित आहे — सर्व्हरवर साठवला जात नाही.",
      chooseBtn: "फोटो निवडा", complete: "विश्लेषण पूर्ण",
      talkAstro: "ज्योतिषाशी बोला — मोफत",
      tryAnother: "दुसरा फोटो वापरून पहा",
      bannerTitle: "ज्योतिषी - 24x7 उपलब्ध",
      bannerSub: "पहिली चॅट मोफत — आता बोला",
      home: "होम", chat: "चॅट", daily: "दैनिक", profile: "प्रोफाइल",
      limitTitle: "तुमची मोफत मर्यादा संपली आहे!",
      limitSub: "अधिक वाचनासाठी वॉलेट रिचार्ज करा किंवा ज्योतिषाशी बोला.",
      chatFree: "मोफत बोला",
      recharge: "वॉलेट रिचार्ज",
      close: "बंद करा",
      chatNow: "या अहवालाबद्दल ज्योतिषाशी बोला",
    },
    gu: {
      title: "હસ્તરેખા વાંચન", subtitle: "વૈદિક વિશ્લેષણ", free: "મફત",
      errorTitle: "ભૂલ",
      errSize: "ફોટો 10MB થી ઓછો હોવો જોઈએ.",
      errType: "ફક્ત JPG, PNG અથવા WEBP.",
      errNotPalm: "આ હથેળીનો ફોટો લાગતો નથી. સ્પષ્ટ, સીધી હથેળીનો ફોટો અપલોડ કરો.",
      uploadTitle: "તમારી હથેળીનો ફોટો અપલોડ કરો",
      uploadDesc: "તમારી હથેળીની રેખાઓ તમારું ભાગ્ય જણાવે છે. ખુલ્લી, સીધી હથેળીનો સ્પષ્ટ ફોટો મોકલો (Max 10MB).",
      guideTitle: "સારો ફોટો કેવી રીતે લેવો?",
      guide1: "સીધી હથેળી", guide2: "સારો પ્રકાશ", guide3: "સ્પષ્ટ ફોકસ",
      privacyNote: "તમારો ફોટો સુરક્ષિત છે — સર્વર પર સંગ્રહિત થતો નથી.",
      chooseBtn: "ફોટો પસંદ કરો", complete: "વિશ્લેષણ પૂર્ણ",
      talkAstro: "જ્યોતિષી સાથે વાત કરો — મફત",
      tryAnother: "બીજો ફોટો પ્રયાસ કરો",
      bannerTitle: "જ્યોતિષી - 24x7 ઉપલબ્ધ",
      bannerSub: "પ્રથમ ચેટ મફત — હમણાં વાત કરો",
      home: "હોમ", chat: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ",
      limitTitle: "તમારી મફત મર્યાદા સમાપ્ત થઈ ગઈ છે!",
      limitSub: "વધુ વાંચન માટે વોલેટ રિચાર્જ કરો અથવા જ્યોતિષી સાથે વાત કરો.",
      chatFree: "મફત વાત કરો",
      recharge: "વોલેટ રિચાર્જ",
      close: "બંધ કરો",
      chatNow: "આ રિપોર્ટ વિશે જ્યોતિષી સાથે વાત કરો",
    },
    ml: {
      title: "ഹസ്തരേഖ വായന", subtitle: "വൈദിക വിശകലനം", free: "സൗജന്യം",
      errorTitle: "പിശക്",
      errSize: "ഫോട്ടോ 10MB-യിൽ കുറവായിരിക്കണം.",
      errType: "JPG, PNG അല്ലെങ്കിൽ WEBP മാത്രം.",
      errNotPalm: "ഇത് കൈപ്പത്തിയുടെ ഫോട്ടോ ആയി തോന്നുന്നില്ല. വ്യക്തമായ, നേരെയുള്ള കൈപ്പത്തിയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.",
      uploadTitle: "നിങ്ങളുടെ കൈപ്പത്തിയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക",
      uploadDesc: "നിങ്ങളുടെ കൈപ്പത്തിയിലെ വരകൾ നിങ്ങളുടെ വിധി വെളിപ്പെടുത്തുന്നു. തുറന്ന, നേരെയുള്ള കൈപ്പത്തിയുടെ വ്യക്തമായ ഫോട്ടോ അയയ്ക്കുക (Max 10MB).",
      guideTitle: "നല്ല ഫോട്ടോ എങ്ങനെ എടുക്കാം?",
      guide1: "നേരെയുള്ള കൈപ്പത്തി", guide2: "നല്ല വെളിച്ചം", guide3: "വ്യക്തമായ ഫോക്കസ്",
      privacyNote: "നിങ്ങളുടെ ഫോട്ടോ സുരക്ഷിതമാണ് — സെർവറിൽ സംഭരിക്കുന്നില്ല.",
      chooseBtn: "ഫോട്ടോ തിരഞ്ഞെടുക്കുക", complete: "വിശകലനം പൂർത്തിയായി",
      talkAstro: "ജ്യോതിഷിയോട് സംസാരിക്കുക — സൗജന്യം",
      tryAnother: "മറ്റൊരു ഫോട്ടോ പരീക്ഷിക്കുക",
      bannerTitle: "ജ്യോതിഷി - 24x7 ലഭ്യമാണ്",
      bannerSub: "ആദ്യ ചാറ്റ് സൗജന്യം — ഇപ്പോൾ സംസാരിക്കുക",
      home: "ഹോം", chat: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ",
      limitTitle: "നിങ്ങളുടെ സൗജന്യ പരിധി തീർന്നു!",
      limitSub: "കൂടുതൽ വായനയ്ക്കായി വാലറ്റ് റീചാർജ് ചെയ്യുക അല്ലെങ്കിൽ ജ്യോതിഷിയുമായി സംസാരിക്കുക.",
      chatFree: "സൗജന്യമായി സംസാരിക്കുക",
      recharge: "വാലറ്റ് റീചാർജ്",
      close: "അടയ്ക്കുക",
      chatNow: "ഈ റിപ്പോർട്ടിനെക്കുറിച്ച് ജ്യോതിഷിയോട് സംസാരിക്കുക",
    },
  };
  return ui[lang]?.[key] || ui["en"][key] || ui["hi"][key];
};

// Image compression
const compressImage = async (file: File, maxWidth = 800, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scaleSize = img.width > maxWidth ? maxWidth / img.width : 1;
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas error");

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob)
              resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
            else reject("Compression failed");
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function PalmReadingPage() {
  const { lang, theme, me, loading: authLoading } = useApp();
  const router = useRouter();
  const isDark = theme === "dark";

  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<PalmResult | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [scanCount, setScanCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const t = (key: string) => getUIText(lang, key);

  const pageClass = isDark ? "bg-[#0A0F19] text-slate-100" : "bg-[#FEF8EF] text-slate-900";
  const cardClass = isDark ? "border-slate-800 bg-[#151d2c] shadow-lg" : "border-orange-100 bg-white shadow-xl";
  const softCard = isDark ? "bg-[#0A0F19] text-slate-400" : "bg-orange-50 text-orange-600";
  const navBg = isDark ? "bg-[#151d2c] border-slate-800" : "bg-white border-orange-100";

  // Check daily limit
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("palm_scan_date");
    let savedCount = parseInt(localStorage.getItem("palm_scan_count") || "0");

    if (savedDate !== today) {
      localStorage.setItem("palm_scan_date", today);
      savedCount = 0;
      localStorage.setItem("palm_scan_count", "0");
    }
    setScanCount(savedCount);
  }, [me?.user]);

  // Loading text rotation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const steps = getLoadingSteps(lang);
    if (loading) {
      setLoadingText(steps[0]);
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % steps.length;
        setLoadingText(steps[i]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading, lang]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  // ✅ FIX #1 — Upload click handler with auth check + limit check
  const handleUploadClick = () => {
    if (!me?.user || me.user.isGuest) {
      router.push("/login?redirect=/palmistry");
      return;
    }
    if (scanCount >= 2) {
      setShowLimitModal(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setResult(null);

    if (file.size === 0 || file.size > 10 * 1024 * 1024) {
      setPhoto(null);
      setErrorMsg(t("errSize"));
      e.target.value = "";
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhoto(null);
      setErrorMsg(t("errType"));
      e.target.value = "";
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const reader = new FileReader();

    reader.onload = async () => {
      if (typeof reader.result !== "string") return;

      setPhoto(reader.result);
      setLoading(true);

      try {
        const compressedFile = await compressImage(file);

        const formData = new FormData();
        formData.append("image", compressedFile);

        const res = await fetch("/api/palm-reading", {
          method: "POST",
          body: formData,
          signal: controller.signal,
          credentials: "include",
        });

        // ✅ FIX #2 — API 401 handler redirect
        if (res.status === 401) {
          router.push("/login?redirect=/palmistry");
          return;
        }

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          if (err?.error === "NOT_PALM") {
            setPhoto(null);
            setErrorMsg(t("errNotPalm"));
          } else {
            setErrorMsg(err?.message || t("errorTitle"));
          }
          return;
        }

        const data = await res.json();

        if (data?.error === "NOT_PALM") {
          setPhoto(null);
          setErrorMsg(t("errNotPalm"));
          return;
        }

        const newCount = scanCount + 1;
        setScanCount(newCount);
        localStorage.setItem("palm_scan_count", String(newCount));
        localStorage.setItem("palm_scan_date", new Date().toDateString());

        setResult({
          title: data.title || "Palm Reading",
          insight: data.insight || "",
          hook: data.hook || "",
        });
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setErrorMsg(t("errorTitle"));
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.onerror = () => {
      setErrorMsg(t("errorTitle"));
      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setPhoto(null);
    setResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const remaining = Math.max(0, 2 - scanCount);

  return (
    <div className={`min-h-screen ${pageClass}`}>
      {/* Header */}
      <header className={`sticky top-0 z-20 border-b ${navBg}`}>
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.back()}
            className={`rounded-full p-2 ${softCard}`}
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="flex items-center gap-2 text-base font-bold">
              <Hand size={18} /> {t("title")}
              <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
                {t("free")}
              </span>
            </h1>
            <p className="text-xs opacity-70">{t("subtitle")}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5 pb-28">
        {/* Upload area */}
        {!result && !loading && (
          <div className={`rounded-2xl border p-5 ${cardClass}`}>
            <div className="mb-4 flex items-center gap-3">
              <div className={`rounded-full p-3 ${softCard}`}>
                <Hand size={22} />
              </div>
              <div>
                <h2 className="text-base font-semibold">{t("uploadTitle")}</h2>
                <p className="mt-1 text-xs opacity-70">{t("uploadDesc")}</p>
              </div>
            </div>

            {/* Guide */}
            <div className={`mt-4 rounded-xl p-3 ${softCard}`}>
              <p className="text-xs font-semibold">{t("guideTitle")}</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="flex flex-col items-center gap-1">
                  <Hand size={16} />
                  <span>{t("guide1")}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Sun size={16} />
                  <span>{t("guide2")}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Camera size={16} />
                  <span>{t("guide3")}</span>
                </div>
              </div>
            </div>

            {/* Photo preview */}
            {photo && (
              <div className="relative mt-4 overflow-hidden rounded-xl border border-orange-200">
                <img src={photo} alt="palm" className="w-full object-cover" />
                <button
                  onClick={handleReset}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Error */}
            {errorMsg && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Privacy */}
            <p className="mt-3 flex items-center justify-center gap-1 text-[11px] opacity-60">
              <Lock size={12} /> {t("privacyNote")}
            </p>

            {/* Choose button — uses handleUploadClick (FIX #1) */}
            <button
              onClick={handleUploadClick}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white shadow hover:bg-orange-600"
            >
              <Upload size={16} />
              {t("chooseBtn")}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFile}
            />

            {/* Remaining */}
            <p className="mt-3 text-center text-[11px] opacity-60">
              {remaining} {lang === "hi" ? "फ्री रीडिंग बाकी" : "free readings left"}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className={`rounded-2xl border p-8 text-center ${cardClass}`}>
            <div className="mx-auto mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-orange-100">
              <Hand size={28} className="text-orange-500" />
            </div>
            <p className="text-sm font-medium">{loadingText}</p>
            {photo && (
              <img src={photo} alt="palm" className="mx-auto mt-4 h-32 rounded-lg object-cover" />
            )}
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className={`rounded-2xl border p-5 ${cardClass}`}>
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" />
              <span className="text-xs font-semibold text-green-600">{t("complete")}</span>
            </div>
            <h2 className="text-lg font-bold">{result.title}</h2>
            <p className="mt-2 text-sm leading-relaxed">{result.insight}</p>
            {result.hook && (
              <p className="mt-3 rounded-lg bg-orange-50 p-3 text-xs text-orange-700">{result.hook}</p>
            )}
            {photo && (
              <img src={photo} alt="palm" className="mt-4 h-40 w-full rounded-xl object-cover" />
            )}
            <button
              onClick={handleReset}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white"
            >
              <Upload size={16} />
              {t("tryAnother")}
            </button>
            <Link
              href="/chat"
              className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold ${softCard}`}
            >
              <MessageCircle size={16} />
              {t("chatNow")}
            </Link>
          </div>
        )}

        {/* Banner */}
        <Link
          href="/chat"
          className="mt-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 p-4 text-white"
        >
          <div>
            <p className="text-sm font-bold">{t("bannerTitle")}</p>
            <p className="text-[11px] opacity-90">{t("bannerSub")}</p>
          </div>
          <Sparkles size={22} />
        </Link>
      </main>

      {/* Limit Modal */}
      {showLimitModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setShowLimitModal(false)}
        >
          <div
            className={`w-full max-w-sm rounded-2xl p-5 ${isDark ? "bg-[#151d2c]" : "bg-white"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center gap-2">
              <Lock size={18} className="text-orange-500" />
              <h3 className="text-base font-bold">{t("limitTitle")}</h3>
            </div>
            <p className="text-sm opacity-70">{t("limitSub")}</p>
            <Link
              href="/wallet"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white"
            >
              <Wallet size={16} />
              {t("recharge")}
            </Link>
            <Link
              href="/chat"
              className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold ${softCard}`}
            >
              <MessageCircle size={16} />
              {t("chatFree")}
            </Link>
            <button
              onClick={() => setShowLimitModal(false)}
              className="mt-2 w-full py-2 text-xs opacity-60"
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className={`fixed bottom-0 left-0 right-0 z-20 border-t ${navBg}`}>
        <div className="mx-auto flex max-w-2xl items-center justify-around py-2">
          <Link href="/" className="flex flex-col items-center gap-0.5 text-[10px] opacity-70">
            <Home size={18} /> {t("home")}
          </Link>
          <Link href="/chat" className="flex flex-col items-center gap-0.5 text-[10px] opacity-70">
            <MessageCircle size={18} /> {t("chat")}
          </Link>
          <Link href="/palmistry" className="flex flex-col items-center gap-0.5 text-[10px] text-orange-500">
            <Hand size={18} /> {t("title")}
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-0.5 text-[10px] opacity-70">
            <User size={18} /> {t("profile")}
          </Link>
        </div>
      </nav>
    </div>
  );
}
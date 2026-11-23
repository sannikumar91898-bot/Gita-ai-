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

// 🔥 Loading Text — 10 languages
const getLoadingSteps = (lang: string) => {
  const steps: Record<string, string[]> = {
    hi: ["हथेली स्कैन हो रही है...", "रेखाओं का विश्लेषण हो रहा है...", "ग्रहों की स्थिति देखी जा रही है...", "रिपोर्ट तैयार हो रही है..."],
    hinglish: ["Hatheli scan ho rahi hai...", "Rekhaon ka vishleshan ho raha hai...", "Planets check kiye ja rahe hain...", "Report taiyaar ho rahi hai..."],
    en: ["Scanning palm lines...", "Analyzing mount positions...", "Checking planetary alignments...", "Generating Vedic report..."],
    te: ["అరచేయి స్కాన్ అవుతోంది...", "రేఖల విశ్లేషణ జరుగుతోంది...", "గ్రహాల స్థితి పరిశీలిస్తోంది...", "నివేదిక సిద్ధమవుతోంది..."],
    ta: ["உள்ளங்கை ஸ்கேன் செய்யப்படுகிறது...", "கோடுகள் ஆராயப்படுகிறது...", "கிரக நிலைகள் பார்க்கப்படுகிறது...", "அறிக்கை தயாராகிறது..."],
    kn: ["ಅಂಗೈ ಸ್ಕ್ಯಾನ್ ಆಗುತ್ತಿದೆ...", "ರೇಖೆಗಳ ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ...", "ಗ್ರಹಗಳ ಸ್ಥಿತಿ ನೋಡಲಾಗುತ್ತಿದೆ...", "ವರದಿ ಸಿದ್ಧವಾಗುತ್ತಿದೆ..."],
    bn: ["হাতের তালু স্ক্যান হচ্ছে...", "রেখাগুলো বিশ্লেষণ হচ্ছে...", "গ্রহের অবস্থান দেখা হচ্ছে...", "রিপোর্ট তৈরি হচ্ছে..."],
    mr: ["हाताचा तळवा स्कॅन होत आहे...", "रेषांचे विश्लेषण होत आहे...", "ग्रहांची स्थिती पाहिली जात आहे...", "अहवाल तयार होत आहे..."],
    gu: ["હથેળી સ્કેન થઈ રહી છે...", "રેખાઓનું વિશ્લેષણ થઈ રહ્યું છે...", "ગ્રહોની સ્થિતિ જોવાઈ રહી છે...", "રિપોર્ટ તૈયાર થઈ રહ્યો છે..."],
    ml: ["കൈപ്പത്തി സ്കാൻ ചെയ്യുന്നു...", "വരകൾ വിശകലനം ചെയ്യുന്നു...", "ഗ്രഹങ്ങളുടെ സ്ഥിതി പരിശോധിക്കുന്നു...", "റിപ്പോർട്ട് തയ്യാറാക്കുന്നു..."],
  };
  return steps[lang] || steps["hinglish"];
};

// 🔥 UI Text — 10 languages (Pure & Clean)
const getUIText = (lang: string, key: string): string => {
  const ui: Record<string, Record<string, string>> = {
    hi: {
      title: "हस्तरेखा रीडिंग", subtitle: "वैदिक विश्लेषण", free: "FREE",
      genderTitle: "आपका लिंग", male: "पुरुष", female: "महिला", other: "अन्य",
      handTitle: "कौन सा हाथ?", left: "बायां", right: "दायां", handDesc: "सामान्यतः पुरुष का दायां, महिला का बायां हाथ मुख्य माना जाता है।",
      uploadTitle: "अपनी हथेली की फोटो अपलोड करें", uploadDesc: "हथेली की रेखाएँ आपके भाग्य की दिशा बताती हैं। (Max 10MB)",
      chooseBtn: "फोटो चुनें", errorTitle: "त्रुटि", errSize: "फोटो 10MB से छोटी होनी चाहिए।",
      errType: "सिर्फ JPG, PNG या WEBP फोटो अपलोड करें।", errNotPalm: "ये हथेली की फोटो नहीं लग रही। कृपया साफ फोटो डालें।",
      complete: "विश्लेषण पूरा हुआ", tryAnother: "दूसरी फोटो अपलोड करें", chatNow: "इस रिपोर्ट पर ज्योतिषी से बात करें",
      bannerTitle: "ज्योतिषी - 24x7 उपलब्ध", bannerSub: "अपनी समस्या का समाधान पाएं - पहली चैट FREE",
      home: "होम", chat: "चैट", daily: "राशिफल", profile: "प्रोफाइल",
      faqTitle: "Free AI Palmistry Reading Online", 
      faqDesc: "हस्तरेखा शास्त्र (Palmistry) के अनुसार, हमारी हथेली की रेखाएं हमारे भूतकाल, वर्तमान और भविष्य के बारे में बहुत कुछ बताती हैं। GitaTalk का AI पामिस्ट्री टूल आपकी हथेली की फोटो का स्कैन करके जीवन रेखा, मस्तिष्क रेखा, हृदय रेखा और भाग्य रेखा का सटीक विश्लेषण करता है।",
      qTitle: "Frequently Asked Questions (FAQs)", 
      q1: "क्या AI हस्तरेखा विश्लेषण सही है?", a1: "हाँ, हमारा AI पारंपरिक सामुद्रिक शास्त्र के नियमों का उपयोग करके आपकी हथेली का विश्लेषण करता है।", 
      q2: "क्या हथेली की रेखाएं बदल सकती हैं?", a2: "जी हाँ, कर्म और उपायों के प्रभाव से हर 3-6 महीने में हथेली की छोटी रेखाएं बदल सकती हैं।",
      limitTitle: "आपकी फ्री लिमिट खत्म हो गई है!", limitSub: "आगे की रीडिंग के लिए वॉलेट रिचार्ज करें या ज्योतिषी से बात करें।", chatFree: "ज्योतिषी से फ्री बात करें", recharge: "वॉलेट रिचार्ज करें", close: "बंद करें"
    },
    hinglish: {
      title: "Palmistry", subtitle: "Vedic Analysis", free: "FREE",
      genderTitle: "Aapka Ling", male: "Purush", female: "Mahila", other: "Anya",
      handTitle: "Kaun sa haath?", left: "Baayan", right: "Daayan", handDesc: "Aamtaur par purush ka daayan, mahila ka baayan haath mukhya mana jata hai.",
      uploadTitle: "Apni hatheli ki photo upload karein", uploadDesc: "Hatheli ki rekhaayein aapke bhavishya ki disha batati hain. (Max 10MB)",
      chooseBtn: "Photo Chunein", errorTitle: "Error", errSize: "Photo 10MB se chhoti honi chahiye.",
      errType: "Sirf JPG, PNG ya WEBP upload karein.", errNotPalm: "Ye hatheli ki photo nahi lag rahi.",
      complete: "Analysis Complete", tryAnother: "Doosri photo upload karein", chatNow: "Is report par jyotishi se baat karein",
      bannerTitle: "Jyotishi - 24x7 Available", bannerSub: "Apni samasya ka samadhan payein - Pehli chat FREE",
      home: "Home", chat: "Chat", daily: "Rashifal", profile: "Profile",
      faqTitle: "Free AI Palmistry Reading Online", 
      faqDesc: "Hatheli ki rekhaon ke anusaar, hamari hatheli ki rekhaayein bhootkaal, vartaman aur bhavishya ke baare mein batati hain. GitaTalk ka AI tool aapki hatheli ki photo scan karta hai.",
      qTitle: "Frequently Asked Questions (FAQs)", 
      q1: "Kya AI hastrekha sahi hai?", a1: "Haan, hamara AI traditional niyamon ka use karta hai.", 
      q2: "Kya hatheli ki rekhayein badal sakti hain?", a2: "Ji haan, karm aur upayon se badal sakti hain.",
      limitTitle: "Aapki Free Limit Khatam Ho Gayi Hai!", limitSub: "Aage ki reading ke liye wallet recharge karein.", chatFree: "Jyotishi se Free baat karein", recharge: "Wallet Recharge", close: "Band karein"
    },
    en: {
      title: "Palm Reading", subtitle: "Vedic Analysis", free: "FREE",
      genderTitle: "Your Gender", male: "Male", female: "Female", other: "Other",
      handTitle: "Which hand?", left: "Left", right: "Right", handDesc: "Generally, right hand for men and left hand for women is considered primary.",
      uploadTitle: "Upload your palm photo", uploadDesc: "Your palm lines reveal your destiny. (Max 10MB)",
      chooseBtn: "Choose Photo", errorTitle: "Error", errSize: "Photo must be under 10MB.",
      errType: "Only JPG, PNG or WEBP are supported.", errNotPalm: "This doesn't look like a palm photo.",
      complete: "Analysis Complete", tryAnother: "Try another photo", chatNow: "Talk to Astrologer about this",
      bannerTitle: "Astrologer - 24x7 Available", bannerSub: "Get your problems solved - First chat FREE",
      home: "Home", chat: "Chat", daily: "Daily", profile: "Profile",
      faqTitle: "Free AI Palmistry Reading Online", 
      faqDesc: "According to Palmistry, the lines on our palm tell a lot about our past, present, and future. GitaTalk's AI tool scans your palm photo to accurately analyze your Life Line, Head Line, Heart Line, and Fate Line.",
      qTitle: "Frequently Asked Questions (FAQs)", 
      q1: "Is AI palm analysis accurate?", a1: "Yes, our AI uses traditional rules and modern vision models.", 
      q2: "Can palm lines change?", a2: "Yes, due to karma and remedies, minor lines can change every 3-6 months.",
      limitTitle: "Your Free Limit is Exhausted!", limitSub: "Recharge your wallet or talk to an astrologer.", chatFree: "Chat with Astrologer FREE", recharge: "Recharge Wallet", close: "Close"
    },
    te: { title: "హస్త రేఖా పఠనం", subtitle: "వేద విశ్లేషణ", free: "ఉచితం", genderTitle: "మీ లింగం", male: "పురుషుడు", female: "స్త్రీ", other: "ఇతర", handTitle: "ఏ చేయి?", left: "ఎడమ", right: "కుడి", handDesc: "సాధారణంగా పురుషులకు కుడి చేయి, మహిళలకు ఎడమ చేయి ప్రధానం.", uploadTitle: "ఫోటో అప్‌లోడ్ చేయండి", uploadDesc: "మీ విధిని తెలుసుకోండి (Max 10MB)", chooseBtn: "ఫోటో ఎంచుకోండి", errorTitle: "లోపం", errSize: "10MB కంటే తక్కువ ఉండాలి.", errType: "JPG, PNG లేదా WEBP మాత్రమే.", errNotPalm: "అరచేయి ఫోటో కాదు.", complete: "పూర్తయింది", tryAnother: "మరో ఫోటో", chatNow: "జ్యోతిష్యుడితో మాట్లాడండి", bannerTitle: "జ్యోతిష్యుడు - 24x7", bannerSub: "మొదటి చాట్ ఉచితం", home: "హోమ్", chat: "చాట్", daily: "డైలీ", profile: "ప్రొఫైల్", faqTitle: "Free AI Palmistry", faqDesc: "సాముద్రిక శాస్త్రం ప్రకారం...", qTitle: "FAQs", q1: "AI సరైనదా?", a1: "అవును.", q2: "రేఖలు మారవచ్చా?", a2: "అవును.", limitTitle: "పరిమితి ముగిసింది!", limitSub: "రీఛార్జ్ చేయండి.", chatFree: "ఉచిత చాట్", recharge: "రీఛార్జ్", close: "మూసివేయి" },
    ta: { title: "கைரேகை படிப்பு", subtitle: "வேத பகுப்பாய்வு", free: "இலவசம்", genderTitle: "உங்கள் பாலினம்", male: "ஆண்", female: "பெண்", other: "மற்றவை", handTitle: "எந்த கை?", left: "இடது", right: "வலது", handDesc: "ஆண்களுக்கு வலது கை, பெண்களுக்கு இடது கை முதன்மையானது.", uploadTitle: "புகைப்படத்தை பதிவேற்றவும்", uploadDesc: "உங்கள் விதியை அறியுங்கள் (Max 10MB)", chooseBtn: "தேர்ந்தெடு", errorTitle: "பிழை", errSize: "10MB க்குள் இருக்க வேண்டும்.", errType: "JPG, PNG மட்டும்.", errNotPalm: "உள்ளங்கை படம் இல்லை.", complete: "முடிந்தது", tryAnother: "மற்றொரு படம்", chatNow: "ஜோதிடரிடம் பேசுங்கள்", bannerTitle: "ஜோதிடர் - 24x7", bannerSub: "முதல் அரட்டை இலவசம்", home: "முகப்பு", chat: "அரட்டை", daily: "தினசரி", profile: "சுயவிவரம்", faqTitle: "Free AI Palmistry", faqDesc: "கைரேகை சாஸ்திரத்தின் படி...", qTitle: "FAQs", q1: "AI சரியானதா?", a1: "ஆம்.", q2: "கைரேகைகள் மாறுமா?", a2: "ஆம்.", limitTitle: "வரம்பு முடிந்தது!", limitSub: "ரீசார்ஜ் செய்யுங்கள்.", chatFree: "இலவச அரட்டை", recharge: "ரீசார்ஜ்", close: "மூடு" },
    kn: { title: "ಕರನ್ಯಾಸ ಓದುವಿಕೆ", subtitle: "ವೈದಿಕ ವಿಶ್ಲೇಷಣೆ", free: "ಉಚಿತ", genderTitle: "ನಿಮ್ಮ ಲಿಂಗ", male: "ಪುರುಷ", female: "ಮಹಿಳೆ", other: "ಇತರೆ", handTitle: "ಯಾವ ಕೈ?", left: "ಎಡ", right: "ಬಲ", handDesc: "ಪುರುಷರಿಗೆ ಬಲ ಕೈ, ಮಹಿಳೆಯರಿಗೆ ಎಡ ಕೈ ಪ್ರಧಾನ.", uploadTitle: "ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", uploadDesc: "ನಿಮ್ಮ ಭವಿಷ್ಯ ತಿಳಿಯಿರಿ (Max 10MB)", chooseBtn: "ಆಯ್ಕೆಮಾಡಿ", errorTitle: "ದೋಷ", errSize: "10MB ಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.", errType: "JPG, PNG ಮಾತ್ರ.", errNotPalm: "ಅಂಗೈ ಫೋಟೋ ಅಲ್ಲ.", complete: "ಪೂರ್ಣಗೊಂಡಿದೆ", tryAnother: "ಇನ್ನೊಂದು ಫೋಟೋ", chatNow: "ಜ್ಯೋತಿಷಿಯೊಂದಿಗೆ ಮಾತನಾಡಿ", bannerTitle: "ಜ್ಯೋತಿಷಿ - 24x7", bannerSub: "ಮೊದಲ ಚಾಟ್ ಉಚಿತ", home: "ಮುಖಪುಟ", chat: "ಚಾಟ್", daily: "ದೈನಂದಿನ", profile: "ಪ್ರೊಫೈಲ್", faqTitle: "Free AI Palmistry", faqDesc: "ಕರನ್ಯಾಸ ಶಾಸ್ತ್ರದ ಪ್ರಕಾರ...", qTitle: "FAQs", q1: "AI ನಿಖರವೇ?", a1: "ಹೌದು.", q2: "ರೇಖೆಗಳು ಬದಲಾಗಬಹುದೇ?", a2: "ಹೌದು.", limitTitle: "ಮಿತಿ ಮುಗಿದಿದೆ!", limitSub: "ರೀಚಾರ್ಜ್ ಮಾಡಿ.", chatFree: "ಉಚಿತ ಚಾಟ್", recharge: "ರೀಚಾರ್ಜ್", close: "ಮುಚ್ಚಿ" },
    bn: { title: "হস্তরেখা পাঠ", subtitle: "বৈদিক বিশ্লেষণ", free: "ফ্রি", genderTitle: "আপনার লিঙ্গ", male: "পুরুষ", female: "মহিলা", other: "অন্যান্য", handTitle: "কোন হাত?", left: "বাম", right: "ডান", handDesc: "পুরুষের ডান হাত, মহিলার বাম হাত প্রধান।", uploadTitle: "ছবি আপলোড করুন", uploadDesc: "আপনার ভাগ্য জানুন (Max 10MB)", chooseBtn: "ছবি চয়ন করুন", errorTitle: "ত্রুটি", errSize: "10MB এর কম হতে হবে।", errType: "JPG, PNG শুধুমাত্র।", errNotPalm: "হাতের তালুর ছবি নয়।", complete: "সম্পন্ন", tryAnother: "অন্য ছবি", chatNow: "জ্যোতিষীর সাথে কথা বলুন", bannerTitle: "জ্যোতিষী - 24x7", bannerSub: "প্রথম চ্যাট ফ্রি", home: "হোম", chat: "চ্যাট", daily: "দৈনিক", profile: "প্রোফাইল", faqTitle: "Free AI Palmistry", faqDesc: "হস্তরেখা শাস্ত্র অনুসারে...", qTitle: "FAQs", q1: "AI কি সঠিক?", a1: "হ্যাঁ।", q2: "রেখা পরিবর্তন হতে পারে?", a2: "হ্যাঁ।", limitTitle: "সীমা শেষ!", limitSub: "রিচার্জ করুন।", chatFree: "ফ্রি চ্যাট", recharge: "রিচার্জ", close: "বন্ধ" },
    mr: { title: "हस्तरेषा वाचन", subtitle: "वैदिक विश्लेषण", free: "मोफत", genderTitle: "तुमचे लिंग", male: "पुरुष", female: "स्त्री", other: "इतर", handTitle: "कोणता हात?", left: "डावा", right: "उजवा", handDesc: "पुरुषांचा उजवा, स्त्रियांचा डावा हात मुख्य.", uploadTitle: "फोटो अपलोड करा", uploadDesc: "तुमचे भविष्य जाणून घ्या (Max 10MB)", chooseBtn: "फोटो निवडा", errorTitle: "त्रुटी", errSize: "10MB पेक्षा लहान असावा.", errType: "फक्त JPG, PNG.", errNotPalm: "हाताच्या तळव्याचा फोटो नाही.", complete: "पूर्ण", tryAnother: "दुसरा फोटो", chatNow: "ज्योतिषाशी बोला", bannerTitle: "ज्योतिषी - 24x7", bannerSub: "पहिली चॅट मोफत", home: "होम", chat: "चॅट", daily: "दैनिक", profile: "प्रोफाइल", faqTitle: "Free AI Palmistry", faqDesc: "हस्तरेषा शास्त्रानुसार...", qTitle: "FAQs", q1: "AI बरोबर आहे का?", a1: "होय.", q2: "रेषा बदलू शकतात का?", a2: "होय.", limitTitle: "मर्यादा संपली!", limitSub: "रिचार्ज करा.", chatFree: "मोफत चॅट", recharge: "रिचार्ज", close: "बंद" },
    gu: { title: "હસ્તરેખા વાંચન", subtitle: "વૈદિક વિશ્લેષણ", free: "મફત", genderTitle: "તમારું લિંગ", male: "પુરુષ", female: "સ્ત્રી", other: "અન્ય", handTitle: "કયો હાથ?", left: "ડાબો", right: "જમણો", handDesc: "પુરુષોનો જમણો, સ્ત્રીઓનો ડાબો હાથ મુખ્ય.", uploadTitle: "ફોટો અપલોડ કરો", uploadDesc: "તમારું ભાગ્ય જાણો (Max 10MB)", chooseBtn: "ફોટો પસંદ કરો", errorTitle: "ભૂલ", errSize: "10MB થી ઓછો હોવો જોઈએ.", errType: "ફક્ત JPG, PNG.", errNotPalm: "હથેળીનો ફોટો નથી.", complete: "પૂર્ણ", tryAnother: "બીજો ફોટો", chatNow: "જ્યોતિષી સાથે વાત કરો", bannerTitle: "જ્યોતિષી - 24x7", bannerSub: "પ્રથમ ચેટ મફત", home: "હોમ", chat: "ચેટ", daily: "દૈનિક", profile: "પ્રોફાઇલ", faqTitle: "Free AI Palmistry", faqDesc: "હસ્તરેખા શાસ્ત્ર અનુસાર...", qTitle: "FAQs", q1: "AI સચોટ છે?", a1: "હા.", q2: "રેખાઓ બદલાઈ શકે?", a2: "હા.", limitTitle: "મર્યાદા સમાપ્ત!", limitSub: "રિચાર્જ કરો.", chatFree: "મફત ચેટ", recharge: "રિચાર્જ", close: "બંધ" },
    ml: { title: "ഹസ്തരേഖ വായന", subtitle: "വൈദിക വിശകലനം", free: "സൗജന്യം", genderTitle: "നിങ്ങളുടെ ലിംഗഭേദം", male: "പുരുഷൻ", female: "സ്ത്രീ", other: "മറ്റുള്ളവർ", handTitle: "ഏത് കൈ?", left: "ഇടത്", right: "വലത്", handDesc: "പുരുഷന്മാർക്ക് വലത് കൈ, സ്ത്രീകൾക്ക് ഇടത് കൈ പ്രധാനമാണ്.", uploadTitle: "ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക", uploadDesc: "നിങ്ങളുടെ വിധി അറിയുക (Max 10MB)", chooseBtn: "ഫോട്ടോ തിരഞ്ഞെടുക്കുക", errorTitle: "പിശക്", errSize: "10MB-യിൽ കുറവായിരിക്കണം.", errType: "JPG, PNG മാത്രം.", errNotPalm: "കൈപ്പത്തിയുടെ ഫോട്ടോ അല്ല.", complete: "പൂർത്തിയായി", tryAnother: "മറ്റൊരു ഫോട്ടോ", chatNow: "ജ്യോതിഷിയോട് സംസാരിക്കുക", bannerTitle: "ജ്യോതിഷി - 24x7", bannerSub: "ആദ്യ ചാറ്റ് സൗജന്യം", home: "ഹോം", chat: "ചാറ്റ്", daily: "ദൈനംദിനം", profile: "പ്രൊഫൈൽ", faqTitle: "Free AI Palmistry", faqDesc: "ഹസ്തരേഖാ ശാസ്ത്രം അനുസരിച്ച്...", qTitle: "FAQs", q1: "AI കൃത്യമാണോ?", a1: "അതെ.", q2: "വരകൾ മാറുമോ?", a2: "അതെ.", limitTitle: "പരിധി തീർന്നു!", limitSub: "റീചാർജ് ചെയ്യുക.", chatFree: "സൗജന്യ ചാറ്റ്", recharge: "റീചാർജ്", close: "അടയ്ക്കുക" }
  };
  return ui[lang]?.[key] || ui["en"][key] || ui["hi"][key];
};

export default function PalmistryPage() {
  const router = useRouter();
  const { lang, me, theme } = useApp();
  const isDark = theme === "dark";

  const [gender, setGender] = useState<string>("male");
  const [hand, setHand] = useState<string>("right");
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [result, setResult] = useState<PalmResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const t = (key: string) => getUIText(lang || "hi", key);

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
    const steps = getLoadingSteps(lang || "hi");
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
        const compressedFile = file;

        const formData = new FormData();
        formData.append("image", compressedFile);
        formData.append("gender", gender);
        formData.append("hand", hand);
        formData.append("language", lang || "hi");

        const res = await fetch("/api/palm", {
          method: "POST",
          body: formData,
          signal: controller.signal,
          credentials: "include",
        });

        if (res.status === 401) {
          router.push("/login?redirect=/palmistry");
          return;
        }

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          if (err?.error === "NOT_PALM" || err?.error === "INVALID_IMAGE") {
            setPhoto(null);
            setErrorMsg(t("errNotPalm"));
          } else {
            setErrorMsg(err?.message || t("errorTitle"));
          }
          return;
        }

        const data = await res.json();

        if (data?.error === "NOT_PALM" || data?.error === "INVALID_IMAGE") {
          setPhoto(null);
          setErrorMsg(t("errNotPalm"));
          return;
        }

        const newCount = scanCount + 1;
        setScanCount(newCount);
        localStorage.setItem("palm_scan_count", String(newCount));
        localStorage.setItem("palm_scan_date", new Date().toDateString());

        setResult({
          title: data.result?.barnumLines?.[0] || "Palm Reading",
          insight: data.result?.lines?.life || "",
          hook: data.result?.suspenseHook || "",
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

  return (
    <div className={`min-h-screen pb-24 ${pageClass}`}>
      
      {/* HEADER (Fixed Width) */}
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        <header className={`flex items-center gap-3 rounded-2xl border p-4 sm:p-5 ${cardClass}`}>
          <Link href="/" className={`rounded-xl p-2.5 transition-colors ${isDark ? "bg-[#0A0F19] text-slate-300" : "bg-orange-50 text-orange-600"}`}>
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[17px] sm:text-[20px] font-black uppercase tracking-tight text-[#ff6b00] flex items-center gap-2">
              <Hand size={18} className="text-[#ff6b00]" /> {t("title")}
            </h1>
            <p className={`text-[11px] sm:text-[13px] font-bold ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("subtitle")}</p>
          </div>
          <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-500 border border-emerald-500/20">{t("free")}</span>
        </header>

        {/* MAIN CARD */}
        <section className={`rounded-[1.5rem] border p-5 sm:p-7 ${cardClass}`}>
          <div className="space-y-6">
            
            {/* Gender Selection */}
            <div>
              <label className={`text-[14px] font-bold mb-3 block ${isDark ? "text-slate-200" : "text-gray-800"}`}>{t("genderTitle")}</label>
              <div className="flex gap-3">
                {(["male", "female", "other"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 rounded-xl py-3 text-[14px] font-bold border transition-colors ${
                      gender === g 
                        ? "bg-[#ff6b00] text-white border-[#ff6b00]" 
                        : `${softCard} border-transparent hover:border-orange-200`
                    }`}
                  >
                    {t(g)}
                  </button>
                ))}
              </div>
            </div>

            {/* Hand Selection */}
            <div>
              <label className={`text-[14px] font-bold mb-3 block ${isDark ? "text-slate-200" : "text-gray-800"}`}>{t("handTitle")}</label>
              <div className="flex gap-3">
                {(["left", "right"] as const).map((h) => (
                  <button
                    key={h}
                    onClick={() => setHand(h)}
                    className={`flex-1 rounded-xl py-3 text-[14px] font-bold border transition-colors ${
                      hand === h 
                        ? "bg-[#ff6b00] text-white border-[#ff6b00]" 
                        : `${softCard} border-transparent hover:border-orange-200`
                    }`}
                  >
                    {t(h)}
                  </button>
                ))}
              </div>
              <p className={`mt-2 text-[11px] sm:text-[12px] opacity-70 leading-relaxed ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("handDesc")}</p>
            </div>

            {/* Upload Area */}
            <div className="pt-2">
              {errorMsg && (
                <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {photo ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-md">
                  <img src={photo} alt="Palm" className="w-full h-[300px] object-cover" />
                  {loading && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff6b00] mb-4"></div>
                      <p className="text-[15px] font-bold">{loadingText}</p>
                    </div>
                  )}
                  {!loading && (
                    <button
                      onClick={handleReset}
                      className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center mt-2">
                  <h2 className={`text-[18px] sm:text-[20px] font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                    {t("uploadTitle")}
                  </h2>
                  <p className={`text-[12px] sm:text-[13px] mb-6 text-center max-w-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                    {t("uploadDesc")}
                  </p>
                  
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg mb-6">
                    <Hand size={44} strokeWidth={1.5} />
                  </div>

                  <button
                    onClick={handleUploadClick}
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] px-8 py-3.5 text-[15px] font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Upload size={18} /> {t("chooseBtn")}
                  </button>
                </div>
              )}
              
              <input
                type="file"
                accept="image/jpeg, image/png, image/webp"
                ref={fileInputRef}
                onChange={handleFile}
                className="hidden"
              />
            </div>
          </div>

          {/* Result Section */}
          {result && !loading && (
            <div className="mt-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5 sm:p-6 mb-6">
                <h3 className="text-[20px] font-black text-[#ff6b00] mb-3 flex items-center gap-2">
                  <CheckCircle size={20} /> {t("complete")}
                </h3>
                <p className={`text-[14px] leading-relaxed mb-4 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                  {result.insight}
                </p>
                <div className="border-t border-slate-700/50 pt-4 mt-4">
                  <p className={`text-[13px] font-medium italic ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                    "{result.hook}"
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/chat" className="w-full rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] py-3.5 text-[15px] font-bold text-white shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2">
                  <MessageCircle size={18} /> {t("chatNow")}
                </Link>
                <button
                  onClick={handleReset}
                  className={`w-full rounded-xl border py-3.5 text-[14px] font-bold transition-colors ${
                    isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {t("tryAnother")}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* SEO CONTENT & FAQ */}
        <section className={`mt-4 px-5 sm:px-7 py-6 w-full rounded-[1.5rem] border ${isDark ? "border-slate-800/60 bg-[#0c111b]" : "border-orange-100 bg-white"} space-y-4`}>
          <h2 className={`text-[18px] sm:text-[20px] font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {t("faqTitle")}
          </h2>
          <p className={`text-[13px] sm:text-[14px] leading-relaxed ${isDark ? "text-slate-300" : "text-gray-600"}`}>
            {t("faqDesc")}
          </p>
          
          <h3 className={`text-[15px] font-bold mt-6 ${isDark ? "text-white" : "text-gray-900"}`}>{t("qTitle")}</h3>
          <div className="space-y-4 mt-2">
            <div>
              <p className={`text-[13.5px] font-bold flex items-start gap-2 ${isDark ? "text-slate-200" : "text-gray-800"}`}>
                <span className="text-[#ff6b00]">Q:</span> {t("q1")}
              </p>
              <p className={`text-[13px] leading-relaxed mt-1.5 pl-5 ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                <span className="text-[#ff6b00] font-bold">A:</span> {t("a1")}
              </p>
            </div>
            <div>
              <p className={`text-[13.5px] font-bold flex items-start gap-2 ${isDark ? "text-slate-200" : "text-gray-800"}`}>
                <span className="text-[#ff6b00]">Q:</span> {t("q2")}
              </p>
              <p className={`text-[13px] leading-relaxed mt-1.5 pl-5 ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                <span className="text-[#ff6b00] font-bold">A:</span> {t("a2")}
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-4 pt-6 pb-2 border-t border-slate-800/80 w-full text-center">
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-[12px] font-semibold text-slate-400">
            <Link href="/privacy-policy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-orange-500 transition-colors">Terms & Refund Policy</Link>
            <Link href="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link>
          </div>
          <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
            © {new Date().getFullYear()} GitaTalk (gitatalk.in). All rights reserved.<br />
            Astrology is for guidance purposes only. Not a substitute for professional advice.
          </p>
        </footer>

      </div>

      {/* BOTTOM STICKY BANNER */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 w-full border-t pb-safe ${navBg}`}>
        <div className="flex items-center justify-between p-3 w-full max-w-2xl mx-auto gap-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isDark ? "bg-rose-500/20 text-rose-500" : "bg-rose-100 text-rose-600"}`}>
              <MessageCircle size={20} />
            </div>
            <div>
              <p className={`text-[13px] font-bold leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>{t("bannerTitle")}</p>
              <p className="text-[11px] font-medium text-emerald-500">{t("bannerSub")}</p>
            </div>
          </div>
          <Link href="/chat" className="shrink-0 rounded-full bg-gradient-to-r from-[#ff7b00] to-[#ff5a00] px-4 py-2 text-[13px] font-bold text-white shadow-md active:scale-95 transition-transform flex items-center gap-1">
            <MessageCircle size={14} /> {t("chatNow")}
          </Link>
        </div>
      </div>

      {/* LIMIT MODAL */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm rounded-2xl border p-6 shadow-2xl text-center ${cardClass}`}>
            <div className="h-14 w-14 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4">
              <Lock size={28} />
            </div>
            <h3 className={`text-[18px] font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>{t("limitTitle")}</h3>
            <p className={`text-[13px] mb-6 ${isDark ? "text-slate-400" : "text-gray-500"}`}>{t("limitSub")}</p>
            
            <div className="space-y-3">
              <Link href="/chat" className="w-full rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] py-3 text-[14px] font-bold text-white shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2">
                <MessageCircle size={16} /> {t("chatFree")}
              </Link>
              <Link href="/wallet" className={`w-full rounded-xl border py-3 text-[14px] font-bold transition-colors flex items-center justify-center gap-2 ${isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
                <Wallet size={16} /> {t("recharge")}
              </Link>
              <button onClick={() => setShowLimitModal(false)} className="text-[13px] font-semibold opacity-60 hover:opacity-100 transition-opacity pt-2">
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
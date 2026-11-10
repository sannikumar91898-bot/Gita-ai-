// i18n.ts

export type Lang = "en" | "hi" | "hinglish" | "te" | "ta" | "kn" | "bn" | "mr" | "gu" | "ml";

export const LANGUAGES: { code: Lang; label: string; native: string }[] = [
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "hinglish", label: "Hinglish", native: "Hinglish" },
  { code: "en", label: "English", native: "English" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
];

type Dict = Record<string, string>;

const en: Dict = {
  // ... (Purane words same rahenge)
  enterDetails: "Enter Your Details",
  chooseLanguage: "Choose your language",
  heyThere: "Hey there!",
  yourName: "What is your name?",
  yourGender: "What is your gender?",
  birthDate: "Enter your birth date",
  birthTime: "Enter your birth time",
  unknownTime: "Don't know my exact time of birth",
  birthPlace: "Where were you born?",
  searchPlace: "Search city...",
  consent: "I consent to storing my birth details securely to generate my personal kundli.",
  startChat: "Start chat with Astrologer",
  next: "Next",
  chatPlaceholder: "Ask your question...",
  // ... (Baaki purane words same rahenge)
};

const hi: Dict = {
  // ... (Purane words)
  enterDetails: "अपनी जानकारी दर्ज करें",
  chooseLanguage: "अपनी भाषा चुनें",
  heyThere: "नमस्ते!",
  yourName: "आपका नाम क्या है?",
  yourGender: "आपका लिंग क्या है?",
  birthDate: "अपनी जन्म तिथि दर्ज करें",
  birthTime: "अपना जन्म समय दर्ज करें",
  unknownTime: "मुझे अपना सही जन्म समय नहीं पता",
  birthPlace: "आपका जन्म कहाँ हुआ था?",
  searchPlace: "शहर खोजें...",
  consent: "मैं अपनी कुंडली बनाने के लिए अपनी जानकारी सुरक्षित रूप से सहेजने की सहमति देता हूँ।",
  startChat: "ज्योतिषी से चैट शुरू करें",
  next: "आगे बढ़ें",
  chatPlaceholder: "अपना सवाल पूछें...",
  // ... (Baaki purane words)
};

const hinglish: Dict = {
  // ... (Purane words)
  enterDetails: "Apni Details Enter Karein",
  chooseLanguage: "Apni language chunein",
  heyThere: "Namaste!",
  yourName: "Aapka naam kya hai?",
  yourGender: "Aapka gender kya hai?",
  birthDate: "Apni birth date daalein",
  birthTime: "Apna birth time daalein",
  unknownTime: "Mujhe apna exact birth time nahi pata",
  birthPlace: "Aapka janm kahan hua tha?",
  searchPlace: "City search karein...",
  consent: "Main apni kundli banane ke liye details save karne ki consent deta hoon.",
  startChat: "Astrologer se chat shuru karein",
  next: "Aage Badhein",
  chatPlaceholder: "Apna sawaal poochhein...",
  // ... (Baaki purane words)
};

// Baaki 7 languages (te, ta, kn, bn, mr, gu, ml) ke liye English fallback use hoga.
const te: Dict = { appName: "గీత AI", tagline: "మీ వ్యక్తిగత AI జ్యోతిష్యుడు", navHome: "హోమ్", navChat: "చాట్", next: "తదుపరి" };
const ta: Dict = { appName: "கீதா AI", tagline: "உங்கள் தனிப்பட்ட AI ஜோதிடர்", navHome: "முகப்பு", navChat: "அரட்டை", next: "அடுத்து" };
const kn: Dict = { appName: "ಗೀತಾ AI", tagline: "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ AI ಜ್ಯೋತಿಷಿ", navHome: "ಮುಖಪುಟ", navChat: "ಚಾಟ್", next: "ಮುಂದೆ" };
const bn: Dict = { appName: "গীতা AI", tagline: "আপনার ব্যক্তিগত AI জ্যোতিষী", navHome: "হোম", navChat: "চ্যাট", next: "পরবর্তী" };
const mr: Dict = { appName: "गीता AI", tagline: "तुमचा वैयक्तिक AI ज्योतिषी", navHome: "होम", navChat: "चॅट", next: "पुढे" };
const gu: Dict = { appName: "ગીતા AI", tagline: "તમારા અંગત AI જ્યોતિષી", navHome: "હોમ", navChat: "ચેટ", next: "આગળ" };
const ml: Dict = { appName: "ഗീത AI", tagline: "നിങ്ങളുടെ വ്യക്തിഗത AI ജ്യോതിഷി", navHome: "ഹോം", navChat: "ചാറ്റ്", next: "അടുത്തത്" };

export const DICTS: Record<Lang, Dict> = { en, hi, hinglish, te, ta, kn, bn, mr, gu, ml };

export function translate(lang: Lang, key: string): string {
  // Agar nayi bhasha me word nahi hai, toh English fallback use hoga
  return DICTS[lang]?.[key] ?? DICTS.en[key] ?? key;
}
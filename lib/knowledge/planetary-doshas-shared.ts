import type {
  DoshaLocalizedText,
} from "./planetary-doshas.types";

// 🔥 LEGAL-SAFE & MARKETING DISCLAIMER 🔥
export const DOSHA_DISCLAIMER: DoshaLocalizedText = {
  hi: "© 2026 Astrologer App. यह पारंपरिक वैदिक ज्योतिष और ग्रहों की गणना के सिद्धांतों पर आधारित जानकारी है। यह व्यक्तिगत अंतर्दृष्टि और मार्गदर्शन के लिए है। बड़े जीवन निर्णय अपनी बुद्धि और वास्तविक परिस्थितियों के आधार पर लें।",
  hinglish:
    "© 2026 Astrologer App. Yeh traditional Vedic Astrology aur grahon ki ganana ke siddhanton par aadharit jankari hai. Yeh personal insight aur guidance ke liye hai. Bade life decisions apni samajh aur real circumstances ke basis par lein.",
  en: "© 2026 Astrologer App. This is information based on traditional Vedic Astrology and planetary calculation principles. It is for personal insight and guidance. Make major life decisions using your own wisdom and real circumstances.",
};

// 🔥 AI KO DIJAANE WALE STRICT MARKETING RULES 🔥
export const DOSHA_STYLE = {
  voice: "warm_female_astrologer" as const, // Changed from warm_female
  tone: "authoritative" as const, // Changed from gentle
  empathy_required: true,
  avoid_judgment: true,
  controlled_fear_required: true, // Changed from avoid_fear_based_predictions
  absolute_certainty_required: true, // Added
  encourage_user_remedies: true, // Changed from encourage_user_autonomy
};
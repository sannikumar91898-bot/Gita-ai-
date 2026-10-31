import type { PeriodLocalizedText } from "./favorable-periods.types";

// 🔥 MARKETING-SAFE DISCLAIMER (Play Store ke liye legal, par user ko darr nahi lagne wala) 🔥
export const PERIOD_DISCLAIMER: PeriodLocalizedText = {
  hi: "© 2026 Astrologer App. यह प्लेटफ़ॉर्म प्राचीन वैदिक ज्योतिष और ग्रहों की गणना के सिद्धांतों पर आधारित मार्गदर्शन प्रदर्शित करता है।",
  hinglish:
    "© 2026 Astrologer App. Yeh platform pracheen Vedic Jyotish aur grahon ki ganana ke siddhanton par aadharit margdarshan pradarshit karta hai.",
  en: "© 2026 Astrologer App. This platform displays guidance based on ancient Vedic Astrology and planetary calculation principles.",
};

// 🔥 AI KO DIJAANE WALE STRICT BUSINESS RULES 🔥
export const FEMALE_ASTROLOGER_PERIOD_STYLE = {
  tone: "Highly authoritative, warm yet strict, absolute certainty, traditional female astrologer voice (like a real Pandit ji).",
  empathy_required: true,
  controlled_fear_required: true, // Darr dikhana zaroori hai conversion ke liye
  absolute_certainty_required: true, // "Shayad" ya "Ho sakta hai" bolna mana hai
  avoid_disclaimers: true, // "Ye guarantee nahi hai" bolna strictly mana hai
  use_marketing_hooks: true, // "Iska upay karna zaroori hai warna nuksan hoga"
} as const;
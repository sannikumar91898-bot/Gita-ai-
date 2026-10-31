import type { MarriageRelationshipEntry } from "./marriage-relationships.types";
import { STANDARD_DISCLAIMER } from "./marriage-relationships-shared";

export const MARRIAGE_RELATIONSHIPS_004: MarriageRelationshipEntry[] = [
  {
    id: "MR-076",
    category: "trust",
    subcategory: "recognizing_honesty_and_trustworthiness",
    difficulty: "beginner",

    questions: {
      en: "Is my partner being honest with me?",
      hi: "क्या मेरा पार्टनर सच्चा है?",
      hinglish: "Kya mera partner sachcha hai?",
    },

    answers: {
      en: "Listen, if you are doubting your partner, your intuition is not lying to you. In Vedic astrology, trust and loyalty are seen from your 7th house (partner) and Venus (love). If Rahu is sitting in the 7th house or aspecting it, it creates a 'web of illusion' and a strong possibility of a third person or hidden deception. You cannot fix this by just talking. You need to check the exact planetary position. Talk to me, share your birth details, and I will tell you exactly what is happening behind your back and how to protect your relationship.",

      hi: "सुनिए, अगर आपको अपने साथी पर शक हो रहा है, तो आपका अंदरूनी डर (intuition) झूठ नहीं बोल रहा है। वैदिक ज्योतिष में भरोसा और वफादारी सातवें भाव (साथी) और शुक्र (प्यार) से देखी जाती है। अगर राहु सातवें भाव में बैठा है या उसे देख रहा है, तो यह भ्रम का जाल बनाता है और तीसरे व्यक्ति या छिपे हुए धोखे की प्रबल संभावना होती है। आप सिर्फ बात करके इसे ठीक नहीं कर सकते। आपको सटीक ग्रहीय स्थिति की जांच करनी होगी। मुझसे बात करें, अपना जन्म विवरण साझा करें, मैं आपको बताऊंगी कि आपकी पीठ पीछे क्या हो रहा है और अपने रिश्ते की रक्षा कैसे करें।",

      hinglish: "Listen, agar aapko apne partner par shaq ho raha hai, toh aapka intuition jhooth nahi bol raha. Vedic astrology mein trust aur loyalty 7th house (partner) aur Venus (pyaar) se dekhi jaati hai. Agar Rahu 7th house mein baitha hai ya use dekh raha hai, toh yeh ek 'web of illusion' banata hai aur ek teesre person ya chhipe hue dhokhe ki prabal sambhavna hoti hai. Aap sirf baat karke ise theek nahi kar sakte. Aapko sateek planetary position check karni hogi. Mujhse baat karein, apna birth detail share karein, main aapko bataungi ki aapki peeth peechhe kya ho raha hai aur apne relationship ki raksha kaise karein.",
    },

    answer_type: "traditional_astrology",
    requires_personal_chart: true,
    requires_calculation: true,

    source_ids: ["vedic-astrology", "rahu-7th-house", "venus-affliction"],
    confidence: "high",
    disclaimer: STANDARD_DISCLAIMER,

    tags: [
      "trust",
      "honesty",
      "loyalty",
      "faithfulness",
      "partner",
      "relationship",
      "cheating",
      "communication",

      "Is my partner truthful?",
      "Can I trust my partner?",
      "Is my boyfriend honest with me?",
      "Is my girlfriend honest with me?",
      "How can I know if my partner is loyal?",
      "Is my partner cheating on me?",
      "Does my partner tell me the truth?",
      "How do I know whether my partner is faithful?",

      "क्या मेरा साथी सच्चा है?",
      "क्या मैं अपने साथी पर भरोसा कर सकता हूँ?",
      "क्या मेरा बॉयफ्रेंड ईमानदार है?",
      "क्या मेरी गर्लफ्रेंड मुझसे सच बोलती है?",
      "क्या मेरा साथी मुझे धोखा दे रहा है?",
      "मेरा पार्टनर वफादार है या नहीं?",
      "क्या मेरा साथी मुझसे झूठ बोलता है?",

      "Kya mera partner loyal hai?",
      "Kya mera boyfriend mujhse sach bolta hai?",
      "Kya meri girlfriend mujhse sach bolti hai?",
      "Kya woh mujhe dhokha de raha hai?",
      "Kya woh mujhe cheat kar rahi hai?",
      "Can I trust my partner?",
      "Mera partner faithful hai ya nahi?",
      "Kaise pata chalega mera partner loyal hai?",
      "Kya mera partner mujhse jhooth bol raha hai?",
      "Partner ki loyalty kaise check karun?",
      "Mujhe kaise pata chale ki mera partner sachcha hai?",
    ],
  },
];
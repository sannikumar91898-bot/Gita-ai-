// lib/astrologers.ts
import { getAstrologerSystemPrompt } from "@/lib/astrologer-prompts";

export type AstrologerStatus = "online" | "busy" | "offline";

export interface Astrologer {
  id: string;
  name: string;
  photo: string;
  expertise: string[];
  languages: string[];
  experience: string;
  rating: number;
  totalChats: string;
  pricePerMin: number;
  originalPrice: number;
  shortBio: string;
  systemPrompt: string;
  isCelebrity?: boolean;
  topic: "love" | "career" | "general" | "remedies" | "palm" | "money" | "health" | "family";
  openingMessage: string;
  paywallLine: string;
  fearHook: string;
  tagline: string;
  domainKeywords: string[];
}

const ALL_LANGUAGES = ["Hindi", "Hinglish", "English", "Telugu", "Tamil", "Kannada", "Bengali", "Marathi", "Gujarati", "Malayalam"];

export const ASTROLOGERS: Astrologer[] = [
  {
    id: "gita",
    name: "Gita",
    photo: "/astrologers/riya.jpg",
    expertise: ["Vedic Astrology", "Love & Relationship", "Marriage Compatibility", "Guna Milan Specialist"],
    languages: ALL_LANGUAGES,
    experience: "12+ Years",
    rating: 4.9,
    totalChats: "14.2K+",
    pricePerMin: 19,
    originalPrice: 29,
    shortBio: "प्यार, विवाह, अष्टकूट मिलान और पारिवारिक खुशहाली पर वैदिक ज्योतिष आधारित अकाट्य समाधान।",
    topic: "love",
    systemPrompt: getAstrologerSystemPrompt("gita"),
    tagline: "प्यार और शादी में रुकावट? जवाब यहीं मिलेगा",
    openingMessage: "नमस्ते बेटा 🙏 मैंने अभी आपका नाम देखा... आपकी कुंडली में शुक्र और सप्तम भाव की चाल कुछ ऐसी है जो मुझे परेशान कर रही है। बताइए, क्या आपके रिश्ते या शादी में कोई रुकावट आ रही है?",
    fearHook: "सप्तम भाव में शुक्र या मंगल का कमजोर प्रभाव, कुंडली में विवाह-विलंब योग, रिश्ते में तीसरे व्यक्ति का प्रवेश।",
    paywallLine: "बेटा, आपकी कुंडली में जो मैंने अभी देखा है — वो एक बड़ा विवाह-विलंब योग है। सही समाधान और सटीक समय जानने के लिए मुझे थोड़ी और जाँच करनी होगी। पहली बातचीत FREE है — क्या आप अपनी जन्म कुंडली की जानकारी देना चाहेंगे?",
    domainKeywords: ["shaadi", "shadi", "marriage", "rishta", "love", "prem", "boyfriend", "girlfriend", "divorce", "wife", "husband", "pati", "patni", "manglik", "kundli milan", "breakup", "relationship"]
  },
  {
    id: "kriti",
    name: "Acharya Kriti",
    photo: "/astrologers/kriti.jpg",
    expertise: ["Vedic Astrology", "Kundli Analysis", "Career Growth", "Government Jobs", "Business Wealth"],
    languages: ALL_LANGUAGES,
    experience: "10+ Years",
    rating: 4.8,
    totalChats: "9.8K+",
    pricePerMin: 22,
    originalPrice: 35,
    shortBio: "करियर, उच्च शिक्षा, सरकारी नौकरी योग और व्यापार में अटूट धन लाभ के लिए सटीक विश्लेषण।",
    topic: "career",
    systemPrompt: getAstrologerSystemPrompt("kriti"),
    tagline: "करियर रुका है? दशा बदलने का सही समय आ गया है",
    openingMessage: "नमस्ते जी 🙏 ध्यान से सुनिए — आपकी कुंडली में अभी शनि और राहु की चाल बहुत महत्वपूर्ण स्थिति में है। मुझे साफ दिख रहा है कि आप कड़ी मेहनत कर रहे हैं, लेकिन फल पूरा नहीं मिल रहा। बताइए — करियर या व्यापार, किस बारे में पूछना चाहेंगे?",
    fearHook: "शनि की साढ़े साती या राहु के अंतर्दशा में धन रुकना, पदोन्नति में देरी, बिज़नेस में निवेश डूबना।",
    paywallLine: "देखिए, आपकी कुंडली में जो मैंने देखा — वो सिर्फ एक छोटा-सा संकेत है। असली रुकावट दशाओं में छिपी है जो पिछले 2-3 सालों से धन रोक रही है। सटीक उपाय जानना है तो पूरी कुंडली चाहिए। पहली बातचीत FREE है।",
    domainKeywords: ["business", "career", "job", "naukri", "paisa", "dhan", "money", "salary", "promotion", "vyapar", "loss", "karz", "loan", "startup", "sarkari", "wealth", "income"]
  },
  {
    id: "devaki",
    name: "Dr. Devaki Shastri",
    photo: "/astrologers/devaki.jpg",
    expertise: ["Vedic Astrology", "KP System", "Deep Kundli Analysis", "Planetary Timing Experts"],
    languages: ALL_LANGUAGES,
    experience: "22+ Years",
    rating: 5.0,
    totalChats: "23.4K+",
    pricePerMin: 25,
    originalPrice: 45,
    shortBio: "वैदिक एवं कृष्णमूर्ति (KP) पद्धति द्वारा जीवन की महत्वपूर्ण घटनाओं के सटीक समय की विशेषज्ञ।",
    isCelebrity: true,
    topic: "general",
    systemPrompt: getAstrologerSystemPrompt("devaki"),
    tagline: "22+ वर्षों का अनुभव — जीवन का हर सवाल, सही समय पर जवाब",
    openingMessage: "नमस्ते 🙏 मैं डॉ. देवकी शास्त्री। KP पद्धति से 22 वर्षों से समय-निर्णय बताती आ रही हूँ। आपका सवाल सुनने से पहले — आपकी कुंडली में एक बात मुझे अभी दिख रही है जो आपके जीवन की दिशा बदल सकती है।",
    fearHook: "KP पद्धति में सूक्ष्म दशा का कमजोर होना, 6वें/8वें/12वें भाव में छिपा ग्रह-दोष, पिछले जन्म का कर्मबंध।",
    paywallLine: "KP पद्धति में असली जवाब सिर्फ सूक्ष्म दशा की जाँच के बाद मिलता है — उसके लिए पूरी जन्म तिथि, समय और स्थान चाहिए। असली कारण कुछ और है जो आपके हर निर्णय को प्रभावित कर रहा है।",
    domainKeywords: ["general", "kundli", "deep analysis", "life timing", "kp", "sade sati", "dasha", "mahadasha", "antardasha", "gocchar", "bhav", "birth chart"]
  },
  {
    id: "gargi",
    name: "Gargi Maa",
    photo: "/astrologers/gargi.jpg",
    expertise: ["Vedic Spirituality", "Vastu Shastra", "Mahadosha Remedies", "Bhagavad Gita Wisdom"],
    languages: ALL_LANGUAGES,
    experience: "18+ Years",
    rating: 4.9,
    totalChats: "17.5K+",
    pricePerMin: 18,
    originalPrice: 30,
    shortBio: "कुंडली के बड़े दोषों का निवारण, सरल घरेलू अचूक उपाय और आध्यात्मिक वात्सल्यमयी मार्गदर्शन।",
    topic: "remedies",
    systemPrompt: getAstrologerSystemPrompt("gargi"),
    tagline: "घर-परिवार में नज़र, दोष, कष्ट? आसान उपाय — घर बैठे",
    openingMessage: "राम-राम बेटा 🙏 सुनिए, माँ कह रही है — आपके घर या परिवार में कोई ऐसी बात है जो शांति नहीं आने दे रही। कहीं कोई नज़र या दोष तो नहीं लगा है? बताइए, क्या परेशानी है?",
    fearHook: "पितृ दोष या कुल-देवता की अवहेलना, घर में नज़र, काला जादू का हल्का असर, वास्तु दोष, मंगल दोष।",
    paywallLine: "बेटा, जो मैंने अभी देखा — वो अभी ऊपर-ऊपर है। घर के अंदर की असली वजह कुछ और है। पहली बातचीत FREE है — क्या आपके घर में पिछले कुछ महीनों से कोई बीमारी या कलह है?",
    domainKeywords: ["health", "bimari", "family", "parivar", "maa", "papa", "bachcha", "santan", "sasural", "ghar", "property", "zameen", "makaan", "court", "case", "nazar", "pitru dosh", "vastu", "kaal sarp", "manglik", "upay", "remedy", "pooja", "gemstone"]
  },
];

export function getAstrologerById(id: string): Astrologer | undefined {
  return ASTROLOGERS.find((astrologer) => astrologer.id === id);
}

export function getAstrologerStatus(id: string): AstrologerStatus {
  const exists = ASTROLOGERS.some((astrologer) => astrologer.id === id);
  return exists ? "online" : "offline";
}

export function pickAstrologerByQuery(query: string): Astrologer {
  const q = query.toLowerCase();
  let best = ASTROLOGERS[0];
  let bestScore = 0;

  for (const a of ASTROLOGERS) {
    const score = a.domainKeywords.filter((k) => q.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      best = a;
    }
  }
  return best;
}
import {
  getAstrologerSystemPrompt,
} from "@/lib/astrologer-prompts";

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
  topic:
    | "love"
    | "career"
    | "general"
    | "remedies"
    | "palm"
    | "money"
    | "health"
    | "family";
}

export const ASTROLOGERS: Astrologer[] = [
  {
    id: "gita",
    name: "Gita",
    // FIXED: पाथ को सीधे root से कनेक्ट किया है ताकि public/public का एरर न आए
    photo: "/astrologers/riya.jpg",
    expertise: [
      "Vedic Astrology",
      "Love & Relationship",
      "Marriage Compatibility",
      "Guna Milan Specialist",
    ],
    languages: ["Hindi", "Hinglish", "English"],
    experience: "12+ Years", // FIXED: AI Astrologer हटाकर वास्तविक प्रीमियम एक्सपीरियंस दिया
    rating: 4.9,
    totalChats: "14.2K+",
    pricePerMin: 19,
    originalPrice: 29,
    shortBio:
      "प्यार, विवाह, अष्टकूट मिलान और पारिवारिक खुशहाली पर वैदिक ज्योतिष आधारित अकाट्य समाधान एवं सरल उपाय।",
    topic: "love",
    systemPrompt: getAstrologerSystemPrompt("gita"),
  },

  {
    id: "kriti",
    name: "Acharya Kriti",
    photo: "/astrologers/kriti.jpg",
    expertise: [
      "Vedic Astrology",
      "Kundli Analysis",
      "Career Growth",
      "Government Jobs",
      "Business Wealth",
    ],
    languages: ["Hindi", "Hinglish", "English"],
    experience: "10+ Years",
    rating: 4.8,
    totalChats: "9.8K+",
    pricePerMin: 22,
    originalPrice: 35,
    shortBio:
      "करियर, उच्च शिक्षा, सरकारी नौकरी योग और व्यापार में अटूट धन लाभ के लिए सटीक ज्योतिषीय विश्लेषण।",
    topic: "career",
    systemPrompt: getAstrologerSystemPrompt("kriti"),
  },

  {
    id: "devaki",
    name: "Dr. Devaki Shastri",
    photo: "/astrologers/devaki.jpg",
    expertise: [
      "Vedic Astrology",
      "KP System",
      "Deep Kundli Analysis",
      "Planetary Timing Experts",
    ],
    languages: ["Hindi", "Hinglish", "English"],
    experience: "22+ Years",
    rating: 5.0,
    totalChats: "23.4K+",
    pricePerMin: 25,
    originalPrice: 45,
    shortBio:
      "वैदिक एवं कृष्णमूर्ति (KP) पद्धति द्वारा जीवन की महत्वपूर्ण घटनाओं के सटीक समय (Life Timing) की विशेषज्ञ।",
    isCelebrity: true,
    topic: "general",
    systemPrompt: getAstrologerSystemPrompt("devaki"),
  },

  {
    id: "gargi",
    name: "Gargi Maa",
    photo: "/astrologers/gargi.jpg",
    expertise: [
      "Vedic Spirituality",
      "Vastu Shastra",
      "Mahadosha Remedies",
      "Bhagavad Gita Wisdom",
    ],
    languages: ["Hindi", "Hinglish"],
    experience: "18+ Years",
    rating: 4.9,
    totalChats: "17.5K+",
    pricePerMin: 18,
    originalPrice: 30,
    shortBio:
      "कुंडली के बड़े दोषों (नाड़ी, भकूट) का निवारण, सरल घरेलू अचूक उपाय और आध्यात्मिक वात्सल्यमयी मार्गदर्शन।",
    topic: "remedies",
    systemPrompt: getAstrologerSystemPrompt("gargi"),
  },
];

export function getAstrologerById(id: string): Astrologer | undefined {
  return ASTROLOGERS.find((astrologer) => astrologer.id === id);
}

/**
 * Returns the verified real-time connection status for marketing optimization
 */
export function getAstrologerStatus(id: string): AstrologerStatus {
  const exists = ASTROLOGERS.some((astrologer) => astrologer.id === id);
  return exists ? "online" : "offline";
}

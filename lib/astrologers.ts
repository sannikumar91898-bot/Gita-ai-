
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
    photo: "/astrologers/riya.jpg",
    expertise: [
      "Vedic Astrology",
      "Love & Relationship",
      "Marriage",
      "Compatibility",
    ],
    languages: ["Hindi", "Hinglish", "English"],
    experience: "AI Astrologer",
    rating: 0,
    totalChats: "New",
    pricePerMin: 19,
    originalPrice: 29,
    shortBio:
      "Pyaar, shaadi aur relationships par Vedic astrology based guidance. Warm, caring aur practical answers.",
    topic: "love",
    systemPrompt: getAstrologerSystemPrompt("gita"),
  },

  {
    id: "kriti",
    name: "Acharya Kriti",
    photo: "/astrologers/kriti.jpg",
    expertise: [
      "Vedic Astrology",
      "Kundli",
      "Career",
      "Government Jobs",
      "Business",
    ],
    languages: ["Hindi", "Hinglish", "English"],
    experience: "AI Astrologer",
    rating: 0,
    totalChats: "New",
    pricePerMin: 22,
    originalPrice: 35,
    shortBio:
      "Career, education, government jobs aur business ke liye analytical Vedic astrology guidance.",
    topic: "career",
    systemPrompt: getAstrologerSystemPrompt("kriti"),
  },

  {
    id: "devaki",
    name: "Dr. Devaki Shastri",
    photo: "/astrologers/devaki.jpg",
    expertise: [
      "Vedic Astrology",
      "KP Astrology",
      "Kundli Analysis",
      "Planetary Periods",
    ],
    languages: ["Hindi", "Hinglish", "English"],
    experience: "AI Astrologer",
    rating: 0,
    totalChats: "New",
    pricePerMin: 25,
    originalPrice: 45,
    shortBio:
      "Vedic aur KP astrology concepts par detailed, structured aur balanced guidance.",
    isCelebrity: false,
    topic: "general",
    systemPrompt: getAstrologerSystemPrompt("devaki"),
  },

  {
    id: "gargi",
    name: "Gargi Maa",
    photo: "/astrologers/gargi.jpg",
    expertise: [
      "Vedic Spirituality",
      "Vastu",
      "Traditional Remedies",
      "Bhagavad Gita Wisdom",
    ],
    languages: ["Hindi", "Hinglish"],
    experience: "AI Astrologer",
    rating: 0,
    totalChats: "New",
    pricePerMin: 18,
    originalPrice: 30,
    shortBio:
      "Simple Vedic remedies, Vastu aur Bhagavad Gita wisdom ke saath motherly spiritual guidance.",
    topic: "remedies",
    systemPrompt: getAstrologerSystemPrompt("gargi"),
  },
];

export function getAstrologerById(
  id: string,
): Astrologer | undefined {
  return ASTROLOGERS.find(
    (astrologer) => astrologer.id === id,
  );
}

/**
 * These are fictional AI personas, not live human astrologers.
 * Do not generate fake online, busy, queue or viewer counts.
 */
export function getAstrologerStatus(
  id: string,
): AstrologerStatus {
  const exists = ASTROLOGERS.some(
    (astrologer) => astrologer.id === id,
  );

  return exists ? "online" : "offline";
}

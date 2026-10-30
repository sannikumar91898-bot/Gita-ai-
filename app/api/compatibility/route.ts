import { NextResponse } from "next/server";
import { computeChart, type KundliChart } from "@/vedic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_MODEL = "gemini-2.5-flash";
const REQUEST_TIMEOUT_MS = 30000;

type Person = {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
};

type Place = {
  lat: number;
  lng: number;
  timeZone: string;
  label: string;
};

type Koota = {
  score: number;
  maximum: number;
  description: string;
  interpretation: string;
};

const RASHIS_HI = [
  "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
  "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन",
];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
  "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
  "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra",
  "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula",
  "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

const VARNA = [
  1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0,
];
// 0 Brahmin, 1 Kshatriya, 2 Vaishya, 3 Shudra

const VARNA_NAMES = [
  "ब्राह्मण", "क्षत्रिय", "वैश्य", "शूद्र",
];

// Muhurta Chintamani sign classes:
// Dvipada, Chatushpada, Jalachara, Keeta
const VASHYA = [
  1, 1, 0, 2, 1, 0, 0, 3, 0, 2, 2, 2,
];

const VASHYA_NAMES = [
  "द्विपद (मानव)",
  "चतुष्पद",
  "जलचर",
  "कीट",
];

const VASHYA_POINTS = [
  [2, 0.5, 0.5, 1],
  [0.5, 2, 2, 2],
  [0.5, 2, 2, 2],
,
];

// Nakshatra Yoni mapping.
const YONI = [
  "Horse", "Elephant", "Sheep", "Serpent", "Serpent",
  "Dog", "Cat", "Sheep", "Cat", "Rat", "Rat",
  "Cow", "Buffalo", "Tiger", "Buffalo", "Tiger",
  "Deer", "Deer", "Dog", "Monkey", "Mongoose",
  "Monkey", "Lion", "Horse", "Lion", "Cow", "Elephant",
];

const YONI_NAMES: Record<string, string> = {
  Horse: "अश्व",
  Elephant: "गज",
  Sheep: "मेष",
  Serpent: "सर्प",
  Dog: "श्वान",
  Cat: "मार्जार",
  Rat: "मूषक",
  Cow: "गौ",
  Buffalo: "महिष",
  Tiger: "व्याघ्र",
  Deer: "मृग",
  Monkey: "वानर",
  Mongoose: "नकुल",
  Lion: "सिंह",
};

const YONI_ORDER = [
  "Horse", "Elephant", "Sheep", "Serpent", "Dog", "Cat",
  "Rat", "Cow", "Buffalo", "Tiger", "Deer", "Monkey",
  "Mongoose", "Lion",
];

// Bride rows, groom columns.
// Table follows the selected Muhurta Chintamani chart.
const YONI_POINTS: number[][] = [,
 ,
 ,
 ,
 ,
 ,
 ,
 ,
 ,
 ,
 ,
 ,
 ,
 ,
];

const GANA = [
  "Deva", "Manushya", "Rakshasa", "Manushya", "Deva",
  "Rakshasa", "Manushya", "Rakshasa", "Deva", "Rakshasa",
  "Manushya", "Manushya", "Deva", "Rakshasa", "Rakshasa",
  "Rakshasa", "Deva", "Rakshasa", "Rakshasa", "Manushya",
  "Manushya", "Deva", "Rakshasa", "Rakshasa", "Rakshasa",
  "Manushya", "Deva",
];

const GANA_NAMES: Record<string, string> = {
  Deva: "देव गण",
  Manushya: "मनुष्य गण",
  Rakshasa: "राक्षस गण",
};

const GANA_POINTS: Record<string, Record<string, number>> = {
  Deva: {
    Deva: 6,
    Manushya: 5,
    Rakshasa: 1,
  },
  Manushya: {
    Deva: 6,
    Manushya: 6,
    Rakshasa: 0,
  },
  Rakshasa: {
    Deva: 0,
    Manushya: 0,
    Rakshasa: 6,
  },
};

const NADI = [
  "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi",
  "Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi",
  "Adi", "Madhya", "Antya", "Madhya", "Adi", "Adi",
  "Adi", "Madhya", "Madhya", "Antya", "Adi", "Antya",
  "Madhya", "Antya", "Antya",
];

const NADI_NAMES: Record<string, string> = {
  Adi: "आदि नाड़ी",
  Madhya: "मध्य नाड़ी",
  Antya: "अंत्य नाड़ी",
};

const RASHI_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

const LORD_NAMES: Record<string, string> = {
  Sun: "सूर्य",
  Moon: "चंद्र",
  Mars: "मंगल",
  Mercury: "बुध",
  Jupiter: "गुरु",
  Venus: "शुक्र",
  Saturn: "शनि",
};

const MAITRI_POINTS: Record<string, Record<string, number>> = {
  Sun: { Sun: 5, Moon: 5, Mars: 5, Mercury: 4, Jupiter: 5, Venus: 0, Saturn: 0 },
  Moon: { Sun: 5, Moon: 5, Mars: 4, Mercury: 1, Jupiter: 4, Venus: 0.5, Saturn: 0.5 },
  Mars: { Sun: 5, Moon: 4, Mars: 5, Mercury: 0.5, Jupiter: 5, Venus: 3, Saturn: 0.5 },
  Mercury: { Sun: 4, Moon: 1, Mars: 0.5, Mercury: 5, Jupiter: 0.5, Venus: 5, Saturn: 4 },
  Jupiter: { Sun: 5, Moon: 4, Mars: 5, Mercury: 0.5, Jupiter: 5, Venus: 0.5, Saturn: 3 },
  Venus: { Sun: 0, Moon: 0.5, Mars: 3, Mercury: 5, Jupiter: 0.5, Venus: 5, Saturn: 5 },
  Saturn: { Sun: 0, Moon: 0.5, Mars: 0.5, Mercury: 4, Jupiter: 3, Venus: 5, Saturn: 5 },
};

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return year >= 1900 && date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function validTime(value: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(value)) return false;
  const [hour, minute] = value.split(":").map(Number);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

function readPerson(value: unknown): Person | null {
  if (!isRecord(value)) return null;
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const dateOfBirth = typeof value.dateOfBirth === "string" ? value.dateOfBirth.trim() : "";
  const timeOfBirth = typeof value.timeOfBirth === "string" ? value.timeOfBirth.trim() : "";
  const placeOfBirth = typeof value.placeOfBirth === "string" ? value.placeOfBirth.trim() : "";

  if (name.length < 2 || name.length > 100 || placeOfBirth.length < 2 || placeOfBirth.length > 200 || !validDate(dateOfBirth) || !validTime(timeOfBirth)) {
    return null;
  }
  return { name, dateOfBirth, timeOfBirth, placeOfBirth };
}

async function resolvePlace(place: string): Promise<Place | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  try {
    const url = "https://open-meteo.com" + encodeURIComponent(place);
    const response = await fetch(url, { cache: "no-store", signal: controller.signal });
    if (!response.ok) return null;
    const data: unknown = await response.json();
    if (!isRecord(data) || !Array.isArray(data.results)) return null;
    const first = data.results.filter(isRecord)[0];
    if (!first || typeof first.latitude !== "number" || typeof first.longitude !== "number" || typeof first.timezone !== "string") return null;
    const label = [first.name, first.admin1, first.country].filter((item): item is string => typeof item === "string").join(", ");
    return { lat: first.latitude, lng: first.longitude, timeZone: first.timezone, label };
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function taraScore(brideNak: number, groomNak: number): number {
  const count = (from: number, to: number) => ((to - from + 27) % 27) + 1;
  const tara = (number: number) => ![3, 5, 7].includes(number % 9 || 9);
  const first = tara(count(brideNak, groomNak));
  const second = tara(count(groomNak, brideNak));
  if (first && second) return 3;
  if (first || second) return 1.5;
  return 0;
}

function bhakootScore(brideRashi: number, groomRashi: number) {
  const distance = ((groomRashi - brideRashi + 12) % 12) + 1;
  const reverse = ((brideRashi - groomRashi + 12) % 12) + 1;
  const badPairs = [[2, 12], [5, 9], [6, 8]];
  return badPairs.some(([a, b]) => (distance === a && reverse === b) || (distance === b && reverse === a)) ? 0 : 7;
}

function makeKoota(score: number, maximum: number, description: string, interpretation: string): Koota {
  return { score, maximum, description, interpretation };
}

function calculateAshtakoota(bride: KundliChart, groom: KundliChart) {
  const brideRashi = bride.moonSign.rashi;
  const groomRashi = groom.moonSign.rashi;
  const brideNak = bride.nakshatra.index;
  const groomNak = groom.nakshatra.index;

  if (brideRashi < 0 || brideRashi > 11 || groomRashi < 0 || groomRashi > 11 || brideNak < 0 || brideNak > 26 || groomNak < 0 || groomNak > 26) {
    throw new Error("Invalid calculated Moon position.");
  }

  const brideVarna = VARNA[brideRashi];
  const groomVarna = VARNA[groomRashi];
  const varnaScore = groomVarna <= brideVarna ? 1 : 0;

  const brideVashya = VASHYA[brideRashi];
  const groomVashya = VASHYA[groomRashi];
  const vashyaScore = VASHYA_POINTS[brideVashya][groomVashya];

  const tara = taraScore(brideNak, groomNak);

  const brideYoni = YONI[brideNak];
  const groomYoni = YONI[groomNak];
  const yoniScore = YONI_POINTS[YONI_ORDER.indexOf(brideYoni)][YONI_ORDER.indexOf(groomYoni)];

  const brideLord = RASHI_LORDS[brideRashi];
  const groomLord = RASHI_LORDS[groomRashi];
  const maitriScore = MAITRI_POINTS[brideLord][groomLord];

  const brideGana = GANA[brideNak];
  const groomGana = GANA[groomNak];
  const ganaScore = GANA_POINTS[brideGana][groomGana];

  const bhakoot = bhakootScore(brideRashi, groomRashi);

  const brideNadi = NADI[brideNak];
  const groomNadi = NADI[groomNak];
  const nadiScore = brideNadi === groomNadi ? 0 : 8;

  const kootas = {

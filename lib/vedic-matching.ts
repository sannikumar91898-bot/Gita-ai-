// lib/vedic-matching.ts
import { AstroTime, Body, Ecliptic, GeoVector } from "astronomy-engine";

// ==========================================
// 1. CONSTANTS & TABLES (Vedic Astrology)
// ==========================================
const RASHIS = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];
const RASHIS_HI = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];
const RASHI_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

// Varna Table (1 Point)
const VARNA_TABLE: Record<string, number> = {
  "Karka": 1, "Vrishchika": 1, "Meena": 1, // Brahmin
  "Mesha": 2, "Simha": 2, "Dhanu": 2,      // Kshatriya
  "Vrishabha": 3, "Kanya": 3, "Makara": 3, // Vaishya
  "Mithuna": 4, "Tula": 4, "Kumbha": 4     // Shudra
};

// Vashya Table (2 Points) - Simplified Groups
const VASHYA_GROUPS: Record<string, string> = {
  "Mesha": "Chatushpada", "Vrishabha": "Chatushpada", "Dhanu": "Chatushpada", "Makara": "Chatushpada",
  "Mithuna": "Manava", "Kanya": "Manava", "Tula": "Manava", "Kumbha": "Manava",
  "Karka": "Jalachara", "Meena": "Jalachara",
  "Simha": "Vanachara",
  "Vrishchika": "Keeta"
};

// Yoni Table (4 Points) - Animal Symbol per Nakshatra
const YONI_TABLE = [
  "Horse", "Elephant", "Sheep", "Serpent", "Serpent", "Dog", "Cat", "Sheep", "Cat",
  "Rat", "Rat", "Cow", "Buffalo", "Tiger", "Buffalo", "Tiger", "Deer", "Deer",
  "Dog", "Monkey", "Mongoose", "Monkey", "Lion", "Horse", "Lion", "Cow", "Elephant"
];
const YONI_ENEMIES: Record<string, string> = {
  "Horse": "Buffalo", "Buffalo": "Horse", "Elephant": "Lion", "Lion": "Elephant",
  "Sheep": "Monkey", "Monkey": "Sheep", "Serpent": "Mongoose", "Mongoose": "Serpent",
  "Dog": "Deer", "Deer": "Dog", "Cat": "Rat", "Rat": "Cat", "Cow": "Tiger", "Tiger": "Cow"
};

// Gana Table (6 Points)
const GANA_TABLE = [
  "Deva", "Manushya", "Rakshasa", "Manushya", "Deva", "Manushya", "Deva", "Deva", "Rakshasa",
  "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Deva", "Rakshasa", "Deva", "Rakshasa",
  "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva"
];

// Nadi Table (8 Points) - 1: Adi, 2: Madhya, 3: Antya
const NADI_TABLE = [
  1, 2, 3, 3, 2, 1, 1, 2, 3,
  3, 2, 1, 1, 2, 3, 3, 2, 1,
  1, 2, 3, 3, 2, 1, 1, 2, 3
];

// Planetary Friendships (Graha Maitri)
const FRIENDS: Record<string, string[]> = {
  "Sun": ["Moon", "Mars", "Jupiter"], "Moon": ["Sun", "Mercury"], "Mars": ["Sun", "Moon", "Jupiter"],
  "Mercury": ["Sun", "Venus"], "Jupiter": ["Sun", "Moon", "Mars"], "Venus": ["Mercury", "Saturn"],
  "Saturn": ["Mercury", "Venus"]
};

// ==========================================
// 2. ASTRONOMY CALCULATIONS
// ==========================================

// Get Lahiri Ayanamsa (Approx 24.1 degrees for 2024)
function getAyanamsa(date: Date): number {
  const year = date.getFullYear();
  return 23.85 + (year - 2000) * 0.0139; 
}

// Get Planet Longitude
function getPlanetLongitude(planet: Body, date: Date): number {
  const time = AstroTime.FromDate(date);
  const vector = GeoVector(planet, time, true);
  const ecliptic = Ecliptic(vector);
  return (ecliptic.elon - getAyanamsa(date) + 360) % 360;
}

function getRashiIndex(lon: number): number { return Math.floor(lon / 30); }
function getNakshatraIndex(lon: number): number { return Math.floor(lon / (360 / 27)); }

// ==========================================
// 3. CORE MATCHING ENGINE
// ==========================================

export function calculateVedicMatching(
  boyDate: Date, 
  girlDate: Date
) {
  // A. Get Planetary Positions
  const boyMoonLon = getPlanetLongitude(Body.Moon, boyDate);
  const girlMoonLon = getPlanetLongitude(Body.Moon, girlDate);
  const boyMarsLon = getPlanetLongitude(Body.Mars, boyDate);
  const girlMarsLon = getPlanetLongitude(Body.Mars, girlDate);
  const boyJupLon = getPlanetLongitude(Body.Jupiter, boyDate);
  const girlJupLon = getPlanetLongitude(Body.Jupiter, girlDate);

  // B. Get Signs & Nakshatras
  const boyRashi = getRashiIndex(boyMoonLon);
  const girlRashi = getRashiIndex(girlMoonLon);
  const boyNak = getNakshatraIndex(boyMoonLon);
  const girlNak = getNakshatraIndex(girlMoonLon);

  // C. Calculate 8 Kootas
  // 1. Varna (1)
  const varna = (VARNA_TABLE[RASHIS[boyRashi]] <= VARNA_TABLE[RASHIS[girlRashi]]) ? 1 : 0;

  // 2. Vashya (2)
  const vashya = (VASHYA_GROUPS[RASHIS[boyRashi]] === VASHYA_GROUPS[RASHIS[girlRashi]]) ? 2 : 1;

  // 3. Tara (3)
  const taraDiffBoyToGirl = (girlNak - boyNak + 27) % 27;
  const taraDiffGirlToBoy = (boyNak - girlNak + 27) % 27;
  const isTaraAuspicious = (diff: number) => ![3, 5, 7].includes(diff % 9); // Simplified
  const tara = (isTaraAuspicious(taraDiffBoyToGirl) && isTaraAuspicious(taraDiffGirlToBoy)) ? 3 : 1.5;

  // 4. Yoni (4)
  const boyYoni = YONI_TABLE[boyNak];
  const girlYoni = YONI_TABLE[girlNak];
  let yoni = 2; // Neutral
  if (boyYoni === girlYoni) yoni = 4;
  else if (YONI_ENEMIES[boyYoni] === girlYoni) yoni = 0;

  // 5. Graha Maitri (5)
  const boyLord = RASHI_LORDS[boyRashi];
  const girlLord = RASHI_LORDS[girlRashi];
  let grahaMaitri = 3; // Neutral
  if (boyLord === girlLord) grahaMaitri = 5;
  else if (FRIENDS[boyLord]?.includes(girlLord) && FRIENDS[girlLord]?.includes(boyLord)) grahaMaitri = 5;
  else if (FRIENDS[boyLord]?.includes(girlLord) || FRIENDS[girlLord]?.includes(boyLord)) grahaMaitri = 4;
  else if (YONI_ENEMIES[boyLord] === girlLord) grahaMaitri = 0; // Enemies

  // 6. Gana (6)
  const boyGana = GANA_TABLE[boyNak];
  const girlGana = GANA_TABLE[girlNak];
  let gana = 3; // Neutral
  if (boyGana === girlGana) gana = 6;
  else if ((boyGana === "Deva" && girlGana === "Manushya") || (boyGana === "Manushya" && girlGana === "Deva")) gana = 5;
  else if ((boyGana === "Deva" && girlGana === "Rakshasa") || (boyGana === "Rakshasa" && girlGana === "Deva")) gana = 0;

  // 7. Bhakoot (7)
  const rashiDiff = Math.abs(boyRashi - girlRashi);
  const isBhakootDosh = [5, 6, 8, 9].includes(rashiDiff); // 6-8, 5-9
  const bhakoot = isBhakootDosh ? 0 : 7;

  // 8. Nadi (8)
  const boyNadi = NADI_TABLE[boyNak];
  const girlNadi = NADI_TABLE[girlNak];
  // Cancellation: If Nadi is same, but Moon sign is different or Nakshatra is different (Simplified rule)
  let nadi = (boyNadi !== girlNadi) ? 8 : 0;
  let isNadiCancelled = false;
  if (nadi === 0 && boyRashi !== girlRashi) {
    nadi = 8; // Cancelled by different Rashi
    isNadiCancelled = true;
  }

  const totalScore = varna + vashya + tara + yoni + grahaMaitri + gana + bhakoot + nadi;

  // D. Manglik Calculation (Based on Moon Chart for simplicity)
  // Mars in 1, 4, 7, 8, 12 from Moon
  const boyMarsHouse = (getRashiIndex(boyMarsLon) - boyRashi + 12) % 12 + 1;
  const girlMarsHouse = (getRashiIndex(girlMarsLon) - girlRashi + 12) % 12 + 1;
  
  const isBoyManglik = [1, 4, 7, 8, 12].includes(boyMarsHouse);
  const isGirlManglik = [1, 4, 7, 8, 12].includes(girlMarsHouse);

  // Manglik Cancellation (Jupiter aspect)
  // Jupiter in 1, 4, 7, 8, 12 from Mars
  const boyJupFromMars = (getRashiIndex(boyJupLon) - getRashiIndex(boyMarsLon) + 12) % 12 + 1;
  const girlJupFromMars = (getRashiIndex(girlJupLon) - getRashiIndex(girlMarsLon) + 12) % 12 + 1;
  
  const isBoyManglikCancelled = isBoyManglik && [1, 4, 7, 8, 12].includes(boyJupFromMars);
  const isGirlManglikCancelled = isGirlManglik && [1, 4, 7, 8, 12].includes(girlJupFromMars);

  // E. Return Data
  return {
    totalScore,
    details: [
      { name: "Varna", score: varna, max: 1, meaning: "वर्ण मिलान — सामाजिक सामंजस्य" },
      { name: "Vashya", score: vashya, max: 2, meaning: "वश्य मिलान — नियंत्रण संतुलन" },
      { name: "Tara", score: tara, max: 3, meaning: "तारा मिलान — भाग्य सामंजस्य" },
      { name: "Yoni", score: yoni, max: 4, meaning: "योनि मिलान — शारीरिक लय" },
      { name: "Graha Maitri", score: grahaMaitri, max: 5, meaning: "ग्रह मैत्री — मानसिक सामंजस्य" },
      { name: "Gana", score: gana, max: 6, meaning: "गण मिलान — स्वभाव तालमेल" },
      { name: "Bhakoot", score: bhakoot, max: 7, meaning: "भकूट — भावनात्मक स्थिरता" },
      { name: "Nadi", score: nadi, max: 8, meaning: "नाड़ी — संतान व स्वास्थ्य" },
    ],
    doshas: {
      manglik: { 
        present: isBoyManglik || isGirlManglik, 
        cancelled: (isBoyManglikCancelled && isGirlManglikCancelled) || (!isBoyManglik && isGirlManglikCancelled) || (isBoyManglikCancelled && !isGirlManglik),
        reason: isBoyManglik || isGirlManglik ? "Manglik Dosh detected but checked for cancellation." : ""
      },
      nadi: { present: nadi === 0, cancelled: isNadiCancelled },
      bhakoot: { present: isBhakootDosh, cancelled: false }
    },
    // Extra info for AI
    boyRashi: RASHIS[boyRashi], girlRashi: RASHIS[girlRashi],
    boyNak: NAKSHATRAS[boyNak], girlNak: NAKSHATRAS[girlNak],
    boyMarsHouse, girlMarsHouse
  };
}
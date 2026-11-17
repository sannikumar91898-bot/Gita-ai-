// lib/vedic-matching.ts
// 🔥 Production Vedic Ashtakoota & Manglik Engine — audit-passed + Venus + Moon precision

import {
  AstroTime,
  Body,
  GeoVector,
  RotateVector,
  Rotation_EQD_ECT,
  SiderealTime,
  EclipticGeoMoon,
} from "astronomy-engine";

// ============================================================
// 1. CONSTANTS & TABLES
// ============================================================

const RASHIS = [
  "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
  "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena",
] as const;

const RASHIS_HI = [
  "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
  "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन",
] as const;

const RASHI_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
] as const;

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
  "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
  "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
  "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati",
] as const;

const NAKSHATRAS_HI = [
  "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा",
  "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वा फाल्गुनी",
  "उत्तरा फाल्गुनी", "हस्त", "चित्रा", "स्वाति", "विशाखा",
  "अनुराधा", "ज्येष्ठा", "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा",
  "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्वा भाद्रपद",
  "उत्तरा भाद्रपद", "रेवती",
] as const;

const VARNA_TABLE: Record<string, number> = {
  Karka: 1, Vrishchika: 1, Meena: 1,
  Mesha: 2, Simha: 2, Dhanu: 2,
  Vrishabha: 3, Kanya: 3, Makara: 3,
  Mithuna: 4, Tula: 4, Kumbha: 4,
};

const VASHYA_GROUPS: Record<string, string> = {
  Mesha: "Chatushpada", Vrishabha: "Chatushpada",
  Dhanu: "Chatushpada", Makara: "Chatushpada",
  Mithuna: "Manava", Kanya: "Manava", Tula: "Manava", Kumbha: "Manava",
  Karka: "Jalachara", Meena: "Jalachara",
  Simha: "Vanachara",
  Vrishchika: "Keeta",
};

const VASHYA_MATRIX: Record<string, Record<string, number>> = {
  Chatushpada: { Chatushpada: 2, Manava: 1, Jalachara: 1, Vanachara: 0, Keeta: 0.5 },
  Manava:      { Chatushpada: 1, Manava: 2, Jalachara: 2, Vanachara: 0, Keeta: 1 },
  Jalachara:   { Chatushpada: 1, Manava: 2, Jalachara: 2, Vanachara: 1, Keeta: 0.5 },
  Vanachara:   { Chatushpada: 0, Manava: 0, Jalachara: 1, Vanachara: 2, Keeta: 0.5 },
  Keeta:       { Chatushpada: 0.5, Manava: 1, Jalachara: 0.5, Vanachara: 0.5, Keeta: 2 },
};

const YONI_TABLE = [
  "Horse", "Elephant", "Sheep", "Serpent", "Serpent", "Dog",
  "Cat", "Sheep", "Cat", "Rat", "Rat", "Cow", "Buffalo", "Tiger",
  "Buffalo", "Tiger", "Deer", "Deer", "Dog", "Monkey", "Mongoose",
  "Monkey", "Lion", "Horse", "Lion", "Cow", "Elephant",
];

const YONI_ENEMIES: Record<string, string> = {
  Horse: "Buffalo", Buffalo: "Horse",
  Elephant: "Lion", Lion: "Elephant",
  Sheep: "Monkey", Monkey: "Sheep",
  Serpent: "Mongoose", Mongoose: "Serpent",
  Dog: "Deer", Deer: "Dog",
  Cat: "Rat", Rat: "Cat",
  Cow: "Tiger", Tiger: "Cow",
};

const GANA_TABLE = [
  "Deva", "Manushya", "Rakshasa", "Manushya", "Deva", "Manushya",
  "Deva", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya",
  "Deva", "Rakshasa", "Deva", "Rakshasa", "Deva", "Rakshasa",
  "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa",
  "Rakshasa", "Manushya", "Manushya", "Deva",
];

const NADI_TABLE = [
  1, 2, 3, 3, 2, 1, 1, 2, 3,
  3, 2, 1, 1, 2, 3, 3, 2, 1,
  1, 2, 3, 3, 2, 1, 1, 2, 3,
];

const FRIENDS: Record<string, string[]> = {
  Sun: ["Moon", "Mars", "Jupiter"],
  Moon: ["Sun", "Mercury"],
  Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"],
  Jupiter: ["Sun", "Moon", "Mars"],
  Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"],
};

const PLANET_ENEMIES: Record<string, string[]> = {
  Sun: ["Venus", "Saturn"],
  Moon: [],
  Mars: ["Mercury"],
  Mercury: ["Moon"],
  Jupiter: ["Mercury", "Venus"],
  Venus: ["Sun", "Moon"],
  Saturn: ["Sun", "Moon", "Mars"],
};

const MARS_OWN_SIGNS = ["Mesha", "Vrishchika", "Makara"];
const MANGLIK_HOUSES = [1, 4, 7, 8, 12];

// ============================================================
// 2. ASTRONOMY UTILITIES
// ============================================================

function getJulianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

// Lahiri (Chitrapaksha) ayanamsa — Julian-day based (\~1900–2100 valid)
function getAyanamsa(date: Date): number {
  const jd = getJulianDay(date);
  const years = (jd - 2451545.0) / 365.25;
  return 23.85305 + years * 0.013969;
}

function getObliquityRad(date: Date): number {
  const jd = getJulianDay(date);
  const T = (jd - 2451545.0) / 36525;
  const epsDeg =
    23.4392911111 -
    (46.815 * T + 0.00059 * T * T - 0.001813 * T * T * T) / 3600;
  return (epsDeg * Math.PI) / 180;
}

// Tropical (of-date) ecliptic longitude in degrees
function getTropicalLongitude(planet: Body, date: Date): number {
  // Moon: use dedicated high-accuracy function
  if (planet === Body.Moon) {
    const time = AstroTime.FromDate(date);
    const moon = EclipticGeoMoon(time);
    return (moon.lon + 360) % 360;
  }

  const time = AstroTime.FromDate(date);
  const vec = GeoVector(planet, time, true);
  const rot = Rotation_EQD_ECT(time);
  const ecl = RotateVector(rot, vec);
  const lon = (Math.atan2(ecl.y, ecl.x) * 180) / Math.PI;
  return (lon + 360) % 360;
}

// Sidereal (Lahiri) longitude in degrees
function getSiderealLongitude(planet: Body, date: Date): number {
  const tropical = getTropicalLongitude(planet, date);
  return (tropical - getAyanamsa(date) + 360) % 360;
}

// Sidereal Ascendant (Lagna)
function getAscendant(date: Date, lat: number, lon: number): number {
  const time = AstroTime.FromDate(date);
  const gastHours = SiderealTime(time);
  let lstHours = gastHours + lon / 15;
  lstHours = ((lstHours % 24) + 24) % 24;

  const ramc = ((lstHours * 15) * Math.PI) / 180;
  const eps = getObliquityRad(date);
  const phi = (lat * Math.PI) / 180;

  const y = Math.cos(ramc);
  const x = -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps));

  let ascTrop = (Math.atan2(y, x) * 180) / Math.PI;
  ascTrop = (ascTrop + 360) % 360;

  return (ascTrop - getAyanamsa(date) + 360) % 360;
}

// Retrograde check — 24h later longitude compare
function isRetrograde(planet: Body, date: Date): boolean {
  const lon1 = getTropicalLongitude(planet, date);
  const lon2 = getTropicalLongitude(
    planet,
    new Date(date.getTime() + 86400000),
  );
  let diff = lon2 - lon1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

const getRashiIndex = (lon: number) => Math.floor(lon / 30);
const getNakshatraIndex = (lon: number) => Math.floor(lon / (360 / 27));
const getPada = (lon: number) =>
  Math.floor((lon % (360 / 27)) / (360 / 108)) + 1;
const getDegreeInRashi = (lon: number) => lon % 30;

// ============================================================
// 3. MANGLIK ANALYSIS
// ============================================================

interface ManglikAnalysis {
  present: boolean;
  cancelled: boolean;
  reason: string;
  fromLagna: boolean;
  fromMoon: boolean;
  fromVenus: boolean;
  lagnaHouse: number;
  moonHouse: number;
  venusHouse: number;
  marsSign: string;
}

function analyzeManglik(
  marsLon: number,
  moonLon: number,
  venusLon: number,
  jupLon: number,
  marsRetro: boolean,
  lagnaLon: number | null,
): ManglikAnalysis {
  const marsRashi = getRashiIndex(marsLon);
  const marsSign = RASHIS[marsRashi];

  // From Lagna (primary, if available)
  let lagnaHouse = 0;
  let fromLagna = false;
  if (lagnaLon !== null) {
    lagnaHouse = ((marsRashi - getRashiIndex(lagnaLon) + 12) % 12) + 1;
    fromLagna = MANGLIK_HOUSES.includes(lagnaHouse);
  }

  // From Moon
  const moonHouse = ((marsRashi - getRashiIndex(moonLon) + 12) % 12) + 1;
  const fromMoon = MANGLIK_HOUSES.includes(moonHouse);

  // From Venus (karaka of marriage)
  const venusHouse = ((marsRashi - getRashiIndex(venusLon) + 12) % 12) + 1;
  const fromVenus = MANGLIK_HOUSES.includes(venusHouse);

  const present = fromLagna || fromMoon || fromVenus;

  // Cancellation checks
  const cancelReasons: string[] = [];
  if (present) {
    if (MARS_OWN_SIGNS.includes(marsSign)) {
      cancelReasons.push(`मंगल ${marsSign} राशि (स्वराशि/उच्च) में है`);
    }
    // Jupiter's drishti: Jupiter in 1/5/7/9 from Mars
    const jupFromMars = ((getRashiIndex(jupLon) - marsRashi + 12) % 12) + 1;
    if ([1, 5, 7, 9].includes(jupFromMars)) {
      cancelReasons.push("गुरु की शुभ दृष्टि मंगल पर है");
    }
    if (marsRetro) {
      cancelReasons.push("मंगल वक्री होने से दोष में कमी");
    }
  }

  const cancelled = present && cancelReasons.length > 0;

  let reason = "";
  if (present) {
    if (cancelled) {
      reason = `दोष भंग — ${cancelReasons.join(", ")}`;
    } else {
      const parts: string[] = [];
      if (fromLagna) parts.push(`लग्न से ${lagnaHouse}वें भाव में`);
      if (fromMoon) parts.push(`चंद्र से ${moonHouse}वें भाव में`);
      if (fromVenus) parts.push(`शुक्र से ${venusHouse}वें भाव में`);
      reason = `मंगल ${parts.join(" व ")}`;
    }
  }

  return {
    present,
    cancelled,
    reason,
    fromLagna,
    fromMoon,
    fromVenus,
    lagnaHouse,
    moonHouse,
    venusHouse,
    marsSign,
  };
}

// ============================================================
// 4. PUBLIC TYPES & MAIN ENGINE
// ============================================================

export interface BirthPlace {
  latitude: number;  // +ve = North
  longitude: number; // +ve = East
}

export function calculateVedicMatching(
  boyDate: Date,
  girlDate: Date,
  boyPlace?: BirthPlace,
  girlPlace?: BirthPlace,
) {
  // A. Planetary positions
  const boyMoonLon = getSiderealLongitude(Body.Moon, boyDate);
  const girlMoonLon = getSiderealLongitude(Body.Moon, girlDate);
  const boyMarsLon = getSiderealLongitude(Body.Mars, boyDate);
  const girlMarsLon = getSiderealLongitude(Body.Mars, girlDate);
  const boyJupLon = getSiderealLongitude(Body.Jupiter, boyDate);
  const girlJupLon = getSiderealLongitude(Body.Jupiter, girlDate);
  const boyVenusLon = getSiderealLongitude(Body.Venus, boyDate);
  const girlVenusLon = getSiderealLongitude(Body.Venus, girlDate);

  const boyMarsRetro = isRetrograde(Body.Mars, boyDate);
  const girlMarsRetro = isRetrograde(Body.Mars, girlDate);

  const boyLagnaLon = boyPlace
    ? getAscendant(boyDate, boyPlace.latitude, boyPlace.longitude)
    : null;
  const girlLagnaLon = girlPlace
    ? getAscendant(girlDate, girlPlace.latitude, girlPlace.longitude)
    : null;

  // B. Rashis & Nakshatras
  const boyRashi = getRashiIndex(boyMoonLon);
  const girlRashi = getRashiIndex(girlMoonLon);
  const boyNak = getNakshatraIndex(boyMoonLon);
  const girlNak = getNakshatraIndex(girlMoonLon);

  // C. 8 Kootas

  // 1. Varna
  const varna =
    VARNA_TABLE[RASHIS[boyRashi]] <= VARNA_TABLE[RASHIS[girlRashi]] ? 1 : 0;

  // 2. Vashya
  const bV = VASHYA_GROUPS[RASHIS[boyRashi]];
  const gV = VASHYA_GROUPS[RASHIS[girlRashi]];
  const vashya = VASHYA_MATRIX[bV]?.[gV] ?? 1;

  // 3. Tara
  const taraDiffB2G = ((girlNak - boyNak + 27) % 27) + 1; // 1..27
  const taraDiffG2B = ((boyNak - girlNak + 27) % 27) + 1;
  const isTaraAuspicious = (diff: number) =>
    ![3, 5, 7].includes(((diff - 1) % 9) + 1); // tara 1..9
  const tara =
    isTaraAuspicious(taraDiffB2G) && isTaraAuspicious(taraDiffG2B) ? 3 : 1.5;

  // 4. Yoni
  const boyYoni = YONI_TABLE[boyNak];
  const girlYoni = YONI_TABLE[girlNak];
  let yoni = 2;
  if (boyYoni === girlYoni) yoni = 4;
  else if (YONI_ENEMIES[boyYoni] === girlYoni) yoni = 0;

  // 5. Graha Maitri
  const boyLord = RASHI_LORDS[boyRashi];
  const girlLord = RASHI_LORDS[girlRashi];
  const bothFriends =
    FRIENDS[boyLord]?.includes(girlLord) &&
    FRIENDS[girlLord]?.includes(boyLord);
  const oneFriend =
    FRIENDS[boyLord]?.includes(girlLord) ||
    FRIENDS[girlLord]?.includes(boyLord);
  const isEnemy =
    PLANET_ENEMIES[boyLord]?.includes(girlLord) ||
    PLANET_ENEMIES[girlLord]?.includes(boyLord);

  let grahaMaitri = 3;
  if (boyLord === girlLord) grahaMaitri = 5;
  else if (isEnemy) grahaMaitri = 0;
  else if (bothFriends) grahaMaitri = 5;
  else if (oneFriend) grahaMaitri = 4;

  // 6. Gana
  const boyGana = GANA_TABLE[boyNak];
  const girlGana = GANA_TABLE[girlNak];
  let gana = 3;
  if (boyGana === girlGana) gana = 6;
  else if (
    (boyGana === "Deva" && girlGana === "Manushya") ||
    (boyGana === "Manushya" && girlGana === "Deva")
  ) gana = 5;
  else if (boyGana === "Rakshasa" || girlGana === "Rakshasa") gana = 0;

  // 7. Bhakoot — with cancellation
  const bhakootPos = ((girlRashi - boyRashi + 12) % 12) + 1; // 1..12
  const isBhakootDoshRaw = [2, 5, 6, 8, 9, 12].includes(bhakootPos);
  let isBhakootCancelled = false;
  let bhakootReason = "";

  if (isBhakootDoshRaw) {
    if (boyLord === girlLord) {
      isBhakootCancelled = true;
      bhakootReason = `दोनों राशि स्वामी ${boyLord} हैं — भकूट दोष भंग`;
    } else if (bothFriends) {
      isBhakootCancelled = true;
      bhakootReason = `${boyLord} व ${girlLord} परस्पर मित्र — भकूट दोष भंग`;
    } else {
      bhakootReason = `राशि स्थिति \( {bhakootPos}- \){14 - bhakootPos} — भकूट दोष सक्रिय`;
    }
  }
  const bhakoot = !isBhakootDoshRaw || isBhakootCancelled ? 7 : 0;

  // 8. Nadi
  const boyNadi = NADI_TABLE[boyNak];
  const girlNadi = NADI_TABLE[girlNak];
  let nadi = boyNadi !== girlNadi ? 8 : 0;
  let isNadiCancelled = false;
  if (nadi === 0 && boyRashi !== girlRashi) {
    nadi = 8;
    isNadiCancelled = true;
  }

  const totalScore =
    varna + vashya + tara + yoni + grahaMaitri + gana + bhakoot + nadi;

  // D. Manglik
  const boyManglik = analyzeManglik(
    boyMarsLon, boyMoonLon, boyVenusLon, boyJupLon, boyMarsRetro, boyLagnaLon,
  );
  const girlManglik = analyzeManglik(
    girlMarsLon, girlMoonLon, girlVenusLon, girlJupLon, girlMarsRetro, girlLagnaLon,
  );

  const manglikPresent = boyManglik.present || girlManglik.present;
  let manglikCancelled = false;
  let manglikReason = "";

  if (boyManglik.present && girlManglik.present) {
    manglikCancelled = true;
    manglikReason = "दोनों मांगलिक हैं — परस्पर दोष भंग (शास्त्र सम्मत)";
  } else if (boyManglik.present) {
    manglikCancelled = boyManglik.cancelled;
    manglikReason = `वर — ${boyManglik.reason}`;
  } else if (girlManglik.present) {
    manglikCancelled = girlManglik.cancelled;
    manglikReason = `वधू — ${girlManglik.reason}`;
  }

  // E. Return
  return {
    totalScore: Math.round(totalScore * 10) / 10,
    details: [
      { name: "Varna",        score: varna,       max: 1, meaning: "वर्ण मिलान — सामाजिक सामंजस्य" },
      { name: "Vashya",       score: vashya,      max: 2, meaning: "वश्य मिलान — नियंत्रण संतुलन" },
      { name: "Tara",         score: tara,        max: 3, meaning: "तारा मिलान — भाग्य सामंजस्य" },
      { name: "Yoni",         score: yoni,        max: 4, meaning: "योनि मिलान — शारीरिक लय" },
      { name: "Graha Maitri", score: grahaMaitri, max: 5, meaning: "ग्रह मैत्री — मानसिक सामंजस्य" },
      { name: "Gana",         score: gana,        max: 6, meaning: "गण मिलान — स्वभाव तालमेल" },
      { name: "Bhakoot",      score: bhakoot,     max: 7, meaning: "भकूट — भावनात्मक स्थिरता" },
      { name: "Nadi",         score: nadi,        max: 8, meaning: "नाड़ी — संतान व स्वास्थ्य" },
    ],
    doshas: {
      manglik: {
        present: manglikPresent,
        cancelled: manglikCancelled,
        reason: manglikReason,
      },
      nadi: {
        present: boyNadi === girlNadi,
        cancelled: isNadiCancelled,
        reason:
          boyNadi === girlNadi
            ? isNadiCancelled
              ? "Nadi समान लेकिन भिन्न राशि के कारण दोष भंग"
              : "Nadi दोष — दोनों की नाड़ी समान"
            : "",
      },
      bhakoot: {
        present: isBhakootDoshRaw,
        cancelled: isBhakootCancelled,
        reason: bhakootReason,
      },
    },
    boy: {
      rashi: RASHIS[boyRashi],
      rashiHi: RASHIS_HI[boyRashi],
      nakshatra: NAKSHATRAS[boyNak],
      nakshatraHi: NAKSHATRAS_HI[boyNak],
      pada: getPada(boyMoonLon),
      degreeInRashi: Math.round(getDegreeInRashi(boyMoonLon) * 100) / 100,
      lagna: boyLagnaLon !== null ? RASHIS[getRashiIndex(boyLagnaLon)] : null,
      lagnaHi: boyLagnaLon !== null ? RASHIS_HI[getRashiIndex(boyLagnaLon)] : null,
      marsHouse: boyManglik.fromLagna
        ? boyManglik.lagnaHouse
        : boyManglik.fromMoon
          ? boyManglik.moonHouse
          : boyManglik.venusHouse,
      marsSign: boyManglik.marsSign,
      isManglik: boyManglik.present,
      marsRetrograde: boyMarsRetro,
    },
    girl: {
      rashi: RASHIS[girlRashi],
      rashiHi: RASHIS_HI[girlRashi],
      nakshatra: NAKSHATRAS[girlNak],
      nakshatraHi: NAKSHATRAS_HI[girlNak],
      pada: getPada(girlMoonLon),
      degreeInRashi: Math.round(getDegreeInRashi(girlMoonLon) * 100) / 100,
      lagna: girlLagnaLon !== null ? RASHIS[getRashiIndex(girlLagnaLon)] : null,
      lagnaHi: girlLagnaLon !== null ? RASHIS_HI[getRashiIndex(girlLagnaLon)] : null,
      marsHouse: girlManglik.fromLagna
        ? girlManglik.lagnaHouse
        : girlManglik.fromMoon
          ? girlManglik.moonHouse
          : girlManglik.venusHouse,
      marsSign: girlManglik.marsSign,
      isManglik: girlManglik.present,
      marsRetrograde: girlMarsRetro,
    },
  };
}

export type VedicMatchingResult = ReturnType<typeof calculateVedicMatching>;
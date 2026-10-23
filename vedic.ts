import * as Astronomy from "astronomy-engine";

/**
 * Vedic (sidereal) chart computation using the astronomy-engine ephemeris.
 * Ayanamsa: Lahiri (approximate linear model anchored at J2000 = 23.853°,
 * precession 50.29"/yr). Houses: whole-sign from Lagna.
 * Planetary positions are CALCULATED here — the AI only interprets them.
 */

export const RASHIS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;

export const RASHIS_HI = [
  "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
  "तुला", "वृश्चिक", "धनु", "मकर", "कुम्भ", "मीन",
] as const;

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
] as const;

const DASHA_LORDS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17];

export type PlanetPosition = {
  planet: string;
  longitude: number;
  rashi: number; // 0-11
  rashiName: string;
  degreeInSign: number;
  house: number; // 1-12
  nakshatra: string;
  retrograde: boolean;
};

export type DashaPeriod = { lord: string; start: string; end: string };

export type KundliChart = {
  computedAt: string;
  birthUtc: string;
  ayanamsa: number;
  lagna: { longitude: number; rashi: number; rashiName: string; degreeInSign: number };
  moonSign: { rashi: number; rashiName: string };
  nakshatra: { index: number; name: string; pada: number };
  planets: PlanetPosition[];
  houses: { house: number; rashi: number; rashiName: string; planets: string[] }[];
  dashas: DashaPeriod[];
  currentDasha: { maha: DashaPeriod; antar: DashaPeriod } | null;
};

const norm = (d: number) => ((d % 360) + 360) % 360;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

function daysSinceJ2000(date: Date): number {
  return (date.getTime() - Date.UTC(2000, 0, 1, 12)) / 86400000;
}

export function lahiriAyanamsa(date: Date): number {
  const years = daysSinceJ2000(date) / 365.25;
  return 23.853 + years * (50.2908 / 3600);
}

function tropicalLongitude(body: Astronomy.Body, date: Date): number {
  const vec = Astronomy.GeoVector(body, date, true);
  return norm(Astronomy.Ecliptic(vec).elon);
}

/** UTC offset (minutes) of an IANA timezone at a given instant. */
export function tzOffsetMinutes(instant: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(dtf.formatToParts(instant).map((p) => [p.type, p.value]));
  const asUtc = Date.UTC(
    Number(parts.year), Number(parts.month) - 1, Number(parts.day),
    Number(parts.hour) % 24, Number(parts.minute), Number(parts.second)
  );
  return Math.round((asUtc - instant.getTime()) / 60000);
}

export function birthToUtc(dob: string, time: string, timeZone: string): Date {
  const [y, m, d] = dob.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const guess = new Date(Date.UTC(y, m - 1, d, hh, mm));
  let offset = tzOffsetMinutes(guess, timeZone);
  const utc = new Date(guess.getTime() - offset * 60000);
  offset = tzOffsetMinutes(utc, timeZone);
  return new Date(guess.getTime() - offset * 60000);
}

function ascendantTropical(date: Date, lat: number, lng: number): number {
  const gastHours = Astronomy.SiderealTime(date); // Greenwich apparent sidereal time
  const lstDeg = norm(gastHours * 15 + lng);
  const theta = rad(lstDeg);
  const d = daysSinceJ2000(date);
  const eps = rad(23.4393 - 3.563e-7 * d);
  const phi = rad(lat);
  const asc = Math.atan2(Math.cos(theta), -(Math.sin(theta) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps)));
  return norm(deg(asc));
}

function meanNorthNode(date: Date): number {
  const d = daysSinceJ2000(date);
  return norm(125.0445479 - 0.05295377 * d);
}

export function computeChart(params: {
  dob: string; time: string; lat: number; lng: number; timeZone: string;
}): KundliChart {
  const birthUtc = birthToUtc(params.dob, params.time, params.timeZone);
  const ay = lahiriAyanamsa(birthUtc);
  const nextDay = new Date(birthUtc.getTime() + 86400000);

  const bodies: { name: string; body: Astronomy.Body }[] = [
    { name: "Sun", body: Astronomy.Body.Sun },
    { name: "Moon", body: Astronomy.Body.Moon },
    { name: "Mercury", body: Astronomy.Body.Mercury },
    { name: "Venus", body: Astronomy.Body.Venus },
    { name: "Mars", body: Astronomy.Body.Mars },
    { name: "Jupiter", body: Astronomy.Body.Jupiter },
    { name: "Saturn", body: Astronomy.Body.Saturn },
  ];

  const ascSid = norm(ascendantTropical(birthUtc, params.lat, params.lng) - ay);
  const lagnaRashi = Math.floor(ascSid / 30);

  const planets: PlanetPosition[] = bodies.map(({ name, body }) => {
    const lon = norm(tropicalLongitude(body, birthUtc) - ay);
    const lonNext = norm(tropicalLongitude(body, nextDay) - ay);
    let delta = lonNext - lon;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const rashi = Math.floor(lon / 30);
    return {
      planet: name,
      longitude: round2(lon),
      rashi,
      rashiName: RASHIS[rashi],
      degreeInSign: round2(lon % 30),
      house: ((rashi - lagnaRashi + 12) % 12) + 1,
      nakshatra: NAKSHATRAS[Math.floor(lon / (360 / 27))],
      retrograde: name !== "Sun" && name !== "Moon" && delta < 0,
    };
  });

  const rahuLon = norm(meanNorthNode(birthUtc) - ay);
  for (const [name, lon] of [["Rahu", rahuLon], ["Ketu", norm(rahuLon + 180)]] as const) {
    const rashi = Math.floor(lon / 30);
    planets.push({
      planet: name,
      longitude: round2(lon),
      rashi,
      rashiName: RASHIS[rashi],
      degreeInSign: round2(lon % 30),
      house: ((rashi - lagnaRashi + 12) % 12) + 1,
      nakshatra: NAKSHATRAS[Math.floor(lon / (360 / 27))],
      retrograde: true, // nodes are always treated as retrograde (mean node)
    });
  }

  const moon = planets.find((p) => p.planet === "Moon")!;
  const nakIndex = Math.floor(moon.longitude / (360 / 27));
  const pada = Math.floor((moon.longitude % (360 / 27)) / ((360 / 27) / 4)) + 1;

  const houses = Array.from({ length: 12 }, (_, i) => {
    const rashi = (lagnaRashi + i) % 12;
    return {
      house: i + 1,
      rashi,
      rashiName: RASHIS[rashi],
      planets: planets.filter((p) => p.house === i + 1).map((p) => p.planet),
    };
  });

  // Vimshottari dasha from Moon nakshatra
  const nakSpan = 360 / 27;
  const elapsedFrac = (moon.longitude % nakSpan) / nakSpan;
  const startLordIdx = nakIndex % 9;
  const dashas: DashaPeriod[] = [];
  let cursor = birthUtc.getTime() - elapsedFrac * DASHA_YEARS[startLordIdx] * 365.25 * 86400000;
  for (let i = 0; i < 18; i++) {
    const idx = (startLordIdx + i) % 9;
    const end = cursor + DASHA_YEARS[idx] * 365.25 * 86400000;
    dashas.push({ lord: DASHA_LORDS[idx], start: new Date(cursor).toISOString(), end: new Date(end).toISOString() });
    cursor = end;
  }

  const now = Date.now();
  const maha = dashas.find((d) => new Date(d.start).getTime() <= now && now < new Date(d.end).getTime()) ?? null;
  let currentDasha: KundliChart["currentDasha"] = null;
  if (maha) {
    const mahaIdx = DASHA_LORDS.indexOf(maha.lord);
    const mahaStart = new Date(maha.start).getTime();
    const mahaYears = DASHA_YEARS[mahaIdx];
    let aCursor = mahaStart;
    for (let i = 0; i < 9; i++) {
      const idx = (mahaIdx + i) % 9;
      const span = (DASHA_YEARS[idx] / 120) * mahaYears * 365.25 * 86400000;
      const aEnd = aCursor + span;
      if (aCursor <= now && now < aEnd) {
        currentDasha = {
          maha,
          antar: { lord: DASHA_LORDS[idx], start: new Date(aCursor).toISOString(), end: new Date(aEnd).toISOString() },
        };
        break;
      }
      aCursor = aEnd;
    }
    if (!currentDasha) currentDasha = { maha, antar: { lord: maha.lord, start: maha.start, end: maha.end } };
  }

  return {
    computedAt: new Date().toISOString(),
    birthUtc: birthUtc.toISOString(),
    ayanamsa: round2(ay),
    lagna: { longitude: round2(ascSid), rashi: lagnaRashi, rashiName: RASHIS[lagnaRashi], degreeInSign: round2(ascSid % 30) },
    moonSign: { rashi: moon.rashi, rashiName: moon.rashiName },
    nakshatra: { index: nakIndex, name: NAKSHATRAS[nakIndex], pada },
    planets,
    houses,
    dashas,
    currentDasha,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Current transiting Moon's sidereal sign (calculated, not guessed). */
export function currentMoonSign(now: Date = new Date()): { rashi: number; rashiName: string; longitude: number } {
  const ay = lahiriAyanamsa(now);
  const lon = norm(tropicalLongitude(Astronomy.Body.Moon, now) - ay);
  const rashi = Math.floor(lon / 30);
  return { rashi, rashiName: RASHIS[rashi], longitude: round2(lon) };
}

/** Compact text summary of the calculated chart, given to Gemini as grounding data. */
export function chartSummary(chart: KundliChart, name: string): string {
  const lines = [
    `Name: ${name}`,
    `Lagna (Ascendant): ${chart.lagna.rashiName} ${chart.lagna.degreeInSign}°`,
    `Moon sign (Rashi): ${chart.moonSign.rashiName}`,
    `Birth Nakshatra: ${chart.nakshatra.name}, pada ${chart.nakshatra.pada}`,
    `Planets (sidereal, whole-sign houses): ${chart.planets
      .map((p) => `${p.planet} in ${p.rashiName} (house ${p.house})${p.retrograde ? " [R]" : ""}`)
      .join("; ")}`,
  ];
  if (chart.currentDasha) {
    lines.push(
      `Current Vimshottari Mahadasha: ${chart.currentDasha.maha.lord} (until ${chart.currentDasha.maha.end.slice(0, 10)}), Antardasha: ${chart.currentDasha.antar.lord} (until ${chart.currentDasha.antar.end.slice(0, 10)})`
    );
  }
  return lines.join("\n");
}

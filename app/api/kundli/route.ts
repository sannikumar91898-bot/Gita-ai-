// app/api/kundli/route.ts
import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

import { getUser } from "@/auth";
import { db } from "@/index";
import { aiResponseCache, birthDetails, charts, users } from "@/schema";
import {
  RASHIS_HI,
  chartSummary,
  computeChart,
  type KundliChart,
} from "@/vedic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUEST_TIMEOUT_MS = 18_000;
const DEFAULT_MODEL = "gemini-1.5-flash";

type PlaceHit = { lat: number; lng: number; timeZone: string; };
type InterpretationStatus = "ready" | "quota" | "unavailable" | "not_configured" | "empty";

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    y >= 1900 &&
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}

function validTime(value: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(value)) return false;
  const [h, m] = value.split(":").map(Number);
  return h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

function publicChart(chart: KundliChart) {
  return {
    lagna: {
      rashiName: chart.lagna.rashiName,
      rashiNameHi: RASHIS_HI[chart.lagna.rashi],
      degreeInSign: chart.lagna.degreeInSign,
    },
    moonSign: {
      rashiName: chart.moonSign.rashiName,
      rashiNameHi: RASHIS_HI[chart.moonSign.rashi],
    },
    nakshatra: { name: chart.nakshatra.name, pada: chart.nakshatra.pada },
    currentDasha: chart.currentDasha
      ? {
          maha: chart.currentDasha.maha.lord,
          mahaUntil: chart.currentDasha.maha.end.slice(0, 10),
          antar: chart.currentDasha.antar.lord,
          antarUntil: chart.currentDasha.antar.end.slice(0, 10),
        }
      : null,
    planets: chart.planets.map((planet) => ({
      planet: planet.planet,
      rashiName: planet.rashiName,
      house: planet.house,
      retrograde: planet.retrograde,
    })),
  };
}

function calculatedReport(name: string, chart: KundliChart): string {
  const view = publicChart(chart);
  const lines = [
    name + " की गणना की गई कुंडली",
    "लग्न: " + view.lagna.rashiNameHi + " (" + view.lagna.rashiName + ") " + view.lagna.degreeInSign + "°",
    "चंद्र राशि: " + view.moonSign.rashiNameHi + " (" + view.moonSign.rashiName + ")",
    "जन्म नक्षत्र: " + view.nakshatra.name + ", पद " + view.nakshatra.pada,
  ];
  if (view.currentDasha) {
    lines.push(
      "वर्तमान महादशा: " +
        view.currentDasha.maha +
        " (" + view.currentDasha.mahaUntil + " तक), अंतरदशा: " + view.currentDasha.antar
    );
  }
  lines.push("ग्रह स्थिति:");
  for (const planet of view.planets) {
    lines.push(
      planet.planet + " — " + planet.rashiName + ", भाव " + planet.house + (planet.retrograde ? " (वक्री)" : "")
    );
  }
  lines.push("ये स्थितियाँ गणना से बनी हैं। ये भविष्य की गारंटी नहीं हैं।");
  return lines.join("\n");
}

async function resolvePlace(place: string): Promise<PlaceHit | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(
      "https://geocoding-api.open-meteo.com/v1/search?count=5&format=json&name=" +
        encodeURIComponent(place),
      { cache: "no-store", signal: controller.signal }
    );
    if (!response.ok) return null;
    const data: unknown = await response.json();
    if (!isRecord(data) || !Array.isArray(data.results)) return null;
    for (const item of data.results) {
      if (!isRecord(item)) continue;
      if (
        typeof item.latitude === "number" &&
        typeof item.longitude === "number" &&
        typeof item.timezone === "string" &&
        item.timezone
      ) {
        return { lat: item.latitude, lng: item.longitude, timeZone: item.timezone };
      }
    }
    return null;
  } catch (error) {
    console.error("Place lookup failed:", error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function extractText(data: unknown): string {
  if (!isRecord(data) || !Array.isArray(data.candidates)) return "";
  const candidate = data.candidates[0];
  if (!isRecord(candidate) || !isRecord(candidate.content)) return "";
  const parts = candidate.content.parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .filter(
      (part): part is Record<string, unknown> =>
        isRecord(part) && typeof part.text === "string" && part.thought !== true
    )
    .map((part) => part.text as string)
    .join("")
    .trim();
}

// 🔥 NAYA: Language Instruction Helper
function getLangInstruction(lang: string): string {
  const map: Record<string, string> = {
    hi: "Write strictly in Hindi (Devanagari script).",
    hinglish: "Write strictly in Hinglish (Roman Hindi mixed with English).",
    en: "Write strictly in English.",
    te: "Write strictly in Telugu (తెలుగు).", ta: "Write strictly in Tamil (தமிழ்).",
    kn: "Write strictly in Kannada (ಕನ್ನಡ).", bn: "Write strictly in Bengali (বাংলা).",
    mr: "Write strictly in Marathi (मराठी).", gu: "Write strictly in Gujarati (ગુજરાતી).",
    ml: "Write strictly in Malayalam (മലയാളം).",
  };
  return map[lang] || map["hinglish"];
}

async function writeInterpretation(params: {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  chart: KundliChart;
  language: string; // 🔥 Language param add kiya
}): Promise<{ text: string | null; status: InterpretationStatus }> {
  const cacheKey = [
    "kundli",
    params.dateOfBirth,
    params.timeOfBirth,
    params.placeOfBirth.toLowerCase().replace(/\s+/g, ""),
    params.language // 🔥 Cache key me bhi language daali taaki alag alag bhasha me cache save ho
  ].join("_");

  try {
    const cached = await db.select().from(aiResponseCache).where(eq(aiResponseCache.questionKey, cacheKey)).limit(1);
    if (cached[0]?.aiAnswer?.trim()) return { text: cached[0].aiAnswer, status: "ready" };
  } catch (error) {
    console.error("Kundli cache lookup failed:", error);
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  if (!apiKey) return { text: null, status: "not_configured" };

  const generationConfig: Record<string, unknown> = { maxOutputTokens: 900, temperature: 0.7 };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        cache: "no-store",
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                // 🔥 Yahan hardcoded Hindi hata kar dynamic instruction lagaya
                text: `You are Gita AI. ${getLangInstruction(params.language)} Use only the calculated chart facts supplied. Do not invent planets, lagna, nakshatra or dasha. Do not guarantee marriage, money, job or health.`,
              },
            ],
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  // 🔥 Prompt bhi translate kiya (ya English me rakha taaki AI samajh le)
                  text: `Write a short personal reflection with headings for Nature (स्वभाव), Career (करियर), Relationships (संबंध), and Practical Advice (व्यावहारिक सलाह).\n\n${chartSummary(params.chart, params.name)}\nPlace: ${params.placeOfBirth}`,
                },
              ],
            },
          ],
          generationConfig,
        }),
      }
    );

    if (response.status === 429) return { text: null, status: "quota" };
    if (!response.ok) return { text: null, status: "unavailable" };

    const text = extractText(await response.json());
    if (!text) return { text: null, status: "empty" };

    try {
      await db.insert(aiResponseCache).values({
        id: crypto.randomUUID(),
        questionKey: cacheKey,
        originalQuestion: "Kundli interpretation for " + params.name,
        aiAnswer: text,
      }).onConflictDoNothing();
    } catch (error) { console.error("Kundli cache save failed:", error); }
    
    return { text, status: "ready" };
  } catch (error) {
    console.error("Kundli Gemini request failed:", error);
    return { text: null, status: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ birth: null, chart: null }, { headers: { "Cache-Control": "no-store" } });

  const [birthRows, chartRows] = await Promise.all([
    db.select().from(birthDetails).where(eq(birthDetails.userId, user.id)).limit(1),
    db.select().from(charts).where(eq(charts.userId, user.id)).orderBy(desc(charts.createdAt)).limit(1),
  ]);

  const birth = birthRows[0] ? {
    name: birthRows[0].name,
    dob: birthRows[0].dob,
    birthTime: birthRows[0].birthTime,
    birthPlace: birthRows[0].birthPlace,
    gender: birthRows[0].gender,
    isBirthTimeUnknown: birthRows[0].isBirthTimeUnknown,
  } : null;

  const stored = birthRows[0] && chartRows[0] ? (chartRows[0].data as KundliChart) : null;
  return NextResponse.json({
    birth,
    chart: stored && stored.lagna ? publicChart(stored) : null,
    calculatedReport: stored && stored.lagna ? calculatedReport(birth?.name || "", stored) : null,
  }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return jsonError("Invalid request.", 400); }
  if (!isRecord(body)) return jsonError("Invalid details.", 400);

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const gender = typeof body.gender === "string" ? body.gender.trim() : "Not specified";
  const dateOfBirth = typeof body.dateOfBirth === "string" ? body.dateOfBirth.trim() : "";
  const rawTimeOfBirth = typeof body.timeOfBirth === "string" ? body.timeOfBirth.trim() : "";
  const placeOfBirth = typeof body.placeOfBirth === "string" ? body.placeOfBirth.trim() : "";
  const isTimeUnknown = body.isTimeUnknown === true;
  const consent = body.consent === true;
  const language = typeof body.language === "string" ? body.language : "hinglish"; // 🔥 Language uthaya
  const timeOfBirth = isTimeUnknown ? "12:00" : rawTimeOfBirth;

  if (!consent) return jsonError("Consent is required to generate kundli.", 400);
  if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth) return jsonError("Please fill in all birth details.", 400);
  if (name.length > 100 || placeOfBirth.length > 200 || !validDate(dateOfBirth) || !validTime(timeOfBirth)) return jsonError("Please check your birth details.", 400);
  if (dateOfBirth > new Date().toISOString().slice(0, 10)) return jsonError("Birth date cannot be in the future.", 400);

  const place = await resolvePlace(placeOfBirth);
  if (!place) return jsonError("इस जन्म स्थान की लोकेशन नहीं मिली। शहर और राज्य साफ लिखें।", 422);

  let chart: KundliChart;
  try {
    chart = computeChart({ dob: dateOfBirth, time: timeOfBirth, lat: place.lat, lng: place.lng, timeZone: place.timeZone });
  } catch (error) {
    return jsonError("इन जन्म विवरणों से कुंडली गणना नहीं हो सकी।", 422);
  }

  const user = await getUser();
  let saved = false;
  if (user) {
    try {
      await db.insert(birthDetails).values({
        userId: user.id, name, gender, dob: dateOfBirth, birthTime: timeOfBirth, isBirthTimeUnknown: isTimeUnknown, birthPlace: placeOfBirth, lat: place.lat, lng: place.lng, timeZone: place.timeZone, consent: true,
      }).onConflictDoUpdate({
        target: birthDetails.userId,
        set: { name, gender, dob: dateOfBirth, birthTime: timeOfBirth, isBirthTimeUnknown: isTimeUnknown, birthPlace: placeOfBirth, lat: place.lat, lng: place.lng, timeZone: place.timeZone, consent: true, updatedAt: new Date() },
      });
      await db.insert(charts).values({ userId: user.id, data: chart });
      await db.update(users).set({ name }).where(and(eq(users.id, user.id)));
      saved = true;
    } catch (error) { console.error("Birth details save failed:", error); }
  }

  // 🔥 Pass language here
  const written = await writeInterpretation({
    name, dateOfBirth, timeOfBirth, placeOfBirth, chart, language
  });
  const facts = calculatedReport(name, chart);

  return NextResponse.json({
    ok: true, saved, chart: publicChart(chart), calculatedReport: facts,
    interpretation: written.text, interpretationStatus: written.status,
    kundliReport: written.text ? facts + "\n\n" + written.text : facts,
  }, { headers: { "Cache-Control": "no-store" } });
}
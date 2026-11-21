import { NextResponse } from "next/server";
import { sql, eq, and, lt, gte } from "drizzle-orm";

import { db } from "@/index";
import { aiResponseCache, users } from "@/schema";
import { RASHIS_HI, chartSummary, type KundliChart } from "@/vedic";

const REQUEST_TIMEOUT_MS = 18_000;
const DEFAULT_MODEL = "gemini-1.5-flash";
const FREE_KUNDLI_LIMIT = 2;
const COST_PER_KUNDLI_PAISE = 200; // ₹2

// Prompt badalne par isko bump karo, taaki purane cached jawab na aayein
const PROMPT_VERSION = "v2";

export type PlaceHit = {
  lat: number;
  lng: number;
  timeZone: string;
};

export type InterpretationStatus =
  | "ready"
  | "quota"
  | "unavailable"
  | "not_configured"
  | "empty";

export const SUPPORTED_LANGUAGES = [
  "hi",
  "hinglish",
  "en",
  "te",
  "ta",
  "kn",
  "bn",
  "mr",
  "gu",
  "ml",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// ---------- JSON error ----------
export function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

// ---------- Validation ----------
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function validDate(value: string): boolean {
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

export function validTime(value: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(value)) return false;

  const [h, m] = value.split(":").map(Number);

  return h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

// ---------- Public chart ----------
export function publicChart(chart: KundliChart) {
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

    nakshatra: {
      name: chart.nakshatra.name,
      pada: chart.nakshatra.pada,
    },

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
      longitude: planet.longitude,       // जोड़ें
      rashi: planet.rashi,               // जोड़ें
      rashiName: planet.rashiName,
      degreeInSign: planet.degreeInSign, // जोड़ें (डिग्री दिखाने के लिए जरूरी)
      house: planet.house,
      nakshatra: planet.nakshatra,       // जोड़ें (नक्षत्र दिखाने के लिए जरूरी)
      retrograde: planet.retrograde,
    })),
      };
}
   
// ---------- Calculated report ----------
export function calculatedReport(name: string, chart: KundliChart): string {
  const view = publicChart(chart);

  const lines = [
    name + " की गणना की गई कुंडली",
    "लग्न: " +
      view.lagna.rashiNameHi +
      " (" +
      view.lagna.rashiName +
      ") " +
      view.lagna.degreeInSign +
      "°",
    "चंद्र राशि: " +
      view.moonSign.rashiNameHi +
      " (" +
      view.moonSign.rashiName +
      ")",
    "जन्म नक्षत्र: " +
      view.nakshatra.name +
      ", पद " +
      view.nakshatra.pada,
  ];

  if (view.currentDasha) {
    lines.push(
      "वर्तमान महादशा: " +
        view.currentDasha.maha +
        " (" +
        view.currentDasha.mahaUntil +
        " तक), अंतरदशा: " +
        view.currentDasha.antar
    );
  }

  lines.push("ग्रह स्थिति:");

  for (const planet of view.planets) {
    lines.push(
      planet.planet +
        " — " +
        planet.rashiName +
        ", भाव " +
        planet.house +
        (planet.retrograde ? " (वक्री)" : "")
    );
  }

  // Disclaimer yahan nahi. Legal line app footer / Terms mein ek baar rakho.
  lines.push("✨ ये कुंडली आपके जन्म के ग्रहों की स्थिति पर आधारित है।");

  return lines.join("\n");
}

// ---------- Place lookup ----------
export async function resolvePlace(place: string): Promise<PlaceHit | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      "https://geocoding-api.open-meteo.com/v1/search?count=5&format=json&name=" +
        encodeURIComponent(place),
      {
        cache: "no-store",
        signal: controller.signal,
      }
    );

    if (!response.ok) return null;

    const data: unknown = await response.json();

    if (!isRecord(data) || !Array.isArray(data.results)) {
      return null;
    }

    for (const item of data.results) {
      if (!isRecord(item)) continue;

      if (
        typeof item.latitude === "number" &&
        typeof item.longitude === "number" &&
        typeof item.timezone === "string" &&
        item.timezone
      ) {
        return {
          lat: item.latitude,
          lng: item.longitude,
          timeZone: item.timezone,
        };
      }
    }

    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// ---------- Gemini helpers ----------
function extractText(data: unknown): string {
  if (!isRecord(data) || !Array.isArray(data.candidates)) {
    return "";
  }

  const candidate = data.candidates[0];

  if (!isRecord(candidate) || !isRecord(candidate.content)) {
    return "";
  }

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

function getLangInstruction(lang: string): string {
  const map: Record<string, string> = {
    hi: "Write strictly in Hindi using Devanagari script.",
    hinglish:
      "Write strictly in Hinglish (Roman Hindi mixed naturally with English).",
    en: "Write strictly in English.",
    te: "Write strictly in Telugu script.",
    ta: "Write strictly in Tamil script.",
    kn: "Write strictly in Kannada script.",
    bn: "Write strictly in Bengali script.",
    mr: "Write strictly in Marathi using Devanagari script.",
    gu: "Write strictly in Gujarati script.",
    ml: "Write strictly in Malayalam script.",
  };

  return map[lang] || map.hi;
}

// ---------- AI interpretation ----------
export async function writeInterpretation(params: {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  chart: KundliChart;
  language: string;
}): Promise<{ text: string | null; status: InterpretationStatus }> {
  const cacheKey = [
    "kundli",
    PROMPT_VERSION,
    params.dateOfBirth,
    params.timeOfBirth,
    params.placeOfBirth.toLowerCase().replace(/\s+/g, ""),
    params.language,
  ].join("_");

  try {
    const cached = await db
      .select()
      .from(aiResponseCache)
      .where(eq(aiResponseCache.questionKey, cacheKey))
      .limit(1);

    if (cached[0]?.aiAnswer?.trim()) {
      return { text: cached[0].aiAnswer, status: "ready" };
    }
  } catch {
    // Cache errors are non-fatal
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;

  if (!apiKey) {
    return { text: null, status: "not_configured" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" +
        encodeURIComponent(model) +
        ":generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        cache: "no-store",
        signal: controller.signal,

        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text:
                  `You are Acharya, a warm, wise, confident Vedic astrologer with 30 years of experience. ` +
                  `${getLangInstruction(params.language)} ` +
                  `Speak like a trusted family astrologer: personal, calm, and specific. ` +
                  `Use ONLY the calculated chart facts supplied; never invent placements. ` +
                  `Open with 2 specific, relatable observations drawn from Lagna, Moon sign and Nakshatra, so the person feels seen. ` +
                  `Then give short sections: Swabhav (Nature), Career, Rishte (Relationships), and Current Phase (using the running Mahadasha/Antardasha, with a sense of timing). ` +
                  `Phrase insights as strong tendencies and phases ("yeh dasha aapko... ki taraf le jaati hai"), not as guaranteed events. ` +
                  `NEVER write disclaimers like "no guarantee" inside the reflection. ` +
                  `NEVER create fear, mention death, serious illness, or say a dosha will cause harm. ` +
                  `Only mention a dosha if it is supported by the calculated chart facts. ` +
                  `Frame any challenge as "ek cheez par dhyan dein" with one simple, practical upay (habit, mindset, or a light ritual). ` +
                  `Do not pressure the user to pay or return. ` +
                  `End with one warm, curious line inviting them to ask about a specific area (career, marriage, upcoming dasha), ` +
                  `and mention one thing in the chart worth exploring next.`,
              },
            ],
          },

          contents: [
            {
              role: "user",
              parts: [
                {
                  text:
                    `Write the reflection in the requested language. Keep it under 250 words, easy to read on a phone.\n\n` +
                    `${chartSummary(params.chart, params.name)}\n` +
                    `Place: ${params.placeOfBirth}`,
                },
              ],
            },
          ],

          generationConfig: {
            maxOutputTokens: 900,
            temperature: 0.7,
          },
        }),
      }
    );

    if (response.status === 429) {
      return { text: null, status: "quota" };
    }

    if (!response.ok) {
      return { text: null, status: "unavailable" };
    }

    const text = extractText(await response.json());

    if (!text) {
      return { text: null, status: "empty" };
    }

    try {
      await db
        .insert(aiResponseCache)
        .values({
          questionKey: cacheKey,
          originalQuestion: "Kundli interpretation for " + params.name,
          aiAnswer: text,
        })
        .onConflictDoNothing();
    } catch {
      // Cache saving is non-fatal
    }

    return { text, status: "ready" };
  } catch (error) {
    console.error("Gemini interpretation error:", error);
    return { text: null, status: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}

// ---------- Billing ----------
export type ChargeKind = "free" | "paid" | "none";

// Pehle free quota, warna wallet se ₹2. Dono atomic hain.
export async function chargeForKundli(userId: string): Promise<ChargeKind> {
  const free = await db
    .update(users)
    .set({ freeKundliUsed: sql`${users.freeKundliUsed} + 1` })
    .where(
      and(eq(users.id, userId), lt(users.freeKundliUsed, FREE_KUNDLI_LIMIT))
    )
    .returning({ id: users.id });

  if (free.length > 0) return "free";

  const paid = await db
    .update(users)
    .set({
      walletBalancePaise: sql`${users.walletBalancePaise} - ${COST_PER_KUNDLI_PAISE}`,
    })
    .where(
      and(
        eq(users.id, userId),
        gte(users.walletBalancePaise, COST_PER_KUNDLI_PAISE)
      )
    )
    .returning({ id: users.id });

  return paid.length > 0 ? "paid" : "none";
}

export async function refundKundli(userId: string, kind: ChargeKind) {
  try {
    if (kind === "free") {
      await db
        .update(users)
        .set({ freeKundliUsed: sql`GREATEST(${users.freeKundliUsed} - 1, 0)` })
        .where(eq(users.id, userId));
    } else if (kind === "paid") {
      await db
        .update(users)
        .set({
          walletBalancePaise: sql`${users.walletBalancePaise} + ${COST_PER_KUNDLI_PAISE}`,
        })
        .where(eq(users.id, userId));
    }
  } catch (error) {
    console.error("Kundli refund error:", error);
  }
}

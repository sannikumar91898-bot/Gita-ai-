import { NextResponse } from "next/server";
import { sql, eq, desc, and, lt, gte } from "drizzle-orm";

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
const FREE_KUNDLI_LIMIT = 2;
const COST_PER_KUNDLI_PAISE = 200; // ₹2

// Prompt badalne par isko bump karo, taaki purane cached jawab na aayein
const PROMPT_VERSION = "v2";

type PlaceHit = {
  lat: number;
  lng: number;
  timeZone: string;
};

type InterpretationStatus =
  | "ready"
  | "quota"
  | "unavailable"
  | "not_configured"
  | "empty";

// 10 supported languages
const SUPPORTED_LANGUAGES = [
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

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// ---------- Error messages ----------
function getKundliError(
  lang: string,
  type:
    | "invalid_req"
    | "consent"
    | "missing_fields"
    | "bad_details"
    | "future_date"
    | "place_not_found"
    | "calc_failed"
    | "guest_blocked"
    | "wallet_recharge"
): string {
  const dict: Record<string, Record<string, string>> = {
    hi: {
      invalid_req: "अमान्य अनुरोध। कृपया पुनः प्रयास करें।",
      consent: "कुंडली बनाने के लिए सहमति आवश्यक है।",
      missing_fields: "कृपया सभी जन्म विवरण भरें।",
      bad_details: "कृपया अपने जन्म विवरण की जाँच करें।",
      future_date: "जन्म तिथि भविष्य की नहीं हो सकती।",
      place_not_found: "जन्म स्थान नहीं मिला। शहर और राज्य साफ लिखें।",
      calc_failed: "कुंडली गणना नहीं हो सकी।",
      guest_blocked: "कुंडली बनाने के लिए लॉगिन या रजिस्टर करें।",
      wallet_recharge:
        "आपकी 2 मुफ्त कुंडली समाप्त हो गई हैं। अगली कुंडली ₹2 में बन सकती है। वॉलेट रिचार्ज करें।",
    },

    hinglish: {
      invalid_req: "Invalid request. Kripya phir try karein.",
      consent: "Kundli banane ke liye consent zaroori hai.",
      missing_fields: "Kripya sabhi birth details bharein.",
      bad_details: "Kripya birth details check karein.",
      future_date: "Birth date future ki nahi ho sakti.",
      place_not_found: "Birth place nahi mila. City aur state clear likhein.",
      calc_failed: "Kundli calculate nahi ho saki.",
      guest_blocked: "Kundli ke liye login ya register karein.",
      wallet_recharge:
        "Aapki 2 free Kundli khatam ho gayi hain. Next Kundli ₹2 mein hai. Wallet recharge karein.",
    },

    en: {
      invalid_req: "Invalid request. Please try again.",
      consent: "Consent is required to generate Kundli.",
      missing_fields: "Please fill in all birth details.",
      bad_details: "Please check your birth details.",
      future_date: "Birth date cannot be in the future.",
      place_not_found: "Birth location not found. Enter city and state clearly.",
      calc_failed: "Could not calculate Kundli.",
      guest_blocked: "Please login or register to generate Kundli.",
      wallet_recharge:
        "Your 2 free Kundlis are over. The next Kundli costs ₹2. Please recharge your wallet.",
    },

    te: {
      invalid_req: "చెల్లని అభ్యర్థన. మళ్లీ ప్రయత్నించండి.",
      consent: "కుండలి రూపొందించడానికి సమ్మతి అవసరం.",
      missing_fields: "అన్ని పుట్టిన వివరాలను పూరించండి.",
      bad_details: "పుట్టిన వివరాలను తనిఖీ చేయండి.",
      future_date: "పుట్టిన తేదీ భవిష్యత్తులో ఉండకూడదు.",
      place_not_found: "పుట్టిన ప్రదేశం కనుగొనబడలేదు.",
      calc_failed: "కుండలి లెక్కించలేకపోయాము.",
      guest_blocked: "దయచేసి లాగిన్ లేదా నమోదు చేసుకోండి.",
      wallet_recharge: "మీ 2 ఉచిత కుండలులు పూర్తయ్యాయి. తదుపరిది ₹2.",
    },

    ta: {
      invalid_req: "தவறான கோரிக்கை. மீண்டும் முயற்சிக்கவும்.",
      consent: "ஜாதகம் உருவாக்க ஒப்புதல் தேவை.",
      missing_fields: "அனைத்து பிறப்பு விவரங்களையும் நிரப்பவும்.",
      bad_details: "பிறப்பு விவரங்களைச் சரிபார்க்கவும்.",
      future_date: "பிறந்த தேதி எதிர்காலத்தில் இருக்க முடியாது.",
      place_not_found: "பிறந்த இடம் கிடைக்கவில்லை.",
      calc_failed: "ஜாதகத்தை கணக்கிட முடியவில்லை.",
      guest_blocked: "உள்நுழையவும் அல்லது பதிவு செய்யவும்.",
      wallet_recharge: "உங்கள் 2 இலவச ஜாதகங்கள் முடிந்துவிட்டன. அடுத்தது ₹2.",
    },

    kn: {
      invalid_req: "ಅಮಾನ್ಯ ವಿನಂತಿ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
      consent: "ಕುಂಡಲಿ ರಚಿಸಲು ಒಪ್ಪಿಗೆ ಅಗತ್ಯ.",
      missing_fields: "ಎಲ್ಲಾ ಜನ್ಮ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.",
      bad_details: "ಜನ್ಮ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
      future_date: "ಜನ್ಮ ದಿನಾಂಕ ಭವಿಷ್ಯದಲ್ಲಿರಲು ಸಾಧ್ಯವಿಲ್ಲ.",
      place_not_found: "ಜನ್ಮ ಸ್ಥಳ ಕಂಡುಬಂದಿಲ್ಲ.",
      calc_failed: "ಕುಂಡಲಿ ಲೆಕ್ಕಹಾಕಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
      guest_blocked: "ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಅಥವಾ ನೋಂದಾಯಿಸಿ.",
      wallet_recharge: "ನಿಮ್ಮ 2 ಉಚಿತ ಕುಂಡಲಿಗಳು ಮುಗಿದಿವೆ. ಮುಂದಿನದು ₹2.",
    },

    bn: {
      invalid_req: "অবৈধ অনুরোধ। আবার চেষ্টা করুন।",
      consent: "কুণ্ডলী তৈরি করতে সম্মতি প্রয়োজন।",
      missing_fields: "সমস্ত জন্ম বিবরণ পূরণ করুন।",
      bad_details: "জন্ম বিবরণ পরীক্ষা করুন।",
      future_date: "জন্ম তারিখ ভবিষ্যতে হতে পারে না।",
      place_not_found: "জন্মস্থান পাওয়া যায়নি।",
      calc_failed: "কুণ্ডলী গণনা করা যায়নি।",
      guest_blocked: "কুণ্ডলী তৈরি করতে লগইন বা নিবন্ধন করুন।",
      wallet_recharge: "আপনার 2টি ফ্রি কুণ্ডলী শেষ। পরেরটি মাত্র ₹2।",
    },

    mr: {
      invalid_req: "अवैध विनंती. पुन्हा प्रयत्न करा.",
      consent: "कुंडली तयार करण्यासाठी संमती आवश्यक आहे.",
      missing_fields: "सर्व जन्म तपशील भरा.",
      bad_details: "जन्म तपशील तपासा.",
      future_date: "जन्म तारीख भविष्यातील असू शकत नाही.",
      place_not_found: "जन्मस्थान सापडले नाही.",
      calc_failed: "कुंडली गणना करता आली नाही.",
      guest_blocked: "कृपया लॉगिन किंवा नोंदणी करा.",
      wallet_recharge: "तुमच्या 2 मोफत कुंडल्या संपल्या. पुढची फक्त ₹2.",
    },

    gu: {
      invalid_req: "અમાન્ય વિનંતી. ફરી પ્રયાસ કરો.",
      consent: "કુંડળી બનાવવા સંમતિ જરૂરી છે.",
      missing_fields: "બધી જન્મ વિગતો ભરો.",
      bad_details: "જન્મ વિગતો તપાસો.",
      future_date: "જન્મ તારીખ ભવિષ્યની હોઈ શકે નહીં.",
      place_not_found: "જન્મ સ્થળ મળ્યું નથી.",
      calc_failed: "કુંડળીની ગણતરી થઈ શકી નથી.",
      guest_blocked: "કૃપા કરીને લોગિન અથવા નોંધણી કરો.",
      wallet_recharge: "તમારી 2 મફત કુંડળી પૂરી થઈ. આગળની માત્ર ₹2.",
    },

    ml: {
      invalid_req: "അസാധുവായ അഭ്യർത്ഥന. വീണ്ടും ശ്രമിക്കുക.",
      consent: "കുണ്ഡലി സൃഷ്ടിക്കാൻ സമ്മതം ആവശ്യമാണ്.",
      missing_fields: "എല്ലാ ജനന വിവരങ്ങളും പൂരിപ്പിക്കുക.",
      bad_details: "ജനന വിവരങ്ങൾ പരിശോധിക്കുക.",
      future_date: "ജനന തീയതി ഭാവിയിൽ ആകാൻ കഴിയില്ല.",
      place_not_found: "ജനന സ്ഥലം കണ്ടെത്തിയില്ല.",
      calc_failed: "കുണ്ഡലി കണക്കാക്കാൻ കഴിഞ്ഞില്ല.",
      guest_blocked: "ദയവായി ലോഗിൻ അല്ലെങ്കിൽ രജിസ്റ്റർ ചെയ്യുക.",
      wallet_recharge: "നിങ്ങളുടെ 2 സൗജന്യ കുണ്ഡലികൾ തീർന്നു. അടുത്തത് ₹2.",
    },
  };

  return dict[lang]?.[type] ?? dict.en[type];
}

// ---------- JSON error ----------
function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

// ---------- Validation helpers ----------
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

// ---------- Public chart ----------
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
      rashiName: planet.rashiName,
      house: planet.house,
      retrograde: planet.retrograde,
    })),
  };
}

// ---------- Calculated report ----------
function calculatedReport(name: string, chart: KundliChart): string {
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
async function resolvePlace(place: string): Promise<PlaceHit | null> {
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

// ---------- Gemini response extraction ----------
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

// ---------- Language instructions ----------
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
async function writeInterpretation(params: {
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

  // Cache lookup
  try {
    const cached = await db
      .select()
      .from(aiResponseCache)
      .where(eq(aiResponseCache.questionKey, cacheKey))
      .limit(1);

    if (cached[0]?.aiAnswer?.trim()) {
      return {
        text: cached[0].aiAnswer,
        status: "ready",
      };
    }
  } catch {
    // Cache errors are non-fatal
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;

  if (!apiKey) {
    return {
      text: null,
      status: "not_configured",
    };
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

    // Cache successful answer
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

    return {
      text,
      status: "ready",
    };
  } catch (error) {
    console.error("Gemini interpretation error:", error);

    return {
      text: null,
      status: "unavailable",
    };
  } finally {
    clearTimeout(timeout);
  }
}

// ---------- Billing helpers ----------
type ChargeKind = "free" | "paid" | "none";

// Pehle free quota try karo, warna wallet se ₹2 kaato. Dono atomic hain.
async function chargeForKundli(userId: string): Promise<ChargeKind> {
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

async function refundKundli(userId: string, kind: ChargeKind) {
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

// ---------- GET: Existing Kundli ----------
export async function GET() {
  const userRow = await getUser();

  if (!userRow || userRow.isGuest) {
    return NextResponse.json(
      { birth: null, chart: null },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const [birthRows, chartRows] = await Promise.all([
    db
      .select()
      .from(birthDetails)
      .where(eq(birthDetails.userId, userRow.id))
      .limit(1),

    db
      .select()
      .from(charts)
      .where(eq(charts.userId, userRow.id))
      .orderBy(desc(charts.createdAt))
      .limit(1),
  ]);

  const birth = birthRows[0]
    ? {
        name: birthRows[0].name,
        dob: birthRows[0].dob,
        birthTime: birthRows[0].birthTime,
        birthPlace: birthRows[0].birthPlace,
        gender: birthRows[0].gender,
        isBirthTimeUnknown: birthRows[0].isBirthTimeUnknown,
      }
    : null;

  const stored =
    birthRows[0] && chartRows[0] ? (chartRows[0].data as KundliChart) : null;

  return NextResponse.json(
    {
      birth,

      chart: stored && stored.lagna ? publicChart(stored) : null,

      calculatedReport:
        stored && stored.lagna
          ? calculatedReport(birth?.name || "", stored)
          : null,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

// ---------- POST: Generate Kundli ----------
export async function POST(request: Request) {
  let body: unknown;

  // Parse request
  try {
    body = await request.json();
  } catch {
    return jsonError(getKundliError("hi", "invalid_req"), 400);
  }

  if (!isRecord(body)) {
    return jsonError(getKundliError("hi", "invalid_req"), 400);
  }

  // Validate language
  const requestedLanguage =
    typeof body.language === "string" ? body.language : "hi";

  const language: SupportedLanguage = SUPPORTED_LANGUAGES.includes(
    requestedLanguage as SupportedLanguage
  )
    ? (requestedLanguage as SupportedLanguage)
    : "hi";

  // Inputs
  const consent = body.consent === true;

  const name = typeof body.name === "string" ? body.name.trim() : "";

  const dateOfBirth =
    typeof body.dateOfBirth === "string" ? body.dateOfBirth : "";

  const timeOfBirth =
    typeof body.timeOfBirth === "string" ? body.timeOfBirth : "12:00";

  const placeOfBirth =
    typeof body.placeOfBirth === "string" ? body.placeOfBirth.trim() : "";

  const gender = typeof body.gender === "string" ? body.gender : "other";

  const isBirthTimeUnknown = body.isBirthTimeUnknown === true;

  // Validation
  if (!consent) {
    return jsonError(getKundliError(language, "consent"), 400);
  }

  if (!name || !dateOfBirth || !placeOfBirth) {
    return jsonError(getKundliError(language, "missing_fields"), 400);
  }

  if (!validDate(dateOfBirth)) {
    return jsonError(getKundliError(language, "bad_details"), 400);
  }

  if (!validTime(timeOfBirth)) {
    return jsonError(getKundliError(language, "bad_details"), 400);
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  if (dateOfBirth > todayStr) {
    return jsonError(getKundliError(language, "future_date"), 400);
  }

  // Authentication
  let userRow;

  try {
    userRow = await getUser();
  } catch (error) {
    console.error("Kundli authentication error:", error);

    return jsonError(getKundliError(language, "calc_failed"), 500);
  }

  if (!userRow || userRow.isGuest) {
    return jsonError(getKundliError(language, "guest_blocked"), 401);
  }

  // Resolve birthplace
  const place = await resolvePlace(placeOfBirth);

  if (!place) {
    return jsonError(getKundliError(language, "place_not_found"), 400);
  }

  // Calculate chart
  let chart: KundliChart;

  try {
    chart = computeChart({
      dob: dateOfBirth,
      time: timeOfBirth,
      lat: place.lat,
      lng: place.lng,
      timeZone: place.timeZone,
    });
  } catch (error) {
    console.error("Kundli calculation error:", error);

    return jsonError(getKundliError(language, "calc_failed"), 500);
  }

  if (!chart || !chart.lagna) {
    return jsonError(getKundliError(language, "calc_failed"), 500);
  }

  // Free quota / wallet charge
  let charged: ChargeKind;

  try {
    charged = await chargeForKundli(userRow.id);
  } catch (error) {
    console.error("Kundli billing error:", error);

    return jsonError(getKundliError(language, "calc_failed"), 500);
  }

  if (charged === "none") {
    return jsonError(getKundliError(language, "wallet_recharge"), 402);
  }

  // Save birth details + chart
  try {
    await db
      .insert(birthDetails)
      .values({
        userId: userRow.id,
        name,
        gender,
        isBirthTimeUnknown,
        dob: dateOfBirth,
        birthTime: timeOfBirth,
        birthPlace: placeOfBirth,
        lat: place.lat,
        lng: place.lng,
        timeZone: place.timeZone,
        consent: true,
      })
      .onConflictDoUpdate({
        target: birthDetails.userId,
        set: {
          name,
          gender,
          isBirthTimeUnknown,
          dob: dateOfBirth,
          birthTime: timeOfBirth,
          birthPlace: placeOfBirth,
          lat: place.lat,
          lng: place.lng,
          timeZone: place.timeZone,
          consent: true,
          updatedAt: new Date(),
        },
      });

    await db.insert(charts).values({
      userId: userRow.id,
      data: chart,
    });
  } catch (error) {
    console.error("Kundli save error:", error);

    await refundKundli(userRow.id, charted(charged));

    return jsonError(getKundliError(language, "calc_failed"), 500);
  }

  // AI interpretation (non-fatal if it fails)
  const interpretation = await writeInterpretation({
    name,
    dateOfBirth,
    timeOfBirth,
    placeOfBirth,
    chart,
    language,
  });

  return NextResponse.json(
    {
      chart: publicChart(chart),
      calculatedReport: calculatedReport(name, chart),
      interpretation: interpretation.text,
      interpretationStatus: interpretation.status,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

function charted(kind: ChargeKind): ChargeKind {
  return kind;
}
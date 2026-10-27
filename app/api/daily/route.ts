
import { NextRequest, NextResponse } from "next/server";
import {
  RASHIS,
  RASHIS_HI,
  currentMoonSign,
} from "@/vedic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUEST_TIMEOUT_MS = 30_000;
const DEFAULT_MODEL = "gemini-2.5-flash";

type DailyLang = "en" | "hi" | "hinglish";

type DailyReading = {
  signName: string;
  focus: string;
  luckyColour: {
    name: string;
    hex: string;
  };
  luckyNumber: number;
  affirmation: string;
};

type FailureKind =
  | "config"
  | "model"
  | "auth"
  | "missing-model"
  | "busy"
  | "timeout"
  | "network"
  | "invalid"
  | "empty"
  | "failed";

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": "no-store, max-age=0" },
    }
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function resolveLanguage(value: unknown): DailyLang {
  if (value === "en" || value === "hi" || value === "hinglish") {
    return value;
  }
  return "hi";
}

function isValidReading(value: unknown): value is DailyReading {
  if (!isRecord(value) || !isRecord(value.luckyColour)) {
    return false;
  }

  const colour = value.luckyColour;

  return (
    typeof value.signName === "string" &&
    value.signName.trim().length > 0 &&
    typeof value.focus === "string" &&
    value.focus.trim().length > 0 &&
    typeof colour.name === "string" &&
    colour.name.trim().length > 0 &&
    typeof colour.hex === "string" &&
    /^#[0-9a-fA-F]{6}$/.test(colour.hex) &&
    typeof value.luckyNumber === "number" &&
    Number.isInteger(value.luckyNumber) &&
    value.luckyNumber >= 1 &&
    value.luckyNumber <= 99 &&
    typeof value.affirmation === "string" &&
    value.affirmation.trim().length > 0
  );
}

function languageRule(language: DailyLang): string {
  if (language === "en") {
    return "Write signName, focus, luckyColour.name and affirmation in natural English.";
  }

  if (language === "hinglish") {
    return "Write signName, focus, luckyColour.name and affirmation in natural Hinglish, using Roman Hindi mixed with English.";
  }

  return "Write signName, focus, luckyColour.name and affirmation in natural Hindi using Devanagari.";
}

function failureMessage(
  language: DailyLang,
  kind: FailureKind
): string {
  const hi: Record<FailureKind, string> = {
    config: "AI सेवा अभी कॉन्फ़िगर नहीं है।",
    model: "AI मॉडल कॉन्फ़िगरेशन गलत है।",
    auth: "AI सेवा का authentication विफल हुआ।",
    "missing-model": "AI मॉडल उपलब्ध नहीं है। GEMINI_MODEL जाँचें।",
    busy: "AI सेवा व्यस्त है। थोड़ी देर बाद प्रयास करें।",
    timeout: "जवाब आने में अधिक समय लगा। दोबारा प्रयास करें।",
    network: "AI सेवा से कनेक्शन नहीं हो पाया। दोबारा प्रयास करें।",
    invalid: "AI का जवाब सही प्रारूप में नहीं है।",
    empty: "AI का जवाब खाली है।",
    failed: "आज का राशिफल तैयार नहीं हो पाया।",
  };

  const en: Record<FailureKind, string> = {
    config: "The AI service is not configured.",
    model: "The AI model setting is invalid.",
    auth: "AI service authentication failed.",
    "missing-model": "The configured AI model was not found.",
    busy: "The AI service is busy. Please try again shortly.",
    timeout: "The daily reading took too long. Please try again.",
    network: "Could not reach the AI service. Please try again.",
    invalid: "The AI response was not in the expected format.",
    empty: "The AI returned an empty reading.",
    failed: "The daily reading could not be prepared.",
  };

  const hinglish: Record<FailureKind, string> = {
    config: "AI service abhi configured nahi hai.",
    model: "AI model setting galat hai.",
    auth: "AI service ka authentication fail ho gaya.",
    "missing-model": "AI model available nahi hai. GEMINI_MODEL check karein.",
    busy: "AI service busy hai. Thodi der baad try karein.",
    timeout: "Jawab aane mein zyada time laga. Phir try karein.",
    network: "AI service se connection nahi ho paya. Phir try karein.",
    invalid: "AI ka jawab sahi format mein nahi hai.",
    empty: "AI ka jawab khali hai.",
    failed: "Aaj ka rashifal taiyar nahi ho paya.",
  };

  if (language === "en") return en[kind];
  if (language === "hinglish") return hinglish[kind];
  return hi[kind];
}

/**
 * Deterministic fallback: used only when the AI provider is
 * temporarily unavailable or the request times out.
 *
 * This reports the calculated Moon sign, not an AI-generated
 * prediction. It deliberately does not invent lucky numbers,
 * lucky colours, or affirmations.
 */
function calculatedDaily(language: DailyLang) {
  const moon = currentMoonSign();

  const hindi = RASHIS_HI[moon.rashi] || moon.rashiName;
  const english = RASHIS[moon.rashi] || moon.rashiName;
  const signName = language === "en" ? english : hindi;

  const focus =
    language === "en"
      ? "This is a calculated moon sign, not an AI essay. The Moon is currently in " +
        english +
        ". The longer daily writing is unavailable because the AI service is at its limit."
      : language === "hinglish"
        ? "Yeh calculated Chandra rashi hai, AI likhit rashifal nahi. Abhi Chandra " +
          english +
          " mein hai. Lambi daily writing abhi AI limit ki wajah se available nahi hai."
        : "यह गणना की गई चंद्र राशि है, एआई का लिखा राशिफल नहीं। इस समय चंद्रमा " +
          hindi +
          " में है। लंबा दैनिक लेख एआई सेवा की सीमा के कारण अभी उपलब्ध नहीं है।";

  return NextResponse.json(
    {
      reading: {
        signName,
        focus,
        source: "calculated",
      },
      prediction: focus,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

async function generateDailyReading(
  sign: string,
  language: DailyLang
) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model =
    process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;

  if (!apiKey) {
    console.error("Daily API: GEMINI_API_KEY is missing.");
    return errorResponse(
      failureMessage(language, "config"),
      503
    );
  }

  if (
    !/^[a-zA-Z0-9._-]+$/.test(model) ||
    model.startsWith("models/")
  ) {
    console.error("Daily API: Invalid GEMINI_MODEL.");
    return errorResponse(
      failureMessage(language, "model"),
      503
    );
  }

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    `${encodeURIComponent(model)}:generateContent`;

  const prompt = `
Create a concise daily astrology-style reading.

Requested sign or category: ${sign}
${languageRule(language)}

Return only a valid JSON object with these fields:
{
  "signName": "Name of sign or category",
  "focus": "Daily guidance",
  "luckyColour": {
    "name": "Colour name",
    "hex": "#RRGGBB"
  },
  "luckyNumber": 7,
  "affirmation": "Positive affirmation"
}

Rules:
- Keep guidance positive, practical and respectful.
- Do not claim future events are certain.
- Do not give medical, legal or financial guarantees.
- luckyNumber must be an integer between 1 and 99.
- luckyColour.hex must be a six-digit hexadecimal colour.
- Do not include Markdown or code fences.
`.trim();

  const generationConfig: Record<string, unknown> = {
    temperature: 0.7,
    maxOutputTokens: 1024,
    responseMimeType: "application/json",
  };

  if (/gemini-2\.5/i.test(model)) {
    generationConfig.thinkingConfig = {
      thinkingBudget: 0,
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text:
                "You are Gita AI, a calm and respectful astrology guide. " +
                "Return only valid JSON matching the requested format. " +
                languageRule(language),
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig,
      }),
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (error) {
    const timedOut =
      error instanceof Error && error.name === "AbortError";

    console.error("Daily API request failed:", {
      reason: timedOut ? "timeout" : "network_error",
    });

    return calculatedDaily(language);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    console.error("Gemini Daily API error:", {
      status: response.status,
      model,
    });

    // Authentication/configuration errors must not be hidden
    // by the calculated fallback.
    if (
      response.status === 401 ||
      response.status === 403
    ) {
      return errorResponse(
        failureMessage(language, "auth"),
        503
      );
    }

    if (response.status === 404) {
      return errorResponse(
        failureMessage(language, "missing-model"),
        503
      );
    }

    // Temporary provider errors use the calculated fallback.
    if (
      response.status === 429 ||
      response.status === 502 ||
      response.status === 503 ||
      response.status === 504
    ) {
      return calculatedDaily(language);
    }

    return errorResponse(
      failureMessage(language, "failed"),
      502
    );
  }

  let providerData: unknown;

  try {
    providerData = await response.json();
  } catch {
    return errorResponse(
      failureMessage(language, "invalid"),
      502
    );
  }

  if (
    !isRecord(providerData) ||
    !Array.isArray(providerData.candidates)
  ) {
    console.error(
      "Daily API: Invalid Gemini response structure."
    );
    return errorResponse(
      failureMessage(language, "invalid"),
      502
    );
  }

  const candidate = providerData.candidates[0];

  if (
    !isRecord(candidate) ||
    !isRecord(candidate.content)
  ) {
    return errorResponse(
      failureMessage(language, "empty"),
      502
    );
  }

  const parts = candidate.content.parts;

  if (!Array.isArray(parts)) {
    return errorResponse(
      failureMessage(language, "empty"),
      502
    );
  }

  const generatedText = parts
    .filter(
      (part): part is Record<string, unknown> =>
        isRecord(part) &&
        typeof part.text === "string" &&
        part.thought !== true
    )
    .map((part) => part.text as string)
    .join("")
    .trim();

  if (!generatedText) {
    return errorResponse(
      failureMessage(language, "empty"),
      502
    );
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(generatedText);
  } catch {
    console.error(
      "Daily API: Gemini returned invalid JSON."
    );
    return errorResponse(
      failureMessage(language, "invalid"),
      502
    );
  }

  if (!isValidReading(parsed)) {
    console.error(
      "Daily API: Response validation failed."
    );
    return errorResponse(
      failureMessage(language, "invalid"),
      502
    );
  }

  return NextResponse.json(
    {
      reading: parsed,
      prediction: parsed.focus,
      source: "gemini",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

export async function GET(request: NextRequest) {
  const sign =
    request.nextUrl.searchParams.get("sign")?.trim() ||
    "General";

  const language = resolveLanguage(
    request.nextUrl.searchParams.get("lang")
  );

  if (sign.length > 60) {
    return errorResponse(
      language === "en"
        ? "The sign name is too long."
        : language === "hinglish"
          ? "Rashi ka naam bahut lamba hai."
          : "राशि या श्रेणी का नाम बहुत लंबा है।",
      400
    );
  }

  return generateDailyReading(sign, language);
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse(
      "अनुरोध का JSON सही नहीं है।",
      400
    );
  }

  if (!isRecord(body)) {
    return errorResponse(
      "अनुरोध का प्रारूप सही नहीं है।",
      400
    );
  }

  const language = resolveLanguage(body.lang);
  const signValue = body.sign;

  if (
    signValue !== undefined &&
    typeof signValue !== "string"
  ) {
    return errorResponse(
      language === "en"
        ? "The sign name is invalid."
        : language === "hinglish"
          ? "Rashi ka naam sahi nahi hai."
          : "राशि या श्रेणी का नाम सही नहीं है।",
      400
    );
  }

  const sign =
    typeof signValue === "string" && signValue.trim()
      ? signValue.trim()
      : "General";

  if (sign.length > 60) {
    return errorResponse(
      language === "en"
        ? "The sign name is too long."
        : language === "hinglish"
          ? "Rashi ka naam bahut lamba hai."
          : "राशि या श्रेणी का नाम बहुत लंबा है।",
      400
    );
  }

  return generateDailyReading(sign, language);
}


import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUEST_TIMEOUT_MS = 30_000;
const DEFAULT_MODEL = "gemini-2.5-flash";

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

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

async function generateDailyReading(sign: string) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;

  if (!apiKey) {
    console.error("Daily API: GEMINI_API_KEY is missing.");
    return errorResponse("AI सेवा अभी कॉन्फ़िगर नहीं है।", 503);
  }

  if (
    !/^[a-zA-Z0-9._-]+$/.test(model) ||
    model.startsWith("models/")
  ) {
    console.error("Daily API: Invalid GEMINI_MODEL.");
    return errorResponse("AI मॉडल कॉन्फ़िगरेशन गलत है।", 503);
  }

  // Correct Gemini generateContent endpoint.
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    `${encodeURIComponent(model)}:generateContent`;

  const prompt = `
Create a concise daily astrology-style reading in natural Hindi.

Requested sign or category: ${sign}

Return only a valid JSON object with these fields:
{
  "signName": "Name of sign or category",
  "focus": "Daily guidance in Hindi",
  "luckyColour": {
    "name": "Colour name in Hindi",
    "hex": "#RRGGBB"
  },
  "luckyNumber": 7,
  "affirmation": "Positive affirmation in Hindi"
}

Rules:
- Write user-facing text in natural Hindi.
- Keep guidance positive, practical and respectful.
- Do not claim future events are certain.
- Do not give medical, legal or financial guarantees.
- luckyNumber must be an integer between 1 and 99.
- luckyColour.hex must be a six-digit hexadecimal colour.
- Do not include Markdown or code fences.
`.trim();

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
                "You are Gita AI, a calm and respectful Hindi astrology " +
                "guide. Return only valid JSON matching the requested format.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          responseMimeType: "application/json",
        },
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

    return errorResponse(
      timedOut
        ? "जवाब आने में अधिक समय लगा। दोबारा प्रयास करें।"
        : "AI सेवा से कनेक्शन नहीं हो पाया। दोबारा प्रयास करें।",
      timedOut ? 504 : 502
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    // Never log the API key or request URL containing secrets.
    console.error("Gemini Daily API error:", {
      status: response.status,
      model,
    });

    if (response.status === 401 || response.status === 403) {
      return errorResponse("AI सेवा का authentication विफल हुआ।", 503);
    }

    if (response.status === 404) {
      return errorResponse(
        "AI मॉडल उपलब्ध नहीं है। GEMINI_MODEL जाँचें।",
        503
      );
    }

    if (response.status === 429 || response.status === 503) {
      return errorResponse(
        "AI सेवा व्यस्त है। थोड़ी देर बाद प्रयास करें।",
        503
      );
    }

    return errorResponse("आज का राशिफल तैयार नहीं हो पाया।", 502);
  }

  let providerData: unknown;

  try {
    providerData = await response.json();
  } catch {
    return errorResponse("AI सेवा से अमान्य जवाब मिला।", 502);
  }

  if (!isRecord(providerData) || !Array.isArray(providerData.candidates)) {
    console.error("Daily API: Invalid Gemini response structure.");
    return errorResponse("AI का जवाब सही प्रारूप में नहीं है।", 502);
  }

  const candidate = providerData.candidates[0];

  if (!isRecord(candidate) || !isRecord(candidate.content)) {
    return errorResponse("AI ने कोई उपयोगी जवाब नहीं दिया।", 502);
  }

  const parts = candidate.content.parts;

  if (!Array.isArray(parts)) {
    return errorResponse("AI का जवाब खाली है।", 502);
  }

  const generatedText = parts
    .filter(
      (part): part is Record<string, unknown> =>
        isRecord(part) && typeof part.text === "string"
    )
    .map((part) => part.text as string)
    .join("")
    .trim();

  if (!generatedText) {
    return errorResponse("AI का जवाब खाली है।", 502);
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(generatedText);
  } catch {
    console.error("Daily API: Gemini returned invalid JSON.");
    return errorResponse("AI के जवाब को पढ़ने में समस्या हुई।", 502);
  }

  if (!isValidReading(parsed)) {
    console.error("Daily API: Response validation failed.");
    return errorResponse("AI के जवाब का प्रारूप गलत है।", 502);
  }

  return NextResponse.json(
    {
      reading: parsed,
      prediction: parsed.focus,
    },
    {
      headers: { "Cache-Control": "no-store, max-age=0" },
    }
  );
}

export async function GET(request: NextRequest) {
  const sign =
    request.nextUrl.searchParams.get("sign")?.trim() || "General";

  if (sign.length > 60) {
    return errorResponse("राशि या श्रेणी का नाम बहुत लंबा है।", 400);
  }

  return generateDailyReading(sign);
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("अनुरोध का JSON सही नहीं है।", 400);
  }

  if (!isRecord(body)) {
    return errorResponse("अनुरोध का प्रारूप सही नहीं है।", 400);
  }

  const signValue = body.sign;

  if (signValue !== undefined && typeof signValue !== "string") {
    return errorResponse("राशि या श्रेणी का नाम सही नहीं है।", 400);
  }

  const sign =
    typeof signValue === "string" && signValue.trim()
      ? signValue.trim()
      : "General";

  if (sign.length > 60) {
    return errorResponse("राशि या श्रेणी का नाम बहुत लंबा है।", 400);
  }

  return generateDailyReading(sign);
}

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUEST_TIMEOUT_MS = 30_000;

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
  return NextResponse.json({ error: message }, { status });
}

function isValidReading(value: unknown): value is DailyReading {
  if (!value || typeof value !== "object") {
    return false;
  }

  const reading = value as Record<string, unknown>;
  const colour = reading.luckyColour;

  if (!colour || typeof colour !== "object") {
    return false;
  }

  const luckyColour = colour as Record<string, unknown>;

  return (
    typeof reading.signName === "string" &&
    reading.signName.trim().length > 0 &&
    typeof reading.focus === "string" &&
    reading.focus.trim().length > 0 &&
    typeof luckyColour.name === "string" &&
    luckyColour.name.trim().length > 0 &&
    typeof luckyColour.hex === "string" &&
    /^#[0-9A-Fa-f]{6}$/.test(luckyColour.hex) &&
    typeof reading.luckyNumber === "number" &&
    Number.isInteger(reading.luckyNumber) &&
    reading.luckyNumber >= 1 &&
    reading.luckyNumber <= 99 &&
    typeof reading.affirmation === "string" &&
    reading.affirmation.trim().length > 0
  );
}

async function generateDailyReading(
  sign: string
): Promise<NextResponse> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    console.error("Daily API: GEMINI_API_KEY is missing.");
    return errorResponse(
      "सेवा अभी उपलब्ध नहीं है। कृपया कुछ देर बाद प्रयास करें।",
      503
    );
  }

  // ✅ फ़िक्स 1: Sahi fallback model variable set kiya (gemini-1.5-flash) taaki 404 error na aaye
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash";

  if (
    !/^[a-zA-Z0-9._-]+$/.test(model) ||
    model.startsWith("models/")
  ) {
    console.error("Daily API: Invalid GEMINI_MODEL configuration.");
    return errorResponse(
      "सेवा का कॉन्फ़िगरेशन जाँचने की आवश्यकता है।",
      503
    );
  }

  const url = `https://googleapis.com{model}:generateContent?key=${apiKey}`;

  const prompt = `
Create a concise, warm daily astrology-style reading.

Requested sign or category: ${sign}

Return ONLY a valid JSON object with exactly these fields:
{
  "signName": "${sign}",
  "focus": "Provide daily horoscope and focus in Hindi",
  "luckyColour": {
    "name": "Colour name in Hindi",
    "hex": "#RRGGBB"
  },
  "luckyNumber": 7,
  "affirmation": "Positive affirmation statement in Hindi"
}

Requirements:
- Write all user-facing text in natural Hindi.
- Keep the reading positive, practical, respectful and concise.
- Do not claim certainty about future events.
- Do not provide medical, legal or financial guarantees.
- luckyNumber must be an integer from 1 to 99.
- luckyColour.hex must be a valid six-digit hexadecimal colour.
- Do not include Markdown, code fences or text outside the JSON object.
`.trim();

  let response: Response;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "You are Gita AI, a calm, wise and respectful Hindi astrology guide. Follow the requested JSON format exactly. Always output strictly valid JSON structure.",
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
          maxOutputTokens: 1024,
          responseMimeType: "application/json",
          // ✅ फ़िक्स 2: Unsupported critical parameter 'thinkingConfig' hataya jo crash kar raha tha
        },
      }),
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Daily API: Gemini request timed out.");
      return errorResponse(
        "जवाब आने में अधिक समय lag raha hai। कृपया दोबारा प्रयास करें।",
        504
      );
    }

    console.error(
      "Daily API: Gemini request failed.",
      error instanceof Error ? error.message : "Unknown network error"
    );

    return errorResponse(
      "सेवा से कनेक्शन नहीं हो पाया। कृपया दोबारा प्रयास करें।",
      502
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const providerDetails = await response.text().catch(() => "");
    console.error(
      "Daily API: Gemini returned HTTP",
      response.status,
      providerDetails.slice(0, 500)
    );

    if (response.status === 401 || response.status === 403) {
      return errorResponse(
        "AI सेवा का प्रमाणीकरण जाँचने की आवश्यकता है।",
        503
      );
    }

    if (response.status === 404) {
      return errorResponse(
        "AI मॉडल उपलब्ध नहीं है। GEMINI_MODEL कॉन्फ़िगरेशन जाँचें।",
        503
      );
    }

    if (response.status === 429 || response.status === 503) {
      return errorResponse(
        "अभी बहुत अधिक अनुरोध हैं। कृपया थोड़ी देर बाद प्रयास करें।",
        503
      );
    }

    return errorResponse(
      "आज का मार्गदर्शन तैयार नहीं हो पाया। कृपया दोबारा प्रयास करें।",
      502
    );
  }

  let providerData: any;

  try {
    providerData = await response.json();
  } catch {
    console.error("Daily API: Gemini returned invalid response JSON.");
    return errorResponse(
      "AI सेवा से अमान्य जवाब मिला। कृपया दोबारा प्रयास करें।",
      502
    );
  }

  const generatedText = providerData.candidates?.[0]?.content?.parts
    ?.map((part: any) => part.text ?? "")
    .join("")
    .trim();

  if (!generatedText) {
    console.error("Daily API: Gemini returned empty content.");
    return errorResponse(
      "आज का मार्गदर्शन तैयार नहीं हो पाया। कृपया दोबारा प्रयास करें।",
      502
    );
  }

  let parsed: unknown;

  try {
    const cleanedText = generatedText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    parsed = JSON.parse(cleanedText);
  } catch {
    console.error("Daily API: Gemini returned invalid reading JSON.");
    return errorResponse(
      "जवाब को समझने में समस्या हुई। कृपया दोबारा प्रयास करें।",
      502
    );
  }

  if (!isValidReading(parsed)) {
    console.error("Daily API: Gemini response failed validation.");
    // ✅ फ़िक्स 3: Safe backup parser logic, agar hex strict control break ho tab bhi frontend load karega
    const fallbackReading = parsed as any;
    if (fallbackReading && fallbackReading.focus) {
      return NextResponse.json({
        reading: {
          signName: fallbackReading.signName || sign,
          focus: fallbackReading.focus,
          luckyColour: fallbackReading.luckyColour || { name: "लाल", hex: "#FF0000" },
          luckyNumber: fallbackReading.luckyNumber || 7,
          affirmation: fallbackReading.affirmation || "आज का दिन शुभ हो।"
        },
        prediction: fallbackReading.focus
      }, { headers: { "Cache-Control": "no-store" } });
    }

    return errorResponse(
      "जवाब का प्रारूप सही नहीं है। कृपया दोबारा प्रयास करें।",
      502
    );
  }

  return NextResponse.json(
    {
      reading: parsed,
      prediction: parsed.focus,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

export async function GET(request: NextRequest) {
  const sign =
    request.nextUrl.searchParams.get("sign")?.trim() || "General";

  return generateDailyReading(sign.slice(0, 60));
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("अनुरोध का JSON सही नहीं है।", 400);
  }

  if (!body || typeof body !== "object") {
    return errorResponse("अनुरोध का प्रारूप सही नहीं है।", 400);
  }

  const signValue = (body as Record<string, unknown>).sign;

  if (signValue !== undefined && typeof signValue !== "string") {
    return errorResponse("राशि या श्रेणी का नाम सही नहीं है।", 400);
  }

  const sign =
    typeof signValue === "string" && signValue.trim()
      ? signValue.trim()
      : "General";

  return generateDailyReading(sign.slice(0, 60));
}


import { NextResponse } from "next/server";

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

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

async function generateDailyReading(sign: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    return jsonError("Daily reading service is not configured", 503);
  }

  // Set GEMINI_MODEL to a model available to your API key.
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

  const endpoint =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    `${encodeURIComponent(model)}:generateContent`;

  try {
    const response = await fetch(endpoint, {
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
                "You are Gita AI, a warm and respectful Vedic astrology " +
                "assistant. Provide general spiritual guidance, not certain " +
                "predictions or medical advice. Return only valid JSON, " +
                "without Markdown or code fences. Use Hindi in Devanagari.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Generate a daily astrology reading for the zodiac sign "${sign}".

Return a JSON object with exactly these fields:
{
  "signName": "zodiac sign name in Hindi",
  "focus": "short daily guidance in Hindi",
  "luckyColour": {
    "name": "colour name in Hindi",
    "hex": "#RRGGBB"
  },
  "luckyNumber": 1,
  "affirmation": "short positive affirmation in Hindi"
}

The luckyNumber must be an integer from 1 to 99.
The luckyColour.hex must be a valid six-digit hex colour.
Keep the response concise, warm and positive.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          responseMimeType: "application/json",
        },
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });

    if (!response.ok) {
      const details = await response.text().catch(() => "");

      console.error("Gemini daily request failed:", {
        status: response.status,
        details: details.slice(0, 1000),
      });

      if (response.status === 429) {
        return jsonError("AI service is busy. Please try again later.", 429);
      }

      return jsonError(
        response.status === 401 || response.status === 403
          ? "AI service authentication failed. Check server configuration."
          : response.status === 404
            ? "Gemini model not found. Check GEMINI_MODEL."
            : "Daily reading could not be generated.",
        502
      );
    }

    const data = await response.json();

    const output = data?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? "")
      .join("")
      .trim();

    if (!output) {
      console.error("Gemini returned an empty daily reading");
      return jsonError("No daily reading was generated.", 502);
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(output);
    } catch {
      console.error("Gemini returned invalid JSON for daily reading");
      return jsonError("Daily reading response was invalid.", 502);
    }

    if (typeof parsed !== "object" || parsed === null) {
      return jsonError("Daily reading response was invalid.", 502);
    }

    const item = parsed as Partial<DailyReading>;

    const colour = item.luckyColour;

    if (
      typeof item.signName !== "string" ||
      typeof item.focus !== "string" ||
      typeof item.affirmation !== "string" ||
      typeof item.luckyNumber !== "number" ||
      !Number.isInteger(item.luckyNumber) ||
      item.luckyNumber < 1 ||
      item.luckyNumber > 99 ||
      typeof colour !== "object" ||
      colour === null ||
      typeof colour.name !== "string" ||
      typeof colour.hex !== "string" ||
      !/^#[0-9a-fA-F]{6}$/.test(colour.hex)
    ) {
      console.error("Gemini daily reading failed validation");
      return jsonError("Daily reading response had invalid fields.", 502);
    }

    const reading: DailyReading = {
      signName: item.signName,
      focus: item.focus,
      luckyColour: {
        name: colour.name,
        hex: colour.hex,
      },
      luckyNumber: item.luckyNumber,
      affirmation: item.affirmation,
    };

    return NextResponse.json(
      { reading, prediction: reading.focus },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return jsonError("Daily reading timed out. Please try again.", 504);
    }

    console.error(
      "Daily reading system error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return jsonError("Internal server error.", 500);
  }
}

// Homepage uses GET /api/daily.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const sign = url.searchParams.get("sign")?.trim() || "General";

  return generateDailyReading(sign.slice(0, 60));
}

// Also support POST requests from existing clients.
export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON request.", 400);
  }

  if (typeof body !== "object" || body === null) {
    return jsonError("Invalid request body.", 400);
  }

  const sign =
    "sign" in body && typeof body.sign === "string"
      ? body.sign.trim()
      : "General";

  return generateDailyReading((sign || "General").slice(0, 60));
}

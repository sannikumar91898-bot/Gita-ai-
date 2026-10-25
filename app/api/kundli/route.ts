
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUEST_TIMEOUT_MS = 25_000;
const MAX_ATTEMPTS = 2;

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function validCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    year >= 1900 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function validTime(value: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(value)) return false;

  const [hour, minute] = value.split(":").map(Number);

  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

function getReport(data: unknown): string {
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
        isRecord(part) && typeof part.text === "string"
    )
    .map((part) => part.text as string)
    .join("")
    .trim();
}

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid request. Please try again.", 400);
  }

  if (!isRecord(body)) {
    return jsonError("Please provide valid birth details.", 400);
  }

  const name =
    typeof body.name === "string" ? body.name.trim() : "";
  const dateOfBirth =
    typeof body.dateOfBirth === "string"
      ? body.dateOfBirth.trim()
      : "";
  const timeOfBirth =
    typeof body.timeOfBirth === "string"
      ? body.timeOfBirth.trim()
      : "";
  const placeOfBirth =
    typeof body.placeOfBirth === "string"
      ? body.placeOfBirth.trim()
      : "";

  if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth) {
    return jsonError("Please fill in all birth details.", 400);
  }

  if (
    name.length > 100 ||
    placeOfBirth.length > 200 ||
    !validCalendarDate(dateOfBirth) ||
    !validTime(timeOfBirth)
  ) {
    return jsonError(
      "Please check your name, birth date, birth time and birthplace.",
      400
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  if (dateOfBirth > today) {
    return jsonError("Birth date cannot be in the future.", 400);
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    return jsonError("Kundli service is temporarily unavailable.", 503);
  }

  const model =
    process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

  if (
    !/^[a-zA-Z0-9._-]+$/.test(model) ||
    model.startsWith("models/")
  ) {
    console.error("GEMINI_MODEL configuration is invalid");
    return jsonError("Kundli service is temporarily unavailable.", 503);
  }

  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${encodeURIComponent(model)}:generateContent`;

  const requestBody = {
    systemInstruction: {
      parts: [
        {
          text:
            "You are Gita AI, a professional and respectful Vedic astrology " +
            "guide. Respond in natural, polished Hindi using Devanagari. " +
            "Create a useful, well-structured personal astrology guidance " +
            "report based on the birth details supplied. Include traditional " +
            "Vedic astrology concepts, personality reflection, career, " +
            "relationships and practical spiritual guidance where relevant. " +
            "Do not invent planetary positions, ascendant, houses, Nakshatra " +
            "or Dasha dates as calculated facts when no verified chart data " +
            "is supplied. Do not promise guaranteed future outcomes. Use " +
            "clear headings and a warm, premium, respectful tone.",
        },
      ],
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              "Prepare a personalized Vedic astrology guidance report " +
              "in Hindi using these birth details:\n" +
              `Name: ${name}\n` +
              `Date of birth: ${dateOfBirth}\n` +
              `Time of birth: ${timeOfBirth}\n` +
              `Place of birth: ${placeOfBirth}\n\n` +
              "Organize the report with clear headings and practical, " +
              "respectful guidance. Do not present uncalculated planetary " +
              "placements or Dasha periods as facts.",
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 2048,
    },
  };

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS
    );

    let response: Response;

    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
        cache: "no-store",
      });
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      const timedOut =
        error instanceof Error &&
        (error.name === "AbortError" || error.name === "TimeoutError");

      console.error("Gemini Kundli request failed:", {
        attempt,
        reason: timedOut ? "timeout" : "network_error",
      });

      if (attempt < MAX_ATTEMPTS && !timedOut) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        continue;
      }

      return jsonError(
        timedOut
          ? "The request took too long. Please try again."
          : "Kundli service is temporarily unavailable. Please try again.",
        timedOut ? 504 : 502
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      console.error("Gemini Kundli provider error:", {
        status: response.status,
        attempt,
      });

      if (
        (response.status === 429 || response.status === 503) &&
        attempt < MAX_ATTEMPTS
      ) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        continue;
      }

      if (response.status === 429) {
        return jsonError(
          "The AI service is busy. Please try again shortly.",
          429
        );
      }

      if (response.status === 503) {
        return jsonError(
          "The AI service is temporarily busy. Please try again shortly.",
          503
        );
      }

      if (response.status === 401 || response.status === 403) {
        return jsonError(
          "Kundli service is temporarily unavailable.",
          502
        );
      }

      if (response.status === 404) {
        return jsonError(
          "Kundli service configuration needs attention.",
          502
        );
      }

      return jsonError(
        "Could not generate the report. Please try again.",
        502
      );
    }

    let data: unknown;

    try {
      data = await response.json();
    } catch {
      return jsonError("The AI returned an invalid response.", 502);
    }

    const kundliReport = getReport(data);

    if (!kundliReport) {
      console.error("Gemini Kundli response contained no report text.");
      return jsonError(
        "Could not generate the report. Please try again.",
        502
      );
    }

    return NextResponse.json(
      { kundliReport },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  return jsonError(
    "The AI service is temporarily busy. Please try again shortly.",
    503
  );
}

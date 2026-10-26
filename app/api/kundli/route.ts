import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/index";
import { aiResponseCache } from "@/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUEST_TIMEOUT_MS = 20_000;
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

function extractText(data: unknown): string {
  if (!isRecord(data) || !Array.isArray(data.candidates)) return "";

  const candidate = data.candidates[0];
  if (!isRecord(candidate) || !isRecord(candidate.content)) return "";

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

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const dateOfBirth =
    typeof body.dateOfBirth === "string" ? body.dateOfBirth.trim() : "";
  const timeOfBirth =
    typeof body.timeOfBirth === "string" ? body.timeOfBirth.trim() : "";
  const placeOfBirth =
    typeof body.placeOfBirth === "string" ? body.placeOfBirth.trim() : "";

  if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth) {
    return jsonError("Please fill in all birth details.", 400);
  }

  if (
    name.length > 100 ||
    placeOfBirth.length > 200 ||
    !validDate(dateOfBirth) ||
    !validTime(timeOfBirth)
  ) {
    return jsonError("Please check your birth details.", 400);
  }

  const today = new Date().toISOString().slice(0, 10);
  if (dateOfBirth > today) {
    return jsonError("Birth date cannot be in the future.", 400);
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim();

  if (!apiKey || !model) {
    console.error("Kundli API configuration is incomplete.", {
      missingApiKey: !apiKey,
      missingModel: !model,
    });
    return jsonError("Kundli service is not configured.", 503);
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(model)) {
    console.error("Kundli API: Invalid GEMINI_MODEL configuration.");
    return jsonError("Kundli service is not configured.", 503);
  }

  const cacheKey =
    `kundli_${dateOfBirth}_${timeOfBirth}_` +
    placeOfBirth.toLowerCase().replace(/\s+/g, "");

  try {
    const cached = await db
      .select()
      .from(aiResponseCache)
      .where(eq(aiResponseCache.questionKey, cacheKey))
      .limit(1);

    if (cached.length > 0 && cached[0].aiAnswer?.trim()) {
      return NextResponse.json(
        { kundliReport: cached[0].aiAnswer },
        { headers: { "Cache-Control": "no-store" } }
      );
    }
  } catch (error) {
    console.error(
      "Kundli cache lookup failed:",
      error instanceof Error ? error.message : "Unknown database error"
    );
  }

  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${encodeURIComponent(model)}:generateContent`;

  const requestBody = {
    systemInstruction: {
      parts: [
        {
          text:
            "You are Gita AI, a respectful Hindi astrology guide. " +
            "Write a personalized report in Hindi using Devanagari script. " +
            "Cover personality reflection, career, relationships, strengths, " +
            "challenges and practical spiritual guidance. Do not invent " +
            "calculated planetary positions, ascendant, houses, Nakshatra " +
            "or Dasha dates. Be clear that this is general interpretive " +
            "guidance unless verified chart data is provided.",
        },
      ],
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              "Create a personalized Vedic astrology guidance report in Hindi.\n" +
              `Name: ${name}\n` +
              `Date of birth: ${dateOfBirth}\n` +
              `Time of birth: ${timeOfBirth}\n` +
              `Place of birth: ${placeOfBirth}\n\n` +
              "Use clear headings for personality, career, relationships " +
              "and spiritual reflection. Do not claim uncalculated " +
              "planetary placements or Dasha periods as facts.",
          },
        ],
      },
    ],
    generationConfig: {
      maxOutputTokens: 2048,
      thinkingConfig: { thinkingLevel: "low" },
    },
  };

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(
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
    } catch (error) {
      const timedOut =
        error instanceof Error && error.name === "AbortError";

      console.error("Kundli Gemini request failed.", {
        attempt,
        reason: timedOut ? "timeout" : "network_error",
      });

      if (attempt < MAX_ATTEMPTS && !timedOut) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      return jsonError(
        timedOut
          ? "The AI request timed out. Please try again."
          : "Could not connect to the AI service. Please try again.",
        timedOut ? 504 : 502
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const retryable =
        response.status === 429 || response.status === 503;

      console.error("Kundli Gemini provider error.", {
        status: response.status,
        attempt,
        model,
      });

      if (retryable && attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        continue;
      }

      if (response.status === 429) {
        return jsonError(
          "AI service is busy. Please try again shortly.",
          429
        );
      }

      if (response.status === 503) {
        return jsonError("AI service is temporarily unavailable.", 503);
      }

      if (response.status === 401 || response.status === 403) {
        return jsonError("AI service authentication failed.", 503);
      }

      if (response.status === 404) {
        return jsonError("Configured AI model was not found.", 503);
      }

      return jsonError("Could not generate the Kundli report.", 502);
    }

    let data: unknown;

    try {
      data = await response.json();
    } catch {
      return jsonError("The AI returned an invalid response.", 502);
    }

    const kundliReport = extractText(data);

    if (!kundliReport) {
      console.error("Kundli Gemini response contained no report text.");
      return jsonError("The AI returned an empty report.", 502);
    }

    try {
      await db
        .insert(aiResponseCache)
        .values({
          id: crypto.randomUUID(),
          questionKey: cacheKey,
          originalQuestion: `Kundli report for ${name} (${dateOfBirth})`,
          aiAnswer: kundliReport,
        })
        .onConflictDoNothing();
    } catch (error) {
      console.error(
        "Kundli cache save failed:",
        error instanceof Error ? error.message : "Unknown database error"
      );
    }

    return NextResponse.json(
      { kundliReport },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  return jsonError("AI service is temporarily unavailable.", 503);
}
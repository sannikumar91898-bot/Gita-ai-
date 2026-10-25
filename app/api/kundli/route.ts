
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUEST_TIMEOUT_MS = 30_000;

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

export async function POST(req: Request) {
  try {
    // 1. Parse and validate the request body
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return jsonError("Invalid JSON request.", 400);
    }

    if (typeof body !== "object" || body === null) {
      return jsonError("Invalid request body.", 400);
    }

    const input = body as Record<string, unknown>;

    const name =
      typeof input.name === "string" ? input.name.trim() : "";
    const dateOfBirth =
      typeof input.dateOfBirth === "string"
        ? input.dateOfBirth.trim()
        : "";
    const timeOfBirth =
      typeof input.timeOfBirth === "string"
        ? input.timeOfBirth.trim()
        : "";
    const placeOfBirth =
      typeof input.placeOfBirth === "string"
        ? input.placeOfBirth.trim()
        : "";

    if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth) {
      return jsonError(
        "Name, date of birth, time of birth and birthplace are required.",
        400
      );
    }

    if (
      name.length > 100 ||
      placeOfBirth.length > 200 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) ||
      !/^\d{2}:\d{2}$/.test(timeOfBirth)
    ) {
      return jsonError(
        "Please check the name, date, time and birthplace.",
        400
      );
    }

    // Check that the date is a real calendar date.
    const [year, month, day] = dateOfBirth.split("-").map(Number);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    if (
      parsedDate.getUTCFullYear() !== year ||
      parsedDate.getUTCMonth() !== month - 1 ||
      parsedDate.getUTCDate() !== day
    ) {
      return jsonError("Date of birth is invalid.", 400);
    }

    const [hour, minute] = timeOfBirth.split(":").map(Number);

    if (hour > 23 || minute > 59) {
      return jsonError("Time of birth is invalid.", 400);
    }

    // 2. Read the API key only on the server.
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");
      return jsonError("Kundli service is not configured.", 503);
    }

    // 3. Select a model configured for this API key.
    const model =
      process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      `${encodeURIComponent(model)}:generateContent`;

    // 4. Ask Gemini for a clearly qualified interpretive report.
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
                "You are Gita AI, a respectful Vedic astrology assistant. " +
                "Respond in clear Hindi using Devanagari script. " +
                "Do not invent planetary longitudes, ascendant, houses, " +
                "Nakshatra, Vimshottari Dasha dates or chart calculations. " +
                "If exact calculated chart data is not provided, clearly " +
                "state that this is a general interpretive overview and " +
                "that exact placements and Dasha require a verified " +
                "astrological calculation engine. Do not claim certainty " +
                "about future events. Keep spiritual guidance respectful.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "Prepare a Vedic astrology overview using these birth details:\n" +
                  `Name: ${name}\n` +
                  `Date of birth: ${dateOfBirth}\n` +
                  `Time of birth: ${timeOfBirth}\n` +
                  `Place of birth: ${placeOfBirth}\n\n` +
                  "Explain general Vedic astrology concepts and spiritual " +
                  "reflection in Hindi. Do not state uncalculated planetary " +
                  "positions or Dasha periods as facts. Clearly identify " +
                  "any information that cannot be calculated from the " +
                  "provided data alone.",
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048,
        },
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });

    // 5. Handle provider errors without exposing provider details to users.
    if (!response.ok) {
      const details = await response.text().catch(() => "");

      console.error("Gemini Kundli request failed:", {
        status: response.status,
        details: details.slice(0, 1000),
      });

      if (response.status === 429) {
        return jsonError(
          "AI service is busy. Please try again later.",
          429
        );
      }

      if (response.status === 401 || response.status === 403) {
        return jsonError(
          "AI service authentication failed. Check server configuration.",
          502
        );
      }

      if (response.status === 404) {
        return jsonError(
          "Gemini model not found. Check GEMINI_MODEL.",
          502
        );
      }

      return jsonError("Kundli report could not be generated.", 502);
    }

    // 6. Extract the generated text safely.
    const data: unknown = await response.json();

    if (typeof data !== "object" || data === null) {
      return jsonError("Invalid response from AI service.", 502);
    }

    const candidates = (data as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    }).candidates;

    const kundliReport = candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!kundliReport) {
      console.error("Gemini returned no Kundli report text.");
      return jsonError("No Kundli report was generated.", 502);
    }

    // 7. Preserve the existing frontend response contract.
    return NextResponse.json(
      { kundliReport },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return jsonError(
        "Kundli request timed out. Please try again.",
        504
      );
    }

    console.error(
      "Kundli API system error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return jsonError("Internal server error.", 500);
  }
}

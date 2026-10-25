
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 10_000;
const REQUEST_TIMEOUT_MS = 30_000;

export async function POST(req: Request) {
  try {
    // 1. Validate incoming request
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request" },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("message" in body) ||
      typeof body.message !== "string"
    ) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const message = body.message.trim();

    if (!message) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: "Message is too long" },
        { status: 413 }
      );
    }

    // 2. Read secrets only from server environment variables
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");

      return NextResponse.json(
        { error: "AI service is not configured" },
        { status: 503 }
      );
    }

    // Use the model ID only, without the "models/" prefix.
    const model =
      process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";

    // 3. Build the correct Gemini API endpoint
    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/` +
      `${encodeURIComponent(model)}:generateContent`;

    // 4. Call Gemini securely
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
                "You are Gita AI, a warm, respectful and empathetic " +
                "Vedic astrology assistant. Respond clearly and kindly. " +
                "Respect the user's chosen language when provided. " +
                "Offer astrology as spiritual guidance, not as guaranteed " +
                "predictions. Never present medical, legal or financial " +
                "outcomes as certain.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });

    // 5. Handle provider errors without exposing secrets
    if (!response.ok) {
      const providerError = await response.text().catch(() => "");

      console.error("Gemini API request failed:", {
        status: response.status,
        error: providerError.slice(0, 1500),
      });

      return NextResponse.json(
        {
          error:
            response.status === 429
              ? "AI service is busy. Please try again later."
              : response.status === 401 ||
                  response.status === 403
                ? "AI service authentication failed. Check server configuration."
                : response.status === 404
                  ? "Configured AI model was not found. Check GEMINI_MODEL."
                  : "AI service request failed. Please try again later.",
        },
        { status: response.status === 429 ? 429 : 502 }
      );
    }

    // 6. Safely parse the Gemini response
    const data: unknown = await response.json();

    if (typeof data !== "object" || data === null) {
      throw new Error("Invalid Gemini response");
    }

    const candidates = (data as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    }).candidates;

    const reply = candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!reply) {
      console.error("Gemini returned no text response");

      return NextResponse.json(
        { error: "No response generated. Please try again." },
        { status: 502 }
      );
    }

    // 7. Preserve the existing frontend response format
    return NextResponse.json(
      { reply },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.name === "TimeoutError"
    ) {
      return NextResponse.json(
        { error: "AI request timed out. Please try again." },
        { status: 504 }
      );
    }

    console.error(
      "Chat API system error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

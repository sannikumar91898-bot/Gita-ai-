
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 10_000;
const REQUEST_TIMEOUT_MS = 12_000;
const MAX_ATTEMPTS = 2;

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: Request) {
  try {
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

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");

      return NextResponse.json(
        { error: "AI service is not configured" },
        { status: 503 }
      );
    }

    const model =
      process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";

    if (
      model.startsWith("models/") ||
      !/^[a-zA-Z0-9._-]+$/.test(model)
    ) {
      console.error("GEMINI_MODEL has an invalid format");

      return NextResponse.json(
        { error: "AI model configuration is invalid" },
        { status: 500 }
      );
    }

    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/models/` +
      `${encodeURIComponent(model)}:generateContent`;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      let response: Response;

      try {
        response = await fetch(endpoint, {
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
                    "Use the language of the user's message. If asked for " +
                    "Hindi, use Devanagari; for Hinglish, use Roman Hindi. " +
                    "Offer astrology as spiritual guidance, not guaranteed " +
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
      } catch (error) {
        const timedOut =
          error instanceof Error &&
          error.name === "TimeoutError";

        console.error("Gemini request transport failed:", {
          attempt,
          timedOut,
          message:
            error instanceof Error ? error.message : "Unknown error",
        });

        if (attempt < MAX_ATTEMPTS) {
          await wait(500);
          continue;
        }

        return NextResponse.json(
          {
            error: timedOut
              ? "AI request timed out. Please try again."
              : "Unable to reach the AI service. Please try again.",
          },
          { status: timedOut ? 504 : 502 }
        );
      }

      if (!response.ok) {
        const providerError = await response.text().catch(() => "");

        // Log status only: do not log API keys or provider response bodies.
        console.error("Gemini API request failed:", {
          status: response.status,
          attempt,
        });

        if (
          (response.status === 429 || response.status === 503) &&
          attempt < MAX_ATTEMPTS
        ) {
          await wait(800);
          continue;
        }

        if (response.status === 401 || response.status === 403) {
          return NextResponse.json(
            { error: "AI service authentication failed. Check server configuration." },
            { status: 502 }
          );
        }

        if (response.status === 404) {
          return NextResponse.json(
            { error: "Configured AI model was not found. Check GEMINI_MODEL." },
            { status: 502 }
          );
        }

        if (response.status === 429 || response.status === 503) {
          return NextResponse.json(
            { error: "AI service is temporarily busy. Please try again shortly." },
            { status: response.status === 429 ? 429 : 503 }
          );
        }

        // Keep the provider response out of client-visible errors.
        void providerError;

        return NextResponse.json(
          { error: "AI service request failed. Please try again later." },
          { status: 502 }
        );
      }

      let data: GeminiResponse;

      try {
        data = (await response.json()) as GeminiResponse;
      } catch {
        return NextResponse.json(
          { error: "Invalid response from AI service." },
          { status: 502 }
        );
      }

      const reply = data.candidates?.[0]?.content?.parts
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

      return NextResponse.json(
        { reply },
        {
          status: 200,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    return NextResponse.json(
      { error: "AI service is temporarily unavailable." },
      { status: 503 }
    );
  } catch (error) {
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
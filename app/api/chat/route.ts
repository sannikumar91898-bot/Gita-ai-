import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 10_000;
const REQUEST_TIMEOUT_MS = 25_000;

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
    finishReason?: string;
  }>;
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

export async function POST(req: Request) {
  try {
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return jsonError("Invalid JSON request.", 400);
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("message" in body) ||
      typeof body.message !== "string"
    ) {
      return jsonError("Message content is required.", 400);
    }

    const message = body.message.trim();

    if (!message) {
      return jsonError("Message content is required.", 400);
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return jsonError("Message is too long.", 413);
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      console.error("Chat API: GEMINI_API_KEY is missing.");
      return jsonError("AI service is not configured.", 503);
    }

    const model =
      process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";

    if (
      model.startsWith("models/") ||
      !/^[a-zA-Z0-9._-]+$/.test(model)
    ) {
      console.error("Chat API: Invalid GEMINI_MODEL configuration.");
      return jsonError("AI model configuration is invalid.", 503);
    }

    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      `${encodeURIComponent(model)}:generateContent`;

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
                  "You are Gita AI, a warm, wise, respectful and empathetic " +
                  "Vedic astrology assistant. Respond naturally and directly " +
                  "to the user's actual question. Use the language of the " +
                  "user's message. For Hindi, use Devanagari script. For " +
                  "Hinglish, use Roman Hindi. For English, use English. " +
                  "Give clear, personalized and useful spiritual guidance. " +
                  "Use Bhagavad Gita wisdom when relevant, without inventing " +
                  "scripture quotations. Do not claim certainty about future " +
                  "events or guarantee outcomes. Keep the response concise " +
                  "for simple greetings and expand when the user asks for detail.",
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
            maxOutputTokens: 2048,
            thinkingConfig: {
              thinkingLevel: "low",
            },
          },
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        cache: "no-store",
      });
    } catch (error) {
      const timedOut =
        error instanceof Error &&
        error.name === "TimeoutError";

      console.error("Chat API: Gemini transport failure.", {
        timedOut,
        error:
          error instanceof Error ? error.message : "Unknown network error",
      });

      return jsonError(
        timedOut
          ? "AI request timed out. Please try again."
          : "Unable to reach the AI service. Please try again.",
        timedOut ? 504 : 502
      );
    }

    if (!response.ok) {
      // Read the provider error for diagnosis, but never expose secrets.
      const providerText = await response.text().catch(() => "");

      let providerMessage = "";

      try {
        const parsed = JSON.parse(providerText);
        providerMessage =
          typeof parsed?.error?.message === "string"
            ? parsed.error.message
            : "";
      } catch {
        providerMessage = "";
      }

      console.error("Chat API: Gemini returned an error.", {
        status: response.status,
        model,
        providerMessage: providerMessage.slice(0, 300),
      });

      if (response.status === 401 || response.status === 403) {
        return jsonError(
          "AI service authentication failed. Check server configuration.",
          502
        );
      }

      if (response.status === 404) {
        return jsonError(
          "Configured AI model was not found. Check GEMINI_MODEL.",
          502
        );
      }

      if (response.status === 429) {
        return jsonError(
          "AI service is temporarily busy. Please try again shortly.",
          429
        );
      }

      if (response.status === 503) {
        return jsonError(
          "AI service is temporarily unavailable. Please try again shortly.",
          503
        );
      }

      return jsonError(
        "AI service request failed. Please try again later.",
        502
      );
    }

    let data: GeminiResponse;

    try {
      data = (await response.json()) as GeminiResponse;
    } catch {
      console.error("Chat API: Gemini returned invalid JSON.");
      return jsonError("Invalid response from AI service.", 502);
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!reply) {
      console.error("Chat API: Gemini returned no text.", {
        finishReason: data.candidates?.[0]?.finishReason ?? "unknown",
      });

      return jsonError(
        "No response was generated. Please try again.",
        502
      );
    }

    return NextResponse.json(
      { reply },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  } catch (error) {
    console.error(
      "Chat API: Unexpected server error.",
      error instanceof Error ? error.message : "Unknown error"
    );

    return jsonError("Internal server error. Please try again later.", 500);
  }
}
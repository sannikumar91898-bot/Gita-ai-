
const DEFAULT_MODEL = "gemini-2.5-flash";
const REQUEST_TIMEOUT_MS = 25000;

export type GeminiHistoryMessage = {
  role: "user" | "model";
  content: string;
};

type GenerateGeminiResponseArgs = {
  systemPrompt: string;
  message: string;
  history?: GeminiHistoryMessage[];
};

export async function generateGeminiResponse({
  systemPrompt,
  message,
  history = [],
}: GenerateGeminiResponseArgs): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }

  const model =
    process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;

  const cleanMessage = message.trim();

  if (!cleanMessage) {
    throw new Error("EMPTY_MESSAGE");
  }

  const contents = [
    ...history.slice(-12).map((item) => ({
      role: item.role,
      parts: [{ text: item.content }],
    })),
    {
      role: "user" as const,
      parts: [{ text: cleanMessage }],
    },
  ];

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1200,
          },
        }),
        signal: controller.signal,
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "[Gemini API]",
        response.status,
        errorText.slice(0, 500),
      );

      if (response.status === 429) {
        throw new Error("GEMINI_RATE_LIMIT");
      }

      if (response.status === 401 || response.status === 403) {
        throw new Error("GEMINI_AUTH_ERROR");
      }

      if (response.status === 404) {
        throw new Error("GEMINI_MODEL_NOT_FOUND");
      }

      throw new Error("GEMINI_PROVIDER_ERROR");
    }

    const data = await response.json();

    const answer = data.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? "")
      .join("")
      .trim();

    if (!answer) {
      console.error(
        "[Gemini API] Empty response",
        data.promptFeedback ?? data.candidates?.[0]?.finishReason,
      );

      throw new Error("GEMINI_EMPTY_RESPONSE");
    }

    return answer;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("GEMINI_TIMEOUT");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

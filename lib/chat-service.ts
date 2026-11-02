
import {
  generateGeminiResponse,
  type GeminiHistoryMessage,
} from "@/lib/gemini";

import {
  buildChatSystemPrompt,
  type ChatLanguage,
} from "@/lib/chat-prompts";

export type ChatServiceMessage = {
  role: "user" | "model";
  content: string;
};

export type ChatServiceOptions = {
  message: string;
  history?: ChatServiceMessage[];
  language?: ChatLanguage;
  astrologerName?: string;
  personaPrompt?: string;
  userName?: string;
  userContext?: string;
};

const MAX_MESSAGE_LENGTH = 8000;
const MAX_HISTORY_MESSAGES = 12;
const MAX_HISTORY_MESSAGE_LENGTH = 6000;

function validateMessage(message: string): string {
  const cleaned = message.trim();

  if (!cleaned) {
    throw new Error("EMPTY_MESSAGE");
  }

  if (cleaned.length > MAX_MESSAGE_LENGTH) {
    throw new Error("MESSAGE_TOO_LONG");
  }

  return cleaned;
}

function sanitizeHistory(
  history: ChatServiceMessage[] = [],
): GeminiHistoryMessage[] {
  const validMessages = history
    .filter(
      (item) =>
        (item.role === "user" || item.role === "model") &&
        typeof item.content === "string" &&
        item.content.trim().length > 0,
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((item) => ({
      role: item.role,
      content: item.content
        .trim()
        .slice(0, MAX_HISTORY_MESSAGE_LENGTH),
    }));

  // Gemini conversation history should begin with a user message.
  while (
    validMessages.length > 0 &&
    validMessages[0].role !== "user"
  ) {
    validMessages.shift();
  }

  // Consecutive messages with the same role are merged.
  const normalized: GeminiHistoryMessage[] = [];

  for (const item of validMessages) {
    const previous = normalized[normalized.length - 1];

    if (previous && previous.role === item.role) {
      previous.content += "\n\n" + item.content;
    } else {
      normalized.push({ ...item });
    }
  }

  return normalized;
}

export async function processChatMessage(
  options: ChatServiceOptions,
): Promise<string> {
  const message = validateMessage(options.message);

  const language: ChatLanguage =
    options.language === "hi" ||
    options.language === "en" ||
    options.language === "hinglish"
      ? options.language
      : "hinglish";

  const systemPrompt = buildChatSystemPrompt({
    language,
    astrologerName: options.astrologerName,
    personaPrompt: options.personaPrompt,
    userName: options.userName,
    userContext: options.userContext,
  });

  const history = sanitizeHistory(options.history);

  return generateGeminiResponse({
    systemPrompt,
    message,
    history,
  });
}

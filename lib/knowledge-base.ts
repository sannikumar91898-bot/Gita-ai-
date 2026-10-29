
import { getExtendedKnowledgeEntries } from "./knowledge/knowledge-adapter";

export type KnowledgeLanguage = "hi" | "hinglish" | "en";

export interface KnowledgeEntry {
  id: string;
  topic: string;
  question: string;
  aliases: string[];
  answers: Partial<Record<KnowledgeLanguage, string>>;
}

const STOP_WORDS = new Set([
  "meri", "mera", "mere", "mujhe", "kya", "kaise", "kyun", "kyon",
  "kab", "tak", "hai", "hain", "ho", "hoga", "hogi", "batao",
  "bataye", "please", "tell", "me", "my", "is", "are", "the",
  "when", "will", "what", "how", "can", "you", "about", "does",
  "do", "ki", "ka", "ke", "ko", "se", "par", "aur", "क्या",
  "कैसे", "क्यों", "कब", "होगा", "होगी", "हैं", "है", "मेरा",
  "मेरी", "मेरे", "बताएं", "बताओ", "मुझे",
]);

export function normalizeKnowledgeText(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value: string): string[] {
  return normalizeKnowledgeText(value)
    .split(" ")
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function topicRelevance(entryTopic: string, requestedTopic: string): number {
  const topic = normalizeKnowledgeText(entryTopic);
  const requested = normalizeKnowledgeText(requestedTopic);

  if (!requested || requested === "general") return 0;
  if (topic === requested) return 12;

  const groups: Record<string, string[]> = {
    love: ["marriage", "relationship", "relationships", "family"],
    family: ["marriage", "relationship", "relationships", "love"],
    career: ["career business", "career-business", "business"],
    money: ["wealth property", "wealth-property", "finance"],
    health: ["wellbeing", "health age", "health-age"],
    remedies: ["planetary doshas", "planetary-doshas", "vastu"],
    palm: ["palm reading", "palm"],
  };

  const related = groups[requested] ?? [];
  if (related.some((item) => topic.includes(item) || item.includes(topic))) {
    return 6;
  }

  if (topic === "general") return 2;
  return 0;
}

function scoreEntry(
  entry: KnowledgeEntry,
  query: string,
  queryTokens: Set<string>,
): number {
  let best = 0;

  for (const phrase of [entry.question, ...entry.aliases]) {
    const candidate = normalizeKnowledgeText(phrase);
    if (!candidate) continue;

    if (candidate === query) {
      best = Math.max(best, 100);
      continue;
    }

    if (candidate.length >= 5 && query.includes(candidate)) {
      best = Math.max(best, 85);
      continue;
    }

    if (query.length >= 5 && candidate.includes(query)) {
      best = Math.max(best, 65);
      continue;
    }

    const candidateTokens = [...new Set(tokens(candidate))];
    const shared = candidateTokens.filter((token) => queryTokens.has(token));

    if (shared.length >= 2 && candidateTokens.length > 0) {
      const overlap = shared.length / candidateTokens.length;
      best = Math.max(best, 45 + overlap * 25 + shared.length);
    } else if (shared.length === 1 && shared[0].length >= 6) {
      best = Math.max(best, 50);
    }
  }

  return best;
}

export function getKnowledgeAnswerText(
  question: string,
  language: KnowledgeLanguage = "hinglish",
  topic = "general",
): string | null {
  const query = normalizeKnowledgeText(question);
  if (!query) return null;

  const entries = getExtendedKnowledgeEntries();
  const queryTokens = new Set(tokens(query));

  let bestEntry: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of entries) {
    const lexicalScore = scoreEntry(entry, query, queryTokens);
    if (lexicalScore < 45) continue;

    // Topic is a preference, not a hard filter.
    // This allows related saved knowledge to be found when
    // the UI topic and dataset category use different names.
    const finalScore = lexicalScore + topicRelevance(entry.topic, topic);

    if (finalScore > bestScore) {
      bestScore = finalScore;
      bestEntry = entry;
    }
  }

  if (!bestEntry) return null;

  return (
    bestEntry.answers[language] ||
    bestEntry.answers.hinglish ||
    bestEntry.answers.hi ||
    bestEntry.answers.en ||
    null
  );
}

import { getExtendedKnowledgeEntries } from "./knowledge/knowledge-adapter";

export type KnowledgeLanguage = "hi" | "hinglish" | "en";

export interface KnowledgeEntry {
  id: string;
  topic: string;
  question: string;
  questions?: Partial<Record<KnowledgeLanguage, string>>;
  aliases: string[];
  answers: Partial<Record<KnowledgeLanguage, string>>;
  category?: string;
  subcategory?: string;
  answer_type?: string;
  requires_personal_chart?: boolean;
  requires_calculation?: boolean;
  keywords?: string[];
  tags?: string[];
  disclaimer?: unknown;
  confidence?: string;
  source_ids?: string[];
  [key: string]: unknown;
}

const STOP_WORDS = new Set([
  "meri", "mera", "mere", "mujhe", "mujh", "kya", "kaise",
  "kyun", "kyon", "kab", "tak", "hai", "hain", "ho", "hoga",
  "hogi", "batao", "bataye", "please", "tell", "me", "my",
  "is", "are", "the", "when", "will", "what", "how", "can",
  "you", "about", "does", "do", "ki", "ka", "ke", "ko", "se",
  "par", "aur", "क्या", "कैसे", "क्यों", "कब", "होगा", "होगी",
  "हैं", "है", "मेरा", "मेरी", "मेरे", "बताएं", "बताओ", "मुझे",
  "हूँ", "हूं",
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
    .filter(
      (token) => token.length > 1 && !STOP_WORDS.has(token),
    );
}

function topicRelevance(
  entryTopic: string,
  requestedTopic: string,
): number {
  const topic = normalizeKnowledgeText(entryTopic);
  const requested = normalizeKnowledgeText(requestedTopic);

  if (!requested || requested === "general") return 0;
  if (topic === requested) return 3;

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

  if (
    related.some(
      (item) => topic.includes(item) || item.includes(topic),
    )
  ) {
    return 2;
  }

  return 0;
}

function scorePhrase(
  phrase: string,
  query: string,
  queryTokens: Set<string>,
): number {
  const candidate = normalizeKnowledgeText(phrase);

  if (!candidate) return 0;

  // Exact question or alias.
  if (candidate === query) return 120;

  const candidateTokens = [...new Set(tokens(candidate))];

  if (candidateTokens.length === 0) return 0;

  // Strong match when a complete saved question or alias
  // appears inside the user's longer message.
  if (
    candidate.length >= 7 &&
    candidateTokens.length >= 2 &&
    query.includes(candidate)
  ) {
    return 100;
  }

  // User's complete question appears inside a saved phrase.
  if (
    query.length >= 8 &&
    queryTokens.size >= 2 &&
    candidate.includes(query)
  ) {
    return 82;
  }

  const shared = candidateTokens.filter(
    (token) => queryTokens.has(token),
  );

  // One common word is never enough.
  if (shared.length < 2) return 0;

  const candidateCoverage =
    shared.length / candidateTokens.length;

  const queryCoverage =
    shared.length / Math.max(queryTokens.size, 1);

  // Require meaningful overlap.
  if (
    candidateCoverage < 0.65 ||
    queryCoverage < 0.25
  ) {
    return 0;
  }

  return (
    58 +
    candidateCoverage * 25 +
    queryCoverage * 8
  );
}

function scoreEntry(
  entry: KnowledgeEntry,
  query: string,
  queryTokens: Set<string>,
): number {
  const phrases = [
    entry.question,
    ...Object.values(entry.questions ?? {}),
    ...entry.aliases,
    ...(entry.keywords ?? []),
  ];

  let best = 0;

  for (const phrase of phrases) {
    best = Math.max(
      best,
      scorePhrase(phrase, query, queryTokens),
    );
  }

  return best;
}

export interface KnowledgeMatch {
  entry: KnowledgeEntry;
  answer: string;
  score: number;
}

export function findKnowledgeMatch(
  question: string,
  language: KnowledgeLanguage = "hinglish",
  topic = "general",
): KnowledgeMatch | null {
  const query = normalizeKnowledgeText(question);

  if (!query) return null;

  const queryTokens = new Set(tokens(query));

  // Avoid uncertain matches for extremely short questions.
  if (queryTokens.size < 2) return null;

  const entries = getExtendedKnowledgeEntries();

  let best: KnowledgeEntry | null = null;
  let bestScore = 0;
  let secondBestScore = 0;

  for (const entry of entries) {
    const lexicalScore = scoreEntry(
      entry,
      query,
      queryTokens,
    );

    if (lexicalScore < 72) continue;

    const finalScore =
      lexicalScore + topicRelevance(entry.topic, topic);

    if (finalScore > bestScore) {
      secondBestScore = bestScore;
      bestScore = finalScore;
      best = entry;
    } else if (finalScore > secondBestScore) {
      secondBestScore = finalScore;
    }
  }

  // If two answers are almost equally likely, do not guess.
  if (
    !best ||
    bestScore < 72 ||
    bestScore - secondBestScore < 4
  ) {
    return null;
  }

  const answer =
    best.answers[language] ||
    best.answers.hinglish ||
    best.answers.hi ||
    best.answers.en;

  if (!answer) return null;

  return {
    entry: best,
    answer,
    score: bestScore,
  };
}

export function getKnowledgeAnswerText(
  question: string,
  language: KnowledgeLanguage = "hinglish",
  topic = "general",
): string | null {
  return (
    findKnowledgeMatch(question, language, topic)?.answer ?? null
  );
}

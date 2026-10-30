
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
  "meri", "mera", "mere", "mujhe", "mujh",
  "kya", "kaise", "kyun", "kyon", "kab",
  "tak", "hai", "hain", "ho", "hoga", "hogi",
  "batao", "bataye", "please", "tell", "me",
  "my", "is", "are", "the", "when", "will",
  "what", "how", "can", "you", "about", "does",
  "do", "ki", "ka", "ke", "ko", "se", "par",
  "aur", "क्या", "कैसे", "क्यों", "कब", "होगा",
  "होगी", "हैं", "है", "मेरा", "मेरी", "मेरे",
  "बताएं", "बताओ", "मुझे", "हूँ", "हूं",
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
      (token) =>
        token.length > 1 &&
        !STOP_WORDS.has(token),
    );
}

function topicRelevance(
  entryTopic: string,
  requestedTopic: string,
): number {
  const topic = normalizeKnowledgeText(entryTopic);
  const requested = normalizeKnowledgeText(requestedTopic);

  if (!requested || requested === "general") {
    return 0;
  }

  if (topic === requested) {
    return 8;
  }

  const groups: Record<string, string[]> = {
    love: [
      "marriage",
      "relationship",
      "relationships",
      "family",
      "marriage relationships",
    ],
    family: [
      "marriage",
      "relationship",
      "relationships",
      "love",
    ],
    career: [
      "career business",
      "career-business",
      "business",
    ],
    money: [
      "wealth property",
      "wealth-property",
      "finance",
    ],
    health: [
      "wellbeing",
      "health age",
      "health-age",
    ],
    remedies: [
      "planetary doshas",
      "planetary-doshas",
      "vastu",
    ],
    palm: [
      "palm reading",
      "palm",
    ],
  };

  const related = groups[requested] ?? [];

  if (
    related.some(
      (item) =>
        topic.includes(item) ||
        item.includes(topic),
    )
  ) {
    return 5;
  }

  return 0;
}

function getSearchPhrases(
  entry: KnowledgeEntry,
): string[] {
  return [
    entry.question,
    ...Object.values(entry.questions ?? {}),
    ...entry.aliases,
    ...(entry.keywords ?? []),
    ...(entry.tags ?? []),
  ]
    .filter(
      (value): value is string =>
        typeof value === "string" &&
        value.trim().length > 0,
    )
    .map((value) => value.trim());
}

function scorePhrase(
  phrase: string,
  query: string,
  queryTokens: Set<string>,
): number {
  const candidate = normalizeKnowledgeText(phrase);

  if (!candidate || !query) {
    return 0;
  }

  // Exact question, alias or keyword match.
  if (candidate === query) {
    return 125;
  }

  const candidateTokens = [
    ...new Set(tokens(candidate)),
  ];

  if (candidateTokens.length === 0) {
    return 0;
  }

  // A complete saved phrase appears in the user's question.
  if (
    candidate.length >= 8 &&
    candidateTokens.length >= 2 &&
    query.includes(candidate)
  ) {
    return 105;
  }

  // The user's complete phrase appears in a saved question.
  if (
    query.length >= 8 &&
    queryTokens.size >= 1 &&
    candidate.includes(query)
  ) {
    return 90;
  }

  /*
   * One meaningful word should not match an arbitrary entry.
   * For example, "shaadi" alone should not select an unrelated
   * marriage-timing answer.
   */
  if (queryTokens.size < 2) {
    return 0;
  }

  const shared = candidateTokens.filter(
    (token) => queryTokens.has(token),
  );

  if (shared.length < 2) {
    return 0;
  }

  const candidateCoverage =
    shared.length / candidateTokens.length;

  const queryCoverage =
    shared.length / Math.max(queryTokens.size, 1);

  if (
    candidateCoverage < 0.60 ||
    queryCoverage < 0.30
  ) {
    return 0;
  }

  return (
    58 +
    candidateCoverage * 25 +
    queryCoverage * 12
  );
}

function scoreEntry(
  entry: KnowledgeEntry,
  query: string,
  queryTokens: Set<string>,
): number {
  const phrases = getSearchPhrases(entry);

  let best = 0;

  for (const phrase of phrases) {
    best = Math.max(
      best,
      scorePhrase(
        phrase,
        query,
        queryTokens,
      ),
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

  if (!query) {
    return null;
  }

  const queryTokens = new Set(tokens(query));

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

    if (lexicalScore < 72) {
      continue;
    }

    const finalScore =
      lexicalScore +
      topicRelevance(entry.topic, topic);

    if (finalScore > bestScore) {
      secondBestScore = bestScore;
      bestScore = finalScore;
      best = entry;
    } else if (finalScore > secondBestScore) {
      secondBestScore = finalScore;
    }
  }

  // Do not guess if no strong match exists.
  if (!best || bestScore < 72) {
    return null;
  }

  // Ambiguous matches should go to Gemini instead.
  if (bestScore - secondBestScore < 4) {
    return null;
  }

  const answer =
    best.answers[language] ||
    best.answers.hinglish ||
    best.answers.hi ||
    best.answers.en;

  if (!answer) {
    return null;
  }

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
    findKnowledgeMatch(
      question,
      language,
      topic,
    )?.answer ?? null
  );
}

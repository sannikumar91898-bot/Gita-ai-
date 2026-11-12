// lib/knowledge-base.ts
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

// 🔥 FIX: Added more common conversational stop words
const STOP_WORDS = new Set([
  "meri", "mera", "mere", "mujhe", "mujh",
  "kya", "kaise", "kyun", "kyon", "kab",
  "tak", "hai", "hain", "ho", "hoga", "hogi", "honge",
  "batao", "bataye", "bataiye", "please", "tell", "me",
  "my", "is", "are", "the", "when", "will", "would", "could",
  "what", "how", "can", "you", "about", "does", "do",
  "ki", "ka", "ke", "ko", "se", "par", "ek", "bhi",
  "aur", "krna", "karna", "karne", "sakte", "sakta", "sakti",
  "liye", "liya", "raha", "rahi", "rahe", "chahiye", "tha", "thi",
  "क्या", "कैसे", "क्यों", "कब", "होगा", "होगी", "होंगे",
  "हैं", "है", "मेरा", "मेरी", "मेरे", "बताएं", "बताओ", "मुझे", "हूँ", "हूं",
  "करना", "करने", "सकते", "सकता", "सकती", "लिए", "चाहिए"
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

// 🔥 FIX: Added a simple fuzzy matcher to handle typos (e.g., shadi vs shaadi)
function isFuzzyMatch(token1: string, token2: string): boolean {
  if (token1 === token2) return true;
  if (token1.length > 3 && token2.length > 3) {
    // Basic check: if they share the first 3 characters and have similar length
    if (token1.substring(0, 3) === token2.substring(0, 3) && Math.abs(token1.length - token2.length) <= 1) {
      return true;
    }
  }
  return false;
}

function topicRelevance(entryTopic: string, requestedTopic: string): number {
  const topic = normalizeKnowledgeText(entryTopic);
  const requested = normalizeKnowledgeText(requestedTopic);

  if (!requested || requested === "general") return 0;
  if (topic === requested) return 10; // 🔥 Increased weight for exact topic match

  const groups: Record<string, string[]> = {
    love: ["marriage", "relationship", "relationships", "family", "marriage relationships"],
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

  return 0;
}

function getSearchPhrases(entry: KnowledgeEntry): string[] {
  return [
    entry.question,
    ...Object.values(entry.questions ?? {}),
    ...entry.aliases,
    ...(entry.keywords ?? []),
    ...(entry.tags ?? []),
  ]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .map((value) => value.trim());
}

function scorePhrase(phrase: string, query: string, queryTokens: Set<string>): number {
  const candidate = normalizeKnowledgeText(phrase);
  if (!candidate || !query) return 0;

  // 1. Exact match
  if (candidate === query) return 125;

  const candidateTokens = [...new Set(tokens(candidate))];
  if (candidateTokens.length === 0) return 0;

  // 2. Candidate phrase inside query
  if (candidate.length >= 8 && candidateTokens.length >= 2 && query.includes(candidate)) {
    return 105;
  }

  // 3. Query inside candidate phrase
  if (query.length >= 8 && queryTokens.size >= 1 && candidate.includes(query)) {
    return 90;
  }

  if (queryTokens.size < 2) return 0;

  // 🔥 FIX: Using fuzzy matching for token overlap
  let shared = 0;
  const matchedQueryTokens = new Set<string>();

  for (const cToken of candidateTokens) {
    for (const qToken of queryTokens) {
      if (isFuzzyMatch(cToken, qToken)) {
        shared++;
        matchedQueryTokens.add(qToken);
        break;
      }
    }
  }

  if (shared < 1) return 0; // Allow even 1 strong match if fuzzy is perfect

  const candidateCoverage = shared / candidateTokens.length;
  const queryCoverage = matchedQueryTokens.size / Math.max(queryTokens.size, 1);

  // 🔥 FIX: Relaxed thresholds so we don't miss good matches
  if (candidateCoverage < 0.40 || queryCoverage < 0.25) {
    return 0;
  }

  return 58 + candidateCoverage * 25 + queryCoverage * 15;
}

function scoreEntry(entry: KnowledgeEntry, query: string, queryTokens: Set<string>): number {
  const phrases = getSearchPhrases(entry);
  let best = 0;

  for (const phrase of phrases) {
    best = Math.max(best, scorePhrase(phrase, query, queryTokens));
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
  topic = "general"
): KnowledgeMatch | null {
  const query = normalizeKnowledgeText(question);
  if (!query) return null;

  const queryTokens = new Set(tokens(query));
  const entries = getExtendedKnowledgeEntries();

  let best: KnowledgeEntry | null = null;
  let bestScore = 0;
  let secondBestScore = 0;

  for (const entry of entries) {
    const lexicalScore = scoreEntry(entry, query, queryTokens);

    // 🔥 FIX: Skip very low lexical scores early
    if (lexicalScore < 60) continue;

    const finalScore = lexicalScore + topicRelevance(entry.topic, topic);

    if (finalScore > bestScore) {
      secondBestScore = bestScore;
      bestScore = finalScore;
      best = entry;
    } else if (finalScore > secondBestScore) {
      secondBestScore = finalScore;
    }
  }

  // 🔥 FIX: Adjusted overall threshold to 70
  if (!best || bestScore < 70) return null;

  // 🔥 FIX: Ambiguity check (If two answers are equally good, let AI handle it)
  if (bestScore - secondBestScore < 5) return null;

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
  topic = "general"
): string | null {
  return findKnowledgeMatch(question, language, topic)?.answer ?? null;
}
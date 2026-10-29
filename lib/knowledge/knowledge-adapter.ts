
import type {
  KnowledgeEntry,
  KnowledgeLanguage,
} from "../knowledge-base";

import { HEALTH_AGE_ENTRIES } from "./health-age";
import { FAVORABLE_PERIODS } from "./favorable-periods";
import { PLANETARY_DOSHAS } from "./planetary-doshas";
import { MARRIAGE_RELATIONSHIPS } from "./marriage-relationships";
import { SEED_ENTRIES } from "./wealth-property";
import { careerBusinessKnowledge } from "./career-business";

type LocalizedText = Record<KnowledgeLanguage, string>;
type RawEntry = Record<string, unknown>;

const LANGUAGES: KnowledgeLanguage[] = ["hi", "hinglish", "en"];

function asRecord(value: unknown): RawEntry {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as RawEntry;
  }

  return {};
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function localizedText(
  value: unknown,
  fallback = "",
): LocalizedText {
  const record = asRecord(value);

  return {
    hi: asText(record.hi) || fallback,
    hinglish: asText(record.hinglish) || fallback,
    en: asText(record.en) || fallback,
  };
}

function localizedQuestion(
  value: unknown,
): LocalizedText {
  if (typeof value === "string") {
    return localizedText(null, value);
  }

  return localizedText(value);
}

function toAliases(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0,
    );
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  const record = asRecord(value);

  return LANGUAGES.flatMap((language) => {
    const item = record[language];

    if (Array.isArray(item)) {
      return item.filter(
        (alias): alias is string =>
          typeof alias === "string" && alias.trim().length > 0,
      );
    }

    return typeof item === "string" && item.trim()
      ? [item.trim()]
      : [];
  });
}

function firstQuestion(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    const first = value.find(
      (item) => typeof item === "string" && item.trim(),
    );

    return typeof first === "string" ? first.trim() : "";
  }

  const record = asRecord(value);

  return (
    asText(record.hinglish) ||
    asText(record.hi) ||
    asText(record.en)
  );
}

function normalizeEntry(
  source: RawEntry,
  topicOverride?: string,
): KnowledgeEntry | null {
  const id = asText(source.id);
  const topic =
    topicOverride ||
    asText(source.subcategory) ||
    asText(source.category) ||
    asText(source.topic) ||
    "general";

  const questionSource =
    source.question ?? source.questions;

  const question = firstQuestion(questionSource);

  const answerSource =
    source.answers ?? source.answer;

  const answers = localizedText(answerSource);

  if (!question || !answers.hi && !answers.hinglish && !answers.en) {
    return null;
  }

  const aliases = [
    ...toAliases(source.aliases),
    ...toAliases(source.keywords),
    ...toAliases(source.tags),
    ...toAliases(source.questions),
  ].filter((item) => item.toLowerCase() !== question.toLowerCase());

  return {
    id: id || `${topic}-${question.slice(0, 40)}`,
    topic,
    question,
    aliases: [...new Set(aliases)],
    answers,
  };
}

function normalizeCollection(
  entries: readonly unknown[],
  topicOverride?: string,
): KnowledgeEntry[] {
  const normalized: KnowledgeEntry[] = [];

  for (const item of entries) {
    const entry = normalizeEntry(asRecord(item), topicOverride);

    if (entry) {
      normalized.push(entry);
    }
  }

  return normalized;
}

/**
 * Converts the specialized knowledge datasets into the shared
 * KnowledgeEntry format used by Gita AI.
 *
 * This function only adapts the data; it does not call Gemini,
 * perform chart calculations, or make medical/financial predictions.
 */
export function getExtendedKnowledgeEntries(): KnowledgeEntry[] {
  return [
    ...normalizeCollection(HEALTH_AGE_ENTRIES, "wellbeing"),
    ...normalizeCollection(FAVORABLE_PERIODS, "favorable-periods"),
    ...normalizeCollection(PLANETARY_DOSHAS, "planetary-doshas"),
    ...normalizeCollection(MARRIAGE_RELATIONSHIPS, "marriage-relationships"),
    ...normalizeCollection(SEED_ENTRIES, "wealth-property"),
    ...normalizeCollection(
      careerBusinessKnowledge as unknown as RawEntry[],
      "career-business",
    ),
  ];
}

/**
 * Finds entries that have a usable answer in the requested language.
 */
export function getExtendedKnowledgeAnswer(
  question: string,
  language: KnowledgeLanguage = "hinglish",
  topic?: string,
): string | null {
  const normalizedQuestion = question.toLowerCase().trim();

  if (!normalizedQuestion) {
    return null;
  }

  const entries = getExtendedKnowledgeEntries();

  const matchingEntry = entries.find((entry) => {
    if (
      topic &&
      topic !== "general" &&
      !entry.topic.toLowerCase().includes(topic.toLowerCase())
    ) {
      return false;
    }

    const searchableText = [
      entry.question,
      ...entry.aliases,
    ].join(" ").toLowerCase();

    return (
      searchableText.includes(normalizedQuestion) ||
      normalizedQuestion.includes(entry.question.toLowerCase())
    );
  });

  if (!matchingEntry) {
    return null;
  }

  return (
    matchingEntry.answers[language] ||
    matchingEntry.answers.hinglish ||
    matchingEntry.answers.hi ||
    matchingEntry.answers.en ||
    null
  );
}

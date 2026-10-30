
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

type RawEntry = Record<string, unknown>;

function asRecord(value: unknown): RawEntry {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return value as RawEntry;
  }

  return {};
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function localizedText(
  value: unknown,
): Partial<Record<KnowledgeLanguage, string>> {
  const record = asRecord(value);

  const result: Partial<
    Record<KnowledgeLanguage, string>
  > = {};

  for (const language of [
    "hi",
    "hinglish",
    "en",
  ] as const) {
    const text = asText(record[language]);

    if (text) {
      result[language] = text;
    }
  }

  return result;
}

function localizedQuestions(
  value: unknown,
): Partial<Record<KnowledgeLanguage, string>> {
  if (typeof value === "string") {
    return value.trim()
      ? { hinglish: value.trim() }
      : {};
  }

  return localizedText(value);
}

function toAliases(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter(
        (item): item is string =>
          typeof item === "string" &&
          item.trim().length > 0,
      )
      .map((item) => item.trim());
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  const record = asRecord(value);

  return (
    ["hi", "hinglish", "en"] as const
  ).flatMap((language) => {
    const item = record[language];

    if (Array.isArray(item)) {
      return item
        .filter(
          (alias): alias is string =>
            typeof alias === "string" &&
            alias.trim().length > 0,
        )
        .map((alias) => alias.trim());
    }

    return typeof item === "string" && item.trim()
      ? [item.trim()]
      : [];
  });
}

function firstQuestion(
  questions: Partial<
    Record<KnowledgeLanguage, string>
  >,
): string {
  return (
    questions.hinglish ||
    questions.hi ||
    questions.en ||
    ""
  );
}

function normalizeEntry(
  source: RawEntry,
  topicOverride?: string,
): KnowledgeEntry | null {
  const questions = localizedQuestions(
    source.questions ?? source.question,
  );

  const question = firstQuestion(questions);

  const answers = localizedText(
    source.answers ?? source.answer,
  );

  if (
    !question ||
    !Object.values(answers).some(Boolean)
  ) {
    return null;
  }

  const aliases = [
    ...toAliases(source.aliases),
    ...toAliases(source.keywords),
    ...toAliases(source.tags),
  ].filter(
    (item) =>
      item.toLowerCase() !== question.toLowerCase(),
  );

  const topic =
    topicOverride ||
    asText(source.subcategory) ||
    asText(source.category) ||
    asText(source.topic) ||
    "general";

  // Keep original metadata available to the matching layer.
  // The original question-answer source files are never modified.
  return {
    ...source,

    id:
      asText(source.id) ||
      `${topic}-${question.slice(0, 40)}`,

    topic,

    category:
      asText(source.category) || topic,

    subcategory:
      asText(source.subcategory) || "",

    question,
    questions,

    aliases: [...new Set(aliases)],

    answers,

    answer_type:
      asText(source.answer_type) || undefined,

    requires_personal_chart:
      typeof source.requires_personal_chart === "boolean"
        ? source.requires_personal_chart
        : undefined,

    requires_calculation:
      typeof source.requires_calculation === "boolean"
        ? source.requires_calculation
        : undefined,

    keywords: toAliases(source.keywords),
    tags: toAliases(source.tags),

    disclaimer: source.disclaimer,

    confidence:
      asText(source.confidence) || undefined,

    source_ids: Array.isArray(source.source_ids)
      ? source.source_ids.filter(
          (item): item is string =>
            typeof item === "string",
        )
      : undefined,
  };
}

function normalizeCollection(
  entries: readonly unknown[],
  topicOverride?: string,
): KnowledgeEntry[] {
  const normalized: KnowledgeEntry[] = [];

  for (const item of entries) {
    const entry = normalizeEntry(
      asRecord(item),
      topicOverride,
    );

    if (entry) {
      normalized.push(entry);
    }
  }

  return normalized;
}

/**
 * Adapts all existing knowledge datasets into one common format.
 * Original question-answer files remain untouched.
 */
export function getExtendedKnowledgeEntries(): KnowledgeEntry[] {
  return [
    ...normalizeCollection(
      HEALTH_AGE_ENTRIES,
      "wellbeing",
    ),

    ...normalizeCollection(
      FAVORABLE_PERIODS,
      "favorable-periods",
    ),

    ...normalizeCollection(
      PLANETARY_DOSHAS,
      "planetary-doshas",
    ),

    ...normalizeCollection(
      MARRIAGE_RELATIONSHIPS,
      "marriage-relationships",
    ),

    ...normalizeCollection(
      SEED_ENTRIES,
      "wealth-property",
    ),

    ...normalizeCollection(
      careerBusinessKnowledge as unknown as RawEntry[],
      "career-business",
    ),
  ];
}

/**
 * Compatibility helper for older callers.
 */
export function getExtendedKnowledgeAnswer(
  question: string,
  language: KnowledgeLanguage = "hinglish",
  topic?: string,
): string | null {
  const normalizedQuestion = question
    .toLowerCase()
    .trim();

  if (!normalizedQuestion) return null;

  const entries = getExtendedKnowledgeEntries();

  const match = entries.find((entry) => {
    if (
      topic &&
      topic !== "general" &&
      !entry.topic
        .toLowerCase()
        .includes(topic.toLowerCase())
    ) {
      return false;
    }

    const searchableText = [
      entry.question,
      ...Object.values(entry.questions ?? {}),
      ...entry.aliases,
      ...(entry.keywords ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuestion);
  });

  if (!match) return null;

  return (
    match.answers[language] ||
    match.answers.hinglish ||
    match.answers.hi ||
    match.answers.en ||
    null
  );
}

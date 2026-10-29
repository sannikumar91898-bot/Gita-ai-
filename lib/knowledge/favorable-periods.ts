
import type { FavorablePeriodEntry } from "./favorable-periods.types";
import { FAVORABLE_PERIODS_001 } from "./favorable-periods-001";
import { FAVORABLE_PERIODS_002 } from "./favorable-periods-002";
import { FAVORABLE_PERIODS_003 } from "./favorable-periods-003";

export * from "./favorable-periods.types";
export {
  PERIOD_DISCLAIMER,
  FEMALE_ASTROLOGER_PERIOD_STYLE,
} from "./favorable-periods-shared";

export const FAVORABLE_PERIODS: FavorablePeriodEntry[] = [
  ...FAVORABLE_PERIODS_001,
  ...FAVORABLE_PERIODS_002,
  ...FAVORABLE_PERIODS_003,
];

export function getFavorablePeriodEntries(): FavorablePeriodEntry[] {
  return FAVORABLE_PERIODS;
}

export function findFavorablePeriodById(
  id: string,
): FavorablePeriodEntry | undefined {
  return FAVORABLE_PERIODS.find((entry) => entry.id === id);
}

export function searchFavorablePeriods(
  query: string,
): FavorablePeriodEntry[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) return [];

  return FAVORABLE_PERIODS.filter((entry) => {
    const searchableText = [
      entry.category,
      entry.subcategory,
      ...entry.keywords,
      entry.questions.hi,
      entry.questions.hinglish,
      entry.questions.en,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

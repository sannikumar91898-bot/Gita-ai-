
export type PeriodLanguage = "hi" | "hinglish" | "en";

export interface PeriodLocalizedText {
  hi: string;
  hinglish: string;
  en: string;
}

export type PeriodAnswerType =
  | "traditional_astrology"
  | "emotional_support"
  | "practical_guidance"
  | "spiritual_guidance"
  | "safety_information";

export interface FavorablePeriodEntry {
  id: string;
  category: string;
  subcategory: string;
  questions: PeriodLocalizedText;
  answers: PeriodLocalizedText;
  answer_type: PeriodAnswerType;
  requires_personal_chart: boolean;
  requires_calculation: boolean;
  keywords: string[];
  tags: string[];
  disclaimer: PeriodLocalizedText;
}

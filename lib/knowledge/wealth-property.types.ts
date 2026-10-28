export type Language = "en" | "hi" | "hinglish";

export type AnswerType =
  | "traditional_astrology"
  | "financial_education"
  | "property_legal_information"
  | "spiritual_guidance";

export type Confidence =
  | "source_supported"
  | "traditional_interpretation"
  | "general_education"
  | "uncertain";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface LocalizedText {
  en: string;
  hi: string;
  hinglish: string;
}

export interface WealthPropertyEntry {
  id: string;
  category: string;
  subcategory: string;
  difficulty: Difficulty;
  questions: LocalizedText;
  answers: LocalizedText;
  answer_type: AnswerType;
  requires_personal_chart: boolean;
  requires_calculation: boolean;
  source_ids: string[];
  confidence: Confidence;
  disclaimer: string;
  aliases?: Partial<Record<Language, string[]>>;
  tags?: string[];
}

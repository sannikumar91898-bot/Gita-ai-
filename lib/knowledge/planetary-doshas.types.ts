
export type DoshaLanguage = "hi" | "hinglish" | "en";

export interface DoshaLocalizedText {
  hi: string;
  hinglish: string;
  en: string;
}

export type DoshaAnswerType =
  | "traditional_astrology"
  | "spiritual_guidance"
  | "emotional_support"
  | "safety_information";

export interface PlanetaryDoshaEntry {
  id: string;
  category: string;
  subcategory: string;
  questions: DoshaLocalizedText;
  answers: DoshaLocalizedText;
  answer_type: DoshaAnswerType;
  requires_personal_chart: boolean;
  requires_calculation: boolean;
  keywords: string[];
  tags: string[];
  disclaimer: DoshaLocalizedText;
}

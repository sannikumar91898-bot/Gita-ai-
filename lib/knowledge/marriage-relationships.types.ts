
export type Language = "en" | "hi" | "hinglish";

export type AnswerType =
  | "traditional_astrology"
  | "relationship_guidance"
  | "spiritual_guidance"
  | "financial_education"
  | "safety_information";

export type Confidence =
  | "source_supported"
  | "traditional_interpretation"
  | "general_education"
  | "uncertain";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type EmotionalTone =
  | "warm"
  | "gentle"
  | "reassuring"
  | "empathetic"
  | "neutral"
  | "serious";

export type GuidanceDomain =
  | "marriage"
  | "love"
  | "communication"
  | "trust"
  | "attachment"
  | "breakup"
  | "family"
  | "compatibility"
  | "boundaries"
  | "mental_wellbeing"
  | "spirituality"
  | "safety";

export interface LocalizedText {
  en: string;
  hi: string;
  hinglish: string;
}

export interface FemaleAstrologerStyle {
  voice: "warm_female";
  tone: EmotionalTone;
  empathy_required: boolean;
  avoid_judgment: boolean;
  avoid_fear_based_predictions: boolean;
  encourage_user_autonomy: boolean;
}

export interface MarriageRelationshipEntry {
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
  tags: string[];

  guidance_domain?: GuidanceDomain;
  emotional_tone?: EmotionalTone;
  female_astrologer_style?: FemaleAstrologerStyle;
}

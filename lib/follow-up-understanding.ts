
/**
 * GITA AI — FOLLOW-UP UNDERSTANDING ENGINE
 *
 * Purpose:
 * - Understand short and incomplete follow-up questions.
 * - Connect them to the correct previous user question.
 * - Recognise Hindi, Hinglish and English.
 * - Distinguish a new question from a follow-up.
 * - Identify the user's follow-up intention.
 *
 * This module does not call Gemini or any external API.
 */

export type FollowUpRole = "user" | "assistant" | "model";

export type FollowUpHistoryMessage = {
  role: string;
  content: string;
};

export type FollowUpIntent =
  | "time"
  | "reason"
  | "explanation"
  | "detail"
  | "remedy"
  | "confirmation"
  | "next_step"
  | "comparison"
  | "correction"
  | "continuation"
  | "new_question";

export type FollowUpUnderstanding = {
  isFollowUp: boolean;
  intent: FollowUpIntent;
  currentMessage: string;
  referenceQuestion: string | null;
  previousAssistantAnswer: string | null;
  contextQuestions: string[];
  confidence: "high" | "medium" | "low";
};

const MAX_CONTEXT_QUESTIONS = 4;
const MAX_REFERENCE_LENGTH = 2500;
const MAX_ANSWER_LENGTH = 3500;

/* ---------------------------------------------------------
   TEXT NORMALIZATION
--------------------------------------------------------- */

export function normalizeFollowUpText(
  value: string,
): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanMessage(value: string): string {
  return typeof value === "string"
    ? value.trim().slice(0, MAX_REFERENCE_LENGTH)
    : "";
}

/* ---------------------------------------------------------
   FOLLOW-UP PHRASE LIBRARY
--------------------------------------------------------- */

const TIME_PATTERNS = [
  /^kab(\s+tak)?$/,
  /^kab\s+hoga$/,
  /^kab\s+hogi$/,
  /^kitne\s+samay\s+mein$/,
  /^kitne\s+din\s+mein$/,
  /^how\s+long$/,
  /^by\s+when$/,
  /^when$/,
  /^when\s+will\s+it\s+happen$/,
  /^what\s+time$/,
  /^kis\s+samay$/,
  /^kis\s+umar\s+mein$/,
  /^kis\s+age\s+mein$/,
  /^kaun\s+se\s+saal\s+mein$/,
];

const REASON_PATTERNS = [
  /^kyun$/,
  /^kyon$/,
  /^aisa\s+kyun$/,
  /^aisa\s+kyun\s+hoga$/,
  /^aisa\s+kyun\s+hogi$/,
  /^iska\s+karan$/,
  /^kya\s+karan\s+hai$/,
  /^why$/,
  /^why\s+is\s+that$/,
  /^what\s+is\s+the\s+reason$/,
  /^how\s+come$/,
];

const EXPLANATION_PATTERNS = [
  /^iska\s+matlab$/,
  /^iska\s+matlab\s+kya\s+hai$/,
  /^matlab\s+kya$/,
  /^samjhao$/,
  /^samjhaiye$/,
  /^samjha\s+do$/,
  /^explain$/,
  /^what\s+does\s+that\s+mean$/,
  /^what\s+do\s+you\s+mean$/,
  /^meaning$/,
  /^iska\s+arth$/,
];

const DETAIL_PATTERNS = [
  /^aur\s+batao$/,
  /^aur\s+detail$/,
  /^aur\s+detail\s+mein$/,
  /^thoda\s+detail\s+mein$/,
  /^vistaar\s+se$/,
  /^vistar\s+se$/,
  /^poori\s+detail$/,
  /^detail\s+mein\s+batao$/,
  /^elaborate$/,
  /^tell\s+me\s+more$/,
  /^more\s+details$/,
  /^in\s+detail$/,
  /^go\s+deeper$/,
];

const REMEDY_PATTERNS = [
  /^iska\s+upay$/,
  /^koi\s+upay$/,
  /^kya\s+upay\s+hai$/,
  /^koi\s+solution$/,
  /^iska\s+solution$/,
  /^kya\s+karna\s+chahiye$/,
  /^ab\s+kya\s+karu$/,
  /^ab\s+kya\s+karna\s+chahiye$/,
  /^mujhe\s+kya\s+karna\s+chahiye$/,
  /^what\s+should\s+i\s+do$/,
  /^any\s+remedy$/,
  /^any\s+solution$/,
  /^how\s+to\s+fix\s+this$/,
];

const CONFIRMATION_PATTERNS = [
  /^kya\s+yeh\s+sahi\s+hai$/,
  /^kya\s+yeh\s+sach\s+hai$/,
  /^pakka$/,
  /^sach\s+mein$/,
  /^really$/,
  /^are\s+you\s+sure$/,
  /^is\s+that\s+true$/,
  /^confirm$/,
  /^haan$/,
  /^haa$/,
  /^ha$/,
  /^ji$/,
  /^yes$/,
  /^okay$/,
  /^ok$/,
  /^hmm$/,
];

const NEXT_STEP_PATTERNS = [
  /^ab\s+kya$/,
  /^ab\s+aage\s+kya$/,
  /^aage\s+kya$/,
  /^next\s+step$/,
  /^what\s+next$/,
  /^what\s+should\s+i\s+do\s+next$/,
  /^phir\s+kya$/,
  /^iske\s+baad\s+kya$/,
  /^now\s+what$/,
];

const COMPARISON_PATTERNS = [
  /^dono\s+mein\s+kya\s+antar$/,
  /^ismein\s+antar\s+kya$/,
  /^kaunsa\s+behtar$/,
  /^kaun\s+sa\s+better$/,
  /^which\s+one\s+is\s+better$/,
  /^what\s+is\s+the\s+difference$/,
  /^compare\s+them$/,
];

const CORRECTION_PATTERNS = [
  /^mera\s+matlab$/,
  /^mera\s+matlab\s+yeh\s+hai$/,
  /^main\s+yeh\s+poochh\s+raha$/,
  /^main\s+yeh\s+pooch\s+raha$/,
  /^i\s+mean$/,
  /^what\s+i\s+meant$/,
  /^let\s+me\s+clarify$/,
  /^actually$/,
];

const CONTINUATION_PATTERNS = [
  /^aur$/,
  /^aur\s+kuch$/,
  /^phir$/,
  /^uske\s+baad$/,
  /^iske\s+baare\s+mein$/,
  /^is\s+baare\s+mein$/,
  /^usi\s+ke\s+baare\s+mein$/,
  /^pehle\s+jo\s+bataya$/,
  /^aapne\s+jo\s+bataya$/,
  /^aapne\s+pehle\s+kaha$/,
  /^pichhle\s+jawab\s+ke\s+baare\s+mein$/,
  /^what\s+you\s+said\s+earlier$/,
  /^about\s+the\s+previous\s+answer$/,
  /^continue$/,
  /^go\s+on$/,
];

type PatternGroup = {
  intent: FollowUpIntent;
  patterns: RegExp[];
};

const INTENT_GROUPS: PatternGroup[] = [
  { intent: "time", patterns: TIME_PATTERNS },
  { intent: "reason", patterns: REASON_PATTERNS },
  { intent: "explanation", patterns: EXPLANATION_PATTERNS },
  { intent: "detail", patterns: DETAIL_PATTERNS },
  { intent: "remedy", patterns: REMEDY_PATTERNS },
  { intent: "confirmation", patterns: CONFIRMATION_PATTERNS },
  { intent: "next_step", patterns: NEXT_STEP_PATTERNS },
  { intent: "comparison", patterns: COMPARISON_PATTERNS },
  { intent: "correction", patterns: CORRECTION_PATTERNS },
  { intent: "continuation", patterns: CONTINUATION_PATTERNS },
];

/* ---------------------------------------------------------
   STANDALONE QUESTION DETECTION
--------------------------------------------------------- */

/**
 * These phrases usually introduce a complete new topic.
 * A short question is not automatically a follow-up.
 */
const NEW_QUESTION_PATTERNS = [
  /^(meri|mera|mere)\s+(shaadi|shadi|vivah|career|naukri|job|padhai|education|business|health|sehat|kundli|janam\s+kundli)\b/,
  /^(what|who|where|when|why|how)\s+(is|are|was|were|does|do|can|should|will)\b/,
  /^(what|who|where|when|why|how)\s+(is|are|was|were|does|do|can|should|will)\s+.+/,
  /^(kundli|horoscope|astrology|jyotish|vastu|career|government\s+job|sarkari\s+naukri|marriage|shaadi|business)\s+(kya|kaise|kab|what|how|when)\b/,
  /^(tell\s+me\s+about|explain\s+what|define|meaning\s+of)\s+/,
  /^(mujhe|main)\s+(ek|naya|alag)\s+(sawal|question|baat)\s+poochhna\s+hai/,
];

function isClearlyNewQuestion(
  normalized: string,
): boolean {
  return NEW_QUESTION_PATTERNS.some((pattern) =>
    pattern.test(normalized),
  );
}

/* ---------------------------------------------------------
   INTENT DETECTION
--------------------------------------------------------- */

function detectIntent(
  normalized: string,
): FollowUpIntent | null {
  for (const group of INTENT_GROUPS) {
    if (
      group.patterns.some((pattern) =>
        pattern.test(normalized),
      )
    ) {
      return group.intent;
    }
  }

  // Common natural-language continuation phrases.
  if (
    /\b(iska|iski|iske|uska|uski|uske|yeh|ye|woh|vo|that|this|it|its|there)\b/.test(
      normalized,
    ) &&
    /\b(matlab|meaning|reason|upay|solution|detail|baare|baare mein|liye|kaise|kab|kyun|kyon)\b/.test(
      normalized,
    )
  ) {
    if (/\b(kab|when|time|tak)\b/.test(normalized)) {
      return "time";
    }

    if (/\b(kyun|kyon|reason|karan)\b/.test(normalized)) {
      return "reason";
    }

    if (/\b(upay|solution|remedy|fix)\b/.test(normalized)) {
      return "remedy";
    }

    if (/\b(detail|vistaar|vistar)\b/.test(normalized)) {
      return "detail";
    }

    return "explanation";
  }

  return null;
}

/* ---------------------------------------------------------
   HISTORY HELPERS
--------------------------------------------------------- */

function getRecentUserQuestions(
  history: FollowUpHistoryMessage[],
): string[] {
  return history
    .filter((item) => item.role === "user")
    .map((item) => cleanMessage(item.content))
    .filter(Boolean)
    .slice(-MAX_CONTEXT_QUESTIONS);
}

function getLastAssistantAnswer(
  history: FollowUpHistoryMessage[],
): string | null {
  const answer = [...history]
    .reverse()
    .find(
      (item) =>
        (item.role === "assistant" || item.role === "model") &&
        typeof item.content === "string" &&
        item.content.trim().length > 0,
    );

  return answer
    ? cleanMessage(answer.content).slice(0, MAX_ANSWER_LENGTH)
    : null;
}

function getLastUserQuestion(
  history: FollowUpHistoryMessage[],
): string | null {
  const question = [...history]
    .reverse()
    .find(
      (item) =>
        item.role === "user" &&
        typeof item.content === "string" &&
        item.content.trim().length > 0,
    );

  return question
    ? cleanMessage(question.content)
    : null;
}

function hasConversation(history: FollowUpHistoryMessage[]): boolean {
  return history.some(
    (item) =>
      (item.role === "user" || item.role === "assistant" || item.role === "model") &&
      typeof item.content === "string" &&
      item.content.trim().length > 0,
  );
}

/* ---------------------------------------------------------
   CONTEXTUAL FOLLOW-UP DETECTION
--------------------------------------------------------- */

/**
 * Returns true when the current message depends on the previous
 * conversation to be understood.
 *
 * Examples:
 * "Kab tak?" -> Follow-up
 * "Kyun?" -> Follow-up
 * "Iska matlab?" -> Follow-up
 * "Meri government job kab lagegi?" -> New question
 */
function isContextDependentMessage(
  message: string,
  normalized: string,
): boolean {
  if (!message || !normalized) return false;

  if (isClearlyNewQuestion(normalized)) {
    return false;
  }

  if (detectIntent(normalized)) {
    return true;
  }

  // Explicit reference to earlier discussion.
  const referencesEarlierContext =
    /\b(pehle|pichhle|previous|earlier|aapne|tumne|you said|you told|uske|uski|uska|iske|iski|iska|yeh|ye|woh|vo|that|this|it)\b/.test(
      normalized,
    );

  if (referencesEarlierContext) {
    return true;
  }

  // Very short conversational fragments usually need context.
  const words = normalized.split(/\s+/).filter(Boolean);

  if (words.length <= 2) {
    return true;
  }

  // Explicit request to continue the previous topic.
  if (
    /\b(aur bataiye|aur batao|continue karo|aage batao|detail se batao|samjha dijiye|samjha do)\b/.test(
      normalized,
    )
  ) {
    return true;
  }

  return false;
}

/* ---------------------------------------------------------
   MAIN UNDERSTANDING FUNCTION
--------------------------------------------------------- */

export function understandFollowUp(
  message: string,
  history: FollowUpHistoryMessage[] = [],
): FollowUpUnderstanding {
  const currentMessage = cleanMessage(message);
  const normalized = normalizeFollowUpText(currentMessage);

  const referenceQuestion = getLastUserQuestion(history);
  const previousAssistantAnswer = getLastAssistantAnswer(history);
  const contextQuestions = getRecentUserQuestions(history);

  const hasHistory = hasConversation(history);

  const intent = detectIntent(normalized);

  // No previous conversation: always treat as a new question.
  if (!hasHistory || !referenceQuestion) {
    return {
      isFollowUp: false,
      intent: "new_question",
      currentMessage,
      referenceQuestion: null,
      previousAssistantAnswer: null,
      contextQuestions: [],
      confidence: "high",
    };
  }

  // A complete new question should not be attached to old context.
  if (isClearlyNewQuestion(normalized)) {
    return {
      isFollowUp: false,
      intent: "new_question",
      currentMessage,
      referenceQuestion: null,
      previousAssistantAnswer: null,
      contextQuestions,
      confidence: "high",
    };
  }

  const isFollowUp = isContextDependentMessage(
    currentMessage,
    normalized,
  );

  if (!isFollowUp) {
    return {
      isFollowUp: false,
      intent: "new_question",
      currentMessage,
      referenceQuestion: null,
      previousAssistantAnswer: null,
      contextQuestions,
      confidence: "medium",
    };
  }

  const words = normalized.split(/\s+/).filter(Boolean);

  const confidence: "high" | "medium" | "low" =
    intent || words.length <= 2
      ? "high"
      : "medium";

  return {
    isFollowUp: true,
    intent: intent ?? "continuation",
    currentMessage,
    referenceQuestion,
    previousAssistantAnswer,
    contextQuestions,
    confidence,
  };
}

/* ---------------------------------------------------------
   GEMINI CONTEXT BUILDER
--------------------------------------------------------- */

/**
 * Build a concise context block for Gemini.
 *
 * Important:
 * This is contextual data, not a replacement for the actual
 * conversation history. Send actual history separately too.
 */
export function buildFollowUpContext(
  understanding: FollowUpUnderstanding,
): string {
  if (!understanding.isFollowUp) {
    return [
      "FOLLOW-UP UNDERSTANDING:",
      "The latest message has been classified as a new question.",
      "Do not force the previous topic into this answer.",
      "Answer the current question on its own meaning.",
    ].join("\n");
  }

  const intentDescriptions: Record<FollowUpIntent, string> = {
    time: "The user is asking about timing or duration.",
    reason: "The user is asking why or asking for the reason.",
    explanation: "The user wants the previous point explained.",
    detail: "The user wants more detail about the previous topic.",
    remedy: "The user wants a remedy, solution or next action for the previous topic.",
    confirmation: "The user is confirming or questioning the previous answer.",
    next_step: "The user wants to know what to do next.",
    comparison: "The user wants a comparison related to the previous discussion.",
    correction: "The user is clarifying or correcting their earlier meaning.",
    continuation: "The user wants to continue the previous discussion.",
    new_question: "The user is asking a new question.",
  };

  return [
    "FOLLOW-UP UNDERSTANDING:",
    "The latest message depends on the previous conversation.",
    `Follow-up intent: ${understanding.intent}.`,
    intentDescriptions[understanding.intent],
    `Previous user question: ${understanding.referenceQuestion ?? "Not available"}`,
    understanding.previousAssistantAnswer
      ? `Previous assistant answer: ${understanding.previousAssistantAnswer}`
      : "Previous assistant answer is not available.",
    "Understand what the user is referring to before answering.",
    "Answer the exact follow-up first.",
    "Do not repeat the entire previous answer.",
    "Do not ask the user to repeat information already present in the conversation.",
    "If the previous answer did not establish a fact, do not invent it.",
    "If the follow-up is ambiguous even after checking the history, ask one short clarification question.",
  ].join("\n");
}

/* ---------------------------------------------------------
   SIMPLE HELPER FOR EXISTING ROUTE
--------------------------------------------------------- */

/**
 * Backward-compatible helper for code that only needs a boolean.
 */
export function isFollowUpMessage(
  message: string,
  history: FollowUpHistoryMessage[] = [],
): boolean {
  return understandFollowUp(message, history).isFollowUp;
}

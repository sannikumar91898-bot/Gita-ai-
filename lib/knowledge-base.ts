
export function getKnowledgeAnswerText(
  question: string,
  language: KnowledgeLanguage = "hinglish",
  topic = "general"
): string | null {
  const query = normalizeKnowledgeText(question);
  if (!query) return null;

  const baseEntries: KnowledgeEntry[] = SEEDS.map((entry, index) => ({
    ...entry,
    id: `seed-${index + 1}`,
  }));

  const entries = [
    ...baseEntries,
    ...getExtendedKnowledgeEntries(),
  ];

  const candidates = entries.filter((entry) =>
    topicMatches(entry.topic, topic)
  );

  const stopWords = new Set([
    "meri", "mera", "mere", "mujhe", "kya", "kaise", "kyun",
    "kyon", "kab", "tak", "hai", "hain", "ho", "hoga", "hogi",
    "batao", "bataye", "please", "tell", "me", "my", "is",
    "are", "the", "when", "will", "what", "how", "can",
    "you", "about", "does", "do", "ki", "ka", "ke", "ko",
    "se", "par", "aur", "क्या", "कैसे", "क्यों", "कब",
    "होगा", "होगी", "हैं", "है", "मेरा", "मेरी", "मेरे",
    "बताएं", "बताओ", "मुझे",
  ]);

  function tokens(value: string): string[] {
    return normalizeKnowledgeText(value)
      .split(" ")
      .filter((token) => token.length > 1 && !stopWords.has(token));
  }

  const queryTokens = new Set(tokens(query));
  let bestEntry: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of candidates) {
    const phrases = [entry.question, ...entry.aliases];
    let entryScore = 0;

    for (const phrase of phrases) {
      const candidate = normalizeKnowledgeText(phrase);
      if (!candidate) continue;

      if (candidate === query) {
        entryScore = Math.max(entryScore, 100);
        continue;
      }

      if (candidate.length >= 5 && query.includes(candidate)) {
        entryScore = Math.max(entryScore, 85);
        continue;
      }

      if (query.length >= 5 && candidate.includes(query)) {
        entryScore = Math.max(entryScore, 65);
        continue;
      }

      const candidateTokens = [...new Set(tokens(candidate))];
      const shared = candidateTokens.filter((token) =>
        queryTokens.has(token)
      );

      if (shared.length >= 2) {
        const overlap = shared.length / candidateTokens.length;
        entryScore = Math.max(
          entryScore,
          45 + overlap * 25 + shared.length
        );
      } else if (
        shared.length === 1 &&
        shared[0].length >= 6
      ) {
        entryScore = Math.max(entryScore, 50);
      }
    }

    if (entryScore > bestScore) {
      bestScore = entryScore;
      bestEntry = entry;
    }
  }

  if (!bestEntry || bestScore < 45) return null;

  return (
    bestEntry.answers[language] ||
    bestEntry.answers.hinglish ||
    bestEntry.answers.hi ||
    bestEntry.answers.en ||
    null
  );
}

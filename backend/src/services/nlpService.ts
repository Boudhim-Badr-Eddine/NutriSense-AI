/**
 * Extract meaningful keywords from user question.
 * WHY: Reduce noise and improve database search relevance.
 */
export const extractKeywords = (text: string): string[] => {
  const stopWords = new Set([
    "the",
    "is",
    "at",
    "which",
    "on",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "with",
    "to",
    "for",
    "of",
    "as",
    "by",
    "from",
    "about",
    "what",
    "when",
    "where",
    "who",
    "why",
    "how",
    "can",
    "could",
    "should",
    "would",
    "do",
    "does",
    "did",
    "i",
    "you",
    "me",
    "my",
    "your",
    "tell",
    "show",
    "give",
    "want",
    "need",
    "know",
    "think",
    "best",
    "good",
    "much",
    "many",
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter(
      (word) => word.length >= 3 && !stopWords.has(word) && !/^\d+$/.test(word),
    )
    .filter((word, index, self) => self.indexOf(word) === index);
};

export type UserIntent = "product" | "nutrition" | "general";

/**
 * Detect user intent from question.
 * WHY: Prioritize relevant collections during retrieval.
 */
export const identifyIntent = (text: string): UserIntent => {
  const lowerText = text.toLowerCase();

  const productKeywords = [
    "supplement",
    "creatine",
    "protein",
    "bcaa",
    "vitamin",
    "omega",
    "whey",
    "casein",
    "pre-workout",
    "post-workout",
  ];

  const nutritionKeywords = [
    "food",
    "eat",
    "meal",
    "diet",
    "nutrition",
    "calories",
    "macro",
    "carbs",
    "fats",
    "chicken",
    "fish",
    "vegetable",
  ];

  const hasProductKeyword = productKeywords.some((keyword) =>
    lowerText.includes(keyword),
  );
  const hasNutritionKeyword = nutritionKeywords.some((keyword) =>
    lowerText.includes(keyword),
  );

  if (hasProductKeyword) {
    return "product";
  }
  if (hasNutritionKeyword) {
    return "nutrition";
  }
  return "general";
};

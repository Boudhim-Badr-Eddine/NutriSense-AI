import { logger } from "../utils/logger";

import { buildContext } from "./contextBuilder";
import { sendToGemini } from "./geminiService";
import { extractLinks, Link } from "./linkExtractor";
import { extractKeywords, identifyIntent } from "./nlpService";
import { searchDatabase } from "./searchService";

export interface RagResponse {
  answer: string;
  links: Link[];
  sources: string[];
}

/**
 * WHY: Orchestrate RAG steps for a complete answer.
 */
export const processQuestion = async (
  question: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>,
): Promise<RagResponse> => {
  const keywords = extractKeywords(question);
  const intent = identifyIntent(question);

  logger.info(`RAG intent detected: ${intent}`);

  const results = await searchDatabase(keywords);
  const context = buildContext(results);

  const answer = await sendToGemini(question, context, conversationHistory);
  const links = extractLinks(
    answer,
    results.supplements,
    results.complements,
    results.foods,
  );

  const sources = [
    ...results.supplements.map((item) => item.name),
    ...results.complements.map((item) => item.name),
    ...results.foods.map((item) => item.name),
  ];

  return { answer, links, sources };
};

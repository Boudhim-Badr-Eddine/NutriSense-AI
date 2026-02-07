import { GoogleGenerativeAI } from "@google/generative-ai";

import { config } from "../config/env";
import { logger } from "../utils/logger";

export interface GeminiMessage {
  role: "user" | "assistant";
  content: string;
}

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
const model = genAI.getGenerativeModel(
  { model: config.gemini.model },
  { apiVersion: config.gemini.apiVersion },
);

/**
 * WHY: Provide a consistent system prompt for the nutrition assistant.
 */
export const getSystemPrompt = (): string => {
  return `You are NutriSense AI, an expert nutrition and supplement advisor.

Rules:
1. Base ALL answers on the provided DATABASE CONTEXT
2. If information is in context, use it and cite it
3. If not in context, say "I don't have specific information about this in my database"
4. Format responses clearly with sections and bullet points
5. Be concise but informative (max 400 words)
6. When mentioning products, use their exact names for linking
7. Always add safety disclaimers for supplement advice
8. Use scientific but accessible language

Format example:
"Creatine is a compound that improves athletic performance.

📊 **From our database:**
- **Creatine Monohydrate**: 5g daily, post-workout
- Benefits: Strength gains, muscle growth, improved recovery

⚠️ **Safety:** Consult a healthcare provider before starting supplementation.

➡️ For more details, see Creatine Monohydrate in our database."`;
};

/**
 * WHY: Keep conversation history short and readable for model context.
 */
export const formatConversationHistory = (
  messages: GeminiMessage[],
): string => {
  if (!messages || messages.length === 0) {
    return "";
  }

  return messages
    .slice(-5)
    .map(
      (message) =>
        `${message.role === "user" ? "User" : "Assistant"}: ${message.content}`,
    )
    .join("\n\n");
};

const wait = async (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * WHY: Encapsulate Gemini calls with retry logic and safe fallbacks.
 */
export const sendToGemini = async (
  userQuestion: string,
  context: string,
  conversationHistory: GeminiMessage[] = [],
): Promise<string> => {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      const systemPrompt = getSystemPrompt();
      const history = formatConversationHistory(conversationHistory);

      const fullPrompt = `${systemPrompt}

${context ? `DATABASE CONTEXT:\n${context}\n` : ""}

${history ? `CONVERSATION HISTORY:\n${history}\n` : ""}

USER QUESTION: ${userQuestion}

Provide a helpful, accurate answer based on the context above.`;

      logger.info(`Gemini API call - Attempt ${attempt}`);

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          topK: 40,
          topP: 0.95,
        },
      });

      const text = result.response.text();
      logger.info("Gemini API success");
      return text;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      logger.error(`Gemini API error (attempt ${attempt})`, message);

      if (message.toLowerCase().includes("quota")) {
        return "I'm experiencing high demand right now. Please try again in a moment.";
      }

      if (attempt === maxRetries) {
        return "I'm having trouble processing your request right now. Please try again later or rephrase your question.";
      }

      await wait(2 ** attempt * 1000);
    }
  }

  return "Unable to generate response. Please try again.";
};

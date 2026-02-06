import dotenv from "dotenv";
import path from "path";

import { ApiError } from "../utils/ApiError";

export interface Config {
  port: number;
  nodeEnv: "development" | "production" | "test";
  mongodb: { uri: string };
  jwt: { secret: string; expiresIn: string };
  gemini: { apiKey: string; model: string };
  cors: { origin: string };
}

const envPath =
  process.env.DOTENV_CONFIG_PATH ?? path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw ApiError.validation(`Missing environment variable: ${key}`);
  }
  return value;
};

const parseNodeEnv = (value: string): Config["nodeEnv"] => {
  if (value === "development" || value === "production" || value === "test") {
    return value;
  }
  throw ApiError.validation(`Invalid NODE_ENV value: ${value}`);
};

/**
 * Load and validate environment configuration.
 * WHY: Fail fast on invalid configuration to prevent runtime errors.
 */
export const config: Config = {
  port: Number(requireEnv("PORT")),
  nodeEnv: parseNodeEnv(requireEnv("NODE_ENV")),
  mongodb: {
    uri: requireEnv("MONGODB_URI"),
  },
  jwt: {
    secret: requireEnv("JWT_SECRET"),
    expiresIn: requireEnv("JWT_EXPIRES_IN"),
  },
  gemini: {
    apiKey: requireEnv("GEMINI_API_KEY"),
    model: requireEnv("GEMINI_MODEL"),
  },
  cors: {
    origin: requireEnv("CORS_ORIGIN"),
  },
};

if (Number.isNaN(config.port)) {
  throw ApiError.validation("PORT must be a valid number");
}

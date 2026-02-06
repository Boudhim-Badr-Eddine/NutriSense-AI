import mongoose from "mongoose";

import { logger } from "../utils/logger";
import { config } from "./env";

const MAX_RETRIES = 3;

const wait = async (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * Connect to MongoDB with retry logic.
 * WHY: Ensure transient connection issues do not crash the server on startup.
 */
export const connectDatabase = async (): Promise<void> => {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      attempt += 1;
      await mongoose.connect(config.mongodb.uri);
      logger.info("MongoDB connected");
      return;
    } catch (error) {
      const delay = 500 * 2 ** attempt;
      logger.error(`MongoDB connection failed (attempt ${attempt})`, error);

      if (attempt >= MAX_RETRIES) {
        throw error;
      }

      logger.warn(`Retrying MongoDB connection in ${delay}ms`);
      await wait(delay);
    }
  }
};

mongoose.connection.on("connected", () => {
  logger.info("MongoDB connection established");
});

mongoose.connection.on("error", (error: Error) => {
  logger.error("MongoDB connection error", error);
});

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});

const shutdownDatabase = async (signal: string): Promise<void> => {
  try {
    logger.info(`Received ${signal}. Closing MongoDB connection...`);
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  } catch (error) {
    logger.error("Error during MongoDB shutdown", error);
  }
};

process.on("SIGINT", () => {
  void shutdownDatabase("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdownDatabase("SIGTERM");
});

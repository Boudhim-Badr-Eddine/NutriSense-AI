import app from "./app";
import { connectDatabase } from "./config/database";
import { config } from "./config/env";
import { logger } from "./utils/logger";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });

    const shutdown = (signal: string): void => {
      logger.warn(`Received ${signal}. Shutting down HTTP server...`);
      server.close(() => {
        logger.info("HTTP server closed");
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

void startServer();

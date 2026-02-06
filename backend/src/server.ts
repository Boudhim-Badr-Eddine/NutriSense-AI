import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { connectDatabase } from "./config/database";
import { config } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";
import { logger } from "./utils/logger";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("combined"));

const healthHandler = (_req: express.Request, res: express.Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  });
};

app.get("/api/health", healthHandler);
app.post("/api/health", healthHandler);

app.use("/api/auth", authRoutes);

app.use(errorHandler);

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

import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { config } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import complementRoutes from "./routes/complementRoutes";
import foodRoutes from "./routes/foodRoutes";
import mealAnalyzerRoutes from "./routes/mealAnalyzerRoutes";
import stackRoutes from "./routes/stackRoutes";
import supplementRoutes from "./routes/supplementRoutes";
import symptomRoutes from "./routes/symptomRoutes";

const app = express();

const configuredOrigins = config.cors.origin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(
  new Set([
    ...configuredOrigins,
    "http://localhost:3000",
    "http://localhost:3001",
  ]),
);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
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
app.use("/api/chat", chatRoutes);
app.use("/api/supplements", supplementRoutes);
app.use("/api/complements", complementRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/stack", stackRoutes);
app.use("/api/meal-analyzer", mealAnalyzerRoutes);

app.use(errorHandler);

export default app;

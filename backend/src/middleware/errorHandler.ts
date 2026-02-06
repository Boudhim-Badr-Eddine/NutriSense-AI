import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import { config } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { logger } from "../utils/logger";

/**
 * WHY: Centralized error handling with consistent response format.
 */
export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error("Unhandled error", error);

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const validationError = error as mongoose.Error.ValidationError;
    return res.status(400).json({
      success: false,
      error: "Validation error",
      details: validationError.errors,
    });
  }

  const mongoError = error as {
    code?: number;
    keyValue?: Record<string, unknown>;
  };
  if (mongoError.code === 11000) {
    return res.status(409).json({
      success: false,
      error: "Duplicate key error",
      details: mongoError.keyValue,
    });
  }

  if (error instanceof Error && error.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }

  if (error instanceof Error && error.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token expired",
    });
  }

  const isProduction = config.nodeEnv === "production";

  return res.status(500).json({
    success: false,
    error: "Internal server error",
    details: isProduction ? undefined : error,
  });
};

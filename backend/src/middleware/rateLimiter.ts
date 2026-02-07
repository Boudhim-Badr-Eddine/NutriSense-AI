import { NextFunction, Request, Response } from "express";

import { ApiError } from "../utils/ApiError";
import { logger } from "../utils/logger";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const HOUR_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 20;
const limiterStore = new Map<string, RateLimitEntry>();

/**
 * WHY: Prevent abuse of chat endpoints with a simple in-memory limiter.
 */
export const rateLimiter = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void => {
  const userId = req.user?.id;
  if (!userId) {
    return next(ApiError.unauthorized("Missing user context"));
  }

  const now = Date.now();
  const entry = limiterStore.get(userId);

  if (!entry || entry.resetTime <= now) {
    limiterStore.set(userId, { count: 1, resetTime: now + HOUR_MS });
    return next();
  }

  if (entry.count >= MAX_REQUESTS) {
    logger.warn(`Rate limit exceeded for user ${userId}`);
    return next(
      new ApiError("Rate limit exceeded. Try again in one hour.", 429),
    );
  }

  entry.count += 1;
  limiterStore.set(userId, entry);
  return next();
};

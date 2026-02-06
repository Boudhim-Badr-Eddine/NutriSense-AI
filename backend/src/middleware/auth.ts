import { NextFunction, Request, Response } from "express";

import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { verifyToken } from "../utils/jwt";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: "user" | "admin";
  };
}

/**
 * WHY: Protect routes by validating JWTs and attaching user context.
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Missing authorization token"));
  }

  const token = header.replace("Bearer ", "").trim();
  const payload = verifyToken(token);

  if (!payload) {
    return next(ApiError.unauthorized("Invalid or expired token"));
  }

  const user = await User.findById(payload.userId).select("role");
  if (!user) {
    return next(ApiError.unauthorized("User not found"));
  }

  req.user = {
    id: user.id,
    role: user.role,
  };

  return next();
};

/**
 * WHY: Restrict access to users with specific roles.
 */
export const authorize = (...roles: Array<"user" | "admin">) => {
  return (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      return next(ApiError.unauthorized("Missing user context"));
    }

    if (!roles.includes(req.user.role ?? "user")) {
      return next(ApiError.forbidden("Insufficient permissions"));
    }

    return next();
  };
};

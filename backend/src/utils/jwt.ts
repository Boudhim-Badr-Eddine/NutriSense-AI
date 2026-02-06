import jwt from "jsonwebtoken";

import { config } from "../config/env";

interface TokenPayload {
  userId: string;
}

/**
 * WHY: Provide a single source of truth for JWT generation.
 */
export const generateToken = (userId: string): string => {
  const payload: TokenPayload = { userId };
  const expiresIn = config.jwt.expiresIn as jwt.SignOptions["expiresIn"];
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn,
  });
};

/**
 * WHY: Provide a safe JWT verification helper.
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, config.jwt.secret) as TokenPayload;
  } catch {
    return null;
  }
};

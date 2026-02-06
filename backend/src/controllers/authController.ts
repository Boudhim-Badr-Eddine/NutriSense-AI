import { Request, Response } from "express";

import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { catchAsync } from "../utils/catchAsync";
import { generateToken } from "../utils/jwt";

interface RegisterBody {
  email: string;
  password: string;
  name?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: "user" | "admin";
  };
}

/**
 * Register a new user.
 * WHY: Provide a secure onboarding flow with JWT issuance.
 */
export const register = catchAsync(
  async (
    req: Request<unknown, unknown, RegisterBody>,
    res: Response,
  ): Promise<void> => {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict("User already exists");
    }

    const user = await User.create({ email, password, name });
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  },
);

/**
 * Authenticate a user and issue a JWT.
 * WHY: Centralize login logic and keep controllers thin.
 */
export const login = catchAsync(
  async (
    req: Request<unknown, unknown, LoginBody>,
    res: Response,
  ): Promise<void> => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const token = generateToken(user.id);
    const sanitizedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      favorites: user.favorites,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      success: true,
      data: {
        user: sanitizedUser,
        token,
      },
    });
  },
);

/**
 * Return the authenticated user profile.
 * WHY: Provide client access to user data after login.
 */
export const getProfile = catchAsync(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      throw ApiError.unauthorized("Missing user context");
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  },
);

/**
 * Logout the current user.
 * WHY: Allow client to clear stored tokens.
 */
export const logout = catchAsync(
  async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      success: true,
      data: {
        message: "Logged out successfully",
      },
    });
  },
);

import { Request, Response } from "express";
import { Types } from "mongoose";

import {
  Complement,
  ComplementCategory,
  ComplementModel,
} from "../models/Complement";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { catchAsync } from "../utils/catchAsync";
import * as handlerFactory from "../utils/handlerFactory";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: "user" | "admin";
  };
}

/**
 * WHY: Provide CRUD handlers via the shared factory.
 */
export const getAllComplements = handlerFactory.getAll(Complement);
export const getComplement = handlerFactory.getOne(Complement);
export const createComplement = handlerFactory.createOne(Complement);
export const updateComplement = handlerFactory.updateOne(Complement);
export const deleteComplement = handlerFactory.deleteOne(Complement);

/**
 * Toggle a complement in the authenticated user's favorites list.
 * WHY: Supports UX for quick bookmarking without duplicate code.
 */
export const toggleFavorite = catchAsync(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const complementId = req.params.id;

    if (!userId) {
      throw ApiError.unauthorized("Authentication required");
    }

    if (!complementId || !Types.ObjectId.isValid(complementId)) {
      throw ApiError.badRequest("Invalid complement id");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    const favorites: Types.ObjectId[] = user.favorites.complements;
    const alreadyFavorite = favorites.some((favorite) =>
      favorite.equals(complementId),
    );

    if (alreadyFavorite) {
      user.favorites.complements = favorites.filter(
        (favorite) => !favorite.equals(complementId),
      );
    } else {
      user.favorites.complements.push(new Types.ObjectId(complementId));
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  },
);

const complementModel = Complement as unknown as ComplementModel;

interface ComplementSearchQuery {
  search?: string;
  category?: string;
  page?: string;
  limit?: string;
  sort?: string;
}

/**
 * Search complements using full-text search with optional filters.
 * WHY: Centralizes search logic for UI search/filter experiences.
 */
export const searchComplements = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const {
      search,
      category,
      page = "1",
      limit = "20",
      sort,
    } = req.query as ComplementSearchQuery;

    const filters: Record<string, unknown> = {};
    if (category) {
      filters.category = category;
    }
    if (search?.trim()) {
      filters.$text = { $search: search.trim() };
    }

    const pageNumber = Math.max(1, Number.parseInt(page, 10));
    const limitNumber = Math.min(100, Math.max(1, Number.parseInt(limit, 10)));
    const skip = (pageNumber - 1) * limitNumber;
    const sortValue = sort?.trim() ? sort.split(",").join(" ") : "-createdAt";

    const [data, total] = await Promise.all([
      Complement.find(filters)
        .sort(sortValue)
        .skip(skip)
        .limit(limitNumber)
        .exec(),
      Complement.countDocuments(filters).exec(),
    ]);

    res.status(200).json({
      success: true,
      data,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.max(1, Math.ceil(total / limitNumber)),
      },
    });
  },
);

/**
 * WHY: Returns complements filtered by category with consistent ordering.
 */
export const getComplementsByCategory = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { category } = req.params;

    if (!category) {
      throw ApiError.badRequest("Category is required");
    }

    const data = await complementModel.findByCategory(
      category as ComplementCategory,
    );

    res.status(200).json({
      success: true,
      data,
    });
  },
);

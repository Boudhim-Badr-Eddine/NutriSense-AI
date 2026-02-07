import { Request, Response } from "express";
import { Types } from "mongoose";

import { Supplement } from "../models/Supplement";
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
export const getAllSupplements = handlerFactory.getAll(Supplement);
export const getSupplement = handlerFactory.getOne(Supplement);
export const createSupplement = handlerFactory.createOne(Supplement);
export const updateSupplement = handlerFactory.updateOne(Supplement);
export const deleteSupplement = handlerFactory.deleteOne(Supplement);

/**
 * Toggle a supplement in the authenticated user's favorites list.
 * WHY: Supports UX for quick bookmarking without duplicate code.
 */
export const toggleFavorite = catchAsync(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const supplementId = req.params.id;

    if (!userId) {
      throw ApiError.unauthorized("Authentication required");
    }

    if (!supplementId || !Types.ObjectId.isValid(supplementId)) {
      throw ApiError.badRequest("Invalid supplement id");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    const favorites: Types.ObjectId[] = user.favorites.supplements;
    const alreadyFavorite = favorites.some((favorite) =>
      favorite.equals(supplementId),
    );

    if (alreadyFavorite) {
      user.favorites.supplements = favorites.filter(
        (favorite) => !favorite.equals(supplementId),
      );
    } else {
      user.favorites.supplements.push(new Types.ObjectId(supplementId));
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  },
);

interface SupplementSearchQuery {
  search?: string;
  category?: string;
  goal?: string;
  page?: string;
  limit?: string;
  sort?: string;
}

/**
 * Search supplements using full-text search with optional filters.
 * WHY: Centralizes search logic for richer UI experiences.
 */
export const searchSupplements = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const {
      search,
      category,
      goal,
      page = "1",
      limit = "20",
      sort,
    } = req.query as SupplementSearchQuery;

    const filters: Record<string, unknown> = {};
    if (category) {
      filters.category = category;
    }
    if (goal) {
      filters.goals = goal;
    }
    if (search?.trim()) {
      filters.$text = { $search: search.trim() };
    }

    const pageNumber = Math.max(1, Number.parseInt(page, 10));
    const limitNumber = Math.min(100, Math.max(1, Number.parseInt(limit, 10)));
    const skip = (pageNumber - 1) * limitNumber;
    const sortValue = sort?.trim() ? sort.split(",").join(" ") : "-popularity";

    const [data, total] = await Promise.all([
      Supplement.find(filters)
        .sort(sortValue)
        .skip(skip)
        .limit(limitNumber)
        .exec(),
      Supplement.countDocuments(filters).exec(),
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

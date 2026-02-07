import { Request, Response } from "express";

import { Food, FoodModel } from "../models/Food";
import { catchAsync } from "../utils/catchAsync";
import * as handlerFactory from "../utils/handlerFactory";

/**
 * WHY: Provide CRUD handlers via the shared factory.
 */
export const getAllFoods = handlerFactory.getAll(Food);
export const getFood = handlerFactory.getOne(Food);
export const createFood = handlerFactory.createOne(Food);
export const updateFood = handlerFactory.updateOne(Food);
export const deleteFood = handlerFactory.deleteOne(Food);

const foodModel = Food as unknown as FoodModel;

interface FoodTopQuery {
  limit?: string;
}

/**
 * Returns top protein sources.
 */
export const getTopProteins = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { limit = "10" } = req.query as FoodTopQuery;
    const limitNumber = Math.min(100, Math.max(1, Number.parseInt(limit, 10)));
    const data = await foodModel.topProteins(limitNumber);

    res.status(200).json({
      success: true,
      data,
    });
  },
);

/**
 * Returns top carbohydrate sources.
 */
export const getTopCarbs = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { limit = "10" } = req.query as FoodTopQuery;
    const limitNumber = Math.min(100, Math.max(1, Number.parseInt(limit, 10)));
    const data = await foodModel.topCarbs(limitNumber);

    res.status(200).json({
      success: true,
      data,
    });
  },
);

/**
 * Returns top fat sources.
 */
export const getTopFats = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { limit = "10" } = req.query as FoodTopQuery;
    const limitNumber = Math.min(100, Math.max(1, Number.parseInt(limit, 10)));
    const data = await foodModel.topFats(limitNumber);

    res.status(200).json({
      success: true,
      data,
    });
  },
);

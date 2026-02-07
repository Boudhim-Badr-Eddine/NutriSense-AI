import { body, query } from "express-validator";

const foodTypes = ["animal", "vegetal", "supplement"] as const;

/**
 * WHY: Validate food creation payloads.
 */
export const createFoodSchema = [
  body("name").trim().isLength({ min: 2, max: 200 }),
  body("category").trim().notEmpty(),
  body("type").isIn([...foodTypes]),
  body("per100g.calories").isFloat({ min: 0 }),
  body("per100g.proteins").isFloat({ min: 0 }),
  body("per100g.carbs").isFloat({ min: 0 }),
  body("per100g.fats").isFloat({ min: 0 }),
  body("per100g.fiber").isFloat({ min: 0 }),
  body("per100g.vitamins").optional().isArray(),
  body("per100g.vitamins.*.name").optional().isString().trim().notEmpty(),
  body("per100g.vitamins.*.amount").optional().isFloat({ min: 0 }),
  body("per100g.vitamins.*.unit").optional().isString().trim().notEmpty(),
  body("per100g.minerals").optional().isArray(),
  body("per100g.minerals.*.name").optional().isString().trim().notEmpty(),
  body("per100g.minerals.*.amount").optional().isFloat({ min: 0 }),
  body("per100g.minerals.*.unit").optional().isString().trim().notEmpty(),
  body("benefits").optional().isArray(),
  body("benefits.*").optional().isString().trim().notEmpty(),
  body("mealIdeas").optional().isArray(),
  body("mealIdeas.*").optional().isString().trim().notEmpty(),
  body("dietaryTags").optional().isArray(),
  body("dietaryTags.*").optional().isString().trim().notEmpty(),
  body("image").trim().notEmpty(),
];

/**
 * WHY: Validate food update payloads.
 */
export const updateFoodSchema = [
  body("name").optional().trim().isLength({ min: 2, max: 200 }),
  body("category").optional().trim().notEmpty(),
  body("type")
    .optional()
    .isIn([...foodTypes]),
  body("per100g.calories").optional().isFloat({ min: 0 }),
  body("per100g.proteins").optional().isFloat({ min: 0 }),
  body("per100g.carbs").optional().isFloat({ min: 0 }),
  body("per100g.fats").optional().isFloat({ min: 0 }),
  body("per100g.fiber").optional().isFloat({ min: 0 }),
  body("per100g.vitamins").optional().isArray(),
  body("per100g.vitamins.*.name").optional().isString().trim().notEmpty(),
  body("per100g.vitamins.*.amount").optional().isFloat({ min: 0 }),
  body("per100g.vitamins.*.unit").optional().isString().trim().notEmpty(),
  body("per100g.minerals").optional().isArray(),
  body("per100g.minerals.*.name").optional().isString().trim().notEmpty(),
  body("per100g.minerals.*.amount").optional().isFloat({ min: 0 }),
  body("per100g.minerals.*.unit").optional().isString().trim().notEmpty(),
  body("benefits").optional().isArray(),
  body("benefits.*").optional().isString().trim().notEmpty(),
  body("mealIdeas").optional().isArray(),
  body("mealIdeas.*").optional().isString().trim().notEmpty(),
  body("dietaryTags").optional().isArray(),
  body("dietaryTags.*").optional().isString().trim().notEmpty(),
  body("image").optional().trim().notEmpty(),
];

/**
 * WHY: Validate food query parameters for list/search endpoints.
 */
export const queryFoodsSchema = [
  query("search").optional().isString(),
  query("category").optional().isString(),
  query("type")
    .optional()
    .isIn([...foodTypes]),
  query("dietaryTags").optional().isString(),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("sort").optional().isString(),
];

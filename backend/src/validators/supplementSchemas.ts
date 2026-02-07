import { body, query } from "express-validator";

const supplementCategories = [
  "proteins",
  "creatine",
  "bcaa",
  "pre-workout",
  "recovery",
] as const;

const supplementGoals = ["mass", "cutting", "endurance"] as const;

/**
 * WHY: Validate supplement creation payloads.
 */
export const createSupplementSchema = [
  body("name").trim().isLength({ min: 3, max: 200 }),
  body("category").isIn([...supplementCategories]),
  body("description").isLength({ min: 50 }),
  body("dosage").trim().notEmpty(),
  body("timing").trim().notEmpty(),
  body("duration").trim().notEmpty(),
  body("benefits").optional().isArray(),
  body("benefits.*").optional().isString().trim().notEmpty(),
  body("ingredients").optional().isArray(),
  body("ingredients.*").optional().isString().trim().notEmpty(),
  body("contraindications").optional().isArray(),
  body("contraindications.*").optional().isString().trim().notEmpty(),
  body("scientificStudies").optional().isArray(),
  body("scientificStudies.*.title").optional().isString().trim().notEmpty(),
  body("scientificStudies.*.url").optional().isString().trim().notEmpty(),
  body("scientificStudies.*.summary").optional().isString().trim().notEmpty(),
  body("images").optional().isArray(),
  body("images.*").optional().isString().trim().notEmpty(),
  body("goals").optional().isArray(),
  body("goals.*")
    .optional()
    .isIn([...supplementGoals]),
  body("popularity").optional().isInt({ min: 0 }),
];

/**
 * WHY: Validate supplement update payloads.
 */
export const updateSupplementSchema = [
  body("name").optional().trim().isLength({ min: 3, max: 200 }),
  body("category")
    .optional()
    .isIn([...supplementCategories]),
  body("description").optional().isLength({ min: 50 }),
  body("dosage").optional().trim().notEmpty(),
  body("timing").optional().trim().notEmpty(),
  body("duration").optional().trim().notEmpty(),
  body("benefits").optional().isArray(),
  body("benefits.*").optional().isString().trim().notEmpty(),
  body("ingredients").optional().isArray(),
  body("ingredients.*").optional().isString().trim().notEmpty(),
  body("contraindications").optional().isArray(),
  body("contraindications.*").optional().isString().trim().notEmpty(),
  body("scientificStudies").optional().isArray(),
  body("scientificStudies.*.title").optional().isString().trim().notEmpty(),
  body("scientificStudies.*.url").optional().isString().trim().notEmpty(),
  body("scientificStudies.*.summary").optional().isString().trim().notEmpty(),
  body("images").optional().isArray(),
  body("images.*").optional().isString().trim().notEmpty(),
  body("goals").optional().isArray(),
  body("goals.*")
    .optional()
    .isIn([...supplementGoals]),
  body("popularity").optional().isInt({ min: 0 }),
];

/**
 * WHY: Validate supplement query parameters for list/search endpoints.
 */
export const querySupplementsSchema = [
  query("search").optional().isString(),
  query("category")
    .optional()
    .isIn([...supplementCategories]),
  query("goal")
    .optional()
    .isIn([...supplementGoals]),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("sort").optional().isString(),
];

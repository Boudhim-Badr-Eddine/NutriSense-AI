import { body, query } from "express-validator";

const complementCategories = [
  "vitamin",
  "mineral",
  "antioxidant",
  "omega",
  "adaptogen",
] as const;

/**
 * WHY: Validate complement creation payloads.
 */
export const createComplementSchema = [
  body("name").trim().isLength({ min: 3, max: 200 }),
  body("category").isIn([...complementCategories]),
  body("description").trim().notEmpty(),
  body("biologicalRole").trim().notEmpty(),
  body("deficiencySymptoms").optional().isArray(),
  body("deficiencySymptoms.*").optional().isString().trim().notEmpty(),
  body("foodSources").optional().isArray(),
  body("foodSources.*.food").optional().isString().trim().notEmpty(),
  body("foodSources.*.quantityPer100g").optional().isFloat({ min: 0 }),
  body("foodSources.*.unit").optional().isString().trim().notEmpty(),
  body("dailyIntake.men").trim().notEmpty(),
  body("dailyIntake.women").trim().notEmpty(),
  body("dailyIntake.pregnant").trim().notEmpty(),
  body("dailyIntake.athletes").trim().notEmpty(),
  body("supplementForms").optional().isArray(),
  body("supplementForms.*.form").optional().isString().trim().notEmpty(),
  body("supplementForms.*.bioavailability")
    .optional()
    .isString()
    .trim()
    .notEmpty(),
  body("interactions").optional().isArray(),
  body("interactions.*").optional().isString().trim().notEmpty(),
  body("contraindications").optional().isArray(),
  body("contraindications.*").optional().isString().trim().notEmpty(),
  body("images").optional().isArray(),
  body("images.*").optional().isString().trim().notEmpty(),
];

/**
 * WHY: Validate complement update payloads.
 */
export const updateComplementSchema = [
  body("name").optional().trim().isLength({ min: 3, max: 200 }),
  body("category")
    .optional()
    .isIn([...complementCategories]),
  body("description").optional().trim().notEmpty(),
  body("biologicalRole").optional().trim().notEmpty(),
  body("deficiencySymptoms").optional().isArray(),
  body("deficiencySymptoms.*").optional().isString().trim().notEmpty(),
  body("foodSources").optional().isArray(),
  body("foodSources.*.food").optional().isString().trim().notEmpty(),
  body("foodSources.*.quantityPer100g").optional().isFloat({ min: 0 }),
  body("foodSources.*.unit").optional().isString().trim().notEmpty(),
  body("dailyIntake.men").optional().trim().notEmpty(),
  body("dailyIntake.women").optional().trim().notEmpty(),
  body("dailyIntake.pregnant").optional().trim().notEmpty(),
  body("dailyIntake.athletes").optional().trim().notEmpty(),
  body("supplementForms").optional().isArray(),
  body("supplementForms.*.form").optional().isString().trim().notEmpty(),
  body("supplementForms.*.bioavailability")
    .optional()
    .isString()
    .trim()
    .notEmpty(),
  body("interactions").optional().isArray(),
  body("interactions.*").optional().isString().trim().notEmpty(),
  body("contraindications").optional().isArray(),
  body("contraindications.*").optional().isString().trim().notEmpty(),
  body("images").optional().isArray(),
  body("images.*").optional().isString().trim().notEmpty(),
];

/**
 * WHY: Validate complement query parameters for list/search endpoints.
 */
export const queryComplementsSchema = [
  query("search").optional().isString(),
  query("category")
    .optional()
    .isIn([...complementCategories]),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("sort").optional().isString(),
];

import { body } from "express-validator";

export const registerSchema = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must include an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must include a lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must include a number"),
  body("name")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
];

export const loginSchema = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

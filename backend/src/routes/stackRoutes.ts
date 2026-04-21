import { Router } from "express";
import { body } from "express-validator";

import {
  analyzeStack,
  getSavedStacks,
  saveStack,
} from "../controllers/stackController";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";

const router = Router();

const supplementIdsValidation = [
  body("supplementIds").isArray({ min: 2, max: 6 }),
  body("supplementIds.*").isString().trim().notEmpty(),
];

router.post("/analyze", validate(supplementIdsValidation), analyzeStack);

router.post(
  "/save",
  authenticate,
  validate([
    body("stackName").isString().trim().isLength({ min: 3, max: 50 }),
    ...supplementIdsValidation,
  ]),
  saveStack,
);

router.get("/saved", authenticate, getSavedStacks);

export default router;
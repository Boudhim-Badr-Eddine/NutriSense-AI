import { Router } from "express";

import * as controller from "../controllers/complementController";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import * as schemas from "../validators/complementSchemas";

const router = Router();

// Public routes
router.get(
  "/",
  validate(schemas.queryComplementsSchema),
  controller.getAllComplements,
);
router.get(
  "/search",
  validate(schemas.queryComplementsSchema),
  controller.searchComplements,
);
router.get("/category/:category", controller.getComplementsByCategory);
router.get("/:id", controller.getComplement);

// Protected routes
router.post("/:id/favorite", authenticate, controller.toggleFavorite);

router.post(
  "/",
  validate(schemas.createComplementSchema),
  controller.createComplement,
);
router.put(
  "/:id",
  validate(schemas.updateComplementSchema),
  controller.updateComplement,
);
router.delete("/:id", controller.deleteComplement);

export default router;

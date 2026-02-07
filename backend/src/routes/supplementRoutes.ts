import { Router } from "express";

import * as controller from "../controllers/supplementController";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import * as schemas from "../validators/supplementSchemas";

const router = Router();

// Public routes
router.get(
  "/",
  validate(schemas.querySupplementsSchema),
  controller.getAllSupplements,
);
router.get(
  "/search",
  validate(schemas.querySupplementsSchema),
  controller.searchSupplements,
);
router.get("/:id", controller.getSupplement);

// Protected routes
router.post("/:id/favorite", authenticate, controller.toggleFavorite);

// Admin routes
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(schemas.createSupplementSchema),
  controller.createSupplement,
);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(schemas.updateSupplementSchema),
  controller.updateSupplement,
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  controller.deleteSupplement,
);

export default router;

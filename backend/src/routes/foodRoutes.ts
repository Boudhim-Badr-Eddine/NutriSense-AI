import { Router } from "express";

import * as controller from "../controllers/foodController";
import { validate } from "../middleware/validate";
import * as schemas from "../validators/foodSchemas";

const router = Router();

// Public routes
router.get("/", validate(schemas.queryFoodsSchema), controller.getAllFoods);
router.get("/rankings/proteins", controller.getTopProteins);
router.get("/rankings/carbs", controller.getTopCarbs);
router.get("/rankings/fats", controller.getTopFats);
router.get("/:id", controller.getFood);
router.post("/", validate(schemas.createFoodSchema), controller.createFood);
router.put("/:id", validate(schemas.updateFoodSchema), controller.updateFood);
router.delete("/:id", controller.deleteFood);

export default router;

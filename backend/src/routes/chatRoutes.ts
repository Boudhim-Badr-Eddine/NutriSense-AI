import { Router } from "express";

import * as controller from "../controllers/chatController";
import { authenticate } from "../middleware/auth";
import { rateLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { sendMessageSchema } from "../validators/chatSchemas";

const router = Router();

router.post(
  "/",
  authenticate,
  rateLimiter,
  validate(sendMessageSchema),
  controller.sendMessage,
);

router.get("/history", authenticate, controller.getHistoryByUser);
router.delete("/history", authenticate, controller.clearHistoryByUser);

export default router;

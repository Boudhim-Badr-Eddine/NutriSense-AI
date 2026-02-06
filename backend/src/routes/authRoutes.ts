import { Router } from "express";

import {
  getProfile,
  login,
  logout,
  register,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validators/authSchemas";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/profile", authenticate, getProfile);
router.post("/logout", authenticate, logout);

export default router;

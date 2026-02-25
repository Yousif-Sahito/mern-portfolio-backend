import { Router } from "express";
import { login, register, me } from "../controllers/auth.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/login", login);

// Optional: remove this in production
router.post("/register", register);

router.get("/me", requireAdmin, me);

export default router;

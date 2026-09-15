import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.js";
import { signupSchema, loginSchema } from "../validations/auth.schema.js";
import { signup, login, refresh, logout, me } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", validate(signupSchema, "body"), asyncHandler(signup));
router.post("/login", validate(loginSchema, "body"), asyncHandler(login));
router.post("/refresh", asyncHandler(refresh));
router.post("/logout", asyncHandler(logout));
router.get("/me", requireAuth, asyncHandler(me));

export default router;

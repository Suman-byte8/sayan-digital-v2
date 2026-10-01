import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { requireAdmin } from "../middleware/require-admin.js";
import { loginRateLimit } from "../middleware/login-rate-limit.js";
import { login, me, updateCredentials } from "../controllers/admin-auth.controller.js";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Enter your username").max(100),
  password: z.string().min(1, "Enter your password").max(200),
});

const credentialsSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password").max(200),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(50)
    .regex(/^[A-Za-z0-9._-]+$/, "Username can only use letters, numbers and . _ -")
    .optional(),
  newPassword: z
    .string()
    .min(10, "New password must be at least 10 characters")
    .max(200)
    .optional(),
});

const router = Router();

router.post("/login", loginRateLimit, validate(loginSchema, "body"), asyncHandler(login));
router.get("/me", requireAdmin, asyncHandler(me));
router.put("/credentials", requireAdmin, validate(credentialsSchema, "body"), asyncHandler(updateCredentials));

export default router;

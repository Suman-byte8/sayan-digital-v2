import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.js";
import { updateProfileSchema } from "../validations/profile.schema.js";
import { changePasswordSchema } from "../validations/auth.schema.js";
import { getProfile, updateProfile, changePassword } from "../controllers/profile.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(getProfile));
router.patch("/", validate(updateProfileSchema, "body"), asyncHandler(updateProfile));
router.patch(
  "/password",
  validate(changePasswordSchema, "body"),
  asyncHandler(changePassword),
);

export default router;

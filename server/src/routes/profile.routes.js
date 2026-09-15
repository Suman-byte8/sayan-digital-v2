import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.js";
import { uploadImageMiddleware } from "../middleware/upload.js";
import { updateProfileSchema } from "../validations/profile.schema.js";
import { changePasswordSchema } from "../validations/auth.schema.js";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
} from "../controllers/profile.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(getProfile));
router.patch("/", validate(updateProfileSchema, "body"), asyncHandler(updateProfile));
// Authenticated, unlike POST /api/uploads/image (used by the admin panel,
// which has no login of its own yet) — this one must require a signed-in
// user so random visitors can't upload arbitrary files to the business's
// Drive storage.
router.post("/avatar", uploadImageMiddleware, asyncHandler(uploadAvatar));
router.patch(
  "/password",
  validate(changePasswordSchema, "body"),
  asyncHandler(changePassword),
);

export default router;

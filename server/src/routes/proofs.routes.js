import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuth } from "../middleware/require-auth.js";
import { listProofs } from "../controllers/proofs.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listProofs));

export default router;

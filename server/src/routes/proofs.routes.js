import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.js";
import { proofIdParamSchema } from "../validations/proof.schema.js";
import { listProofs, approveProof } from "../controllers/proofs.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listProofs));
router.patch(
  "/:id/approve",
  validate(proofIdParamSchema, "params"),
  asyncHandler(approveProof),
);

export default router;

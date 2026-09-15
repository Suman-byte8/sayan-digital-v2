import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuth } from "../middleware/require-auth.js";
import { listOrders } from "../controllers/orders.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listOrders));

export default router;

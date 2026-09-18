import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.js";
import { createOrderSchema } from "../validations/order.schema.js";
import { listOrders, createOrder } from "../controllers/orders.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listOrders));
router.post("/", validate(createOrderSchema, "body"), asyncHandler(createOrder));

export default router;

import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { orderListQuerySchema, orderIdParamSchema, updateOrderSchema } from "../validations/admin-order.schema.js";
import { listOrders, getOrderDetail, updateOrder } from "../controllers/admin-orders.controller.js";

const router = Router();

router.get("/", validate(orderListQuerySchema, "query"), asyncHandler(listOrders));

router.get(
  "/:id",
  validate(orderIdParamSchema, "params"),
  asyncHandler(getOrderDetail),
);

router.patch(
  "/:id",
  validate(orderIdParamSchema, "params"),
  validate(updateOrderSchema, "body"),
  asyncHandler(updateOrder),
);

export default router;

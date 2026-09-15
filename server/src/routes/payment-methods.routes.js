import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.js";
import {
  createPaymentMethodSchema,
  paymentMethodIdParamSchema,
} from "../validations/payment-method.schema.js";
import {
  listPaymentMethods,
  createPaymentMethod,
  setPrimaryPaymentMethod,
  deletePaymentMethod,
} from "../controllers/payment-methods.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listPaymentMethods));
router.post("/", validate(createPaymentMethodSchema, "body"), asyncHandler(createPaymentMethod));
router.patch(
  "/:id/primary",
  validate(paymentMethodIdParamSchema, "params"),
  asyncHandler(setPrimaryPaymentMethod),
);
router.delete(
  "/:id",
  validate(paymentMethodIdParamSchema, "params"),
  asyncHandler(deletePaymentMethod),
);

export default router;

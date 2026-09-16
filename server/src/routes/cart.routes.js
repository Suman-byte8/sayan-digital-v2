import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.js";
import { addCartItemSchema, updateCartItemSchema, cartItemIdParamSchema } from "../validations/cart.schema.js";
import { listCart, addCartItem, updateCartItem, removeCartItem, clearCart } from "../controllers/cart.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listCart));
router.post("/", validate(addCartItemSchema, "body"), asyncHandler(addCartItem));
router.patch(
  "/:id",
  validate(cartItemIdParamSchema, "params"),
  validate(updateCartItemSchema, "body"),
  asyncHandler(updateCartItem),
);
router.delete(
  "/:id",
  validate(cartItemIdParamSchema, "params"),
  asyncHandler(removeCartItem),
);
router.delete("/", asyncHandler(clearCart));

export default router;

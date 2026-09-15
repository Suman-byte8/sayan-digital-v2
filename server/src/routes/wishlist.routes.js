import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.js";
import { addWishlistItemSchema, wishlistItemIdParamSchema } from "../validations/wishlist.schema.js";
import {
  listWishlist,
  addWishlistItem,
  removeWishlistItem,
} from "../controllers/wishlist.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listWishlist));
router.post("/", validate(addWishlistItemSchema, "body"), asyncHandler(addWishlistItem));
router.delete(
  "/:id",
  validate(wishlistItemIdParamSchema, "params"),
  asyncHandler(removeWishlistItem),
);

export default router;

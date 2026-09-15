import { z } from "zod";

export const addWishlistItemSchema = z.object({
  productId: z.string().uuid("Invalid product id"),
});

export const wishlistItemIdParamSchema = z.object({ id: z.string().uuid() });

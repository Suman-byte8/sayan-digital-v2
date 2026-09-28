import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.string().uuid("Invalid product id"),
  variantId: z.string().uuid("Invalid variant id").optional(),
  quantity: z.coerce.number().int().positive().max(999).default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().positive().max(999),
});

export const cartItemIdParamSchema = z.object({ id: z.string().uuid() });

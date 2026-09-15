import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const productBaseSchema = {
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(200),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(slugPattern, "Slug must be lowercase letters, numbers and hyphens only"),
  description: z.string().trim().max(2000).optional().nullable(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  category: z.string().trim().max(100).optional().nullable(),
  images: z.array(z.string().trim().url("Each image must be a valid URL")).default([]),
  // Optional wholesale minimum (e.g. "50" for lanyards sold in bulk only).
  // Omit/null for products with no minimum order quantity.
  minOrderQty: z.coerce.number().int().positive().optional().nullable(),
  stock: z.coerce.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
};

export const createProductSchema = z.object(productBaseSchema);

export const updateProductSchema = z
  .object(productBaseSchema)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const productIdParamSchema = z.object({
  id: z.string().uuid("Invalid product id"),
});

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  category: z.string().trim().optional(),
  search: z.string().trim().optional(),
});

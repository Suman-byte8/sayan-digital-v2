import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters").max(100),
  source: z.enum(["taxonomy", "custom"]).default("custom"),
});

export const categoryIdParamSchema = z.object({
  id: z.string().uuid("Invalid category id"),
});

export const taxonomySearchQuerySchema = z.object({
  q: z.string().trim().min(1, "Search query is required"),
});

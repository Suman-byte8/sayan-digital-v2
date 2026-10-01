import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAdmin } from "../middleware/require-admin.js";
import { validate } from "../middleware/validate.js";
import {
  createCategorySchema,
  categoryIdParamSchema,
  taxonomySearchQuerySchema,
} from "../validations/category.schema.js";
import {
  listCategories,
  createCategory,
  deleteCategory,
  searchTaxonomyCategories,
} from "../controllers/categories.controller.js";

const router = Router();

router.get("/", asyncHandler(listCategories));

router.get(
  "/taxonomy/search",
  validate(taxonomySearchQuerySchema, "query"),
  asyncHandler(searchTaxonomyCategories),
);

// Listing is public; creating/deleting categories needs a signed-in admin.
router.post("/", requireAdmin, validate(createCategorySchema, "body"), asyncHandler(createCategory));

router.delete(
  "/:id",
  requireAdmin,
  validate(categoryIdParamSchema, "params"),
  asyncHandler(deleteCategory),
);

export default router;

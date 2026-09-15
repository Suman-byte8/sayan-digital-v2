import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
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

router.post("/", validate(createCategorySchema, "body"), asyncHandler(createCategory));

router.delete(
  "/:id",
  validate(categoryIdParamSchema, "params"),
  asyncHandler(deleteCategory),
);

export default router;

import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
  productSlugParamSchema,
  productListQuerySchema,
} from "../validations/product.schema.js";
import {
  listProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", validate(productListQuerySchema, "query"), asyncHandler(listProducts));

// Registered before /:id so a slug like "custom-mug" is never mistaken for
// the :id segment (moot here since :id is UUID-validated anyway, but keeps
// the more specific route first).
router.get(
  "/slug/:slug",
  validate(productSlugParamSchema, "params"),
  asyncHandler(getProductBySlug),
);

router.get(
  "/:id",
  validate(productIdParamSchema, "params"),
  asyncHandler(getProduct),
);

router.post("/", validate(createProductSchema, "body"), asyncHandler(createProduct));

router.put(
  "/:id",
  validate(productIdParamSchema, "params"),
  validate(updateProductSchema, "body"),
  asyncHandler(updateProduct),
);

router.delete(
  "/:id",
  validate(productIdParamSchema, "params"),
  asyncHandler(deleteProduct),
);

export default router;

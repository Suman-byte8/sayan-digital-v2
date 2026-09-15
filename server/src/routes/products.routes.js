import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
  productListQuerySchema,
} from "../validations/product.schema.js";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", validate(productListQuerySchema, "query"), asyncHandler(listProducts));

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

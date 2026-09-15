import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/require-auth.js";
import {
  createAddressSchema,
  updateAddressSchema,
  addressIdParamSchema,
} from "../validations/address.schema.js";
import {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addresses.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listAddresses));
router.post("/", validate(createAddressSchema, "body"), asyncHandler(createAddress));
router.patch(
  "/:id",
  validate(addressIdParamSchema, "params"),
  validate(updateAddressSchema, "body"),
  asyncHandler(updateAddress),
);
router.delete("/:id", validate(addressIdParamSchema, "params"), asyncHandler(deleteAddress));

export default router;

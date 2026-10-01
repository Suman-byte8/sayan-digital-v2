import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { invoiceSettingsSchema } from "../validations/settings.schema.js";
import { getInvoiceSettings, updateInvoiceSettings } from "../controllers/admin-settings.controller.js";

const router = Router();

router.get("/invoice", asyncHandler(getInvoiceSettings));
router.put("/invoice", validate(invoiceSettingsSchema, "body"), asyncHandler(updateInvoiceSettings));

export default router;

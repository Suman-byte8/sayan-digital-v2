import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { uploadPdfMiddleware } from "../middleware/upload-pdf.js";
import {
  invoiceSchema,
  invoiceIdParamSchema,
  invoiceListQuerySchema,
} from "../validations/invoice.schema.js";
import {
  listInvoices,
  getInvoiceDefaults,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  saveInvoicePdf,
} from "../controllers/admin-invoices.controller.js";

const router = Router();

router.get("/", validate(invoiceListQuerySchema, "query"), asyncHandler(listInvoices));
// Registered before /:id so "defaults" is never read as an id.
router.get("/defaults", asyncHandler(getInvoiceDefaults));
router.get("/:id", validate(invoiceIdParamSchema, "params"), asyncHandler(getInvoice));
router.post("/", validate(invoiceSchema, "body"), asyncHandler(createInvoice));
router.put(
  "/:id",
  validate(invoiceIdParamSchema, "params"),
  validate(invoiceSchema, "body"),
  asyncHandler(updateInvoice),
);
router.post(
  "/:id/pdf",
  validate(invoiceIdParamSchema, "params"),
  uploadPdfMiddleware,
  asyncHandler(saveInvoicePdf),
);
router.delete("/:id", validate(invoiceIdParamSchema, "params"), asyncHandler(deleteInvoice));

export default router;

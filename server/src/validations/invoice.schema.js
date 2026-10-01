import { z } from "zod";

export const INVOICE_STATUSES = ["UNPAID", "PARTIAL", "PAID"];

const text = (max) => z.string().trim().max(max).default("");
const optionalText = (max) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null)
    .optional()
    .nullable();
const money = z.coerce.number().min(0).max(99_999_999);

const itemSchema = z.object({
  description: z.string().trim().min(1, "Item name is required").max(200),
  details: text(500),
  hsn: text(20),
  unitPrice: money,
  qty: z.coerce.number().positive("Quantity must be greater than 0").max(1_000_000),
  // Blank/absent = use the invoice-wide GST rate.
  gstRate: z
    .union([z.literal(""), z.null(), z.coerce.number().min(0).max(100)])
    .optional()
    .transform((v) => (v === "" || v == null ? null : v)),
});

const invoiceBaseSchema = {
  invoiceNumber: z.string().trim().min(1, "Invoice number is required").max(40),

  clientName: z.string().trim().min(1, "Client name is required").max(150),
  clientPhone: optionalText(30),
  clientEmail: optionalText(150),
  clientAddress: optionalText(500),
  clientGstin: optionalText(20),

  issueDate: z.coerce.date(),
  dueDate: z.coerce.date().optional().nullable(),

  items: z.array(itemSchema).min(1, "Add at least one item").max(100),

  gstEnabled: z.boolean().default(false),
  gstMode: z.enum(["INTRA", "INTER"]).default("INTRA"),
  gstRate: z.coerce.number().min(0).max(100).default(18),
  pricesIncludeGst: z.boolean().default(false),
  discountType: z.enum(["PERCENT", "FLAT"]).default("PERCENT"),
  discountValue: money.default(0),
  roundOff: z.boolean().default(true),
  amountPaid: money.default(0),

  business: z
    .object({
      nameLine1: text(60),
      nameLine2: text(60),
      address: text(500),
      phone: text(40),
      email: text(150),
      gstin: text(20),
      logoUrl: text(500),
    })
    .default({}),
  paymentInfo: z
    .object({
      account: text(60),
      accountName: text(100),
      bank: text(150),
      upi: text(100),
    })
    .default({}),
  notes: optionalText(1000),
  terms: optionalText(1500),
  thankYou: optionalText(200),
  accentColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Accent color must be a hex color like #4a3f94")
    .default("#4a3f94"),
};

// Full replace on update (the editor always sends the whole invoice), so
// create and update share one schema.
export const invoiceSchema = z.object(invoiceBaseSchema);

export const invoiceIdParamSchema = z.object({ id: z.string().uuid("Invalid invoice id") });

export const invoiceListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(INVOICE_STATUSES).optional(),
  // Matches invoice number or client name.
  search: z.string().trim().optional(),
});

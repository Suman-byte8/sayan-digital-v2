import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const PRODUCT_TYPES = ["PRINTING", "STATIONERY"];

// SEO text is only ever rendered as escaped text/attributes, but tags in a
// title/description are never legitimate, so reject them up front. Blank
// strings become null so "cleared in the admin" == "use the fallback".
const noHtml = (value) => !/[<>]/.test(value);
const seoText = (max) =>
  z
    .string()
    .trim()
    .max(max, `Must be at most ${max} characters`)
    .refine(noHtml, "Must not contain < or > characters")
    .transform((value) => value || null)
    .optional()
    .nullable();
const seoUrl = z
  .string()
  .trim()
  .max(500)
  .refine((value) => value === "" || /^https?:\/\/\S+$/i.test(value), "Must be a full http(s) URL")
  .transform((value) => value || null)
  .optional()
  .nullable();

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
  // Which storefront catalog this belongs to (client's /products vs /stationery).
  type: z.enum(PRODUCT_TYPES).default("PRINTING"),
  // Ordering unit shown next to price, e.g. "pc", "set", "100 pcs".
  unit: z.string().trim().max(40).optional().nullable(),
  // Short merchandising label, e.g. "Customizable", "220 GSM".
  badge: z.string().trim().max(60).optional().nullable(),
  images: z.array(z.string().trim().url("Each image must be a valid URL")).default([]),
  // Optional wholesale minimum (e.g. "50" for lanyards sold in bulk only).
  // Omit/null for products with no minimum order quantity.
  minOrderQty: z.coerce.number().int().positive().optional().nullable(),
  stock: z.coerce.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
  // SEO metadata — every field optional; blank falls back on the storefront.
  // Limits are generous (well past the ~60/~160 char display guidance) so
  // legitimate copy is never rejected; the admin form shows the soft guidance.
  seoTitle: seoText(120),
  metaDescription: seoText(320),
  imageAltText: seoText(200),
  canonicalUrl: seoUrl,
  ogTitle: seoText(120),
  ogDescription: seoText(320),
  ogImage: seoUrl,
  twitterTitle: seoText(120),
  twitterDescription: seoText(320),
  twitterImage: seoUrl,
  structuredDataEnabled: z.boolean().default(true),
  // Per-product variant axes (e.g. "Size", "Thickness") and the specific
  // sellable combinations of them â€” see server/src/lib/product-variants.js
  // for the cross-validation this only partially covers (Zod can't check
  // that a variant's selection actually matches the declared options).
  variantOptions: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(60),
        values: z.array(z.string().trim().min(1).max(80)).min(1),
      }),
    )
    .max(4)
    .optional(),
  variants: z
    .array(
      z.object({
        id: z.string().uuid().optional(),
        selection: z.record(z.string(), z.string()),
        sku: z.string().trim().max(64).optional().nullable(),
        price: z.coerce.number().positive().optional().nullable(),
        stock: z.coerce.number().int().nonnegative().default(0),
        images: z.array(z.string().trim().url("Each image must be a valid URL")).default([]),
        isActive: z.boolean().default(true),
      }),
    )
    .optional(),
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

export const productSlugParamSchema = z.object({
  slug: z.string().trim().min(1),
});

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  category: z.string().trim().optional(),
  search: z.string().trim().optional(),
  type: z.enum(PRODUCT_TYPES).optional(),
  isActive: z.coerce.boolean().optional(),
});

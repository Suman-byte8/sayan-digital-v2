import { z } from "zod";

const text = (max) => z.string().trim().max(max).default("");

export const invoiceSettingsSchema = z.object({
  business: z.object({
    nameLine1: text(60),
    nameLine2: text(60),
    // Blank = no logo (the typed name shows instead).
    logoUrl: z
      .string()
      .trim()
      .max(500)
      .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), "Logo must be a full http(s) URL")
      .default(""),
    address: text(500),
    phone: text(40),
    email: z
      .string()
      .trim()
      .max(150)
      .refine((v) => v === "" || /^\S+@\S+\.\S+$/.test(v), "Enter a valid email address")
      .default(""),
    gstin: text(20),
  }),
  paymentInfo: z.object({
    account: text(60),
    accountName: text(100),
    bank: text(150),
    upi: text(100),
  }),
  defaults: z.object({
    invoicePrefix: z
      .string()
      .trim()
      .max(12)
      .regex(/^[A-Za-z0-9._/-]*$/, "Prefix can only use letters, numbers and . _ / -")
      .default("INV-"),
    dueDays: z.coerce.number().int().min(0).max(365).default(7),
    thankYou: text(200),
    terms: text(1500),
    notes: text(1000),
    accentColor: z
      .string()
      .trim()
      .regex(/^#[0-9a-fA-F]{6}$/, "Accent color must be a hex color like #4a3f94")
      .default("#4a3f94"),
    gstEnabled: z.boolean().default(false),
    gstMode: z.enum(["INTRA", "INTER"]).default("INTRA"),
    gstRate: z.coerce.number().min(0).max(100).default(18),
    pricesIncludeGst: z.boolean().default(false),
    roundOff: z.boolean().default(true),
  }),
});

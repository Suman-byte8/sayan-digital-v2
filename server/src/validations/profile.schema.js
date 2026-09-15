import { z } from "zod";

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    phone: z.string().trim().max(20).nullable(),
    businessName: z.string().trim().max(150).nullable(),
    gstin: z.string().trim().max(20).nullable(),
    avatarUrl: z.string().trim().url().nullable(),
    notifyOrderUpdatesWhatsapp: z.boolean(),
    notifyDeliverySms: z.boolean(),
    notifyDesignProofAlerts: z.boolean(),
    notifyPromotionalEmail: z.boolean(),
    notifyFestiveDiscounts: z.boolean(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided" });

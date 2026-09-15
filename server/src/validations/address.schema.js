import { z } from "zod";

const addressBaseSchema = {
  label: z.string().trim().min(1).max(60),
  recipientName: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(1).max(20),
  addressLine1: z.string().trim().min(1).max(200),
  addressLine2: z.string().trim().max(200).optional().nullable(),
  city: z.string().trim().min(1).max(100),
  state: z.string().trim().min(1).max(100),
  pincode: z.string().trim().min(1).max(12),
  isDefaultShipping: z.boolean().default(false),
  isDefaultBilling: z.boolean().default(false),
};

export const createAddressSchema = z.object(addressBaseSchema);

export const updateAddressSchema = z
  .object(addressBaseSchema)
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided" });

export const addressIdParamSchema = z.object({ id: z.string().uuid() });

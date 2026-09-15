import { z } from "zod";

// Deliberately no card-number/CVV/expiry fields — see the schema comment
// on PaymentMethod in schema.prisma. `detail` is free text the user types
// themselves (e.g. a masked card display string or a UPI ID).
export const createPaymentMethodSchema = z.object({
  type: z.enum(["upi", "card", "gst"]),
  title: z.string().trim().min(1).max(100),
  detail: z.string().trim().min(1).max(200),
  isPrimary: z.boolean().default(false),
  badge: z.string().trim().max(60).optional().nullable(),
});

export const paymentMethodIdParamSchema = z.object({ id: z.string().uuid() });

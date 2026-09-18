import { z } from "zod";

// Only "COD" is accepted right now — Razorpay isn't integrated yet, so the
// client disables that option in the UI and this is the server-side
// backstop against a request that claims online payment succeeded when
// nothing actually processed it.
export const createOrderSchema = z.object({
  shippingName: z.string().trim().min(1).max(100),
  shippingPhone: z.string().trim().min(1).max(20),
  shippingAddressLine1: z.string().trim().min(1).max(200),
  shippingAddressLine2: z.string().trim().max(200).optional().nullable(),
  shippingCity: z.string().trim().min(1).max(100),
  shippingState: z.string().trim().min(1).max(100),
  shippingPincode: z.string().trim().min(1).max(12),
  paymentMethod: z.enum(["COD"]),
});

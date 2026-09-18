import { z } from "zod";

export const ORDER_STATUSES = ["PENDING", "IN_PRODUCTION", "SHIPPED", "DELIVERED", "CANCELLED"];

export const orderListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(ORDER_STATUSES).optional(),
  // Matches against order number, customer name and customer email.
  search: z.string().trim().optional(),
});

export const orderIdParamSchema = z.object({ id: z.string().uuid("Invalid order id") });

export const updateOrderSchema = z
  .object({
    status: z.enum(ORDER_STATUSES).optional(),
    shippingCarrier: z.string().trim().max(100).optional().nullable(),
    trackingNumber: z.string().trim().max(100).optional().nullable(),
    estimatedDelivery: z.coerce.date().optional().nullable(),
    isPaid: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: "At least one field must be provided" });

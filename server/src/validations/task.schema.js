import { z } from "zod";

export const TASK_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const taskBaseSchema = {
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(2000).optional().nullable(),
  status: z.enum(TASK_STATUSES).default("PENDING"),
  requiresPayment: z.boolean().default(false),
  // Free-text staff names, not accounts — see the Task model's own comment.
  assignees: z.array(z.string().trim().min(1).max(100)).default([]),
  dueDate: z.coerce.date().optional().nullable(),
  // Manual tasks aren't tied to an order; auto-created ones are (see
  // orders.controller.js). Existence is checked in the controller, not
  // here, since that needs a DB lookup.
  orderId: z.string().uuid().optional().nullable(),
};

export const createTaskSchema = z.object(taskBaseSchema);

export const updateTaskSchema = z
  .object(taskBaseSchema)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const taskIdParamSchema = z.object({ id: z.string().uuid("Invalid task id") });

export const taskListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(TASK_STATUSES).optional(),
  // Matches against title/description.
  search: z.string().trim().optional(),
});

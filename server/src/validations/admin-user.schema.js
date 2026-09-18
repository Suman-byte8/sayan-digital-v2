import { z } from "zod";

export const userListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  // Matches against name, email and phone (see admin-users.controller.js).
  search: z.string().trim().optional(),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid("Invalid customer id"),
});

// Only isMember is admin-editable here — everything else about a customer's
// own account (name/email/phone/etc.) is theirs to change via /profile.
export const updateUserSchema = z.object({
  isMember: z.boolean(),
});

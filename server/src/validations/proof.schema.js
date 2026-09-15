import { z } from "zod";

export const proofIdParamSchema = z.object({ id: z.string().uuid() });

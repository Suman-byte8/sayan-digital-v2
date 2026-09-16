import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { userListQuerySchema, userIdParamSchema } from "../validations/admin-user.schema.js";
import { listUsers, getUserDetail, deleteUser } from "../controllers/admin-users.controller.js";

const router = Router();

router.get("/", validate(userListQuerySchema, "query"), asyncHandler(listUsers));

router.get(
  "/:id",
  validate(userIdParamSchema, "params"),
  asyncHandler(getUserDetail),
);

router.delete(
  "/:id",
  validate(userIdParamSchema, "params"),
  asyncHandler(deleteUser),
);

export default router;

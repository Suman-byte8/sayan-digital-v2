import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  taskListQuerySchema,
} from "../validations/task.schema.js";
import { listTasks, getTask, createTask, updateTask, deleteTask } from "../controllers/admin-tasks.controller.js";

const router = Router();

router.get("/", validate(taskListQuerySchema, "query"), asyncHandler(listTasks));

router.get("/:id", validate(taskIdParamSchema, "params"), asyncHandler(getTask));

router.post("/", validate(createTaskSchema, "body"), asyncHandler(createTask));

router.patch(
  "/:id",
  validate(taskIdParamSchema, "params"),
  validate(updateTaskSchema, "body"),
  asyncHandler(updateTask),
);

router.delete("/:id", validate(taskIdParamSchema, "params"), asyncHandler(deleteTask));

export default router;

import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { uploadImageMiddleware } from "../middleware/upload.js";
import { uploadImage } from "../controllers/uploads.controller.js";

const router = Router();

router.post("/image", uploadImageMiddleware, asyncHandler(uploadImage));

export default router;

import multer from "multer";
import { ApiError } from "../utils/api-error.js";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter(req, file, cb) {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new ApiError(400, "Only JPEG, PNG, WEBP or GIF images are allowed"));
      return;
    }
    cb(null, true);
  },
});

export const uploadImageMiddleware = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "Image must be 5MB or smaller"
          : error.message;
      return next(new ApiError(400, message));
    }
    if (error) return next(error);

    if (!req.file) {
      return next(new ApiError(400, "No file uploaded — expected a 'file' field"));
    }
    next();
  });
};

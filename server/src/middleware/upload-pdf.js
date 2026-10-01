import multer from "multer";
import { ApiError } from "../utils/api-error.js";

const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PDF_BYTES },
  fileFilter(req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      cb(new ApiError(400, "Only PDF files are allowed"));
      return;
    }
    cb(null, true);
  },
});

export const uploadPdfMiddleware = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return next(new ApiError(400, error.code === "LIMIT_FILE_SIZE" ? "PDF must be 10MB or smaller" : error.message));
    }
    if (error) return next(error);
    if (!req.file) return next(new ApiError(400, "No file uploaded - expected a 'file' field"));
    // Magic-number check: the declared mimetype alone is client-controlled.
    if (req.file.buffer.subarray(0, 5).toString() !== "%PDF-") {
      return next(new ApiError(400, "File is not a valid PDF"));
    }
    next();
  });
};

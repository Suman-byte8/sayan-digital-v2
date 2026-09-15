import { Prisma } from "../generated/prisma/client.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

// Centralized error handler — must be the LAST middleware registered.
// eslint-disable-next-line no-unused-vars
export function errorHandler(error, req, res, next) {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      details: error.details,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const field = error.meta?.target?.join?.(", ") ?? "field";
      return res.status(409).json({
        success: false,
        error: `A product with this ${field} already exists`,
      });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
  }

  console.error(error);

  res.status(500).json({
    success: false,
    error: "Internal server error",
    ...(env.NODE_ENV === "development" ? { message: error.message } : {}),
  });
}

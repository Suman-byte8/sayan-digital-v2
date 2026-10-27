import { Prisma } from "../generated/prisma/client.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

// These Prisma-error messages were written for the products API; other
// routes get a neutral wording instead of a misleading "Product ..." one.
function isProductRoute(req) {
  return req.baseUrl?.startsWith("/api/products") ?? false;
}

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

  // Malformed or oversized JSON bodies (from express.json) are client
  // errors, not server failures.
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, error: "Invalid JSON body" });
  }
  if (error.type === "entity.too.large") {
    return res.status(413).json({ success: false, error: "Request body is too large" });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      // Shape varies by Prisma version/adapter: classic `meta.target`
      // (array or string) on some, but in Prisma 7's driver-adapter mode
      // it's nested under meta.driverAdapterError.cause.constraint.index
      // (a Postgres constraint name like "products_slug_key") instead.
      const target = error.meta?.target;
      const constraintName =
        error.meta?.driverAdapterError?.cause?.constraint?.index ??
        (typeof target === "string" ? target : undefined);
      const field = Array.isArray(target)
        ? target.join(", ")
        : (constraintName?.match(/products_(\w+)_key/)?.[1] ?? "field");
      return res.status(409).json({
        success: false,
        error: isProductRoute(req) ? `A product with this ${field} already exists` : "This record already exists",
      });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, error: isProductRoute(req) ? "Product not found" : "Not found" });
    }
  }

  console.error(error);

  res.status(500).json({
    success: false,
    error: "Internal server error",
    ...(env.NODE_ENV === "development" ? { message: error.message } : {}),
  });
}

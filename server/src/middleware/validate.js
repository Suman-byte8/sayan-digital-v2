// Generic Zod-backed request validation middleware. Parsed (type-coerced/
// defaulted) data is attached to req.validated[source] rather than
// overwriting req[source] directly — Express 5 made `req.query` a
// getter-only property, so `req.query = ...` throws.
export function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: result.error.flatten().fieldErrors,
      });
    }

    req.validated ??= {};
    req.validated[source] = result.data;
    next();
  };
}

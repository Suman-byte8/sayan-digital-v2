// Wraps an async route handler so a rejected promise is forwarded to
// Express's error-handling middleware instead of crashing the process.
export function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

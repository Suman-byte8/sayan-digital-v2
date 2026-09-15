// Thrown by controllers for expected/handled failures (not found, conflict,
// etc). The error handler middleware knows how to turn this into the right
// HTTP status + JSON shape; anything else is treated as an unexpected 500.
export class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const isInvalidJson =
    error instanceof SyntaxError &&
    error.status === 400 &&
    "body" in error;

  const statusCode = isInvalidJson
    ? 400
    : Number(error.statusCode || error.status || 500);

  const message = isInvalidJson
    ? "Invalid JSON in request body."
    : error.message || "Internal server error.";

  if (statusCode >= 500) {
    console.error("Unhandled server error:", {
      method: req.method,
      path: req.originalUrl,
      message,
      stack: error.stack,
    });
  }

  return res.status(statusCode).json({
    status: "error",
    message,
    method: req.method,
    path: req.originalUrl,
  });
};

module.exports = errorHandler;
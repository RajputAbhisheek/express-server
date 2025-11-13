// 404 Not Found handler
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.status = 404;
  next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  console.error("Error:", err.message, err.stack); // Log for debugging

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Show stack in dev
  });
};

module.exports = { notFound, errorHandler };

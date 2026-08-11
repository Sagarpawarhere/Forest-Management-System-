// Centralized error handler middleware
function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    errors: err.errors || undefined
  });
}

module.exports = errorHandler;

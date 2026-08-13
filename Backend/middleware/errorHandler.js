// Central error + 404 handling so routes never leak stack traces to clients.
const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

const errorHandler = (err, req, res, _next) => {
  const status = err.status || err.statusCode || 500;

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(err.errors || {}).map((e) => e.message),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid identifier' });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: 'Duplicate value',
      fields: Object.keys(err.keyValue || {}),
    });
  }

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    message: status >= 500 ? 'Server error' : err.message || 'Request failed',
  });
};

// Wraps async route handlers so rejections reach errorHandler.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { notFound, errorHandler, asyncHandler };

/**
 * Centralized Error Handling Middleware for Express
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for developers
  console.error('[Error Details]:', err);

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Invalid format for field: ${err.path} with value: ${err.value}`;
    return res.status(400).json({
      success: false,
      error: message,
    });
  }

  // Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue)[0];
    const duplicateValue = err.keyValue[duplicateField];
    const message = `Duplicate value '${duplicateValue}' entered for '${duplicateField}' field. It must be unique.`;
    return res.status(400).json({
      success: false,
      error: message,
    });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: messages,
    });
  }

  // Default Fallback Server Error
  return res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;

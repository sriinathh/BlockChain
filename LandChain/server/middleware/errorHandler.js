// Centralized Error Handling Middleware for Express

// Wrap async routes to avoid try-catch blocks
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log for developer debugging
  console.error('SERVER EXCEPTION LOGGED:', err);

  // Mongoose Bad ObjectId (Cast Error)
  if (err.name === 'CastError') {
    const message = `Resource not found with parameters matching: ${err.value}`;
    error = { statusCode: 404, message };
  }

  // Mongoose Duplicate Key (MongoError / MongoServerError)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Registry conflict error. Field '${field}' value already exists in system records.`;
    error = { statusCode: 409, message };
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { statusCode: 400, message };
  }

  const statusCode = error.statusCode || 500;
  const responseMessage = error.message || 'Internal Server Network Error';

  res.status(statusCode).json({
    success: false,
    message: responseMessage,
    // Add stack trace in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = {
  asyncHandler,
  errorHandler
};

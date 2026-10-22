const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || (res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Resource not found with invalid ID: ${err.value}`;
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const fields = Object.keys(err.keyValue || {}).join(', ');
    message = `Duplicate field value entered for [${fields}]. This record already exists.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Database validation error';
    errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message
    }));
  }

  // Handle Syntax Error in Body Parser (malformed JSON)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON payload provided in request.';
  }

  if (statusCode === 500) {
    console.error(`[Unhandled Server Error] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: env.nodeEnv === 'development' ? err.stack : undefined
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Endpoint not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};

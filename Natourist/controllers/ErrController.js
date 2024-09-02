const AppErr = require('../utils/AppErr');

// Error handler functions for different types of errors
const handleCastErrorDB = (err) => {
  const msg = 'Invalid data format provided.';
  return new AppErr(msg, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const msg = 'Duplicate field value entered. Please use a different value.';
  return new AppErr(msg, 400);
};

const handleValidationErrorDB = (err) => {
  const msg = 'Invalid input data. Please correct the errors and try again.';
  return new AppErr(msg, 400);
};

const handleJWTErr = () =>
  new AppErr('Authentication error. Please log in again.', 401);

const handleTokenExpiredError = () =>
  new AppErr('Your session has expired. Please log in again.', 401);

// Error handling function for development environment
const sendErrorDev = (err, req, res) => {
  // For API requests
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      error: err,
      message: err.message || 'Internal Server Error',
      stack: err.stack || 'No stack trace available',
    });
  }

  // For rendered website views
  return res.status(err.statusCode || 500).render('error', {
    title: 'Something went wrong',
    msg: err.message || 'An error occurred',
  });
};

// Error handling function for production environment
const sendErrorProd = (err, req, res) => {
  // For API requests
  if (req.originalUrl.startsWith('/api')) {
    // Operational errors that we can trust
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status || 'error',
        message: err.message || 'An error occurred',
      });
    }
    // Programming or unknown errors: don't leak error details
    console.error('ERROR:', err); // Log error details for developer reference
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong, please try again later.',
    });
  }

  // For rendered website views
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: 'An error occurred while processing your request.',
    });
  }

  // Log the error for the developer
  console.error('ERROR:', err);
  return res.status(500).render('error', {
    title: 'Something went wrong',
    msg: 'Something went wrong, please try again later.',
  });
};

// Main error handling middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // Handling specific errors based on error type or code
    if (error.name === 'CastError') error = handleCastErrorDB(err);
    if (error.code === 11000) error = handleDuplicateFieldsDB(err);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (error.name === 'JsonWebTokenError') error = handleJWTErr();
    if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();

    // Send generic message to users
    sendErrorProd(error, req, res);
  }
};

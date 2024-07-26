const AppErr = require('../utils/AppErr');

const handleCastErrorDB = (err) => {
  const msg = `Invalid ${err.path}: ${err.value}`;
  return new AppErr(msg, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg && err.errmsg.match(/(["'])(\\?.)*?\1/);

  const msg = `Duplicate field value: ${value}. Please use another value!`;
  return new AppErr(msg, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack, // Include the stack trace for debugging
  });
};

const sendErrorProd = (err, res) => {
  // Check if the error is operational (known and trusted error)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Log the error for internal tracking
    console.error('ERROR:', err);
    // Send a generic error message to the client
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong, please try again later.',
    });
  }
};

module.exports = (err, req, res, next) => {
  // Set default values for the error status code and status
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Determine the environment and send the appropriate error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign({}, err); // Use Object.assign to properly copy error properties
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    sendErrorProd(error, res);
  }
};

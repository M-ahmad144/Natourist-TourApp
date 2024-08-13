const AppErr = require('../utils/AppErr');

const handleCastErrorDB = (err) => {
  const msg = `Invalid ${err.path}: ${err.value}`;
  return new AppErr(msg, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue
    ? Object.values(err.keyValue).join(', ')
    : 'unknown';
  const msg = `Duplicate field value: ${value}. Please use another value!`;
  return new AppErr(msg, 400);
};

const handleValidationErrorDB = (err) => {
  let errors = Object.values(err.errors).map((val) => val.message);
  const msg = `Invalid field value: ${errors.join('. ')}`;
  return new AppErr(msg, 400);
};

const handleJWTErr = () =>
  new AppErr('The user belonging to this account no longer exists ', 401);

const handleTokenExpiredError = () =>
  new AppErr('Token expired , please login again', 401);

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      error: err,
      message: err.message || 'Internal Server Error',
      stack: err.stack || 'No stack trace available',
    });
  } else {
    // RENDERED WEBSITE
    res.status(err.statusCode || 500).render('error', {
      title: 'Something went wrong',
      msg: err.message || 'An error occurred',
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status || 'error',
        message: err.message || 'An error occurred',
      });
    }
    // Log the error for the developer
    console.error('ERROR:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong, please try again later.',
    });
  }
  // RENDERED WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
  // Log the error for the developer
  console.error('ERROR:', err);
  return res.status(500).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDB(err);
    if (error.code === 11000) error = handleDuplicateFieldsDB(err);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (error.name === 'JsonWebTokenError') error = handleJWTErr();
    if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();
    sendErrorProd(error, req, res);
  }
};

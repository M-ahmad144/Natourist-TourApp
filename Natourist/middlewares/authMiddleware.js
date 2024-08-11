const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppErr = require('../utils/AppErr');
const catchAsync = require('../utils/catchAsync');

// Protect Routes
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppErr('You are not logged in. Please log in to get access.', 401),
    );
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(
      new AppErr('The user belonging to this token no longer exists.', 401),
    );
  }

  if (currentUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppErr(
        'User recently changed their password. Please log in again.',
        401,
      ),
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser; //add user to  the locals to be used in all views

  next();
});

// Restrict to Specific Roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppErr('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

// Check if Logged In
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.user = currentUser; //add user to  the locals to be used in all views

      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

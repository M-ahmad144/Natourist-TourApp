const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppErr = require('../utils/AppErr');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  // 1. Generate a JWT token for the user
  const token = signToken(user._id);

  // 2. Define options for the cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
      // Sets cookie expiration based on environment variable (days to milliseconds)
    ),
    httpOnly: true, // Ensures the cookie is only accessible via HTTP(S) and not by JavaScript in the browser
  };

  // 3. If in production, set the cookie to be secure (only sent over HTTPS)
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // 4. Send the token in a cookie with the name 'jwt'
  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  // 5. Send a JSON response to the client with the status code, token, and user data
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

//sign Up User
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  createSendToken(newUser, 201, res);
});

//sign In User
exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new AppErr('Please provide a valid email and password', 400));
  }

  // Find user by email and select password field
  const user = await User.findOne({ email }).select('+password');

  // Check if user exists and password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppErr('Incorrect email or password', 401));
  }

  // Generate token
  createSendToken(user, 200, res);
});

//protect the routes from not signUp/SignIn user
exports.protect = catchAsync(async (req, res, next) => {
  // 1- getting token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppErr('You are not logged in. Please log in to get access.', 401),
    );
  }

  // 2 - Verify the Token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3 - Check if the user still exists. This ensures the user has not been deleted after the token was issued.
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(
      new AppErr('The user belonging to this token no longer exists.', 401),
    );
  }

  // 4 - Check if user changed the password after the token was issued
  if (currentUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppErr(
        'User recently changed their password. Please log in again.',
        401,
      ),
    );
  }

  // Grant access to the protected route
  req.user = currentUser; // Add the user to the request object to be used in other middleware and controllers.
  next();
});

//restrict common user
exports.restrictTo = (...roles) => {
  // ...roles will contain the array of user roles
  return (req, res, next) => {
    // roles is an array,  ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppErr('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

//forget password
exports.forgetPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on the provided email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppErr('No user found with that email', 404));
  }

  // 2. Generate a random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. Send the reset token to the user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested a password reset. Please click on the following link to complete the process: ${resetURL}. If you did not make this request, please ignore this email and your password will remain unchanged.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Reset password email sent. Please check your inbox.',
    });
  } catch (error) {
    // console.error('Error sending email:', error);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppErr('Error sending email. Please try again later', 500));
  }
});

//reset password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on the token and check if the token has not yet expired
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2. Check if token has not expired and there is user, set the new password
  if (!user) {
    return next(new AppErr('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3. Log in the user
  createSendToken(user, 200, res);
});

//update password
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. Get user from collection
  const user = await User.findById(req.user._id).select('+password');

  // 2. Check if the current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppErr('Incorrect current password', 401));
  }

  // 3. Update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4. Log in the user
  createSendToken(user, 200, res);
});

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppErr = require('../utils/AppErr');
const catchAsync = require('../utils/catchAsync');

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

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
  const token = signToken(user._id);

  // Send response
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1- getting token and check if it exists
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    //format is typically Bearer <token>, so the token is obtained by splitting the string and taking the second part.
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppErr('You are not logged in. Please log in to get access .', 401),
    );
  }

  // 2 - Verfiy the Token
  const verifyPromise = promisify(jwt.verify);
  const decode = await verifyPromise(token, process.env.JWT_SECRET);
  // console.log(decode);

  // 3 - Check if the user still exists. This ensures the user has not been deleted after the token was issued.
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(
      new AppErr('The user belonging to this token no longer exists.', 401),
    );
  }

  // 4 - check if user changed the password after the token was issued
  if (currentUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppErr(
        'User recently changed their password. Please log in again.',
        401,
      ),
    );
  }

  //grant access to the protected route
  req.user = currentUser; //add the user to the request object to be used in other middleware and controllers.
  next();
});

// ...roles will conatin the array of user
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array,  ['admin', 'lead']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppErr('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

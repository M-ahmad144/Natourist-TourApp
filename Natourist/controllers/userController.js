const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppErr');
const factory = require('./handlerFactory');

// Function to filter out unwanted fields from an object
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Middleware in the userRouter to set req.params.id to the current user's ID
// so we don't have to pass it in the URL every time
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Update the current user's details (name, email, etc.)
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create an error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }

  // 2) Filter out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// Deactivate the current user's account
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Create a new user (not used, use /signup instead)
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
};

// Get a single user by ID
exports.getUser = factory.getDocument(User);

// Get all users
exports.getAllUsers = factory.getAllDocuments(User);

// Update a user for admin - Do not update password with this
exports.updateUser = factory.updateDocument(User);

// Delete a user by ID
exports.deleteUser = factory.deleteDocument(User);

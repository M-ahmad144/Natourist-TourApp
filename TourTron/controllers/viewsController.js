const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppErr = require('../utils/AppErr');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  // Find the tour by slug and populate the reviews
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  // If the tour doesn't exist, throw an error
  if (!tour) {
    return next(new AppErr('There is no tour with that name.', 404));
  }

  // Render the tour page
  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour,
  });
});
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signUp', {
    title: 'Create your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

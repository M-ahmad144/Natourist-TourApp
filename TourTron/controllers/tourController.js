const Tour = require('../models/tourModel');
const ApiFeatures = require('../utils/ApiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppErr = require('../utils/AppErr');

// Middleware to alias the top 5 cheap tours
exports.aliasToptour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage price';
  req.query.fields = 'name price ratingsAverage summary difficulty';
  next();
  console.log(req.query.sort);
};

// Get all tours
exports.getAllTours = catchAsync(async (req, res, next) => {
  // example:GET /api/v1/tours?price[gte]=500&sort=-ratingsAverage,price&fields=name,duration,price&page=2&limit=10
  const features = new ApiFeatures(Tour.find(), req.query)
    .filter() // Apply filtering: Tour.find({ price: { $gte: 500 } })
    .sort() // Apply sorting: Tour.find({ price: { $gte: 500 } }).sort('-ratingsAverage price')
    .limitFields() // Apply field limiting: Tour.find({ price: { $gte: 500 } }).sort('-ratingsAverage price').select('name duration difficulty')
    .paginate(); // Apply pagination: Tour.find({ price: { $gte: 500 } }).sort('-ratingsAverage price').select('name duration difficulty').skip(10).limit(10)

  // Execute the query
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
// Get a single tour
exports.getTour = catchAsync(async (req, res, next) => {
  //populate('guides') -popuate the guides data in the get tour
  const tour = await Tour.findById(req.params.id).populate('reviews');
  if (!tour) {
    return next(new AppErr('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// Create a new tour
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

// Update an existing tour
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppErr('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// Delete a tour
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppErr('No tour found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    message: 'Tour deleted successfully',
  });
});
//get tour stats
exports.getToursStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: {
          $toUpper: '$difficulty',
        },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
//get monthy plan
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      // The $unwind stage deconstructs the startDates array field,
      // This means that if a tour has multiple start dates, each date will have its own document.
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      //hide the _id field
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTours: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

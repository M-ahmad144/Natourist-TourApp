const Tour = require('../models/tourModel');

// Get all tours
exports.getAllTours = async (req, res) => {
  try {
    // Make a shallow copy of req.query to modify without affecting the original
    const queryObj = { ...req.query };

    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Convert queryObj to a JSON string and replace query operators with MongoDB operators
    let strQuery = JSON.stringify(queryObj);
    strQuery = strQuery.replace(
      /\b(gte|gt|lt|lte|in)\b/g,
      (match) => `$${match}`,
    );

    // Build the query
    let query = Tour.find(JSON.parse(strQuery));

    // _______________Apply sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // _______________ Apply field limiting
    const fields = req.query.fields
      ? req.query.fields.split(',').join(' ')
      : '-__v';
    query = query.select(fields);

    // _______________Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTour = await Tour.countDocuments();
      if (skip >= numTour) {
        throw new Error('this page does not exist');
      }
    }

    //  ________________Execute query
    //because of chaining the methods  the query looks like this -> query.sort().select().skip().limit()
    const tours = await query;

    // Respond with the results
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    // Log the error for debugging purposes
    console.error(err);

    // Respond with error message
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Get a single tour
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Create a new tour
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data',
    });
  }
};

// Update an existing tour
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Delete a tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      message: 'Tour deleted successfully',
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

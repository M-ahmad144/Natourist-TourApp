// Tour handler factory
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppErr');
const ApiFeatures = require('../utils/ApiFeatures');

// Factory function to delete a document
exports.deleteDocument = (Model) =>
  catchAsync(async (req, res, next) => {
    // Find and delete the document by ID
    const document = await Model.findByIdAndDelete(req.params.id);

    // If no document is found, return a 404 error
    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    // Send a success response
    res.status(204).json({
      status: 'success',
      message: 'Document deleted successfully',
    });
  });

exports.updateDocument = (Model) =>
  catchAsync(async (req, res, next) => {
    // Find and update the document by ID
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }
    // Send a success response
    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.createDocument = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDocument = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: newDocument,
      },
    });
  });

// Factory function to get all documents
exports.getAllDocuments = (Model) =>
  catchAsync(async (req, res, next) => {
    // to allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // Features: filter, sort, limit fields, paginate
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter() // Apply filtering: e.g., Model.find({ price: { $gte: 500 } })
      .sort() // Apply sorting: e.g., Model.find().sort('-ratingsAverage price')
      .limitFields() // Apply field limiting: e.g., Model.find().select('name duration price')
      .paginate(); // Apply pagination: e.g., Model.find().skip(10).limit(10)

    // const documents = await features.query.explain();
    // Execute the query
    const documents = await features.query;

    // If no documents are found, return a 404 error
    if (!documents.length) {
      return next(new AppError('No documents found', 404));
    }

    // Send a success response
    res.status(200).json({
      status: 'success',
      results: documents.length,
      data: {
        data: documents,
      },
    });
  });

exports.getDocument = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const document = await query;

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

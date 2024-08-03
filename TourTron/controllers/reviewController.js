const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

//middleware to set tourId and userId for the review
exports.setTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

//get all reviews
exports.getAllReviews = factory.getAllDocuments(Review);

//get a single review
exports.getReview = factory.getDocument(Review);

//create a review
exports.createReview = factory.createDocument(Review);

//delete a review
exports.deleteReview = factory.deleteDocument(Review);

//update a review
exports.updateReview = factory.updateDocument(Review);

const express = require('express');
const router = express.Router({ mergeParams: true }); //mergeParams: true to access parameters from the parent route, such as :tourId
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

//POSt - '/tour/:tourId/reviews'    - create new review for that tour
//GET - 'tour/:tourId/reviews'      - get all reviews for that tour

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview,
  );

module.exports = router;

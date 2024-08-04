const express = require('express');
const router = express.Router({ mergeParams: true });
// mergeParams: true allows this router to access parameters from the parent router
// (e.g., :tourId from routes defined in tourRouter)
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// Middleware to protect all routes defined after this point
router.use(authController.protect);

//if we get a route like below with tourId or not(in mergeParams) they all end up in this route('/') handler
//Post - /tour/:tourId/reviews
//Get - /tour/:tourId/reviews
//Post - /tour/reviews
router.route('/').get(reviewController.getAllReviews).post(
  authController.restrictTo('user'),
  reviewController.setTourUserId, // middleware to set tourId and userId for the review
  reviewController.createReview,
);

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo('admin', 'user'),
    reviewController.deleteReview,
  )
  .patch(
    authController.restrictTo('admin', 'user'),
    reviewController.updateReview,
  );

module.exports = router;

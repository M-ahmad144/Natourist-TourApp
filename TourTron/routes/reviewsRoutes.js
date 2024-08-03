const express = require('express');
const router = express.Router({ mergeParams: true });
// mergeParams: true allows this router to access parameters from the parent router
// (e.g., :tourId from routes defined in tourRouter)
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// Middleware to protect all routes defined after this point
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserId,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo('admin', 'user'), // Only 'admin' or the user who created the review can delete it
    reviewController.deleteReview,
  )
  .patch(
    authController.restrictTo('admin', 'user'), // Only 'admin' or the user who created the review can update it
    reviewController.updateReview,
  );

module.exports = router;

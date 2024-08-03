const express = require('express');
const tourControllers = require('../controllers/tourController');
const authControllers = require('../controllers/authController');
const reviewRouter = require('../routes/reviewsRoutes');

// Creating the Express Router instances for tours
const router = express.Router();

// The router itself is a middleware, so for this specific route, we use the review router defined in reviewRoutes.
router.use('/:tourId/reviews', reviewRouter);

// tours routes
router
  .route('/top-5-cheap')
  .get(tourControllers.aliasToptour, tourControllers.getAllTours);

router.route('/tour-stats').get(tourControllers.getToursStats);
router.route('/monthly-plan/:year').get(tourControllers.getMonthlyPlan);
router
  .route('/')
  .get(authControllers.protect, tourControllers.getAllTours)
  .post(tourControllers.createTour);
router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour,
  );

module.exports = router;

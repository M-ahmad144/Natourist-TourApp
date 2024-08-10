const express = require('express');
const tourControllers = require('../controllers/tourController');
const reviewRouter = require('../routes/reviewsRoutes');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Middleware for nested routes
// For routes starting with /:tourId/reviews, use the reviewRouter defined in reviewsRoutes file
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourControllers.aliasToptour, tourControllers.getAllTours);

router.route('/tour-stats').get(tourControllers.getToursStats);

router
  .route('/monthly-plan/:year')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'lead-guide', 'guide'),
    tourControllers.getMonthlyPlan,
  );

// Route to get tours within a certain distance
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourControllers.getToursWithin);

// Route to get distance between two points
router.route('/distances/:latlng/unit/:unit').get(tourControllers.getDistances);

router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'lead-guide'),
    tourControllers.createTour,
  );

// Routes for specific tour by ID: get, update, and delete a tour
router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'lead-guide'),
    tourControllers.updateTour,
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour,
  );

module.exports = router;

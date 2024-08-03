const express = require('express');
const tourControllers = require('../controllers/tourController');
const authControllers = require('../controllers/authController');
const reviewRouter = require('../routes/reviewsRoutes');

const router = express.Router();

// Middleware for nested routes
// For routes starting with /:tourId/reviews, use the reviewRouter defined in reviewsRoutes file
router.use('/:tourId/reviews', reviewRouter);

// Route to get top 5 cheap tours
router
  .route('/top-5-cheap')
  .get(tourControllers.aliasToptour, tourControllers.getAllTours);

// Route to get tour statistics
router.route('/tour-stats').get(tourControllers.getToursStats);

// Route to get monthly plan
router.route('/monthly-plan/:year').get(
  authControllers.protect, // Protects the route, only authenticated users can access
  authControllers.restrictTo('admin', 'lead-guide', 'guide'), // Restricts access to certain roles
  tourControllers.getMonthlyPlan,
);

// Route to get all tours or create a new tour
router
  .route('/')
  .get(tourControllers.getAllTours) // Public route, anyone can get access to all tours
  .post(
    authControllers.protect, // Protects the route, only authenticated users can access
    authControllers.restrictTo('admin', 'lead-guide'), // Restricts access to admin and lead-guide roles
    tourControllers.createTour,
  );

// Routes for specific tour by ID: get, update, and delete a tour
router
  .route('/:id')
  .get(tourControllers.getTour) // Public route to get a specific tour by ID
  .patch(
    authControllers.protect, // Protects the route, only authenticated users can access
    authControllers.restrictTo('admin', 'lead-guide'), // Restricts access to admin and lead-guide roles
    tourControllers.updateTour,
  )
  .delete(
    authControllers.protect, // Protects the route, only authenticated users can access
    authControllers.restrictTo('admin', 'lead-guide'), // Restricts access to admin and lead-guide roles
    tourControllers.deleteTour,
  );

module.exports = router;

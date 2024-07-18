const express = require('express');
const tourControllers = require('../controllers/tourController');
// Creating the Express Router instances for tours
const router = express.Router();
router.param('id', tourControllers.checkId);
// tours routes
router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(tourControllers.createTour);
router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

module.exports = router;

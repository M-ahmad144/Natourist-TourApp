const express = require('express');
const viewsController = require('../controllers/viewsController');
const authMiddleware = require('../middlewares/authMiddleware');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// Public routes accessible without authentication
router.get(
  '/',
  bookingController.createBookingCheckout,
  authMiddleware.isLoggedIn,
  viewsController.getOverview,
);
router.get('/login', authMiddleware.isLoggedIn, viewsController.getLoginForm);
router.get('/signUp', authMiddleware.isLoggedIn, viewsController.getSignupForm);
router.get(
  '/tour/:slug',
  authMiddleware.isLoggedIn,
  authMiddleware.protect,
  viewsController.getTour,
);
router.get('/me', authMiddleware.protect, viewsController.getAccount);
router.get('/my-tours', authMiddleware.protect, viewsController.getMyTours);

module.exports = router;

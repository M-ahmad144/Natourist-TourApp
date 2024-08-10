const express = require('express');
const viewsController = require('../controllers/viewsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes accessible without authentication
router.get('/', authMiddleware.isLoggedIn, viewsController.getOverview);
router.get('/login', authMiddleware.isLoggedIn, viewsController.getLoginForm);
router.get('/signUp', authMiddleware.isLoggedIn, viewsController.getSignupForm);
router.get(
  '/tour/:slug',
  authMiddleware.isLoggedIn,
  authMiddleware.protect,
  viewsController.getTour,
);
router.get('/me', authMiddleware.protect, viewsController.getAccount);

module.exports = router;

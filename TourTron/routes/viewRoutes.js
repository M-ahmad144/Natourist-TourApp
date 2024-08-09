const express = require('express');
const viewsController = require('../controllers/viewsController');
const auth = require('../controllers/authController');

const router = express.Router();

// Middleware to check if the user is logged in
router.use(auth.isLoggedIn);

// Public routes accessible without authentication
router.get('/', viewsController.getOverview);
router.get('/login', viewsController.getLoginForm);
router.get('/signUp', viewsController.getSignupForm);

// Protected routes
router.get('/tour/:slug', viewsController.getTour);

module.exports = router;

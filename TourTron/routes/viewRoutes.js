const express = require('express');
const viewsController = require('../controllers/viewsController');
const auth = require('../controllers/authController');

const router = express.Router();

router.use(auth.isLoggedIn);

router.get('/', viewsController.getOverview);

router.get('/tour/:slug', viewsController.getTour);

router.get('/login', viewsController.getLoginForm);

router.get('/signUp', viewsController.getSignupForm);

module.exports = router;

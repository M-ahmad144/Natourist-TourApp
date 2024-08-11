const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Authentication routes - open to everyone
router.post('/signup', authController.signUp);
router.post('/logIn', authController.logIn);
router.get('/logout', authController.logout);
router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protected routes middleware - protcts all routes after this are protected
router.use(authMiddleware.protect);

// Update the current user's password
router.patch('/updateMyPassword', authController.updatePassword);
// Get the current user's details
router.get(
  '/me',
  userController.getMe, // Sets the userId in the params
  userController.getUser,
);
// Update the current user's details
router.patch('/updateMe', userController.updateMe);
// Deactivate the current user's account
router.delete('/deleteMe', userController.deleteMe);

//after this middleware, only admin can access these routes
router.use(authMiddleware.restrictTo('admin'));

// User management routes for admins
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

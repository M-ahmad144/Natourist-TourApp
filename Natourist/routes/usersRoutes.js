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

router.use(authMiddleware.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.get(
  '/me',
  userController.getMe, // Sets the userId in the params
  userController.getUser,
);

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
// Deactivate the current user's account
router.delete('/deleteMe', userController.deleteMe);

router.use(authMiddleware.restrictTo('admin'));

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

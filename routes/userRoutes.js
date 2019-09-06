const express = require('express');
const userController = require('./../controllers/userController'); //63
const authController = require('./../controllers/authController'); //125
////ROUTES
//62,63
const router = express.Router();

//125
router.post('/signup', authController.signup);
//129
router.post('/login', authController.login);

//134
router.post('/forgotPassword', authController.forgotPassword);
//134, 135
router.patch('/resetPassword/:token', authController.resetPassword);

//137
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

//138
router.patch('/updateMe', authController.protect, userController.updateMe);

//61, 63
router
  .route(`/`)
  .get(userController.getAllUsers)
  .post(userController.createUser);
//61, 63
router
  .route(`/:id`)
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
//63
module.exports = router;

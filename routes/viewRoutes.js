const express = require('express'); //180
const viewsController = require('../controllers/viewsController'); //180
const authController = require('../controllers/authController'); //188
const bookingController = require('../controllers/bookingController'); //213

const router = express.Router(); //180

////ROUTES

//179, 180, 193, 213
router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);

//179, 180, 183, 188, 189, 193
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);

//187, 193
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);

//193
router.get('/me', authController.protect, viewsController.getAccount);

//194
router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;

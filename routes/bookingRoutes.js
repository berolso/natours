//210
const express = require('express'); //154
const bookingController = require('../controllers/bookingController.js');
const authController = require('./../controllers/authController'); //1154

//210
const router = express.Router();

//210
router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession
);

module.exports = router;

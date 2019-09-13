//bookingRouter
//210
const express = require('express'); //154
const bookingController = require('./../controllers/bookingController.js');
const authController = require('./../controllers/authController'); //1154

//210
const router = express.Router();

//215
router.use(authController.protect);

//210, 215
router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

//215
router.use(authController.restrictTo('admin', 'lead-guide'));

//215
router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

//215
router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;

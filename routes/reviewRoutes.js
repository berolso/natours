const express = require('express'); //154
const reviewController = require('../controllers/reviewController.js');
const authController = require('./../controllers/authController'); //1154

//routes

//154
const router = express.Router();

//154
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

//154
module.exports = router;

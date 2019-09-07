const express = require('express'); //154
const reviewController = require('../controllers/reviewController.js');
const authController = require('./../controllers/authController'); //1154

//routes

//154, 158
const router = express.Router({ mergeParams: true });

//158
//post /tour/id:saldkjfa/reveiws
//post /reviews

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

const express = require('express'); //154
const reviewController = require('../controllers/reviewController.js');
const authController = require('./../controllers/authController'); //1154

//routes

//154, 158
const router = express.Router({ mergeParams: true });

//164
router.use(authController.protect);

//158
//post /tour/id:saldkjfa/reveiws
//post /reviews

//154, 161, 164
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

//160, 161, 164
router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

//154
module.exports = router;

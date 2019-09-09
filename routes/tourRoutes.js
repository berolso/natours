const express = require('express');
const tourController = require('./../controllers/tourController'); //63
const authController = require('./../controllers/authController'); //130
const reviewRouter = require('./../routes/reviewRoutes');
////ROUTES
//62,63
const router = express.Router();

//164

//64
// router.param('id', tourController.checkID);

//157
// post/tour/id:sdjfdsfjs/reviews
// get/tour/id:sdjfdsfjs/reviews

//158
router.use('/:tourId/reviews', reviewRouter);

//99
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

//101
router.route('/tour-stats').get(tourController.getTourStats);
//102, 164
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  ); //164

//170
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

//171
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

//57, 63, 65, 88, 130, 164
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  ); //164
//57, 63, 133, 164
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  ) //164
  .delete(
    authController.protect, //133
    authController.restrictTo('admin', 'lead-guide'), //133
    tourController.deleteTour
  );

//63
module.exports = router;

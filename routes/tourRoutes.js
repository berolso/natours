const express = require('express');
const tourController = require('./../controllers/tourController'); //63
const authController = require('./../controllers/authController'); //130
////ROUTES
//62,63
const router = express.Router();

//64
// router.param('id', tourController.checkID);

//99
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

//101
router.route('/tour-stats').get(tourController.getTourStats);
//102
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

//57, 63, 65, 88, 130
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
//57, 63, 133
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect, //133
    authController.restrictTo('admin', 'lead-guide'), //133
    tourController.deleteTour
  );
//63
module.exports = router;

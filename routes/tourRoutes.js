const express = require('express');
const tourController = require('./../controllers/tourController'); //63
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

//57, 63, 65, 88
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
//57, 63
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);
//63
module.exports = router;

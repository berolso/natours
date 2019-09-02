const express = require('express');
const tourController = require('./../controllers/tourController'); //63
////ROUTES
//62,63
const router = express.Router();

//64
// router.param('id', tourController.checkID);

//57, 63, 65
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);
//57, 63
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);
//63
module.exports = router;

const express = require('express'); //180
const viewsController = require('../controllers/viewsController'); //180

const router = express.Router(); //180

////ROUTES

//179, 180
router.get('/', viewsController.getOverview);

//179, 180
router.get('/tour', viewsController.getTour);

module.exports = router;

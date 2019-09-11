const express = require('express'); //180
const viewsController = require('../controllers/viewsController'); //180
const authController = require('../controllers/authController'); //188

const router = express.Router(); //180

////ROUTES

//188, 189
router.use(authController.isLoggedIn);

//179, 180
router.get('/', viewsController.getOverview);

//179, 180, 183, 188, 189
router.get('/tour/:slug', viewsController.getTour);

//187
router.get('/login', viewsController.getLoginForm);

module.exports = router;

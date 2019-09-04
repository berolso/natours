const express = require('express');
const userController = require('./../controllers/userController'); //63
const authController = require('./../controllers/authController'); //125
////ROUTES
//62,63
const router = express.Router();

//125
router.post('/signup', authController.signup);
//61, 63
router
  .route(`/`)
  .get(userController.getAllUsers)
  .post(userController.createUser);
//61, 63
router
  .route(`/:id`)
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
//63
module.exports = router;

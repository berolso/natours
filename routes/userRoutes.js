const express = require('express');
const userController = require('./../controllers/userController'); //63
////ROUTES
//62,63
const router = express.Router();

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

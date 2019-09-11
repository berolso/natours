const express = require('express');
const multer = require('multer'); //198
const userController = require('./../controllers/userController'); //63
const authController = require('./../controllers/authController'); //125

//198
const upload = multer({ dest: 'public/img/users'})

////ROUTES
//62,63
const router = express.Router();

//125
router.post('/signup', authController.signup);
//129
router.post('/login', authController.login);
//191
router.get('/logout', authController.logout);

//134
router.post('/forgotPassword', authController.forgotPassword);
//134, 135
router.patch('/resetPassword/:token', authController.resetPassword);

//164
router.use(authController.protect);

//137, 164
router.patch('/updateMyPassword', authController.updatePassword);

//163, 164
router.get('/me', userController.getMe, userController.getUser);

//138, 164, 198
router.patch('/updateMe', upload.single('photo'), userController.updateMe);
//139, 164
router.delete('/deleteMe', userController.deleteMe);

//164
router.use(authController.restrictTo('admin'));

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

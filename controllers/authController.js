const jwt = require('jsonwebtoken'); //128
const User = require('../models/userModel'); //125
const catchAsync = require('../utils/catchAsync'); //125

//125
exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  //128 fixes to not allow anyone to be admin from signup
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  //128
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  res.status(201).json({
    status: 'success',
    data: {
      token, //128
      user: newUser
    }
  });
});

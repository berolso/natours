const jwt = require('jsonwebtoken'); //128
const User = require('../models/userModel'); //125
const catchAsync = require('../utils/catchAsync'); //125
const AppError = require('./../utils/appError'); //129

//129
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
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
  //128, 129
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    data: {
      token, //128
      user: newUser
    }
  });
});

//129
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  //2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //3) If everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

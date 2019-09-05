const { promisify } = require('util'); //131
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
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt, //131 my
    role: req.body.role //133 my
  });
  //128, 129
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token, //128
    data: {
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

//130
exports.protect = catchAsync(async (req, res, next) => {
  //1) getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access', 401)
    );
  }
  //2) verification token //131
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //3) Check if user still exits //131
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists')
    );
  }
  //4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password: Please lon in again', 401)
    );
  }
  //grant access to protecte route
  req.user = currentUser;
  next();
});

//133
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles['admin','lead-guide'], role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

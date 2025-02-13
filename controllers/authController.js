const crypto = require('crypto'); //136
const { promisify } = require('util'); //131
const jwt = require('jsonwebtoken'); //128
const User = require('../models/userModel'); //125
const catchAsync = require('../utils/catchAsync'); //125
const AppError = require('./../utils/appError'); //129
const sendEmail = require('./../utils/email'); //135
const Email = require('./../utils/email'); //206

//129
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

//137
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  // 223
  // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  //heroku specific move to above

  res.cookie('jwt', token, {
    //141
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    //herokus specific req.headers [] not () like in video
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });
  //remove the password from the output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

//125, 206
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
  //206
  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log(url);
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, req, res); //137, 223
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
  createSendToken(user, 200, req, res); //137, 223
});

//191
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

//130
exports.protect = catchAsync(async (req, res, next) => {
  //1) getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    //188
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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
  //193
  res.locals.user = currentUser;

  next();
});

//189
//only for rendered page, there will be no errors
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    //191
    try {
      token = req.cookies.jwt;
      //1) verification token //131, 188
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      //2) Check if user still exits //131
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      //3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      //there is a logged in user
      res.locals.user = currentUser;
      return next();
    } catch {
      return next();
    }
  }
  next();
};

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

//134, 207
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on posted token
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }
  //2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3) Send it to user's email
  try {
    //135
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    //207
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

//134, 136
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  //2)if token has not expired and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //3) update changedPasswordAt property for the user
  //4) log the user in, send jwt
  createSendToken(user, 200, req, res); //137, 223
});

//137
exports.updatePassword = catchAsync(async (req, res, next) => {
  //get user from collection
  const user = await User.findById(req.user.id).select('+password');
  //2 check if posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //3 if so, update password
  //4 log user in, send jwt
  createSendToken(user, 200, req, res); //137, 223
});

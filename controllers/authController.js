const User = require('../models/userModel'); //125
const catchAsync = require('../utils/catchAsync'); //125

//125
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});

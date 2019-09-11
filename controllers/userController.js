const multer = require('multer'); //199
const sharp = require('sharp'); //201
const User = require('./../models/userModel'); //129
const catchAsync = require('./../utils/catchAsync'); //129
const AppError = require('./../utils/appError'); //138
const factory = require('./handlerFactory'); //160

// //199
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     //user-34523523525-232423423423.jpeg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
//201
const multerStorage = multer.memoryStorage();

//199
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};
//199
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

//199
exports.uploadUserPhoto = upload.single('photo');

//201
exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

//138
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//163
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//138
exports.updateMe = catchAsync(async (req, res, next) => {
  //1 create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }
  //2 filtered out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  //200
  if (req.file) filteredBody.photo = req.file.filename;
  //3 update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

//139
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'sucess',
    data: null
  });
});

//61, 63,
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined. Please Use signUp instead'
  });
};

//61, 63, 162
exports.getUser = factory.getOne(User);

//61, 63, 129, 162
exports.getAllUsers = factory.getAll(User);

//61, 63, 161
// do not update passwords with this
exports.updateUser = factory.updateOne(User);

//61, 63, 160
exports.deleteUser = factory.deleteOne(User);

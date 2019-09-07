const Review = require('./../models/reviewModel'); //154
// const catchAsync = require('./../utils/catchAsync'); //154
const factory = require('./handlerFactory'); //160

//161
exports.setTourUserIds = (req, res, next) => {
  //nested routes 157
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

//154, 159, 162
exports.getAllReviews = factory.getAll(Review);

//162
exports.getReview = factory.getOne(Review);

//154, 157, 161
exports.createReview = factory.createOne(Review);

//161
exports.updateReview = factory.updateOne(Review);

//160
exports.deleteReview = factory.deleteOne(Review);

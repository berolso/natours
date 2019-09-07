const Review = require('./../models/reviewModel'); //154
const catchAsync = require('./../utils/catchAsync'); //154
const factory = require('./handlerFactory'); //160

//154, 159
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  // const features = new APIFeatures(Review.find(), req.query);
  // const reviews = await features.query;
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

//161
exports.setTourUserIds = (req, res, next) => {
  //nested routes 157
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

//154, 157, 161
exports.createReview = factory.createOne(Review);

//161
exports.updateReview = factory.updateOne(Review);

//160
exports.deleteReview = factory.deleteOne(Review);

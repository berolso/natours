const Review = require('./../models/reviewModel'); //154
const catchAsync = require('./../utils/catchAsync'); //154

//154
exports.getAllReviews = catchAsync(async (req, res, next) => {
  // const features = new APIFeatures(Review.find(), req.query);
  // const reviews = await features.query;
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

//154, 157
exports.createReview = catchAsync(async (req, res, next) => {
  //nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  });
});

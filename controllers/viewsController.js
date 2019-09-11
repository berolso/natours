const Tour = require('../models/tourModel'); //181
const catchAsync = require('../utils/catchAsync'); //181

//180, 181
exports.getOverview = catchAsync(async (req, res) => {
  //1 get tour data from collection
  const tours = await Tour.find();
  //2 build template

  //3 render that template using tour data from step 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

//180, 185
exports.getTour = catchAsync(async (req, res, next) => {
  //1 get data for requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user photo'
  });
  //2 build template

  //3 render template using data from step 1
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

//187
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

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

//180
exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour'
  });
};

const Tour = require('./../models/tourModel'); //87
const APIFeatures = require('./../utils/apiFeatures'); //100;
const catchAsync = require('./../utils/catchAsync'); //115
const AppError = require('./../utils/appError'); //116
const factory = require('./handlerFactory'); //160

//99
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//54, 57, 63, 87, 89, 94, 95, 100, 115
exports.getAllTours = catchAsync(async (req, res, next) => {
  //EXECUTE QUERY
  //100
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .Paginate();
  const tours = await features.query;

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

//52, 57, 63, 64, 87, 89, 115, 116, 156
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');
  //Tour.findOne({ _id: req.params.id})
  //116
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

//161
exports.createTour = factory.createOne(Tour);
// //53, 57, 63, 87, 88, 115
// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour
//     }
//   });
// });

//161
exports.updateTour = factory.updateOne(Tour);
// //55, 57, 63, 64, 90, 107, 115, 116
// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true //107
//   });
//   //116
//   if (!tour) {
//     return next(new AppError('No tou found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'sucess',
//     data: {
//       tour
//     }
//   });
// });

//160
exports.deleteTour = factory.deleteOne(Tour);
// //56, 57, 63, 91, 115, 116
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   //116
//   if (!tour) {
//     return next(new AppError('No tou found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'sucess',
//     data: null
//   });
// });

//101, 115
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: -1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);
  res.status(200).json({
    status: 'sucess',
    data: {
      stats
    }
  });
});

//102, 115
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 6
    }
  ]);

  res.status(200).json({
    status: 'sucess',
    data: {
      plan
    }
  });
});

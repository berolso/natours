const catchAsync = require('./../utils/catchAsync'); //160
const AppError = require('./../utils/appError'); //160

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    //116
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'sucess',
      data: null
    });
  });

const Tour = require('./../models/tourModel'); //87

//65
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'bad request',
      message: 'missing name or price'
    });
  }
  next();
};

//52, 57, 63, 64, 87
exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  // const tour = tours.find(el => el.id === id);

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour
  //   }
  // });
};
//54, 57, 63, 87
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success'
    // requestedAt: req.requestTime,
    // results: tours.length,
    // data: {
    //   tours
    // }
  });
};
//53, 57, 63, 87
exports.createTour = (req, res) => {
  res.status(201).json({
    status: 'success'
    // data: {
    //   tour: newTour
    // }
  });
};
//55, 57, 63, 64
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'sucess',
    data: {
      tour: '<updated tour her...>'
    }
  });
};
//56, 57, 63
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'sucess',
    data: null
  });
};

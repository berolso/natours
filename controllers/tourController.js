const fs = require('fs'); //52

//52, 63
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
//64
exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  // if (!tour) {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id'
    });
  }
  next();
};
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

//52, 57, 63, 64
exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};
//54, 57, 63
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};
//53, 57, 63
exports.createTour = (req, res) => {
  // console.log(req.body.name);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
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

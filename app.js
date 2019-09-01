const fs = require('fs'); //52
const express = require('express'); //52
const morgan = require('morgan'); //60

//53
const app = express();

////MIDDLEWARES
//60
app.use(morgan('dev'));
//53
app.use(express.json());
//59
app.use((req, res, next) => {
  console.log('hello from the middleware');
  next();
});
//59
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

////ROUTE HANDLERS
//52
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//52, 57
const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);

  //   if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

//54, 57
const getAllTours = (req, res) => {
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

//53, 57
const createTour = (req, res) => {
  // console.log(req.body);

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

//55, 57
const updateTour = (req, res) => {
  // if (!tour) {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id'
    });
  }
  res.status(200).json({
    status: 'sucess',
    data: {
      tour: '<updated tour her...>'
    }
  });
};

//56, 57
const deleteTour = (req, res) => {
  // if (!tour) {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id'
    });
  }
  res.status(204).json({
    status: 'sucess',
    data: null
  });
};

//57
// app.get(`/api/v1/tours`, getAllTours); //52,
// app.post(`/api/v1/tours`, createTour); //53,
// app.get(`/api/v1/tours/:id`, getTour); //54,
// app.patch(`/api/v1/tours/:id`, updateTour); //55,
// app.delete(`/api/v1/tours/:id`, deleteTour); //56,

////ROUTES
//57
app
  .route(`/api/v1/tours`)
  .get(getAllTours)
  .post(createTour);
//57
app
  .route(`/api/v1/tours/:id`)
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

////START SERVER
//52
const port = 3000;
app.listen(port, () => {
  console.log(`running on port ${port}...`);
});

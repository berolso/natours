const express = require('express'); //52
const morgan = require('morgan'); //60

const tourRouter = require('./routes/tourRoutes'); //63
const userRouter = require('./routes/userRoutes'); //63

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

////ROUTES
//62
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//63
module.exports = app;
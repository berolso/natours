const express = require('express'); //52
const morgan = require('morgan'); //60
const rateLimit = require('express-rate-limit'); //142

const AppError = require('./utils/appError'); //114
const globalErrorHandler = require('./controllers/errorController'); //114
const tourRouter = require('./routes/tourRoutes'); //63
const userRouter = require('./routes/userRoutes'); //63

//53
const app = express();

////GLOBAL MIDDLEWARES
//67
// console.log(process.env.NODE_ENV);
console.log(Date());
if (process.env.NODE_ENV === 'development') {
  //60
  app.use(morgan('dev'));
}

//142
const limiter = rateLimit({
  max: 2,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

//53
app.use(express.json());
//66
app.use(express.static(`${__dirname}/public`));

//59
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

////ROUTES
//62
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//111
app.all('*', (req, res, next) => {
  // //113
  // const err = new Error(`Cant find ${req.originalUrl} on this server:`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Cant find ${req.originalUrl} on this server:`, 404));
});
//113
app.use(globalErrorHandler);

//63
module.exports = app;

const path = require('path'); //175
const express = require('express'); //52
const morgan = require('morgan'); //60
const rateLimit = require('express-rate-limit'); //142
const helmet = require('helmet'); //143
const mongoSanitize = require('express-mongo-sanitize'); //144
const xss = require('xss-clean'); //144
const hpp = require('hpp'); //145

const AppError = require('./utils/appError'); //114
const globalErrorHandler = require('./controllers/errorController'); //114
const tourRouter = require('./routes/tourRoutes'); //63
const userRouter = require('./routes/userRoutes'); //63
const reviewRouter = require('./routes/reviewRoutes'); //154
const viewRouter = require('./routes/viewRoutes'); //180
const cookieParser = require('cookie-parser'); //188

//53
const app = express();

//175
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

////GLOBAL MIDDLEWARES
//175
app.use(express.static(path.join(__dirname, 'public')));
//143 set security http headers
app.use(helmet());

//67 development logging
// console.log(process.env.NODE_ENV);
console.log(Date());
if (process.env.NODE_ENV === 'development') {
  //60
  app.use(morgan('dev'));
}

//142 limit requests from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

//53, 143 body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser()); //188

//144 data sanitization against NoSQL query injection
app.use(mongoSanitize());
//144 data sanitization against xss
app.use(xss());

//145 prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

//66 serving static files 175
// app.use(express.static(`${__dirname}/public`));
//175
app.use(express.static(path.join(__dirname, 'public')));

//59 test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies)//188
  next();
});

////ROUTES

//180
app.use('/', viewRouter);
//62
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter); //154

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

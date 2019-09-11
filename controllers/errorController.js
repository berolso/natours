const AppError = require('./../utils/appError'); //118
//118
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

//119
const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
//120
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
//131
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);
//131
const handleJWTExpiredError = () =>
  new AppError('Expired token. Please log in again!', 401);

//117
const sendErrorDev = (err, req, res) => {
  //192
  // A) api
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  // B) rendered website
  console.error('ERROR Shit!!', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message
  });
};

//117, 192
const sendErrorProd = (err, req, res) => {
  // A) api
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // B) Programming or other unknown error: don't leak error details
    //1) Log error
    console.error('ERROR Shit!!', err);
    //2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
  // B) rendered website
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message
    });
  }
  // B) Programming or other unknown error: don't leak error details
  //1) Log error
  console.error('ERROR Shit!!', err);
  //2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later.'
  });
};

//114
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  //117, 192
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    //118
    let error = { ...err };
    //192
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error); //118
    if (error.code === 11000) error = handleDuplicateFieldsDB(error); //119
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error); //120
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

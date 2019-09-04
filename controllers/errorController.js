//117
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};
//117
const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    //Programming or other unknown error: don't leak error details
  } else {
    //1) Log error
    console.error('ERROR Shit!!', err);
    //2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'something went very wrong'
    });
  }
};

//114
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  //117
  if (Process.env.NODE_env === 'development') {
    sendErrorDev(err, res);
  } else if (Process.env.NODE_env === 'production') {
    sendErrorProd(err, res);
  }
};

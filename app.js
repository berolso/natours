const express = require('express'); //52
const morgan = require('morgan'); //60

const tourRouter = require('./routes/tourRoutes'); //63
const userRouter = require('./routes/userRoutes'); //63

//53
const app = express();

////MIDDLEWARES
//67
// console.log(process.env.NODE_ENV);
console.log(Date());
if (process.env.NODE_ENV === 'development') {
  //60
  app.use(morgan('dev'));
}
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
//   res.status(404).json({
//     status: 'fail',
//     message: `Can't find ${req.originalUrl} on this server`
//   });
// });
//113
const err = new Error(`Cant find ${req.originalUrl} on this server:`);
err.status = 'fail';
err.statusCode = 404;

next(err);

//113
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'
    
    
    res.tatus(err.statusCode).json({
        status: err.status,
        message: err.message
    })
});

//63
module.exports = app;

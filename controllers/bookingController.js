//booking controller
// 210
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); //210
const Tour = require('../models/tourModel'); //87
const Booking = require('../models/bookingModel'); //213
const catchAsync = require('../utils/catchAsync'); //115
const AppError = require('../utils/appError'); //116, 170
const factory = require('./handlerFactory'); //160

//210
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1) get currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`, //213
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });
  //3) create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

//213
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  //only temperary because it's unsecure. everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour || !user || !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

//215
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

const mongoose = require('mongoose'); //153
const Tour = require('./tourModel'); //167

//153
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review cannot be empty.']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//169
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//query middleware

//155, 156, 184
reviewSchema.pre(/^find/, function(next) {
  //   this.populate({
  //     path: 'tour',
  //     select: 'name'
  //   }).populate({
  //     path: 'user',
  //     select: 'name'
  //   });
  this.populate({
    path: 'user',
    select: ['name', 'photo']
  });
  next();
});

//167
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  console.log(stats);
  //167, 168
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

//167
reviewSchema.post('save', function() {
  //this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

//168
// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function() {
  // this.r = await this.findOne(); does not work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

//153
const Review = mongoose.model('Review', reviewSchema);
//153
module.exports = Review;

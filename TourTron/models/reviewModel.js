const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Middleware to automatically populate tour and user fields
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// Static method to calculate average ratings on the reviewSchema of the tour
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5, //default value
    });
  }
};

// Post middleware to recalculate average ratings after a review is saved
reviewSchema.post('save', function () {
  //In Static Methods: this.constructor lets you call other static methods of the same model
  this.constructor.calcAverageRatings(this.tour);
});

// Pre middleware to get the current review before update/delete
// We cannot simply use post middleware because first we have to get the updated/deleted review and then store it in the database and then upadate/delete it
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // Get the currently updated/deleted review and store it in current query variable by doing this we can access it in the post middleware
  this.review = await this.model.findOne(this.getFilter());

  next();
});

// Post middleware to calculate average ratings after the pre middleware updated/deleted a review
reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne() does not work here as query already executed

  if (this.review) {
    await this.review.constructor.calcAverageRatings(this.review.tour);
  }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

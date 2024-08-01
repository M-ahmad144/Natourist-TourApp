const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      trim: true,
      unique: true,
      maxlength: [
        50,
        'A tour must have a name length less or equal than 50 characters',
      ],
      minlength: [
        10,
        'A tour must have a name length eqaul or greater than 10 characters',
      ],
      validate: [validator.isAlpha, 'A tour must only contains characters'],
    },
    slug: String,

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maximum group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty must be either easy, medium, or hard',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        //this validator runs on the current doc on new tour create
        validator: function (value) {
          return value < this.price;
        },
        message: 'Price discount ({VALUE}) should be less than the tour price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, ' A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJson
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],

    guides: Array,
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});

//___________________________Document Middleware________________________
//Documnet middleware : runs before .save() and .create()
//right before the data we actually save data into the database
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); //this points to the currently processed document
  next();
});

//Embedding the guides documents in the tour model document
tourSchema.pre('save', async function (next) {
  //guides:Array conatins the id of the guides

  //retrive all the guides that matches the id
  const guidesPrmises = this.guides.map(async (id) => await User.findById(id)); //return the array of promises for each guide id

  this.guides = await Promise.all(guidesPrmises);
  next();
});

//___________________________Query Middleware________________________

//regular expression :matches the all query start with find
tourSchema.pre(/^find/, function (next) {
  //get tours that not secrete
  this.find({ secretTour: { $ne: true } }); //this points to the currently processed query
  next();
});

//___________________________Aggregation Pipeline________________________
//remove secret tour also from aggregation pipeLine
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  // console.log(this.pipeline()); //this points to the currently processed aggregate funtion
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

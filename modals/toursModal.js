const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
  name: {
    type: String,
    require: ['true', 'A tour must have a name'],
    unique: true,
    trim: true,
  },
  duration: { type: Number, require: ['true', 'A tour must have duration'] },
  maxGroupSize: {
    type: Number,
    require: ['true', 'A group must a group size'],
  },
  difficulty: {
    type: String,
    require: ['true', 'A group must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult',
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
  },
  ratingsQuantity: { type: Number, default: 0 },
  price: { type: Number, require: ['true', 'A tour must have a price'] },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: ['true', 'A tour must have a summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    require: ['true', 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

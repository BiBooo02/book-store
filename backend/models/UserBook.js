const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userBookSchema = new mongoose.Schema({
  // Book data from API
  bookId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  },
  publishedDate: {
    type: String,
    default: ""
  },
  isbn: {
    type: String,
    default: ""
  },
  // Collection type
  collection: {
    type: String,
    enum: ['wantToRead', 'currentlyReading', 'doneReading'],
    required: true
  },
  // Review (only for doneReading)
  review: {
    type: reviewSchema,
    default: null
  },
  // Dates
  addedAt: {
    type: Date,
    default: Date.now
  },
  startedReadingAt: {
    type: Date,
    default: null
  },
  finishedReadingAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('UserBook', userBookSchema);


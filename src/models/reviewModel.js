const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: ObjectId,
    ref: "Bookm",
    required: true,
    trim: true,
  },
  reviewedBy: {
    type: String,
    default: "Guest",
    trim: true,
  },
  reviewedAt: {
    type: Date,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    trim: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
}, { timestamps: true });
module.exports = mongoose.model("Review", reviewSchema);

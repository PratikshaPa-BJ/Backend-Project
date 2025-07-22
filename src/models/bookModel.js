const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const bookSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: true,
    },
    ISBN: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: ObjectId,
      ref: "author1",
    },
    tags: [String],
    year: {
      type: Number,
      default: 2021,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    price: {
      indianPrice: String,
      euroPrice: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bookB", bookSchema);

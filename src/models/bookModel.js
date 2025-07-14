const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bookName: {
      type: String,
      required: true,
    },
    authorName: String,

    price: {
      indianPrice: String,
      europeanPrice: String,
    },
    year: { type: Number, default: 2021 },
    tags: [String],
    totalPages: Number,
    stockAvailable: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("mybook", bookSchema);

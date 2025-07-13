const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bookName: String,
    authorName: String,
    category: {
      type: String,
      enum: [
        "Comedy",
        "Thriller",
        "Horror",
        "Romance",
        "Science fiction",
        "Adventure",
        "Fiction"
      ],
    },
    year: Number,
    tags: [ String ],
    isPublished: Boolean,
    prices: {
      indianPrice: String,
      europePrice: String
    },
    sales: { type:Number, default: 10 },
    date: {
      type: Date,
      default:  Date.now(),
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);

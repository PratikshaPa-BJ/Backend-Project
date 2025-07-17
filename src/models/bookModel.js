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
    sales: { type: Number, default: 10 },
    tags: [String],
    isPublished: Boolean,
    summary: mongoose.Schema.Types.Mixed,
    isDeleted: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("mixedtypeBook", bookSchema);

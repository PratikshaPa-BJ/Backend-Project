const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    mobile: {
      type: String,
      unique: true,
      required: true,
    },
    emailId: String,
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    age: Number,
    rating: Number,
  },
  { timestamps: true }
);
module.exports = mongoose.model("author1", authorSchema);

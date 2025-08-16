const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    emailId: String,
    password: String,
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },
    age: Number,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    posts: {
      type: [],
      default: [],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("userD", userSchema);

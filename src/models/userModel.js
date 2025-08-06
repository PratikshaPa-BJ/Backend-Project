const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: Number,
  city: String,
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
  },
  profession: String,
});
module.exports = mongoose.model("userA", userSchema);

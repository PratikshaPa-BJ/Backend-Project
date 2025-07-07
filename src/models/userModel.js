const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
    enum: ["Male", "Female", "LGBTQ"],
  },
  age: Number,
}, { timestamps: true });

module.exports = mongoose.model( 'User', userSchema );
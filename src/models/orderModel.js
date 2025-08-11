const mongoose = require("mongoose");
const moment = require("moment");

const ObjectId = mongoose.Schema.Types.ObjectId;
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "userB",
    },
    productId: {
      type: ObjectId,
      ref: "product",
    },
    amount: Number,
    isFreeAppUser: Boolean,
    date: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);

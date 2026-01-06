const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "Userp",
      required: true,
    },
    items: [
      {
        productId: { type: ObjectId, ref: "Productm", required: true },
        quantity: { type: Number, required: true, min: 1 }
      },
    ],
    totalPrice: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    },
    totalQuantity: {
      type: Number,
      required: true
    },
    cancellable: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      default: "pending",
      enum: [ "pending" , "completed", "cancelled" ]
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date
    },
    paymentId: {
      type: String,
      default: null
    },
    paymentStatus:{
      type: String,
      enum: [ "pending", "failed", "paid"],
      default: "pending"
    }

  },
  
  { timestamps: true }
);

module.exports = mongoose.model("Orderm", orderSchema);

const express = require("express");
const router = express.Router();
const { createPaymentIntent, stripeWebhook } = require("../controllers/paymentController");

router.post("/create-payment-intent", createPaymentIntent );
router.post("/payment/webhook", express.raw({ type: "application/json"}), stripeWebhook)

module.exports = router
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const orderModel = require("../models/orderModel");
const valid = require("../validation/validator");
const { isValidObjectId } = require("mongoose");

const createPaymentIntent = async (req, res) =>{
    try{
        let { orderId } = req.body;

        if(!valid.isValid(orderId)){
            return res.status(400).send({ status: false, msg: "order id is required "})
        }
        if(typeof orderId === "string"){
            orderId = orderId.trim()
        }
        if(!isValidObjectId(orderId)){
            return res.status(400).send({ status: false, msg: "Invalid order id "})
        }
        let orderExist = await orderModel.findOne({ _id: orderId, isDeleted:false });
        if(!orderExist){
            return res.status(400).send({ status: false, msg: "Order not found "})
        }
        if(orderExist.paymentStatus === "paid"){
            return res.status(400).send({ status: false, msg: "Order already paid "})
        }

        let paymentIntent = await stripe.paymentIntents.create({
            amount : orderExist.totalPrice * 100,
            currency: "INR",
            metadata: {
                orderId: orderExist._id.toString(),
                userId: orderExist.userId.toString()
            }
        })
        console.log(paymentIntent);
        
        orderExist.paymentId = paymentIntent.id;
        await orderExist.save();
        return res.status(200).send({ status: true, clientSecret: paymentIntent.client_secret})

    }catch(err){
        res.status(500).send({ status: false, msg: err.message })
    }

}

const stripeWebhook = async (req, res) => {
   const sig = req.headers["stripe-signature"];
   let event;
   try{
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)

   }catch(err){
    return res.status(400).send({ status: false, msg: ` Webhook error: ${err.message} ` })
   }
   if(event.type === "payment_intent.succeeded"){
    const paymentIntent = event.data.object;
    if(!paymentIntent.metadata || !paymentIntent.metadata.orderId){
        return res.status(400).send({ status:false, msg: "Order Id missing in metadata "})
    }
    const orderIdFromStripe = paymentIntent.metadata.orderId;
    await orderModel.findOneAndUpdate({ _id:orderIdFromStripe, paymentId:paymentIntent.id }, { paymentStatus: "paid", status: "completed"})
   }
   res.json( {received: true })
}
module.exports = { createPaymentIntent , stripeWebhook }
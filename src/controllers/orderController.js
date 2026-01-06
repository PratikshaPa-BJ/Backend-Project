const { isValidObjectId } = require("mongoose");
const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");
const valid = require("../validation/validator")

const createOrder = async function (req, res) {
  try {
    const userIdFromReq = req.specificUserExist._id;
    const cart = await cartModel.findOne({ userId: userIdFromReq });
    if (!cart) {
      return res.status(404).send({ status: false, msg: "Cart not found for this user " });
    }
    if (cart.items.length === 0) {
      return res.status(400).send({ status: false, msg: "Cart is empty, can not place order " });
    }
    let totalQuantity = 0;
    for (let item of cart.items) {
      totalQuantity += item.quantity;
    }
    const order = await orderModel.create({
      userId: userIdFromReq,
      items: cart.items,
      totalPrice: cart.totalPrice,
      totalItems: cart.totalItems,
      totalQuantity
    });

    await cartModel.findOneAndUpdate({ _id: cart._id }, { items: [], totalItems:0, totalPrice:0 })

    return res.status(201).send({ status: true, msg: " Order placed successfully ", data: order });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const updateOrder = async function (req, res){
try{
  const userIdFromReq = req.specificUserExist._id;
  let { orderId, status } = req.body;
  if(typeof orderId === "string"){
    orderId = orderId.trim();
  }
  if(!valid.isValid(orderId)){
    return res.status(400).send( { status: false, msg: "Please provide order id"})
  }
  if(!isValidObjectId(orderId)){
    return res.status(400).send({ status: false, msg: "invalid order id "})
  }
  if(!valid.isValid(status)){
    return res.status(400).send({ status:false, msg: "Please provide status "})
  }
  if(typeof status === "string"){
    status = status.trim().toLowerCase()
  }
  if(status !== "cancelled"){
    return res.status(400).send({ status: false, msg: "user can only update status as cancelled "})
  }
  let orderExist = await orderModel.findOne({ _id: orderId, userId: userIdFromReq, isDeleted:false });
  if(!orderExist){
    return res.status(404).send({status: false, msg: "Order not found "})
  }
  
  if( orderExist.status === "completed" || orderExist.status === "cancelled" ){
   return res.status(400).send({ status:false, msg: `order is already ${orderExist.status}`})
  }
  if( status === "cancelled" && orderExist.cancellable === false){
    return res.status(400).send({ status: false, msg: "This order can not be cancelled "})
  }
  const updateObj = { status };
  
  if( status === "cancelled"){
    updateObj.isDeleted = true;
    updateObj.deletedAt = new Date()
  }
  
  const updateOrders = await orderModel.findOneAndUpdate({_id: orderId, userId: userIdFromReq }, { $set: updateObj}, {new:true})
  
  return res.status(200).send({ status: true, msg: "Order updated successfully", data: updateOrders})
}catch(err){
  return res.status(500).send({ status: false, msg: err.message})
}
}

module.exports = { createOrder , updateOrder };

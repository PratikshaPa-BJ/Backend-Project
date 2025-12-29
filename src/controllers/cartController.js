const valid = require("../validation/validator");
const cartModel = require("../models/cartModel");
const { isValidObjectId } = require("mongoose");
const productModel = require("../models/productModel");

const createCart = async function (req, res) {
  try {
    let userIdFromReq = req.specificUserExist._id;
    let { productId, quantity } = req.body;

    if (!valid.isValid(productId)) {
      return res.status(400).send({ status: false, msg: "Please provide product id.." });
    }
    if (typeof productId === "string") {
      productId = productId.trim();
    }
    if (!isValidObjectId(productId)) {
      return res.status(400).send({ status: false, msg: "Please provide valid product id " });
    }
    let productExist = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!productExist) {
      return res.status(404).send({ status: false, msg: "Product not found or deleted " });
    }

    if (quantity === undefined || isNaN(quantity) || Number(quantity) < 1) {
      return res.status(400).send({
        status: false,
        msg: "Quantity is required and should be number, at least 1 ",
      });
    }
    quantity = Number(quantity);
    let productPrice = productExist.price * quantity;
    let cart = await cartModel.findOne({ userId: userIdFromReq });

    if (!cart) {
      cart = await cartModel.create({
        userId: userIdFromReq,
        items: [{ productId, quantity }],
        totalItems: 1,
        totalPrice: productPrice,
      });

      return res.status(201).send({ status: true, data: cart });
    }

    let itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({ productId, quantity });
      cart.totalItems += 1;
    }
    cart.totalPrice += productExist.price * quantity;

    await cart.save();
    return res.status(201).send({ status: true, data: cart });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const updateCart = async function (req, res) {
  try {
    let { productId, removeProduct } = req.body;

    if (!valid.isValid(productId)) {
      return res.status(400).send({ status: false, msg: "Please provide product id " });
    }
    if (typeof productId === "string") {
      productId = productId.trim();
    }
    if (!isValidObjectId(productId)) {
      return res.status(400).send({ status: false, msg: "Please provide valid product id " });
    }
    let productExist = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!productExist) {
      return res.status(404).send({
        status: false,
        msg: " product is either deleted or not found ",
      });
    }
    removeProduct = Number(removeProduct);
    if (removeProduct !== 0 && removeProduct !== 1) {
      return res.status(400).send({ status: false, msg: "removeProduct must be 0 or 1 " });
    }
    
    const cart = await cartModel.findOne({ userId: req.specificUserExist._id }).populate({
      path: "items.productId",
      select: {  price: 1 },
    });
    
    if (!cart) {
      return res.status(404).send({ status: false, msg: "Cart not found " });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.productId._id.toString() === productId.toString()
    );
    if (itemIndex === -1) {
      return res.status(404).send({ status: false, msg: " Product not present in cart " });
    }
    if (removeProduct === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity -= 1;
      if (cart.items[itemIndex].quantity === 0) {
        cart.items.splice(itemIndex, 1);
      }
    }

    let totalPrices = 0;
    for (let item of cart.items) {
      totalPrices += item.productId.price * item.quantity;
    }

    cart.totalItems = cart.items.length;
    cart.totalPrice = totalPrices;

    await cart.save();

    return res.status(200).send({ status: true, msg: " Cart updated successfully ", data: cart });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const viewCart = async function (req, res) {
  try {
    let userIdFromReq = req.specificUserExist._id;
    const cart = await cartModel.findOne({ userId: userIdFromReq }).populate({
      path: "items.productId",
      select: { title: 1, price: 1, productImage: 1 },
    });
    
    if (!cart) {
      return res.status(404).send({ status: false, msg: "No cart present for this user " });
    }
    if (cart.items.length === 0) {
      return res.status(404).send({ status: false, msg: "Cart is empty " });
    }

    return res.status(200).send({ status: true, data: cart });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const deleteCart = async function (req, res) {
  try {
    let userIdFromReq = req.specificUserExist._id;
    const cart = await cartModel.findOne({ userId: userIdFromReq });
    if (!cart) {
      return res.status(404).send({ status: false, msg: "No cart present for this user " });
    }

    await cartModel.findOneAndUpdate(
      { userId: userIdFromReq },
      { items: [], totalItems: 0, totalPrice: 0 }
    );
    return res.status(200).send({ status: true, msg: "Cart deleted successfully " });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = { createCart, updateCart, viewCart, deleteCart };

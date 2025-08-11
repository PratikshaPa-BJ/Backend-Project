const productModel = require("../models/productModel");

const createProduct = async function (req, res) {
  let body = req.body;
  let productPrice = body.price;
  if (!productPrice) {
    return res.send("Please provide Product Price");
  }
  let products = await productModel.create(body);
  res.send({ data: products });
};

const getAllProducts = async function (req, res) {
  let allProduct = await productModel.find();
  res.send({ data: allProduct });
};

module.exports.createProducts = createProduct;
module.exports.getAllProduct = getAllProducts;

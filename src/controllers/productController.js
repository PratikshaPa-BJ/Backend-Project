const productModel = require("../models/productModel");
const valid = require("../validation/validator");
const cloudinary = require("../utils/cloudinary");
const { isValidObjectId } = require("mongoose");

const createProducts = async function (req, res) {
  try {
    let reqBody = req.body;

    if (!reqBody || !valid.isValidReqBody(reqBody)) {
      return res.status(400).send({ status: false, msg: "Please provide details of product." });
    }
    let files = req.files;

    let {title, description, price, currencyId, currencyFormat, availableSizes, installments, style, isFreeShipping } = reqBody;

    if (!valid.isValid(title)) {
      return res.status(400).send({ status: false, msg: "title is mandatory.." });
    }
    let productTitleExist = await productModel.findOne({ title });
    if (productTitleExist) {
      return res.status(409).send({
        status: false,
        msg: "Product title already exist, please provide another title",
      });
    }
    if (!valid.isValid(description)) {
      return res.status(400).send({ status: false, msg: "product description is mandatory.." });
    }
    if (price === undefined || isNaN(price) || Number(price) <= 0) {
      return res.status(400).send({ status: false, msg: "valid price is required.." });
    }
    price = Number(price);
    if (!valid.isValid(currencyId)) {
      return res.status(400).send({ status: false, msg: "currencyid is mandatory.." });
    }
    currencyId = currencyId.trim();
    if (currencyId !== "INR") {
      return res.status(400).send({ status: false, msg: "currencyId must be INR " });
    }
    if (!valid.isValid(currencyFormat)) {
      return res.status(400).send({ status: false, msg: "currency format is mandatory.." });
    }
    currencyFormat = currencyFormat.trim();
    if (currencyFormat !== "₹") {
      return res.status(400).send({
        status: false,
        msg: "currency format must be Indian rupees symbol ",
      });
    }
    if (typeof availableSizes === "string") {
      availableSizes = availableSizes.split(",").map((s) => s.trim().toUpperCase());
    }

    if (!Array.isArray(availableSizes) || availableSizes.length === 0) {
      return res.status(400).send({ status: false, msg: "Atleast one size is required" });
    }
    if (!valid.hasNonEmptyStringElem(availableSizes)) {
      return res.status(400).send({
          status: false,
          msg: "Available sizes should be non-empty strings ",
        });
    }
    if (!valid.hasValidSize(availableSizes)) {
      return res.status(400).send({
        status: false,
        msg: "sizes must be one of S, XS, M, L, XL, XXL ",
      });
    }
    if (installments !== undefined) {
      if (typeof installments === "string") {
        installments = installments.trim();
      }
      if ( installments === "" || isNaN(installments) || Number(installments) <= 0) {
        return res.status(400).send({ status: false, msg: "installments should be number " });
      }
      installments = Number(installments);
    }

    if (isFreeShipping !== undefined) {
      if (typeof isFreeShipping === "string") {
        if (isFreeShipping.toLowerCase() === "true") {
          isFreeShipping = true;
        } else if (isFreeShipping.toLowerCase() === "false") {
          isFreeShipping = false;
        } else {
          return res.status(400).send({
              status: false,
              msg: "isFreeshipping must be true or false",
            });
        }
      }
      if (typeof isFreeShipping !== "boolean") {
        return res.status(400).send({ status: false, msg: "isFreeShipping must be boolean value" });
      }
    }
    if (!files || files.length === 0) {
      return res.status(400).send({ status: false, msg: "Please provide product image " });
    }
    const productImage = await cloudinary.uploadToCloudinary(files[0]);

    const productCreate = await productModel.create({ title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments });

    return res.status(201).send({
      status: true,
      msg: "Product created successfully ",
      data: productCreate,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const getAllProducts = async function (req, res) {
  try {
    let { size, name, priceGreaterThan, priceLessThan, priceSort } = req.query;

    let filter = { isDeleted: false };

    if (size !== undefined) {
      size = size.split(",").map((s) => s.trim().toUpperCase());
      if (!Array.isArray(size) || size.length === 0) {
        return res.status(400).send({ status: false, msg: "Atleast one size is required" });
      }
      if (!valid.hasNonEmptyStringElem(size)) {
        return res.status(400).send({
            status: false,
            msg: "Available sizes should be non-empty strings ",
          });
      }
      if (!valid.hasValidSize(size)) {
        return res.status(400).send({
            status: false,
            msg: "sizes must be one of S, XS, M, L, XL, XXL ",
          });
      }

      filter.availableSizes = { $in: size };
    }
    if (name !== undefined) {
      name = name.trim();
      if (!valid.isValid(name)) {
        return res.status(400).send({ status: false, msg: "Please give product name value.." });
      }
      filter.title = { $regex: name, $options: "i" };
    }
    if(priceGreaterThan!== undefined || priceLessThan!== undefined){
    filter.price = {}
    if (priceGreaterThan !== undefined) {
      // filter.price = {};

      if (isNaN(priceGreaterThan) || Number(priceGreaterThan) <= 0) {
        return res.status(400).send({
            status: false,
            msg: "valid price greater than value is required..",
          });
      }
      filter.price.$gt = Number(priceGreaterThan);
    }
    if (priceLessThan !== undefined) {
      if (isNaN(priceLessThan) || Number(priceLessThan) <= 0) {
        return res.status(400).send({
            status: false,
            msg: "valid price lesser than value is required..",
          });
      }
      filter.price.$lt = Number(priceLessThan);
    }}
    let sortObj = {};
    if (priceSort !== undefined) {
      priceSort = priceSort.trim();
      if (priceSort != 1 && priceSort != -1) {
        return res.status(400).send({ status: false, msg: "priceSort must be 1 or -1 " });
      }
      sortObj.price = Number(priceSort);
    }

    let products = await productModel.find(filter).sort(sortObj).select({ __v: 0, isDeleted: 0 });
    if (products.length === 0) {
      return res.status(404).send({ status: false, msg: "No products found with this filter " });
    }

    return res.status(200).send({ status: true, count: products.length, data: products });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const getProductsById = async function (req, res) {
  try {
    let productIdFromReq = req.params.productId;
    if (!isValidObjectId(productIdFromReq)) {
      return res.status(400).send({ status: false, msg: "Please provide valid product id " });
    }
    let product = await productModel.findOne({
      _id: productIdFromReq,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).send({ status: false, msg: "No products found or already deleted  " });
    }
    return res.status(200).send({ status: true, data: product });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const updateProduct = async function (req, res) {
  try {
    const { productId } = req.params;
    const reqBody = req.body;
    const files = req.files;
    if (!isValidObjectId(productId)) {
      return res.status(400).send({ status: false, msg: "Please provide valid product id " });
    }
    let productIdExist = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!productIdExist) {
      return res.status(404).send({ status: false, msg: "Product not found or already deleted " });
    }
    const hasBody = reqBody && valid.isValidReqBody(reqBody);
    const hasFiles = files && files.length > 0;
    if (!hasBody && !hasFiles) {
      return res.status(400).send({
          status: false,
          msg: "Please provide product data of atleast one or all fields ",
        });
    }
    let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = reqBody;
    let updateObj = {};
    if (title !== undefined) {
      if (!valid.isValid(title)) {
        return res.status(400).send({ status: false, msg: "Please give title value" });
      }
      title = title.trim();
      const productTitleExist = await productModel.findOne({ title, _id: { $ne: productId }});
      if (productTitleExist) {
        return res.status(409).send({
          status: false,
          msg: "Product title already exist, please provide another title",
        });
      }
      updateObj.title = title;
    }
    if (description !== undefined) {
      if (!valid.isValid(description)) {
        return res.status(400).send({ status: false, msg: " Please give description " });
      }
      updateObj.description = description.trim();
    }

    if (price !== undefined) {
      if (isNaN(price) || Number(price) <= 0) {
        return res.status(400).send({ status: false, msg: " Invalid price " });
      }
      updateObj.price = Number(price);
    }
    if (currencyId !== undefined || currencyFormat !== undefined) {
      return res.status(400).send({
          status: false,
          msg: "currencyId and currencyFormat is fixed can not be updated ",
        });
    }
    if (style !== undefined) {
      if (!valid.isValid(style)) {
        return res.status(400).send({ status: false, msg: "Invalid style value " });
      }
      updateObj.style = style.trim();
    }
    if (isFreeShipping !== undefined) {
      if (typeof isFreeShipping === "string") {
        isFreeShipping = isFreeShipping.trim().toLowerCase();

        if (isFreeShipping === "true") {
          isFreeShipping = true;
        } else if (isFreeShipping === "false") {
          isFreeShipping = false;
        } else {
          return res.status(400).send({
              status: false,
              msg: "isFreeShipping must be true or false",
            });
        }
      }
      if (typeof isFreeShipping !== "boolean") {
        return res.status(400).send({ status: false, msg: "isFreeShipping must be boolean value" });
      }
      updateObj.isFreeShipping = isFreeShipping;
    }
    if (availableSizes !== undefined) {
      if (typeof availableSizes === "string") {
        availableSizes = availableSizes.split(",").map((s) => s.trim().toUpperCase());
      }

      if (!Array.isArray(availableSizes) || availableSizes.length === 0) {
        return res.status(400).send({ status: false, msg: "Atleast one size is required" });
      }
      if (!valid.hasNonEmptyStringElem(availableSizes)) {
        return res.status(400).send({
            status: false,
            msg: "Available sizes should be non-empty strings ",
          });
      }
      if (!valid.hasValidSize(availableSizes)) {
        return res.status(400).send({
          status: false,
          msg: "sizes must be one of S, XS, M, L, XL, XXL ",
        });
      }
      updateObj.availableSizes = availableSizes;
    }

    if (installments !== undefined) {
      if (isNaN(installments) || Number(installments) <= 0) {
        return res.status(400).send({ status: false, msg: " Invalid installments " });
      }
      updateObj.installments = Number(installments);
    }

    if (files && files.length > 0) {
      updateObj.productImage = await cloudinary.uploadToCloudinary(files[0]);
    }
    if (Object.keys(updateObj).length === 0) {
      return res.status(400).send({ status: false, msg: "No field provided for update" });
    }

    const updateProduct = await productModel.findOneAndUpdate(
      { _id: productId },
      { $set: updateObj },
      { new: true }
    );

    return res.status(200).send({
        status: true,
        msg: "Product updated successfully ",
        data: updateProduct,
      });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const deleteProduct = async function (req, res) {
  try {
    let productIdFromReq = req.params.productId;
    if (!isValidObjectId(productIdFromReq)) {
      return res.status(400).send({ status: false, msg: "Please provide valid object id" });
    }
    const product = await productModel.findOne({ _id: productIdFromReq, isDeleted: false });
      
    if (!product) {
      return res.status(404).send({ status: false, msg: "Product not found or already deleted " });
    }
    await productModel.findOneAndUpdate(
      { _id: productIdFromReq },
      { isDeleted: true, deletedAt: new Date() }
    );
    return res.status(200).send({ status: true, msg: "Product deleted successfully.." });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = { createProducts, getAllProducts, getProductsById, updateProduct, deleteProduct };

const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const bookModel = require("../models/bookModel");

const tokenValidation = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res.status(401).send({ status: false, msg: "Token must be present in the header.." });
    }
    jwt.verify(token, process.env.JWT_SECRET, function (error, decodedToken) {
      if (error) {
        return res.status(401).send({ status: false, msg: error.message });
      } else {
        req.userIdFromDecodedToken = decodedToken.userId;
        next();
      }
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const authorisation = async function (req, res, next) {
  try {
    let useridFromToken = req.userIdFromDecodedToken;

    let bookidFromReqParams = req.params.bookId;
    if (!isValidObjectId(bookidFromReqParams)) {
      return res.status(400).send({
          status: false,
          msg: "Please provide a valid book id in req params",
        });
    }
    let bookExist = await bookModel.findOne({
      _id: bookidFromReqParams,
      isDeleted: false,
    });
    if (!bookExist) {
      return res.status(404).send({ status: false, msg: "Book not found or already deleted.." });
    }

    if (useridFromToken.toString() !== bookExist.userId.toString()) {
      return res.status(403).send({
        status: false,
        msg: "Authorization failed, You are not the owner of this book",
      });
    }
    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.authentication = tokenValidation;
module.exports.authorisation = authorisation;

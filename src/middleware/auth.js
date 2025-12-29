const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const userModel = require("../models/userModel");

const authentication = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res.status(401).send({ status: false, msg: "Token must be present in the header.." });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, function (error, decodedToken) {
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

    let useridFromReqParams = req.params.userId;
    if (!isValidObjectId(useridFromReqParams)) {
      return res.status(400).send({
          status: false,
          msg: "Please provide a valid user id in req params",
        });
    }
    let userExist = await userModel.findOne({  _id: useridFromReqParams });
    if (!userExist) {
      return res.status(404).send({ status: false, msg: "user not found or already deleted.." });
    }

    if (useridFromToken.toString() !== userExist._id.toString()) {
      return res.status(403).send({
        status: false,
        msg: "Authorization failed, You are not allowed to perform this action ",
      });
    }
    req.specificUserExist = userExist;
    next();
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = { authentication , authorisation };

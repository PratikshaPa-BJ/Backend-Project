const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const tokenValidation = function (req, res, next) {
  try {
    let token = req.headers["x-auth-token"];
    if (!token) {
      return res.send({ status: false, msg: "Token must be present.." });
    }
    let decodedToken = jwt.verify(token, "seversidesecretkey");
    // console.log(decodedToken);

    if (!decodedToken) {
      return res.status(401).send({ status: false, msg: "Token is invalid" });
    }
    req.userIdFromDecodedToken = decodedToken.userId;

    next();
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const authorizationf = function (req, res, next) {
  let userIdReq = req.params.userId;
  if (!mongoose.isValidObjectId(userIdReq)) {
    return res
      .status(400)
      .send({ status: false, msg: "Please provide valid user id.." });
  }
  if (req.userIdFromDecodedToken !== userIdReq) {
    return res.status(403).send({
      status: false,
      msg: "You don't have authorisation to do this..",
    });
  }
  next();
};

module.exports.tokenValidation = tokenValidation;
module.exports.authorization = authorizationf;

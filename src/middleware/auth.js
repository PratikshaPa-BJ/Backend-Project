const jwt = require("jsonwebtoken");

const tokenValidation = async function (req, res, next) {
  let token = req.headers["x-auth-token"];
  if (!token) {
    return res.send({ status: false, msg: "Token must be present.." });
  }
  let decodedToken = await jwt.verify(token, "seversidesecretkey");
  if (!decodedToken) {
    return res.send({ status: false, msg: "Token is invalid" });
  }
  next();
};

module.exports.tokenValidation = tokenValidation;

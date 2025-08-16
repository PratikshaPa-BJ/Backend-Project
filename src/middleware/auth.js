const jwt = require("jsonwebtoken");

const tokenValidation =  function (req, res, next) {
  let token = req.headers["x-auth-token"];
  if (!token) {
    return res.send({ status: false, msg: "Token must be present.." });
  }
  let decodedToken =  jwt.verify(token, "seversidesecretkey");
  // console.log(decodedToken);
  
  if (!decodedToken) {
    return res.send({ status: false, msg: "Token is invalid" });
  }
  req.userIdFromDecodedToken = decodedToken.userId;
  
  next();
};

module.exports.tokenValidation = tokenValidation;

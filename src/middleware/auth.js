const jwt = require("jsonwebtoken");

const tokenValidation = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res.status(401).send({ status: false, msg: "Token must be present in header.." });
    }
    jwt.verify(token, "serversidekey", function (error, decodedToken) {
      if (error) {
        return res.status(401).send({ status: false, msg: error.message });
      } else {
        req.authorIdFromDecodedToken = decodedToken.authorID;
        // console.log(decodedToken);
        next();
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.tokenValidation = tokenValidation;

const mongoose = require("mongoose");

const basicCode = function (req, res) {
  console.log("CONGRATS, you have reached the handler");
  let headerData = req.headers.token;
  console.log(headerData);
  res.send({ msg: "This is coming from Handler" });
};

const basicRoute = function (req, res) {
  res.send({ msg: "sent details on every API hit " });
};

module.exports.basicCode = basicCode;
module.exports.basicRoute = basicRoute;

const mongoose = require("mongoose");
const userModel = require("../models/userModel");

const createUser = async function (req, res) {
  let body = req.body;
  let header = req.headers;
  console.log(body);
  console.log(header);
  let host = header.host;
  console.log("The host of this req is: ", host);
  let contentType = header["content-type"];
  console.log("Content type of this req is: ", contentType);
  req.headers.year = 2025;
  req.headers["req-type"] = "Post";
  console.log("after adding: ", req.headers);

  let saveData = await userModel.create(body);
  res.send({ data: saveData });
};

const basicCode = function (req, res) {
  console.log("CONGRATS, you have reached the handler");
  let headerData = req.headers.token;
  console.log(headerData);
  res.send({ msg: "This is coming from Handler" });
};

const basicRoute = function (req, res, next) {
  next();
  // res.send({ msg: "sent details on every API hit " });
};

const dummyOne = function (req, res) {
  if (req.wantsJson == true) {
    res.send({ msg: "Hi, I am JSON format data " });
  } else {
    res.send("Hi, I am other format data");
  }
};
const dummyTwo = function (req, res) {
  res.setHeader("message", "Hi succesfully set HEADER!!");
  res.send({ msg: "Your custom Header is set!! check header " });
};

module.exports.basicCode = basicCode;
module.exports.basicRoute = basicRoute;
module.exports.createUsers = createUser;
module.exports.dummyOne = dummyOne;
module.exports.dummyTwo = dummyTwo;

const userModel = require("../models/userModel");

const createUser = async function (req, res) {
  let body = req.body;
  let header = req.headers["isfreeappuser"];
  if (header == "true") {
    body.isFreeAppUser = true;
  } else {
    body.isFreeAppUser = false;
  }

  let allUser = await userModel.create(body);
  res.send({ data: allUser });
};

const getAllUsers = async function (req, res) {
  let users = await userModel.find();
  res.send({ data: users });
};

module.exports.createUsers = createUser;
module.exports.getAllUser = getAllUsers;

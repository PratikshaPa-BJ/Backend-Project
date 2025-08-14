const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userModel = require("../models/userModel");

const createUser = async function (req, res) {
  let body = req.body;
  let allUser = await userModel.create(body);
  res.send({ data: allUser });
};

const usersLogin = async function (req, res) {
  const userName = req.body.emailId;
  const loginPassword = req.body.password;
  // let { emailId, password } = req.body;
  let user = await userModel.findOne({
    emailId: userName,
    password: loginPassword,
  });
  if (!user) {
    return res.send({
      status: false,
      msg: "userName or Password is not correct..",
    });
  }
  console.log("Log in successfully..");

  // create jwt token and send it in response
  let token = await jwt.sign(
    { userId: user._id.toString() },
    "seversidesecretkey"
  );
  res.send({ status: true, data: token });
};

const getProfileDetails = async function (req, res) {
  let userID = req.params.userId;
  if (!mongoose.isValidObjectId(userID)) {
    return res.send({ status: false, msg: "Please provide valid user id.." });
  }
  let userDetails = await userModel.findById(userID);

  if (!userDetails) {
    return res.send({ status: false, msg: "No Such user exist.." });
  }
  res.send({ status: true, data: userDetails });
};

const updateUser = async function (req, res) {
  let userIdInReq = req.params.userId;
  if (!mongoose.isValidObjectId(userID)) {
    return res.send({ status: false, msg: "Please provide valid user id.." });
  }
  let userDetails = await userModel.findById(userIdInReq);
  if (!userDetails) {
    return res.send({ status: false, msg: "User does not exist.." });
  }
  let userData = req.body;
  let updateData = await userModel.findOneAndUpdate(
    { _id: userIdInReq },
    userData,
    { new: true }
  );
  res.send({ status: "Updated", data: updateData });
};

const deleteUser = async function (req, res) {
  let userIdReq = req.params.userId;
  if (!mongoose.isValidObjectId(userID)) {
    return res.send({ status: false, msg: "Please provide valid user id.." });
  }
  let user = await userModel.findById(userIdReq);
  if (!user) {
    return res.send({ status: false, msg: "User does not exist.." });
  }
  let userData = req.body;
  let updatedUser = await userModel.findOneAndUpdate(
    { _id: userIdReq },
    userData,
    { new: true }
  );

  res.send({ status: "Updated", data: updatedUser });
};

module.exports.registerUser = createUser;
module.exports.userLogin = usersLogin;
module.exports.getUserProfileData = getProfileDetails;
module.exports.updateUserData = updateUser;
module.exports.deleteUserData = deleteUser;

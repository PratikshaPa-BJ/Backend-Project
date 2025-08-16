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
  let token = jwt.sign(
    { userId: user._id.toString(), batch: "Meta", organisation: "Facebook" },
    "seversidesecretkey"
  );
  res.send({ status: true, data: token });
};

const getProfileDetails = async function (req, res) {
  let userIDFromReq = req.params.userId;
  if (!mongoose.isValidObjectId(userIDFromReq)) {
    return res.send({ status: false, msg: "Please provide valid user id.." });
  }
  let userIdFromToken = req.userIdFromDecodedToken;
  if (userIDFromReq !== userIdFromToken) {
    return res.send({
      status: false,
      msg: "Not allowed to access others profile data",
    });
  }
  let userDetails = await userModel.findById(userIDFromReq);
  if (!userDetails) {
    return res.send({ status: false, msg: "No Such user exist.." });
  }
  res.send({ status: true, data: userDetails });
};

const updateUser = async function (req, res) {
  let userIdInReq = req.params.userId;
  if (!mongoose.isValidObjectId(userIdInReq)) {
    return res.send({ status: false, msg: "Please provide valid user id.." });
  }
  let userIdFromToken = req.userIdFromDecodedToken;
  if (userIdFromToken !== userIdInReq) {
    return res.send({
      status: false,
      mgs: "You are not allowed to update other profile data ",
    });
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

const postMessageInFbWall = async function (req, res) {
  let message = req.body.message;
  let userIdFromToken = req.userIdFromDecodedToken;
  // AUTHORISATION
  let userIDFromReq = req.params.userId;
  if (userIdFromToken != userIDFromReq) {
    return res.send({
      data: false,
      msg: "You are not allowed or authorised to post anything to others fb wall..",
    });
  }
  //-------- AUTHORISATION end-------
  let user = await userModel.findById(userIDFromReq);
  if (!user) {
    return res.send({ status: false, msg: "No user find with this userId" });
  }

  //  user.posts.push(message);
  //  user.save();
  //  alternative
  let updatedPost = user.posts;
  updatedPost.push(message);
  let updatedUser = await userModel.findOneAndUpdate(
    { _id: userIDFromReq },
    { posts: updatedPost },
    { new: true }
  );

  res.send({ status: true, data: updatedUser });
};

const deleteUser = async function (req, res) {
  let userIdReq = req.params.userId;
  if (!mongoose.isValidObjectId(userIdReq)) {
    return res.send({ status: false, msg: "Please provide valid user id.." });
  }
  let userIdFromToken = req.userIdFromDecodedToken;
  if (userIdFromToken != userIdReq) {
    return res.send({
      data: false,
      msg: "You are not allowed or authorised to delete others profile data..",
    });
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
module.exports.postMessage = postMessageInFbWall;
module.exports.deleteUserData = deleteUser;

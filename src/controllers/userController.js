const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const createUser = async function (req, res) {
  try {
    let body = req.body;
    if (body && Object.keys(body).length > 0) {
      let allUser = await userModel.create(body);
      res.status(201).send({ data: allUser });
    } else {
      res
        .status(400)
        .send({ status: false, msg: "Request must contain a body " });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Error", msg: err.message });
  }
};

const usersLogin = async function (req, res) {
  try {
    if (req.body && req.body.username && req.body.password) {
      let user = await userModel.findOne({
        emailId: req.body.username,
        password: req.body.password,
      });
      if (!user) {
        return res
          .status(401)
          .send({ status: false, msg: "userName or Password is not exist.." });
      }
      console.log("Log in successfully..");
      // create jwt token and send it in response
      let token = jwt.sign(
        {
          userId: user._id.toString(),
          batch: "Meta",
          organisation: "Facebook",
        },
        "seversidesecretkey"
      );
      res.setHeader("x-auth-token", token);
      res.status(200).send({ status: true });
    } else {
      res.status(400).send({
        status: false,
        msg: "req body must contain username and password ",
      });
    }
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const getProfileDetails = async function (req, res) {
  try {
    let userIDFromReq = req.params.userId;
    let userDetails = await userModel.findById(userIDFromReq);
    if (!userDetails) {
      return res
        .status(404)
        .send({ status: false, msg: "No Such user exist.." });
    }
    res.status(200).send({ status: true, data: userDetails });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const updateUser = async function (req, res) {
  try {
    let userIdInReq = req.params.userId;
    let userDetails = await userModel.findById(userIdInReq);
    if (!userDetails) {
      return res
        .status(404)
        .send({ status: false, msg: "User does not exist.." });
    }
    let userData = req.body;
    if (userData && Object.keys(userData).length > 0) {
      let updateData = await userModel.findOneAndUpdate(
        { _id: userIdInReq },
        userData,
        { new: true }
      );
      res.status(200).send({ status: "Updated", data: updateData });
    } else {
      res.status(400).send({
        status: false,
        msg: "Please provide data in req body for updation",
      });
    }
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const postMessageInFbWall = async function (req, res) {
  try {
    let message = req.body.message;
    let userIDFromReq = req.params.userId;
    let user = await userModel.findById(userIDFromReq);
    if (!user) {
      return res
        .status(404)
        .send({ status: false, msg: "No user find with this userId" });
    }
    let updatedPost = user.posts;
    updatedPost.push(message);
    let updatedUser = await userModel.findOneAndUpdate(
      { _id: userIDFromReq },
      { posts: updatedPost },
      { new: true }
    );
    res.status(200).send({ status: true, data: updatedUser });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const deleteUser = async function (req, res) {
  try {
    let userIdReq = req.params.userId;
    let user = await userModel.findById(userIdReq);
    if (!user) {
      return res
        .status(404)
        .send({ status: false, msg: "User does not exist.." });
    }
    let userData = req.body;
    if (userData && Object.keys(userData).length > 0) {
      let updatedUser = await userModel.findOneAndUpdate(
        { _id: userIdReq },
        userData,
        { new: true }
      );
      res.status(200).send({ status: "Updated", data: updatedUser });
    } else {
      res.status(400).send({
        status: false,
        msg: "Please provide data in req body for updation",
      });
    }
  } catch (err) {
    res.status(500).send({ status: "false", msg: err.message });
  }
};

module.exports.registerUser = createUser;
module.exports.userLogin = usersLogin;
module.exports.getUserProfileData = getProfileDetails;
module.exports.updateUserData = updateUser;
module.exports.postMessage = postMessageInFbWall;
module.exports.deleteUserData = deleteUser;

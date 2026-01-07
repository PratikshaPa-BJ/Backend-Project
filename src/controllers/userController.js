const userModel = require("../models/userModel");
const valid = require("../validation/validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cloudinary = require("../utils/cloudinary");

const createUser = async function (req, res) {
  try {
    let reqBody = req.body;
    if (!reqBody || !valid.isValidReqBody(reqBody)) {
      return res.status(400).send({ status: false, msg: "Please provide details of user." });
    }
    let { fname, lname, email, phone, password, address } = reqBody;

    if (typeof fname === "string") {
      fname = fname.trim();
      reqBody.fname = fname;
    }
    if (typeof lname === "string") {
      lname = lname.trim();
      reqBody.lname = lname;
    }
    if (typeof email === "string") {
      reqBody.email = email.trim().toLowerCase();
    }
    if (typeof phone === "string") {
      reqBody.phone = phone.trim();
    }
    if (typeof password === "string") {
      reqBody.password = password.trim();
    }
    for (let [key, value] of Object.entries({ fname, lname })) {
      if (!valid.isValid(value)) {
        return res.status(400).send({ status: false, msg: ` ${key} is mandatory` });
      }
      if (!valid.isValidName(value)) {
        return res.status(400).send({
            status: false,
            msg: ` ${key} should be in string and alphabets only..`,
          });
      }
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ status: false, msg: "Please provide profile image" });
    }

    const profileImageUrl = await cloudinary.uploadToCloudinary(req.files[0]);
    reqBody.profileImage = profileImageUrl;
    if (!profileImageUrl) {
      return res.status(400).send({ status: false, msg: "profile image is required." });
    }

    if (!valid.isValid(email)) {
      return res.status(400).send({ status: false, msg: "Please provide email." });
    }
    if (!valid.isValidEmail(email)) {
      return res.status(400).send({
          status: false,
          msg: "email should be string and follow basic email format.",
        });
    }
    let emailAlreadyExist = await userModel.findOne({ email: reqBody.email });
    if (emailAlreadyExist) {
      return res.status(409).send({ status: false, msg: "user email already exist." });
    }
    if (!valid.isValid(phone)) {
      return res.status(400).send({ status: false, msg: "Please provide phone number." });
    }
    if (!valid.isValidMobile(phone)) {
      return res.status(400).send({
          status: false,
          msg: "Please provide valid indian mobile number.",
        });
    }
    let mobileAlreadyExist = await userModel.findOne({ phone: reqBody.phone });
    if (mobileAlreadyExist) {
      return res.status(409).send({ status: false, msg: "Mobile number already exist." });
    }

    if (!valid.isValid(password)) {
      return res.status(400).send({ status: false, msg: "Please provide password." });
    }
    if (!valid.isValidPassword(password)) {
      return res.status(400).send({
        status: false,
        msg: "password should be string, contain atleast one number, special symbol, capital letter and between 8 to 15 characters ",
      });
    }
    const saltRounds = 10;
    reqBody.password = await bcrypt.hash(reqBody.password, saltRounds);

    if (address && typeof address === "string") {
      try {
        address = JSON.parse(address);
      } catch (e) {
        return res.status(400).send({ status: false, msg: "address must be valid JSON" });
      }
    }
    if (!address || typeof address !== "object") {
      return res.status(400).send({
          status: false,
          msg: "Please provide address in object format.",
        });
    }
    reqBody.address = address;

    let { shipping, billing } = reqBody.address;
    if (!shipping || !billing) {
      return res.status(400).send({
          status: false,
          msg: "shipping and billing addresses are required.",
        });
    }

    const shippingAddErr = valid.validateAddress(shipping, "Shipping");
    if (shippingAddErr) {
      return res.status(400).send({ status: false, msg: shippingAddErr });
    }
    const billingAddErr = valid.validateAddress(billing, "Billing");
    if (billingAddErr) {
      return res.status(400).send({ status: false, msg: billingAddErr });
    }

    let userCreated = await userModel.create(reqBody);
    let userObj = userCreated.toObject();
    delete userObj.password;
    return res.status(201).send({ status: true, msg: "User registered", data: userObj });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const loginUser = async function (req, res) {
  try {
    if (!req.body || !valid.isValidReqBody(req.body)) {
      return res.status(400).send({
          status: false,
          msg: "Please provide email and password for log in..",
        });
    }
    let { email, password } = req.body;
    if (typeof email === "string") {
      email = email.trim();
    }
    if (typeof password === "string") {
      password = password.trim();
    }
    if (!valid.isValid(email)) {
      return res.status(400).send({ status: false, msg: "Please provide email." });
    }
    if (!valid.isValidEmail(email)) {
      return res.status(400).send({ status: false, msg: "Please provide valid email id" });
    }
    let emailExist = await userModel.findOne({ email: email });
    if (!emailExist) {
      return res.status(404).send({ status: false, msg: "No account found with this email.." });
    }

    if (!valid.isValid(password)) {
      return res.status(400).send({ status: false, msg: "Please provide password." });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      emailExist.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).send({ status: false, msg: "email or password not correct.." });
    }
    console.log("user Login successfull..");
    let token = jwt.sign(
      { userId: emailExist._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.setHeader("x-api-key", token);
    res.status(200).send({
        status: true,
        message: "Successfully logged in.",
        data: { userId: emailExist._id, role: emailExist.role, token },
      });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const userProfileDetails = async function (req, res) {
  try {
    let userIdFromReq = req.specificUserExist._id;
    let getUserDetails = await userModel.findById(userIdFromReq);

    if (!getUserDetails) {
      return res.status(404).send({ status: false, msg: "User details not found.." });
    }
    return res.status(200).send({
        status: true,
        msg: "User profile details.",
        data: getUserDetails,
      });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const updateUserDetails = async function (req, res) {
  try {
    let useIdFromReq = req.specificUserExist._id;
    let reqBody = req.body;
    let files = req.files;
    const hasBody = reqBody && valid.isValidReqBody(reqBody);
    const hasFiles = files && files.length > 0;
    if (!hasBody && !hasFiles) {
      return res.status(400).send({
          status: false,
          msg: "Please provide user details which you want to update..",
        });
    }
    let { fname, lname, email, phone, password, address } = reqBody;

    if (fname !== undefined) {
      fname = fname.trim();
      if (!valid.isValid(fname)) {
        return res.status(400).send({ status: false, msg: " fname is mandatory" });
      }
      if (!valid.isValidName(fname)) {
        return res.status(400).send({
            status: false,
            msg: " fname should be in string and alphabets only..",
          });
      }
      reqBody.fname = fname;
    }

    if (lname !== undefined) {
      lname = lname.trim();
      if (!valid.isValid(lname)) {
        return res.status(400).send({ status: false, msg: " last name is mandatory" });
      }
      if (!valid.isValidName(lname)) {
        return res.status(400).send({
            status: false,
            msg: " last name should be in string and alphabets only..",
          });
      }
      reqBody.lname = lname;
    }
    if (email !== undefined) {
      if (typeof email === "string") {
        email = email.trim().toLowerCase();
      }
      if (!valid.isValid(email)) {
        return res.status(400).send({ status: false, msg: "Please provide email" });
      }
      if (!valid.isValidEmail(email)) {
        return res.status(400).send({
            status: false,
            msg: "email should be string and follow basic email format..",
          });
      }
      let emailExist = await userModel.findOne({
        email,
        _id: { $ne: useIdFromReq },
      });
      if (emailExist) {
        return res.status(409).send({ status: false, msg: "user email already exist.." });
      }
      reqBody.email = email;
    }
    if (phone !== undefined) {
      phone = phone.trim();
      if (!valid.isValid(phone)) {
        return res.status(400).send({ status: false, msg: "Please provide mobile number.." });
      }
      if (!valid.isValidMobile(phone)) {
        return res.status(400).send({
            status: false,
            msg: "Phone number should be 10 digit and valid indian number..",
          });
      }
      let phoneNoExist = await userModel.findOne({
        phone,
        _id: { $ne: useIdFromReq },
      });
      if (phoneNoExist) {
        return res.status(409).send({ status: false, msg: "Mobile number already exist.." });
      }
      reqBody.phone = phone;
    }

    if (password !== undefined) {
      password = password.trim();
      if (!valid.isValid(password)) {
        return res.status(400).send({ status: false, msg: "Please provide password." });
      }
      if (!valid.isValidPassword(password)) {
        return res.status(400).send({
          status: false,
          msg: "password should be string, contain atleast one number, special symbol, capital letter and between 8 to 15 characters ",
        });
      }
      const saltRounds = 10;
      reqBody.password = await bcrypt.hash(password, saltRounds);
    }
    if (address !== undefined) {
      if (address && typeof address === "string") {
        try {
          address = JSON.parse(address);
        } catch (e) {
          return res.status(400).send({ status: false, msg: "address must be valid JSON" });
        }
      }
      if (typeof address !== "object") {
        return res.status(400).send({
            status: false,
            msg: "Please provide address in object format.",
          });
      }

      let { shipping, billing } = address;

      if (shipping) {
        const shippingAddErr = valid.validateAddress(shipping, "Shipping");
        if (shippingAddErr) {
          return res.status(400).send({ status: false, msg: shippingAddErr });
        }
      }

      if (billing) {
        const billingAddErr = valid.validateAddress(billing, "Billing");
        if (billingAddErr) {
          return res.status(400).send({ status: false, msg: billingAddErr });
        }
      }
      reqBody.address = {
        shipping: shipping || req.specificUserExist.address.shipping,
        billing: billing || req.specificUserExist.address.billing,
      };
    }

    if (files && files.length > 0) {
      let profileImageUrl = await cloudinary.uploadToCloudinary(req.files[0]);
      reqBody.profileImage = profileImageUrl;
    }

    let updateUserData = await userModel.findOneAndUpdate(
      { _id: useIdFromReq },
      { $set: reqBody },
      { new: true }
    );
    return res.status(200).send({ status: true, msg: "User data updated", data: updateUserData });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};
module.exports = { createUser, loginUser, userProfileDetails, updateUserDetails };

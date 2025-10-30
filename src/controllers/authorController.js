const authorModel = require("../models/authorModel");
const valid = require("../validation/validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createAuthor = async function (req, res) {
  try {
    let reqBody = req.body;
    if (!reqBody || !valid.isValidReqBody(reqBody)) {
      return res.status(400).send({ status: false, msg: "Please provide request body" });
    }
    let { fname, lname, title, email, password, ...extraField } = reqBody;
    if (Object.keys(extraField).length > 0) {
      return res.status(400).send({ status: false, msg: "extra fields are not allowed.." });
    }
    if (typeof fname === "string") {
      reqBody.fname = fname.trim();
    }
    if (typeof lname === "string") {
      reqBody.lname = lname.trim();
    }
    if (typeof email === "string") {
      reqBody.email = email.trim().toLowerCase();
    }
 
    for (let [key, value] of Object.entries({ fname, lname })) {
      if (!valid.isValid(value)) {
        return res.status(400).send({ status: false, msg: `Please provide ${key}` });
      }
      if (!valid.regexValid(value)) {
        return res.status(400).send({
          status: false,
          msg: ` ${key} should be in string and alphabets only `,
        });
      }
    }

    if (!valid.isValid(title)) {
      return res.status(400).send({ status: false, msg: "title is mandatory.." });
    }
    let afterValidationTitle = valid.isValidTitle(title);

    if (!afterValidationTitle) {
      return res.status(400).send({
        status: false,
        msg: "title should be string and Mr, Mrs or Miss",
      });
    }
    reqBody.title = afterValidationTitle;

    if (!valid.isValid(email)) {
      return res.status(400).send({ status: false, msg: "Please provide email" });
    }
    if (!valid.isValidEmail(email)) {
      return res.status(400).send({
        status: false,
        msg: "email should be in string and follow basic email format",
      });
    }
    let emailAlreadyExist = await authorModel.findOne({ email: reqBody.email });
    if (emailAlreadyExist) {
      return res.status(409).send({ status: false, msg: " author Email already exist" });
    }

    if (!valid.isValid(password)) {
      return res.status(400).send({ status: false, msg: "Please provide Password.." });
    }
    if (!valid.isValidPassword(password)) {
      return res.status(400).send({
        status: false,
        msg: "Password should be min 8 letters,max 15,consist of numbers, special character, alphabets capital and small both",
      });
    }
    const saltRounds = 10;
    reqBody.password = await bcrypt.hash(reqBody.password, saltRounds);

    let authorCreation = await authorModel.create(reqBody);
    authorCreation = authorCreation.toObject();
    delete authorCreation.password;
    res.status(201).send({ status: true, data: authorCreation });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const loginData = async function (req, res) {
  try {
    if (!req.body || !valid.isValidReqBody(req.body)) {
      return res.status(400).send({
        status: false,
        msg: "Please enter email and password for log in",
      });
    }
    const { email, password } = req.body;

    if (typeof email === "string") {
      req.body.email = email.trim().toLowerCase();
    }

    if (!valid.isValid(email)) {
      return res.status(400).send({ status: false, msg: "Please enter email id.." });
    }
    if (!valid.isValidEmail(email)) {
      return res.status(400).send({
          status: false,
          msg: "Please enter email id in proper format..",
        });
    }
    let authorExist = await authorModel.findOne({ email: req.body.email });
    if (!authorExist) {
      return res.status(401).send({ status: false, msg: "Email id not found.." });
    }

    if (!valid.isValid(password)) {
      return res.status(400).send({ status: false, msg: "Please enter password.." });
    }

    const passwordMatch = await bcrypt.compare(password, authorExist.password);

    if (!passwordMatch) {
      return res.status(401).send({ status: false, msg: "Credentials are incorrect.." });
    }
    console.log("Logged in successfully..");

    let token = jwt.sign({ authorId: authorExist._id }, "serversidekey", {
      expiresIn: "1h",
    });
    res.setHeader("x-api-key", token);

    return res.status(200).send({ status: true, msg: "successfully logged in", data: { token } });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};
module.exports.createAuthor = createAuthor;
module.exports.createLogin = loginData;

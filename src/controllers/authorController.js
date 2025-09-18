const authorModel = require("../models/authorModel");
const valid = require("../validation/validator");
const jwt = require("jsonwebtoken");


const createAuthors = async function (req, res) {
  try {
    let reqBody = req.body;
    let { fname, lname, title, email, password } = reqBody;
    
    if ( !valid.isValidReqBody(reqBody)) {
      return res.status(400).send({ status: false, msg: "Please provide request body" });
    }

    if (!valid.isValid(fname)) {
      return res.status(400).send({ status: false, msg: "Please provide fname" });
    }
    if (!valid.regexValid(fname)) {
      return res.status(400).send({ status: false, msg: "fname should be alphabets only" });
    }

    if (!valid.isValid(lname)) {
      return res.status(400).send({ status: false, msg: "Please provide last name" });
    }
    if (!valid.regexValid(lname)) {
      return res.status(400).send({ status: false, msg: "lname should be alphabets only" });
    }

    if (!valid.isValid(title)) {
      return res.status(400).send({ status: false, msg: "title is mandatory.." });
    }
    if (!valid.isValidTitle(title)) {
      return res.status(400).send({ status: false, msg: "title should be Mr, Mrs or Miss" });
    }

    if (!valid.isValid(email)) {
      return res.status(400).send({ status: false, msg: "Please provide email" });
    }
    if (!valid.isValidEmail(email)) {
      return res.status(400).send({ status: false, msg: "invalid email" });
    }
    let emailAlreadyExist = await authorModel.findOne({email: email});
    if (emailAlreadyExist ) {
      return res.status(400).send({ status: false, msg: "Email already exist" });
    }

    if (!valid.isValid(password)) {
      return res.status(400).send({ status: false, msg: "Please provide Password.." });
    }
    if (!valid.isValidPassword(password)) {
      return res.status(400).send({ status: false, msg: "Password should be min 8 letters,max 15,consist of numbers, special character, alphabets capital and small both" });
    }
    
    let authorCreation = await authorModel.create(reqBody);
    res.status(201).send({ status: true, data: authorCreation });

  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const loginData = async function(req, res){
  try{
    const { email, password } = req.body;
    if(!valid.isValidReqBody(req.body)){
      return res.status(400).send({ status: false, msg: "Please enter email and password for log in" });
    }
    if(!valid.isValid(email)){
      return res.status(400).send({ status: false, msg: "Please enter email id.." });
    }
    if(!valid.isValidEmail(email)){
      return res.status(400).send({ status: false, msg: "Please enter valid email id.." });
    }
    
    if(!valid.isValid(password)){
      return res.status(400).send({ status: false, msg: "Please enter password.." });
    }
    if(!valid.isValidPassword(password)){
      return res.status(400).send({ status: false, msg: "Please enter password in proper format.." });
    }
    let authorExist = await authorModel.findOne({email:email, password:password});
     
    if(!authorExist){
      return res.status(401).send({ status: false, msg: "Credentials are incorrect.." });
    }
    console.log("Logged in successfully..");

     let token = jwt.sign({ authorID : authorExist._id }, "serversidekey", { expiresIn: "1h" });
      res.setHeader("x-api-key", token);

      return res.status(200).send({ status:true, msg: "successfully logged in", data: token})
    
  }catch(error){
    return res.status(500).send({ status: false, msg: error.message})
  }
  

}
module.exports.createAuthor = createAuthors;
module.exports.createLogin = loginData

const userModel = require("../models/userModel");
const valid = require("../validation/validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createUser = async function(req, res){
  try{
    let reqbody = req.body;

    if(!reqbody || !valid.isValidReqBody(reqbody)){
      return res.status(400).send({ status: false, msg: "Please provide user data for create user in req body"})
    }
    let { title, name, phone, email, password, address } = reqbody;

    if(typeof name === "string"){
      name = name.trim()
      reqbody.name = name
    }
    if(typeof phone === "string"){
      phone = phone.trim();
      reqbody.phone = phone
    }
    if(typeof email === "string"){
      email = email.trim();
      reqbody.email = email
    }
    if(typeof password === "string"){
      password = password.trim()
      reqbody.password = password
    }

    if(!valid.isValid(title)){
      return res.status(400).send({ status: false, msg: "Please enter title.."})
    }
    let afterValidationTitle = valid.isValidTitle(title)
   if(!afterValidationTitle){
      return res.status(400).send({ status: false, msg: "Title should be Mr, Mrs, Miss" })
    }
    reqbody.title = afterValidationTitle;
    
    if(!valid.isValid(name)){
      return res.status(400).send({ status: false, msg: "Please enter full name.."})
    }
    if(!valid.isValidName(name)){
      return res.status(400).send({ status: false, msg: "Please provide name in proper string format.."})
    }

    if(!valid.isValid(phone)){
      return res.status(400).send({ status: false, msg: "Please enter phone number.."})
    }
    if(!valid.isValidMobile(phone)){
      return res.status(400).send({ status: false, msg: "Phone number should be string, 10 digits and start with 6, 7, 8 or 9.."})
    }

   let phoneExist = await userModel.findOne({phone:phone});
   if(phoneExist){
     return res.status(409).send({ status: false, msg: "Phone number already exist.."})
    }
    if(!valid.isValid(email)){
      return res.status(400).send({ status: false, msg: "Please enter email id.."})
    }
    if(!valid.isValidEmail(email)){
      return res.status(400).send({ status: false, msg: "Please enter valid email id.."})
    }

    let emailExist = await userModel.findOne({email:email});
     if(emailExist){
      return res.status(409).send({ status: false, msg: "email id already exist.."})
    }
    if(!valid.isValid(password)){
      return res.status(400).send({ status: false, msg: "Please enter Password.."})
    }
    if(!valid.isValidPassword(password)){
      return res.status(400).send({ status: false, msg: "Please enter Password in string and between 8 to 15 characters.."})
    }
    const saltRounds = 10;
    reqbody.password = await bcrypt.hash(reqbody.password, saltRounds)
    
    if(!address || (typeof address) !== "object" ){
      return res.status(400).send({ status: false, msg: "Please enter Address in object format.."})
   }
    if (Object.keys(address).length == 0) {
      return res.status(400).send({ status: false, msg: "address should contain city, state, pincode" })
    }
    if(!valid.isValid(address.street)){
      return res.status(400).send({ status: false, msg: "Please provide street name" })
    }
    if(!valid.isValid(address.city)){
      return res.status(400).send({ status: false, msg: "Please provide city name" })
    }
    if(!valid.isValid(address.pincode)){
      return res.status(400).send({ status: false, msg: "Please provide pincode" })
    }
    if(!valid.isValidPincode(address.pincode)){
      return res.status(400).send({ status: false, msg: "Pincode should be string and 6 digit.." })
    }
    
    let newUser = await userModel.create(reqbody);
    let { password:hashedPassword, ...newUserData} = newUser.toObject()
    res.status(201).send({ status:true, message:"Registered Successfully", data: newUserData })
  
  }catch(error){
    return res.status(500).send({ status: false, msg: error.message})
  }

}

const loginUser = async function(req, res){
   try{
    if(!req.body || !valid.isValidReqBody(req.body)){
       return res.status(400).send({ status: false, msg: "Please provide email and password for log in.." })
    }
    let { email, password } = req.body;

    if(typeof email === "string"){
      email = email.trim()
    }
    if(typeof password === "string"){
      password = password.trim();
     }

    if(!valid.isValid(email)){
      return res.status(400).send({ status: false, msg: "e-mail is required."})
    }
    if(!valid.isValidEmail(email)){
      return res.status(400).send({ status: false, msg: "Please enter valid email address.."})
    }
    let emailExist = await userModel.findOne({email: email})
    if(!emailExist){
      return res.status(401).send({ status: false, msg: "Invalid email "})
    }
    if(!valid.isValid(password)){
      return res.status(400).send({ status: false, msg: "Please enter password.."})
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, emailExist.password);
        
    if(!isPasswordCorrect){
      return res.status(401).send({ status: false, msg: "email or password not correct.."})
    }
      console.log("Logged in successfully..");

      let token = jwt.sign({ userId: emailExist._id}, process.env.JWT_SECRET_KEY, { expiresIn: "1h"});
      res.setHeader("x-api-key", token );
      res.status(200).send({ status: true, message: "Successfully logged in.", data: {token } });
    
   }catch(error){
    return res.status(500).send({ status: false, msg: error.message})
   }
}

module.exports.createUser = createUser;
module.exports.userLogin = loginUser
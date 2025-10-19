const userModel = require("../models/userModel");
const valid = require("../validation/validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const createUser = async function(req, res){
  try{
    let reqbody = req.body;
    let { title, name, phone, email, password, address } = reqbody;

    if(!valid.isValidReqBody(reqbody)){
      return res.status(400).send({ status: false, msg: "Please provide data in req body"})
    }
    if(!valid.isValid(title)){
      return res.status(400).send({ status: false, msg: "Please enter title.."})
    }
   if(!valid.isValidTitle(title)){
      return res.status(400).send({ status: false, msg: "Title should be Mr, Mrs, Miss" })
    }
    if(!valid.isValid(name)){
      return res.status(400).send({ status: false, msg: "Please enter name.."})
    }
    if(!valid.isValid(phone)){
      return res.status(400).send({ status: false, msg: "Please enter phone number.."})
    }
    if(!valid.isValidMobile(phone)){
      return res.status(400).send({ status: false, msg: "Phone number should be 10 digits and start with 6, 7, 8 or 9.."})
    }

   let phoneExist = await userModel.findOne({phone:phone});
   if(phoneExist){
     return res.status(409).send({ status: false, msg: "Phone number already exist.."})
    }
    if(!valid.isValid(email)){
      return res.status(400).send({ status: false, msg: "Please enter email id.."})
    }
    if(!valid.isValidEmail(email)){
      return res.status(400).send({ status: false, msg: "Please enter valid email.."})
    }

    let emailExist = await userModel.findOne({email:email});
     if(emailExist){
      return res.status(409).send({ status: false, msg: "email id already exist.."})
    }
    if(!valid.isValid(password)){
      return res.status(400).send({ status: false, msg: "Please enter Password.."})
    }
    if(!valid.isValidPassword(password)){
      return res.status(400).send({ status: false, msg: "Please enter Password in between 8 to 15 characters.."})
    }
    const saltRounds = 10;
    reqbody.password = await bcrypt.hash(reqbody.password, saltRounds)
    
    if((typeof address) !== "object" ){
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
    let createUser = await userModel.create(reqbody);
    res.status(201).send({ status:true, message:"Registered Successfully", data: createUser })
  
  }catch(error){
    return res.status(500).send({ status: false, msg: error.message})
  }

}

const loginUser = async function(req, res){
   try{
    let { email, password } = req.body;
    if(!valid.isValidReqBody(req.body)){
       return res.status(400).send({ status: false, msg: "Please provide email and password for log in.." })
    }
    if(!valid.isValid(email)){
      return res.status(400).send({ status: false, msg: "Please enter email.."})
    }
    if(!valid.isValidEmail(email)){
      return res.status(400).send({ status: false, msg: "Please enter valid email id.."})
    }
    let emailExist = await userModel.findOne({email: email})
    if(!emailExist){
      return res.status(404).send({ status: false, msg: "User email not found.."})
    }
    if(!valid.isValid(password)){
      return res.status(400).send({ status: false, msg: "Please enter password.."})
    }
    if(!valid.isValidPassword(password)){
      return res.status(400).send({ status: false, msg: "Please enter password in 8-15 characters, special symbol, capital letter and number.."})
    }
    const isPasswordCorrect = await bcrypt.compare(password, emailExist.password);
        
    if(!isPasswordCorrect){
      return res.status(401).send({ status: false, msg: "No user found with this credentials.."})
    }
      console.log("Logged in successfully..");

      let token = jwt.sign({ userId: emailExist._id}, "secretkeyForBook", { expiresIn: "1h"});
      res.setHeader("x-api-key", token );
      res.status(200).send({ status: true, message: "Successfully logged in.", data: token });
    
   }catch(error){
    return res.status(500).send({ status: false, msg: error.message})
   }
    
  
}

module.exports. createUser = createUser;
module.exports.userLogin = loginUser
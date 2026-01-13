const internModel = require("../models/internModel");
const valid = require("../validation/validator");
const collegeModel = require("../models/collegeModel")

const createIntern = async function(req, res){
  res.setHeader('Access-Control-Allow-Origin', '*')

  try{
    
  if(!req.body || !valid.isValidReqBody(req.body)){
     return res.status(400).send( { status: false, msg: "Please enter data in req body.."})
  }
    let { name, email, mobile, collegeName } = req.body;

  if(!valid.isValid(name)){
   return res.status(400).send( { status: false, msg: "Please provide name.."})
  }
  if(!valid.isValidName(name)){
   return res.status(400).send( { status: false, msg: "Please provide name in alphabets only.."})
  }

  name = name.trim();
  if(!valid.isValid(email)){
   return res.status(400).send( { status: false, msg: "Please provide email.."})
  }
  email = email.toLowerCase().trim()
  if(!valid.isValidEmail(email)){
   return res.status(400).send( { status: false, msg: "please enter email in proper format"})
  }
  let emailExist = await internModel.findOne({ email });
  if(emailExist){
    return res.status(409).send({ status: false, msg: "email already exist.."})
  }
  if(!valid.isValid(mobile)){
   return res.status(400).send( { status: false, msg: "Please enter mobile number.."})
  }
  mobile = mobile.toString().trim();

  if (mobile.startsWith("+91")){ 
    mobile = mobile.slice(3);
  }
  else if (mobile.startsWith("91") && mobile.length === 12){
   mobile = mobile.slice(2);
  }
  if(!valid.isValidMobile(mobile)){
   return res.status(400).send( { status: false, msg: "Please enter valid mobile number.."})
  }
  let mobileExist = await internModel.findOne({ mobile });
  if(mobileExist){
    return res.status(409).send({ status: false, msg: "mobile number already exist.."})
  }
  if(!valid.isValid(collegeName)){
   return res.status(400).send( { status: false, msg: "Please enter college name.."})
  }
   collegeName = collegeName.toLowerCase().trim();
  let collegeExist = await collegeModel.findOne({ name: collegeName, isDeleted:false });
  if(!collegeExist){
    return res.status(404).send({ status:false, msg: "College not Found"})
  }
  let internData = {
    name: name,
    email: email,
    mobile: mobile,
    collegeId: collegeExist._id
  }
    let createInternData = await internModel.create(internData);
    res.status(201).send( { status: true, data: createInternData } );

  }catch(error){
    return res.status(500).send({ status:false, msg: error.message })
  }
  
}

module.exports.createIntern = createIntern
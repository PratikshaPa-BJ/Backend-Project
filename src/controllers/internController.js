const { isValidObjectId } = require("mongoose");
const internModel = require("../models/internModel");
const valid = require("../validation/validator");
const collegeModel = require("../models/collegeModel")

const createIntern = async function(req, res){
     res.setHeader('Access-Control-Allow-Origin', '*')

  try{
    let { name, email, mobile, collegeName } = req.body;
    // console.log(req.body);
    
  if(!valid.isValidReqBody(req.body)){
   return res.status(400).send( { status: false, msg: "Please enter data in req body.."})
  }
  if(!valid.isValid(name)){
   return res.status(400).send( { status: false, msg: "Please enter data in name.."})
  }
  if(!valid.isValid(email)){
   return res.status(400).send( { status: false, msg: "Please provide email.."})
  }
  if(!valid.isValidEmail(email)){
   return res.status(400).send( { status: false, msg: "please enter email in proper format"})
  }
  let emailExist = await internModel.findOne({email:email});
  if(emailExist){
    return res.status(409).send({ status: false, msg: "email already exist.."})
  }
  if(!valid.isValid(mobile)){
   return res.status(400).send( { status: false, msg: "Please enter mobile number.."})
  }
  if(!valid.isValidMobile(mobile)){
   return res.status(400).send( { status: false, msg: "Please enter valid mobile number.."})
  }
  let mobileExist = await internModel.findOne({ mobile:mobile });
  if(mobileExist){
    return res.status(409).send({ status: false, msg: "mobile number already exist.."})
  }
  if(!valid.isValid(collegeName)){
   return res.status(400).send( { status: false, msg: "Please enter college name.."})
  }
  
  let collegeExist = await collegeModel.findOne({ name: req.body.collegeName, isDeleted:false });
  if(!collegeExist){
    return res.status(404).send({ status:false, msg: "College is not available"})
  }
  let internData = {
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    collegeId: collegeExist._id
  }
    let createInternData = await internModel.create(internData);
    res.status(201).send( { status: true, data: createInternData } );


  }catch(error){
    return res.status(500).send({ status:false, msg: error.message })
  }
  
}

module.exports.createIntern = createIntern
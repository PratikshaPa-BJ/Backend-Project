const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const valid = require("../validation/validator");

const createCollegeData = async function(req, res){
  try{
    let reqbody = req.body;
    let {name, fullName, logoLink } = reqbody;

    if(!valid.isValidReqBody(reqbody)){
      return res.status(400).send({ status: false, msg: "Please provide data in req body"})
   }
    if(!valid.isValid(name)){
      return res.status(400).send({ status: false, msg: "Please enter college name"})
   }
   let collegeExist = await collegeModel.findOne({name:name});
   if(collegeExist){
     return res.status(409).send({ status: false, msg: "College name already exist.."})
   }
   if(!valid.isValid(fullName)){
      return res.status(400).send({ status: false, msg: "Please enter college full name"})
   }
   let collegeFnameExist = await collegeModel.findOne({fullName:fullName});
   if(collegeFnameExist){
      return res.status(400).send({ status: false, msg: "College full name already exist.."})
   }
   
   if(!valid.isValid(logoLink)){
      return res.status(400).send({ status: false, msg: "Please enter college logo"})
   }
   if(!valid.isValidLogolink(logoLink)){
      return res.status(400).send({ status: false, msg: "Please enter valid logo link"})

   }

   let createCollege = await collegeModel.create(reqbody);
    res.status(201).send({ status:true, data: createCollege })
  
  }catch(error){
    return res.status(500).send({ status: false, msg: error.message})
  }

}

const getCollegeDetails = async function(req, res){
   res.setHeader('Access-Control-Allow-Origin', '*')
  try{

  if(req.query.collegeName){
  let collegeFromReq = req.query.collegeName;
  let collegeExist = await collegeModel.findOne({ name: collegeFromReq, isDeleted:false });
  if(!collegeExist){
      return res.status(404).send({ status: false, msg: "College is not available.."})
  }
  // console.log(collegeExist);
  
  let internOfSpecificCollege = await internModel.find({collegeId: collegeExist._id, isDeleted:false })
   .select({collegeId:0, isDeleted:0, createdAt:0, updatedAt:0, __v:0 })
  if(internOfSpecificCollege.length === 0){
      return res.status(200).send({ status: false, msg: "No interns apply internship for this college.."})
  }
  let internDetailsWithCollege = {
    collegename: collegeExist.name,
    fullName: collegeExist.fullName,
    logoLink: collegeExist.logoLink,
    interns: internOfSpecificCollege
  }

  res.status(200).send({ status: true, data: internDetailsWithCollege})

}else{
  return res.status(400).send({ status: false, msg: "Please enter college name in req parameter"})
}

}catch(error){
    return res.status(500).send({ status: false, msg: error.message})

  }
  
}

module.exports. createCollege = createCollegeData;
module.exports.getCollegeDetails = getCollegeDetails
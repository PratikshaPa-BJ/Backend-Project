const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
const valid = require("../validation/validator");
const uploadToCloudinary = require("../utils/cloudinary")

const createCollegeData = async function (req, res) {
  try {
    let reqbody = req.body;

    if (!reqbody || !valid.isValidReqBody(reqbody)) {
      return res.status(400).send({
          status: false,
          msg: "Please provide college data in req body",
        });
    }

    let { name, fullName } = reqbody;

    if (!valid.isValid(name)) {
      return res.status(400).send({
          status: false,
          msg: "Please enter college name and in string format.. ",
        });
    }
    if (!valid.isValidCollegeCode(name)) {
      return res.status(400).send({
          status: false,
          msg: "college short name should contain lowercase alphabets.. ",
        });
    }
    name = name.toLowerCase().trim();

    let collegeExist = await collegeModel.findOne({ name, isDeleted:false });
    if (collegeExist) {
      return res.status(409).send({ status: false, msg: "College short name already exist.." });
    }
    if (!valid.isValid(fullName)) {
      return res.status(400).send({
          status: false,
          msg: "Please enter college full name ",
        });
    }
    if (!valid.isValidCollegeName(fullName)) {
      return res.status(400).send({
          status: false,
          msg: "College full name should contain only alphabets, spaces, commas or dots..",
        });
    }
    fullName = fullName.trim();

    let collegeFnameExist = await collegeModel.findOne({ fullName, isDeleted:false });
    if (collegeFnameExist) {
      return res.status(409).send({ status: false, msg: "College full name already exist.." });
    }

    if(!req.files || req.files.length === 0){
      return res.status(400).send({ status: false, msg: "Please provide college logo image "})
    }
    const allowedTypes = [ "image/jpeg", "image/png", "image/jpg" ];
    if(!allowedTypes.includes(req.files[0].mimetype)){
      return res.status(400).send({ status: false, msg: " Only JPG, JPEG, PNG images are allowed "})
    }
    const MAX_SIZE = 2 * 1024 * 1024;
    if(req.files[0].size > MAX_SIZE){
     return res.status(400).send({ status: false, msg: " image size should be less than 2 MB "})
    }
    
    const logoLinkURL = await uploadToCloudinary(req.files[0]);

    let createCollege = await collegeModel.create({ name, fullName, logoLink:logoLinkURL });
    res.status(201).send({ status: true, data: createCollege });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const getCollegeDetails = async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    if (req.query.collegeName) {
      let collegeFromReq = req.query.collegeName.toLowerCase().trim();
      let collegeExist = await collegeModel.findOne({
        name: collegeFromReq,
        isDeleted: false,
      });
      if (!collegeExist) {
        return res.status(404).send({ status: false, msg: "College is not available.." });
      }

      let internOfSpecificCollege = await internModel
        .find({ collegeId: collegeExist._id, isDeleted: false })
        .select({
          collegeId: 0,
          isDeleted: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        });

      if (internOfSpecificCollege.length === 0) {
        return res.status(200).send({
            status: true,
            msg: "No interns apply internship for this college..",
          });
      }
      let internDetailsWithCollege = {
        collegename: collegeExist.name,
        fullName: collegeExist.fullName,
        logoLink: collegeExist.logoLink,
        interns: internOfSpecificCollege,
      };

      res.status(200).send({ status: true, data: internDetailsWithCollege });
    } else {
      return res.status(400).send({
          status: false,
          msg: "Please enter college name in req parameter",
        });
    }
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.createCollege = createCollegeData;
module.exports.getCollegeDetails = getCollegeDetails;

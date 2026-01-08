const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const blogModel = require("../models/blogModel");

const authentication = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res.status(401).send({ status: false, msg: "Token must be present in header.." });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, function (error, decodedToken) {
      if (error) {
        return res.status(401).send({ status: false, msg: error.message });
      } else {
        req.authorIdFromDecodedToken = decodedToken.authorId;
        next();
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const authorisationById = async function (req, res, next) {
  try {
    let blogIdFromReq = req.params.blogId.trim();

    if (!isValidObjectId(blogIdFromReq)) {
      return res.status(400).send({ status: false, msg: "Please enter a valid blog id" });
    }

    let blogExist = await blogModel.findById(blogIdFromReq);

    if (!blogExist) {
      return res.status(404).send({ status: false, msg: " No Blog Found " });
    }
    if (blogExist.isDeleted) {
      return res.status(404).send({ status: false, msg: " Blog is already deleted " });
    }
    if (req.authorIdFromDecodedToken.toString() !== blogExist.authorId.toString()) {
      return res.status(403).send({
        status: false,
        msg: "Access Denied.. You are not authorised to modify this blog..",
      });
    }

    req.blogFromMW = blogExist;
    next();

  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const authorisationByQuery = async function (req, res, next) {
  try {
    let { authorId } = req.query;
    const authorLoggedIn = req.authorIdFromDecodedToken;

    if (authorId && authorId.trim().length > 0) {
       authorId = authorId.trim();
      if (!isValidObjectId(authorId)) {
        return res.status(400).send({ status: false, msg: "Invalid authorId format..." });
      }

      if (authorId.toString() !== authorLoggedIn.toString()) {
        return res.status(403).send({
          status: false,
          msg: "Unauthorised — You cannot delete other author blogs data..",
        });
      }

      req.authorIdForQuery = authorId;
    } else {
      req.authorIdForQuery = authorLoggedIn;
    }

    next();
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { authentication, authorisationById, authorisationByQuery };

const moment = require("moment");
const { isValidObjectId } = require("mongoose");
const valid = require("../validation/validator");
const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");

const createBlogs = async function (req, res) {
  try {
    let reqBody = req.body;
    let { title, body, tags, category, authorId, isPublished } = reqBody;
    if (!reqBody || !valid.isValidReqBody(reqBody)) {
      return res.status(400).send({ status: false, msg: "Please provide request body" });
    }
    if (!valid.isValid(authorId)) {
      return res.status(400).send({ status: false, msg: "author id is mandatory.." });
    }
    if (!isValidObjectId(authorId)) {
      return res.status(400).send({ status: false, msg: "Please provide valid author id.." });
    }
    let authorExist = await authorModel.findOne({ _id: authorId });
    if (!authorExist) {
      return res.status(404).send({ status: false, msg: "author id is not present in db" });
    }
    // authorisation
    if (req.authorIdFromDecodedToken !== authorId) {
      return res.status(403).send({ status: false, msg: "Unauthorised user.." });
    }
    if (!valid.isValid(title)) {
      return res.status(400).send({ status: false, msg: "Please provide title.." });
    }
    if (!valid.isValid(body)) {
      return res.status(400).send({ status: false, msg: "Please provide body data.." });
    }
    if (!valid.isValid(tags)) {
      return res.status(400).send({ status: false, msg: "Please provide tags data.." });
    }
    if (!valid.isValid(category)) {
      return res.status(400).send({ status: false, msg: "Please provide proper category.." });
    }

    let currentDate = moment().format("DD-MM-YYYY");
    if (isPublished === true) {
      reqBody.publishedAt = currentDate;
    }

    const blogCreation = await blogModel.create(reqBody);

    return res.status(201).send({
      status: true,
      msg: "Blog create successfully",
      data: blogCreation,
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const getBlogData = async function (req, res) {
  try {
    if (valid.isValidReqBody(req.query)) {
      let { authorId, tags, category, subcategory } = req.query;
      let obj = {};

      if (authorId) {
        if (!isValidObjectId(authorId)) {
          return res.status(400).send({ status: false, msg: "Please provide valid author id.." });
        }
        let authorExist = await authorModel.findById(authorId);
        if (!authorExist) {
          return res.status(404).send({ status: false, msg: "Author id does not exist.." });
        }
        obj.authorId = authorId;
      }
      if (category) {
        obj.category = category;
      }
      if (subcategory) {
        obj.subcategory = subcategory;
      }
      if (tags) {
        obj.tags = tags;
      }
      obj.isDeleted = false;
      obj.isPublished = true;

      let getBlogs = await blogModel.find(obj);

      if (getBlogs.length === 0) {
        return res.status(404).send({ status: false, msg: "No Blog Found" });
      }
      return res.status(200).send({ status: true, data: getBlogs });
    } else {
      let getAllBlog = await blogModel.find({
        isDeleted: false,
        isPublished: true,
      });
      return res.status(200).send({ status: true, data: getAllBlog });
    }
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const updateBlogData = async function (req, res) {
  try {
    let blogIdFromReq = req.params.blogId;
    let reqbody = req.body;
    let { title, body, tags, subcategory } = reqbody;

    if (!isValidObjectId(blogIdFromReq)) {
      return res.status(400).send({ status: false, msg: "Please enter a valid vlog id" });
    }

    let blogExist = await blogModel.findById(blogIdFromReq);

    if (!blogExist) {
      return res.status(404).send({ status: false, msg: " No Blog Found " });
    }
    if (blogExist.isDeleted) {
      return res.status(404).send({ status: false, msg: " Blog is already deleted " });
    }
    // Authorisation
    if (req.authorIdFromDecodedToken !== blogExist.authorId.toString()) {
      return res.status(403)
        .send({
          status: false,
          msg: "Unauthorised author, can not update other author data..",
        });
    }

    if (!valid.isValidReqBody(reqbody)) {
      return res.status(400).send({ status: false, msg: " Please provide request body " });
    }

    let updateBlogData = await blogModel.findOneAndUpdate(
      { _id: blogIdFromReq, isDeleted: false },
      {
        $set: {
          title: title,
          body: body,
          isPublished: true,
          publishedAt: new Date(),
        },

        $push: { tags: tags, subcategory: subcategory },
      },
      { new: true }
    );

    return res.status(200).send({
      status: true,
      message: "Blog updated successfully",
      data: updateBlogData,
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const deleteBlogById = async function (req, res) {
  try {
    let blogIdfromReq = req.params.blogId;
    if (!isValidObjectId(blogIdfromReq)) {
      return res.status(400).send({ status: false, msg: "Please enter a valid vlog id.." });
    }
    let blogExist = await blogModel.findById(blogIdfromReq);

    if (!blogExist) {
      return res.status(404).send({ status: false, msg: "No blog exist" });
    }
    if (blogExist.isDeleted) {
      return res.status(404).send({ status: false, msg: "Blog already deleted" });
    }
    // console.log(typeof blogExist.authorId);

    // Authorisation
    if (req.authorIdFromDecodedToken != blogExist.authorId) {
      return res.status(403).send({ status: false, msg: "You are not authorised to delete data " });
    }

    let dateAndTime = new Date();

    let updateBlog = await blogModel.findOneAndUpdate(
      { _id: blogIdfromReq },
      { $set: { isDeleted: true, deletedAt: dateAndTime } },
      { new: true }
    );
    res.status(200).send({ status: true,  message: "Blog Deleted successfully", data: updateBlog });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const deleteBlogByQueryParams = async function (req, res) {
  try {
    if (valid.isValidReqBody(req.query)) {
      let { category, authorId, tags, subcategory, isPublished } = req.query;
      let obj = {};
      let currentDate = new Date();
      if (authorId) {
        if (!isValidObjectId(authorId)) {
          return res.status(400).send({ status: false, msg: "Please enter valid author id" });
        }
        let authorExist = await authorModel.findById(authorId);
        if (!authorExist) {
          return res.status(404).send({ status: false, msg: "Author id does not exist.." });
        }

        if (req.authorIdFromDecodedToken !== authorId) {
          return res.status(403).send({
              status: false,
              msg: "Unauthorised, not allowed to delete other data..",
            });
        }

        obj.authorId = authorId;
        if (category) {
          obj.category = category;
        }
        if (tags) {
          obj.tags = tags;
        }
        if (subcategory) {
          obj.subcategory = subcategory;
        }
        if (isPublished) {
          obj.isPublished = isPublished;
        }
        obj.isDeleted = false;
        let blogFound = await blogModel.find(obj);
        if (blogFound.length === 0) {
          return res.status(404).send({ status: false, msg: "Either deleted or No blog found.." });
        }

        let deletedBlogData = await blogModel.updateMany(
          obj,
          { $set: { isDeleted: true, deletedAt: currentDate } },
          { new: true }
        );

        return res.status(200).send({
            status: true,
            msg: "specific author id blog Data deleted",
            data: deletedBlogData,
          });
      } else {
        if (category) {
          obj.category = category;
        }

        if (tags) {
          obj.tags = tags;
        }
        if (subcategory) {
          obj.subcategory = subcategory;
        }
        if (isPublished) {
          obj.isPublished = isPublished;
        }
        obj.isDeleted = false;
        console.log(obj);

        let dataFound = await blogModel.find(obj).select({ _id: 0, authorId: 1 });

        if (dataFound.length === 0) {
          return res.status(404)
            .send({
              status: false,
              msg: "Either Deleted or No blog document exist with this query..",
            });
        }
        let count = 0;
        for (let i = 0; i < dataFound.length; i++) {
          if (dataFound[i].authorId.toString() === req.authorIdFromDecodedToken) {
            count++;
          }
        }
        console.log(count);
        if (count === 0) {
          return res.status(403).send({
              status: false,
              msg: "Unauthorised Author, you are not allowed to delete..",
            });
        }

        let deletedData = await blogModel.updateMany(
          { $and: [obj, { authorId: req.authorIdFromDecodedToken }] },
          { $set: { isDeleted: true, deletedAt: currentDate } },
          { new: true }
        );

        return res.status(200).send({
          status: true,
          msg: "specific Data deleted",
          data: deletedData,
        });
      }
    } else {
      return res.status(400).send({ status: false, msg: "No Query found.." });
    }
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const deleteBlogByQueryParamsAlternative = async function (req, res) {
  try {
    if (valid.isValidReqBody(req.query)) {
      let { category, authorId, tags, subcategory, isPublished } = req.query;
      let obj = {};
      let currentDate = new Date();

      if (category) {
        obj.category = category;
      }
      if (authorId) {
        if (!isValidObjectId(authorId)) {
          return res.status(400).send({ status: false, msg: "Please enter valid author id" });
        }
        let authorExist = await authorModel.findById(authorId);
        if (!authorExist) {
          return res.status(404).send({ status: false, msg: "Author id does not exist.." });
        }

        if (req.authorIdFromDecodedToken !== authorId) {
          return res.status(403).send({
              status: false,
              msg: "Unauthorised author, not allowed to delete other data..",
            });
        }
        obj.authorId = authorId;
      }else{
        obj.authorId = req.authorIdFromDecodedToken;
      }
      if (tags) {
        obj.tags = tags;
      }
      if (subcategory) {
        obj.subcategory = subcategory;
      }
      if (isPublished) {
        obj.isPublished = isPublished;
      }
      obj.isDeleted = false;
      console.log(obj);

      let dataFound = await blogModel.find(obj);

      if (dataFound.length === 0) {
        return res.status(404).send({
            status: false,
            msg: "Either deleted or No blog document exist with this query..",
          });
      }

      let deletedData = await blogModel.updateMany(
        //  { authorId: authorId, category: category, subcategory:subcategory, tags: tags, isPublished: isPublished },
         obj,
        { $set: { isDeleted: true, deletedAt: currentDate } },
        { new: true }
      );

      return res.status(200).send({
        status: true,
        msg: "specific Data deleted",
        data: deletedData,
      });
    } else {
      return res.status(400).send({ status: false, msg: "No Query found.." });
    }
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { createBlogs, getBlogData, updateBlogData, deleteBlogById, deleteBlogByQueryParams, deleteBlogByQueryParamsAlternative };

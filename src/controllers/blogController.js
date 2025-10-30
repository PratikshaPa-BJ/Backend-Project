const moment = require("moment");
const { isValidObjectId } = require("mongoose");
const valid = require("../validation/validator");
const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");

const createBlogs = async function (req, res) {
  try {
    let reqBody = req.body;
    if (!reqBody || !valid.isValidReqBody(reqBody)) {
      return res.status(400).send({ status: false, msg: "Please provide request body" });
    }
    let { title, body, tags, category, authorId, isPublished, subcategory } = reqBody;

    if (!valid.isValid(authorId)) {
      return res.status(400).send({ status: false, msg: "author id is mandatory.." });
    }
    if (typeof authorId === "string") {
      authorId = authorId.trim();
      reqBody.authorId = authorId;
    }

    if (!isValidObjectId(authorId)) {
      return res.status(400).send({ status: false, msg: "Please provide valid author id.." });
    }
    let authorExist = await authorModel.findOne({ _id: authorId });
    if (!authorExist) {
      return res.status(404).send({ status: false, msg: "author id is not present in db" });
    }
    //------------------- authorisation---------------------------------------------------------
    if (req.authorIdFromDecodedToken.toString() !== authorId) {
      return res.status(403).send({ status: false, msg: "Unauthorised author..can not create blog.." });
    }

    if (!valid.isValid(title) || typeof title !== "string") {
      return res.status(400).send({
        status: false,
        msg: "title is required and should be a string..",
      });
    }
    reqBody.title = title.trim();

    if (!valid.isValid(body) || typeof body !== "string") {
      return res.status(400).send({
        status: false,
        msg: "blog body part is mandatory and should be string",
      });
    }
    reqBody.body = body.trim();

    if (tags || tags === "") {
      if (!Array.isArray(tags) || tags.length === 0) {
        return res.status(400).send({
          status: false,
          msg: "Tags must be in array and contain atleast one element",
        });
      }
      if (!valid.hasValidStringElem(tags)) {
        return res.status(400).send({
          status: false,
          msg: "tags should not contain empty string elements..",
        });
      }
      reqBody.tags = tags.map((elem) => elem.trim());
    }

    if (!valid.isValid(category) || typeof category !== "string") {
      return res.status(400).send({
        status: false,
        msg: "category is required and should be in string.",
      });
    }
    reqBody.category = category.trim();

    if (subcategory || subcategory === "") {
      if (!Array.isArray(subcategory) || subcategory.length === 0) {
        return res.status(400).send({
          status: false,
          msg: "Please provide atleast one subcategory and in array format..",
        });
      }
      if (!valid.hasValidStringElem(subcategory)) {
        return res.status(400).send({
          status: false,
          msg: "subcategory should not contain empty string elements..",
        });
      }
      reqBody.subcategory = subcategory.map((elem) => elem.trim());
    }

    let currentDate = moment().format("DD-MM-YYYY");
    if (isPublished === true) {
      reqBody.publishedAt = currentDate;
    }

    const blogCreation = await blogModel.create(reqBody);

    return res.status(201).send({
      status: true,
      msg: "Blog created successfully",
      data: blogCreation,
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const getBlogData = async function (req, res) {
  try {
    let obj = {};

    if (valid.isValidReqBody(req.query)) {
      let { authorId, tags, category, subcategory } = req.query;

      if (authorId ) {
        if (typeof authorId === "string") {
          authorId = authorId.trim();
        }
        if (!isValidObjectId(authorId)) {
          return res.status(400).send({ status: false, msg: "Please provide valid author id.." });
        }

        let authorExist = await authorModel.findById(authorId);
        if (!authorExist) {
          return res.status(404).send({ status: false, msg: "Author id does not exist.." });
        }
        obj.authorId = authorId;
      }
      if (valid.isValid(category)) {
        obj.category = category.trim();
      }

      if (tags) {
        if (Array.isArray(tags)) {
          obj.tags = { $in: tags.map((elem) => elem.trim()) };
        } else {
          obj.tags = { $in: tags.split(",").map((elem) => elem.trim()) };
        }
      }

      if (subcategory) {
        if (Array.isArray(subcategory)) {
          obj.subcategory = { $in: subcategory.map((elem) => elem.trim()) };
        } else {
          obj.subcategory = {
            $in: subcategory.split(",").map((elem) => elem.trim()),
          };
        }
      }
    }
    obj.isDeleted = false;
    obj.isPublished = true;

    let getBlogs = await blogModel.find(obj);

    if (getBlogs.length === 0) {
      return res.status(404).send({ status: false, msg: "No Blog Found" });
    }
    return res.status(200).send({ status: true, data: getBlogs });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const updateBlogData = async function (req, res) {
  try {
    let reqbody = req.body;
    let blogIdFromReq = req.params.blogId;
    if (!reqbody || !valid.isValidReqBody(reqbody)) {
      return res.status(400).send({ status: false, msg: " Please provide data you want to update in request body " });
    }

    let { title, body, tags, subcategory } = reqbody;
    const updateFields = {};

    if (title !== undefined) {
      if (!valid.isValid(title) || typeof title !== "string") {
        return res.status(400).send({
          status: false,
          msg: " title should be a non empty string..",
        });
      }
      updateFields.title = title.trim();
    }
    if (body !== undefined) {
      if (!valid.isValid(body) || typeof body !== "string") {
        return res.status(400).send({ status: false, msg: " body should be a non empty string.." });
      }
      updateFields.body = body.trim();
    }
    if (tags !== undefined) {
      if (!Array.isArray(tags) || tags.length === 0) {
        return res.status(400).send({
          status: false,
          msg: "Tags must be in array and contain atleast one element",
        });
      }
      if (!valid.hasValidStringElem(tags)) {
        return res.status(400).send({
          status: false,
          msg: "tags should not contain empty string elements..",
        });
      }
      tags = tags.map((elem) => elem.trim());
    }
    if (subcategory !== undefined) {
      if (!Array.isArray(subcategory) || subcategory.length === 0) {
        return res.status(400).send({
          status: false,
          msg: "Please provide atleast one subcategory and in array format..",
        });
      }
      if (!valid.hasValidStringElem(subcategory)) {
        return res.status(400).send({
          status: false,
          msg: "subcategory should not contain empty string elements..",
        });
      }
      subcategory = subcategory.map((elem) => elem.trim());
    }
    if (!req.blogFromMW.isPublished) {
      updateFields.isPublished = true;
      updateFields.publishedAt = moment().format("DD-MM-YYYY");
    }
    const pushArr = {};
    if (tags) {
      pushArr.tags = { $each: tags };
    }
    if (subcategory) {
      pushArr.subcategory = { $each: subcategory };
    }
    let allField = { $set: updateFields };
    if (Object.keys(pushArr).length > 0) {
      allField.$addToSet = pushArr;
    }

    let updateBlogData = await blogModel.findOneAndUpdate(
      { _id: blogIdFromReq, isDeleted: false },
      allField,
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

    let dateAndTime = moment().toISOString();

    let updateBlog = await blogModel.findOneAndUpdate(
      { _id: blogIdfromReq },
      { $set: { isDeleted: true, deletedAt: dateAndTime } },
      { new: true }
    );
    res.status(200).send({
      status: true,
      message: "Blog Deleted successfully",
      data: updateBlog,
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const deleteBlogByQuery = async function (req, res) {
  try {
    if (!valid.isValidReqBody(req.query)) {
      return res.status(400).send({ status: false, msg: "No query parameters found." });
    }

    let { category, tags, subcategory, isPublished, authorId } = req.query;
    if (authorId) {
      authorId = authorId.trim();
    }
    let obj = { isDeleted: false, authorId: req.authorIdForQuery };
    let currentDate = moment().toISOString();
    let hasValidFilter = false;

    if (valid.isValid(category)) {
      category = category.trim();
      category =  category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
      obj.category = category;
      hasValidFilter = true;
    }

    if (tags) {
      tags = tags.split(",").map((elem) => elem.trim());
      if (!valid.hasValidStringElem(tags)) {
        return res.status(400).send({
          status: false,
          msg: "tags must be a non-empty array of strings..",
        });
      }
      obj.tags = { $in: tags };
      hasValidFilter = true;
    }

    if (subcategory) {
      subcategory = subcategory.split(",").map((elem) => elem.trim());
      if (!valid.hasValidStringElem(subcategory)) {
        return res.status(400).send({
          status: false,
          msg: "subcategory must be a non-empty array of strings.",
        });
      }
      obj.subcategory = { $in: subcategory };
      hasValidFilter = true;
    }

    if (isPublished && ["true", "false"].includes(isPublished.trim())) {
      obj.isPublished = isPublished.trim() === "true";
      hasValidFilter = true;
    }

    if (!hasValidFilter && !authorId) {
      return res.status(400).send({
        status: false,
        msg: "Please provide at least one valid query parameter value..",
      });
    }

    const deletedData = await blogModel.updateMany(
      obj,
      { $set: { isDeleted: true, deletedAt: currentDate } },
      { new: true }
    );

    if (deletedData.matchedCount === 0) {
      return res.status(404).send({
        status: false,
        msg: "No blogs found or already deleted.",
      });
    }

    return res.status(200).send({
      status: true,
      msg: `${deletedData.modifiedCount} blog deleted successfully..`,
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const deleteBlogByQueryParams = async function (req, res) {
  try {
    if (valid.isValidReqBody(req.query)) {
      let { category, authorId, tags, subcategory, isPublished } = req.query;
      let obj = { isDeleted: false };
      let currentDate = new Date();

      if (authorId) {
        authorId = authorId.trim();
        if (!isValidObjectId(authorId)) {
          return res.status(400).send({ status: false, msg: "Please provide valid author id" });
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
        if (category && category.trim().length > 0) {
          obj.category = category.trim();
        }
        if (tags) {
          if (!Array.isArray(tags)) {
            tags = tags.split(",").map((elem) => elem.trim());
          }

          if (!valid.hasValidStringElem(tags)) {
            return res.status(400).send({
              status: false,
              msg: "tags must be a non-empty array of strings.",
            });
          }

          obj.tags = { $in: tags };
        }
        if (subcategory) {
          if (!Array.isArray(subcategory)) {
            subcategory = subcategory.split(",").map((elem) => elem.trim());
          }

          if (!valid.hasValidStringElem(subcategory)) {
            return res.status(400).send({
              status: false,
              msg: "subcategory must be a non-empty array of strings.",
            });
          }

          obj.subcategory = { $in: subcategory };
        }
        if (isPublished && ["true", "false"].includes(isPublished.trim())) {
          obj.isPublished = isPublished.trim() === "true";
        }

        if (Object.keys(obj).length === 1 && obj.isDeleted === false) {
          return res.status(400).send({
            status: false,
            msg: "Please provide at least one valid query parameter..",
          });
        }
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
        if (category && category.trim().length > 0) {
          obj.category = category.trim();
        }

        if (tags) {
          if (!Array.isArray(tags)) {
            tags = tags.split(",").map((elem) => elem.trim());
          }

          if (!valid.hasValidStringElem(tags)) {
            return res.status(400).send({
              status: false,
              msg: "tags must be a non-empty array of strings.",
            });
          }

          obj.tags = { $in: tags };
        }
        if (subcategory) {
          if (!Array.isArray(subcategory)) {
            subcategory = subcategory.split(",").map((elem) => elem.trim());
          }

          if (!valid.hasValidStringElem(subcategory)) {
            return res.status(400).send({
              status: false,
              msg: "subcategory must be a non-empty array of strings.",
            });
          }

          obj.subcategory = { $in: subcategory };
        }
        if (isPublished && ["true", "false"].includes(isPublished.trim())) {
          obj.isPublished = isPublished.trim() === "true";
        }
        if (Object.keys(obj).length === 1 && obj.isDeleted === false) {
          return res.status(400).send({
            status: false,
            msg: "Please provide at least one valid query parameter..",
          });
        }

        let dataFound = await blogModel.find(obj).select({ _id: 0, authorId: 1 });

        if (dataFound.length === 0) {
          return res.status(404).send({
            status: false,
            msg: "Either Deleted or No blog document exist with this query..",
          });
        }
        let count = 0;
        for (let i = 0; i < dataFound.length; i++) {
          if (dataFound[i].authorId.toString() ===  req.authorIdFromDecodedToken.toString()) {
            count++;
          }
        }
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
          msg: `${deletedData.modifiedCount} specific blog Data deleted`,
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
      let obj = { isDeleted: false };
      let currentDate = new Date();
      let hasValidFilter = false;

      if (category && category.trim().length > 0) {
        obj.category = category.trim();
        hasValidFilter = true;
      }

      if (tags && tags.trim().length > 0) {
        if (!Array.isArray(tags)) {
          tags = tags.split(",").map((elem) => elem.trim());
        }

        if (!valid.hasValidStringElem(tags)) {
          return res.status(400).send({
            status: false,
            msg: "tags must be a non-empty array of strings.",
          });
        }

        obj.tags = { $in: tags };
        hasValidFilter = true;
      }
      if (subcategory && subcategory.trim().length > 0) {
        if (!Array.isArray(subcategory)) {
          subcategory = subcategory.split(",").map((elem) => elem.trim());
        }

        if (!valid.hasValidStringElem(subcategory)) {
          return res.status(400).send({
            status: false,
            msg: "subcategory must be a non-empty array of strings.",
          });
        }

        obj.subcategory = { $in: subcategory };
        hasValidFilter = true;
      }
      if (isPublished && ["true", "false"].includes(isPublished.trim())) {
        obj.isPublished = isPublished.trim() === "true";
        hasValidFilter = true;
      }

      if (authorId && authorId.trim().length > 0) {
        authorId = authorId.trim();
        if (!isValidObjectId(authorId)) {
          return res.status(400).send({ status: false, msg: "Please enter valid author id" });
        }

        if (req.authorIdFromDecodedToken.toString() !== authorId) {
          return res.status(403).send({
            status: false,
            msg: "Unauthorised author, not allowed to delete other data..",
          });
        }
        obj.authorId = authorId;
        hasValidFilter = true;
      } else if (hasValidFilter) {
        obj.authorId = req.authorIdFromDecodedToken;
      }

      if (!hasValidFilter) {
        return res.status(400).send({
          status: false,
          msg: "Please provide atleast one valid query parameter value..",
        });
      }

      let deletedData = await blogModel.updateMany(
        obj,
        { $set: { isDeleted: true, deletedAt: currentDate } },
        { new: true }
      );

      if (deletedData.matchedCount === 0) {
        return res.status(404).send({
          status: false,
          msg: "Either deleted or No blog document exist with this query..",
        });
      }

      return res.status(200).send({
        status: true,
        msg: `${deletedData.modifiedCount} blog(s) deleted successfully.`,
        deleteCount: deletedData.modifiedCount,
      });
    } else {
      return res.status(400).send({ status: false, msg: "No Query found.." });
    }
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { createBlogs, getBlogData, updateBlogData, deleteBlogById, deleteBlogByQuery, deleteBlogByQueryParams,
  deleteBlogByQueryParamsAlternative };

const valid = require("../validation/validator");
const bookModel = require("../models/bookModel");
const { isValidObjectId } = require("mongoose");
const userModel = require("../models/userModel");
const reviewModel = require("../models/reviewModel");

const createBooks = async function (req, res) {
  try {
    if (!req.body || !valid.isValidReqBody(req.body)) {
      return res.status(400).send({
          status: false,
          msg: "Please provide data for book creation in req body..",
        });
    }
    let { title, excerpt, userId, ISBN, category, subcategory, releasedAt, isDeleted } = req.body;
    
    if (typeof userId === "string") {
      userId = userId.trim();
      req.body.userId = userId;
    }

    if (!valid.isValid(userId)) {
      return res.status(400).send({ status: false, msg: "Please provide user id..It's mandatory" });
    }
    if (!isValidObjectId(userId)) {
      return res.status(400).send({ status: false, msg: "Please provide valid user id .." });
    }
    let userExist = await userModel.findById(userId);
    if (!userExist) {
      return res.status(404).send({ status: false, msg: "User is not exist" });
    }
    //------------------------------------- Authorisation---------------------------------------------------------------
    if (userExist._id.toString() !== req.userIdFromDecodedToken.toString()) {
      return res.status(403).send({
        status: false,
        msg: "Authorization failed, user is not the owner of the book",
      });
    }

    if (!valid.isValid(title)) {
      return res.status(400).send({ status: false, msg: "Please enter title of book.." });
    }
    if (!valid.isValidBooktitle(title)) {
      return res.status(400).send({
          status: false,
          msg: "Book title should not be only numbers and invalid symbols and atleast one alphabet..",
        });
    }

    const bookTitleExist = await bookModel.findOne({ title: title });
    if (bookTitleExist) {
      return res.status(409).send({ status: false, msg: "Book title already exist" });
    }
    if (!valid.isValid(excerpt)) {
      return res.status(400).send({ status: false, msg: "Please provide book excerpt.." });
    }

    if (typeof excerpt !== "string") {
      return res.status(400).send({
          status: false,
          msg: "Please provide book excerpt in string format..",
        });
    }

    if (!valid.isValid(ISBN)) {
      return res.status(400).send({ status: false, msg: "Please provide book ISBN.." });
    }
    if (!valid.isValidISBN(ISBN)) {
      return res.status(400).send({
        status: false,
        msg: "Please provide book ISBN in proper format..",
      });
    }
    let isbnExist = await bookModel.findOne({ ISBN: ISBN });
    if (isbnExist) {
      return res.status(409).send({ status: false, msg: "ISBN already exist" });
    }
    if (!valid.isValid(category)) {
      return res.status(400).send({ status: false, msg: "Please provide book category.." });
    }
    if (typeof category !== "string") {
      return res.status(400).send({ status: false, msg: "category should be in string.." });
    }
    if (!valid.isValid(subcategory)) {
      return res.status(400).send({ status: false, msg: "Please provide book subcategory.." });
    }
    if (typeof subcategory !== "string") {
      return res.status(400).send({ status: false, msg: "subcategory must be in string format.." });
    }
    if (!valid.isValid(releasedAt)) {
      return res.status(400).send({
        status: false,
        msg: "Please provide released date of the book",
      });
    }
    if (!valid.validateDate(releasedAt)) {
      return res.status(400).send({
        status: false,
        msg: "Please provide released date in YYYY-mm-dd format..",
      });
    }

    if (isDeleted === true) {
      req.body.deletedAt = Date.now();
    }

    const bookCreation = await bookModel.create(req.body);
    return res.status(201).send({
        status: true,
        message: "Book created successfully..",
        data: bookCreation,
      });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const getBooksWithCriteria = async function (req, res) {
  try {
    const dataFromQuery = req.query;
    const allowedField = ["userId", "category", "subcategory"];
    for (let key of Object.keys(dataFromQuery)) {
      if (!allowedField.includes(key)) {
        return res.status(400).send({
            status: false,
            message: `${key} is not a valid query filter`,
          });
      }
    }
    let { userId, category, subcategory } = dataFromQuery;
    let obj = { isDeleted: false };
    if (userId) {
      userId = userId.trim();
      if (!isValidObjectId(userId)) {
        return res.status(400).send({
          status: false,
          message: "Please enter userId in proper format..",
        });
      }
      let userExist = await userModel.findById(userId);
      if (!userExist) {
        return res.status(404).send({ status: false, message: "User is not exist.." });
      }
      obj.userId = userId;
    }
    if (category) {
      // prtial match
      obj.category = { $regex: category.trim(), $options: "i" };
    }
    if (subcategory) {
      // exact match
      obj.subcategory = { $regex: `^${subcategory.trim()}$`, $options: "i" };
    }
    let getAllBooks = await bookModel.find(obj).select({
        _id: 1,
        title: 1,
        excerpt: 1,
        userId: 1,
        category: 1,
        releasedAt: 1,
        reviews: 1,
      }).sort({ title: 1 });

    if (getAllBooks.length === 0) {
      return res.status(404).send({ status: false, message: "No books found with this criteria" });
    } else {
      return res.status(200).send({ status: true, message: "Book List", data: getAllBooks });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const getBookById = async function (req, res) {
  try {
    let bookIdFromReq = req.params.bookId;
    if (!isValidObjectId(bookIdFromReq)) {
      return res.status(400).send({
          status: false,
          message: "Please provide valid book id in req params",
        });
    }
    let bookExist = await bookModel.findOne({ _id: bookIdFromReq, isDeleted: false }).select({ __v: 0 }).lean();
    if (!bookExist) {
      return res.status(404).send({ status: false, msg: "Book not found or already deleted." });
    }
    let reviewOfBook = await reviewModel
      .find({ bookId: bookIdFromReq, isDeleted: false })
      .select({ isDeleted: 0, __v: 0 })
      .sort({ reviewedAt: -1 })
      .lean();
    bookExist["reviewsData"] = reviewOfBook;

    return res.status(200).send({
        status: true,
        message: "Book Details fetched Successfully..",
        data: bookExist,
      });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const updateBookByid = async function (req, res) {
  try {
    let bookIdFromReq = req.params.bookId;
    let body = req.body;
    let { title, excerpt, ISBN, releasedAt } = body;

    if (!valid.isValidReqBody(body)) {
      return res.status(400).send({
          status: false,
          msg: "Please provide all field data that you want to update..",
        });
    }
    if (body.hasOwnProperty("title")) {
      if (!valid.isValid(title)) {
        return res.status(400).send({ status: false, msg: "Please enter title.." });
      }
      if (!valid.isValidBooktitle(title)) {
        return res.status(400).send({
            status: false,
            msg: "Book title should not be only numbers and invalid symbols and atleast one alphabet..",
          });
      }
      title = title.trim();
      let titleExist = await bookModel.findOne({ title: title });
      if (titleExist) {
        return res.status(409).send({
            status: false,
            msg: "Please enter different title as it is already present.",
          });
      }
      body.title = title;
    }
    if (body.hasOwnProperty("excerpt")) {
      if (!valid.isValid(excerpt)) {
        return res.status(400).send({ status: false, msg: "Please enter book excerpt.." });
      }
      if (typeof excerpt !== "string") {
        return res.status(400).send({
            status: false,
            msg: "Please provide book excerpt in string format..",
          });
      }
      body.excerpt = excerpt.trim();
    }
    if (body.hasOwnProperty("ISBN")) {
      if (!valid.isValid(ISBN)) {
        return res.status(400).send({ status: false, msg: "Please enter book ISBN.." });
      }
      if (!valid.isValidISBN(ISBN)) {
        return res.status(400).send({
            status: false,
            msg: "Please enter book ISBN in proper format..",
          });
      }
      ISBN = ISBN.trim();
      let ISBNalreadyExist = await bookModel.findOne({ ISBN: ISBN, _id: { $ne : bookIdFromReq } });
      if (ISBNalreadyExist) {
        return res.status(409).send({
            status: false,
            msg: "Please enter unique ISBN number as it is already present.",
          });
      }
      body.ISBN = ISBN;
    }
    if (body.hasOwnProperty("releasedAt")) {
      if (!valid.isValid(releasedAt)) {
        return res.status(400).send({
            status: false,
            msg: "Please enter release date of the book",
          });
      }
      if (!valid.validateDate(releasedAt)) {
        return res.status(400).send({
            status: false,
            msg: "Please enter the book release date in YYYY-MM-DD format..",
          });
      }
      body.releasedAt = releasedAt.trim();
    }
    let updatedData = await bookModel.findOneAndUpdate(
      { _id: bookIdFromReq, isDeleted: false },
      { $set: body },
      { new: true }
    );
    return res.status(200).send({
        status: true,
        message: "Book Data Updated..",
        data: updatedData,
      });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const deleteBookById = async function (req, res) {
  try {
    let bookIdFromReq = req.params.bookId;

    let deletedBookData = await bookModel.findOneAndUpdate(
      { _id: bookIdFromReq, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!deletedBookData) {
      return res.status(404).send({ status: false, message: "Book not found or already deleted." });
    }

    return res.status(200).send({
        status: true,
        message: "Deleted Successfully",
        data: deletedBookData,
      });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = { createBooks, getBooksWithCriteria, getBookById, updateBookByid, deleteBookById  };

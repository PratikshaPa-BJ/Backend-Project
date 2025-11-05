const { isValidObjectId } = require("mongoose");
const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const valid = require("../validation/validator");

const createReview = async function (req, res) {
  try {
    let bookid = req.params.bookId;
    let reqbody = req.body;
    let { reviewedBy, rating, review } = req.body;

    if (!isValidObjectId(bookid)) {
      return res.status(400).send({
          status: false,
          msg: "Please enter bookid in proper object id format.",
        });
    }
    let bookExist = await bookModel.findOne({ _id: bookid, isDeleted: false });
    if (!bookExist) {
      return res.status(404).send({ status: false, msg: "Book not found or already deleted.. " });
    }

    if (!valid.isValidReqBody(reqbody)) {
      return res.status(400).send({
          status: false,
          msg: "Please provide review details in request body..",
        });
    }
    reqbody.bookId = bookid;
    if (reqbody.hasOwnProperty("reviewedBy")) {
      if (!valid.isValid(reviewedBy)) {
        return res.status(400).send({ status: false, msg: "Please enter reviewer's name.." });
      }
      if (!valid.isValidName(reviewedBy)) {
        return res.status(400).send({
            status: false,
            msg: "reviewer's name should be string format and alphabets only..",
          });
      }
      reqbody.reviewedBy = reviewedBy.trim();
    } else {
      reqbody.reviewedBy = "Guest";
    }
    if (!valid.isValid(rating)) {
      return res.status(400).send({ status: false, msg: "Please give rating..it's mandatory.." });
    }
    rating = Number(rating);

    if (isNaN(rating)) {
      return res.status(400).send({ status: false, msg: "rating should be a number.." });
    }
    if (rating > 5 || rating < 1) {
      return res.status(400).send({ status: false, msg: "Please give rating between 1 to 5" });
    }
    reqbody.rating = rating;
    if (reqbody.hasOwnProperty("review")) {
      if (typeof review !== "string" || !valid.isValid(review)) {
        return res.status(400).send({ status: false, msg: "review should be non empty string.." });
      }
      reqbody.review = review.trim();
    }
    reqbody.reviewedAt = new Date();

    let createReview = await reviewModel.create(reqbody);

    let updateBookData = await bookModel
      .findByIdAndUpdate(
        { _id: bookid },
        { $inc: { reviews: 1 } },
        { new: true }
      )
      .lean();
    updateBookData["reviewDetails"] = createReview;

    return res.status(201).send({
        status: true,
        msg: "Review added successfully.",
        data: updateBookData,
      });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const updateReview = async function (req, res) {
  try {
    let bookidFromReq = req.params.bookId;
    let reviewIdFromReq = req.params.reviewId;

    if (!isValidObjectId(bookidFromReq)) {
      return res.status(400).send({
          status: false,
          msg: "Please enter bookid in proper object id format.",
        });
    }
    let bookExist = await bookModel.findOne({
      _id: bookidFromReq,
      isDeleted: false,
    });
    if (!bookExist) {
      return res.status(404).send({ status: false, msg: "Book not found or already deleted.. " });
    }
    if (!isValidObjectId(reviewIdFromReq)) {
      return res.status(400).send({
          status: false,
          msg: "Please enter review id in proper object id format.",
        });
    }
    let reviewExist = await reviewModel.findOne({
      _id: reviewIdFromReq,
      bookId: bookidFromReq,
      isDeleted: false,
    });
    if (!reviewExist) {
      return res.status(404).send({ status: false, msg: "review not found or already deleted.. " });
    }
    let reqBody = req.body;
    let { review, rating, reviewedBy } = reqBody;

    if (!valid.isValidReqBody(reqBody)) {
      return res.status(400).send({
          status: false,
          msg: "Please enter details in req body for updating review",
        });
    }
    if (reqBody.hasOwnProperty("reviewedBy")) {
      if (!valid.isValid(reviewedBy)) {
        return res.status(400).send({ status: false, msg: "Please enter name of the reviewer.." });
      }
      if (!valid.isValidName(reviewedBy)) {
        return res.status(400).send({
            status: false,
            msg: "enter reviewer's name in alphabets only..",
          });
      }
      reqBody.reviewedBy = reviewedBy.trim();
    }
    if (reqBody.hasOwnProperty("rating")) {
      if (!valid.isValid(rating)) {
        return res.status(400).send({ status: false, msg: "Please give rating..it's mandatory.." });
      }
      rating = Number(rating);

      if (isNaN(rating)) {
        return res.status(400).send({ status: false, msg: "rating should be a number.." });
      }
      if (rating > 5 || rating < 1) {
        return res.status(400).send({ status: false, msg: "Please give rating between 1 to 5" });
      }
      reqBody.rating = rating;
    }
    if (reqBody.hasOwnProperty("review")) {
      if (typeof review !== "string" || !valid.isValid(review)) {
        return res.status(400).send({ status: false, msg: "review should be non empty string.." });
      }
      reqBody.review = review.trim();
    }
    reqBody.reviewedAt = new Date();
    let updatedDetails = await reviewModel.findOneAndUpdate(
      { _id: reviewIdFromReq, bookId: bookidFromReq, isDeleted: false },
      reqBody,
      { new: true }
    );
    let allBookDetails = bookExist.toObject({ versionKey: false });
    let reviewAll = await reviewModel
      .find({ bookId: bookidFromReq, isDeleted: false })
      .select({ __v: 0, isDeleted: 0 })
      .sort({ reviewedAt: -1 });
    allBookDetails["reviewsData"] = reviewAll;

    return res.status(200).send({
        status: true,
        message: "Review Updated successfully",
        data: allBookDetails,
      });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const deleteReview = async function (req, res) {
  try {
    let bookidFromReq = req.params.bookId;
    let reviewIdFromReq = req.params.reviewId;
    if (!isValidObjectId(bookidFromReq)) {
      return res.status(400).send({
          status: false,
          msg: "Please enter bookid in proper object id format.",
        });
    }
    let bookExist = await bookModel
      .findOne({ _id: bookidFromReq, isDeleted: false }).lean();
    if (!bookExist) {
      return res.status(404).send({ status: false, msg: "Book not found or already deleted.. " });
    }
    if (!isValidObjectId(reviewIdFromReq)) {
      return res.status(400).send({
          status: false,
          msg: "Please enter review id in proper object id format.",
        });
    }
    let reviewExist = await reviewModel.findOne({
      _id: reviewIdFromReq,
      bookId: bookidFromReq,
      isDeleted: false,
    });
    if (!reviewExist) {
      return res.status(404).send({ status: false, msg: "review not found or already deleted.. " });
    }

    await reviewModel.findOneAndUpdate(
      { _id: reviewIdFromReq, isDeleted: false },
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );

    let updatedBookDetails =
      bookExist.reviews > 0 ? await bookModel.findOneAndUpdate(
              { _id: bookidFromReq },
              { $inc: { reviews: -1 } },
              { new: true }
            ).lean()
        : bookExist;

    return res.status(200).send({
        status: true,
        msg: "Review Deleted Successfully..",
        data: { Book: updatedBookDetails, deletedReviewId: reviewIdFromReq },
      });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = { createReview, updateReview, deleteReview };

const valid = require("../validation/validator");
const bookModel = require("../models/bookModel");
const { isValidObjectId } = require("mongoose");
const userModel = require("../models/userModel");
const reviewModel = require("../models/reviewModel");

const createBooks = async function (req, res) {
  try {
    let { title, excerpt, userId, ISBN, category, subcategory, releasedAt, isDeleted } = req.body;

    if (!valid.isValidReqBody(req.body)) {
      return res.status(400).send({ status: false, msg: "Please provide data in req body.." });
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
    // Authorisation
    if(userExist._id.toString() !== req.userIdFromDecodedToken){
      return res.status(403).send({
          status: false,
          msg: "Authorization failed, user is not the owner of the book",
        });
    }
    if (!valid.isValid(title)) {
      return res.status(400).send({ status: false, msg: "Please enter title of book.." });
    }
    const bookTitleExist = await bookModel.findOne({ title: title });
    if (bookTitleExist) {
      return res.status(409).send({ status: false, msg: "Book title already exist" });
    }
    if (!valid.isValid(excerpt)) {
      return res.status(400).send({ status: false, msg: "Please provide book excerpt.." });
    }

    if (typeof excerpt !== "string") {
      return res.status(400).send({status: false, msg: "Please provide book excerpt in string format.."});
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
    if (!valid.isValid(subcategory)) {
      return res.status(400).send({ status: false, msg: "Please provide book subcategory.." });
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
    return res.status(201).send({ status: true, message: "Book created successfully..", data: bookCreation});
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const getBooksWithCriteria = async function (req, res) {
  try {
    if (valid.isValidReqBody(req.query)) {
      const allowedField = [ "userId", "category", "subcategory"];
      for(let key of Object.keys(req.query)){
        if(!allowedField.includes(key)){
          return res.status(400).send({ status: false, message: `${key} is not a valid query filter`});

        }
      }
      let { userId, category, subcategory } = req.query;
      let obj = {};
      if (userId) {
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
        obj.userId = userId
      }
        if(category){
        obj.category = category.trim()
        }
      if(subcategory){
        obj.subcategory = subcategory.trim()
      }
      obj.isDeleted = false
      let getAllBooks = await bookModel.find(obj)
      .select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1}).sort({ title: 1 });
      if(getAllBooks.length === 0){
        return res.status(404).send({ status: false, message: "No books found with this criteria" });
      }
      else{
        return res.status(200).send({ status: true, message: "Book List", data:getAllBooks });
      }
    } else {
      let allBooks = await bookModel.find({ isDeleted: false })
        .select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1});

      if (allBooks.length === 0) {
        return res.status(404).send({
            status: false,
            message: "No books exist with this criteria",
          });
      } else {
        return res.status(200).send({ status: true, message: "Books List", data: allBooks });
      }
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const getBookById = async function(req, res){
  try{
    let bookIdFromReq = req.params.bookId;
    if(!isValidObjectId(bookIdFromReq)) {
      return res.status(400).send({ status: false, message: "Please provide valid book id in req params"});
    }
    let bookExist = await bookModel.findOne({ _id: bookIdFromReq, isDeleted: false }).select({ __v: 0 });
    if(!bookExist) {
      return res.status(404).send({ status: false, msg: "Book not found or already deleted."})
    }
    let reviewOfBook = await reviewModel.find({ bookId: bookIdFromReq, isDeleted: false }).select({ isDeleted: 0, __v:0 });
    let bookListWithReview = bookExist.toObject()
    bookListWithReview['reviewsData'] = reviewOfBook;

    return res.status(200).send({ status: true, message: "Book Details fetched Successfully..", data: bookListWithReview })

  }catch(err){
    return res.status(500).send({ status: false, msg: err.message })
  }
}

const updateBookByid = async function(req, res){
  try{
    let bookIdFromReq = req.params.bookId;
    let body = req.body;
    let { title, excerpt, ISBN, releasedAt } = body;

    if (!valid.isValidReqBody(body)) {
      return res.status(400).send({ status: false, msg: "Please provide all field data that you want to update.." });
    }
    if(body.hasOwnProperty('title')){
      if(!valid.isValid(title)){
        return res.status(400).send({ status: false, msg: "Please enter title.."})
      }
      let titleExist = await bookModel.findOne({ title: title });
      if(titleExist){
          return res.status(409).send({ status: false, msg: "Please enter different title as it is already present."})
      } 
    }
    if(body.hasOwnProperty('excerpt')){
      if(!valid.isValid(excerpt)){
        return res.status(400).send({ status: false, msg: "Please enter book excerpt.."})
      }
    }
    if(body.hasOwnProperty('ISBN')){
      if(!valid.isValid(ISBN)){
        return res.status(400).send({ status: false, msg: "Please enter book ISBN.."})
      }
      if(!valid.isValidISBN(ISBN)){
        return res.status(400).send({ status: false, msg: "Please enter book ISBN in proper format.."})
      }

      let ISBNalreadyExist = await bookModel.findOne({ ISBN: ISBN });
      if(ISBNalreadyExist){
        return res.status(409).send({ status: false, msg: "Please enter unique ISBN number as it is already present."})
      }
    }
    if(body.hasOwnProperty('releasedAt')){
     if(!valid.isValid(releasedAt)){
        return res.status(400).send({ status: false, msg: "Please enter release date of the book"})
      }
      if(!valid.validateDate(releasedAt)){
        return res.status(400).send({ status: false, msg: "Please enter the book release date in proper format.."})

      }
    }
    let updatedData = await bookModel.findOneAndUpdate(
      { _id: bookIdFromReq, isDeleted: false}, 
      { $set: body }, { new: true }
    )
    return res.status(200).send({ status: true, message: "Book Data Updated..", data: updatedData })

  }catch(err){
    res.status(500).send({ status: false, msg: err.message })
  }
}

const deleteBookById = async function(req, res){
  try{
    let bookIdFromReq = req.params.bookId;
    
    let deletedBookData = await bookModel.findOneAndUpdate(
      { _id: bookIdFromReq, isDeleted: false }, 
      { isDeleted: true, deletedAt: new Date()} , 
      { new: true });    
    
    if(!deletedBookData) {
      return res.status(404).send({ status: false, message: "Book not found or already deleted."})
  }

    return res.status(200).send({ status: true, message: "Deleted Successfully", data: deletedBookData })

  }catch(err){
    return res.status(500).send( { status: false, msg: err.message })
  }

}

module.exports = { createBooks, getBooksWithCriteria, getBookById, updateBookByid , deleteBookById };

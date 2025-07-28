const bookModel = require("../models/bookModel");
const publisherModel = require("../models/publisherModel");
const authorModel = require("../models/authorModel");
const mongoose = require("mongoose");

const createBook = async function (req, res) {
  let body = req.body;
  // Destructuring
  // let {name, author} = body;
  // console.log(name);
  // console.log(author);
  
  let authorId = body.author;
  let publisherId = body.publisher;

  if (!authorId || !publisherId) {
    return res.send({ msg: "AuthorId or publisherId is required.." });
  } else if (
    mongoose.isValidObjectId(authorId) &&
    mongoose.isValidObjectId(publisherId) &&
    (await authorModel.findOne({ _id: authorId })) &&
    (await publisherModel.findOne({ _id: publisherId }))
  ) {
    let createBooks = await bookModel.create(body);
    return res.send({ data: createBooks });
  } else {
    res.send({ msg: "Please Provide valid ObjectId" });
  }
};

const getAllBooks = async function (req, res) {

  let allBooks = await bookModel.find();
  res.send({ data: allBooks });
};
const getBookWithAllDetails = async function (req, res) {
  let bookDetails = await bookModel
    .find()
    .populate("author")
    .populate("publisher");
  res.send({ data: bookDetails });
};

const updateCoverDetails = async function (req, res) {
  let books = await bookModel.find().populate("author").populate("publisher");
  books.forEach((x) => {
    if (
      x.publisher.name === "Penguin" ||
      x.publisher.name === "HarperCollins"
    ) {
      x.isHardCover = true;
    }
  });
  // alternative

  // let collection1 = books.filter((x=> x.publisher.name === 'Penguin'));
  // let collection2 = books.filter((y=> y.publisher.name === 'HarperCollins'))

  // let final = [ ...collection1, ...collection2 ];
  // console.log(final);
  // final.forEach((x)=> x.isHardCover = true);
  
  res.send({ data: books });
};

const getBookByPrice = async function (req, res) {
  let allBook = await bookModel.find().populate("author").populate("publisher");
  allBook.forEach((x) => {
    if (x.author.rating > 3.5) {
      x.price += 10;
    }
  });
  res.send({ data: allBook });
};

module.exports.createBooks = createBook;
module.exports.getBooks = getAllBooks;
module.exports.getBooksWithDetails = getBookWithAllDetails;
module.exports.updateCoverDetail = updateCoverDetails;
module.exports.updateBookByPrice = getBookByPrice;

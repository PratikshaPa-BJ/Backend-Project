const bookModel = require("../models/bookModel");
const publisherModel = require("../models/publisherModel");
const authorModel = require("../models/authorModel");
const mongoose = require("mongoose");

const createBook = async function (req, res) {
  let body = req.body;
  // Destructuring
  let { publisher, author } = body;
  console.log(publisher);
  console.log(author);

  if (!author || !publisher) {
    return res.send({ msg: "AuthorId or publisherId is required.." });
  } else if (
    mongoose.isValidObjectId(author) &&
    mongoose.isValidObjectId(publisher) &&
    (await authorModel.findOne({ _id: author })) &&
    (await publisherModel.findOne({ _id: publisher }))
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

const updateCoverWithoutPopulate = async function (req, res) {
  let specificPublisherId = await publisherModel
    .find({ name: { $in: ["Penguin", "HarperCollins"] } })
    .select({ _id: 1 });
  let arrOfPublisherId = specificPublisherId.map((publisher) => publisher._id);

  let result = await bookModel.updateMany(
    { publisher: { $in: arrOfPublisherId } },
    { $set: { isHardCover: true } }
  );

  res.send({ updatedCoverDeyails: result });
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
const updateBookPriceWithoutPopulate = async function (req, res) {
  let specificAuthorId = await authorModel
    .find({ rating: { $gt: 3.5 } })
    .select({ _id: 1 });

  let arrOfAuthorId = specificAuthorId.map((author) => author._id);

  let result = await bookModel.updateMany(
    { author: { $in: arrOfAuthorId } },
    { $inc: { price: 10 } }
  );
  // let result1 = await bookModel.updateMany({ author: { $in: arrOfAuthorId } }, [
  //   { $set: { price: { $add: ["$price", 10] } } },
  // ]);

  res.send({ updatedPriceBook: result });
};

module.exports.createBooks = createBook;
module.exports.getBooks = getAllBooks;
module.exports.getBooksWithDetails = getBookWithAllDetails;
module.exports.updateCoverDetail = updateCoverDetails;
module.exports.updateBookByPrice = getBookByPrice;
module.exports.updateCoverWithoutPopulate = updateCoverWithoutPopulate;
module.exports.updateBookPriceWithoutPopulate = updateBookPriceWithoutPopulate;

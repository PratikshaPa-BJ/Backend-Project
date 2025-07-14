const bookModel = require("../models/bookModel");
const createBook = async function (req, res) {
  let body = req.body;
  let savedData = await bookModel.create(body);

  res.send({ data: savedData });
};

const getBookList = async function (req, res) {
  let getBooks = await bookModel
    .find()
    .select({ bookName: 1, authorName: 1, _id: 0 });
  res.send({ data: getBooks });
};

const getBooksInYear = async function (req, res) {
  let yearFromReq = req.body.year;
  let booksSpecificYear = await bookModel.find({ year: yearFromReq });

  res.send({ data: booksSpecificYear });
};
const getParticularBook = async function (req, res) {
  let body = req.body;
  let getBookDetails = await bookModel.find(body);

  res.send({ data: getBookDetails });
};

const getSpecificPriceBooks = async function (req, res) {
  let getBooksWithSpecificPrice = await bookModel.find({
    "price.indianPrice": { $in: ["100INR", "200INR", "500INR"] },
  });

  res.send({ data: getBooksWithSpecificPrice });
};
const getRandomBooks = async function (req, res) {
  let getBooks = await bookModel.find({
    $or: [{ stockAvailable: { $eq: true } }, { totalPages: { $gt: 500 } }],
  });
  res.send({ data: getBooks });
};

module.exports.createBooks = createBook;
module.exports.getBooks = getBookList;
module.exports.getBooksSpecificYear = getBooksInYear;
module.exports.getSpecificBooks = getParticularBook;
module.exports.getSpecificPriceBook = getSpecificPriceBooks;

module.exports.getRandomBook = getRandomBooks;

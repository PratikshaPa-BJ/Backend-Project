const authorModel = require("../models/authorModel");
const bookModel = require("../models/bookModel");

const createAuthor = async function (req, res) {
  let body = req.body;
  let authorData = await authorModel.create(body);
  res.send({ data: authorData });
};
const createbook = async function (req, res) {
  let body = req.body;
  let savedData = await bookModel.create(body);
  res.send({ data: savedData });
};
const getBooks = async function (req, res) {
  let getAllBook = await bookModel.find().populate("author");
  res.send({ allBook: getAllBook });
};

module.exports.createAuthor = createAuthor;
module.exports.createBook = createbook;
module.exports.getAllBook = getBooks;

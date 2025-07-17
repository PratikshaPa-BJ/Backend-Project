const bookModel = require("../models/bookModel");

const createbook = async function (req, res) {
  let body = req.body;
  let savedData = await bookModel.create(body);
  res.send({ data: savedData });
};
const getBooks = async function (req, res) {
  let allBooks = await bookModel.find({ authorName: "Chetan Bhagatt" });
  if (allBooks.length > 0) {
    res.send({ data: allBooks });
  } else {
    res.send({ msg: "No data found" });
  }
};

const updateBook = async function (req, res) {
  let body = req.body;
  // let updatedBooks = await bookModel.updateMany(
  //   { authorName:"Chetan Bhagat" } , { $set: body }
  // );

  let updatedBook = await bookModel.findOneAndUpdate(
    { authorName: "Chetan Bhagatt" },
    { $set: body },
    { new: true, upsert: true }
  );

  res.send({ data: updatedBook });
};

const deleteBook = async function (req, res) {
  // await bookModel.deleteOne({authorName: "Pratiksha"})

  let deleteBook = await bookModel.updateMany(
    { authorName: "Pratiksha" },
    { $set: { isDeleted: true } },
    { new: true }
  );

  res.send({ deleteBook });
};

module.exports.createBook = createbook;
module.exports.getBookDetails = getBooks;
module.exports.updateBooks = updateBook;
module.exports.deleteBooks = deleteBook;

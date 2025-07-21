const authorModel = require("../models/authorModel");
const bookModel = require("../models/bookModel");

const createAuthor = async function (req, res) {
  let body = req.body;
  if (!body.author_id) {
    return res.send({ msg: "Author Id is required.." });
  }
  let authorData = await authorModel.create(body);
  res.send({ data: authorData });
};
const createbook = async function (req, res) {
  let body = req.body;
  if (!body.author_id) {
    return res.send({ msg: "Author Id is required.." });
  }
  let savedData = await bookModel.create(body);
  res.send({ data: savedData });
};

const getSpecificAuthorBooks = async function (req, res) {
  let data = await authorModel
    .find({ author_name: "Chetan Bhagat" })
    .select({ _id: 0, author_id: 1 });
  let authorId = data[0].author_id;
  //  console.log(data[0].author_id);
  let data1 = await bookModel
    .find({ author_id: authorId })
    .select({ bookName: 1, _id: 0 });
    // console.log(data1);
  let data2 = data1.map((x) => x.bookName);
  res.send({ allBook: data2 });
};

const updateBook = async function (req, res) {
  let author = await bookModel
    .findOneAndUpdate(
      { bookName: "Two States" },
      { $set: { price: 100 } },
      { new: true }
    )
    .select({ author_id: 1, _id: 0, price: 1 });
  // console.log(authorId);

  let authorName = await authorModel
    .find({ author_id: author.author_id })
    .select({ author_name: 1, _id: 0 });
  // console.log(authorName);

  res.send({ data: authorName, updatedPrice: author.price });
};

const getBookBasedonPrice = async function (req, res) {
  let book = await bookModel
    .find({ price: { $gte: 500, $lte: 1000 } })
    .select({ author_id: 1, _id: 0, bookName: 1 });
  // console.log(book);
  let bookList = book.map((x) => x.bookName);

  let allId = book.map((x) => x.author_id);
  // console.log(allId);
  let author = await authorModel.find({ author_id: { $in: allId } });
  // console.log(author);

  // let authorList = author.map((x) => x.author_name);

  book.forEach((x) => {
    const author1 = author.find((y) => x.author_id === y.author_id);
    //  console.log(author1);

    x.author_id = author1.author_name;
  });
  // change author_id key with authorName
  let book1 = book.map((item) => {
    return {
      bookName: item.bookName,
      authorName: item.author_id,
    };
  });
  res.send({ bookListWithAuthor: book1 });
  // res.send({ authorName: authorList, Books: bookList });
};

module.exports.createBook = createbook;
module.exports.createAuthor = createAuthor;
module.exports.getSpecificAuthorBook = getSpecificAuthorBooks;
module.exports.updateBooks = updateBook;
module.exports.getBookBasedonPrice = getBookBasedonPrice;

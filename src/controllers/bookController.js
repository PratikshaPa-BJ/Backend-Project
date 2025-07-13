const bookModel = require("../models/bookModel");

const createBook = async function (req, res) {
  let body = req.body;
  let savedData = await bookModel.create(body);
  res.send({ msg: savedData });
};
const getBooks = async function (req, res) {
  let getAllBookDetails = await bookModel.find();
  // let getTotalBooks = await bookModel.find().estimatedDocumentCount();
  res.send({ data: getAllBookDetails });
};

const getSpecificBookDetails = async function (req, res) {
  let getBooksCount = await bookModel
    .find({ authorName: "Ruskin Bond", sales: 10 })
     .countDocuments();

  let getSpecificBooks = await bookModel.find({
    authorName: "Ruskin Bond",
    sales: 27,
    isPublished: true,
  });

  let matchAnySpecificCondition = await bookModel.find({
    $or: [
      { authorName: "Ruskin Bond", isPublished: false },
      { sales: 27 },
      { isPublished: false },
    ],
  });
  // .countDocuments();

  let matchAnyCondition = await bookModel
    .find({
      $or: [
        { authorName: "Ruskin Bond", isPublished: false },
        { sales: 27 },
        { isPublished: false },
      ],
    })
    .select({ bookName: 1, authorName: 1, _id: 0 });

  let sortBooks = await bookModel
    .find()
    .sort({ year: -1 })
    .select({ bookName: 1, authorName: 1, year: 1, sales: 1 });

  let getBook = await bookModel
    .find()
    .sort({ sales: -1 })
    .skip(3)
    .limit(3)
    .select({ bookName: 1, authorName: 1, sales: 1 });

  let getBooksUsingEQOperator = await bookModel.find({ sales: { $eq: 15 } });
  let getBooksUsingNEOperator = await bookModel.find({ sales: { $ne: 27 } });

  let getBooksUsingGTOperator = await bookModel.find({ sales: { $gt: 15 } });
  let getBooksUsingLTOperator = await bookModel.find({ sales: { $lt: 15 } });
  let getBooksUsingLTEOperator = await bookModel.find({ sales: { $lte: 15 } });
  let getBooksUsingGTEOperator = await bookModel.find({ sales: { $gte: 15 } });
  let getBooksUsingOROperator = await bookModel.find({
    $or: [{ sales: { $eq: 15 } }, { sales: { $eq: 17 } }],
  });
  let getBooksUsingINOperator = await bookModel.find({
    sales: { $in: [15, 17, 27] },
  });
  let getBooksUsingNINOperator = await bookModel
    .find({ sales: { $nin: [15, 17, 27] } })
    .select({ bookName: 1, sales: 1 });

  // find all books which publish year is between 1990 to 2020
  let getBooksUsingAndOperator = await bookModel.find({
    $and: [{ year: { $gt: 1990 } }, { year: { $lt: 2020 } }],
  });
  let getBooksUsingOperator = await bookModel.find({
    year: { $gt: 1990, $lt: 2020 },
  });
  let getBooksUsingId = await bookModel.findById("686f5c6508f4b30ddf4dc3b3");
  // let getBooksUsingId = await bookModel.find();
  let getBooksUsingRegex = await bookModel.find({ bookName: /^The/ });
  let getBooksUsingRegex1 = await bookModel.find({ bookName: /e$/i });
  let getBooksUsingRegex2 = await bookModel.find({ bookName: /.*on.*/i });

  res.send({ data: getBooksUsingRegex2 });
};

// if sale>17, then book will publish
const getAllUpdatedBooks = async function (req, res) {
  let allBooks = await bookModel.updateMany(
    { sales: { $gt: 17 } },
    { $set: { isPublished: true } }
  );
  res.send({ data: allBooks });
};

module.exports.createBook = createBook;
module.exports.getAllBooks = getBooks;
module.exports.getSpecificBookDetails = getSpecificBookDetails;
module.exports.getAllUpdatedBooks = getAllUpdatedBooks;

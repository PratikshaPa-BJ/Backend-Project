const bookModel = require('../models/bookModel');

const createBook = async function(req, res){
  let body = req.body;
  let savedData = await bookModel.create(body);
  res.send( {msg:savedData } );

}
const getBooks = async function(req,res){
  let getAllBookDetails = await bookModel.find();
  res.send({ data:getAllBookDetails })
}

module.exports.createBook = createBook;
module.exports.getAllBooks = getBooks;
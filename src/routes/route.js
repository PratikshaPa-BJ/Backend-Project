const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const authorController = require("../controllers/authorController");
const publisherController = require("../controllers/publisherController");

 router.post("/createAuthor", authorController.createAuthor);
 router.post("/createPublisher", publisherController.createPublishers);
 router.post("/createBook", bookController.createBooks);
 router.get("/getBooks", bookController.getBooks );
 router.get('/getBookDetails', bookController.getBooksWithDetails );
 router.put('/updateCoverDetails', bookController.updateCoverDetail);
 router.put('/updateCover', bookController.updateCoverWithoutPopulate)
 router.put('/getBookByPrice', bookController.updateBookByPrice );
 router.put('/updateBookPrice', bookController.updateBookPriceWithoutPopulate)

module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const reviewController = require("../controllers/reviewController");
const mw = require("../middleware/auth")

router.post("/register", userController.createUser);
router.post("/login", userController.userLogin);

router.post('/books', mw.authentication, bookController.createBooks);
router.get('/books', mw.authentication, bookController.getBooksWithCriteria);
router.get('/books/:bookId',mw.authentication, bookController.getBookById);
router.put('/books/:bookId', mw.authentication, mw.authorisation, bookController.updateBookByid );
router.delete('/books/:bookId',mw.authentication, mw.authorisation, bookController.deleteBookById);

router.post('/books/:bookId/review', reviewController.createReview );
router.put('/books/:bookId/review/:reviewId', reviewController.updateReview );
router.delete('/books/:bookId/review/:reviewId', reviewController.deleteReview );




module.exports = router;

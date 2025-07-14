const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.post("/createBook", bookController.createBooks);
router.get("/getBooks", bookController.getBooks);
router.post("/getBooksInYear", bookController.getBooksSpecificYear);
router.post("/getParticularBooks", bookController.getSpecificBooks);
router.get("/getXINRBooks", bookController.getSpecificPriceBook);
router.get("/getRandomBooks", bookController.getRandomBook);

module.exports = router;

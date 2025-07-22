const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.post("/createAuthor", bookController.createAuthor);
router.post("/createbook", bookController.createBook);
router.get("/getBooks", bookController.getAllBook);

module.exports = router;

const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const moment = require("moment");

router.post("/createAuthor", bookController.createAuthor );
router.post("/createbook", bookController.createBook );
router.get("/getSpecificBook", bookController.getSpecificAuthorBook );
router.post("/updateBook", bookController.updateBooks );
router.get("/getBookwithinPrice", bookController.getBookBasedonPrice );

module.exports = router;

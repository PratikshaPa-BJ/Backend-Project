const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController.js");

router.post( "/createBook", bookController.createBook );

router.get("/getBookDetails", bookController.getAllBooks );

router.get("/getSpecificBooks", bookController.getSpecificBookDetails  );

router.get('/getUpdatedBooks', bookController.getAllUpdatedBooks   );

module.exports = router;

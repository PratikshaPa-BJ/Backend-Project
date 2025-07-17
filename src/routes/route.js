const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const moment = require("moment");

router.post("/createbook", bookController.createBook);
router.get("/getbooks", bookController.getBookDetails);
router.post("/updateBook", bookController.updateBooks);

router.post("/deleteBook", bookController.deleteBooks);

router.get("/dateManipulations", function (req, res) {
  const today = moment();
  console.log(today.format("DD- MM -YYYY"));
  let validOrNot = moment("15-03-1992", "MM-DD-YYYY").isValid();
  console.log(validOrNot);

  let month = moment("February", "MMMM").isValid();
  console.log(month);
  let validOrNot1 = moment("15-03-2016", []).isValid();
  console.log(validOrNot1);

  let x = today.add(10, "days");
  console.log(x);

  let y = moment("2025-07-29", "YYYY-MM-DD").fromNow();
  console.log(y);

  const dateA = moment("01-01-1900", "DD-MM-YYYY");
  const dateB = moment("01-01-2000", "DD-MM-YYYY");
  console.log(dateA.from(dateB));

  const dateC = moment("2024-11-11");
  const dateD = moment("2024-10-11");
  console.log("Difference is ", dateC.diff(dateD), "milliseconds");

  console.log(moment([2024]).isLeapYear());

  res.send({ msg: " Done " });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const commonMW = require("../middleware/commonMiddleware");

router.post("/createUser", commonMW.mid2, userController.createUsers);
router.get(
  "/basicRoute",
  commonMW.mid1,
  commonMW.mid2,
  commonMW.mid3,
  userController.basicCode
);

router.get("/test-me", userController.basicRoute, commonMW.mid3, commonMW.globalMid, function (req, res) {
  res.send("Ending req res cycle");
});
 
router.get('/dummy1', commonMW.myMiddleware , userController.dummyOne );
router.get('/dummy2', userController.dummyTwo )

module.exports = router;

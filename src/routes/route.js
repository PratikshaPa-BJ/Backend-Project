const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const commonMW = require("../middleware/commonMiddleware");

router.get("/basicRoute", commonMW.mid1, commonMW.mid2, commonMW.mid3, userController.basicCode);
router.get("/test-me", userController.basicRoute);

module.exports = router;

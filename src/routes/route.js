const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const commonMW = require("../middleware/auth");

router.post("/users", userController.registerUser);
router.post('/login', userController.userLogin);
router.get('/users/:userId', commonMW.tokenValidation, commonMW.authorization, userController.getUserProfileData);
router.put('/users/:userId', commonMW.tokenValidation, commonMW.authorization, userController.updateUserData);
router.post('/users/:userId/posts', commonMW.tokenValidation,commonMW.authorization, userController.postMessage)
router.delete('/users/:userId', commonMW.tokenValidation, commonMW.authorization, userController.deleteUserData);


module.exports = router;

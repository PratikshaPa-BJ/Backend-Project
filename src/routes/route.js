const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const commonMW = require("../middleware/auth");

router.post("/users", userController.registerUser);
router.post('/login', userController.userLogin);
router.get('/users/:userId',commonMW.tokenValidation, userController.getUserProfileData);
router.put('/users/:userId',commonMW.tokenValidation, userController.updateUserData);
router.delete('/users/:userId',commonMW.tokenValidation, userController.deleteUserData);



module.exports = router;

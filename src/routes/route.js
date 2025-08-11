const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");
const commonMW = require("../middleware/commonMiddleware");

router.post("/createProduct", productController.createProducts);
router.get("/getProducts", productController.getAllProduct);
router.post("/createUser", commonMW.orderValidation, userController.createUsers);
router.get("/getUser", userController.getAllUser);
router.post("/createOrder", commonMW.orderValidation, orderController.createOrders);

module.exports = router;

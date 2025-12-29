const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
 const cartController = require("../controllers/cartController");
 const productController = require("../controllers/productController");
 const orderController = require("../controllers/orderController")
const mw = require("../middleware/auth")

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/user/:userId/profile", mw.authentication,mw.authorisation,  userController.userProfileDetails);
router.put("/user/:userId/profile", mw.authentication, mw.authorisation, userController.updateUserDetails);

router.post("/products", productController.createProducts);
router.get("/products", productController.getAllProducts);
router.get("/products/:productId", productController.getProductsById)
router.put("/products/:productId", productController.updateProduct);
router.delete("/products/:productId", productController.deleteProduct);

router.post("/users/:userId/cart", mw.authentication, mw.authorisation, cartController.createCart);
router.put("/users/:userId/cart", mw.authentication, mw.authorisation, cartController.updateCart);
router.get("/users/:userId/cart", mw.authentication, mw.authorisation, cartController.viewCart);
router.delete("/users/:userId/cart", mw.authentication, mw.authorisation, cartController.deleteCart);

router.post("/users/:userId/order", mw.authentication, mw.authorisation, orderController.createOrder);
router.put("/users/:userId/order", mw.authentication, mw.authorisation, orderController.updateOrder);









router.all(/.*/, (req, res) => {
  res.status(404).send({ status: false, msg: "Route not found" });
});


module.exports = router;

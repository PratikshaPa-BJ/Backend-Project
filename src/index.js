require("dotenv").config();
const express = require("express");
var multer = require("multer");

const route = require("./routes/route.js");
const { default: mongoose } = require("mongoose");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(multer().any())

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

const PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
  console.log(`Express app running on port ${PORT} ` );
});
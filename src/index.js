const express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");

const route = require("./routes/route.js");
const { default: mongoose } = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(multer().any())
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://papratiksha18:4fygxo35mYtTLXGj@cluster0.d1o64oj.mongodb.net/Pratiksha18-DB",
    {
      //  useNewUrlParser: true
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});

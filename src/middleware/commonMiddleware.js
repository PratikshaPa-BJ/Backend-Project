const mid1 = function (req, res, next) {
  console.log("Hi, i am a middleware from mid1");
  let loggedIn = true;
  if (loggedIn == true) {
    console.log("User is logged in ");
    next();
  } else {
    res.send({ msg: "Please Log in or Register" });
  }
};

const mid2 = function (req, res, next) {
  console.log("Hi, i am from mid2 ");
  //  res.send("Hi, I am mid2 and ending this process");
  next();
};

const mid3 = function (req, res, next) {
  console.log("Hi, i am from mid3 ");
  next();
};

const commonMW = function (req, res, next) {
  let IP = req.ip;
  console.log("IP address is", IP);
  let url = req.originalUrl;
  console.log("The route of this API is: ", url);
  let date = new Date();
  console.log(typeof date);
  console.log(typeof Date.now());
  console.log(new Date(Date.now()));
  console.log(date);

  console.log(
    date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0") +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds()
  );
  console.log(
    date.toLocaleDateString() +
      "  " +
      date.toLocaleTimeString() +
      " , " +
      date.toDateString() +
      " , " +
      date.toTimeString()
  );
  next();
};

module.exports.mid1 = mid1;
module.exports.mid2 = mid2;
module.exports.mid3 = mid3;
module.exports.globalMid = commonMW;

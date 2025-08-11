const orderValidation = function (req, res, next) {
  let header = req.headers["isfreeappuser"];

  if (header == "true" || header == "false") {
    let freeUserVal = header == "true" ? true : false;
    req.freeAppUser = freeUserVal;
    console.log("control passes");
    next();
  } else {
    return res.send(" Request is missing a mandatory header ");
  }
};

module.exports.orderValidation = orderValidation;

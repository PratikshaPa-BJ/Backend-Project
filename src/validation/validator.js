const isValidReqBody = function (reqBody) {
  return Object.keys(reqBody).length > 0;
};

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) {
    return false;
  }
  if (typeof value === "string" && value.trim().length === 0) {
    return false;
  }
  return true;
};

function isValidTitle(title) {
  return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1;
}
function isValidEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function isValidPassword(password) {
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/;
  return re.test(password);
}

function isValidISBN(ISBN) {
  let regx = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
  return regx.test(ISBN);
}

function validateDate(releasedAt) {
  let regx = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  return regx.test(releasedAt);
}
const validString = (value) => {
  const regexName = /^[a-zA-Z ]+$/;
  return regexName.test(value);
};
const IsNumeric = (input) => {
  var re = /^(?:[1-9]\d*|0)\.\d+$|^[1-9]\d*$/;
  return re.test(input);
};

function isValidMobile(mobile) {
  let regx = /^[6-9]\d{9}$/;
  return regx.test(mobile);
}

module.exports = { isValidReqBody, isValid, isValidTitle, isValidEmail, isValidPassword, isValidISBN, validateDate, validString, IsNumeric, isValidMobile};

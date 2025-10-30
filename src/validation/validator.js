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

const regexValid = function (value) {
  if (typeof value !== "string") {
    return false;
  }
  let reg = /^[A-Za-z]+$/;
  return reg.test(value.trim());
};

function isValidTitle(title) {
  let arr = ["Mr", "Mrs", "Miss"];

  if (typeof title !== "string") {
    return false;
  }
  title = title.trim();
  const titleAfterValidation = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

  return arr.includes(titleAfterValidation) ? titleAfterValidation : false;
}
function isValidEmail(email) {
  if (typeof email !== "string") {
    return false;
  }
  email = email.trim();
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
function isValidPassword(password) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/;
  return re.test(password);
}

function hasValidStringElem(value) {
  for (let i = 0; i < value.length; i++) {
    const elem = value[i];
    if (typeof elem !== "string" || elem.trim().length === 0) {
      return false;
    }
  }
  return true;
}

module.exports = { isValidReqBody, isValid, regexValid, isValidTitle, isValidEmail, isValidPassword, hasValidStringElem };

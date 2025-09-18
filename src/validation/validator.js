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

const regexValid = function(value){
  let reg = /^[A-Za-z]+$/;
  return reg.test(value)
}
 function isValidTitle(title){
     return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1;
}
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function isValidPassword(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/
    return re.test(password);
}


module.exports = { isValidReqBody, isValid, regexValid, isValidTitle, isValidEmail , isValidPassword };

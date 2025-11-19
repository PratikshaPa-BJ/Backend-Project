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

function isValidTitle(value) {
  let arr = ["Mr", "Mrs", "Miss"];

  if(typeof value !== "string"){
    return false
  }
 value = value.trim();
 const titleValidation = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
 
  return arr.includes(titleValidation) ? titleValidation : false
};

function isValidName(value){

 if(typeof value !== "string"){
  return false
 }
 const re = /^[A-Za-z\s.'-]+$/ ;

return re.test(value)
}

function isValidEmail(email) {
  if(typeof email !== "string"){
    return false
  }
  email = email.trim();
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function isValidPassword(password) {
  if(typeof password !== "string"){
    return false
  }
  password = password.trim()
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/;
  return re.test(password);
}

 function isValidPincode(value){
 if(typeof value !== "string"){
  return false
 }
 value = value.trim();
 const re = /^\d{6}$/;
 return re.test(value)
 }

 function isValidBooktitle(value){
    if(typeof value !== "string" ){
      return false
    }
    value = value.trim();
    const re = /^(?=.*[A-Za-z])[A-Za-z0-9\s:,'’"()\-&!?.]+$/ ;
    return re.test(value)
 }

function isValidISBN(val) {
  if(typeof val !== "string"){
    return false
  }
  val = val.trim();
  let regx = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
  return regx.test(val);
}

function validateDate(releasedAt) {
  if(typeof releasedAt !== "string"){
    return false
  }
  releasedAt = releasedAt.trim()
  let regx = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  return regx.test(releasedAt);
}

const isNumeric = (input) => {
  var re = /^(?:[1-9]\d*|0)\.\d+$|^[1-9]\d*$/;
  return re.test(input);
};

function isValidMobile(mobile) {
  if(typeof mobile !== "string"){
    return false
  }
  mobile = mobile.trim();
  let regx = /^[6-9]\d{9}$/;
  return regx.test(mobile);
}

module.exports = { isValidReqBody, isValid, isValidTitle, isValidName, isValidEmail, isValidPassword, isValidBooktitle, isValidPincode, isValidISBN, validateDate, isNumeric, isValidMobile};

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

function isValidName(value){

 if(typeof value !== "string"){
  return false
 }
 const re = /^[A-Za-z]+$/ ;

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
function isValidMobile(mobile) {
  if(typeof mobile !== "string"){
    return false
  }
  mobile = mobile.trim();
  let regx = /^[6-9]\d{9}$/;
  return regx.test(mobile);
}
function isValidPincode(value){
 if(typeof value !== "number"){
  return false
 }
 const re = /^\d{6}$/; 
 return re.test(String(value))
 }

 const validateAddress = ( addr, type ) => {
             if(typeof addr !== "object"){
              return `${type} address must be an object`
             }
          
             if(!addr.street || typeof addr.street !== "string" || !isValid(addr.street)){
                 return ` ${type} street is required and must be non empty string..`;
             }
             if(!addr.city || typeof addr.city !== "string" || !isValid(addr.city)){
                 return ` ${type} city is required and must be non empty string..`;
             }
             if(!addr.pincode || !isValidPincode(addr.pincode)){
                 return ` ${type} pincode is required and must be six digit number.`;
             }
             return false
 
         }
 
function hasNonEmptyStringElem(value) {
  for (let i = 0; i < value.length; i++) {
    const elem = value[i];
    if (typeof elem !== "string" || elem.trim().length === 0) {
      return false;
    }
  }
  return true;
}
function hasValidSize(val){
  const validSizes = [ "S", "XS", "M", "L", "XL", "XXL", "XXXL", "X" ];
  for(let size of val){
    if(!validSizes.includes(size)){
      return false;
    }

  }
 return true;
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



module.exports = { isValidReqBody, isValid, isValidName, isValidEmail, isValidPassword, validateAddress, isValidPincode, hasValidSize, hasNonEmptyStringElem, validateDate, isNumeric, isValidMobile };

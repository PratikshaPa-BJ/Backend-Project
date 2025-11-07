const isValidReqBody = function (reqBody) {
  return Object.keys(reqBody).length > 0;
};

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) {
    return false;
  }
  if (typeof value !== "string") {
    return false;
  }
  if (typeof value === "string" && value.trim().length === 0) {
    return false;
  }
  return true;
};

function isValidCollegeCode(val) {
  let regx = /^[a-z]+$/;
  return regx.test(val.trim());
}

function isValidCollegeName(val) {
  let regx = /^[A-Za-z\s,.'-]+$/;
  return regx.test(val.trim());
}
function isValidName(val) {
  let regx = /^[A-Za-z\s]+$/;
  return regx.test(val.trim());
}

function isValidMobile(mobile) {
  let regx = /^[6-9]\d{9}$/;

  return regx.test(mobile);
}
function isValidEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function isValidLogolink(logolink) {
  const regx = /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/i;
  return regx.test(logolink);
}

module.exports = { isValidReqBody, isValid, isValidCollegeCode, isValidCollegeName, isValidName, isValidMobile, isValidEmail, isValidLogolink };

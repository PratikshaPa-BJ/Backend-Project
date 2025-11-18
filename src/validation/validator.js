const validator = require("validator");

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

const isValidUrl = function (val) {
  return validator.isURL(val.trim(), {
    require_protocol: true, // ensure http:// or https://
    protocols: ["http", "https"], // restrict valid protocols
  });
};

const isValidUrlCode = function (val) {
  const re = /^[a-z0-9_-]{7}$/;
  return re.test(val.trim());
};

module.exports = { isValidReqBody, isValid, isValidUrlCode, isValidUrl };

const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports.getLoggedUserId = async (token) => {
  token = token.split(" ")[1];
  let decoded = jwt.verify(token, config.SECRET_JWT);
  return decoded._id;
};

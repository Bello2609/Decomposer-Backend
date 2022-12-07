const config = require("../../config");
const statusCodes = require("../constants/status");
const jwt = require("jsonwebtoken");

module.exports.authorize = (req, res, next) => {
  let token = req.headers.authorization;
  if (typeof token !== "undefined") {
    token = token.split(" ")[1];
    if (token) {
      jwt.verify(token, config.SECRET_JWT, (err, decoded) => {
        if (err) {
          return res.status(statusCodes.UNAUTHORIZED).json({
            status: false,
            data: {
              message: err,
            },
          });
        } else {
          next();
        }
      });
    } else {
      return res
        .status(statusCodes.UNAUTHORIZED)
        .json({ status: false, message: "malformed auth header" });
    }
  } else {
    return res.status(statusCodes.UNAUTHORIZED).json({
      success: false,
      data: {
        message: "No token, authorization denied",
      },
    });
  }
};

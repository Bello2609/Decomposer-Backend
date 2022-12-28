const jwt = require("jsonwebtoken");
const config = require("../../config");
const status = require("../constants/status");

module.exports = (req, res, next) => {
  let token = req.headers.authorization;
  token = token.split(" ")[1];
  jwt.verify(token, config.SECRET_JWT, (err, decoded) => {
    if (err) {
      return res.status(status.FORBIDDEN).json({
        status: false,
        data: {
          message: err,
        },
      });
    } else {
      if (decoded.type === "buyer") {
        next();
      } else {
        return res.status(status.FORBIDDEN).json({
          status: false,
          data: {
            message: "Action Forbidden. This action is for buyer only !!!",
          },
        });
      }
    }
  });
};

const { statusMessages } = require("../constants/messages");
const statusCodes = require("../constants/status");
const userModel = require("../model/User");

exports.register = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(statusCodes.BAD_REQUEST).json({
      success: false,
      message: statusMessages.PROVIDE_REQUIRED_FIELDS,
    });
  }
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(statusCodes.BAD_REQUEST).json({
      success: false,
      message: statusMessages.PROVIDE_REQUIRED_FIELDS,
    });
  }

  userModel
    .findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(statusCodes.BAD_REQUEST).json({
          succes: false,
          message: statusMessages.INVALID_CREDENTIALS,
        });
      }
      return res.status(statusCodes.SUCCESS).json({
        success: true,
        user,
        token: userModel.createSessionToken(user._id),
      });
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        message: err,
      });
    });
};

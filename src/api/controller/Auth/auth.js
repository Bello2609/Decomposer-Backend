const User = require("../../model/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const registerSchema = require("../../validationSchema/registerSchema");
const jwt = require("jsonwebtoken");
//constant
const statusMessages = require("../../constants/messages");
const statusCodes = require("../../constants/status");
//utils
const { checkPassword, hashPassword } = require("../../../utils/passwordUtil");
const { sendEmail } = require("../../../utils/emailUtils");
const { getLoggedUserId } = require("../../../utils/generalUtils");
const config = require("../../../config");

module.exports.register = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  try {
    //check if the user already regsiter
    const checkUser = await User.find({ email }).exec();
    if (checkUser.length > 1) {
      return res.status(409).json({
        data: {
          message: "This email already existed",
        },
      });
    } else {
      bcrypt.hash(password, 10, (err, hashPassword) => {
        if (err) {
          return res.status(500).json({
            data: {
              message: err,
            },
          });
        } else {
          const userData = {
            name: name,
            email: email,
            password: hashPassword,
            role: role,
            isVerified: false,
          };
          const { error } = registerSchema.validate(userData, {
            abortEarly: false,
          });
          if (error) {
            return res.status(401).json({
              data: {
                message: error.details[0].message,
              },
            });
          } else {
            const user = new User(userData);
            user.save();
            return res.status(201).json({
              data: {
                message: "Your account has been created successfully",
              },
            });
          }
        }
      });
    }
  } catch (err) {
    return res.status(500).json({
      data: {
        message: err,
      },
    });
  }
};

module.exports.forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    crypto.randomBytes(12, async (err, buffer) => {
      if (err) {
        return res.status(400).json({
          data: {
            message: err,
          },
        });
      }
      const token = buffer.toString("hex");
      const user = await User.findOne({ email: email });

      //this will get the name of the user we wanna send the mail to
      const getName = user.map((users) => {
        return users.name;
      });
      if (!user) {
        return res.status(404).json({
          data: {
            message: "This email is not registered",
          },
        });
      }
      user.userToken = token;
      user.userTokenExpiration = Date.now() + 3600000;
      await user.save();
      sendEmail(getName, email, token);
    });
  } catch (err) {
    return res.status(501).json({
      data: {
        message: err,
      },
    });
  }
};

module.exports.getNewPassword = async (req, res, next) => {
  const newPassword = req.body.newpassword;
  const token = req.params.token;
  //check if the user token can be found on the data base
  const user = await User.findOne({
    userToken: token,
    userTokenExpiration: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(404).json({
      data: {
        message: "Invalid token or the token has expired",
      },
    });
  } else {
    const hashPassword = await hashPassword(newPassword, 10);
    user.password = hashPassword;
    user.userToken = undefined;
    user.userTokenExpiration = undefined;
    return res.status(201).json({
      data: {
        message: "Your password has been changed successfully",
      },
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

  User.findOne({ email })
    .select("+password")
    .then(async (user) => {
      if (!user || !(await checkPassword(user["password"], password))) {
        return res.status(statusCodes.BAD_REQUEST).json({
          succes: false,
          message: statusMessages.INVALID_CREDENTIALS,
        });
      }

      delete user["password"];
      return res.status(statusCodes.OK).json({
        success: true,
        data: {
          user,
          token: User.createSessionToken(user._id, user.role),
        },
      });
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        data: {
          message: err,
        },
      });
    });
};

module.exports.refreshToken = (req, res) => {
  let token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;

  jwt.verify(token, config.SECRET_JWT, (err, decoded) => {
    if (err) {
      return res.status(406).json({
        succes: false,
        data: {
          message: "Unathorized",
        },
      });
    } else {
      token = User.createSessionToken(decoded._id, decoded.role);
      return res.status(statusCodes.OK).json({
        success: true,
        data: {
          token,
        },
      });
    }
  });
};

module.exports.getProfile = async (req, res) => {
  let loggedUserId = await getLoggedUserId(req.headers.authorization);

  User.findOne({ _id: loggedUserId })
    .then((user) => {
      return res.status(statusCodes.OK).json({
        success: true,
        data: {
          user,
        },
      });
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        data: {
          message: err,
        },
      });
    });
};

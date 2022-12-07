const User = require("../model/User");
const bcrypt = require("bcrypt");
const registerSchema = require("../validationSchema/registerSchema");
const { messages } = require("../validationSchema/registerSchema");

const { statusMessages } = require("../constants/messages");
const statusCodes = require("../constants/status");
const { checkPassword, hashPassword } = require("../../utils/passwordUtil");

exports.register = async (req, res, next) => {
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
    res.status(501).json({
      data: {
        message: err,
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
    .then(async (user) => {
      if (!user || !(await checkPassword(user["password"], password))) {
        return res.status(statusCodes.BAD_REQUEST).json({
          succes: false,
          message: statusMessages.INVALID_CREDENTIALS,
        });
      }
      return res.status(statusCodes.SUCCESS).json({
        success: true,
        data: {
          user,
          token: User.createSessionToken(user._id),
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

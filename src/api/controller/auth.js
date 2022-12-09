const User = require("../model/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const registerSchema = require("../validationSchema/registerSchema");
const jwt = require("jsonwebtoken");

const statusMessages = require("../constants/messages");
const statusCodes = require("../constants/status");
const { checkPassword, hashPassword } = require("../../utils/passwordUtil");
const config = require("../../config");

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
}catch(err){
  return res.status(500).json({
    data: {
      message: err
    }
  })
}
}
exports.forgetPassword = async( req, res, next )=>{
    const { email } = req.body;
    try{
        crypto.randomBytes(12, (err, buffer)=>{
            if(err){
                return res.status(502).json({
                    data: {
                        message: err
                    }
                })
            }
            const token = buffer.toString("hex");
            const user = await User.findOne({ email: email });
            if(!user){
                return res.status(404).json({
                    data: {
                        message: "This email is not registered"
                    }
                })
            }
            user.userToken = token;
            user.userTokenExpiration = Date.now() + 3600000;
            await user.save();
        });
    }catch(err){
        return res.status(501).json({
            data: {
                message: err
            }
        })
    } 
}
exports.getNewPassword = ( req, res, next )=>{

};


exports.forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    crypto.randomBytes(12, async (err, buffer) => {
      if (err) {
        return res.status(502).json({
          data: {
            message: err,
          },
        });
      }
      const token = buffer.toString("hex");
      const user = await User.findOne({ email: email });
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
    });
  } catch (err) {
    return res.status(501).json({
      data: {
        message: err,
      },
    });
  }
};

exports.getNewPassword = (req, res, next) => {
  console.log("new password");
};

exports.forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    crypto.randomBytes(12, async (err, buffer) => {
      if (err) {
        return res.status(502).json({
          data: {
            message: err,
          },
        });
      }
      const token = buffer.toString("hex");
      const user = await User.findOne({ email: email });
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
    });
  } catch (err) {
    return res.status(501).json({
      data: {
        message: err,
      },
    });
  }
};

exports.getNewPassword = (req, res, next) => {};


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

}


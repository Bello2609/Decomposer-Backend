require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  SECRET_JWT: process.env.SECRET_JWT,
  TWILLOP_EMAIL_API: process.env.TWILLOP_EMAIL_API,
  FROM: process.env.FROM
};

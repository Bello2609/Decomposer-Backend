const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const { Schema } = mongoose;
const CONFIG = require("../../config");

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    services: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: false
    },
    profile_image: {
        type: String,
        required: false
    },
    header_image: {
        type: String,
        required: false
    },
    amount: {
        type: Schema.Types.ObjectId,
        ref: "Amount",
        required: false
    },
    isVerified: {
        type: Boolean,
        default: false
        required: true
    },
    userToken: String,
    userTokenExpiration: Date
});
// Create Session for user
function createSessionToken(_id) {
  const sessionToken = jsonwebtoken.sign(
    {
      _id,
      type: "User",
      timestamp: Date.now(),
    },
    CONFIG.SECRET_JWT,
    { expiresIn: "1h" } //Expires in an hour
  );
  return sessionToken;
}
module.exports = mongoose.model("User", userSchema);
module.exports.createSessionToken = createSessionToken;

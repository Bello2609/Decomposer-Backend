const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const { Schema } = mongoose;
const CONFIG = require("../../config");

const userRoles = {
  buyer: "buyer",
  seller: "seller",
};
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(userRoles),
      required: true,
    },
    services: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: false,
    },
    profile_image: {
      type: String,
      required: false,
    },
    header_image: {
      type: String,
      required: false,
    },
    amount: {
      type: Schema.Types.ObjectId,
      ref: "Amount",
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    userToken: String,
    userTokenExpiration: Date,
  },
  { timestamps: true }
);

// Create Session for user
function createSessionToken(_id, role) {
  const sessionToken = jsonwebtoken.sign(
    {
      _id,
      type: role,
      timestamp: Date.now(),
    },
    CONFIG.SECRET_JWT,
    { expiresIn: "1h" } //Expires in an hour
  );
  return sessionToken;
}

module.exports = mongoose.model("User", userSchema);
module.exports.createSessionToken = createSessionToken;

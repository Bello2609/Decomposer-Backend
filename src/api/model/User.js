const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  services: {
    type: String,
    required: true,
  },
  profile_image: {
    type: String,
    required: true,
  },
  header_image: {
    type: String,
    required: true,
  },
  amount: {
    type: Schema.Types.ObjectId,
    ref: "Amount",
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
  },
});

userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    user["password"] = hashPassword(user["password"]);
  }
  next();
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

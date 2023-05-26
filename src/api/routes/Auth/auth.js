const express = require("express");
const {
  register,
  login,
  refreshToken,
  forgetPassword,
  getNewPassword,
  getProfile,
  verifyUser,
  signInWithGoogle,
  google
} = require("../../controller/Auth/auth");
const { authorize } = require("../../middleware/authorize");
const router = express.Router();

router.get("/google/callback", signInWithGoogle);
router.get("/google", google);
router.post("/register", register);
router.post("/login", login);
router.post("/verifyUser", authorize, verifyUser);
router.post("/forgetPassword", forgetPassword);
router.post("/getNewPassword", getNewPassword);
router.get("/refresh", authorize, refreshToken);
router.get("/profile", authorize, getProfile);
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    route: "Auth Route",
    timestamp: Date.now(),
  });
});

module.exports = router;

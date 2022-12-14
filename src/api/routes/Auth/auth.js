const express = require("express");
const { register, login, refreshToken, forgetPassword, getNewPassword } = require("../../controller/Auth/auth");
const { authorize } = require("../../middleware/authorize");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.post("/getNewPassword", getNewPassword);
router.get("/refresh", authorize, refreshToken);
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    route: "Auth Route",
    timestamp: Date.now(),
  });
});

module.exports = router;

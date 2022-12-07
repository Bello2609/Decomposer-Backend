const express = require("express");
const { register, login, refreshToken } = require("../../controller/auth");
const { authorize } = require("../../middleware/authorize");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/refresh", authorize, refreshToken);
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    route: "Auth Route",
    timestamp: Date.now(),
  });
});

module.exports = router;

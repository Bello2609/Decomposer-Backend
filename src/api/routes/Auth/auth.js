const express = require("express");
const { register } = require("../../controller/auth");
const router = express.Router();

router.post("/register", register);
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    route: "Auth Route",
    timestamp: Date.now(),
  });
});

module.exports = router;

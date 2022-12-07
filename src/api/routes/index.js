const { Router } = require("express");
const authRoutes = require("./Auth/auth");
const router = Router();

router.use("/auth", authRoutes);
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    route: "Routes",
    timestamp: Date.now(),
  });
});

module.exports = router;

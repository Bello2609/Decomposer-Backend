const { Router } = require("express");
const authRoutes = require("./Auth/auth");
const orderRoutes = require("./Order");
const router = Router();

router.use("/auth", authRoutes);
router.use("/order", orderRoutes);
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    route: "Routes",
    timestamp: Date.now(),
  });
});

module.exports = router;

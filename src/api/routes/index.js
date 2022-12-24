const { Router } = require("express");
const authRoutes = require("./Auth/auth");
const orderRoutes = require("./Order/index");
const serviceRoutes = require("./Service/index");
const reviewRoutes = require("./Review/Review");
const router = Router();

router.use("/auth", authRoutes);
router.use("/order", orderRoutes);
router.use("/service", serviceRoutes);
router.use("/reviews", reviewRoutes);
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    route: "Routes",
    timestamp: Date.now(),
  });
});

module.exports = router;

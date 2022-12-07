const { Router } = require("express");
const { createOrder } = require("../../controller/Order");
const { authorize } = require("../../middleware/authorize");
const authorizeBuyerOnly = require("../../middleware/authorizeBuyerOnly");
const router = Router();

// router.post("/create", authorize, createOrder);
router.post("/create", authorize, authorizeBuyerOnly, createOrder);
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    route: "Order Route",
    timestamp: Date.now(),
  });
});

module.exports = router;

const { Router } = require("express");
const {
  createOrder,
  myOrders,
  oneOrder,
  updateOrder,
  deleteOrder,
} = require("../../controller/Order");
const { authorize } = require("../../middleware/authorize");
const authorizeBuyerOnly = require("../../middleware/authorizeBuyerOnly");
const router = Router();

router.post("/create", [authorize, authorizeBuyerOnly], createOrder);
router.get("/myOrders", [authorize, authorizeBuyerOnly], myOrders);
router.get("/oneOrder/:id", [authorize, authorizeBuyerOnly], oneOrder);
router.put("/updateOrder/:id", [authorize, authorizeBuyerOnly], updateOrder);
router.delete("/deleteOrder/:id", [authorize, authorizeBuyerOnly], deleteOrder);

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    route: "Order Route",
    timestamp: Date.now(),
  });
});

module.exports = router;

const { Router } = require("express");
const {
  createService,
  deleteService,
  myServices,
  oneService,
  updateService,
  updateServiceMedia,
  allServices,
} = require("../../controller/Service");
const { authorize } = require("../../middleware/authorize");
const authorizeSellerOnly = require("../../middleware/authorizeSellerOnly");
const router = Router();

router.get("/oneService/:id", oneService); // anyone can view service
router.get("/allServices", allServices); // anyone can view service
router.post("/create", [authorize, authorizeSellerOnly], createService);
router.get("/myServices", [authorize, authorizeSellerOnly], myServices);
router.put(
  "/updateService/:id",
  [authorize, authorizeSellerOnly],
  updateService
);
router.put(
  "/updateMedia/:id",
  [authorize, authorizeSellerOnly],
  updateServiceMedia
);
router.delete("/delete/:id", [authorize, authorizeSellerOnly], deleteService);
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    route: "Service Route",
    timestamp: Date.now(),
  });
});

module.exports = router;

const { Router } = require("express");
const {
  addService,
  deleteService,
  myServices,
  oneService,
  updateService,
  updateServiceMedia,
} = require("../../controller/Service");
const { authorize } = require("../../middleware/authorize");
const authorizeSellerOnly = require("../../middleware/authorizeSellerOnly");
const router = Router();

router.post("/create", [authorize, authorizeSellerOnly], addService);
router.get("/myServices", [authorize, authorizeSellerOnly], myServices);
router.get("/oneService/:id", [authorize, authorizeSellerOnly], oneService);
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

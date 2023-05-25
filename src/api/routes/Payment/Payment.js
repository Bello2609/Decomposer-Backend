const { Router }  = require("express");
const router = Router();
const { createConnectedAccount, createIntent } = require("../../controller/Payment/Payment");
const { authorize } = require("../../middleware/authorize");
const authorizeSellerOnly = require("../../middleware/authorizeSellerOnly");

router.post("/createAccount", [ authorize, authorizeSellerOnly ], createConnectedAccount);
router.post("/makePayment", [ authorize, authorizeSellerOnly ], createIntent);



module.exports = router;
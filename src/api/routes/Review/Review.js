const { Router } = require("express");
const router = Router();
const { postReview, getAllReview } = require("../../controller/Review");
const authorizeBuyerOnly = require('../../middleware/authorizeBuyerOnly');
const authorize = require("../../middleware/authorize");

router.post("/postReview", [authorize, authorizeBuyerOnly], postReview);
router.get("/getAllReview", authorize, getAllReview);

module.exports = router;
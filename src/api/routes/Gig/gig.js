const { Router } = require("express");
const router = Router();
const { postReview, getAllReview } = require("../../controller/Gig/gig");
const authorizeBuyerOnly = require('../../middleware/authorizeBuyerOnly');
// const authorizeSellerOnly = require('../../middleware/authorizeSellerOnly');
const { authorize } = require("../../middleware/authorize");
// post the gig for a particular user
router.post("/postGig");
// post a review to a gig for aparticular user
router.post("/postGigReview/:id", [authorize, authorizeBuyerOnly], postReview);
// get the review for a particular user
router.get("/getAllReview", authorize, getAllReview);
// get all the gig by all user
router.get("/getAllGig");
module.exports = router;
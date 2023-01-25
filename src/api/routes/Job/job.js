const { Router } = require("express");
const { postJob } = require("../../controller/Job/job");

const router  = Router();

router.post("/postjob", postJob);
module.exports = router;
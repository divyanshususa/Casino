const express = require("express");
const router = express.Router();
//not required socket handle this
const TimerController = require("../Controller/timerController");
router.get("/", TimerController.GlobalTimer);
module.exports = router;

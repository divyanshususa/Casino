const express = require("express");
const router = express.Router();

const TimerController = require("../Controller/timerController");
router.get("/", TimerController.GlobalTimer);
module.exports = router;

const express = require("express");
const router = express.Router();

const spinnerController = require('../Controller/spinnerController')
router.get('/spin',spinnerController.spinner)
router.get('/spinner-history',spinnerController.getSpinnerHistory)


module.exports = router;
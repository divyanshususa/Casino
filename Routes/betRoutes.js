const express = require("express");
const router = express.Router();
const betController= require('../Controller/betController')


router.post('/place-bet',betController.placebet )
router.get('/check-winning-bet', betController.checkWiningBets)


module.exports = router;

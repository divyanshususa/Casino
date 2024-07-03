const express = require("express");
const router = express.Router();
const userController= require('../Controller/userController')

router.post('/create-user',userController.CreateUser )
router.post('/login', userController.userlogin)
router.get('/get',userController.getuser)
router.post('/reset-password',userController.resetPassword )
router.get('/getuserbyId/:userId', userController.getuserdetails)
router.get('/getTransaction/:userId', userController.GetUserTransaction)
router.get('/username-suggestions/:prefix',userController.usernameSuggestions)
router.post('/withdrawal-points', userController.createWithdrawalRequest);

module.exports = router;

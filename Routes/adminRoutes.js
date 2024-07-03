const express = require("express");
const router = express.Router();

const adminController= require('../Controller/adminController')
router.get('/all-users', adminController.allUsers)
router.post('/login', adminController.adminlogin)
router.post('/create-admin', adminController.CreateAdmin)
router.delete('/deleteUser/:id', adminController.deleteUser)
router.post('/create-user', adminController.createRandomUser)
router.get('/expenditure', adminController.Expenditure)
router.get('/getAllTransactions', adminController.GetAllTransaction)
router.get('/getAllPointsTransactions', adminController.getAllPointTransactions)
router.put('/UpdatePoints/:userId', adminController.UpdateUserPoints)
router.get('/all-withdrawals', adminController.getAllWithdrawalRequests);
router.put('/withdrawal/status', adminController.updateWithdrawalStatus);
module.exports = router;
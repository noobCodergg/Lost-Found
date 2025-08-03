const express = require("express");
const { registration, verifyOTP, login, verifyUser, logout, handleRate } = require("../controllers/auth");


const router = express.Router();

router.post('/registration',registration)
router.post('/verify-otp',verifyOTP)
router.post('/login',login)
router.get('/verify-user',verifyUser)
router.get('/log-out',logout)
router.put('/update-rate',handleRate)


module.exports = router;
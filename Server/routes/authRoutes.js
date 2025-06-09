const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../middlewares/rateLimit');

router.post('/request-otp', authLimiter,authController.requestOTP);
router.post('/register',authLimiter, authController.registerWithOTP);
router.post('/login',authLimiter, authController.login);
router.get('/logout',authController.logout);
router.post('/request-reset-otp', authController.requestResetOTP);
router.post('/reset-password', authController.resetPasswordWithOTP);



module.exports = router;
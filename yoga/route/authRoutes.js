const express = require('express');
const { register, login } = require('../controllers/authControllers');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

module.exports = router;


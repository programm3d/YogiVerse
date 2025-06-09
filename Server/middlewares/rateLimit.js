const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts from this IP, please try again after an hour'
});

module.exports = { limiter, authLimiter };
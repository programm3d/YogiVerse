const rateLimit = require('express-rate-limit');

// General API rate limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Add debugging
    onLimitReached: (req, res) => {
        console.log(' General rate limit reached for IP:', req.ip);
    },
    skip: (req, res) => {
        console.log(' General limiter - IP:', req.ip, 'Current count:', req.rateLimit?.current || 'N/A');
        return false;
    }
});

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 auth requests per windowMs
    message: {
        error: 'Too many authentication attempts, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    onLimitReached: (req, res) => {
        console.log(' Auth rate limit reached for IP:', req.ip);
    },
    skip: (req, res) => {
        console.log(' Auth limiter - IP:', req.ip, 'Current count:', req.rateLimit?.current || 'N/A');
        return false;
    }
});

// Rate limiting for post creation - WITH DEBUGGING
const createPostLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 post creations per hour
    message: {
        error: 'Too many posts created, please try again later.',
        retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,

    // This runs when limit is reached
    onLimitReached: (req, res) => {
        console.log(' POST CREATION RATE LIMIT REACHED!');
        console.log('IP:', req.ip);
        console.log('Current requests:', req.rateLimit?.current);
        console.log('Max allowed:', req.rateLimit?.limit);
        console.log('Reset time:', new Date(req.rateLimit?.resetTime));
    },

    // This runs for every request to check/log
    skip: (req, res) => {
        console.log(' POST CREATION RATE LIMITER CHECK:');
        console.log('  IP:', req.ip);
        console.log('  Current count:', req.rateLimit?.current || 'N/A');
        console.log('  Max allowed:', req.rateLimit?.limit || 'N/A');
        console.log('  Reset time:', req.rateLimit?.resetTime ? new Date(req.rateLimit.resetTime) : 'N/A');

        // Return false to NOT skip (let rate limiter do its job)
        // Return true to skip rate limiting for this request
        return false;
    },

    // Custom handler when limit is exceeded
    handler: (req, res) => {
        console.log(' POST CREATION BLOCKED BY RATE LIMITER!');
        console.log('Request details:', {
            ip: req.ip,
            path: req.path,
            method: req.method,
            userAgent: req.get('User-Agent'),
            current: req.rateLimit?.current,
            limit: req.rateLimit?.limit,
            resetTime: new Date(req.rateLimit?.resetTime)
        });

        // Send response and DO NOT call next()
        res.status(429).json({
            error: 'Too many posts created, please try again later.',
            retryAfter: '1 hour',
            currentRequests: req.rateLimit?.current,
            maxRequests: req.rateLimit?.limit,
            resetTime: new Date(req.rateLimit?.resetTime),
            debug: {
                ip: req.ip,
                blocked: true,
                reason: 'Rate limit exceeded'
            }
        });
    }
});

// Rate limiting for file uploads
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // limit each IP to 20 uploads per hour
    message: {
        error: 'Too many file uploads, please try again later.',
        retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
    onLimitReached: (req, res) => {
        console.log(' Upload rate limit reached for IP:', req.ip);
    },
    skip: (req, res) => {
        console.log(' Upload limiter - IP:', req.ip, 'Current count:', req.rateLimit?.current || 'N/A');
        return false;
    }
});

// Helper function to reset rate limit for testing
const resetRateLimit = (limiterName) => {
    console.log(` Resetting rate limit for: ${limiterName}`);
    // Note: express-rate-limit doesn't have a direct reset method
    // You might need to restart the server or wait for the window to expire
};

module.exports = {
    generalLimiter,
    authLimiter,
    createPostLimiter,
    uploadLimiter,
    resetRateLimit
};
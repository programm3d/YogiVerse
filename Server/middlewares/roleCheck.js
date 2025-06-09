const createError = require('http-errors');

const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(createError(403, 'You are not authorized to perform this action'));
    }
    next();
};

module.exports = { adminOnly };

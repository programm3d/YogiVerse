const createError = require('http-errors');

const notFound = (req, res, next) => {
    next(createError(404, 'Not found'));
};

const errorHandler = (err, req, res, next) => {
    // Handle Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size allowed is 30MB for videos and 2MB for profile pictures.'
        });
    }

    if (err.message.includes('Only image files are allowed')) {
        return res.status(400).json({
            success: false,
            message: 'Only image files are allowed for profile pictures.'
        });
    }

    if (err.message.includes('Only image and video files are allowed')) {
        return res.status(400).json({
            success: false,
            message: 'Only image and video files are allowed for posts.'
        });
    }

    // Handle other errors
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};



module.exports = { notFound, errorHandler };

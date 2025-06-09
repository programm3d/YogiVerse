const multer = require('multer');
const path = require('path');

// Memory storage for Cloudinary
const storage = multer.memoryStorage();

// File filter for profile pictures
const profilePicFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed for profile pictures'), false);
    }
};

// File filter for posts (images and videos)
const postContentFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image and video files are allowed for posts'), false);
    }
};

// Profile picture upload (2MB limit)
const profilePicUpload = multer({
    storage: storage,
    fileFilter: profilePicFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    }
});

// Video/image upload for posts (30MB limit)
const videoUpload = multer({
    storage: storage,
    fileFilter: postContentFilter,
    limits: {
        fileSize: 30 * 1024 * 1024 // 30MB
    }
});

module.exports = {
    profilePicUpload,
    videoUpload
};

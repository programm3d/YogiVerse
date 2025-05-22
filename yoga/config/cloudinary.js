const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL || 'cloudinary://627836546367845:r8dQwrkGa2fsuwYntFT_wIGCijE@kavinraj'
});

// Storage for profile pictures
const profilePicStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profile_pics',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

// Storage for video content
const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'post_videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
        transformation: [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 1280, height: 720, crop: 'limit' }
        ]
    }
});

const profilePicUpload = multer({
    storage: profilePicStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit for images
    }
});

const videoUpload = multer({
    storage: videoStorage,
    limits: {
        fileSize: 30 * 1024 * 1024 // 30MB limit for videos
    }
});

module.exports = { cloudinary, profilePicUpload, videoUpload };
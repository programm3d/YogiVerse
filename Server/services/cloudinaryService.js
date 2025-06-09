// 4. CLOUDINARY SERVICE (services/cloudinaryService.js)
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
});

const uploadToCloudinary = async (file, folder = 'uploads') => {
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            folder: `social_media/${folder}`,
            resource_type: 'auto'
        };

        // Add transformation for profile pictures
        if (folder === 'profile_pics') {
            uploadOptions.transformation = [
                { width: 300, height: 300, crop: 'fill', gravity: 'face' },
                { quality: 'auto' }
            ];
        }

        // Add transformation for video optimization
        if (folder === 'videos') {
            uploadOptions.transformation = [
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ];
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.end(file.buffer);
    });
};

const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary
};
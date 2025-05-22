const { userModel } = require('../model/User');
const { cloudinary } = require('../config/cloudinary');

const updateProfilePic = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const user = await userModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete old profile pic if exists
        if (user.profilePic && user.profilePic !== 'null') {
            const publicId = user.profilePic.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`profile_pics/${publicId}`);
        }

        user.profilePic = req.file.path;
        await user.save();

        res.json({
            message: 'Profile picture updated successfully',
            profilePic: user.profilePic
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { updateProfilePic, getProfile };
//userControllers.js
const User = require('../models/User');
const createError = require('http-errors');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinaryService');


const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) throw createError(404, 'User not found');
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) throw createError(404, 'User not found');

        if (req.file) {
            // Delete old profile picture if exists
            if (user.cloudinary_id) {
                await deleteFromCloudinary(user.cloudinary_id);
            }

            // Upload new profile picture with cropping
            const result = await uploadToCloudinary(req.file, 'profile_pics');
            user.profilePic = result.secure_url;
            user.cloudinary_id = result.public_id;
        }

        // Update other fields
        // user.name = req.body.name || user.name;

        await user.save();

        // Return user without password
        const updatedUser = await User.findById(user._id).select('-password');
        res.status(200).json({ success: true, user: updatedUser });
    } catch (err) {
        next(err);
    }
};

const removeProfilePic = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) throw createError(404, 'User not found');

        if (user.cloudinary_id) {
            await deleteFromCloudinary(user.cloudinary_id);
            user.profilePic = null;
            user.cloudinary_id = null;
            await user.save();
        }

        res.status(200).json({ success: true, message: 'Profile picture removed.' });
    } catch (err) {
        next(err);
    }
};


const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const query = {};

        if (search) {
            query.username = { $regex: search, $options: 'i' }; // case-insensitive match for username
        }

        const users = await User.find(query)
            .select('-password')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const count = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        next(err);
    }

};

const blockUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: 'blocked' },
            { new: true }
        ).select('-password');

        if (!user) {
            throw createError(404, 'User not found');
        }

        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    removeProfilePic,
    getAllUsers,
    blockUser
};

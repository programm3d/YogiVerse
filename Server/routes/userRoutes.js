//userRoutes.js
const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    removeProfilePic,
    getAllUsers,
    blockUser
} = require('../controllers/userController');
const  verifyToken  = require('../middlewares/auth');
const { adminOnly } = require('../middlewares/roleCheck');
const {  profilePicUpload} = require('../config/multer');

router.get('/profile', verifyToken, getProfile);
router.patch('/profile', verifyToken, profilePicUpload.single('profilePic'), updateProfile);
router.delete('/profile/pic', verifyToken, removeProfilePic);

// Admin routes
router.get('/all', verifyToken, adminOnly, getAllUsers);
router.patch('/block/:id', verifyToken, adminOnly, blockUser);

module.exports = router;

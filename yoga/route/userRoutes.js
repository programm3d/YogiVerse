// routes/userRoutes.js
const express = require('express');
const { updateProfilePic, getProfile } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { profilePicUpload } = require('../config/cloudinary');
const { uploadLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);
router.patch('/profile-pic', uploadLimiter, authenticateToken, profilePicUpload.single('profilePic'), updateProfilePic);

module.exports = router;

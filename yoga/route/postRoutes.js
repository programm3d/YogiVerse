const express = require('express');
const {
    createPost,
    getUserPosts,
    getAllPosts,
    updatePost,
    deletePost,
    deletePostAdmin,
    addComment,
    searchByTag,
    uploadVideo
} = require('../controllers/postController');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { createPostLimiter, uploadLimiter } = require('../middleware/rateLimiter');
const { videoUpload } = require('../config/cloudinary');

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/search', authenticateToken, searchByTag);

// Video upload endpoint
router.post('/upload-video', authenticateToken, videoUpload.single('video'), uploadVideo);

// User routes (authenticated)
router.post('/', createPostLimiter, authenticateToken, videoUpload.single('video'), createPost);
router.get('/my-posts', authenticateToken, getUserPosts);
router.patch('/:id', authenticateToken, videoUpload.single('video'), updatePost);
router.delete('/:id', authenticateToken, deletePost);
router.post('/:id/comments', authenticateToken, addComment);

// Admin routes
router.delete('/admin/:id', authenticateToken, isAdmin, deletePostAdmin);

module.exports = router;

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const  verifyToken  = require('../middlewares/auth');
const { adminOnly } = require('../middlewares/roleCheck');
const { videoUpload } = require('../config/multer');

router.post('/', verifyToken,  videoUpload.single('video'), postController.createPost);
router.put('/:id', verifyToken,  postController.updatePost);

router.delete('/:id', verifyToken, postController.deletePost);
router.get('/:id', verifyToken,postController.getPost);
router.get('/user/:userId', verifyToken, postController.getUserPosts);
router.get('/feed/all', postController.getFeed);
router.post('/:id/like', verifyToken, postController.likePost);
router.get('/search/all', verifyToken, postController.searchPosts);
router.get("/likeCount/:id", verifyToken, postController.getLikeCount);
module.exports = router;
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const  verifyToken  = require('../middlewares/auth');



router.get('/post/:postId',verifyToken, commentController.getPostComments);
router.delete('/:id', verifyToken, commentController.deleteComment);
router.post('/', verifyToken, commentController.createComment);
module.exports = router;
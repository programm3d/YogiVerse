const createError = require('http-errors');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const mongoose=require('mongoose');
const createComment = async (req, res, next) => {
    try {
        const { text, postId } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            throw createError(404, 'Post not found');
        }

        const comment = new Comment({
            userId: req.user.id,
            text,
            postId,
            postUserId: post.userId
        });

        await comment.save();

        res.status(201).json({ success: true, comment });
    } catch (err) {
        next(err);
    }
};

const getPostComments = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const userId = req.user.id;
        const postId = req.params.postId;

        const skip = (page - 1) * limit;

        const comments = await Comment.aggregate([
            { $match: { postId: new mongoose.Types.ObjectId(postId) } },
            {
                $addFields: {
                    isCurrentUser: {
                        $cond: [{ $eq: ['$userId', new mongoose.Types.ObjectId(userId)] }, 0, 1]
                    }
                }
            },
            { $sort: { isCurrentUser: 1, createdAt: -1 } },
            { $skip: skip },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    content: 1,
                    createdAt: 1,
                    userId: 1,
                    'user.username': 1,
                    'user.profilePic': 1
                }
            }
        ]);

        const count = await Comment.countDocuments({ postId });

        res.status(200).json({
            success: true,
            comments,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        next(err);
    }
};


const deleteComment = async (req, res, next) => {
    try {
        const query = { _id: req.params.id };

        // Admin can delete any comment, user can only delete their own
        if (req.user.role !== 'admin') {
            query.userId = req.user.id;
        }

        const comment = await Comment.findOneAndDelete(query);

        if (!comment) {
            throw createError(404, 'Comment not found or you are not authorized to delete it');
        }

        res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createComment,
    getPostComments,
    deleteComment
};
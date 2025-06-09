const createError = require('http-errors');
const Post = require('../models/Post');
const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinaryService');
const mongoose = require('mongoose');
const createPost = async (req, res, next) => {
    try {
        // Debug: Log the entire request body
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        // Extract data from req.body (ensure they exist)
        const title = req.body.title;
        const description = req.body.description || '';
        const tags = req.body.tags;
        const difficultyLevel = req.body.difficultyLevel;

        // Validate required fields
        if (!title) {
            throw createError(400, 'Title is required');
        }

        let contentLink = null;
        let cloudinary_id = null;

        if (req.file) {
            const folder = req.file.mimetype.startsWith('video/') ? 'videos' : 'posts';
            const result = await uploadToCloudinary(req.file, folder);
            contentLink = result.secure_url;
            cloudinary_id = result.public_id;
        }

        const post = new Post({
            userId: req.user.id,
            contentLink,
            cloudinary_id,
            title,
            description,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            difficultyLevel
        });

        await post.save();

        res.status(201).json({ success: true, post });
    } catch (err) {
        console.error('Create post error:', err);
        next(err);
    }
};

const updatePost = async (req, res, next) => {
    try {
        // Debug: Log the entire request body
        console.log('Update request body:', req.body);
        console.log('Update request file:', req.file);

        const title = req.body.title;
        const description = req.body.description || '';
        const tags = req.body.tags;
        const difficultyLevel = req.body.difficultyLevel;

        const updates = {};

        // Only add fields that are provided
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (tags !== undefined) updates.tags = tags.split(',').map(tag => tag.trim());
        if (difficultyLevel !== undefined) updates.difficultyLevel = difficultyLevel;



        const updatedPost = await Post.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            throw createError(404, 'Post not found or you are not authorized to update it');
        }

        res.status(200).json({ success: true, post: updatedPost });
    } catch (err) {
        console.error('Update post error:', err);
        next(err);
    }
};

const deletePost = async (req, res, next) => {
    try {
        const query = { _id: req.params.id };

        // Admin can delete any post, user can only delete their own
        if (req.user.role !== 'admin') {
            query.userId = req.user.id;
        }

        const post = await Post.findOne(query);
        if (!post) {
            throw createError(404, 'Post not found or you are not authorized to delete it');
        }

        // Delete content from Cloudinary if exists
        if (post.cloudinary_id) {
            await deleteFromCloudinary(post.cloudinary_id);
        }

        await Post.deleteOne(query);

        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (err) {
        next(err);
    }
};

const getPost = async (req, res, next) => {
    let postId=new mongoose.Types.ObjectId(req.params.id)
    try {
        const post = await Post.aggregate([
            { $match: { _id: postId } },
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
                    title: 1,
                    description: 1,
                    contentLink: 1,
                    tags: 1,
                    difficultyLevel: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'user._id': 1,
                    'user.username': 1,
                    'user.profilePic': 1,
                    likesCount: { $size: '$likedBy' }
                }
            }
        ]);

        if (!post) {
            throw createError(404, 'Post not found');
        }

        res.status(200).json({ success: true, post });
    } catch (err) {
        next(err);
    }
};

const getUserPosts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const userId = req.params.userId || req.user.id;

        const posts = await Post.find({ userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('userId', 'username profilePic');

        const count = await Post.countDocuments({ userId });

        res.status(200).json({
            success: true,
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        next(err);
    }
};

const getFeed = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('userId', 'username profilePic');

        const count = await Post.countDocuments();

        res.status(200).json({
            success: true,
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        next(err);
    }
};

const likePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            throw createError(404, 'Post not found');
        }

        const userId = req.user.id;
        const isLiked = post.likedBy.includes(userId);

        if (isLiked) {
            // Unlike the post
            post.likes -= 1;
            post.likedBy.pull(userId);
        } else {
            // Like the post
            post.likes += 1;
            post.likedBy.push(userId);
        }

        await post.save();

        res.status(200).json({
            success: true,
            likes: post.likes,
            isLiked: !isLiked
        });
    } catch (err) {
        next(err);
    }
};

const searchPosts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('userId', 'username profilePic');

        const count = await Post.countDocuments(query);

        res.status(200).json({
            success: true,
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        next(err);
    }
};
const getLikeCount = async (req, res, next) => {
    let postId=new mongoose.Types.ObjectId(req.params.id)
    try {
        let likeCount = await Post.aggregate([
            {$match: {_id: postId}},
            {
                $project: {
                    likesCount: {$size: '$likedBy'}
                }
            }
        ]);
        return res.status(200).json({likeCount});
    }
    catch (error) {
        next(error);
    }

}
module.exports = {
    createPost,
    updatePost,
    deletePost,
    getPost,
    getUserPosts,
    getFeed,
    likePost,
    searchPosts,
    getLikeCount,
};
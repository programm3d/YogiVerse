const { postModel } = require('../model/User');
const { cloudinary } = require('../config/cloudinary');
const createPost = async (req, res) => {
    try {
        const { title, description, tags, difficultyLevel } = req.body;

        // Create post object
        const postData = {
            userId: req.user.userId,
            title,
            description,
            tags,
            difficultyLevel
        };

        // If video file is uploaded, set contentLink to Cloudinary URL
        if (req.file) {
            postData.contentLink = req.file.path;
        }

        const post = new postModel(postData);
        await post.save();
        await post.populate('userId', 'username email');

        res.status(201).json({
            message: 'Post created successfully',
            post
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUserPosts = async (req, res) => {
    try {
        const posts = await postModel
            .find({ userId: req.user.userId })
            .populate('userId', 'username email')
            .populate('comments.userId', 'username')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await postModel
            .find()
            .populate('userId', 'username email profilePic')
            .populate('comments.userId', 'username')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const post = await postModel.findOne({ _id: id, userId: req.user.userId });
        if (!post) {
            return res.status(404).json({ message: 'Post not found or unauthorized' });
        }

        // Update description
        if (description !== undefined) {
            post.description = description;
        }

        // If new video file is uploaded, update contentLink
        if (req.file) {
            // Delete old video if exists
            if (post.contentLink && post.contentLink.includes('cloudinary.com')) {
                const publicId = post.contentLink.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
            }
            post.contentLink = req.file.path;
        }

        await post.save();
        await post.populate('userId', 'username email');

        res.json({
            message: 'Post updated successfully',
            post
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await postModel.findOne({ _id: id, userId: req.user.userId });
        if (!post) {
            return res.status(404).json({ message: 'Post not found or unauthorized' });
        }

        // Delete video from Cloudinary if exists
        if (post.contentLink && post.contentLink.includes('cloudinary.com')) {
            const publicId = post.contentLink.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        }

        await postModel.findByIdAndDelete(id);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deletePostAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Delete video from Cloudinary if exists
        if (post.contentLink && post.contentLink.includes('cloudinary.com')) {
            const publicId = post.contentLink.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        }

        await postModel.findByIdAndDelete(id);
        res.json({ message: 'Post deleted successfully by admin' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({
            userId: req.user.userId,
            text: text.trim()
        });

        await post.save();
        await post.populate('comments.userId', 'username');

        res.json({
            message: 'Comment added successfully',
            comments: post.comments
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const searchByTag = async (req, res) => {
    try {
        const { tag } = req.query;

        if (!tag) {
            return res.status(400).json({ message: 'Tag parameter is required' });
        }

        const posts = await postModel
            .find({ tags: { $in: [tag] } })
            .populate('userId', 'username email profilePic')
            .populate('comments.userId', 'username')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file provided' });
        }

        res.json({
            message: 'Video uploaded successfully',
            videoUrl: req.file.path,
            publicId: req.file.filename
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createPost,
    getUserPosts,
    getAllPosts,
    updatePost,
    deletePost,
    deletePostAdmin,
    addComment,
    searchByTag,
    uploadVideo
};

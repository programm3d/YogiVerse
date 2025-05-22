const { postModel } = require('../model/User');
const { cloudinary } = require('../config/cloudinary');

const createPost = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        console.log('Request user:', req.user);

        const { title, description, tags, difficultyLevel } = req.body;

        // Validate required fields
        if (!title || !description) {
            return res.status(400).json({
                message: 'Title and description are required'
            });
        }

        // Validate user authentication
        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                message: 'User authentication required'
            });
        }

        // Create post object
        const postData = {
            userId: req.user.userId,
            title,
            description,
            tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []),
            difficultyLevel
        };

        // If video file is uploaded, set contentLink to Cloudinary URL
        if (req.file && req.file.path) {
            postData.contentLink = req.file.path;
            console.log('Video URL saved:', req.file.path);
        }

        console.log('Post data to save:', postData);

        const post = new postModel(postData);
        const savedPost = await post.save();

        console.log('Post saved successfully:', savedPost._id);

        // Populate user details
        await savedPost.populate('userId', 'username email');

        res.status(201).json({
            message: 'Post created successfully',
            post: savedPost
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

const getUserPosts = async (req, res) => {
    try {
        // Validate user authentication
        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                message: 'User authentication required'
            });
        }

        const posts = await postModel
            .find({ userId: req.user.userId })
            .populate('userId', 'username email')
            .populate('comments.userId', 'username')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
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
        console.error('Error fetching all posts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        // Validate user authentication
        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                message: 'User authentication required'
            });
        }

        const post = await postModel.findOne({ _id: id, userId: req.user.userId });
        if (!post) {
            return res.status(404).json({ message: 'Post not found or unauthorized' });
        }

        // Update description
        if (description !== undefined) {
            post.description = description;
        }

        // If new video file is uploaded, update contentLink
        if (req.file && req.file.path) {
            // Delete old video if exists
            if (post.contentLink && post.contentLink.includes('cloudinary.com')) {
                try {
                    const publicId = post.contentLink.split('/').slice(-2).join('/').split('.')[0];
                    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
                } catch (deleteError) {
                    console.warn('Failed to delete old video:', deleteError.message);
                }
            }
            post.contentLink = req.file.path;
        }

        const updatedPost = await post.save();
        await updatedPost.populate('userId', 'username email');

        res.json({
            message: 'Post updated successfully',
            post: updatedPost
        });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate user authentication
        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                message: 'User authentication required'
            });
        }

        const post = await postModel.findOne({ _id: id, userId: req.user.userId });
        if (!post) {
            return res.status(404).json({ message: 'Post not found or unauthorized' });
        }

        // Delete video from Cloudinary if exists
        if (post.contentLink && post.contentLink.includes('cloudinary.com')) {
            try {
                const publicId = post.contentLink.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
            } catch (deleteError) {
                console.warn('Failed to delete video from Cloudinary:', deleteError.message);
            }
        }

        await postModel.findByIdAndDelete(id);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
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
            try {
                const publicId = post.contentLink.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
            } catch (deleteError) {
                console.warn('Failed to delete video from Cloudinary:', deleteError.message);
            }
        }

        await postModel.findByIdAndDelete(id);
        res.json({ message: 'Post deleted successfully by admin' });
    } catch (error) {
        console.error('Error deleting post (admin):', error);
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

        // Validate user authentication
        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                message: 'User authentication required'
            });
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
        console.error('Error adding comment:', error);
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
        console.error('Error searching by tag:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const uploadVideo = async (req, res) => {
    try {
        console.log('Upload video request - File:', req.file);

        if (!req.file) {
            return res.status(400).json({ message: 'No video file provided' });
        }

        res.json({
            message: 'Video uploaded successfully',
            videoUrl: req.file.path,
            publicId: req.file.filename
        });
    } catch (error) {
        console.error('Error uploading video:', error);
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
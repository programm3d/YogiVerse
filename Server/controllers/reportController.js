const createError = require('http-errors');
const Report = require('../models/Report');
const Post = require('../models/Post');
const User = require('../models/User');
const mongoose=require('mongoose');
const createReport = async (req, res, next) => {
    try {
        const { description, postId } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            throw createError(404, 'Post not found');
        }

        const report = new Report({
            userId: req.user.id,
            description,
            postId,
            postUserId: post.userId
        });

        await report.save();

        res.status(201).json({ success: true, report });
    } catch (err) {
        next(err);
    }
};

const getReports = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const reports = await Report.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('userId', 'username profilePic')
            .populate('postId', 'title contentLink')
            .populate('postUserId', 'username');

        const count = await Report.countDocuments();

        res.status(200).json({
            success: true,
            reports,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (err) {
        next(err);
    }
};
const deleteReport = async (req, res, next) => {
    const reportId=new mongoose.Types.ObjectId(req.params.id);
    const report = await Report.findByIdAndDelete(reportId);
    if (!report) {
        return res.status(404).json({
            message: 'Report not found'
        })
    }
    return res.status(200).json({
        success: true,
        message: 'Report deleted'
    })
}
module.exports = {
    createReport,
    getReports,
    deleteReport
};
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    contentLink: { type: String },
    createdAt: { type: Date, default: Date.now },
    title: { type: String, required: true },
    description: { type: String },
    tags: { type: [String] },
    difficultyLevel: {
        type: String,
        enum: ["Hard", "Medium", "Low"],
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    cloudinary_id: {
        type: String ,
        required:true
    },
});

module.exports = mongoose.model("Post", postSchema);
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePic: { type: String, default: "null" },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    createdAt: { type: Date, default: new Date() },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const postSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    contentLink: { type: String },
    createdAt: { type: Date, default: new Date() },
    title: { type: String, required: true },
    description: { type: String },
    tags: { type: [String] },
    difficultyLevel: {
        type: String,
        enum: ["Hard", "Medium", "Low"],
    },
    likes: { type: Number, default: 0 },
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        text: { type: String, maxLength: 200 },
        createdAt: { type: Date, default: new Date() }
    }],
});

// ✅ Prevent OverwriteModelError
const userModel = mongoose.models.user || mongoose.model("user", userSchema);
const postModel = mongoose.models.post || mongoose.model("post", postSchema);

module.exports = { userModel, postModel };

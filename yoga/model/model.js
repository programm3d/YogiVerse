const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    profilePic: { type: String, default: "not set yet" }
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const postSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    contentLink: { type: String },
    createdAt: { type: Date, default: Date.now },
    title: { type: String },
    description: { type: String },
    difficultyLevel: String
});

const userModel = model("user", userSchema);
const postModel = model("post", postSchema);

module.exports = { userModel, postModel };

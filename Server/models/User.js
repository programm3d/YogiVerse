const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String ,minLength:8},
    profilePic: { type: String, default: null },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    status: {
        type: String,
        enum: ["blocked", "active"],
        default: "active"
    },
    createdAt: { type: Date, default: Date.now },
    cloudinary_id: {
        type: String
    },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
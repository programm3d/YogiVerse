const { userModel } = require("../model/model");
const mongoose = require("mongoose");

async function registerValidator(req, res, next) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Please fill all fields" });
    }

    let userExist = await userModel.findOne({ email });
    if (userExist) {
        return res.status(400).json({ error: "User already exists" });
    }

    req.obj = {
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
    };

    next();
}

function validateVideoUpload(req, res, next) {
    let { title,description,contentLink,userId,difficultyLevel} = req.body;

    if (!title || !description || !contentLink || !userId || difficultyLevel === undefined) {
        return res.status(400).json({ error: "Please fill all fields" });
    }

    if (title.trim().length < 5) {
        return res.status(400).json({ error: "Title must be at least 5 characters long" });
    }

    if (isNaN(difficultyLevel)) {
        return res.status(400).json({ error: "Difficulty level must be a number" });
    }

    try {
        userId = new mongoose.Types.ObjectId(userId);
    } catch (err) {
        return res.status(400).json({ error: "Invalid user ID format" });
    }

    req.obj = {
        title: title.trim(),
        description: description.trim(),
        userId,
        contentLink: contentLink.trim(),
        difficultyLevel: parseInt(difficultyLevel),
    };

    next();
}

module.exports = { registerValidator, validateVideoUpload };

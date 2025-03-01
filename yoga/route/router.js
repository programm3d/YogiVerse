const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { userModel, postModel } = require("../model/model");
const {
  registerValidator,
  validateVideoUpload,
} = require("../validator/validator");

const router = express.Router();

// Signup Route (Secure with bcrypt)
router.post("/signup", registerValidator, async (req, res) => {
  try {
    const user = await userModel.create(req.obj);
    res.status(201).json({ data: user, message: "Signup successful" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", errors: err.message });
  }
});

// Login Route (Secure Password Check)
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", errors: err.message });
  }
});

// Post Video Route
const authMiddleware = require("../middleware/auth");

// 🔒 Protect Video Upload Route
router.post(
  "/postVideo",
  authMiddleware,
  validateVideoUpload,
  async (req, res) => {
    try {
      const post = await postModel.create({
        ...req.obj,
        userId: req.user.userId, // Use the logged-in user's ID
      });

      await userModel.findByIdAndUpdate(req.user.userId, {
        $push: { posts: post._id },
      });

      res
        .status(201)
        .json({ data: post, message: "Video uploaded successfully" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error creating video", errors: err.message });
    }
  }
);

// 🔒 Protect Delete Video Route
router.delete("/deletevideo/:id", authMiddleware, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this video" });
    }

    await postModel.findByIdAndDelete(req.params.id);
    await userModel.findByIdAndUpdate(post.userId, {
      $pull: { posts: post._id },
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting post", errors: err.message });
  }
});

//Get feed
router.get("/feed", async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await postModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $project: {
          _id: 1,
          contentLink: 1,
          title: 1,
          description: 1,
          createdAt: 1,
          username: { $arrayElemAt: ["$userDetails.username", 0] },
          profilePictureLink: { $arrayElemAt: ["$userDetails.profilePic", 0] },
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message: "Error occurred while fetching feed",
      errors: err.message,
    });
  }
});

router.get("/user/:id", async (req, res) => {
  let id = req.params.id;
  try {
    id = new mongoose.Types.ObjectId(id);
    let user = userModel.findById(id).then((user) => {
      res.status(200).json(user);
    });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({
      message: "error while getting user",
    });
  }
});
//to get user posted videos
router.get("/userPosted/:id", async (req, res) => {
  let userId = req.params.id;
  try {
    userId = new mongoose.Types.ObjectId(userId);
  } catch (err) {
    return res.status(500).json({
      message: "invalid userId",
    });
  }
  try {
    let userPosts = await postModel.aggregate([
      {
        $match: { userId: userId },
      },
    ]);
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "error while getting user posts",
    });
  }
});
router.get("/lead", async (req, res) => {
  try {
    let lead = await userModel.aggregate([
      {
        $addFields: {
          totalPosts: { $size: "$posts" },
        },
      },
      {
        $sort: {
          totalPosts: -1,
        },
      },
      {
        $project: {
          _id: 0,
          username: 1,
          email: 1,
          totalPosts: 1,
        },
      },
    ]);
    res.status(200).json(lead);
  } catch (err) {
    res.status(500).json({
      message: "error while getting lead",
      errors: err,
    });
  }
});

module.exports = router;

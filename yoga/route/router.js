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
//update user details
router.put("toUpdatePost/:id",async(req,res,next)=>{
  const {title,description}=req.body
  console.log(req.body,req.params.id)
  let obj={}
  if(!title && !description){
    return res.status(500).send("enter a one valid data")
  }
  if(title){
    obj.title=title
  }
  if(description){
    obj.description=description
  }
  let id=req.params.id
  try{
    id=new mongoose.Types.ObjectId(id)
  }
  catch(err){
    res.status(200).send("invalid id")
  }
  try{
    let post=await postModel.findByIdAndUpdate(id,obj)
        .then((result)=>{
          res.status(200).json({"updated":result})
        })
  }
  catch(err){
    res.status(200).send("error while updating")
  }


})
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

  validateVideoUpload,
  async (req, res) => {
    try {

      const post = await postModel.create(req.obj)

      await userModel.findByIdAndUpdate(req.obj.userId, {
        $push: { posts: post["_id"]},
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
router.delete("/deletevideo/:id", async (req, res) => {
  let id=req.params.id;
  try{

    id=new mongoose.Types.ObjectId(id);
  }
  catch(err){
    res.status(500).json({
      message: "Error deleting video",
    })
  }

  try {
    const post = await postModel.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });



    await postModel.findByIdAndDelete(id);
    let PostUserid=new mongoose.Types.ObjectId(post.userId);
    await userModel.findByIdAndUpdate(PostUserid, {
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
          diffCount:1,
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

//newly added api to increase difficulty count and to increase people who find easier
//give post id
router.patch("/increaseCount/:id/difficult", async (req, res) => {
let id=req.params.id
  try{
  id=new mongoose.Types.ObjectId(id);
  }
  catch(err){
  return res.status(500).json({
    "message": "error while updating increaseCount",
  })
  }
  try{
  let post=postModel.findByIdAndUpdate(id, {
        $inc: {diffCount: 1}
      }
  ).then(result=>{
    res.status(200).json(result);
  })
  }

  catch(err){
  res.status(500).json({
    "message": "error while updating increaseCount",
  })
  }
})


module.exports = router;

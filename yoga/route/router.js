const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { userModel, postModel } = require("../model/model");
const { registerValidator, validateVideoUpload } = require("../validator/validator");

const router = express.Router();

// Signup Route (Secure with bcrypt)
router.post("/signup", registerValidator, async (req, res) => {
    try {
        const user = await userModel.create(req.obj);
        res.status(201).json({ data: user, message: "Signup successful" });
    } catch (err) {
        res.status(500).json({ message: "Error creating user", errors: err.message });
    }
});

// Login Route (Secure Password Check)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Login error", errors: err.message });
    }
});

// Post Video Route
router.post("/postVideo", validateVideoUpload, async (req, res) => {
    try {
        const user = await userModel.findById(req.obj.userId);
        if (!user) return res.status(400).json({ error: "User not found" });

        const post = await postModel.create(req.obj);
        await userModel.findByIdAndUpdate(user._id, { $push: { posts: post._id } });

        res.status(201).json({ data: post, message: "Video uploaded successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error creating video", errors: err.message });
    }
});

// DELETE Post Route
router.delete("/deletevideo/:id", async (req, res) => {
    let id=req.params.id;
    try{
        id=new mongoose.Types.ObjectId(id);
    }
    catch(err){
        res.status(500).json({ message: "Error deleting video", errors: err.message });
    }
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        await postModel.findByIdAndDelete(req.params.id);
        await userModel.findByIdAndUpdate(post.userId, { $pull: { posts: post._id } });

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting post", errors: err.message });
    }
});
router.get('/feed',async(req, res) => {
    try{
        let { page, limit } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        // Fetch users with pagination
        // const post= await postModel.find({}).skip(skip).limit(limit)
        //     .then ((result)=>{
        //         res.status(200).json(result)
        //     })
        const post=await postModel.aggregate([
            {
                $lookup: {
                    from:"users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },

            {
                $project: {
                    _id: 0,
                    contentLink: 1,
                    title: 1,
                    description: 1,
                    createdAt: 1,
                    // userDetails: 1, // Add userDetails to inspect
                    username: { $arrayElemAt: ["$userDetails.username", 0] },
                    profilePictureLink: { $arrayElemAt: ["$userDetails.profilePic", 0] }
                }
            }
        ])
        res.status(200).json(post)
    }
    catch(err){
        res.status(500).json({
            "message":"error occured while creating feed",
            "errors":err
        })
    }
})

router.get("/user/:id",async(req, res) => {
    let id = req.params.id;
    try {
        id = new mongoose.Types.ObjectId(id);
        let user = userModel.findById(id)
            .then(user=>{
                res.status(200).json(user)
            })
        if (!user) {
            return res.status(400).json({error: 'User not found'});
        }
    }
    catch(err){
        res.status(500).json({
            "message":"error while getting user",
        })
    }
})
//to get user posted videos
router.get('/userPosted/:id',async(req, res) => {
    let userId=req.params.id
    try{
        userId=new mongoose.Types.ObjectId(userId);
    }
    catch(err){
        return res.status(500).json({
            "message":"invalid userId"
        })
    }
    try{
        let userPosts=await postModel.aggregate([
            {
                $match:{userId:userId}
            }
        ])
        res.status(200).json(userPosts)

    }
    catch(err){
        res.status(500).json({
            "error":err,
            "message":"error while getting user posts",
        })
    }


})
router.get("/lead",async(req, res) => {

    try {
        let lead = await userModel.aggregate([
            {
                $addFields: {
                    totalPosts: {$size: "$posts"}
                }
            },
            {
                $sort: {
                    totalPosts: -1
                }
            },
            {
                $project:{
                    _id:0,
                    username:1,
                    email:1,
                    totalPosts:1
                }
            }

        ])
        res.status(200).json(lead)
    }catch(err){
        res.status(500).json({
            "message":"error while getting lead",
            "errors":err
        })
    }
})


module.exports = router;

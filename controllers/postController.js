import User from "../models/User.js";
import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import { StatusCodes } from "http-status-codes";
import { spawn } from "child_process";
import checkPermissions from "../utils/checkPermissions.js";
import path from "path";

const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find()
			.populate("user")
			.sort({ createdAt: -1 });
		res.status(StatusCodes.OK).json(posts);
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
	}
};

const getPostById = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id).populate("user");

		if (!post) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ msg: "Post not found" });
		}

		res.status(StatusCodes.OK).json(post);
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
	}
};

const createPost = async (req, res) => {
    try {
        const newPost = new Post({
            text: req.body.text,
            user: req.user.userId,
            status: req.body.status,
        });
        const post = await newPost.save();
        res.status(StatusCodes.OK).json(post);
    } catch (err) {
        console.error(err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
};

const updatePostImage = async (req, res) => {
    try {
        if (req.files) {
            const postId = req.params.id;
            // Check if user exists
            const dbPost = await Post.findById(req.params.id).populate("user");
            if (dbPost) {
                // Update post image in database
                const listImages = [];

                for (let i = 0; i < req.files.length; i++) {
                    const imageUrl = `http://127.0.0.1:5000/images/posts/${postId}_${req.files[i].originalname}`;
                    listImages.push(imageUrl);
                }
                const updatePost = {
                    images: listImages,
                };

                await Post.findOneAndUpdate(
                    { _id: dbPost.id },
                    { $set: updatePost },
                    {
                        new: true,
                    }
                );
                res.status(StatusCodes.OK).json({
                    message: "Upload images successfully !",
                });
            } else {
                return res.status(404).json({
                    message: "Post not found!",
                });
            }
        } else {
            return res.status(400).json({
                message: "Image file not found!",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong!",
            error: error,
        });
    }
};

const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ msg: "Post not found" });
        }
        if (req.body.saver) {
            if (!post.beSaved.includes(req.body.saver)) {
                await post.updateOne({ $push: { beSaved: req.user.userId } });
                res.status(200).json("Save post success");
            } else {
                await post.updateOne({ $pull: { beSaved: req.user.userId } });
                res.status(200).json("Unsave post success");
            }
        }
        checkPermissions(req.user, post.user);
        const updatedPost = await Post.findOneAndUpdate(
            { _id: req.params.id },
            { text: req.body.text },
            {
                new: true,
                runValidators: true,
            }
        );
        res.status(StatusCodes.OK).json({ updatedPost });
    } catch (err) {
        console.error(err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
};

const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

        if (!post) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "Post not found!" });
        }

		checkPermissions(req.user, post.user);
        await Comment.deleteMany({ post: post });
        await Like.deleteMany({ post: post });
		await post.remove();

        res.status(StatusCodes.OK).json({
            message: "Delete post successfully!",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong!",
            error: err,
        });
    }
};

const predict = async (req, res) => {
    try {
        const text = req.body.text;
        let predictionVal = "negative";
        const python = spawn("python3", ["./predict/script.py", text]);
        python.stdout.on("data", (data) => {
            console.log("python data: ", data.toString());
            predictionVal = data.toString();
        });
        python.on("close", (code, signal) =>
            console.log(`process closed: code ${code} and signal ${signal}`)
        );
        setTimeout(() => {
            res.json(predictionVal.substring(0, 8));
        }, 4000);
    } catch (err) {
        console.error(err.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
};
export {
	createPost,
	updatePostImage,
	getAllPosts,
	getPostById,
	updatePost,
	deletePost,
	predict,
};

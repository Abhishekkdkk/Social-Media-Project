import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import PostComment from "../models/postComment.model.js";

const createPost = async (req, res) => {
  try {
    //console.log("Request body:", req.body);
    const { text, image } = req.body;
    const userId = req.user._id;
    var imageUrl = image;

    if (req.file) {
      //console.log("File received:", req.file);
      const localFilePath = req.file.path;
      imageUrl = await uploadonCloudinary(localFilePath);
      //console.log("Image uploaded to Cloudinary:", imageUrl);
    }
    const post = new Post({
      userId,
      text,
      image: imageUrl ? imageUrl.url : image,
    });
    await post.save();
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create post", error: error.message });
  }
};
const getPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "username avatar")
      .sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch posts", error: error.message });
  }
};
const togglePostLike = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const hasLiked = post.likedBy.includes(userId);

    if (hasLiked) {
      post.likedBy = post.likedBy.filter(
        (id) => id.toString() !== userId.toString(),
      );
      post.likecount = Math.max(post.likecount - 1, 0);
    } else {
      post.likedBy.push(userId);
      post.likecount += 1;
    }

    await post.save();

    return res.status(200).json({
      message: "Like toggled",
      likecount: post.likecount,
      isLiked: !hasLiked,
    });
  } catch (error) {
    next(error);
  }
};

const addPostComment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Comment text required" });
    }

    const comment = await PostComment.create({
      postId,
      userId,
      text,
    });

    return res.status(201).json({
      message: "Comment added",
      comment,
    });
  } catch (error) {
    next(error);
  }
};

const getPostComments = async (req, res, next) => {
  try {
    const postId = req.params.id;

    const comments = await PostComment.find({ postId })
      .populate("userId", "username avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      comments,
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    await PostComment.deleteMany({ postId: post._id });
    await Post.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  createPost,
  getPost,
  togglePostLike,
  addPostComment,
  getPostComments,
  deletePost,
};

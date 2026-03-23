import Video from "../models/video.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import {
  uploadonCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { getUserProfileByUsername } from "./user.controllers.js";
const uploadVideo = async (req, res, next) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ error: "Please provide all the required fields" });
    const { title, description } = req.body;
    if (!title || !description)
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    const userId = req.user._id;
    if (!req.files)
      return res
        .status(400)
        .json({ error: "Please upload a required video and thumbnail" });
    const Localvideopath = req.files.videourl[0].path;
    const Localthumbnailpath = req.files.thumbnail[0].path;
    const videoUrl = await uploadonCloudinary(Localvideopath);
    const thumbnailUrl = await uploadonCloudinary(Localthumbnailpath);
    const video = new Video({
      title,
      description,
      userId,
      videourl: videoUrl.secure_url,
      thumbnail: thumbnailUrl.secure_url,
    });
    await video.save();

    const user = await User.findById(userId);
    user.videos.push(video._id);
    await user.save({ validateBeforeSave: false });
    return res
      .status(201)
      .json({ message: "Video uploaded successfully", video });
  } catch (error) {
    next(error);
  }
};

const viewcount = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { viewcount: 1 },
      },
      {
        new: true,
      },
    );
    if (!video) return res.status(404).json({ error: "Video not found" });
    res.status(200).json({ message: "View count incremented", video });
  } catch (error) {
    next(error);
  }
};
const likecount = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const videoId = req.params.id;

    const user = await User.findById(userId);
    const video = await Video.findById(videoId);

    if (!user) return res.status(404).json({ error: "User not found" });
    if (!video) return res.status(404).json({ error: "Video not found" });

    // Ensure likedvideos is an array
    if (!Array.isArray(user.likedvideos)) user.likedvideos = [];

    let isLiked;

    if (user.likedvideos.includes(videoId)) {
      // Dislike
      user.likedvideos = user.likedvideos.filter(
        (id) => id.toString() !== videoId,
      );
      video.likecount = Math.max((video.likecount || 1) - 1, 0);
      isLiked = false;
    } else {
      // Like
      user.likedvideos.push(videoId);
      video.likecount = (video.likecount || 0) + 1;
      isLiked = true;
    }

    await user.save({ validateBeforeSave: false });
    await video.save();

    res.status(200).json({
      message: "Like toggled successfully",
      likecount: video.likecount,
      isLiked: isLiked,
    });
  } catch (error) {
    next(error);
  }
};

const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });
    await deleteFromCloudinary(video.videourl);
    await Video.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    next(error);
  }
};
const changeThumbnail = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });
    if (!req.file)
      return res
        .status(400)
        .json({ error: "Please upload a required thumbnail" });
    await deleteFromCloudinary(video.thumbnail);
    const Localthumbnailpath = req.file.path;
    const thumbnailUrl = await uploadonCloudinary(Localthumbnailpath);
    video.thumbnail = thumbnailUrl.secure_url;
    await video.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json({ message: "Thumbnail changed successfully", video });
  } catch (error) {
    next(error);
  }
};
const editTitle = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });
    const { title } = req.body;
    if (!title)
      return res.status(400).json({ error: "Please provide a new title" });
    video.title = title;
    await video.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json({ message: "Title changed successfully", video });
  } catch (error) {
    next(error);
  }
};
const editDescription = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });
    const { description } = req.body;
    if (!description)
      return res
        .status(400)
        .json({ error: "Please provide a new description" });
    video.description = description;
    await video.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json({ message: "Description changed successfully", video });
  } catch (error) {
    next(error);
  }
};

const videolist = async (req, res, next) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username avatar");
    return res.status(200).json({ videos });
  } catch (error) {
    next(error);
  }
};
const viewVideo = async (req, res, next) => {
  try {
    const videoDoc = await Video.findById(req.params.id);
    if (!videoDoc) return res.status(404).json({ error: "Video not found" });

    const owner = await User.findById(videoDoc.userId);
    const currentUserId = req.user ? req.user._id : null;

    let isLiked = false;

    if (currentUserId) {
      const currentUser = await User.findById(currentUserId);

      if (currentUser && Array.isArray(currentUser.likedvideos)) {
        // Use likedvideos array from the logged-in user
        isLiked = currentUser.likedvideos.some(
          (id) => id.toString() === req.params.id,
        );
      }
    }
    const userProfile = await getUserProfileByUsername(
      owner.username,
      currentUserId,
    );

    const video = {
      ...videoDoc._doc,
      user: userProfile,
      isLiked,
    };

    return res.status(200).json({ video });
  } catch (error) {
    next(error);
  }
};

const comment = async (req, res, next) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ error: "Please provide all the required fields" });
    const { text, parentText } = req.body || {};
    let repliedToId = req.body.repliedToId;
    const userId = req.user._id;
    const videoId = req.params.id;
    //const userId = await User.findById(user);

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Please provide comment text" });
    }

    if (!parentText) {
      const comment = await Comment.create({
        videoId,
        userId,
        text,
      });
      return res.status(201).json({
        message: "New Comment added successfully",
        comment,
      });
    }

    const parentComment = await Comment.findOne({ text: parentText });
    //console.log(parentComment);
    if (!parentComment) {
      return res.status(404).json({ error: "Parent comment not found" });
    }
    if (!repliedToId) {
      repliedToId = parentComment._id;
    }
    const reply = {
      userId,
      text,
      repliedTo: repliedToId,
    };
    parentComment.replies.push(reply);
    await parentComment.save({ validateBeforeSave: false });
    return res.status(201).json({
      message: "Reply added successfully",
      parentComment,
    });
  } catch (error) {
    next(error);
  }
};
const commentList = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    if (!videoId) {
      return res.status(400).json({ error: "Invalid or missing Video ID" });
    }

    const comments = await Comment.find({ videoId })
      .populate("userId", "username avatar")
      .populate("replies.userId", "username avatar");
    const commentCount = comments.length;
    const myId = req.user ? req.user._id : null;

    const currentUser = await User.findById(myId);
    const currentUserAvatar = currentUser ? currentUser.avatar.url : null;

    return res.status(200).json({ comments, commentCount, currentUserAvatar });
  } catch (err) {
    next(err);
  }
};
const commentLikeToggle = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const commentId = req.params.id;
    if (!userId || !commentId) {
      return res
        .status(400)
        .json({ error: "User ID and Comment ID are required" });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (!comment.likedByCurrentuser) {
      comment.likeCount += 1;
      comment.likedByCurrentuser = true;
    } else {
      comment.likeCount -= 1;
      comment.likedByCurrentuser = false;
    }
    await comment.save({ validateBeforeSave: false });
    return res.status(200).json({ comment });
  } catch (error) {
    next(error);
  }
};

const queryVideo = async (req, res, next) => {
  try {
    const searchQuery = req.query.q;
    //console.log("Search query:", searchQuery);
    if (!searchQuery || searchQuery.trim() === "") {
      return res.status(400).json({ error: "Please provide a search query" });
    }
    const videos = await Video.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ],
    }).populate("userId", "username avatar");
    return res.status(200).json({ videos });
  } catch (error) {
    next(error);
  }
};
export {
  uploadVideo,
  viewcount,
  likecount,
  deleteVideo,
  changeThumbnail,
  editTitle,
  editDescription,
  videolist,
  viewVideo,
  comment,
  commentList,
  commentLikeToggle,
  queryVideo,
};

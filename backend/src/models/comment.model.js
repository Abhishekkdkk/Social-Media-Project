import mongoose from "mongoose";
import { text } from "stream/consumers";
const commentSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  likedByCurrentuser: {
    type: Boolean,
    default: false,
  },
  replies: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      repliedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String, required: true },
      likeCount: { type: Number, default: 0 },
      likedByCurrentuser: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;

import mongoose from "mongoose";
const videoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,

  },

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  videourl: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  likecount: {
    type: Number,
    default: 0,
  },
  viewcount: {
    type: Number,
    default: 0,
  },
  comments:{
  
  }
});

const Video = mongoose.model("Video", videoSchema);

export default Video;

import Video from "../models/video.model.js";
import User from "../models/user.model.js";
import { uploadonCloudinary,deleteFromCloudinary } from "../utils/cloudinary.js";

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
      }
    );
    if (!video) return res.status(404).json({ error: "Video not found" });
    res.status(200).json({ message: "View count incremented", video });
  } catch (error) {
    next(error);
  }
};

const likecount = async (req, res, next) => {
  try {
    const video =await Video.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { likecount: 1 },
      },
      {
        new: true,
      }
    );
    if (!video) return res.status(404).json({ error: "Video not found" });
    res.status(200).json({ message: "Like count incremented", video });
  } catch (error) {
    next(error);
  }
};

const deleteVideo = async (req, res, next) => {
  try{
    const video = await Video.findById(req.params.id);
    if(!video) return res.status(404).json({error:"Video not found"});
    await deleteFromCloudinary(video.videourl);
    await Video.findByIdAndDelete(req.params.id);
    return res.status(200).json({message:"Video deleted successfully"});
  }
  catch(error){
    next(error);
  }
};
const changeThumbnail = async (req, res, next) => {
  try{
    const video = await Video.findById(req.params.id);
    if(!video) return res.status(404).json({error:"Video not found"});
    if(!req.file) return res.status(400).json({error:"Please upload a required thumbnail"});
    await deleteFromCloudinary(video.thumbnail);
    const Localthumbnailpath = req.file.path;
    const thumbnailUrl = await uploadonCloudinary(Localthumbnailpath);
    video.thumbnail = thumbnailUrl.secure_url;
    await video.save({validateBeforeSave:false});
    return res.status(200).json({message:"Thumbnail changed successfully",video});
  }
  catch(error){
    next(error);
  }
};
const editTitle=async(req,res,next)=>{
  try{
    const video = await Video.findById(req.params.id);
    if(!video) return res.status(404).json({error:"Video not found"});
    const { title } = req.body;
    if(!title) return res.status(400).json({error:"Please provide a new title"});
    video.title = title;
    await video.save({validateBeforeSave:false});
    return res.status(200).json({message:"Title changed successfully",video});
  }
  catch(error){
    next(error);
  }
};
const editDescription=async(req,res,next)=>{
  try{
    const video = await Video.findById(req.params.id);
    if(!video) return res.status(404).json({error:"Video not found"});
    const { description } = req.body;
    if(!description) return res.status(400).json({error:"Please provide a new description"});
    video.description = description;
    await video.save({validateBeforeSave:false});
    return res.status(200).json({message:"Description changed successfully",video});
  }
  catch(error){
    next(error);
  }
}
;
export { uploadVideo, viewcount, likecount,deleteVideo,changeThumbnail,editTitle,editDescription };

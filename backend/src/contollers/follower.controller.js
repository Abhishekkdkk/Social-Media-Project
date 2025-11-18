import User from "../models/user.model.js";
import followerModel from "../models/follower.model.js";

// const isFollowing = async (req, res, next) => {
//   try {
//     const channelId = req.params.channel;
//     const userId = req.user._id;
//     if (!channelId) {
//       return res.status(400).json({ error: "Invalid channel ID" });
//     }
//     const follower = await followerModel.findOne({
//       follower: userId,
//       channel: channelId,
//     });
//     if (follower) {
//       return res.status(200).json({ isFollowing: true });
//     } else {
//       return res.status(200).json({ isFollowing: false });
//     }
//   } catch (error) {
//     next(error);
//   }
// };
const followUser = async (req, res, next) => {
  try {
    const channelId = req.user._id;
    const channelusername = req.params.channel;
    const channel = await User.findOne({ username: channelusername });
    if (!channel) {
      return res.status(400).json({ error: "Valid Channel ID is required" });
    }

    if (channelId.toString() === channel._id.toString()) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }
    const alreadyFollowing = await followerModel.findOne({
      follower: channelId,
      channel: channel._id,
    });

    if (alreadyFollowing) {
      return res
        .status(400)
        .json({ error: "You are already following this user" });
    }
    const follower = new followerModel({
      follower: channelId,
      channel: channel._id,
    });
    await follower.save();
    return res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    next(error);
  }
};

export { followUser };

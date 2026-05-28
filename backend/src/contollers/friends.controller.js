import User from "../models/user.model.js";
import FriendRequest from "../models/friendrequest.model.js";
import Friendship from "../models/friendship.model.js";

const sendFriendRequest = async (req, res, next) => {
  try {
    const senderId = req.user._id;
    const recieverUsername = req.params.username;
    const reciever = await User.findOne({ username: recieverUsername });
    if (!reciever) {
      return res.status(404).json({ error: "User not found" });
    }
    if (senderId.toString() === reciever._id.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot send friend request to yourself" });
    }
    const existingRequest = await FriendRequest.findOne({
      senderId,
      receiverId: reciever._id,
    });
    if (existingRequest) {
      return res.status(400).json({ error: "Friend request already sent" });
    }
    const existingFriendship = await Friendship.findOne({
      userId: senderId,
      friendId: reciever._id,
    });
    if (existingFriendship) {
      return res.status(400).json({ error: "You are already friends" });
    }
    const friendRequest = new FriendRequest({
      senderId,
      receiverId: reciever._id,
    });
    await friendRequest.save();
    return res
      .status(200)
      .json({ message: "Friend request sent successfully" });
  } catch (error) {
    next(error);
  }
};

const acceptFriendRequest = async (req, res, next) => {
  try {
    const recieverId = req.user._id;
    const senderUsername = req.params.username;
    const sender = await User.findOne({ username: senderUsername });
    if (!sender) {
      return res.status(404).json({ error: "User not found" });
    }
    const friendRequest = await FriendRequest.findOne({
      senderId: sender._id,
      receiverId: recieverId,
    });
    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found" });
    }
    const friendship1 = new Friendship({
      userId: sender._id,
      friendId: recieverId,
    });
    const friendship2 = new Friendship({
      userId: recieverId,
      friendId: sender._id,
    });
    await friendship1.save();
    await friendship2.save();
    await FriendRequest.deleteOne({ _id: friendRequest._id });
    await User.findByIdAndUpdate(sender._id, { $inc: { friendscount: 1 } });
    await User.findByIdAndUpdate(recieverId, { $inc: { friendscount: 1 } });
    return res
      .status(200)
      .json({ message: "Friend request accepted successfully" });
  } catch (error) {
    next(error);
  }
};

const rejectFriendRequest = async (req, res, next) => {
  try {
    const recieverId = req.user._id;
    const senderUsername = req.params.username;
    const sender = await User.findOne({ username: senderUsername });
    if (!sender) {
      return res.statuts(400).json({ error: "User not found" });
    }
    const friendRequest = await FriendRequest.findOne({
      senderId: sender._id,
      receiverId: recieverId,
    });
    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found" });
    }
    await FriendRequest.deleteOne({ _id: friendRequest._id });
    return res
      .status(200)
      .json({ message: "Friend request rejected successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteFriend = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const friendUsername = req.params.username;
    const friend = await User.findOne({ username: friendUsername });
    if (!friend) {
      return res.status(404).json({ error: "User not found" });
    }
    const friendship1 = await Friendship.findOne({
      userId,
      friendId: friend._id,
    });
    const friendship2 = await Friendship.findOne({
      userId: friend._id,
      friendId: userId,
    });
    if (!friendship1 || !friendship2) {
      return res.status(404).json({ error: "Friendship not found" });
    }
    await Friendship.deleteOne({ _id: friendship1._id });
    await Friendship.deleteOne({ _id: friendship2._id });
    return res.status(200).json({ message: "Friend deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const mutualFriends = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const otherUsername = req.params.username;
    const otherUser = await User.findOne({ username: otherUsername });
    if (!otherUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const friendships1 = await Friendship.find({ userId }).select("friendId");
    //console.log(friendships1);
    const friendships2 = await Friendship.find({
      userId: otherUser._id,
    }).select("friendId");
    //console.log(friendships2);
    const friendIds1 = friendships1.map((f) => f.friendId.toString());
    const friendIds2 = friendships2.map((f) => f.friendId.toString());
    const mutualFriendIds = friendIds1.filter((id) => friendIds2.includes(id));
    const mutualFriends = await User.find({
      _id: { $in: mutualFriendIds },
    }).select("username avatar");
    const mutualFriendcount = mutualFriends.length;
    return res.status(200).json({ mutualFriends, mutualFriendcount });
  } catch (error) {
    next(error);
  }
};
const friendSuggestions = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();

    const removedIds = req.body?.removedIds || [];
    const removedSet = new Set(removedIds.map((id) => id.toString()));

    // 1. Get user's friends
    const friends = await Friendship.find({ userId }).select("friendId");
    const friendIds = friends.map((f) => f.friendId.toString());
    const friendSet = new Set(friendIds);

    // 2. Get friends of friends
    const friendoffriends = await Friendship.find({
      userId: { $in: friendIds },
    }).select("friendId");

    const friendoffriendIds = friendoffriends.map((f) => f.friendId.toString());

    // 3. Pending requests (sent/received between user + friends network)
    const pendingRequests = await FriendRequest.find({
      $or: [
        { senderId: userId },
        { receiverId: userId },
        { senderId: { $in: friendIds } },
        { receiverId: { $in: friendIds } },
      ],
    }).select("senderId receiverId");

    const blockedIds = new Set();

    pendingRequests.forEach((req) => {
      blockedIds.add(req.senderId.toString());
      blockedIds.add(req.receiverId.toString());
    });

    // 4. Filter suggestions properly
    const suggestionsIds = friendoffriendIds.filter(
      (id) =>
        id !== userId &&
        !friendSet.has(id) &&
        !blockedIds.has(id) &&
        !removedSet.has(id),
    );

    // 5. No suggestions case
    if (suggestionsIds.length === 0) {
      return res
        .status(200)
        .json({ message: "No friend suggestions available", suggestions: [] });
    }

    // 6. Frequency calculation (mutual friends count)
    const frequency = {};
    for (const id of suggestionsIds) {
      frequency[id] = (frequency[id] || 0) + 1;
    }

    // 7. Sort by frequency
    const sortedSuggestions = [...new Set(suggestionsIds)].sort(
      (a, b) => (frequency[b] || 0) - (frequency[a] || 0),
    );

    // 8. Fetch user details
    const suggestions = await User.find({
      _id: { $in: sortedSuggestions },
    }).select("username avatar");

    const userMap = new Map();
    suggestions.forEach((user) => {
      userMap.set(user._id.toString(), user);
    });

    // 9. Attach mutual friend count
    const orderedSuggestions = sortedSuggestions
      .map((id) => {
        const user = userMap.get(id);
        if (!user) return null;

        return {
          ...user.toObject(),
          mutualFriendsCount: frequency[id] || 0,
        };
      })
      .filter(Boolean);

    // 10. Response
    return res.status(200).json({
      suggestions: orderedSuggestions,
    });
  } catch (error) {
    next(error);
  }
};
export {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  deleteFriend,
  mutualFriends,
  friendSuggestions,
};

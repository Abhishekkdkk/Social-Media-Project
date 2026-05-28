import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

const createChat = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const myUserId = req.user._id.toString();

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    let members = [myUserId, userId];

    if (!members || !Array.isArray(members) || members.length !== 2) {
      return res.status(400).json({
        error: "Exactly two members are required to create a chat",
      });
    }

    // validate users
    const validMembers = await User.find({ _id: { $in: members } });

    if (validMembers.length !== 2) {
      return res.status(400).json({
        error: "One or more member IDs are invalid",
      });
    }

    members = members.sort();

    let chatExists = await Chat.findOne({
      members: { $all: members, $size: 2 },
    });

    if (chatExists) {
      return res.status(400).json({
        error: "Chat already exists",
      });
    }

    const chat = await Chat.create({
      members,
    });

    return res.status(200).json({
      message: "Chat created successfully",
      chatId: chat._id,
    });
  } catch (error) {
    next(error);
  }
};

const getUserChats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Get chats
    const chats = await Chat.find({ members: userId }).populate(
      "members",
      "username avatar.url",
    );

    // 2. Filter invalid chats
    const validChats = chats.filter((chat) => {
      return chat.members.length === 2 && chat.members.every((m) => m && m._id);
    });

    const chatIds = validChats.map((c) => c._id);

    // 3. Get last messages
    const lastMessages = await Message.aggregate([
      {
        $match: {
          chatId: { $in: chatIds },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$chatId",
          text: { $first: "$text" },
          read: { $first: "$read" },
          sender: { $first: "$senderId" },
          createdAt: { $first: "$createdAt" },
        },
      },
    ]);

    // 4. Format response
    const formattedChats = validChats.map((chat) => {
      const otherMember = chat.members.find(
        (m) => m._id.toString() !== userId.toString(),
      );

      const lastMessageObj = lastMessages.find(
        (m) => m._id.toString() === chat._id.toString(),
      );

      return {
        _id: chat._id,
        otherMember,
        lastMessage: lastMessageObj || null,
        lastMessageTime: lastMessageObj?.createdAt || null,
      };
    });

    return res.status(200).json({
      message: "User chats retrieved successfully",
      chats: formattedChats,
    });
  } catch (error) {
    next(error);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("username avatar.url");
    return res
      .status(200)
      .json({ message: "Users retrieved successfully", users });
  } catch (error) {
    next(error);
  }
};
export { createChat, getUserChats, searchUsers };

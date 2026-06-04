import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

const newMessage = async (req, res, next) => {
  try {
    const senderId = req.user._id;
    const { chatId, text } = req.body;

    if (!chatId || !text) {
      return res.status(400).json({ error: "Chat ID and text are required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const message = await Message.create({
      senderId,
      chatId,
      text,
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      $inc: { unReadMessagesCount: 1 },
    });

    const populated = await Message.findById(message._id).populate("senderId");

    // 🔥 SOCKET EMIT (THIS IS WHAT YOU ARE MISSING)
    const io = req.app.get("io");

    io.to(String(chatId)).emit("receive_message", {
      _id: populated._id,
      chatId: String(chatId),
      senderId: populated.senderId,
      text: populated.text,
      createdAt: populated.createdAt,
    });

    return res.status(200).json({
      message: "Message sent successfully",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getChatMessages = async (req, res, next) => {
  try {
    const chatId = req.params.chatId;
    if (!chatId) {
      return res.status(400).json({ error: "Chat ID is required" });
    }
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    await Message.updateMany(
      {
        chatId,
        senderId: { $ne: req.user._id },
        read: false,
      },
      { $set: { read: true } },
    );
    return res
      .status(200)
      .json({ message: "Chat messages retrieved successfully", messages });
  } catch (error) {
    next(error);
  }
};
export { newMessage, getChatMessages };

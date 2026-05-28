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

    const message = new Message({
      senderId,
      chatId,
      text,
    });
    await message.save();
    chat.lastMessage = message._id;
    chat.unReadMessagesCount = (chat.unReadMessagesCount || 0) + 1;
    await chat.save();
    return res
      .status(200)
      .json({ message: "Message sent successfully", messageId: message._id });
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

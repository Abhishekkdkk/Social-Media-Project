import mongoose from "mongoose";
const chatSchema = new mongoose.Schema(
  {
    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    lastMessageTime: {
      type: Date,
    },
    unReadMessagesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
const Chat = mongoose.model("Chat", chatSchema);
export default Chat;

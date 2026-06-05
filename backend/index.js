import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import http from "http";
import { Server } from "socket.io";
import Message from "./src/models/message.model.js";

dotenv.config();
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_BASE_URL,
    credentials: true,
  },
});
const onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  // USER ONLINE REGISTRATION
  socket.on("user_online", (userId) => {
    onlineUsers.set(userId, socket.id);

    io.emit("online_users", Array.from(onlineUsers.keys()));
  });

  // USER DISCONNECT
  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit("online_users", Array.from(onlineUsers.keys()));
  });

  socket.on("join_chat", (chatId) => {
    socket.join(String(chatId));
  });

  socket.on("leave_chat", (chatId) => {
    socket.leave(String(chatId));
  });

  socket.on("send_message", async (data) => {
    try {
      const { chatId, text, senderId } = data;

      const message = await Message.create({
        chatId,
        senderId,
        text,
      });

      const populated = await Message.findById(message._id).populate(
        "senderId",
      );

      io.to(String(chatId)).emit("receive_message", {
        _id: populated._id,
        chatId: String(chatId),
        senderId: populated.senderId,
        text: populated.text,
        createdAt: populated.createdAt,
      });
    } catch (err) {
      console.log(err);
    }
  });
});
app.set("io", io);
server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running`);
});

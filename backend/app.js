import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

import userRouter from "./src/routes/user.route.js";
import videoRouter from "./src/routes/video.route.js";
import chatRouter from "./src/routes/chat.route.js";
import messageRouter from "./src/routes/message.route.js";
import postRouter from "./src/routes/post.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/users", userRouter);
app.use("/api/videos", videoRouter);
app.use("/api/posts", postRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

export default app;

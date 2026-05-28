import express from "express";
import { Router } from "express";
const router = Router();
import verifyjwt from "../middlewares/auth.middleware.js";
import {
  newMessage,
  getChatMessages,
} from "../contollers/message.controller.js";
router.route("/new-message").post(verifyjwt, newMessage);
router.route("/get-chat-messages/:chatId").get(verifyjwt, getChatMessages);
export default router;

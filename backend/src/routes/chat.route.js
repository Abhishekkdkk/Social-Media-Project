import express from "express";
import { Router } from "express";
const router = Router();
import verifyjwt from "../middlewares/auth.middleware.js";
import {
  createChat,
  getUserChats,
  searchUsers,
} from "../contollers/chat.controller.js";
router.route("/create-new-chat").post(verifyjwt, createChat);
router.route("/").get(verifyjwt, getUserChats);
router.route("/search-users").get(verifyjwt, searchUsers);
export default router;

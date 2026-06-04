import express from "express";
import { Router } from "express";
import {
  createPost,
  getPost,
  togglePostLike,
  addPostComment,
  getPostComments,
  deletePost,
} from "../contollers/posts.controller.js";
import verifyjwt from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
const router = Router();
router.route("/getposts").get(getPost);
router.route("/uploadpost").post(verifyjwt, upload.single("image"), createPost);
router.post("/:id/like", verifyjwt, togglePostLike);

router.post("/:id/comment", verifyjwt, addPostComment);
router.get("/:id/comments", getPostComments);

router.delete("/:id/delete", verifyjwt, deletePost);

export default router;

import express from "express";
import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import {
  uploadVideo,
  viewcount,
  likecount,
  deleteVideo,
  changeThumbnail,
  editTitle,
  editDescription,
  videolist,
  viewVideo,
  comment,
  commentList,
  commentLikeToggle,
  queryVideo,
} from "../contollers/video.controller.js";
import verifyjwt from "../middlewares/auth.middleware.js";
const router = Router();
router
  .route("/upload")
  .post(
    verifyjwt,
    upload.fields([{ name: "videourl" }, { name: "thumbnail" }]),
    uploadVideo,
  );
router.route("/search").get(queryVideo);
router.route("/:id").get(verifyjwt, viewVideo);
router.route("/:id/view").put(viewcount);

router.route("/:id/like").put(verifyjwt, likecount);
router.route("/:id/delete").delete(verifyjwt, deleteVideo);
router
  .route("/:id/changeThumbnail")
  .post(verifyjwt, upload.single("thumbnail"), changeThumbnail);
router.route("/:id/editTitle").post(verifyjwt, editTitle);
router.route("/:id/editDescription").post(verifyjwt, editDescription);
router.route("/").post(videolist);
router.route("/:id/comment").post(verifyjwt, comment);
router.route("/:id/commentlist").get(verifyjwt, commentList);
router.route("/:id/:commentid/like").post(verifyjwt, commentLikeToggle);

export default router;

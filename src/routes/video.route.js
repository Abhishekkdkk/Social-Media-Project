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
} from "../contollers/video.controller.js";
import verifyjwt from "../middlewares/auth.middleware.js";
const router = Router();
router
  .route("/upload")
  .post(
    verifyjwt,
    upload.fields([{ name: "videourl" }, { name: "thumbnail" }]),
    uploadVideo
  );
router.route("/:id/view").put(viewcount);
router.route("/:id/like").put(likecount);
router.route("/:id/delete").delete(verifyjwt, deleteVideo);
router
  .route("/:id/changeThumbnail")
  .post(verifyjwt, upload.single("thumbnail"), changeThumbnail);
router.route("/:id/editTitle").post(verifyjwt, editTitle);
router.route("/:id/editDescription").post(verifyjwt, editDescription);
export default router;

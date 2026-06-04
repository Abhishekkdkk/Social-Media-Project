import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import verifyjwt from "../middlewares/auth.middleware.js";

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

const router = Router();

router
  .route("/upload")
  .post(
    verifyjwt,
    upload.fields([{ name: "videourl" }, { name: "thumbnail" }]),
    uploadVideo,
  );

// search videos
router.route("/search").get(queryVideo);

router.route("/").post(videolist);

router.route("/:id/view").put(viewcount);
router.route("/:id/like").put(verifyjwt, likecount);

router.route("/:id/delete").delete(verifyjwt, deleteVideo);

router
  .route("/:id/changeThumbnail")
  .post(verifyjwt, upload.single("thumbnail"), changeThumbnail);

router.route("/:id/editTitle").post(verifyjwt, editTitle);
router.route("/:id/editDescription").post(verifyjwt, editDescription);

router.route("/:id/comment").post(verifyjwt, comment);
router.route("/:id/commentlist").get(verifyjwt, commentList);
router.route("/:id/:commentid/like").post(verifyjwt, commentLikeToggle);

router.route("/:id").get(verifyjwt, viewVideo);

export default router;

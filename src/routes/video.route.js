import express from "express";
import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import {
  uploadVideo,
  viewcount,
  likecount,
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
export default router;

import express from "express";
import { Router } from "express";
import {
  userRegister,
  userLogin,
  logout,
  refreshAccessToken,
} from "../contollers/user.controllers.js";
import upload from "../middlewares/multer.middleware.js";
import verifyjwt from "../middlewares/auth.middleware.js";
const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), userRegister);

router.route("/login").post(userLogin);
router.route("/logout").post(verifyjwt, logout);
//frontend guy will write a code to call this api everytime the access token expires
router.route("/refresh").post(refreshAccessToken);
export default router;

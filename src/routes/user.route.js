import express from "express";
import { Router } from "express";
import {
  userRegister,
  userLogin,
  logout,
  refreshAccessToken,
  changePassword,
  changeAvatar,
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

router.route("/changePassword").post(verifyjwt, changePassword); //give oldPassword and newPassword in body
router
  .route("/changeAvatar")
  .post(
    verifyjwt,
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    changeAvatar
  ); //upload new avatar in form-data with key as avatar
export default router;

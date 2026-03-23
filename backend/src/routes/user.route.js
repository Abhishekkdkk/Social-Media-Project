import express from "express";
import { Router } from "express";
import {
  userRegister,
  userLogin,
  logout,
  refreshAccessToken,
  changePassword,
  changeAvatar,
  userProfile,
} from "../contollers/user.controllers.js";
import { followUser, unfollowUser } from "../contollers/follower.controller.js";
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

router.route("/profile/:username").get(verifyjwt, userProfile); //give username as params
router.route("/follow/:channel").post(verifyjwt, followUser); //give channelId as params
router.route("/unfollow/:channel").post(verifyjwt, unfollowUser);

//give channelId as params
//   router.route("/test").get((req, res) => {
//   const randomData = {
//     users: [
//       { id: 1, name: "Alice", age: Math.floor(Math.random() * 50) + 18 },
//       { id: 2, name: "Bob", age: Math.floor(Math.random() * 50) + 18 },
//       { id: 3, name: "Charlie", age: Math.floor(Math.random() * 50) + 18 },
//     ],
//     timestamp: new Date(),
//   };
//   res.json(randomData);
// });

export default router;

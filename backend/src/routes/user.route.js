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
  getMe,
} from "../contollers/user.controllers.js";
import { followUser, unfollowUser } from "../contollers/follower.controller.js";
import upload from "../middlewares/multer.middleware.js";
import {
  acceptFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
  deleteFriend,
  mutualFriends,
  friendSuggestions,
} from "../contollers/friends.controller.js";
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
    changeAvatar,
  ); //upload new avatar in form-data with key as avatar

router.route("/profile/:id").get(verifyjwt, userProfile);
//give username as params
router.route("/follow/:channel").post(verifyjwt, followUser); //give channelId as params
router.route("/unfollow/:channel").post(verifyjwt, unfollowUser);
router.route("/friendrequest/:username").post(verifyjwt, sendFriendRequest); //give username of the person you want to send friend request to as params
router
  .route("/acceptfriendrequest/:username")
  .post(verifyjwt, acceptFriendRequest); //give username of the person whose friend request you want to accept as params
router
  .route("/rejectfriendrequest/:username")
  .post(verifyjwt, rejectFriendRequest); //give username of the person whose friend request you want to reject as params
router.route("/deletefriend/:username").post(verifyjwt, deleteFriend); //give username of the friend you want to delete as params
router.route("/mutualfriends/:username").get(verifyjwt, mutualFriends); //give username of the person whose mutual friends you want to see as params
router.route("/friendsuggestions").post(verifyjwt, friendSuggestions); //get friend suggestions for the logged-in user
router.route("/me").get(verifyjwt, getMe); //get profile of logged-in user
export default router;

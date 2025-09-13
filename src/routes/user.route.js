import express from "express";
import { Router } from "express";
import {
  userRegister,
  userLogin,
  logout,
} from "../contollers/user.controllers.js";
import upload from "../middlewares/multer.middleware.js";
import verifyjwt from "../middlewares/auth.middleware.js";
const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), userRegister);

router.route("/login").post(userLogin);
router.route("/logout").post(verifyjwt, logout);

export default router;

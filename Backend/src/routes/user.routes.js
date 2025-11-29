import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import {registeruser, loginuser, logoutuser, refreshAccessToken, changepw, changeAvatar} from '../controllers/user.controller.js';
import verifyjwt from '../middlewares/auth.middleware.js';

let router = express.Router();

router.route('/register').post(upload.single('avatar'), registeruser);
router.route('/login').post(loginuser);
router.route('/logout').post(verifyjwt, logoutuser);
router.route('/refreshAccessToken').put(refreshAccessToken);
router.route('/changePassword').put(verifyjwt, changepw);
router.route('/changeAvatar').put(upload.single('avatar'), verifyjwt, changeAvatar);

export default router;
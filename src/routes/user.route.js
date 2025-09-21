import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import {registeruser, loginuser, logoutuser, refreshAccessToken, changepw, changeAvatar} from '../controllers/user.controller.js';
import verifyjwt from '../middlewares/auth.middleware.js';
let router = express.Router();

router.post('/register',upload.single('avatar'), registeruser);
router.post('/login', loginuser);
router.post('/logout', verifyjwt, logoutuser);
router.post('/refreshAccessToken', refreshAccessToken);
router.post('/changePassword', verifyjwt, changepw);
router.post('/changeAvatar', upload.single('avatar'), verifyjwt, changeAvatar);
export default router;
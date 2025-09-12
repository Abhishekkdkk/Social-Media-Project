import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import {registeruser, loginuser, logoutuser} from '../controllers/user.controller.js';

let router = express.Router();

router.post('/register',upload.single('avatar'), registeruser);
router.post('/login', loginuser);
router.post('/logout', logoutuser);
export default router;
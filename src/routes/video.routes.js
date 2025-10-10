import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import verifyjwt from '../middlewares/auth.middleware.js';
import {uploadvdo, viewcount, likecount, unlike, delvdo, sharecount, changethumbnail, addcomment, delcomment, editcomment } from '../controllers/video.controller.js';

let router = express.Router();

router.route('/upload').post(verifyjwt, upload.fields([{name : 'vdo'}, {name : 'thumbnail'}]), uploadvdo);
router.route('/:id/view').put(viewcount);
router.route('/:id/like').put(verifyjwt, likecount);
router.route('/:id/unlike').put(verifyjwt, unlike);
router.route('/:id/share').put(verifyjwt, sharecount);
router.route('/:id/delete').delete(verifyjwt, delvdo);
router.route('/:id/changethumbnail').put(verifyjwt, upload.single('thumbnail'), changethumbnail);
router.route('/:id/comment').post(verifyjwt, addcomment);
router.route('/:vdoid/comment/:cmtid').delete(verifyjwt, delcomment);
router.route ('/:vdoid/comment/:cmtid').put(verifyjwt, editcomment);

export default router;
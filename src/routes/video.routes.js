import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import verifyjwt from '../middlewares/auth.middleware.js';
import {uploadvdo, viewcount, likecount, delvdo, sharecount, changethumbnail} from '../controllers/video.controller.js';

let router = express.Router();

router.route('upload').post(verifyjwt, upload.fields([{name : 'vdo'}, {name : 'thumbnail'}]), uploadvdo);
router.route('/:id/view').put(viewcount);
router.route('/:id/like').put(verifyjwt, likecount);
router.route('/:id/share').put(verifyjwt, sharecount);
router.route('/:id/delete').delete(verifyjwt, delvdo);
router.route('/:id/changethumbnail').put(verifyjwt, upload.single('thumbnail'), changethumbnail);

export default router;
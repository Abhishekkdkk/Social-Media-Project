import express from 'express';
import verifyjwt from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
import {uploadpost, likecount, unlike, sharecount, delpost, addcomment, delcomment, editcomment, edittxt} from '../controllers/post.controller.js';

const router = express.Router();

router.route('/upload').post(verifyjwt, upload.array('images'), uploadpost);
router.route('/:id/like').put(verifyjwt, likecount);
router.route('/:id/unlike').put(verifyjwt, unlike);
router.route('/:id/share').put(verifyjwt, sharecount);
router.route('/:id/delete').delete(verifyjwt, delpost);
router.route('/:id/edittext').put(verifyjwt, edittxt);
router.route('/:id/comment').post(verifyjwt, addcomment);
router.route('/:postid/comment/:cmtid').delete(verifyjwt, delcomment);
router.route ('/:postid/comment/:cmtid').put(verifyjwt, editcomment);


export default router;
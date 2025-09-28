import express from 'express';
import verifyjwt from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
import {uploadimg, likecount, sharecount, delimg} from '../controllers/image.controller.js';

const router = express.Router();

router.route('upload').post(verifyjwt, upload.array('images'), uploadimg);
router.route('/:id/like').put(verifyjwt, likecount);
router.route('/:id/share').put(verifyjwt, sharecount);
router.route('/:id/delete').delete(verifyjwt, delimg);

export default router;
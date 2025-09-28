import express from 'express';
import verifyjwt from '../middlewares/auth.middleware.js';
import {uploadtxt, likecount, sharecount, deltxt, edittxt} from '../controllers/text.controller.js';

const router = express.Router();

router.route('upload').post(verifyjwt, uploadtxt);
router.route('/:id/like').put(verifyjwt, likecount);
router.route('/:id/share').put(verifyjwt, sharecount);
router.route('/:id/delete').delete(verifyjwt, deltxt);
router.route('/:id/edit').put(verifyjwt, edittxt);

export default router;
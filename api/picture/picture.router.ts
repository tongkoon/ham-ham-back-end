import express from 'express';
import { upload } from '../constant';
import { findAllPicture, findPictureByPid, findPictureByUid, randomPicture, uploadPicture } from './picture.controller';
export const router = express.Router();

// /picture
router.get('/',findAllPicture);
router.get('/pid/:pid',findPictureByPid);
router.get('/uid/:uid',findPictureByUid);
router.get('/random',randomPicture)

router.post('/upload', upload.single('picture'),uploadPicture);

export default router;